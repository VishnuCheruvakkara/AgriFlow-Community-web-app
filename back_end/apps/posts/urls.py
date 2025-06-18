from django.urls import path 
from .views import CreatNewPostAPIView 

urlpatterns = [
    ############################ Create new post url #########################
    path("create-new-post/",CreatNewPostAPIView.as_view(),name="create-new-post"),
  
]

