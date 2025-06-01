from django.urls import re_path 
from apps.websocket.consumers.community_chat_consumer import ChatConsumer
from apps.websocket.consumers.private_chat_consumers import PrivateChatConsumer
 
websocket_urlpatterns = [
    #=============== route for commnuty chat (room_name is taken as community_id)===================#
    re_path(r"ws/community-chat/(?P<room_name>\w+)/$",ChatConsumer.as_asgi()),
    #=============== route for user-to-user single private chat message (chat_id is gnerated form front-end) ================# 
    re_path(r"ws/private-chat/(?P<chat_id>[\w\-]+)/$", PrivateChatConsumer.as_asgi()),

]
