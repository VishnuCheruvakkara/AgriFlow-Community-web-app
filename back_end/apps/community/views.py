
from os import read
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated, AllowAny
from django.contrib.auth import get_user_model

from community.serializers import UserMinimalSerializer
from rest_framework.response import Response
# for pagination set up
from rest_framework.pagination import PageNumberPagination
from django.db.models import Q
# create community
from rest_framework import generics, permissions, status
from community.serializers import CommunitySerializer, GetMyCommunitySerializer, CommunityInviteSerializer, CommunityInvitationResponseSerializer, GetCommunitySerializer, CommunityMembershipRequestSerializer, CommunityWithRequestsSerializer, CommunityMembershipStatusUpdateSerializer,CommunityDeatilsSerializer
# get community data
from community.serializers import GetMyCommunitySerializer
from community.models import CommunityMembership
# imports from the custom named app
from apps.common.pagination import CustomCommunityPagination, CustomUserPagination
from django.utils import timezone
# import for the admin send request to user section
from community.serializers import CommunityWithPendingUsersSerializer
from community.models import Community
from rest_framework.exceptions import NotFound
from .serializers import CommunityMembershipSerializer
from rest_framework.generics import UpdateAPIView
from django.utils.timezone import now
# import nodification model
from notifications.models import Notification
# import common image getter of cloudinary from common app
from apps.common.cloudinary_utils import generate_secure_image_url
from django.shortcuts import get_object_or_404


############### get the Usermodel ##################

User = get_user_model()

# Community creation View part ##########################

# ==================== get user data for community creation : To shwo in the modal


class ShowUsersWhileCreateCommunity(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        current_user = request.user
        # To get hte search value from the query params
        search_query = request.GET.get("search", "")
        users = User.objects.exclude(id=current_user.id).exclude(
            is_superuser=True).filter(is_active=True, is_aadhar_verified=True)
        if search_query:
            users = users.filter(
                Q(username__icontains=search_query) |
                Q(address__location_name__icontains=search_query)
            )
        paginator = CustomUserPagination()
        result_page = paginator.paginate_queryset(users, request)
        serializer = UserMinimalSerializer(result_page, many=True)
        return paginator.get_paginated_response(serializer.data)

# ===============================  Create community View =====================================#


class CreateCommunityView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, *args, **kwargs):
        print("Arived data from front end ::: ", request.data)
        serializer = CommunitySerializer(
            data=request.data, context={'request': request})
        print("Serializer data ::: ", serializer)
        if serializer.is_valid():
            print("Valid data ::: ", serializer.validated_data)
            serializer.save()
            return Response({"message": "Community created successfully"}, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


# ===============================  Get My community View =================================#

class GetMyCommunityView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        search_query = request.GET.get("search", "")
        user = request.user

        memberships = CommunityMembership.objects.filter(
            user=user,
            status='approved'
        ).select_related('community')

        if search_query:
            memberships = memberships.filter(
                Q(community__name__icontains=search_query) |
                Q(community__description__icontains=search_query)
            )

        paginator = CustomUserPagination()
        result_page = paginator.paginate_queryset(memberships, request)
        serializer = GetMyCommunitySerializer(result_page, many=True)
        return paginator.get_paginated_response(serializer.data)


####################################  Pending request section (Community section part)  ########################

######################## part - 1 (Community Invitation Section) ############################
# ======================  Pending community invites to a specific uses View ============================#
class PendingCommunityInvitesView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        print(f"User: {user}")
        pending_invites = CommunityMembership.objects.filter(
            user=user, status='pending')
        print(f"Pending count: {pending_invites.count()}")
        for invite in pending_invites:
            print(f"Invite: {invite.community.name}, Status: {invite.status}")

        serializer = CommunityInviteSerializer(pending_invites, many=True)
        return Response(serializer.data)

# ================== Pending community response from user accept or ignore =============================#


class CommunityInvitationResponseView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, *args, **kwargs):
        serializer = CommunityInvitationResponseSerializer(
            data=request.data, context={'request': request})
        if serializer.is_valid():
            membership = serializer.validated_data['membership']
            action = serializer.validated_data['action']

            if action == 'accept':
                membership.status = 'approved'
                membership.joined_at = timezone.now()
                membership.approved_by = request.user  # Optional: usually the inviter
                membership.save()
                return Response({'detail': 'Invitation accepted.'}, status=status.HTTP_200_OK)

            elif action == 'ignore':
                membership.status = 'ignored'
                membership.save()
                return Response({'detail': 'Invitation ignored.'}, status=status.HTTP_200_OK)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


