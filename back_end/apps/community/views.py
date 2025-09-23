from os import read
import logging
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated, AllowAny,IsAdminUser
from django.contrib.auth import get_user_model
from community.serializers import UserMinimalSerializer
from rest_framework.response import Response
from rest_framework.pagination import PageNumberPagination
from django.db.models import Q
from rest_framework import generics, permissions, status
from community.serializers import CommunitySerializer, GetMyCommunitySerializer, CommunityInviteSerializer, CommunityInvitationResponseSerializer, GetCommunitySerializer, CommunityMembershipRequestSerializer, CommunityWithRequestsSerializer, CommunityMembershipStatusUpdateSerializer, CommunityDeatilsSerializer, CommunityEditSerializer,CommunityMessageSerializer, SimpleCommunityAdminSerializer,CommunityAdmiSideDetailsSerializer
from community.serializers import GetMyCommunitySerializer
from community.models import CommunityMembership,CommunityMessage
from apps.common.pagination import CustomCommunityPagination, CustomUserPagination,CustomAdminCommunityPagination
from django.utils import timezone
from community.serializers import CommunityWithPendingUsersSerializer
from community.models import Community
from rest_framework.exceptions import NotFound,APIException
from .serializers import CommunityMembershipSerializer
from rest_framework.generics import UpdateAPIView
from django.utils.timezone import now
from notifications.models import Notification
from apps.common.cloudinary_utils import generate_secure_image_url,upload_to_cloudinary  
from django.shortcuts import get_object_or_404
from django.core.exceptions import PermissionDenied
from rest_framework.parsers import MultiPartParser
from django.core.exceptions import ValidationError
from apps.notifications.utils import create_and_send_notification

User = get_user_model()
logger=logging.getLogger(__name__)

