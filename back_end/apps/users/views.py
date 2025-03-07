
from django.core.cache import cache
from django.conf import settings
from django.contrib.auth import get_user_model
# import from rest_frameworks library
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.exceptions import TokenError
# import file from users folder
from .serializers import RegisterSerializer, VerifyOTPSerializer
from .utils import generate_otp_and_send_email
from .services import generate_tokens
########## google authentication ############
from google.auth.transport import requests as google_requests
from google.oauth2 import id_token
import requests  # Import the requests library



User = get_user_model()


class RegisterView(APIView):
    """User Registration API with OTP Generation"""

    def post(self, request):
        serializer = RegisterSerializer(data=request.data)
        if serializer.is_valid():
            validated_data = serializer.validated_data
            email = validated_data['email']

            # Create user with is_active=False and is_verified=False
            user = User.objects.create_user(
                email=email,
                username=validated_data['username'],
                password=validated_data['password'],
                is_active=False,   # User cannot log in before verification
                is_verified=False,  # Mark as not verified by OTP
            )

            # Generate OTP and send email (Controlled in utils.py)
            generate_otp_and_send_email(email)

            return Response(
                {"message": "OTP sent successfully to your email."},
                status=status.HTTP_201_CREATED,
            )
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class VerifyOTPView(APIView):
    """OTP Verification API"""

    def post(self, request):
        serializer = VerifyOTPSerializer(data=request.data)
        if serializer.is_valid():
            validated_data = serializer.validated_data
            email = validated_data['email']

            try:
                # Retrieve existing user
                user = User.objects.get(email=email)
            except User.DoesNotExist:
                return Response(
                    {"error": "User not found."},
                    status=status.HTTP_404_NOT_FOUND,
                )

            # Mark user as verified and activate the account
            user.is_verified = True
            user.is_active = True
            user.save()

            # Delete OTP after successful verification
            cache.delete(f"otp_{email}")

            # Generate JWT token (Controlled from services.py)
            access_token, refresh_token = generate_tokens(user)

            # include users details in response
            user_data = {
                "id": user.id,
                "name": user.username,
                "email": user.email,
            }

            # Set access token in the response to handle that with redux state+local storage.
            response = Response(
                {"message": "User registered succesfully!",
                "access_token": access_token,
                "user":user_data,
                },
                status=status.HTTP_201_CREATED
            )
            # Set refresh token in the HTTP-only cookie
            response.set_cookie(
                key="refresh_token",
                value=refresh_token,
                httponly=True,  # Prevents JavaScript access for security
                secure=True,
                samesite="Lax",
                # Directly fetch & convert
                max_age=int(settings.SIMPLE_JWT["REFRESH_TOKEN_LIFETIME"].total_seconds()),
            )
            return response

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class LogoutView(APIView):
    """Logout API to blacklist refresh token and remove cookie"""
    permission_classes = [IsAuthenticated]

    def post(self, request):
        try:
            refresh_token = request.COOKIES.get("refresh_token")
            if not refresh_token:
                return Response({"error": "No refresh token found!"}, status=status.HTTP_400_BAD_REQUEST)

            # Blacklist the token
            refresh = RefreshToken(refresh_token)
            # For blacklisting SIMPLE_JWT['BLACKLIST_AFTER_ROTATION'] = True was present in the settings.py
            refresh.blacklist()

            # Create response
            response = Response(
                {"message": "Successfully logged out!"}, status=status.HTTP_200_OK)

            # Remove the refresh token cookie
            response.delete_cookie("refresh_token")

            return response

        except TokenError:
            return Response({"error": "Invalid token or already logged out"}, status=status.HTTP_400_BAD_REQUEST)

###################  Google authentication ####################

class GoogleAuthCallbackView(APIView):
    """Handles the Google OAuth callback and initiates authentication."""

    def get(self, request):
        authorization_code = request.GET.get("code")

        if not authorization_code:
            return Response({"error": "Authorization code is missing"}, status=status.HTTP_400_BAD_REQUEST)

        # Step 1: Exchange authorization code for access token & ID token
        token_url = "https://oauth2.googleapis.com/token"
        payload = {
            "client_id": settings.GOOGLE_CLIENT_ID,
            "client_secret": settings.GOOGLE_CLIENT_SECRET,
            "code": authorization_code,
            "grant_type": "authorization_code",
            "redirect_uri": settings.GOOGLE_REDIRECT_URI,
        }

        token_response = requests.post(token_url, data=payload)
        token_data = token_response.json()

        if "id_token" not in token_data:
            return Response({"error": "Failed to retrieve ID token", "details": token_data}, status=status.HTTP_400_BAD_REQUEST)

        # Step 2: Directly call GoogleLoginView to verify token and authenticate user
        return GoogleLoginView().post(request, token_data["id_token"])



class GoogleLoginView(APIView):
    """Google OAuth2 Login API"""

    def post(self, request, token=None):
        """Handles Google login/signup, verifies token, creates user, and generates JWT."""

        google_token = token if token else request.data.get("token")
        if not google_token:
            return Response({"error": "Google authentication token is required"}, status=status.HTTP_400_BAD_REQUEST)

        try:
            # Step 1: Verify the Google ID token
            google_info = id_token.verify_oauth2_token(google_token, google_requests.Request(), settings.GOOGLE_CLIENT_ID)
            email = google_info.get("email")
            name = google_info.get("name")

            if not email:
                return Response({"error": "Invalid Google account, email not found"}, status=status.HTTP_400_BAD_REQUEST)

            # Step 2: Create or retrieve the user
            user, created = User.objects.get_or_create(email=email, defaults={"username": name, "is_verified": True, "is_active": True})

            # Step 3: Generate JWT tokens
            access_token, refresh_token = generate_tokens(user)

            # Step 4: Respond with user info and tokens
            response = Response(
                {
                    "message": "Google authentication successful",
                    "access_token": access_token,
                    "user": {"id": user.id, "name": user.username, "email": user.email},
                },
                status=status.HTTP_200_OK,
            )

            # Step 5: Set refresh token in HTTP-only cookie
            response.set_cookie(
                key="refresh_token",
                value=refresh_token,
                httponly=True,
                secure=True,
                samesite="Lax",
                max_age=int(settings.SIMPLE_JWT["REFRESH_TOKEN_LIFETIME"].total_seconds()),
            )

            return response

        except ValueError:
            return Response({"error": "Invalid Google token"}, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)