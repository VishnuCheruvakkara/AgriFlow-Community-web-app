from django.urls import re_path 
from apps.websocket.consumers.community_chat_consumer import ChatConsumer
from apps.websocket.consumers.private_chat_consumers import PrivateChatConsumer
from apps.websocket.consumers.notification_consumer import NotificationConsumer
from apps.websocket.consumers.product_chat_consumer import ProductChatConsumer

websocket_urlpatterns = [
    re_path(r"ws/community-chat/(?P<room_name>\w+)/$",ChatConsumer.as_asgi()),
    re_path(r"ws/private-chat/(?P<chat_id>[\w\-]+)/$", PrivateChatConsumer.as_asgi()),
    re_path(r"ws/notification/(?P<user_id>\d+)/$",NotificationConsumer.as_asgi()),
    re_path(r"ws/product-chat/(?P<room_name>[\w\-]+)/$",ProductChatConsumer.as_asgi()),
]
