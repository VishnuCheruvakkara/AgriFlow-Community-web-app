from django.urls import path
from connections.views import GetSuggestedFarmersView,SendConnectionRequestView,GetSentConnectionRequestsView,CancelConnectionRequestView,ReceivedConnectionRequestsView,AcceptConnectionRequestAPIView,RejectConnectionRequestView,GetMyConnectionView,BlockUserView,GetBlockedUsersView,UnblockUserView

urlpatterns = [
    ##############  Get all of the suggested farmers on the user side to connect and grow  #####################
    path('get-suggested-farmers/', GetSuggestedFarmersView.as_view(), name='get-suggested-farmers'),

    ##################  Pending request section ( Requests You Sent ) ################### 
    #=============== Send connection request to the user =====================#
    path('send-connection-request/', SendConnectionRequestView.as_view(), name='send-request'),

    #============== Get users in the Request you send section ================#
    path('get-sent-requests/', GetSentConnectionRequestsView.as_view(), name='get-sent-requests'),

    #================ Cancell the connection request ========================#
    path('cancel-request/<int:pk>/', CancelConnectionRequestView.as_view(), name='cancel-request'),
    
    ##################  Pending request section ( Received Connection Requests ) ################### 
    #================ Get recieved connection requests =====================# 
    path('received-connection-request/', ReceivedConnectionRequestsView.as_view(), name='received-requests'),

    #=================  accept the connection request ============================# 
    path('accept-connection-request/<int:pk>/', AcceptConnectionRequestAPIView.as_view(), name='accept-connection'),

    #================== reject connection request =======================#
    path('reject-connection-request/<int:request_id>/', RejectConnectionRequestView.as_view(), name='reject-connection-request'),

    #################### Get all my connection ##############################
    path('get-my-connections/', GetMyConnectionView.as_view(), name='get-my-connections'),

    ################### block user #######################
    path('block-user/', BlockUserView.as_view(), name='block-user'),

    ################## Get all the blocked users ##################
    path('get-blocked-users/', GetBlockedUsersView.as_view(), name='get-blocked-users'),

    ####################  Unblock user ####################### 
    path('unblock-user/', UnblockUserView.as_view(), name='unblock-user'),
    
]