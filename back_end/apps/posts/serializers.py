
from rest_framework import serializers
from .models import Post,Like
from common.cloudinary_utils import upload_to_cloudinary
import mimetypes
from posts.tasks import upload_post_media_task
from users.models import CustomUser
from common.cloudinary_utils import generate_secure_image_url

##################### post creation serializer ####################


class PostCreateSerializer(serializers.ModelSerializer):
    media = serializers.FileField(write_only=True, required=False)

    class Meta:
        model = Post
        fields = ['content', 'media']

    def create(self, validated_data):
        request = self.context['request']
        user = request.user
        media = validated_data.pop('media', None)

        # Save post with media file (will be uploaded in background)
        post = Post.objects.create(author=user, media=media, **validated_data)

        # Upload media and set image_url or video_url
        if media:
            # Celery task with post ID
            upload_post_media_task.delay(post.id)

        return post


#################### Get all posts #############################

class AuthorSerializer(serializers.ModelSerializer):
    profile_picture = serializers.SerializerMethodField()

    class Meta:
        model = CustomUser
        fields = [
            'id', 'username', 'email', 'profile_picture',
            'farming_type', 'experience', 'bio',
        ]

    def get_profile_picture(self, obj):
        return generate_secure_image_url(obj.profile_picture)

class PostSerializer(serializers.ModelSerializer):
    author = AuthorSerializer(read_only=True)

    class Meta:
        model = Post
        fields = [
            'id', 'author', 'content',
            'image_url', 'video_url',
            'created_at', 'updated_at'
        ]

##########################  Hale likes ###################################

#================ Like toggling serialzier ================================# 

class ToggleLikeSerializer(serializers.Serializer):
    post_id = serializers.IntegerField()

    def validate_post_id(self, value):
        if not Post.objects.filter(id=value).exists():
            raise serializers.ValidationError("Post does not exist.")
        return value

    def save(self, **kwargs):
        request = self.context['request']
        post_id = self.validated_data['post_id']
        post = Post.objects.get(id=post_id)
        user = request.user

        like_instance = Like.objects.filter(user=user, post=post).first()

        if like_instance:
            like_instance.delete()
            return {"liked": False, "message": "Post unliked."}
        else:
            Like.objects.create(user=user, post=post)
            return {"liked": True, "message": "Post liked."}
        

#========================== Get liked post datas =============================# 

class LikedPostStatusSerializer(serializers.Serializer):
    post_id = serializers.IntegerField()
    liked_by_user = serializers.BooleanField()
    total_likes = serializers.IntegerField()