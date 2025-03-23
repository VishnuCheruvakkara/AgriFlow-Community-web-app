
from django.core.cache import cache
from django.conf import settings
from django.contrib.auth import get_user_model, authenticate
# import from rest_frameworks library
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework_simplejwt.tokens import RefreshToken
# import file from users folder
from .serializers import LoginSerializer, RegisterSerializer, VerifyOTPSerializer, AdminLoginSerializer
from .utils import generate_otp_and_send_email
from .services import generate_tokens
########## google authentication ############
from google.auth.transport import requests as google_requests
from google.oauth2 import id_token
######### for refresh token view ##############
from rest_framework.permissions import AllowAny
######### for Forget password section ##############
from .serializers import ForgotPasswordSerialzier, ForgotPasswordVerifyOTPSerializer, ForgotPasswordSetSerializer
from django.contrib.auth.hashers import make_password
from django.utils.timezone import now
from django.contrib.sessions.models import Session
############ for User profile update ##################
#============ for user location updated =============#
from rest_framework.permissions import IsAuthenticated
import requests
#========== for prfile update =====================#
from users.models import FarmingType,Address
from .serializers import UserProfileUpdateSerializer

User = get_user_model()

################################## User Login  ##################################


class LoginView(APIView):
    """JWT based login"""

    def post(self, request):
        serializer = LoginSerializer(data=request.data)
        if serializer.is_valid():
            email = serializer.validated_data["email"]
            password = serializer.validated_data["password"]

            # Authenticate the user
            user = authenticate(request, username=email, password=password)
            if not user:
                return Response(
                    {"error": "Invalid email or password !"},
                    status=status.HTTP_401_UNAUTHORIZED,
                )

            # Generate JWT token (Controlled from services.py)
            refresh_token, access_token = generate_tokens(user)

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
            response.set_cookie(
                key="refresh_token",
                value=refresh_token,
                httponly=True,
                secure=True,  # Change in production as True.
                samesite="None",  # Change as None in production.
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
                    generate_otp_and_send_email(
                        email, email_type="registration")
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
            refresh_token, access_token = generate_tokens(user)

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
                httponly=True,
                secure=True,  # Change in production as True.
                samesite="None",  # Change as None in production.
                max_age=int(
                    settings.SIMPLE_JWT["REFRESH_TOKEN_LIFETIME"].total_seconds()),
            )
            return response

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

####################### Logout ##########################


