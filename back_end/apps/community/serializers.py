from rest_framework import serializers
from django.contrib.auth import get_user_model

################### Get the User model ###############

User = get_user_model()

######################################################

class UserMinimalSerializer(serializers.ModelSerializer):
    profile_picture = serializers.SerializerMethodField()
    location = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = ['id', 'username','profile_picture', 'location']

    def get_profile_picture(self, obj):
        return obj.get_secure_profile_picture_url()

    def get_location(self, obj):
        if obj.address:
            return {
                "location_name": obj.address.location_name,
                "country": obj.address.country
            }
        return None