
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

        # Upload banner to Cloudinary
        public_id = upload_image_to_cloudinary(banner_file, folder_name="event_banners")
        validated_data['banner'] = public_id

        # Handle event type
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

        # Set the user
        request = self.context.get('request')
        validated_data['created_by'] = request.user

        # Create the event
        return CommunityEvent.objects.create(**validated_data)


############################### Get all community events int the event section  ################# 
############################### Events Created by the logged in user serializer  ###################### 


class CommunityEventCombinedSerializer(serializers.ModelSerializer):
    community_name = serializers.CharField(source='community.name', read_only=True)
    community_id = serializers.IntegerField(source='community.id', read_only=True)
    location_name = serializers.CharField(source='event_location.location_name', read_only=True)
    full_location = serializers.CharField(source='event_location.full_location', read_only=True)
    latitude = serializers.FloatField(source='event_location.latitude', read_only=True)
    longitude = serializers.FloatField(source='event_location.longitude', read_only=True)
    country = serializers.CharField(source='event_location.country', read_only=True)
    banner_url = serializers.SerializerMethodField()

    class Meta:
        model = CommunityEvent
        fields = [
            'id', 'title', 'description',
            'event_type', 'start_datetime', 'max_participants', 'is_full',
            'address', 'created_at', 'updated_at','online_link',

            # Related Community fields
            'community_id', 'community_name',

            # Related EventLocation fields
            'location_name', 'full_location', 'latitude', 'longitude', 'country',

            # Secure Cloudinary banner
            'banner_url',
        ]

    def get_banner_url(self, obj):
        banner_id = obj.banner  # assuming 'banner' stores Cloudinary public_id
        if not banner_id:
            return None  # or return a default fallback URL
        try:
            url = generate_secure_image_url(banner_id)
            return url
        except Exception as e:
            print(f"Error generating banner URL for event ID {obj.id}: {str(e)}")
            return None
        
##############################  Edit event / Update event  ###################### 

class CommunityEventEditSerializer(serializers.ModelSerializer):
    banner = serializers.FileField(required=False, write_only=True)

    class Meta:
        model = CommunityEvent
        fields = [
            'id', 'title', 'description', 'max_participants', 'event_type',
            'start_datetime', 'banner', 'address', 'online_link'
        ]
        read_only_fields = ['id']

    def update(self, instance, validated_data):
        updated = False

        # Handle new banner upload
        banner_file = validated_data.pop('banner', None)
        if banner_file:
            public_id = upload_image_to_cloudinary(banner_file, folder_name="event_banners")
            if public_id:
                instance.banner = public_id
                updated = True

        # Update other fields if changed
        for field, value in validated_data.items():
            if getattr(instance, field) != value:
                setattr(instance, field, value)
                updated = True

        if updated:
            instance.save()
        return instance