from django.urls import path
from community.views import ShowUsersWhileCreateCommunity,CreateCommunityView,GetMyCommunityView,PendingCommunityInvitesView,CommunityInvitationResponseView,PendingAdminJoinRequestView,CancelAdminJoinRequestView,GetCommunityListAPIView,JoinCommunityView

urlpatterns = [
    # Authentication urls
    path('get-users-create-community/', ShowUsersWhileCreateCommunity.as_view(), name='all-users-except-self-admin'),
    #======== Create community urls =============#
    path('create-community/',CreateCommunityView.as_view(),name='create-community'),
    #======== for My-community section ===========# 
    path('get-my-communities/',GetMyCommunityView.as_view(),name='get-my-communities'),

    ############## pending request sended to user from admins #################
    #============ pending request from community to a user ===========================#
    path('pending-community-invites/',PendingCommunityInvitesView.as_view(),name='pending-community-invites'),
    #============ accept or igonore  pending request from community to a user ===================# 
    path('respond/', CommunityInvitationResponseView.as_view(), name='community-invitation-respond'),

    ############## pending request status is user accepted or not (Admin can know how many users are accepted the request) #################
    #============ pending request status amdin send to user ===========================#
    path('pending-admin-join-request/', PendingAdminJoinRequestView.as_view(), name='pending-admin-join-request'),
    #===============  admin can cancell the request =================# 
    path('cancel-request/', CancelAdminJoinRequestView.as_view(), name='cancel-admin-join-request'),

    ############# get all communities ##################
    path('get-communities/', GetCommunityListAPIView.as_view(), name='get-communities'),
    ############# request to join a community  ###############
    path('join-community/<int:community_id>/', JoinCommunityView.as_view(), name='join-community'),
]