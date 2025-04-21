from django.urls import path
from community.views import ShowUsersWhileCreateCommunity,CreateCommunityView,GetMyCommunityView,PendingCommunityInvitesView,CommunityInvitationResponseView

urlpatterns = [
    # Authentication urls
    path('get-users-create-community/', ShowUsersWhileCreateCommunity.as_view(), name='all-users-except-self-admin'),
    #======== Create community urls =============#
    path('create-community/',CreateCommunityView.as_view(),name='create-community'),
    #======== for My-community section ===========# 
    path('get-my-communities/',GetMyCommunityView.as_view(),name='get-my-communities'),

    ############## pending request part #################
    #============ pending request from community to a user ===========================#
    path('pending-community-invites/',PendingCommunityInvitesView.as_view(),name='pending-community-invites'),
    #============ accept or igonore  pending request from community to a user ===================# 
    path('respond/', CommunityInvitationResponseView.as_view(), name='community-invitation-respond'),
]