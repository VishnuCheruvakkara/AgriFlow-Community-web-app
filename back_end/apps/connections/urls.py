from django.urls import path
from connections.views import GetSuggestedFarmersView,SendConnectionRequestView,GetSentConnectionRequestsView,CancelConnectionRequestView

urlpatterns = [
    ##############  Get all of the suggested farmers on the user side to connect and grow  #####################
    path('get-suggested-farmers/', GetSuggestedFarmersView.as_view(), name='get-suggested-farmers'),

    ##################  Pending request section ################### 
    #=============== Send connection request to the user =====================#
    path('send-connection-request/', SendConnectionRequestView.as_view(), name='send-request'),

    #============== Get users in the Request you send section ================#
    path('get-sent-requests/', GetSentConnectionRequestsView.as_view(), name='get-sent-requests'),

    #================ Cancell the connection request ========================#
    path('cancel-request/<int:pk>/', CancelConnectionRequestView.as_view(), name='cancel-request'),

    
]