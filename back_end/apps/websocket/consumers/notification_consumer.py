import json
from channels.generic.websocket import AsyncWebsocketConsumer
import json
from channels.generic.websocket import AsyncWebsocketConsumer


class UserNotificationConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        user = self.scope["user"]
        print("Trying to connect WebSocket...")
        print("User:", user)

        if user.is_anonymous:
            print("User is anonymous, closing connection.")
            await self.close()
        else:
            self.group_name = f"user_{user.id}"
            print(f"User is authenticated. Group name: {self.group_name}")
            await self.channel_layer.group_add(self.group_name, self.channel_name)
            print("Added to group, accepting WebSocket connection.")
            await self.accept(self.scope.get('subprotocols', [])[0] if self.scope.get('subprotocols') else None)

    async def disconnect(self, close_code):
        print(f"Disconnected WebSocket. Code: {close_code}")
        await self.channel_layer.group_discard(self.group_name, self.channel_name)
        print("Removed from group.")

    async def receive(self, text_data):
        print("Received data from client:", text_data)
        # You can also parse and print json.loads(text_data) if it's JSON.

    async def send_notification(self, event):
        data = event.get("data", {})
        await self.send(text_data=json.dumps(data))



class AdminNotificationConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        user = self.scope["user"]
        if user.is_anonymous or not user.is_superuser:
            await self.close()
        else:
            self.group_name = f"admin_{user.id}"
            await self.channel_layer.group_add(self.group_name, self.channel_name)
            await self.accept()

    async def disconnect(self, close_code):
        await self.channel_layer.group_discard(self.group_name, self.channel_name)

    async def receive(self, text_data):
        pass

    async def send_notification(self, event):
        await self.send(text_data=json.dumps({
            'message': event['message'],
            'type': event.get('type', 'admin_notification'),
        }))
