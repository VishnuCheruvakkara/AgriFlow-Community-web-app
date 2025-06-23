from django.urls import path 
from posts.views import CreatNewPostAPIView,GetAllThePosts,ToggleLikeAPIView,LikedPostStatusView,AddCommentAPIView,CommentListAPIView

urlpatterns = [
    ############################ Create new post url #########################
    path("create-new-post/",CreatNewPostAPIView.as_view(),name="create-new-post"),
    
    ############################ Get all the created post in the Home page ######################
    path("get-all-posts/",GetAllThePosts.as_view(),name="get-all-the-post"),

    ######################### Hale Like a post ######################
    #======================== Toggle like ==============================#
    path('toggle-like/',ToggleLikeAPIView.as_view(),name="toggle-like"),

    #======================== Get all the liked post data  ==============================#
    path('like-status/', LikedPostStatusView.as_view(), name='like-status'),

    ########################## Handle the comments ####################
    #====================== posts/add new comment for a perticular post ========================# 
    path('add-comment/', AddCommentAPIView.as_view(), name='add-comment'),
    #====================== get all the comment ===========================#
    path('get-all-comment/', CommentListAPIView.as_view(), name='comment-list'),
]

