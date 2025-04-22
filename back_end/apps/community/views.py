
from os import read
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated,AllowAny
from django.contrib.auth import get_user_model

from community.serializers import UserMinimalSerializer
from rest_framework.response import Response
# for pagination set up
from rest_framework.pagination import PageNumberPagination
from django.db.models import Q
# create community
from rest_framework import generics, permissions, status
from community.serializers import CommunitySerializer, GetMyCommunitySerializer,CommunityInviteSerializer,CommunityInvitationResponseSerializer
# get community data
from community.serializers import GetMyCommunitySerializer
from community.models import CommunityMembership
#imports from the custom named app
from apps.common.pagination import CustomUserPagination 
from django.utils import timezone
#import for the admin send request to user section 
from community.serializers import CommunityWithPendingUsersSerializer
from community.models import Community
from rest_framework.exceptions import NotFound
from .serializers import CommunityMembershipSerializer
from rest_framework.generics import UpdateAPIView

############### get the Usermodel ##################

User = get_user_model()

# Community creation View part ##########################3

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
#======================  Pending community invites to a specific uses View ============================# 
class PendingCommunityInvitesView(APIView):
    permission_classes=[IsAuthenticated]

    def get(self,request):
        user = request.user 
        print(f"User: {user}")
        pending_invites = CommunityMembership.objects.filter(user=user,status='pending')
        print(f"Pending count: {pending_invites.count()}")
        for invite in pending_invites:
            print(f"Invite: {invite.community.name}, Status: {invite.status}")
        
        serializer = CommunityInviteSerializer(pending_invites,many=True)
        return Response(serializer.data)

#================== Pending community response from user accept or ignore =============================# 

class CommunityInvitationResponseView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, *args, **kwargs):
        serializer = CommunityInvitationResponseSerializer(data=request.data, context={'request': request})
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
#======================  View for admin can know how man users are not accept the request that send while community creation ============================# 

class PendingAdminJoinRequestView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        communities = Community.objects.filter(memberships__user=request.user,memberships__is_admin=True).order_by('-created_at')
        if not communities.exists():
            return Response({"detail": "No communities found."}, status=404)

        serializer = CommunityWithPendingUsersSerializer(communities, many=True)
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