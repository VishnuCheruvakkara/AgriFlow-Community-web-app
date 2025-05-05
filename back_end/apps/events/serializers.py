
from rest_framework import serializers
from events.models import Community
from apps.common.cloudinary_utils import generate_secure_image_url

##############  Get community in the event creation section (only get the community where user is admin ) #################

class CommunitySerializer(serializers.ModelSerializer):
    logo = serializers.SerializerMethodField()
    members_count = serializers.SerializerMethodField()

    class Meta:
        model = Community
        fields = ['id', 'name', 'description', 'logo', 'members_count']

    def get_logo(self, obj):
        return generate_secure_image_url(obj.community_logo)

    def get_members_count(self, obj):
        return obj.memberships.filter(status='approved').count()