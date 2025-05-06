
from rest_framework import serializers
from events.models import Community, CommunityEvent, EventLocation, EventParticipation
from apps.common.cloudinary_utils import generate_secure_image_url,upload_image_to_cloudinary

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

#################  Create Community Event Serizlier ####################

class CommunityEventSerializer(serializers.ModelSerializer):
    # Handle nested location input as a dict (this is coming from React form)
    location = serializers.JSONField(required=False, write_only=True)  # Handle location as JSON
    banner = serializers.FileField(write_only=True, required=True)

    class Meta:
        model = CommunityEvent
        fields = [
            'max_participants',
            'title',
            'description',
            'banner',
            'community',
            'event_type',
            'start_datetime',
            'address',
            'online_link',
            'location',  # Nested location field as JSON
        ]

    def create(self, validated_data):
        event_type = validated_data.get("event_type")
        location_data = validated_data.pop("location", None)  # Get location data from the validated data
        banner_file = validated_data.pop("banner")  # Handle the banner file

        # 1. Upload banner to Cloudinary
        public_id = upload_image_to_cloudinary(banner_file, folder_name="event_banners")
        validated_data['banner'] = public_id

        # 2. Handle event type
        if event_type == 'offline':
            if not location_data:
                raise serializers.ValidationError({"location": "Offline events require a location."})
            
            # If offline event, create a new EventLocation instance
            # Convert location_data into a model instance for EventLocation
            location = EventLocation.objects.create(**location_data)
            validated_data['event_location'] = location
        else:
            validated_data['event_location'] = None
            validated_data['address'] = None  # Optional: clear address for online events
            validated_data['online_link'] = validated_data.get("online_link")

        # 3. Set the user
        request = self.context.get('request')
        validated_data['created_by'] = request.user

        # 4. Create the event
        return CommunityEvent.objects.create(**validated_data)
