from django.urls import path
from community.views import ShowUsersWhileCreateCommunity,CreateCommunityView,GetMyCommunityView

urlpatterns = [
    # Authentication urls
    path('get-users-create-community/', ShowUsersWhileCreateCommunity.as_view(), name='all-users-except-self-admin'),
    #======== Create community urls =============#
    path('create-community/',CreateCommunityView.as_view(),name='create-community'),
    #======== for My-community section ===========# 
    path('get-my-communities/',GetMyCommunityView.as_view(),name='get-my-communities'),


]
