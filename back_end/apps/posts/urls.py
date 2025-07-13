from django.urls import path
from posts.views import CreatNewPostAPIView, GetAllThePosts, ToggleLikeAPIView, LikedPostStatusView, AddCommentAPIView, CommentListAPIView, UserPostsAPIView, DeletePostAPIView, EditPostAPIView, GetSinglePostView, GetAllPostsAdminSide,GetSinglePostDetailsAdminSide

urlpatterns = [
    ############################ Create new post url #########################
    path("create-new-post/", CreatNewPostAPIView.as_view(), name="create-new-post"),

    ############################ Get all the created post in the Home page ######################
    path("get-all-posts/", GetAllThePosts.as_view(), name="get-all-the-post"),

    ######################### Handle Like a post ######################
    # ======================== Toggle like ==============================#
    path('toggle-like/', ToggleLikeAPIView.as_view(), name="toggle-like"),

    # ======================== Get all the liked post data  ==============================#
    path('like-status/', LikedPostStatusView.as_view(), name='like-status'),

    # ======================= Get post of the current user in the prifile side ====================#
    path('user-posts/', UserPostsAPIView.as_view(), name='user-posts'),

    # ===================== Delete teh post based on the id ====================================#
    path('delete-post/<int:post_id>/',
         DeletePostAPIView.as_view(), name='delete-post'),

    # ==================== Update or edit post ======================#
    path('edit-post/<int:pk>/', EditPostAPIView.as_view(), name='edit-post'),
    # ================== Get a single post to show that and enable share option ============================#
    path('get-single-post/<int:post_id>/',
         GetSinglePostView.as_view(), name="get-single-post"),

    ########################## Handle the comments ####################
    # ====================== posts/add new comment for a perticular post ========================#
    path('add-comment/', AddCommentAPIView.as_view(), name='add-comment'),
    # ====================== get all the comment ===========================#
    path('get-all-comment/', CommentListAPIView.as_view(), name='comment-list'),

    ########################  Admin side urls ###############################

    # ======================= Admin side get all the posts ========================#
    path("admin/get-all-post-admin-side/", GetAllPostsAdminSide.as_view(),
         name="get-posts-data-in-admin-side"),

    # =============================== Get Single product details in the admin side =========================#
    path('admin/get-single-post-data/<int:post_id>',GetSinglePostDetailsAdminSide.as_view(),name="get-single-post-details"),

]
