# core/signals.py

from django.db.models.signals import post_save
from django.dispatch import receiver
from asgiref.sync import async_to_sync
from channels.layers import get_channel_layer

from community.models import CommunityMembership
from apps.websocket.utils import get_invite_payload

channel_layer = get_channel_layer()

@receiver(post_save, sender=CommunityMembership)
def send_community_invite_notification(sender, instance, created, **kwargs):
    if created and instance.status == 'pending':
        # Get all pending members of the same community
        pending_memberships = instance.community.memberships.filter(status='pending')

        for membership in pending_memberships:
            # Serialize the payload for each member
            payload = get_invite_payload(membership)

            # Send WebSocket notification to each user
            async_to_sync(channel_layer.group_send)(
                f"user_{membership.user.id}",
                {
                    "type": "send_invite_notification",
                    "payload": payload
                }
            )
