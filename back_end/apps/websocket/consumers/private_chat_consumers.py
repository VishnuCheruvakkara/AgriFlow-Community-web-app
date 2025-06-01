
import json
from channels.generic.websocket import AsyncWebsocketConsumer
from channels.db import database_sync_to_async
from users.models import PrivateMessage  # You should create this model
from apps.common.cloudinary_utils import generate_secure_image_url

class PrivateChatConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        self.chat_id = self.scope['url_route']['kwargs']['chat_id']
        self.room_group_name = f"private_chat_{self.chat_id}"
        self.user = self.scope["user"]

        await self.channel_layer.group_add(
            self.room_group_name,
            self.channel_name
        )
        await self.accept()

    async def disconnect(self, close_code):
        await self.channel_layer.group_discard(
            self.room_group_name,
            self.channel_name
        )

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

    async def chat_message(self, event):
        await self.send(text_data=json.dumps(event))

    @database_sync_to_async
    def save_private_message(self, sender_id, receiver_id, message):
        return PrivateMessage.objects.create(
            sender_id=sender_id,
            receiver_id=receiver_id,
            message=message
        )
