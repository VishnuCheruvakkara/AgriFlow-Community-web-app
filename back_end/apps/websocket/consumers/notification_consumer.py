import logging
import json 
from channels.generic.websocket import AsyncWebsocketConsumer

logger=logging.getLogger(__name__)

class NotificationConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        try:
            self.user = self.scope['user']
            if self.user.is_anonymous:
                await self.close()
                return 
            
            self.group_name = f"user_{self.user.id}"

            await self.channel_layer.group_add(
                self.group_name,
                self.channel_name
            )
            await self.accept() 
        except Exception as e:
            logger.exception(f"Exception in connect: {e}")

    async def disconnect(self, close_code):
        try:
            await self.channel_layer.group_discard(
                self.group_name,
                self.channel_name
            )
        except Exception as e:
            logger.exception(f"Exception in disconnect: {e}")

    async def send_notification(self,event):
        #send the notification to frontend 
        try:
            await self.send(text_data = json.dumps({
                "type":"notification",
                "data":event["data"]
            }))
        except Exception as e:
            logger.exception(f"Exception sending notification: {e}")