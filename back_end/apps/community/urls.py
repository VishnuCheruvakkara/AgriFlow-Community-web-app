from django.urls import path
from community.views import ShowUsersWhileCreateCommunity,CreateCommunityView

urlpatterns = [
    # Authentication urls
    path('get-users-create-community/', ShowUsersWhileCreateCommunity.as_view(), name='all-users-except-self-admin'),
    #======== Create community urls =============#
    path('create-community/',CreateCommunityView.as_view(),name='create-community'),

]
