from django.urls import path
from events.views import GetCommunityForCreateEvent,CommunityEventCreateAPIView, GetAllCommunityEventsView,UserCreatedEventsView,CommunityEventUpdateAPIView,DeleteCommunityEventView,JoinEventAPIView,EnrolledEventsView

urlpatterns = [
    ##############  Get community in the event creation section (only get the community where user is admin ) #################
    path('get-community-create-event/', GetCommunityForCreateEvent.as_view(), name='get-community-create-event'),

    ############### Crete Event url ################## 
    path('create-new-event/', CommunityEventCreateAPIView.as_view(), name='create-event'),

    ##############  get all Events ###############
    path('get-all-events/', GetAllCommunityEventsView.as_view(), name='get_all_events'),

    ############ get Events created by the user ############### 
    path('created-events-by-user/', UserCreatedEventsView.as_view(), name='created-events-by-user'),

    ############# Edit the community event #####################
    path('edit-event/<int:pk>/', CommunityEventUpdateAPIView.as_view(), name='event-update'),

    ############# Soft Delete community event ###################### 
    path('delete-event/<int:pk>/', DeleteCommunityEventView.as_view(), name='delete-community-event'),

    ############# Join to a community event #################
    path("join-to-event/", JoinEventAPIView.as_view(), name="join-event"),

    ############## Get all the enrolled events ################## 
    path('get-enrolled-events/', EnrolledEventsView.as_view(), name='get-enrolled-events'),
]