######################## part - 2 ( Admin Approvals section ) ############################
# ======================  View for admin can know how man users are not accept the request that send while community creation ============================#

class PendingAdminJoinRequestView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        communities = Community.objects.filter(
            memberships__user=request.user, memberships__is_admin=True).order_by('-created_at')
        if not communities.exists():
            return Response({"detail": "No communities found."}, status=404)

        serializer = CommunityWithPendingUsersSerializer(
            communities, many=True)
        return Response(serializer.data)


class CancelAdminJoinRequestView(UpdateAPIView):
    serializer_class = CommunityMembershipSerializer
    queryset = CommunityMembership.objects.all()

    def get_object(self):
        """
        This method will retrieve the CommunityMembership object based on the user_id and community_id.
        If not found, a NotFound exception will be raised.
        """
        user_id = self.request.data.get('user_id')
        community_id = self.request.data.get('community_id')

        try:
            return CommunityMembership.objects.get(user_id=user_id, community_id=community_id)
        except CommunityMembership.DoesNotExist:
            raise NotFound(detail="Membership not found.")

    def patch(self, request, *args, **kwargs):
        """
        Cancel the community membership request by setting the status to 'cancelled'
        and adding a message with the admin name.
        """
        membership = self.get_object()

        admin_user = request.user
        admin_name = admin_user.username  # or admin_user.get_full_name() if you prefer

        # Update membership fields
        membership.status = 'cancelled'
        membership.message = f"Request cancelled by admin: {admin_name}"
        membership.save()

        return Response(
            {'message': f'Request cancelled successfully by {admin_name}.'},
            status=status.HTTP_200_OK
        )


######################## part - 3 ( user sended request section | Outgoing request to other community admin  ) ############################
# ======================  View for user can know hwo many request done to all other community ============================#

class OutgoingRequestsView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user

        # Get 'requested' community memberships
        memberships = CommunityMembership.objects.filter(
            user=user,
            status='requested'
        ).select_related('community')

        data = []

        for membership in memberships:
            community = membership.community

            # Get the latest notification for this community and user
            notification = Notification.objects.filter(
                community=community,
                recipient=user
            ).order_by('-created_at').first()

            data.append({
                "community_id": community.id,
                "community_name": community.name,
                "community_logo": generate_secure_image_url(community.community_logo) if community.community_logo else None,
                "sent_at": notification.created_at if notification else None,
            })

        return Response(data)

# =========================  Cancel the request (user can cancell the request to join  a community ) ======================#


class CancelJoinRequestView(APIView):
    permission_classes = [IsAuthenticated]

    def patch(self, request, community_id):
        user = request.user

        # Get the CommunityMembership object
        membership = get_object_or_404(
            CommunityMembership,
            user=user,
            community__id=community_id,
            status='requested'  # Only cancel if the status is "requested"
        )

        # Update the status to "cancelled"
        membership.status = 'cancelled'
        membership.save()

        # Find and update related notifications
        notifications = Notification.objects.filter(
            community=membership.community,
            recipient=user,
            notification_type='request'  # Corrected field name
        )

        for notification in notifications:
            notification.status = 'cancelled'
            notification.message = "Your join request to the community has been cancelled."
            notification.save()

        return Response({"detail": "Join request cancelled and notification updated."}, status=status.HTTP_200_OK)

###########################  part-4  user requested for admin aproval to join a community ######################

# ======================= get the data to shwo the users who requested to join the community (admin can aprove or reject) ==========================#


