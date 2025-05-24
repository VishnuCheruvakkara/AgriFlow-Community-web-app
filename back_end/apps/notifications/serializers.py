
from rest_framework import serializers 
from notifications.models import Notification 
from django.contrib.auth import get_user_model
from apps.common.cloudinary_utils import generate_secure_image_url

User = get_user_model()

class UserSerializer(serializers.ModelSerializer):
    profile_picture = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = ['id', 'username', 'farming_type', 'profile_picture']  # fields you need

    def get_profile_picture(self,obj):
        public_id = obj.profile_picture 
        return generate_secure_image_url(public_id)

class NotificationSerializer(serializers.ModelSerializer):
    sender = UserSerializer(read_only=True)  

    class Meta:
        model = Notification
        fields = ['id', 'message', 'notification_type', 'is_read', 'created_at', 'sender']