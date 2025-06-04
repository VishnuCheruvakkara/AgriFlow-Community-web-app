
import json
from channels.generic.websocket import AsyncWebsocketConsumer
from channels.db import database_sync_to_async
from back_end.apps import notifications
from users.models import PrivateMessage  # Model for save the messages 
from apps.common.cloudinary_utils import generate_secure_image_url
from redis.asyncio import Redis
from django.conf import settings
# Handle notification 
from apps.notifications.views import create_and_send_notification

class PrivateChatConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        self.chat_id = self.scope['url_route']['kwargs']['chat_id']
        self.room_group_name = f"private_chat_{self.chat_id}"
        self.user = self.scope["user"]

        # Initialize async Redis client
        self.redis = Redis.from_url(settings.REDIS_URL, decode_responses=True)
        self.redis_key = f"chat:online_users:{self.chat_id}"

        # Add this user to the Redis set for this chat room
        await self.redis.sadd(self.redis_key, str(self.user.id))
        # Set expiry to auto-clear stale data (10 minute)
        await self.redis.expire(self.redis_key, 600) 

        await self.channel_layer.group_add(
            self.room_group_name,
            self.channel_name
        )
        await self.accept()

        # Broadcast updated online status to group
        await self.send_online_status()

    async def disconnect(self, close_code):
        # Remove user from Redis set
        await self.redis.srem(self.redis_key, str(self.user.id))

        await self.channel_layer.group_discard(
            self.room_group_name,
            self.channel_name
        )

        # Broadcast updated online status
        await self.send_online_status()

    async def receive(self, text_data):
        data = json.loads(text_data)
        message = data.get("message")
        receiver_id = data.get("receiver_id")

        saved_message = await self.save_private_message(self.user.id, receiver_id, message)

        await self.channel_layer.group_send(
            self.room_group_name,
            {
                "type": "chat_message",
                "message": message,
                "sender_id": self.user.id,
                "sender_name": self.user.username,
                "sender_image": generate_secure_image_url(self.user.profile_picture),
                "timestamp": saved_message.timestamp.isoformat(),
            }
        )

        await self.send

    async def chat_message(self, event):
        await self.send(text_data=json.dumps(event))

    async def send_online_status(self):
        # Get all online user IDs in this chat room
        online_users = await self.redis.smembers(self.redis_key)

        # Broadcast the list of online user IDs to the group
        await self.channel_layer.group_send(
            self.room_group_name,
            {
                "type": "online_status",
                "online_users": list(online_users),
            }
        )

    async def online_status(self, event):
        # Send the online users info to the WebSocket client
        await self.send(text_data=json.dumps({
            "type": "online_status",
            "online_users": event["online_users"]
        }))


    @database_sync_to_async
    def save_private_message(self, sender_id, receiver_id, message):
        return PrivateMessage.objects.create(
            sender_id=sender_id,
            receiver_id=receiver_id,
            message=message
        )