class LogoutView(APIView):
    """Logout API to remove refresh token and clear cookies"""
    permission_classes = [AllowAny]  # Allow all users to call logout

    def post(self, request):
        try:
            refresh_token = request.COOKIES.get("refresh_token")

            # Blacklist refresh token if exists
            if refresh_token:
                try:
                    refresh = RefreshToken(refresh_token)
                    refresh.blacklist()
                except Exception:
                    pass  # Ignore if already invalid

            # Create response
            response = Response(
                {"message": "Successfully logged out!"}, status=status.HTTP_200_OK)

            # Remove cookies
            response.delete_cookie("refresh_token")

            return response

        except Exception:
            return Response({"message": "Logout failed"}, status=status.HTTP_400_BAD_REQUEST)


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
            refresh_token, access_token = generate_tokens(user)
            print("access_token:", access_token)
            print("refresh_token:", refresh_token)

            from rest_framework_simplejwt.tokens import AccessToken, RefreshToken

            try:
                decoded_access = AccessToken(access_token)
                decoded_refresh = RefreshToken(refresh_token)
                print("Access Token:", decoded_access.payload)
                print("Refresh Token:", decoded_refresh.payload)
            except Exception as e:
                print("Invalid Token:", str(e))

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
                secure=True,  # Change in production as True.
                samesite="None",  # Change as None in production.
                max_age=int(
                    settings.SIMPLE_JWT["REFRESH_TOKEN_LIFETIME"].total_seconds()),
            )
            print("Refresh Token Set:", refresh_token)
            refresh_token = request.COOKIES.get("refresh_token")
            print("refreh____token  ::", refresh_token)

            return response

        except ValueError as e:
            return Response({"error": "Invalid token", "details": str(e)}, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            return Response({"error": "Authentication failed", "details": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


############################ Token creation | working with AuthenticatedAxiosInstance (Axios interceptor)  ###########################

class RefreshTokenView(APIView):
    permission_classes = [AllowAny]  # required

    def post(self, request):
        print("\n🔹 [DEBUG] RefreshTokenView Called")  # Debugging Start
        print("🔹 [DEBUG] Request Headers:", request.headers)
        print("🔹 [DEBUG] Request Cookies:", request.COOKIES)

        refresh_token = request.COOKIES.get('refresh_token')  # Get refresh token from cookies
        print("🔹 [DEBUG] Extracted Refresh Token:", refresh_token)

        if not refresh_token:
            print("❌ [ERROR] Refresh token not found in cookies!")
            return Response(
                {'message': 'Refresh token not found!'},
                status=status.HTTP_401_UNAUTHORIZED
            )

        try:
            # Decode and validate refresh token
            refresh = RefreshToken(refresh_token)
            access_token = str(refresh.access_token)  # Generate new access token

            print("✅ [SUCCESS] New Access Token Generated:", access_token)

            return Response(
                {'access': access_token},
                status=status.HTTP_200_OK
            )
        except Exception as e:
            print(f"❌ [ERROR] Invalid or expired refresh token! Exception: {str(e)}")
            return Response(
                {'message': 'Invalid or expired refresh token!'},
                status=status.HTTP_401_UNAUTHORIZED
            )


##################################################  Forgot password section #####################################

# =============================================== Forgot password email request view ============================
class ForgotPasswordView(APIView):
    def post(self, request):
        serializer = ForgotPasswordSerialzier(data=request.data)
        if serializer.is_valid():
            email = serializer.validated_data['email']
            # Generate OTP and send email (Controlled in utils.py)
            generate_otp_and_send_email(email, email_type="forgot_password")

            return Response({"message": "OTP sent to you email"}, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

# ============================================= Forgot password OTP Verifcation View =====================================

class ForgotPasswordOTPVerifyView(APIView):
    def post(self, request):
        serializer = ForgotPasswordVerifyOTPSerializer(data=request.data)
        if serializer.is_valid():
            return Response({"message": "OTP verified successfully"}, status=status.HTTP_200_OK)
        return Response(serializer.errors, status.HTTP_400_BAD_REQUEST)

# ===========================================  Set new password after OTP verifiction View ====================================
    
class ForgotPasswordSetNewView(APIView):
    """API for resetting password and blacklisting old refresh tokens"""

    def put(self, request):
        serializer = ForgotPasswordSetSerializer(data=request.data)
        if serializer.is_valid():
            email = serializer.validated_data['email']
            new_password = serializer.validated_data['new_password']

            # Find user by email
            user = User.objects.filter(email=email, is_verified=True).first()
            if not user:
                return Response({"error": "User not found."}, status=status.HTTP_404_NOT_FOUND)

            # Blacklist refresh token stored in cookies (if any)
            refresh_token = request.COOKIES.get("refresh_token")
            if refresh_token:
                try:
                    refresh = RefreshToken(refresh_token)
                    refresh.blacklist()  # Blacklist the token
                except Exception:
                    pass  # Ignore if already blacklisted

            # Update password with new password
            user.password = make_password(new_password)
            user.save()

            # Remove all active sessions for this user (force logout everywhere)
            sessions = Session.objects.filter(expire_date__gte=now())
            for session in sessions:
                data = session.get_decoded()
                if str(data.get('_auth_user_id')) == str(user.id):
                    session.delete()  # Remove session

            
            # Create response and remove refresh token from cookies
            response = Response(
                {"message": "Password reset successful! Please log in with your new password."},
                status=status.HTTP_200_OK
            )
            # Remove refresh token from cookies
            response.delete_cookie("refresh_token")

            return response

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


###################################  Resend OTP set-up ##############################

class ResendOTPView(APIView):
    """Handles OTP resending for user authentication"""

    def post(self, request):
        email = request.data.get("email")
        # Default to "registration"
        email_type = request.data.get("email_type", "registration")
        if not email:
            return Response({"error": "Email is required"}, status=status.HTTP_400_BAD_REQUEST)

        # Call the existing function to generate and send OTP with the given email_type
        generate_otp_and_send_email(email, email_type=email_type)

        return Response({"message": "OTP has been resent successfully"}, status=status.HTTP_200_OK)

# Admin Login View for authentication  ###########################3

class AdminLoginView(APIView):
    """JWT-based Admin Login"""

    def post(self, request):
        serializer = AdminLoginSerializer(data=request.data)
        if serializer.is_valid():
            admin_user = serializer.validated_data["user"]

            # Generate JWT tokens
            refresh_token, access_token = generate_tokens(admin_user)

            admin_data = {
                "id": admin_user.id,
                "name": admin_user.username,
                "email": admin_user.email,
                "is_admin": admin_user.is_staff,
            }

            response = Response(
                {
                    "message": "Admin Login Successful!",
                    "access_token": access_token,
                    "user": admin_data,
                },
                status=status.HTTP_200_OK,
            )

            # Set refresh token as HTTP-only cookie
            response.set_cookie(
                key="admin_refresh_token",
                value=refresh_token,
                httponly=True,
                secure=True,  # Change to True in production
                samesite="None",  # Change to None in production
                max_age=int(
                    settings.SIMPLE_JWT["REFRESH_TOKEN_LIFETIME"].total_seconds()),
            )

            return response

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

# ====================  Admin logout view ======================

class AdminLogoutView(APIView):
    """Admin Logout API to remove refresh token and clear cookies"""
    permission_classes = [AllowAny]  # Allow logout without authentication

    def post(self, request):
        try:
            admin_refresh_token = request.COOKIES.get("admin_refresh_token")

            if admin_refresh_token:
                try:
                    refresh = RefreshToken(admin_refresh_token)
                    refresh.blacklist()
                except Exception:
                    pass  # Ignore if already invalid

            response = Response(
                {"message": "Admin successfully logged out!"}, status=status.HTTP_200_OK)
            response.delete_cookie("admin_refresh_token")

            return response

        except Exception:
            return Response({"message": "Admin logout failed"}, status=status.HTTP_400_BAD_REQUEST)

#########################  User profile creation section by taking all the relevent data. ######################################

#=============================  Location IQ view for take user location with logitude abnd latitude ================================#

class LocationAutocompleteView(APIView):

    permission_classes=[IsAuthenticated]

    def get(self, request):
        query = request.GET.get("q", "")

        if len(query) < 2:  # Avoid unnecessary API calls
            return Response({"error": "Query too short"}, status=status.HTTP_400_BAD_REQUEST)

        api_key = settings.LOCATIONIQ_API_KEY  # Replace with your key
        url = f"https://api.locationiq.com/v1/autocomplete?key={api_key}&q={query}&limit=10&dedupe=1"

        try:
            response = requests.get(url)
            data = response.json()

            # Extract relevant fields
            results = [
                {
                    "place_id": place.get("place_id"),
                    "display_name": place.get("display_name"),
                    "latitude": place.get("lat"),
                    "longitude": place.get("lon"),
                    "address": place.get("address", {}),
                }
                for place in data
            ]

            return Response(results, status=status.HTTP_200_OK)

        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


#==========================  User profile image upload with cloudinary ===========================#

import json

class UserProfileUpdateView(APIView):
    """View for updating user profile information."""
    permission_classes = [IsAuthenticated]

    def post(self, request):
        user = request.user  # Get the logged-in user
        
        # Debug: Print request data
        print("🔹 Raw Request Data:", json.dumps(request.data, indent=4))

        serializer = UserProfileUpdateSerializer(data=request.data)

        if not serializer.is_valid():
            print("❌ Serializer Errors:", serializer.errors)  # Debug: Print validation errors
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        data = serializer.validated_data  # Get validated data
        print("✅ Validated Data:", json.dumps(data, indent=4))  # Debug: Print validated data

        # **1. Process Address (Location)**
        location_data = data.get("location", {})
        if location_data:
            print("📍 Location Data:", json.dumps(location_data, indent=4))  # Debug location data
            
            # Check if place_id exists
            if "place_id" not in location_data:
                print("❌ Missing `place_id` in location data!")  # Debug: Missing place_id
                return Response({"error": "Missing required location key: place_id"}, status=status.HTTP_400_BAD_REQUEST)

            address, _ = Address.objects.update_or_create(
                place_id=location_data.get("place_id"),
                defaults={
                    "name": location_data.get("address", {}).get("name", ""),
                    "state": location_data.get("address", {}).get("state", ""),
                    "country": location_data.get("address", {}).get("country", ""),
                    "latitude": location_data.get("latitude", 0),
                    "longitude": location_data.get("longitude", 0),
                    "local_address": request.data.get("address", ""),
                    "location_address": location_data.get("display_name", ""),
                },
            )
            user.address = address  # Link Address to user

        # **2. Process Farming Type**
        farming_type_data = data.get("farmingType", {})
        if farming_type_data:
            print("🌾 Farming Type Data:", json.dumps(farming_type_data, indent=4))  # Debug farming type
            
            # Check if name exists in farmingType
            if "name" not in farming_type_data:
                print("❌ Missing `name` in farmingType data!")  # Debug: Missing name
                return Response({"error": "Farming type name is required."}, status=status.HTTP_400_BAD_REQUEST)

            farming_type, _ = FarmingType.objects.get_or_create(
                name=farming_type_data.get("name"),
                defaults={"description": farming_type_data.get("description", "")}
            )
            user.farming_type = farming_type  # Link FarmingType to user

        # **3. Update Other Fields**
        user.first_name = data["firstName"]
        user.last_name = data["lastName"]
        user.username = data["username"]
        user.email = data["email"]
        user.experience = data.get("experience")
        user.crops_grown = data.get("cropsGrown", user.crops_grown)
        user.bio = data.get("bio", user.bio)

        user.save()  # Save updates

        print("✅ Profile updated successfully!")  # Debug: Success message
        return Response(
            {"message": "Profile updated successfully!", "user": user.email},
            status=status.HTTP_200_OK,
        )