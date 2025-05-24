from django.urls import re_path 
from apps.websocket.consumers.chat_consumer import ChatConsumer
 
websocket_urlpatterns = [
   re_path(r"ws/community-chat/(?P<room_name>\w+)/$",ChatConsumer.as_asgi()),
]
