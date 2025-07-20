from django.urls import path
from community.views import ShowUsersWhileCreateCommunity,CreateCommunityView,GetMyCommunityView,PendingCommunityInvitesView,CommunityInvitationResponseView,PendingAdminJoinRequestView,CancelAdminJoinRequestView,GetCommunityListAPIView,JoinCommunityView,OutgoingRequestsView,CancelJoinRequestView,IncomingMembershipRequestsView,UpdateMembershipRequestView,GetCommunityDetailsWithUsers,AddMembersToCommunity,RemoveMemberAPIView,MakeAdminAPIView,RevokeAdminAPIView,SoftDeleteCommunityAPIView,UserLeaveCommunityView,EditCommunityDetailsView,CommunityMessageListView,CloudinaryUploadView,GetAllCommunityAdminSide,CommunityDetailsAdminAPIView,ToggleProductDeleteStatusView

urlpatterns = [
    # Basic community operations
    path('get-users-create-community/', ShowUsersWhileCreateCommunity.as_view(), name='all-users-except-self-admin'),
    path('create-community/',CreateCommunityView.as_view(),name='create-community'),
    path('get-my-communities/',GetMyCommunityView.as_view(),name='get-my-communities'),

    # Community invites sent to users
    path('pending-community-invites/',PendingCommunityInvitesView.as_view(),name='pending-community-invites'),
    path('respond/', CommunityInvitationResponseView.as_view(), name='community-invitation-respond'),

    # Admin join request handling
    path('pending-admin-join-request/', PendingAdminJoinRequestView.as_view(), name='pending-admin-join-request'),
    path('cancel-request/', CancelAdminJoinRequestView.as_view(), name='cancel-admin-join-request'),

    # User joining community (request to admin)
    path('requested-join-community/', OutgoingRequestsView.as_view(), name='outgoing_requests'),
    path('cancel-join-request/<int:community_id>/', CancelJoinRequestView.as_view(), name='cancel-join-request'),

    # Admin handles incoming join requests
    path('incoming-requests/', IncomingMembershipRequestsView.as_view(), name='incoming-requests'),
    path('update-community/<int:community_id>/membership/<str:username>/update/', UpdateMembershipRequestView.as_view(), name='update-membership-status'),

    # Community listings
    path('get-communities/', GetCommunityListAPIView.as_view(), name='get-communities'),
    path('join-community/<int:community_id>/', JoinCommunityView.as_view(), name='join-community'),
    path('get-communities/<int:id>/',GetCommunityDetailsWithUsers.as_view(), name='community_detail'),

    # Membership management
    path('add-members/', AddMembersToCommunity.as_view(), name='add_members_to_community'),  # Handles POST body data
    path('remove-member/', RemoveMemberAPIView.as_view(), name='remove-member'),
    path('make-admin/', MakeAdminAPIView.as_view(), name='make-admin'),
    path('revoke-admin-privileges/', RevokeAdminAPIView.as_view(), name='revoke-admin-privileges'),

    # Community lifecycle actions
    path('soft-delete-community/', SoftDeleteCommunityAPIView.as_view(), name='soft_delete_community'),
    path('user-leave-community/', UserLeaveCommunityView.as_view(), name='leave-community'),
    path('edit-community-details/<int:pk>/', EditCommunityDetailsView.as_view(), name='edit-community'),

    # Community messages and uploads
    path('get-community-messages/<int:community_id>/', CommunityMessageListView.as_view(), name='get-community-messages'),
    path("community-chat-media-upload/", CloudinaryUploadView.as_view(), name="cloudinary-upload"),

    # Admin-side management
    path("admin/get-all-community/",GetAllCommunityAdminSide.as_view(),name="get-all-community-admin-side"),
    path("admin/get-community-details/<int:pk>/", CommunityDetailsAdminAPIView.as_view(), name="admin-community-details"),
    path("admin/toggle-delete-status/<int:communityId>/",ToggleProductDeleteStatusView.as_view(),name="toggle-delete-status")
]
