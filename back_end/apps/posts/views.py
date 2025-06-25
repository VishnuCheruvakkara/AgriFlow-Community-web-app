from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework import status
from posts.serializers import PostCreateSerializer, PostSerializer, ToggleLikeSerializer, LikedPostStatusSerializer,CommentCreateSerializer,CommentSerializer
from posts.models import Post, Like, Comment
from common.pagination import CustomPostPagination
from django.db import models
from django.db.models import Q


########################## Create New post View  #######################

class CreatNewPostAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        serializer = PostCreateSerializer(
            data=request.data, context={'request': request})
        if serializer.is_valid():
            post = serializer.save()
            return Response({
                "message": "Post created successfully",
                "post_id": post.id,
                "created_at": post.created_at,
            }, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

######################### Get all the post in the front-end #######################


class GetAllThePosts(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        posts = Post.objects.select_related('author').all()
        paginator = CustomPostPagination()
        paginated_posts = paginator.paginate_queryset(posts, request)
        serializer = PostSerializer(
            paginated_posts, many=True, context={'request': request})
        return paginator.get_paginated_response(serializer.data)

############################## Hanle Like View ##################################

# ================================= Toggle Likes ==============================#


class ToggleLikeAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        serializer = ToggleLikeSerializer(
            data=request.data, context={'request': request})
        if serializer.is_valid():
            result = serializer.save()
            return Response(result, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

# ============================  Get all the liked post datas View ==============================#


class LikedPostStatusView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user

        # Get all post IDs liked by current user
        liked_post_ids = set(Like.objects.filter(
            user=user).values_list('post_id', flat=True))

        # Get all posts that have at least one like
        posts_with_likes = Post.objects.annotate(
            total_likes=models.Count('likes')
        ).filter(total_likes__gt=0)

        data = []
        for post in posts_with_likes:
            data.append({
                "post_id": post.id,
                "liked_by_user": post.id in liked_post_ids,
                "total_likes": post.total_likes,
            })

        serializer = LikedPostStatusSerializer(data=data, many=True)
        serializer.is_valid()  # No need to raise_exception
        return Response(serializer.data)

########################## Handle the comments ####################

# ====================== posts/add new comment for a perticular post ========================#

class AddCommentAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, *args, **kwargs):
        serializer = CommentCreateSerializer(data=request.data)
        
        if serializer.is_valid():
            post_id = serializer.validated_data['post']
            content = serializer.validated_data['content']
            post = Post.objects.get(id=post_id)

            comment = Comment.objects.create(
                user=request.user,
                post=post,
                content=content
            )

            return Response({
                "id": comment.id,
                "user": comment.user.username,
                "content": comment.content,
                "created_at": comment.created_at,
                "post": comment.post.id
            }, status=status.HTTP_201_CREATED)
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
#========================== Get all teh comment for each posts ==================================#

class CommentListAPIView(APIView):
    permission_classes = [IsAuthenticated]  

    def get(self, request, *args, **kwargs):
        post_id = request.query_params.get('post')
        if not post_id:
            return Response({"detail": "Post ID is required."}, status=status.HTTP_400_BAD_REQUEST)

        comments = Comment.objects.filter(post_id=post_id).select_related('user').order_by('-created_at')
        serializer = CommentSerializer(comments, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)


########################## Get post conditionally based on user id in the profile section ##############################

class UserPostsAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user_id = request.query_params.get('user_id')
        search_query = request.query_params.get('search', '').strip()
        filter_type = request.query_params.get('filter', '').strip().lower()

        # Fetch posts for either another user or the logged-in user
        if user_id:
            queryset = Post.objects.filter(author__id=user_id)
        else:
            queryset = Post.objects.filter(author=request.user)

        # Apply content-only search filter
        if search_query:
            queryset = queryset.filter(content__icontains=search_query)

        # Apply filter
        if filter_type == 'image':
            queryset = queryset.filter(image_url__isnull=False).exclude(image_url='')
        elif filter_type == 'video':
            queryset = queryset.filter(video_url__isnull=False).exclude(video_url='')

        queryset = queryset.order_by('-created_at')

        # Paginate
        paginator = CustomPostPagination()
        paginated_posts = paginator.paginate_queryset(queryset, request)
        serializer = PostSerializer(paginated_posts, many=True)

        return paginator.get_paginated_response(serializer.data)

