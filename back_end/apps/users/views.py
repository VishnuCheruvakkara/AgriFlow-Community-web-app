
from django.core.cache import cache
from django.conf import settings
from django.contrib.auth import get_user_model,authenticate
# import from rest_frameworks library
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.exceptions import TokenError
# import file from users folder
from .serializers import LoginSerializer,RegisterSerializer, VerifyOTPSerializer
from .utils import generate_otp_and_send_email
from .services import generate_tokens
########## google authentication ############
from google.auth.transport import requests as google_requests
from google.oauth2 import id_token



User = get_user_model()

################################## User Login  ##################################

class LoginView(APIView):
    """JWT based login"""
    def post(self,request):
        serializer=LoginSerializer(data=request.data)
        if serializer.is_valid():
            email=serializer.validated_data["email"]
            password=serializer.validated_data["password"]

            #Authenticate the user 
            user=authenticate(request,username=email,password=password)
            if not user:
                return Response(
                    {"error":"Invalid email or password !"},
                    status=status.HTTP_401_UNAUTHORIZED,
                )

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
                {"message": "User Sigin succesfully!",
                 "access_token": access_token,
                 "user": user_data,
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
                max_age=int(
                    settings.SIMPLE_JWT["REFRESH_TOKEN_LIFETIME"].total_seconds()),
            )
            return response
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


##################################  User Registration   ###################################

class RegisterView(APIView):
    """User Registration API with OTP Generation"""

    def post(self, request):
        serializer = RegisterSerializer(data=request.data)
        if serializer.is_valid():
            validated_data = serializer.validated_data
            email = validated_data['email']

            try:
                user = User.objects.get(email=email)
                if user.is_verified:
                    return Response(
                        {"error": "Email already exists and is verified. Please log in."},
                        status=status.HTTP_400_BAD_REQUEST
                    )
                   
                else:
                    # Generate OTP and send email (Controlled in utils.py)
                    generate_otp_and_send_email(email)
                    return Response(
                    {"message": "OTP re-sent to your email. Please verify."},
                    status=status.HTTP_200_OK
                )

            except User.DoesNotExist:
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

#####################################  Otp verification  #########################
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
                 "user": user_data,
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
                max_age=int(
                    settings.SIMPLE_JWT["REFRESH_TOKEN_LIFETIME"].total_seconds()),
            )
            return response

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

############################## Logout ###########################3
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
    """Handles Google OAuth callback, verifies the token, and returns JWT access/refresh tokens."""

    def post(self, request, *args, **kwargs):
        # Get the token from the frontend
        token = request.data.get("token")
        if not isinstance(token, str) or not token.strip():
            return Response({"error": "Invalid token format"}, status=status.HTTP_400_BAD_REQUEST)

        try:
            # Verify the token with Google
            google_info = id_token.verify_oauth2_token(
                token, google_requests.Request(), settings.GOOGLE_CLIENT_ID
            )

            # Extract user info
            email = google_info.get("email")
            name = google_info.get("name")
            first_name = google_info.get("given_name")

            if not email:
                return Response({"error": "Invalid token: No email found"}, status=status.HTTP_400_BAD_REQUEST)

            # Check if user exists, create if not
            user, created = User.objects.get_or_create(
                email=email,
                defaults={
                    "username": name,
                    "is_verified": True,
                    "is_active": True
                }
            )

            # Generate JWT tokens
            access_token, refresh_token = generate_tokens(user)

            # Prepare response
            response = Response(
                {
                    "message": "Google authentication successful",
                    "access_token": access_token,
                    "user": {
                        "id": user.id,
                        "name": user.username,
                        "email": user.email,
                        "first_name": first_name
                    },
                },
                status=status.HTTP_200_OK,
            )

            # Set refresh token in HTTP-only cookie
            response.set_cookie(
                key="refresh_token",
                value=refresh_token,
                httponly=True,
                secure=True,
                samesite="Lax",
                max_age=int(
                    settings.SIMPLE_JWT["REFRESH_TOKEN_LIFETIME"].total_seconds()),
            )

            return response

        except ValueError as e:
            return Response({"error": "Invalid token", "details": str(e)}, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            return Response({"error": "Authentication failed", "details": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


