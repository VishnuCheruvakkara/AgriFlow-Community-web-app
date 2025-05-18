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

############# serializer for send connection request ################33

class ConnectionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Connection
        fields = ['id', 'sender', 'receiver', 'status', 'created_at']
        read_only_fields = ['id', 'sender', 'status', 'created_at']