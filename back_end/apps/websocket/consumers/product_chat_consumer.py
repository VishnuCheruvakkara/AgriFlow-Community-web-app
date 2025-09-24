import json
import logging
from channels.generic.websocket import AsyncWebsocketConsumer
from channels.db import database_sync_to_async
from asgiref.sync import sync_to_async
from apps.common.cloudinary_utils import generate_secure_image_url
from apps.notifications.utils import create_and_send_notification
from products.models import ProductChatMessage

logger=logging.getLogger(__name__)

class ProductChatConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        try:
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
        except Exception as e:
            logger.exception(f"Exception in connect: {e}") 

    async def disconnect(self, close_code):
        try:
            await self.channel_layer.group_discard(self.room_group_name, self.channel_name)
        except Exception as e:
            logger.exception(f"Exception in disconnect: {e}")

    async def receive(self, text_data):
        try:
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
        except Exception as e:
            logger.exception(f"Exception in receive: {e}")

    async def chat_message(self, event):
        try:
            await self.send(text_data=json.dumps(event))
        except Exception as e:
            logger.exception(f"Exception sending chat message: {e}")

    @database_sync_to_async
    def save_product_message(self, sender_id, receiver_id, product_id, message):
        try:
            return ProductChatMessage.objects.create(
                sender_id=sender_id,
                receiver_id=receiver_id,
                product_id=product_id,
                message=message
            )
        except Exception as e:
            logger.exception(f"Exception saving product message: {e}")
            return None

    @database_sync_to_async
    def get_message_with_related(self, message_id):
        try:
            return ProductChatMessage.objects.select_related("sender", "receiver", "product").get(id=message_id)
        except Exception as e:
            logger.exception(f"Exception saving product message: {e}")
            return None