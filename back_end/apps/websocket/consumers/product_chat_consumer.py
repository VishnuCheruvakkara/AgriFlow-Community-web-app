import json
from channels.generic.websocket import AsyncWebsocketConsumer
from channels.db import database_sync_to_async
from asgiref.sync import sync_to_async
from apps.common.cloudinary_utils import generate_secure_image_url
from apps.notifications.utils import create_and_send_notification
from products.models import ProductChatMessage


class ProductChatConsumer(AsyncWebsocketConsumer):
    async def connect(self):

        self.room_group_name = self.scope['url_route']['kwargs']['room_name']
        self.user = self.scope["user"]

        # Parse product_id from room name format: productchat_<sender>_<receiver>_<product_id>
        try:
            self.product_id = int(self.room_group_name.split("_")[-1])
        except (IndexError, ValueError):
            await self.close()
            return

        await self.channel_layer.group_add(self.room_group_name, self.channel_name)
        await self.accept()

    async def disconnect(self, close_code):
        await self.channel_layer.group_discard(self.room_group_name, self.channel_name)

    async def receive(self, text_data):
        data = json.loads(text_data)
        message = data.get("message")
        receiver_id = data.get("receiver_id")

        saved_message = await self.save_product_message(
            sender_id=self.user.id,
            receiver_id=receiver_id,
            product_id=self.product_id,
            message=message
        )

        full_message = await self.get_message_with_related(saved_message.id)

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

        # Send Notification
        await sync_to_async(create_and_send_notification)(
            recipient=full_message.receiver,
            sender=full_message.sender,
            type="product_message",
            message=full_message.message,
            image_url=generate_secure_image_url(
                full_message.sender.profile_picture),
            product=full_message.product
        )

    async def chat_message(self, event):
        await self.send(text_data=json.dumps(event))

    @database_sync_to_async
    def save_product_message(self, sender_id, receiver_id, product_id, message):
        return ProductChatMessage.objects.create(
            sender_id=sender_id,
            receiver_id=receiver_id,
            product_id=product_id,
            message=message
        )

    @database_sync_to_async
    def get_message_with_related(self, message_id):
        return ProductChatMessage.objects.select_related("sender", "receiver", "product").get(id=message_id)
