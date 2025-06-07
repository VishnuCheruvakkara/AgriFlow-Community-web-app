
from rest_framework import serializers 
from notifications.models import Notification 
from django.contrib.auth import get_user_model
from apps.common.cloudinary_utils import generate_secure_image_url

User = get_user_model()

###########################  Serializers for get the connection datas ######################
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

############################## Serialziers for get the private messages  #######################

class GetPrivateMessageSerializer(serializers.ModelSerializer):
    sender = serializers.CharField(source = 'sender.username',read_only=True)
    sender_id = serializers.IntegerField(source = 'sender.id',read_only=True)
    timestamp = serializers.DateTimeField(source = 'created_at')
    community_id = serializers.SerializerMethodField()
    community_name = serializers.SerializerMethodField()

    class Meta:
        model = Notification
        fields = ['id','image_url','message','sender','sender_id','timestamp','notification_type','community_id','community_name','is_read']

    def get_community_id(self,obj):
        if obj.notification_type == "community_message" and obj.community:
            return obj.community.id 
        return None 
    
    def get_community_name(self,obj):
        if obj.notification_type == "community_message" and obj.community:
            return obj.community.name 
        return None 

#################################  Get all the notifications from the Db #######################

class GeneralNotificationSerializer(serializers.ModelSerializer):
    sender = serializers.CharField(source='sender.username', read_only=True)
    sender_id = serializers.IntegerField(source='sender.id', read_only=True)
    timestamp = serializers.DateTimeField(source='created_at')
    community_id = serializers.SerializerMethodField()
    community_name = serializers.SerializerMethodField()

    class Meta:
        model = Notification
        fields = ['id', 'image_url', 'message', 'sender', 'sender_id', 'timestamp', 'notification_type', 'community_id', 'community_name', 'is_read']

    def get_community_id(self, obj):
        return obj.community.id if obj.community else None

    def get_community_name(self, obj):
        return obj.community.name if obj.community else None
