
from rest_framework import serializers
from events.models import Community, CommunityEvent, EventLocation, EventParticipation
from apps.common.cloudinary_utils import generate_secure_image_url, upload_image_to_cloudinary
from django.contrib.auth import get_user_model
from datetime import timedelta
from django.utils import timezone
from events.tasks import send_event_notification
from apps.notifications.utils import create_and_send_notification

User = get_user_model()

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
    location = serializers.JSONField(
        required=False, write_only=True)  # Handle location as JSON
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
            'location',  # Nested location field as JSON
        ]

    def create(self, validated_data):
        event_type = validated_data.get("event_type")
        # Get location data from the validated data
        location_data = validated_data.pop("location", None)
        banner_file = validated_data.pop("banner")  # Handle the banner file

        # Upload banner to Cloudinary
        public_id = upload_image_to_cloudinary(
            banner_file, folder_name="event_banners")
        validated_data['banner'] = public_id

        # Handle event type
        if event_type == 'offline':
            if not location_data:
                raise serializers.ValidationError(
                    {"location": "Offline events require a location."})

            # If offline event, create a new EventLocation instance
            # Convert location_data into a model instance for EventLocation
            location = EventLocation.objects.create(**location_data)
            validated_data['event_location'] = location
        else:
            validated_data['event_location'] = None
            # Optional: clear address for online events
            validated_data['address'] = None

        # Set the user
        request = self.context.get('request')
        validated_data['created_by'] = request.user

        # Create the event
        return CommunityEvent.objects.create(**validated_data)


############################### Get all community events int the event section  #################
############################### Events Created by the logged in user serializer  ######################


