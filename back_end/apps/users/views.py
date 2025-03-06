
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


