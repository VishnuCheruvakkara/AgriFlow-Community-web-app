import jwt
from django.conf import settings
from channels.db import database_sync_to_async
from channels.middleware import BaseMiddleware
from django.contrib.auth import get_user_model

@database_sync_to_async
def get_user(token):
    try:
        User = get_user_model()  # Move this line inside the function
        payload = jwt.decode(token, settings.SECRET_KEY, algorithms=["HS256"])
        print("Middleware payload is:", payload)
        user = User.objects.get(id=payload['user_id'])
        return user
    except Exception as e:
        print("Error in get_user:", e)
        return None

class JwtAuthMiddleware(BaseMiddleware):
    async def __call__(self, scope, receive, send):
        headers = dict(scope["headers"])
        token = None

        if b"sec-websocket-protocol" in headers:
            protocols = headers[b"sec-websocket-protocol"].decode("utf-8").split(",")
            token = protocols[0].strip()
            # Save the protocols in scope for later use
            scope["subprotocols"] = protocols

        if not token:
            await send({'type': 'websocket.close'})
            return

        scope["user"] = await get_user(token)

        if scope["user"] is None:
            await send({'type': 'websocket.close', 'code': 4001})
            return

        return await super().__call__(scope, receive,send)
