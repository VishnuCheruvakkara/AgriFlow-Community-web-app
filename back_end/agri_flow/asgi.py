
import os

from django.core.asgi import get_asgi_application
from channels.routing import ProtocolTypeRouter, URLRouter
from channels.auth import AuthMiddlewareStack
from apps.websocket.routing import websocket_urlpatterns
from apps.websocket.middleware import JwtAuthMiddleware


os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'agri_flow.settings')

application = ProtocolTypeRouter({
    'http': get_asgi_application(),
    'websocket': JwtAuthMiddleware(
        URLRouter(websocket_urlpatterns)
    )
})

