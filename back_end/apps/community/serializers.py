from tkinter import Y
from rest_framework import serializers
from django.contrib.auth import get_user_model
from community.models import Community,CommunityMembership,Tag 
from apps.common.cloudinary_utils import upload_image_to_cloudinary,generate_secure_image_url
#import the notificaiton set model from notifications named app
from notifications.models import Notification
from django.utils import timezone
#=========== for websocket sset up ==================# 
from asgiref.sync import async_to_sync
from channels.layers import get_channel_layer

#########################################
#================= Get the User model ================#
User = get_user_model()
#================= Get the Channel layers ==============# 
channel_layer = get_channel_layer()

########################  Commuity creation realted serializers ##############################

#=========================  Serializer for to get minimum user data ============================#
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
    
#==========================  Community creation serializer ===========================# 

class CommunitySerializer(serializers.ModelSerializer):
    tags = serializers.ListField(child=serializers.CharField(), write_only=True)
    members = serializers.ListField(child=serializers.IntegerField(), write_only=True)
    communityImage = serializers.ImageField(write_only=True, required=False)
    join_message = serializers.CharField(write_only=True, required=False)

    class Meta:
        model = Community
        fields = ['name', 'description', 'is_private', 'tags', 'members', 'communityImage', 'join_message']

    def create(self, validated_data):
        tags = validated_data.pop('tags', [])
        member_ids = validated_data.pop('members', [])
        image = validated_data.pop('communityImage', None)
        user = self.context['request'].user
        # Create community
        community = Community.objects.create(created_by=user, **validated_data)
        join_message = validated_data.pop('join_message',f"{user.username} invited you to join the community '{community.name}'.")

        # Upload image to Cloudinary if provided
        if image:
            public_id = upload_image_to_cloudinary(image, folder_name="community_logos")
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
                join_message=join_message,
                approved_by=None,
                joined_at=None 
            )

        # Send notifications to all invited members
        for uid in member_ids:
            Notification.objects.create(
                recipient_id=uid,
                sender=user,
                community=community,
                notification_type='community_invite',
                message=join_message,
            )
        
        for uid in member_ids:
            async_to_sync(channel_layer.group_send)(
                f"user_{uid}",  # each user has their own channel group
                {
                    "type": "send_notification",
                    "message": f"{user.username} invited you to join '{community.name}'",
                    "notification_type": "community_invite",
                    "community_id": community.id
                }
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

#==========================  Serializer for get the My-community ===========================# 

class GetMyCommunitySerializer(serializers.ModelSerializer):
    id = serializers.IntegerField(source='community.id')  
    name = serializers.CharField(source='community.name')
    is_admin = serializers.BooleanField()
    members_count = serializers.SerializerMethodField()
    logo = serializers.SerializerMethodField()
    class Meta:
        model = CommunityMembership 
        fields = ['id','name','is_admin','members_count','logo']

    def get_members_count(self,obj):
        return obj.community.memberships.filter(status='approved').count()
    
    def get_logo(self,obj):
        public_id = obj.community.community_logo  
        return generate_secure_image_url(public_id)


########################  community pending request section serializer set up ################################### 

#======================= Communty pending request to the useres serializer ==============================# 

class CommunityInviteSerializer(serializers.ModelSerializer):
    community_name = serializers.CharField(source='community.name', read_only=True)
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
    
#======================= Communty pending request accept or regect ==============================# 

class CommunityInvitationResponseSerializer(serializers.Serializer):
    community_id = serializers.IntegerField()
    action = serializers.ChoiceField(choices=["accept", "ignore"])

    def validate(self, attrs):
        user = self.context['request'].user
        community_id = attrs.get('community_id')
        try:
            membership = CommunityMembership.objects.get(user=user, community_id=community_id, status='pending')
        except CommunityMembership.DoesNotExist:
            raise serializers.ValidationError("No pending invitation found for this community.")

        attrs['membership'] = membership
        return attrs