class ShowUsersWhileCreateCommunity(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        try:
            current_user = request.user
            search_query = request.GET.get("search", "")
            community_id = request.GET.get("community_id")

            users = User.objects.exclude(id=current_user.id).exclude(
                is_superuser=True).filter(is_active=True, is_aadhar_verified=True)

            # Exclude users already part of the specified community
            if community_id:
                community = Community.objects.filter(id=community_id).first()
                if community:
                    # Get IDs of users who have any kind of membership in the community
                    all_member_ids = community.memberships.values_list('user__id', flat=True)
                    # Get the list of users who have the 'cancelled' status
                    cancelled_member_ids = community.memberships.filter(
                        status='cancelled').values_list('user__id', flat=True)

                    # Include only the users who have the 'cancelled' status (exclude all other users)
                    users = users.filter(Q(id__in=cancelled_member_ids) | ~Q(id__in=all_member_ids))

            if search_query:
                users = users.filter(
                    Q(username__icontains=search_query) |
                    Q(address__location_name__icontains=search_query)
                )
            paginator = CustomUserPagination()
            result_page = paginator.paginate_queryset(users, request)
            serializer = UserMinimalSerializer(result_page, many=True)
            return paginator.get_paginated_response(serializer.data)
        except Exception as e:
            logger.error(f"Error in ShowUsersWhileCreateCommunity: {e}")
            return Response({"error": "Something went wrong"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        
# Create community View 
class CreateCommunityView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, *args, **kwargs):
        try:
            serializer = CommunitySerializer(
                data=request.data, context={'request': request})
            if serializer.is_valid():
                serializer.save()
                return Response({"message": "Community created successfully"}, status=status.HTTP_201_CREATED)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            logger.error(f"Error in CreateCommunityView: {e}",exc_info=True)
            return Response({"error": "Something went wrong"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)    
        
# Get My community View 
class GetMyCommunityView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        try:
            search_query = request.GET.get("search", "")
            user = request.user

            memberships = CommunityMembership.objects.filter(
                user=user,
                status='approved',
                community__is_deleted=False
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
        except Exception as e:
            logger.error(f"Error in GetMyCommunityView: {e}",exc_info=True)
            return Response({"error": "Something went wrong while fetching communities"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

# Pending community invites to a specific users View 
class PendingCommunityInvitesView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        try:
            user = request.user
            pending_invites = CommunityMembership.objects.filter(
                user=user, status='pending',community__is_deleted=False)
            
            serializer = CommunityInviteSerializer(pending_invites, many=True)
            return Response(serializer.data)
        except Exception as e:
            logger.error(f"Error in PendingCommunityInvitesView.get : {e}",exc_info=True)
            return Response({"error": "Something went wrong while fetching pending invites"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

# Pending community response from user accept or ignore 
class CommunityInvitationResponseView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, *args, **kwargs):
        try: 
            serializer = CommunityInvitationResponseSerializer(
                data=request.data, context={'request': request})
            if serializer.is_valid():
                membership = serializer.validated_data['membership']
                action = serializer.validated_data['action']
                community = membership.community
                user = request.user

                if action == 'accept':
                    membership.status = 'approved'
                    membership.joined_at = timezone.now()
                    membership.approved_by = request.user  # Optional: usually the inviter
                    membership.save()

                    # Notify community creator
                    creator = community.created_by
                    message = f"{user.username} accepted your invitation and joined the community '{community.name}'."
                    image_url = generate_secure_image_url(user.profile_picture) if user.profile_picture else None

                    create_and_send_notification(
                        recipient=creator,
                        sender=user,
                        type="community_joined",
                        message=message,
                        community=community,
                        image_url=image_url
                    )

                    return Response({'detail': 'Invitation accepted.'}, status=status.HTTP_200_OK)

                elif action == 'ignore':
                    membership.status = 'ignored'
                    membership.save()
                    return Response({'detail': 'Invitation ignored.'}, status=status.HTTP_200_OK)

            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            logger.error(f"Error in CommunityInvitationResponseView.post : {e}",exc_info=True)
            return Response({"error": "Something went wrong while processing the invitation response"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

# View for admin can know how man users are not accept the request that send while community creation
class PendingAdminJoinRequestView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        try:
            communities = Community.objects.filter(
                memberships__user=request.user, memberships__is_admin=True, is_deleted=False ).order_by('-created_at')
            if not communities.exists():
                return Response({"detail": "No communities found."}, status=404)

            serializer = CommunityWithPendingUsersSerializer(
                communities, many=True)
            return Response(serializer.data)
        except Exception as e:
            logger.error(f"Error in PendingAdminJoinRequestView.get: {e}", exc_info=True)
            return Response(
                {"detail": "Something went wrong while fetching communities."},
                status=500
            )

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
        except Exception as e:
            logger.error(f"Error retrieving membership: {e}", exc_info=True)
            raise APIException(detail="An error occurred while retrieving the membership.")

    def patch(self, request, *args, **kwargs):
        """
        Cancel the community membership request by setting the status to 'cancelled'
        and adding a message with the admin name.
        """
        try:
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
        except NotFound as e:
            logger.error(f"Error cancelling membership: {e}", exc_info=True)
            return Response(
                {"detail": "Something went wrong while cancelling the membership."},
                status=500
            )

# View for user can know hwo many request done to all other community 
class OutgoingRequestsView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        try:
            user = request.user

            # Get 'requested' community memberships
            memberships = CommunityMembership.objects.filter(
                user=user,
                status='requested',
                community__is_deleted=False
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
        except Exception as e:
            logger.error(f"Error in OutgoingRequestsView.get: {e}", exc_info=True)
            return Response(
                {"detail": "Something went wrong while fetching outgoing requests."},
                status=500
            )


# Cancel the request (user can cancell the request to join  a community )
class CancelJoinRequestView(APIView):
    permission_classes = [IsAuthenticated]

    def patch(self, request, community_id):
        try:
            user = request.user

            # Get the CommunityMembership object
            membership = get_object_or_404(
                CommunityMembership,
                user=user,
                community__id=community_id,
                status='requested'  
            )

            # Update the status to "cancelled"
            membership.status = 'cancelled'
            membership.save()

            # Find and update related notifications
            notifications = Notification.objects.filter(
                community=membership.community,
                recipient=user,
                notification_type='request'  
            )

            for notification in notifications:
                notification.status = 'cancelled'
                notification.message = "Your join request to the community has been cancelled."
                notification.save()

            return Response({"detail": "Join request cancelled and notification updated."}, status=status.HTTP_200_OK)
        except Exception as e:
            logger.error(f"Error in CancelJoinRequestView.patch: {e}", exc_info=True)
            return Response(
                {"detail": "Something went wrong while cancelling the join request."},
                status=500
            )
        
# get the data to shwo the users who requested to join the community (admin can aprove or reject) 
class IncomingMembershipRequestsView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        try:
            # Get all communities where current user is admin
            communities = Community.objects.filter(
                memberships__user=request.user,
                memberships__is_admin=True,

                memberships__community__memberships__status='requested',
                is_deleted = False,
            ).distinct()

            # Serialize those communities along with requested users
            serializer = CommunityWithRequestsSerializer(communities, many=True)
            return Response(serializer.data)
        except Exception as e:
            logger.error(f"Error in IncomingMembershipRequestsView.get: {e}", exc_info=True)
            return Response(
                {"detail": "Something went wrong while fetching incoming requests."},
                status=500
            )
        
# accept or reject the request  | requested by the user to admin 
class UpdateMembershipRequestView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def patch(self, request, community_id, username):
        try:
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
                status_value = serializer.validated_data.get("status")
                # Save status and set approved_by
                serializer.save(approved_by=request.user)
                # Send notification only if approved
                if status_value == 'approved':
                    recipient = target_membership.user
                    sender = request.user
                    community_logo_url = generate_secure_image_url(community.community_logo)

                    create_and_send_notification(
                        recipient=recipient,
                        sender=sender,
                        type='community_request_approved_by_admin',  # Use a specific type
                        message=f"Your request to join '{community.name}' was approved!",
                        community=community,
                        image_url=community_logo_url
                    )
                return Response({'detail': f'Membership {serializer.data["status"]} successfully.'})
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            logger.error(f"Error in UpdateMembershipRequestView.patch: {e}", exc_info=True)
            return Response(
                {"detail": "Something went wrong while updating the membership request."},
                status=500
            )
        
# Get all communities in the user side (Discover Community section ) 
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


# request to join a community
class JoinCommunityView(APIView):
    permission_classes = [IsAuthenticated]

    def patch(self, request, community_id):
        user = request.user
        try:
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

            # Notify the community admin
            admin_user = community.created_by

            # Determine the type and message
            if status_choice == "approved":
                notification_type = "community_joined"
                message = f"{user.username} has joined your community '{community.name}'."
            else:
                notification_type = "community_join_request_received"
                message = f"{user.username} has requested to join your private community '{community.name}'."

            # Generate secure image URL from Cloudinary if available
            image_url = generate_secure_image_url(user.profile_picture) if user.profile_picture else None
            
            # Create and send notification
            create_and_send_notification(
                recipient=admin_user,
                sender=user,
                type=notification_type,
                message=message,
                community=community,
                image_url=image_url
            )

        
            serializer = CommunityMembershipRequestSerializer(membership)
            return Response(serializer.data, status=status.HTTP_200_OK if existing_membership else status.HTTP_201_CREATED)
        except Exception as e:
            logger.error(f"Error in JoinCommunityView.patch: {e}", exc_info=True)
            return Response({"detail": "Something went wrong while processing your request."}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        
# Get community details and users in the communitydetails section  
class GetCommunityDetailsWithUsers(APIView):
    """
    Custom API View to retrieve a community with its members.
    """

    def get(self, request, id):
        try:
            community = Community.objects.get(id=id)
            serializers = CommunityDeatilsSerializer(community,context={'request':request})
            return Response(serializers.data, status=status.HTTP_200_OK)
        except Community.DoesNotExist:
            logger.warning(f"Community with id {id} not found")
            return Response({"detail": "Community not found ?"}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            logger.error(f"Unexpected error in GetCommunityDetailsWithUsers: {e}", exc_info=True)
            return Response({"detail": "Something went wrong."}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        
# Add new memebers to the communitiy by admin view  
class AddMembersToCommunity(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        try:
            community_id = request.data.get('community_id')
            member_ids = request.data.get('member_ids', [])

            if not community_id or not member_ids:
                return Response({"error": "Community ID and member IDs are required."}, status=status.HTTP_400_BAD_REQUEST)

            community = get_object_or_404(Community, id=community_id)

            # Check if the current user is an admin of the community
            if not community.memberships.filter(user=request.user, is_admin=True).exists():
                raise PermissionDenied(
                    "You must be an admin to add members to this community.")

            # Validate member_ids (ensure users exist)
            members = User.objects.filter(id__in=member_ids)

            memberships = []
            for member in members:
                membership, created = CommunityMembership.objects.update_or_create(
                    user=member,
                    community=community,
                    defaults={
                        'status': 'pending',
                        'is_admin': False,
                    }
                )
                memberships.append({
                    'user': member.id,
                    'community': community.id,
                    'status': membership.status,
                    'is_admin': membership.is_admin,
                })
                
                try:
                    # fetch the image and message 
                    image_url = generate_secure_image_url(community.community_logo)
                    message = f"{request.user.username} invited you to join the community '{community.name}'."

                    # Send notification using your real-time method
                    create_and_send_notification(
                        recipient=member,
                        sender=request.user,
                        type="community_invite",
                        message=message,
                        community=community,
                        image_url=image_url
                    )
                except Exception as e:
                    logger.error(f"Failed to send notification to {member.username}: {e}", exc_info=True)

            return Response(
                {"message": "Members added successfully.", "members": memberships},
                status=status.HTTP_201_CREATED,
            )
        except PermissionDenied as e:
            logger.warning(f"Permission denied: {e}")   
            return Response({"error": str(e)}, status=status.HTTP_403_FORBIDDEN)
        except Exception as e:
            logger.error(f"Error in AddMembersToCommunity: {e}", exc_info=True)
            return Response({"error": "Something went wrong."}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

# Admin can remove the user from the community by making status from membership model into blocked  
class RemoveMemberAPIView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def patch(self, request):
        try:
            community_id = request.data.get("community_id")
            user_id = request.data.get("user_id")

            if not community_id or not user_id:
                return Response({"detail": "community_id and user_id are required"}, status=status.HTTP_400_BAD_REQUEST)

            community = get_object_or_404(Community, id=community_id)
            admin_membership = CommunityMembership.objects.filter(
                community=community,
                user=request.user,
                is_admin=True,
                status='approved'
            ).first()

            if not admin_membership:
                return Response({"detail": "You are not authorized to remove members from this community."}, status=status.HTTP_403_FORBIDDEN)

            member = get_object_or_404(User, id=user_id)

            try:
                membership = CommunityMembership.objects.get(
                    user=member, community=community)

                if membership.is_admin:
                    return Response({"detail": "You cannot remove another admin."}, status=status.HTTP_400_BAD_REQUEST)

                membership.status = 'blocked'
                membership.save()

                return Response({"detail": "Member removed successfully"}, status=status.HTTP_200_OK)

            except CommunityMembership.DoesNotExist:
                return Response({"detail": "Membership not found."}, status=status.HTTP_404_NOT_FOUND)
        
        except Exception as e:
            logger.error(f"Error in RemoveMemberAPIView: {e}", exc_info=True)
            return Response({"detail": "Something went wrong."}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

# Admin of a comunity can make other member as admin 
class MakeAdminAPIView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def patch(self, request, *args, **kwargs):
        try:
            community_id = request.data.get('community_id')
            user_id = request.data.get('user_id')

            if not community_id or not user_id:
                return Response(
                    {'detail': 'Both community_id and user_id are required.'},
                    status=status.HTTP_400_BAD_REQUEST
                )

            current_user = request.user

            # Check if current user is an admin in the community
            try:
                current_membership = CommunityMembership.objects.get(
                    user=current_user, community_id=community_id, status='approved'
                )
            except CommunityMembership.DoesNotExist:
                return Response({'detail': 'You are not a member of this community.'}, status=status.HTTP_403_FORBIDDEN)

            if not current_membership.is_admin:
                return Response({'detail': 'Only admins can promote others.'}, status=status.HTTP_403_FORBIDDEN)

            # Get the target user's membership
            try:
                target_membership = CommunityMembership.objects.get(
                    user_id=user_id, community_id=community_id, status='approved'
                )
            except CommunityMembership.DoesNotExist:
                return Response({'detail': 'User is not an approved member of this community.'}, status=status.HTTP_404_NOT_FOUND)

            if target_membership.is_admin:
                return Response({'detail': 'User is already an admin.'}, status=status.HTTP_400_BAD_REQUEST)

            # Promote to admin
            target_membership.is_admin = True
            target_membership.save()

            return Response({'detail': 'User promoted to admin successfully.'}, status=status.HTTP_200_OK)
        except Exception as e:
            logger.error(f"Error in MakeAdminAPIView: {e}", exc_info=True)
            return Response({'detail': 'Something went wrong.'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        
# Admin can revoke the other user amdin previlage 
class RevokeAdminAPIView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def patch(self, request):
        try:
            community_id = request.data.get('community_id')
            user_id = request.data.get('user_id')

            if not community_id or not user_id:
                return Response({'detail': 'Both community_id and user_id are required.'}, status=status.HTTP_400_BAD_REQUEST)

            current_user = request.user

            # Verify that the current user is an admin in this community
            try:
                current_membership = CommunityMembership.objects.get(
                    user=current_user, community_id=community_id, status='approved'
                )
            except CommunityMembership.DoesNotExist:
                return Response({'detail': 'You are not a member of this community.'}, status=status.HTTP_403_FORBIDDEN)

            if not current_membership.is_admin:
                return Response({'detail': 'Only admins can revoke admin privileges.'}, status=status.HTTP_403_FORBIDDEN)

            # Get target membership
            try:
                target_membership = CommunityMembership.objects.get(
                    user_id=user_id, community_id=community_id, status='approved'
                )
            except CommunityMembership.DoesNotExist:
                return Response({'detail': 'User is not an approved member of this community.'}, status=status.HTTP_404_NOT_FOUND)

            if not target_membership.is_admin:
                return Response({'detail': 'User is not an admin.'}, status=status.HTTP_400_BAD_REQUEST)

            # Prevent revoking privileges from the community creator
            try:
                community = Community.objects.get(id=community_id)
            except Community.DoesNotExist:
                return Response({'detail': 'Community not found.'}, status=status.HTTP_404_NOT_FOUND)

            if community.created_by.id == target_membership.user.id:
                return Response({'detail': 'Cannot revoke admin privileges from the community creator.'}, status=status.HTTP_403_FORBIDDEN)

            # Revoke admin
            target_membership.is_admin = False
            target_membership.save()

            return Response({'detail': 'Admin privileges revoked successfully.'}, status=status.HTTP_200_OK)
        except Exception as e:
            logger.error(f"Error in RevokeAdminAPIView: {e}", exc_info=True)
            return Response({'detail': 'Something went wrong.'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

# Admin can delete all the community and Notify all the other users  
class SoftDeleteCommunityAPIView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def patch(self, request):
        try:
            community_id = request.data.get('community_id')
            user = request.user

            if not community_id:
                return Response({'detail': 'community_id is required.'}, status=status.HTTP_400_BAD_REQUEST)

            try:
                community = Community.objects.get(
                    id=community_id, is_deleted=False)
            except Community.DoesNotExist:
                return Response({'detail': 'Community not found or already deleted.'}, status=status.HTTP_404_NOT_FOUND)

            # Check if the user is an admin of the community
            is_admin = CommunityMembership.objects.filter(
                community=community,
                user=user,
                is_admin=True,
                status='approved'
            ).exists()

            if not is_admin:
                return Response({'detail': 'You are not authorized to delete this community.'}, status=status.HTTP_403_FORBIDDEN)

            # Perform soft delete
            community.is_deleted = True
            community.save()

            # Generate community image URL securely
            image_url = None
            if community.community_logo:
                image_url = generate_secure_image_url(community.community_logo)

            # Notify all members except the admin
            members = CommunityMembership.objects.filter(
                community=community, status='approved').exclude(user=user)

            for member in members:
                message = f'The community "{community.name}" has been deleted by Community Admin.'
                create_and_send_notification(
                    recipient=member.user,
                    sender=user,
                    type='alert',
                    message=message,
                    community=community,
                    image_url=image_url
                )

            return Response({'detail': 'Community soft-deleted and members notified.'}, status=status.HTTP_200_OK)
        except Exception as e:
            logger.error(f"Error in SoftDeleteCommunityAPIView: {e}", exc_info=True)
            return Response({'detail': 'Something went wrong.'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)  
        
# User and non-creator admin  can leave from a community (soft leaving mechanism) 
class UserLeaveCommunityView(APIView):
    permission_classes = [IsAuthenticated]

    def patch(self, request, *args, **kwargs):
        user = request.user
        # Expect community_id in the request body
        community_id = request.data.get('community_id')

        # Validate if community_id is provided
        if not community_id:
            return Response({'error': 'Community ID is required'}, status=status.HTTP_400_BAD_REQUEST)

        # Check if the user is a member of the community
        try:
            membership = CommunityMembership.objects.get(
                user=user, community_id=community_id)
        except CommunityMembership.DoesNotExist:
            raise NotFound(
                "Membership not found for this user in the specified community")

        community = membership.community

        # Prevent the creator from leaving the community
        if community.created_by == user:
            return Response({'error': 'The creator of the community cannot leave.'}, status=status.HTTP_400_BAD_REQUEST)
        
        # Update the status to 'left'
        membership.status = 'left'
        membership.save()

        return Response({'message': 'You have left the community successfully.'}, status=status.HTTP_200_OK)


# creator of a community can edit the name,description and community image View section
class EditCommunityDetailsView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def patch(self, request, pk):
        try:
            community = get_object_or_404(Community, pk=pk)

            # Check if user is creator or admin
            is_creator = request.user == community.created_by
            is_admin_member = CommunityMembership.objects.filter(
                user=request.user,
                community=community,
                is_admin=True,
                status='approved'
            ).exists()

            if not (is_creator or is_admin_member):
                return Response(
                    {"detail": "You are not creator to edit this community."},
                    status=status.HTTP_403_FORBIDDEN
                )

            data = request.data.copy()
            if 'image' in request.FILES:
                data['community_logo'] = request.FILES['image']

            serializer = CommunityEditSerializer(community, data=data, partial=True)
            
            if serializer.is_valid():
                serializer.save()
                return Response({"detail": "Community updated successfully."}, status=status.HTTP_200_OK)

            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            logger.error(f"Error in EditCommunityDetailsView: {e}", exc_info=True)
            return Response({"detail": "Something went wrong."}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)      
        
# View for get the community messages from the table
class CommunityMessageListView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, community_id):
        try:
            try:
                community = Community.objects.get(pk=community_id, is_deleted=False)
            except Community.DoesNotExist:
                return Response({"detail": "Community not found."}, status=status.HTTP_404_NOT_FOUND)

            messages = CommunityMessage.objects.filter(community=community).order_by('timestamp')
            serializer = CommunityMessageSerializer(messages, many=True)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except Exception as e:
            logger.error(f"Error in CommunityMessageListView.get: {e}", exc_info=True)
            return Response({"detail": "Something went wrong while fetching messages."}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        
# View for upload media file into cloudinary  
class CloudinaryUploadView(APIView):
    parser_classes = [MultiPartParser]

    def post(self, request, *args, **kwargs):
        file = request.FILES.get('file')
        folder_name = request.data.get('folder', 'default')

        if not file:
            return Response({'error': 'No file provided.'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            signed_url = upload_to_cloudinary(file, folder_name)
            if signed_url:
                return Response({'url': signed_url}, status=status.HTTP_200_OK)
            else:
                return Response({'error': 'Upload failed.'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        except ValidationError as ve:
            logger.warning(f"Validation error in CloudinaryUploadView: {ve}")
            return Response({'error': str(ve)}, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            logger.error(f"Unexpected error in CloudinaryUploadView: {e}", exc_info=True)
            return Response({'error': 'Something went wrong during upload.'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        
  
# Admin side community management view 

#  Get all communities in the admin side table view 
class GetAllCommunityAdminSide(APIView):
    permission_classes=[IsAdminUser]

    def get(self,request):
        try:
            queryset = Community.objects.all()

            #Search set up 
            search = request.query_params.get("search")
            if search:
                queryset = queryset.filter(
                    Q(name__icontains = search) | 
                    Q(description__icontains = search) 
                )
            
            # Status filter 
            status = request.query_params.get("status")
            if status == "public":
                queryset = queryset.filter(is_private = False)
            elif status == "private":
                queryset = queryset.filter(is_private=True)
            elif status == "deleted":
                queryset = queryset.filter(is_deleted = True)

            # Pagination 
            paginator = CustomAdminCommunityPagination()
            page = paginator.paginate_queryset(queryset,request)

            serializer = SimpleCommunityAdminSerializer(page,many=True)
            return paginator.get_paginated_response(serializer.data)
        except Exception as e:
            logger.error(f"Error in GetAllCommunityAdminSide: {e}", exc_info=True)
            return Response(
                {"detail": "Something went wrong while fetching communities."},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
        
# Community details admin side
class CommunityDetailsAdminAPIView(APIView):
    permission_classes = [IsAdminUser]

    def get(self, request, pk):
        try:
            community = Community.objects.get(pk=pk)
            serializer = CommunityAdmiSideDetailsSerializer(community, context={"request": request})
            return Response(serializer.data, status=status.HTTP_200_OK)
        except Community.DoesNotExist:
            return Response({"detail": "Community not found"}, status=status.HTTP_404_NOT_FOUND)
        
# Toggle community delete status 
class ToggleProductDeleteStatusView(APIView):
    permission_classes= [IsAuthenticated]

    def patch(self,request,communityId):
        try:
            community = get_object_or_404(Community,id=communityId)
            community.is_deleted = not community.is_deleted
            community.save() 

            return Response (  
                {
                "message": f"Product marked as {'deleted' if community.is_deleted else 'available'}.",
                "is_deleted": community.is_deleted,
                },
                status= status.HTTP_200_OK
            )
        except Exception as e:
            logger.error(f"Error in ToggleProductDeleteStatusView: {e}", exc_info=True)
            return Response(
                {"detail": "Something went wrong while updating delete status."},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )