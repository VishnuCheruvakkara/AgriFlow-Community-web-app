from django.urls import re_path 
from apps.websocket.consumers.community_chat_consumer import ChatConsumer
from apps.websocket.consumers.private_chat_consumers import PrivateChatConsumer
from apps.websocket.consumers.notification_consumer import NotificationConsumer
 
websocket_urlpatterns = [
    #=============== route for commnuty chat (room_name is taken as community_id)===================#
    re_path(r"ws/community-chat/(?P<room_name>\w+)/$",ChatConsumer.as_asgi()),
    #=============== route for user-to-user single private chat message (chat_id is gnerated from front-end) ================# 
    re_path(r"ws/private-chat/(?P<chat_id>[\w\-]+)/$", PrivateChatConsumer.as_asgi()),
    #=============== route for notification controlling (user_id is reciever id here...) =====================#
    re_path(r"ws/notification/(?P<user_id>\d+)/$",NotificationConsumer.as_asgi()),
   
]
