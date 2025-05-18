from django.urls import path
from connections.views import GetSuggestedFarmersView,SendConnectionRequestView

urlpatterns = [
    ##############  Get all of the suggested farmers on the user side to connect and grow  #####################
    path('get-suggested-farmers/', GetSuggestedFarmersView.as_view(), name='get-suggested-farmers'),

    ############# Send connection request to the user ##################
    path('send-connection-request/', SendConnectionRequestView.as_view(), name='send-request'),

]