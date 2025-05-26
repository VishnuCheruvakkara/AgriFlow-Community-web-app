from django.urls import path
from community.views import ShowUsersWhileCreateCommunity,CreateCommunityView,GetMyCommunityView,PendingCommunityInvitesView,CommunityInvitationResponseView,PendingAdminJoinRequestView,CancelAdminJoinRequestView,GetCommunityListAPIView,JoinCommunityView,OutgoingRequestsView,CancelJoinRequestView,IncomingMembershipRequestsView,UpdateMembershipRequestView,GetCommunityDetailsWithUsers,AddMembersToCommunity,RemoveMemberAPIView,MakeAdminAPIView,RevokeAdminAPIView,SoftDeleteCommunityAPIView,UserLeaveCommunityView,EditCommunityDetailsView,CommunityMessageListView,CloudinaryUploadView

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

    ############## community join request to admin from a user ###############
    #============= get data to show request that was send and waiting for admin aproval =================#
    path('requested-join-community/', OutgoingRequestsView.as_view(), name='outgoing_requests'),
    #============ user can cancel the request any time ============#
    path('cancel-join-request/<int:community_id>/', CancelJoinRequestView.as_view(), name='cancel-join-request'),
    
    ################ request from users they want to join a community #################
    path('incoming-requests/', IncomingMembershipRequestsView.as_view(), name='incoming-requests'),
    #=============== change status of user request aprove or ignored by community admin =================# 
    path('update-community/<int:community_id>/membership/<str:username>/update/', UpdateMembershipRequestView.as_view(), name='update-membership-status'),

    ############# get all communities ##################
    path('get-communities/', GetCommunityListAPIView.as_view(), name='get-communities'),
    ############# request to join a community  ###############
    path('join-community/<int:community_id>/', JoinCommunityView.as_view(), name='join-community'),

    ######################  get community and the respective users datails ################### 
    path('get-communities/<int:id>/',GetCommunityDetailsWithUsers.as_view(), name='community_detail'),

    ##################### Admin can add new members to the community ######################
    path('add-members/', AddMembersToCommunity.as_view(), name='add_members_to_community'),  # Updated to handle POST body data

    ######################  Admin can remove user from the community ####################### 
    path('remove-member/', RemoveMemberAPIView.as_view(), name='remove-member'),
    
    #################### Admin can make other user/member of a community into admin ###################
    path('make-admin/', MakeAdminAPIView.as_view(), name='make-admin'),

    #################### Admin can revoke the admin previlage of a user #################### 
    path('revoke-admin-privileges/', RevokeAdminAPIView.as_view(), name='revoke-admin-privileges'),
    
    ######################  Admin can delete the community (Softdeletion )
    path('soft-delete-community/', SoftDeleteCommunityAPIView.as_view(), name='soft_delete_community'),

    ##################### User can leave from a community #################### 
    path('user-leave-community/', UserLeaveCommunityView.as_view(), name='leave-community'),

    ################### creator of a community can edit the name,description and community image ##################
    path('edit-community-details/<int:pk>/', EditCommunityDetailsView.as_view(), name='edit-community'),

    ###################  url for get the community messages from the community-message table #########################
    path('get-community-messages/<int:community_id>/', CommunityMessageListView.as_view(), name='get-community-messages'),

    ################### upload media file ######################  
    path("upload-media/", CloudinaryUploadView.as_view(), name="cloudinary-upload"),

]