class CommunityEventCombinedSerializer(serializers.ModelSerializer):
    community_name = serializers.CharField(
        source='community.name', read_only=True)
    community_id = serializers.IntegerField(
        source='community.id', read_only=True)
    location_name = serializers.CharField(
        source='event_location.location_name', read_only=True)
    full_location = serializers.CharField(
        source='event_location.full_location', read_only=True)
    latitude = serializers.FloatField(
        source='event_location.latitude', read_only=True)
    longitude = serializers.FloatField(
        source='event_location.longitude', read_only=True)
    country = serializers.CharField(
        source='event_location.country', read_only=True)
    banner_url = serializers.SerializerMethodField()

    class Meta:
        model = CommunityEvent
        fields = [
            'id', 'title', 'description',
            'event_type', 'start_datetime', 'max_participants', 'is_full',
            'address', 'created_at', 'updated_at',

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
            print(
                f"Error generating banner URL for event ID {obj.id}: {str(e)}")
            return None

##############################  Edit event / Update event  ######################


class CommunityEventEditSerializer(serializers.ModelSerializer):
    banner = serializers.FileField(required=False, write_only=True)

    class Meta:
        model = CommunityEvent
        fields = [
            'id', 'title', 'description', 'max_participants', 'event_type',
            'start_datetime', 'banner', 'address',
        ]
        read_only_fields = ['id']

    def update(self, instance, validated_data):
        updated = False

        # Handle new banner upload
        banner_file = validated_data.pop('banner', None)
        if banner_file:
            public_id = upload_image_to_cloudinary(
                banner_file, folder_name="event_banners")
            if public_id:
                instance.banner = public_id
                updated = True

        # Check if max_participants is being updated
        new_max = validated_data.get('max_participants')
        if new_max is not None:
            current_participants = instance.participations.count()
            if new_max < current_participants:
                raise serializers.ValidationError({
                    'max_participants': f"Cannot set Max Participants to {new_max} as there are already {current_participants} participants."
                })

            # If user increased max_participants, make is_full False
            if instance.max_participants != new_max:
                instance.is_full = False
                updated = True

        # Update other fields if changed
        for field, value in validated_data.items():
            if getattr(instance, field) != value:
                setattr(instance, field, value)
                updated = True

        if updated:
            instance.save()
        return instance

################### Join to a community event #################


class EventParticipationSerializer(serializers.ModelSerializer):
    event_id = serializers.IntegerField(write_only=True)

    class Meta:
        model = EventParticipation
        fields = ['event_id', 'message']

    def validate_event_id(self, event_id):
        try:
            event = CommunityEvent.objects.get(id=event_id, is_deleted=False)
        except CommunityEvent.DoesNotExist:
            raise serializers.ValidationError("Event not found.")
        if event.is_full:
            raise serializers.ValidationError("Event is already full.")
        return event_id

    def create(self, validated_data):
        user = self.context['request'].user
        event = CommunityEvent.objects.get(id=validated_data['event_id'])

        # Check if user already joined
        if EventParticipation.objects.filter(user=user, event=event).exists():
            raise serializers.ValidationError(
                "You are already enrolled in this event.")

        # Create participation
        participation = EventParticipation.objects.create(
            user=user,
            event=event,
            message=validated_data.get('message', '')
        )

        # Check if event is full
        if event.max_participants:
            if event.participations.count() >= event.max_participants:
                event.is_full = True
                event.save()

      
        # Create a real time notification to the event creator/admin
        create_and_send_notification(
            recipient=event.created_by,           
            sender=user,                          
            type="event_join",                    
            message=f"{user.username} has joined your event '{event.title}'.",
            community=event.community,            
            image_url=generate_secure_image_url(user.profile_picture)
        )

        return participation

################ Get events and the users who are the participant of that event ##################


class EventParticipantSerializer(serializers.ModelSerializer):
    location_name = serializers.CharField(
        source='address.location_name', read_only=True)
    profile_picture_url = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = ['id', 'username', 'profile_picture_url', 'location_name']

    def get_profile_picture_url(self, user):
        if not user.profile_picture:
            return None  # or a default profile picture URL
        try:
            return generate_secure_image_url(user.profile_picture)
        except Exception as e:
            print(
                f"Error generating profile picture URL for user ID {user.id}: {str(e)}")
            return None

########################## Get Events created by the logged in user ##################


class CommunityEventParticipantGetSerializer(serializers.ModelSerializer):
    community_name = serializers.CharField(
        source='community.name', read_only=True)
    community_id = serializers.IntegerField(
        source='community.id', read_only=True)
    location_name = serializers.CharField(
        source='event_location.location_name', read_only=True)
    full_location = serializers.CharField(
        source='event_location.full_location', read_only=True)
    latitude = serializers.FloatField(
        source='event_location.latitude', read_only=True)
    longitude = serializers.FloatField(
        source='event_location.longitude', read_only=True)
    country = serializers.CharField(
        source='event_location.country', read_only=True)
    banner_url = serializers.SerializerMethodField()
    participants = serializers.SerializerMethodField()

    class Meta:
        model = CommunityEvent
        fields = [
            'id', 'title', 'description',
            'event_type', 'start_datetime', 'max_participants', 'is_full',
            'address', 'created_at', 'updated_at','event_status',  

            # Related Community fields
            'community_id', 'community_name',

            # Related EventLocation fields
            'location_name', 'full_location', 'latitude', 'longitude', 'country',

            # Secure Cloudinary banner
            'banner_url', 'participants',
        ]

    def get_banner_url(self, obj):
        banner_id = obj.banner  # assuming 'banner' stores Cloudinary public_id
        if not banner_id:
            return None  # or return a default fallback URL
        try:
            url = generate_secure_image_url(banner_id)
            return url
        except Exception as e:
            print(
                f"Error generating banner URL for event ID {obj.id}: {str(e)}")
            return None

    def get_participants(self, obj):
        participations = obj.participations.select_related('user').all()
        return EventParticipantSerializer([p.user for p in participations], many=True).data

############## Get the enrolled event history for a user ##########################

class EventEnrollmentHistorySerializer(serializers.ModelSerializer):
    event_id = serializers.IntegerField(source="event.id")
    title = serializers.CharField(source="event.title")
    description = serializers.CharField(source="event.description")
    event_status = serializers.CharField(source="event.event_status")
    start_datetime = serializers.DateTimeField(source="event.start_datetime")
    event_type = serializers.CharField(source="event.event_type")
    address = serializers.CharField(source="event.address", default=None)

    # Banner URL instead of raw string
    banner_url = serializers.SerializerMethodField()

    # Safe location fields
    location_name = serializers.SerializerMethodField()
    country = serializers.SerializerMethodField()

    class Meta:
        model = EventParticipation
        fields = [
            "id",
            "event_id",
            "title",
            "description",
            "banner_url",
            "event_status",
            "start_datetime",
            "event_type",
            "address",
            "location_name",
            "country",
            "joined_at",
        ]

    def get_banner_url(self, obj):
        banner_id = obj.event.banner
        if not banner_id:
            return None
        try:
            return generate_secure_image_url(banner_id)
        except Exception as e:
            print(f"Error generating banner URL for event ID {obj.event.id}: {str(e)}")
            return None

    def get_location_name(self, obj):
        return getattr(obj.event.event_location, 'location_name', None)

    def get_country(self, obj):
        return getattr(obj.event.event_location, 'country', None)
