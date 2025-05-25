
import os
import django 

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'agri_flow.settings')
django.setup() #important : to load the all models just before async operations

from django.core.asgi import get_asgi_application
from channels.routing import ProtocolTypeRouter, URLRouter

from apps.websocket.routing import websocket_urlpatterns
from apps.websocket.middleware import JwtAuthMiddleware

application = ProtocolTypeRouter({
    'http': get_asgi_application(),
    'websocket': JwtAuthMiddleware(
        URLRouter(websocket_urlpatterns)
    )
})

