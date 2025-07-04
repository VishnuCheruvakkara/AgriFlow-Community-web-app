from tkinter import Y
from rest_framework import serializers
from django.contrib.auth import get_user_model
from community.models import Community, CommunityMembership, Tag, CommunityMessage
from apps.common.cloudinary_utils import upload_image_to_cloudinary, generate_secure_image_url
# import the notificaiton set model from notifications named app
from notifications.models import Notification
from django.utils import timezone
# =========== for websocket sset up ==================#
from asgiref.sync import async_to_sync
from channels.layers import get_channel_layer
from apps.notifications.utils import create_and_send_notification

#########################################
# ================= Get the User model ================#
User = get_user_model()
# ================= Get the Channel layers ==============#
channel_layer = get_channel_layer()

########################  Commuity creation realted serializers ##############################

# =========================  Serializer for to get minimum user data ============================#


class UserMinimalSerializer(serializers.ModelSerializer):
    profile_picture = serializers.SerializerMethodField()
    location = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = ['id', 'username', 'profile_picture', 'location']

    def get_profile_picture(self, obj):
        return obj.get_secure_profile_picture_url()

    def get_location(self, obj):
        if obj.address:
            return {
                "location_name": obj.address.location_name,
                "country": obj.address.country
            }
        return None

# ==========================  Community creation serializer ===========================#


class CommunitySerializer(serializers.ModelSerializer):
    tags = serializers.ListField(
        child=serializers.CharField(), write_only=True)
    members = serializers.ListField(
        child=serializers.IntegerField(), write_only=True)
    communityImage = serializers.ImageField(write_only=True, required=False)
    message = serializers.CharField(write_only=True, required=False)

    class Meta:
        model = Community
        fields = ['name', 'description', 'is_private',
                  'tags', 'members', 'communityImage', 'message']

    def create(self, validated_data):
        tags = validated_data.pop('tags', [])
        member_ids = validated_data.pop('members', [])
        image = validated_data.pop('communityImage', None)
        user = self.context['request'].user
        # Create community
        community = Community.objects.create(created_by=user, **validated_data)
        message = validated_data.pop(
            'message', f"{user.username} invited you to join the community '{community.name}'.")

        # Upload image to Cloudinary if provided
        if image:
            public_id = upload_image_to_cloudinary(
                image, folder_name="community_logos")
            if public_id:
                community.community_logo = public_id
                community.save()

        # Add tags
        for tag in tags:
            tag_obj, _ = Tag.objects.get_or_create(name=tag)
            community.tags.add(tag_obj)

        # Add invited members
        for uid in member_ids:
            CommunityMembership.objects.create(
                user_id=uid,
                community=community,
                status='pending',
                message=message,
                approved_by=None,
                joined_at=None
            )

        # Send notifications to all invited members
        community_logo_url = generate_secure_image_url(
            community.community_logo)
        for uid in member_ids:
            recipient = User.objects.get(id=uid)  # if not already prefetched
            create_and_send_notification(
                recipient=recipient,
                sender=user,
                type='community_invite',
                message=message,
                community=community,
                image_url=community_logo_url
            )

        # Add creator as admin
        CommunityMembership.objects.create(
            user=user,
            community=community,
            status='approved',
            is_admin=True,
            joined_at=timezone.now(),
        )

        return community

# ==========================  Serializer for get the My-community ===========================#


class GetMyCommunitySerializer(serializers.ModelSerializer):
    id = serializers.IntegerField(source='community.id')
    name = serializers.CharField(source='community.name')
    is_admin = serializers.BooleanField()
    members_count = serializers.SerializerMethodField()
    logo = serializers.SerializerMethodField()

    class Meta:
        model = CommunityMembership
        fields = ['id', 'name', 'is_admin', 'members_count', 'logo']

    def get_members_count(self, obj):
        return obj.community.memberships.filter(status='approved').count()

    def get_logo(self, obj):
        public_id = obj.community.community_logo
        return generate_secure_image_url(public_id)


########################  community pending request section serializer set up ###################################
#########################  part-1 serialzer #############################
# ======================= Communty pending request to the useres serializer ==============================#

class CommunityInviteSerializer(serializers.ModelSerializer):
    community_name = serializers.CharField(
        source='community.name', read_only=True)
    community_logo = serializers.SerializerMethodField()
    invited_by = serializers.SerializerMethodField()
    invited_on = serializers.SerializerMethodField()

    class Meta:
        model = CommunityMembership
        fields = [
            'id',
            'community',
            'community_name',
            'community_logo',
            'invited_by',
            'invited_on',
        ]

    def get_invite_notification(self, obj):
        return obj.community.notifications.filter(
            recipient=obj.user,
            community=obj.community,
            notification_type='community_invite'
        ).order_by('-created_at').first()

    def get_invited_by(self, obj):
        invite_notification = self.get_invite_notification(obj)
        if invite_notification and invite_notification.sender:
            sender = invite_notification.sender
            return {
                'id': sender.id,
                'name': sender.username,
                'message': invite_notification.message,
                'profile_picture': sender.get_secure_profile_picture_url(),
            }
        return None

    def get_invited_on(self, obj):
        invite_notification = self.get_invite_notification(obj)
        return invite_notification.created_at if invite_notification else None

    def get_community_logo(self, obj):
        public_id = obj.community.community_logo
        return generate_secure_image_url(public_id) if public_id else ""

