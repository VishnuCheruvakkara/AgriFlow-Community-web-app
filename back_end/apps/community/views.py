
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


from channels.layers import get_channel_layer
from asgiref.sync import async_to_sync
from django.utils.timezone import now


class CreateCommunityView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, *args, **kwargs):
        serializer = CommunitySerializer(data=request.data, context={'request': request})

        if serializer.is_valid():
            community = serializer.save()
            user = request.user
            member_ids = request.data.get('members', [])
            channel_layer = get_channel_layer()

            # Common details
            sender_profile = {
                "id": user.id,
                "name": user.username,
                "profile_picture": user.profile.profile_picture.url if hasattr(user, 'profile') and user.profile.profile_picture else None,
            }

            for uid in member_ids:
                notification_data = {
                    "community": community.id,
                    "community_name": community.name,
                    "community_logo": community.community_logo.url if community.community_logo else None,
                    "id": community.id,
                    "invited_by": sender_profile,
                    "message": f"{user.username} invited you to join the community '{community.name}'.",
                    "invited_on": now().isoformat()
                }

                async_to_sync(channel_layer.group_send)(
                    f"user_{uid}",
                    {
                        "type": "send_notification",
                        "data": notification_data
                    }
                )

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
