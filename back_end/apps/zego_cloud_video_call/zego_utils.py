import time
import jwt  # importing pyjwt (With this library we can cretae the JWT token for the zego cloude )
from django.conf import settings


def generate_token(user_id: str, effective_time_in_seconds: int = 3600, payload: dict = None) -> str:
    """
    Generates a Zego authentication token using HS256 algorithm.

    Args:
        user_id (str): Unique ID of the user joining the session.
        effective_time_in_seconds (int): How long the token is valid (default 3600 = 1 hour).
        payload (dict): Optional extra data to include in token.

    Returns:
        str: Signed JWT token as required by Zego Cloud.
    """
    if payload is None:
        payload = {}

    current_time = int(time.time())

    token_payload = {
        "app_id": int(settings.ZEGO_APP_ID), 
        "user_id": user_id,
        "nonce": current_time, #unique random number (To make the every token unique. )  
        "iat": current_time, #toke  issued time
        "exp": current_time + effective_time_in_seconds,
        "payload": payload
    }

    #Create the signed JWT token for the zego cloud
    token = jwt.encode(
        payload=token_payload,
        key=settings.ZEGO_SERVER_SECRET,
        algorithm="HS256"
    )

    # PyJWT returns a string (Conditional check if bytes)
    if isinstance(token, bytes):
        token = token.decode("utf-8")

    return token
