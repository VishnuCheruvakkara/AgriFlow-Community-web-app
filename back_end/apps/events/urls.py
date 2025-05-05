from django.urls import path
from events.views import GetCommunityForCreateEvent

urlpatterns = [
    ##############  Get community in the event creation section (only get the community where user is admin ) #################
    path('get-community-create-event/', GetCommunityForCreateEvent.as_view(), name='get-community-create-event'),

]