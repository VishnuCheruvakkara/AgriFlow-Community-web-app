import json
from channels.generic.websocket import AsyncWebsocketConsumer
from apps.common.cloudinary_utils import generate_secure_image_url
from django.core.cache import cache
# import the redis conifguration in a asynchronous way
from redis.asyncio import Redis
from django.conf import settings
# To save the messages in teh database importing the community model
from community.models import Community, CommunityMessage,CommunityMembership
from channels.db import database_sync_to_async

from notifications.utils import create_and_send_notification
from asgiref.sync import sync_to_async
from django.db.models import Prefetch



class ChatConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        # room name is here get as the community id, not community name
        self.room_name = self.scope['url_route']['kwargs']['room_name']
        self.room_group_name = f'chat_{self.room_name}'
        self.user = self.scope['user']
        self.redis_key = f"chat:online_users:{self.room_name}"

        # Initialize async Redis client first
        self.redis = Redis.from_url(settings.REDIS_URL, decode_responses=True)

        # Add user to Redis set
        await self.add_user_to_room()

        # Join room group
        await self.channel_layer.group_add(
            self.room_group_name,
            self.channel_name  # unique id for every users connected to the room
        )
        await self.accept()  # complete hand shake
        # Broadcast updated user count
        await self.send_user_count()

    async def disconnect(self, close_code):
        # Leave room group
        await self.channel_layer.group_discard(
            self.room_group_name,
            self.channel_name
        )

        # Remove user from Redis
        await self.remove_user_from_room()

        # Broadcast updated user count
        await self.send_user_count()

    # Receive message from front end  then try to send that into the group or Broad cast
    async def receive(self, text_data):
        data = json.loads(text_data)
        event_type = data.get("type", "message")
        user = self.scope["user"]

        if event_type == "typing":
            await self.channel_layer.group_send(
                self.room_group_name,
                {
                    'type': 'user_typing',
                    'username': user.username,
                    'user_id': user.id,
                    'user_image':  generate_secure_image_url(user.profile_picture),
                }
            )
            return

        message = data['message']
        file_url = data.get('file')

        # Save message to the database
        saved_message = await self.save_message(user, self.room_name, message, file_url)

        #Call the notification logic here
        await self.notify_community_members(user, self.room_name, message)

        # Send message to room group
        await self.channel_layer.group_send(
            self.room_group_name,
            {
                'type': 'chat_message',  # below method || function passed as a event argument
                'message': message,
                'media_url': file_url,
                'username': user.username,
                'user_id': user.id,
                'user_image':  generate_secure_image_url(user.profile_picture),
                'timestamp': saved_message.timestamp.isoformat(),
            }
        )

    # Receive message from room group
    async def chat_message(self, event):
        await self.send(text_data=json.dumps({
            'message': event['message'],
            'media_url': event.get('media_url'),
            'username': event['username'],
            'user_id': event['user_id'],
            'user_image': event['user_image'],
            'timestamp': event['timestamp'],
        }))

    # send the user count after getting the online user count
    async def send_user_count(self):
        user_count = await self.get_online_user_count()
        await self.channel_layer.group_send(
            self.room_group_name,
            {
                'type': 'user_count',
                'count': user_count
            }
        )

    async def user_count(self, event):
        await self.send(text_data=json.dumps({
            'type': 'user_count',
            'count': event['count']
        }))

    async def add_user_to_room(self):
        await self.redis.sadd(self.redis_key, str(self.user.id))
        await self.redis.expire(self.redis_key, 600)

    async def remove_user_from_room(self):
        await self.redis.srem(self.redis_key, str(self.user.id))

    async def get_online_user_count(self):
        return await self.redis.scard(self.redis_key)

    # save the message data into the table
    @database_sync_to_async
    def save_message(self, user, community_name, content, media_url=None):
        community = Community.objects.get(id=community_name)
        return CommunityMessage.objects.create(
            user=user,
            community=community,
            content=content,
            media_url=media_url
        )

    async def user_typing(self, event):
        await self.send(text_data=json.dumps({
            'type': 'typing',
            'username': event['username'],
            'user_id': event['user_id'],
            'user_image': event['user_image'],
        }))
        

    # asynchronousely get the communities and members from the dB 
    @database_sync_to_async
    def get_community_and_members(self, community_id):
        return Community.objects.prefetch_related(
            Prefetch('memberships', queryset=CommunityMembership.objects.select_related('user'))
        ).get(id=community_id)

    #Function to send the notifications to community members except sender 
    async def notify_community_members(self, sender, community_id, message):
        community = await self.get_community_and_members(community_id)
        
        # Get all membership objects except the sender's membership
        memberships = [m for m in community.memberships.all() if m.user.id != sender.id and m.status == 'approved']

        for membership in memberships:
            member = membership.user
            try:
                await sync_to_async(create_and_send_notification)(
                    recipient=member,
                    sender=sender,
                    type="community_message",
                    message=message,
                    community=community,
                    image_url=generate_secure_image_url(community.community_logo) if community.community_logo else None
                )
            except Exception as e:
                pass
