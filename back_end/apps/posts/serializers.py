
from rest_framework import serializers
from .models import Post, Like, Comment
from common.cloudinary_utils import upload_to_cloudinary
import mimetypes
from posts.tasks import upload_post_media_task
from users.models import CustomUser
from common.cloudinary_utils import generate_secure_image_url
from notifications.utils import create_and_send_notification
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

# ============================ Edit/Update post serializer ===========================#

class PostUpdateSerializer(serializers.ModelSerializer):
    media = serializers.FileField(write_only=True, required=False)

    class Meta:
        model = Post
        fields = ['content', 'media']

    def update(self, instance, validated_data):
        request = self.context['request']
        remove_media = request.data.get('remove_media', '').lower() == 'true'

        # ========== 1. If user wants to remove media ==========
        if remove_media:
            instance.media = None
            instance.image_url = None
            instance.video_url = None

        # ========== 2. If user uploads new media ==========
        new_media = validated_data.get('media', None)
        if new_media:
            content_type = new_media.content_type

            if content_type.startswith("image/"):
                if instance.video_url:
                    raise serializers.ValidationError("Can't switch media type. Delete the post and create a new one.")
                instance.image_url = None  # Optional: clear old image
                instance.media = new_media
                upload_post_media_task.delay(instance.id)

            elif content_type.startswith("video/"):
                if instance.image_url:
                    raise serializers.ValidationError("Can't switch media type. Delete the post and create a new one.")
                instance.video_url = None  # Optional: clear old video
                instance.media = new_media
                upload_post_media_task.delay(instance.id)

            else:
                raise serializers.ValidationError("Unsupported media type.")

        # ========== 3. Update content ==========
        instance.content = validated_data.get('content', instance.content)
        instance.save()
        return instance

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

##########################  Handle likes ###################################

# ================ Like toggling serialzier ================================#


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

            # Secure image URL
            profile_image_url = None
            if hasattr(user, "profile_picture") and user.profile_picture:
                profile_image_url = generate_secure_image_url(user.profile_picture)

            # Send notification to the post owner, if not liking own post
            if post.author != user:
                create_and_send_notification(
                    recipient=post.author,
                    sender=user,
                    type="post_liked",
                    message=f"{user.username} liked your post.",
                    image_url=profile_image_url,
                )

            return {"liked": True, "message": "Post liked."}


# ========================== Get liked post datas =============================#

class LikedPostStatusSerializer(serializers.Serializer):
    post_id = serializers.IntegerField()
    liked_by_user = serializers.BooleanField()
    total_likes = serializers.IntegerField()


########################## Handle the comments ####################

# ====================== posts/add new comment for a perticular post ========================#

class CommentCreateSerializer(serializers.Serializer):
    post = serializers.IntegerField()
    content = serializers.CharField(max_length=1000)

    def validate_post(self, value):
        from .models import Post
        if not Post.objects.filter(id=value).exists():
            raise serializers.ValidationError("Post does not exist.")
        return value

# ======================  get all the comments ================================#


class CustomUserSerializer(serializers.ModelSerializer):
    profile_picture = serializers.SerializerMethodField()

    class Meta:
        model = CustomUser
        fields = ['id', 'username', 'profile_picture']

    def get_profile_picture(self, obj):
        return generate_secure_image_url(obj.profile_picture)


class CommentSerializer(serializers.ModelSerializer):
    user = CustomUserSerializer(read_only=True)  # Include user info

    class Meta:
        model = Comment
        fields = ['id', 'user', 'post', 'content', 'created_at']
        read_only_fields = ['id', 'user', 'created_at']

######################## Get single post Serializer (User full for the share section thorough the other platforms ) ###########################

class AuthorSerializer(serializers.ModelSerializer):
    profile_picture=serializers.SerializerMethodField()

    class Meta:
        model=CustomUser 
        fields = ['id','username','profile_picture']
    
    def get_profile_picture(self,obj):
        return generate_secure_image_url(obj.profile_picture)

class PostDetailSerializer(serializers.ModelSerializer):
    author = AuthorSerializer(read_only=True)
    like_count = serializers.SerializerMethodField()
    comment_count = serializers.SerializerMethodField()
    is_liked = serializers.SerializerMethodField()

    class Meta:
        model = Post
        fields = [
            'id',
            'author',
            'content',
            'image_url',
            'video_url',
            'created_at',
            'updated_at',
            'like_count',
            'comment_count',
            'is_liked',
        ]

    def get_like_count(self, obj):
        return obj.likes.count()

    def get_comment_count(self, obj):
        return obj.comments.count()

    def get_is_liked(self, obj):
        user = self.context['request'].user
        return (
            user.is_authenticated and
            Like.objects.filter(post=obj, user=user).exists()
        )
