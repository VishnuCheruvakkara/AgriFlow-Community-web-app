from rest_framework import serializers
from django.contrib.auth import get_user_model
from users.models import Address
from .models import Connection,BlockedUser
from apps.common.cloudinary_utils import generate_secure_image_url

User = get_user_model()

###################### serializers for send connection request ####################

class AddressSerializer(serializers.ModelSerializer):
    class Meta:
        model = Address
        fields = ['location_name','country']

class GetSuggestedFarmersSerializer(serializers.ModelSerializer):
    address = AddressSerializer()
    profile_picture = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = ['id', 'username', 'profile_picture', 'farming_type', 'address']

    def get_profile_picture(self,obj):
        public_id = obj.profile_picture 
        return generate_secure_image_url(public_id)

##################  Pending request section ( Requests You Sent - front end section in the connection page  ) ################### 

#============== serializer for send connection request  =====================#
class ConnectionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Connection
        fields = ['id', 'sender', 'receiver', 'status', 'created_at']
        read_only_fields = ['id', 'sender', 'status', 'created_at']

#================== Get users in the Request you send section View  =======================#
    
class SentConnectionRequestSerializer(serializers.ModelSerializer):
    receiver_username = serializers.CharField(source='receiver.username', read_only=True)
    sent_at = serializers.DateTimeField(source='created_at', read_only=True)
    profile_picture=serializers.SerializerMethodField()

    class Meta:
        model = Connection
        fields = ['id', 'receiver_username', 'profile_picture', 'status', 'sent_at']
    
    def get_profile_picture(self, obj):
        # Access receiver.profile_picture instead of obj.profile_picture
        public_id = getattr(obj.receiver, 'profile_picture', None)
        if public_id:
            return generate_secure_image_url(public_id)
        return None
    
##################  Pending request section ( Received Connection Requests - front end section in the connection page  ) ################### 

#================ Get recieved connection requests Serializer =====================# 

class ReceivedConnectionRequestsSerializer(serializers.ModelSerializer):
    sender_id = serializers.IntegerField(source='sender.id', read_only=True)
    sender_username = serializers.CharField(source='sender.username', read_only=True)
    sender_profile_picture = serializers.SerializerMethodField()

    class Meta:
        model = Connection
        fields = [
            'id',
            'sender_id',
            'sender_username',
            'sender_profile_picture',
            'created_at'
        ]

    def get_sender_profile_picture(self, obj):
        public_id = obj.sender.profile_picture
        return generate_secure_image_url(public_id)

############################### My Connection section ###########################################

#============================ get all my connection serialzier ===========================# 

class ConnectedUserSerializer(serializers.ModelSerializer):
    profile_picture = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = ['id', 'username', 'profile_picture', 'farming_type']

    def get_profile_picture(self,obj):
        public_id = obj.profile_picture 
        return generate_secure_image_url(public_id)
    
class GetMyConnectionSerializer(serializers.ModelSerializer):
    other_user = serializers.SerializerMethodField()

    class Meta:
        model = Connection
        fields = ['id', 'other_user']

    def get_other_user(self, obj):
        request_user = self.context['request'].user
        other = obj.receiver if obj.sender == request_user else obj.sender
        return ConnectedUserSerializer(other).data

########################## Block user serializer ######################### 

class BlockUserSerializer(serializers.Serializer):
    user_id = serializers.IntegerField()

    def validate_user_id(self, value):
        request_user = self.context['request'].user

        if request_user.id == value:
            raise serializers.ValidationError("You cannot block yourself.")

        try:
            blocked_user = User.objects.get(id=value)
        except User.DoesNotExist:
            raise serializers.ValidationError("User not found.")

        if BlockedUser.objects.filter(blocker=request_user, blocked=blocked_user).exists():
            raise serializers.ValidationError("You have already blocked this user.")

        return value
