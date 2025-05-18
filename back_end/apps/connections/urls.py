from django.urls import path
from connections.views import GetSuggestedFarmersView,SendConnectionRequestView,GetSentConnectionRequestsView,CancelConnectionRequestView,ReceivedConnectionRequestsView,AcceptConnectionRequestAPIView,RejectConnectionRequestView

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
]