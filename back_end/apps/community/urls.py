from django.urls import path
from community.views import ShowUsersWhileCreateCommunity 

urlpatterns = [
    # Authentication urls
    path('get-users-create-community/', ShowUsersWhileCreateCommunity.as_view(), name='all-users-except-self-admin'),
]
