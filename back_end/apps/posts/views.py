from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework import status
from posts.serializers import PostCreateSerializer,PostSerializer,ToggleLikeSerializer,LikedPostStatusSerializer
from posts.models import Post,Like
from common.pagination import CustomPostPagination
from django.db import models



########################## Create New post View  #######################

class CreatNewPostAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        serializer = PostCreateSerializer(data=request.data, context={'request': request})
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
    permission_classes = [ IsAuthenticated ]

    def get(self,request):
        posts = Post.objects.select_related('author').all()
        paginator = CustomPostPagination()
        paginated_posts = paginator.paginate_queryset(posts,request)
        serializer = PostSerializer(paginated_posts,many=True,context={'request':request})
        return paginator.get_paginated_response(serializer.data)
    
############################## Hanle Like View ##################################

#================================= Toggle Likes ==============================#

class ToggleLikeAPIView(APIView):
    permission_classes=[IsAuthenticated]

    def post(self,request):
        serializer = ToggleLikeSerializer(data=request.data,context={'request':request})
        if serializer.is_valid():
            result = serializer.save()
            return Response(result,status=status.HTTP_200_OK)
        return Response(serializer.errors,status=status.HTTP_400_BAD_REQUEST)
    
#============================  Get all the liked post datas View ==============================#

class LikedPostStatusView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user

        # Get all post IDs liked by current user
        liked_post_ids = set(Like.objects.filter(user=user).values_list('post_id', flat=True))

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
    