# ======================= Communty pending request accept or regect ==============================#


class CommunityInvitationResponseSerializer(serializers.Serializer):
    community_id = serializers.IntegerField()
    action = serializers.ChoiceField(choices=["accept", "ignore"])

    def validate(self, attrs):
        user = self.context['request'].user
        community_id = attrs.get('community_id')
        try:
            membership = CommunityMembership.objects.get(
                user=user, community_id=community_id, status='pending')
        except CommunityMembership.DoesNotExist:
            raise serializers.ValidationError(
                "No pending invitation found for this community.")

        attrs['membership'] = membership
        return attrs

####################################  part - 2  serializer ###############################################

# ====================== get all request that send by admin while creating the community ==========================#


class CommunityWithPendingUsersSerializer(serializers.ModelSerializer):
    id = serializers.IntegerField()
    name = serializers.CharField()
    community_logo = serializers.SerializerMethodField()
    pending_users = serializers.SerializerMethodField()

    class Meta:
        model = Community
        fields = ['id', 'name', 'community_logo', 'pending_users']

    def get_community_logo(self, obj):
        # community_logo is assumed to be public_id
        return generate_secure_image_url(obj.community_logo)

    def get_pending_users(self, obj):

        pending_memberships = CommunityMembership.objects.filter(
            community=obj, status='pending'
        ).select_related('user')

        result = []
        for membership in pending_memberships:
            user = membership.user
            result.append({
                'user_id': user.id,
                "username": user.username,
                'invited_at': membership.updated_at if membership.updated_at else None,
                "profile_picture": generate_secure_image_url(user.profile_picture)
            })

        return result

# =================== cancell the request send by admin to user while community creation =====================#


class CommunityMembershipSerializer(serializers.ModelSerializer):
    class Meta:
        model = CommunityMembership
        fields = ['user', 'community', 'status', 'is_admin',
                  'message', 'approved_by', 'joined_at']

    def update(self, instance, validated_data):
        instance.status = 'cancelled'
        instance.save()
        return instance


####################################  part - 3  serializer ###############################################

# ====================== get pening reqest waiting for admin aproval ==========================#
# No serializer for get data and cancell |  refer the View logic


####################################  part - 4 serializer ###############################################

# ====================== show the request in the group admin ( get the data ) ==========================#

class RequestedUserSerializer(serializers.ModelSerializer):
    requested_at = serializers.SerializerMethodField()
    profile_picture = serializers.SerializerMethodField()
    username = serializers.CharField(source='user.username')
    user_id = serializers.IntegerField(source='user.id')

    class Meta:
        model = CommunityMembership
        fields = ['user_id', 'username', 'requested_at', 'profile_picture']

    def get_requested_at(self, obj):
        if obj.status == "requested" and obj.updated_at:
            return obj.updated_at
        return None

    def get_profile_picture(self, obj):
        return generate_secure_image_url(obj.user.profile_picture)


class CommunityWithRequestsSerializer(serializers.ModelSerializer):
    community_logo = serializers.SerializerMethodField()
    requested_users = serializers.SerializerMethodField()

    class Meta:
        model = Community
        fields = ['id', 'name', 'community_logo', 'requested_users']

    def get_community_logo(self, obj):
        return generate_secure_image_url(obj.community_logo)

    def get_requested_users(self, obj):
        memberships = obj.memberships.filter(
            status='requested').select_related('user')
        return RequestedUserSerializer(memberships, many=True).data

# ========================== Change status : aprove or rejected ========================#


class CommunityMembershipStatusUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = CommunityMembership
        fields = ['status']

    def validate_status(self, value):
        if value not in ['approved', 'rejected']:
            raise serializers.ValidationError(
                "Status must be either 'approved' or 'rejected'")
        return value


##########################  Get communities in the user side #######################

class CommunityMemberPreviewSerializer(serializers.ModelSerializer):
    profile_picture = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = ['id', 'username', 'profile_picture']

    def get_profile_picture(self, obj):
        return obj.get_secure_profile_picture_url()


class GetCommunitySerializer(serializers.ModelSerializer):
    members_count = serializers.SerializerMethodField()
    community_logo = serializers.SerializerMethodField()
    sample_members = serializers.SerializerMethodField()

    class Meta:
        model = Community
        fields = ['id', 'name', 'description', 'is_private',
                  'community_logo', 'members_count', 'sample_members']

    def get_members_count(self, obj):
        return obj.memberships.filter(status='approved').count()

    def get_community_logo(self, obj):
        return generate_secure_image_url(obj.community_logo)

    def get_sample_members(self, obj):
        # Get 3 approved members from CommunityMembership
        approved_memberships = obj.memberships.filter(
            status='approved').select_related('user')[:3]
        users = [membership.user for membership in approved_memberships]
        return CommunityMemberPreviewSerializer(users, many=True).data

