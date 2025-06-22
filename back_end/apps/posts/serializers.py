
from rest_framework import serializers
from .models import Post
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