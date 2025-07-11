from django.urls import path
from events.views import GetCommunityForCreateEvent,CommunityEventCreateAPIView, GetAllCommunityEventsView,UserCreatedEventsView,CommunityEventUpdateAPIView,DeleteCommunityEventView,JoinEventAPIView,EnrolledEventsView,EventEnrollmentHistoryAPIView,MarkEventAsCompletedView,MarkEventAsCancelledView,AdminEventListAPIView,CommunityEventDetailView,ToggleEventDeleteStatusView

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

    ############## Get the enrolled event history for a user ##########################
    path("get-event-enrollment-history/",EventEnrollmentHistoryAPIView.as_view(), name="event-enrollment-history" ),

    ############## mark event as completed by the creator of the event #######################
    path( "mark-as-completed/<int:event_id>/", MarkEventAsCompletedView.as_view(), name="mark-event-as-completed"),

    #####################  mark event as removed  ###########################
    path("mark-as-cancelled/<int:event_id>/", MarkEventAsCancelledView.as_view(), name="mark-event-as-cancelled"),

    ##################### Admin side event handling ################################
    #=================== get the all events in the admin side ========================# 
    path("admin/get-all-event/", AdminEventListAPIView.as_view(), name="admin-get-all-event"),

    #================= get single event details page in the admin side ======================# 
    path("admin/get-event-details/<int:id>/",CommunityEventDetailView.as_view(),name="admin-event-detail"),

    #================= toggle the delete status of the event ========================# 
    path("admin/toggle-delete-status/<int:pk>/",ToggleEventDeleteStatusView.as_view(),name="toggle_event_delete_status",),


]