# request to join a community ##################3


class CommunityMembershipRequestSerializer(serializers.ModelSerializer):
    class Meta:
        model = CommunityMembership
        fields = ['id', 'community', 'user', 'status', 'joined_at', 'is_admin']
        read_only_fields = ['id', 'joined_at', 'is_admin']

###################  get community and the members who belong to the community in the community details section #################


class CommunityMemberSerializer(serializers.ModelSerializer):
    id = serializers.IntegerField(source='user.id')
    username = serializers.CharField(source='user.username')
    email = serializers.EmailField(source='user.email')
    is_admin = serializers.BooleanField()
    profile_image = serializers.SerializerMethodField()

    class Meta:
        model = CommunityMembership
        fields = ['id', 'username', 'email', 'is_admin', 'profile_image']

    def get_profile_image(self, obj):
        """
        Generate a secure URL for the user's image.
        """
        user = obj.user
        if user.profile_picture:
            return generate_secure_image_url(user.profile_picture)
        return None


class CommunityDeatilsSerializer(serializers.ModelSerializer):
    members = serializers.SerializerMethodField()
    community_logo = serializers.SerializerMethodField()

    class Meta:
        model = Community
        fields = ['id', 'name', 'description', 'is_private',
                  'created_at', 'created_by', 'members', 'community_logo']

    def get_members(self, obj):
        """
        Return only approved members of the community.
        """
        approved_memberships = obj.memberships.filter(status='approved')
        return CommunityMemberSerializer(approved_memberships, many=True).data

    def get_community_logo(self, obj):
        """
        Generate a secure URL for the community image.
        """
        if obj.community_logo:
            return generate_secure_image_url(obj.community_logo)
        return None

####################  Admin of a group can add new members to the community (send request) Serializer  ######################


class AddNewCommunityMemberSerializer(serializers.ModelSerializer):
    class Meta:
        model = CommunityMembership
        fields = ['user', 'community', 'status', 'is_admin']

    def validate(self, data):
        # Check if the user has a cancelled membership
        cancelled_membership = CommunityMembership.objects.filter(
            user=data['user'], community=data['community'], status='cancelled'
        ).first()

        # If there is a cancelled membership, we allow re-adding the user
        if cancelled_membership:
            return data

        # Otherwise, check if the user is already a member with a non-cancelled status
        if CommunityMembership.objects.filter(
            user=data['user'], community=data['community']
        ).exclude(status='cancelled').exists():
            raise serializers.ValidationError(
                "This user is already a member of the community.")

        return data

################### creator of a community can edit the name,description and community image Serializer ##################


class CommunityEditSerializer(serializers.ModelSerializer):
    community_logo = serializers.ImageField(
        required=False, write_only=True)  # Accept image file, not string

    class Meta:
        model = Community
        fields = ['name', 'description', 'community_logo']

    def update(self, instance, validated_data):
        image_file = validated_data.pop(
            'community_logo', None)  # Pop to avoid string error
        if image_file:
            public_id = upload_image_to_cloudinary(
                image_file, folder_name=instance.name)
            if public_id:
                instance.community_logo = public_id

        # Update other fields
        for attr, value in validated_data.items():
            setattr(instance, attr, value)

        instance.save()
        return instance

############################ Serializer for get the community messages from the table ###############################


class CommunityMessageSerializer(serializers.ModelSerializer):
    message = serializers.CharField(source='content')
    user_id = serializers.IntegerField(source='user.id')
    username = serializers.CharField(source='user.username')
    user_image = serializers.SerializerMethodField()
    timestamp = serializers.DateTimeField()
    media_url = serializers.URLField()

    class Meta:
        model = CommunityMessage
        fields = ['message', 'user_id', 'user_image',
                  'username', 'timestamp', 'media_url']

    def get_user_image(self, obj):
        return generate_secure_image_url(obj.user.profile_picture)


#######################  Admin side community management serializer  ###############################

# =================== Get aommunity data in the admin side table serializer =====================#

class SimpleCommunityAdminSerializer(serializers.ModelSerializer):
    members_count = serializers.SerializerMethodField()
    created_by_username = serializers.CharField(source="created_by.username")
    created_by_id = serializers.IntegerField(source="created_by.id")
    created_by_profile_picture = serializers.SerializerMethodField()
    community_logo = serializers.SerializerMethodField()

    class Meta:
        model = Community
        fields = [
            "id",
            "name",
            "description",
            "is_private",
            "created_at",
            "created_by_id",
            "created_by_username",
            "created_by_profile_picture",
            "members_count",
            "community_logo",
            "is_deleted",
        ]

    def get_members_count(self, obj):
        return obj.memberships.filter(status="approved").count()

    def get_community_logo(self, obj):
        if obj.community_logo:
            return generate_secure_image_url(obj.community_logo)
        return None

    def get_created_by_profile_picture(self, obj):
        if obj.created_by and obj.created_by.profile_picture:
            return generate_secure_image_url(obj.created_by.profile_picture)
        return None
