from django.urls import path
from events.views import GetCommunityForCreateEvent,CommunityEventCreateAPIView, GetAllCommunityEventsView

urlpatterns = [
    ##############  Get community in the event creation section (only get the community where user is admin ) #################
    path('get-community-create-event/', GetCommunityForCreateEvent.as_view(), name='get-community-create-event'),

    ############### Crete Event url ################## 
    path('create-new-event/', CommunityEventCreateAPIView.as_view(), name='create-event'),

    ##############  get all Events ###############
    path('get-all-events/', GetAllCommunityEventsView.as_view(), name='get_all_events'),

]