class IncomingMembershipRequestsView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        # Get all communities where current user is admin
        communities = Community.objects.filter(
            memberships__user=request.user,
            memberships__is_admin=True,
            memberships__community__memberships__status='requested'
        ).distinct()

        # Serialize those communities along with requested users
        serializer = CommunityWithRequestsSerializer(communities, many=True)
        return Response(serializer.data)

# ==================== cancell the request =========================#


class UpdateMembershipRequestView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def patch(self, request, community_id, username):
        community = get_object_or_404(Community, id=community_id)

        # Ensure request.user is an admin of this community
        is_admin = CommunityMembership.objects.filter(
            user=request.user, community=community, is_admin=True, status='approved'
        ).exists()

        if not is_admin:
            return Response({'detail': 'You do not have permission to perform this action.'},
                            status=status.HTTP_403_FORBIDDEN)

        # Get the membership object for the requested user
        target_membership = get_object_or_404(
            CommunityMembership,
            community=community,
            user__username=username,
            status='requested'
        )

        serializer = CommunityMembershipStatusUpdateSerializer(
            target_membership, data=request.data, partial=True)

        if serializer.is_valid():
            serializer.save(approved_by=request.user)
            return Response({'detail': f'Membership {serializer.data["status"]} successfully.'})
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


##################### Get all communities in the user side #####################

class GetCommunityListAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        try:
            search_query = request.GET.get('search', '')

            # Get communities where the current user is NOT a member
            excluded_community_ids = CommunityMembership.objects.filter(
                user=request.user,
                status__in=['pending', 'approved', 'requested']
            ).values_list('community_id', flat=True)

            communities = Community.objects.filter(
                Q(name__icontains=search_query) | Q(
                    description__icontains=search_query),
                is_deleted=False
            ).exclude(id__in=excluded_community_ids)

            paginator = CustomCommunityPagination()
            paginated_communities = paginator.paginate_queryset(
                communities, request)
            serializer = GetCommunitySerializer(
                paginated_communities, many=True)
            return paginator.get_paginated_response(serializer.data)

        except Exception as e:
            return Response({'error': 'Something went wrong', 'details': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


#########################  request to join a community ######################

class JoinCommunityView(APIView):
    permission_classes = [IsAuthenticated]

    def patch(self, request, community_id):
        user = request.user
        try:
            community = Community.objects.get(
                pk=community_id, is_deleted=False)
        except Community.DoesNotExist:
            return Response({"detail": "Community not found."}, status=status.HTTP_404_NOT_FOUND)

        # Determine membership status
        status_choice = 'requested' if community.is_private else 'approved'
        joined_time = now() if status_choice == 'approved' else None

        # Check if membership exists
        existing_membership = CommunityMembership.objects.filter(
            user=user,
            community=community,
        ).first()

        if existing_membership:
            existing_membership.status = status_choice
            existing_membership.joined_at = joined_time
            existing_membership.save()
            membership = existing_membership  # Unify for use below
        else:
            membership = CommunityMembership.objects.create(
                user=user,
                community=community,
                status=status_choice,
                joined_at=joined_time
            )

        #  Always create notification
        try:
            notification = Notification.objects.create(
                recipient=user,
                sender=None,
                community=community,
                notification_type="community_request",
                message=(
                    f"You have {'requested to join' if status_choice == 'requested' else 'joined'} "
                    f"the community '{community.name}'."
                )
            )

        except Exception as e:
            print(" Error creating notification:", str(e))

        serializer = CommunityMembershipRequestSerializer(membership)
        return Response(serializer.data, status=status.HTTP_200_OK if existing_membership else status.HTTP_201_CREATED)

#################### Get community details and users in the communitydetails section #################### 

class GetCommunityDetailsWithUsers(APIView):
    """
    Custom API View to retrieve a community with its members.
    """

    def get(self,rquest,id):
        try:
            community = Community.objects.get(id=id)
            serializers = CommunityDeatilsSerializer(community)
            return Response(serializers.data,status=status.HTTP_200_OK)
        except Community.DoesNotExist:
            return Response({"detail" : "Community not found ?"},status=status.HTTP_404_NOT_FOUND)