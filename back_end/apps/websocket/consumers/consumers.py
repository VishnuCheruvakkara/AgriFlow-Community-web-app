# your_app/consumers.py
from channels.generic.websocket import AsyncWebsocketConsumer
import json

class TestConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        await self.accept()
        await self.send(text_data=json.dumps({
            'message': 'WebSocket connection successful 🎉'
        }))

    async def disconnect(self, close_code):
        print("Disconnected")

    async def receive(self, text_data):
        print("Received:", text_data)
