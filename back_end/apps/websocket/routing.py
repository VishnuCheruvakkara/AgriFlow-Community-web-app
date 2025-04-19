from django.urls import re_path 
from apps.websocket.consumers.notification_consumer import AdminNotificationConsumer, UserNotificationConsumer 
 
websocket_urlpatterns = [
    re_path(r'^ws/notification/user/$',UserNotificationConsumer.as_asgi()),
    re_path(r'^ws/notification/admin/$',AdminNotificationConsumer.as_asgi()),
]