from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework import status
from posts.serializers import PostCreateSerializer,PostSerializer
from posts.models import Post
from common.pagination import CustomPostPagination


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