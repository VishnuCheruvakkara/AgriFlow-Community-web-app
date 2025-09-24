import logging
from rest_framework_simplejwt.tokens import RefreshToken 

logger=logging.getLogger(__name__)

def generate_tokens(user):
    """Generate JWT access and refresh tokens for a user using Simple JWT."""
    try:
        # Create refresh token
        refresh=RefreshToken.for_user(user)
        # Create access token
        access=refresh.access_token 

        return str(refresh),str(access) 
    except Exception as e:
        logger.exception(f"Exception generating tokens for user {user.id}: {e}")
        return None, None