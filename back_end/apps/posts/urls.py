from django.urls import path
from posts.views import (
    CreatNewPostAPIView,
    GetAllThePosts,
    ToggleLikeAPIView,
    LikedPostStatusView,
    AddCommentAPIView,
    CommentListAPIView,
    UserPostsAPIView,
    DeletePostAPIView,
    EditPostAPIView,
    GetSinglePostView,
    GetAllPostsAdminSide,
    GetSinglePostDetailsAdminSide,
    TogglePostDeleteStatusView,
)

urlpatterns = [
    # Post creation and retrieval
    path("create-new-post/", CreatNewPostAPIView.as_view(), name="create-new-post"),
    path("get-all-posts/", GetAllThePosts.as_view(), name="get-all-the-post"),
    path('get-single-post/<int:post_id>/', GetSinglePostView.as_view(), name="get-single-post"),

    # Like functionality
    path('toggle-like/', ToggleLikeAPIView.as_view(), name="toggle-like"),
    path('like-status/', LikedPostStatusView.as_view(), name='like-status'),

    # User-specific posts
    path('user-posts/', UserPostsAPIView.as_view(), name='user-posts'),

    # Post update and delete
    path('edit-post/<int:pk>/', EditPostAPIView.as_view(), name='edit-post'),
    path('delete-post/<int:post_id>/', DeletePostAPIView.as_view(), name='delete-post'),

    # Comments
    path('add-comment/', AddCommentAPIView.as_view(), name='add-comment'),
    path('get-all-comment/', CommentListAPIView.as_view(), name='comment-list'),

    # Admin-side operations
    path("admin/get-all-post-admin-side/", GetAllPostsAdminSide.as_view(), name="get-posts-data-in-admin-side"),
    path('admin/get-single-post-data/<int:post_id>', GetSinglePostDetailsAdminSide.as_view(), name="get-single-post-details"),
    path("admin/toggle-delete-status/<int:pk>/", TogglePostDeleteStatusView.as_view(), name="toggle_post_delete_status"),
]
