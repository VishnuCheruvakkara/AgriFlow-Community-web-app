from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated,IsAdminUser
from rest_framework import status
from posts.serializers import PostCreateSerializer, PostSerializer, ToggleLikeSerializer, LikedPostStatusSerializer,CommentCreateSerializer,CommentSerializer,PostUpdateSerializer,PostDetailSerializer,GetAllPostAdminSideSerialzier,SinglePostDetailAdminSerializer
from posts.models import Post, Like, Comment
from common.pagination import CustomPostPagination,CustomAdminPostPagination
from django.db import models
from django.db.models import Q
from notifications.utils import create_and_send_notification
from common.cloudinary_utils import generate_secure_image_url
from django.shortcuts import get_object_or_404
#logger set up 
import logging
logger = logging.getLogger(__name__)



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
    
#########################  Update or edit post view ########################

class EditPostAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def patch(self, request, pk):
        try:
            post = Post.objects.get(id=pk, author=request.user, is_deleted=False)
        except Post.DoesNotExist:
            return Response({"error": "Post not found or unauthorized."}, status=status.HTTP_404_NOT_FOUND)

        serializer = PostUpdateSerializer(post, data=request.data, partial=True, context={'request': request})
        if serializer.is_valid():
            updated_post = serializer.save()
            return Response({
                "message": "Post updated successfully",
                "post_id": updated_post.id,
                "updated_at": updated_post.updated_at
            }, status=status.HTTP_200_OK)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

######################### Get all the post in the front-end #######################


class GetAllThePosts(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        search_query = request.query_params.get('search', '').strip()
        filter_type = request.query_params.get('filter', '').lower()

        # Start with all posts
        posts = Post.objects.select_related('author').filter(is_deleted=False)

        #  Apply search filter (by post content or author username)
        if search_query:
            posts = posts.filter(
                Q(content__icontains=search_query) |
                Q(author__username__icontains=search_query)
            )

        #  Apply media-type filter
        if filter_type == 'image':
            posts = posts.filter(image_url__isnull=False).exclude(image_url='')
        elif filter_type == 'video':
            posts = posts.filter(video_url__isnull=False).exclude(video_url='')

        #  Order by newest first
        posts = posts.order_by('-created_at')

        #  Paginate and serialize
        paginator = CustomPostPagination()
        paginated_posts = paginator.paginate_queryset(posts, request)
        serializer = PostSerializer(paginated_posts, many=True, context={'request': request})

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

            # Generate secure profile image URL
            profile_image_url = None
            if hasattr(request.user, "profile_picture") and request.user.profile_picture:
                profile_image_url = generate_secure_image_url(request.user.profile_picture)

            # Send notification to post owner
            if post.author != request.user:
                create_and_send_notification(
                    recipient=post.author,
                    sender=request.user,
                    type="post_commented",
                    message=f"{request.user.username} commented on your post. See the post here...",
                    image_url=profile_image_url,
                    post=post,
                    
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

########################### Hanle posts  in profile section page #################################

#========================== Get post conditionally based on user id in the profile section ==============================#

class UserPostsAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user_id = request.query_params.get('user_id')
        search_query = request.query_params.get('search', '').strip()
        filter_type = request.query_params.get('filter', '').strip().lower()

        # Fetch posts for either another user or the logged-in user
        if user_id:
            queryset = Post.objects.filter(author__id=user_id).filter(is_deleted=False)
        else:
            queryset = Post.objects.filter(author=request.user).filter(is_deleted=False)

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
    
#============================== Delete post view by the creator user =============================# 

class DeletePostAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def delete(self, request, post_id):
        try:
            post = Post.objects.get(id=post_id)

            # Ensure only the author can delete
            if post.author != request.user:
                return Response({"error": "Unauthorized"}, status=status.HTTP_403_FORBIDDEN)

            post.is_deleted = True  # Soft delete
            post.save()

            return Response({"message": "Post deleted successfully."}, status=status.HTTP_200_OK)

        except Post.DoesNotExist:
            return Response({"error": "Post not found"}, status=status.HTTP_404_NOT_FOUND)

######################## Get single post view (User full for the share section thorough the other platforms ) ###########################

class GetSinglePostView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, post_id):
        try:
            post = Post.objects.select_related("author").get(
                id=post_id,
                is_deleted=False
            )
        except Post.DoesNotExist:
            return Response(
                {"detail": "Post not found."},
                status=status.HTTP_404_NOT_FOUND
            )
        
        serializer = PostDetailSerializer(post, context={"request": request})
        return Response(serializer.data, status=status.HTTP_200_OK)

######################## Admin side posts handling #############################

#==================== Get all post data in the admin side api view ========================# 

class GetAllPostsAdminSide(APIView):
    permission_classes = [IsAdminUser]

    def get(self,request):

        try:
            posts = Post.objects.all()

            # Search
            search = request.query_params.get("search")
            if search:
                posts = posts.filter(
                    Q(content__icontains=search) | 
                    Q(author__username__icontains=search)
                )

            # Filter by status
            status = request.query_params.get("status")
            if status== "active":
                posts = posts.filter(is_deleted=False)
            elif status == "deleted":
                posts = posts.filter(is_deleted=True)

            # Filter by type
            post_type = request.query_params.get("type")
            if post_type == "image":
                posts = posts.filter(image_url__isnull=False).exclude(image_url="")
            elif post_type == "video":
                posts = posts.filter(video_url__isnull=False).exclude(video_url="")

            #pagination 
            paginator = CustomAdminPostPagination()
            paginated_posts = paginator.paginate_queryset(posts,request)
            serializer = GetAllPostAdminSideSerialzier(paginated_posts,many=True)
            return paginator.get_paginated_response(serializer.data)

        except Exception as e:
            logger.exception(f"Error fetching the data :{e}")
            return Response( {"success":False,"message":"Error fetching the post details","data":[]},status=status.HTTP_500_INTERNAL_SERVER_ERROR ) 

#=============================== Get Single product details in the admin side =========================#

class GetSinglePostDetailsAdminSide(APIView):
    permission_classes = [IsAdminUser]

    def get(self,request,post_id):
    
        post = get_object_or_404(Post,id=post_id) 
        serializer = SinglePostDetailAdminSerializer(post,context={"request":request})
        return Response(serializer.data,status=status.HTTP_200_OK)
        