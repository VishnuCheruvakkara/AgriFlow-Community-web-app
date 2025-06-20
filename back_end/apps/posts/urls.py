from django.urls import path 
from posts.views import CreatNewPostAPIView,GetAllThePosts

urlpatterns = [
    ############################ Create new post url #########################
    path("create-new-post/",CreatNewPostAPIView.as_view(),name="create-new-post"),
    
    ############################ Get all the created post in the Home page ######################
    path("get-all-posts/",GetAllThePosts.as_view(),name="get-all-the-post"),
]

