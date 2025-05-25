import json
from channels.generic.websocket import AsyncWebsocketConsumer
from apps.common.cloudinary_utils import generate_secure_image_url
from django.core.cache import cache
# import the redis conifguration in a asynchronous way 
from redis.asyncio import Redis
from django.conf import settings
#To save the messages in teh database importing the community model  
from community.models import Community,CommunityMessage
from channels.db import database_sync_to_async



class ChatConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        #room name is here get as the community id, not community name
        self.room_name = self.scope['url_route']['kwargs']['room_name']
        self.room_group_name = f'chat_{self.room_name}'
        self.user = self.scope['user'] 
        self.redis_key=f"chat:online_users:{self.room_name}"

        # Initialize async Redis client first
        self.redis = Redis.from_url(settings.REDIS_URL, decode_responses=True)

        # Add user to Redis set
        await self.add_user_to_room()

        # Join room group
        await self.channel_layer.group_add(
            self.room_group_name,
            self.channel_name #unique id for every users connected to the room 
        )
        await self.accept() # complete hand shake
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
        message = data['message']
        user = self.scope["user"]

        # Save message to the database
        saved_message = await self.save_message(user, self.room_name, message)
       
        # Send message to room group
        await self.channel_layer.group_send(
            self.room_group_name,
            {
                'type': 'chat_message', # below method || function passed as a event argument
                'message': message,
                'username': user.username,
                'user_id':user.id,
                'user_image':  generate_secure_image_url(user.profile_picture) ,
                'timestamp': saved_message.timestamp.isoformat(),
            }
        )

    # Receive message from room group
    async def chat_message(self, event):
        await self.send(text_data=json.dumps({
            'message': event['message'],
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
                'type':'user_count',
                'count':user_count 
            }
        ) 

    async def user_count(self,event):
        await self.send(text_data=json.dumps({
            'type':'user_count',
            'count':event['count']
        }))

    async def add_user_to_room(self):
        await self.redis.sadd(self.redis_key, str(self.user.id))
        await self.redis.expire(self.redis_key, 600)

    async def remove_user_from_room(self):
        await self.redis.srem(self.redis_key, str(self.user.id))

    async def get_online_user_count(self):
        return await self.redis.scard(self.redis_key)

    @database_sync_to_async
    def save_message(self, user, community_name, content):
        community = Community.objects.get(id=community_name)
        return CommunityMessage.objects.create(
            user=user,
            community=community,
            content=content
        )
    