
from rest_framework_simplejwt.tokens import RefreshToken 

def generate_tokens(user):
    """Generate JWT access and refresh tokens for a user using Simple JWT."""

    # Create refresh token
    refresh=RefreshToken.for_user(user)
    # Create access token
    access=refresh.access_token 

    return str(refresh),str(access) 