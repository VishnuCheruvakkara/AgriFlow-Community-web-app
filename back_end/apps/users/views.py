
from .serializers import AadharResubmissionMessageSerializer
from users.serializers import UserStatusSerializer
from rest_framework import generics, filters
from django.db.models import Q
from rest_framework.pagination import PageNumberPagination
from users.serializers import GetAllUsersInAdminSideSerializer
from rest_framework.generics import RetrieveAPIView
from .serializers import UserDashboardSerializer
from users.serializers import ProfileUpdateSerializer
from users.models import Address
from django.contrib.auth import get_user_model
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework import permissions
from django.core.cache import cache
from django.conf import settings
from django.contrib.auth import get_user_model, authenticate
# import from rest_frameworks library
from django.shortcuts import get_object_or_404
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework_simplejwt.tokens import RefreshToken
# import file from users folder
from .serializers import AadhaarResubmissionSerializer, AadhaarVerificationSerializer, AdminSideUserDetailPageSerializer, LoginSerializer, RegisterSerializer, VerifyOTPSerializer, AdminLoginSerializer
from .utils import generate_otp_and_send_email
from .services import generate_tokens
########## google authentication ############
from google.auth.transport import requests as google_requests
from google.oauth2 import id_token
######### for refresh token view ##############
from rest_framework.permissions import AllowAny
######### for Forget password section #############
from .serializers import ForgotPasswordSerialzier, ForgotPasswordVerifyOTPSerializer, ForgotPasswordSetSerializer,UserProfileSerializer
from django.contrib.auth.hashers import make_password
from django.utils.timezone import now
from django.contrib.sessions.models import Session
############ for User profile update ##################
# ============ for user location updated =============#
from rest_framework.permissions import IsAuthenticated, IsAdminUser
import requests

from rest_framework_simplejwt.tokens import AccessToken, RefreshToken

# from back_end.apps.users import serializers

# ========== for profile update =====================#

User = get_user_model()

################################## User Login  ##################################


class LoginView(APIView):
    """JWT based login"""

    permission_classes = [AllowAny]

    def post(self, request):
        serializer = LoginSerializer(data=request.data)
        if serializer.is_valid():
            email = serializer.validated_data["email"]
            password = serializer.validated_data["password"]

            # First, get the user from the database
            try:
                user = User.objects.get(email=email)
            except User.DoesNotExist:
                return Response(
                    {"error": "Invalid email or password!"},
                    status=status.HTTP_401_UNAUTHORIZED,
                )

            # Then check if the user is active
            if not user.is_active:
                return Response(
                    {"error": "Your account has been blocked. Please contact support for assistance."},
                    status=status.HTTP_403_FORBIDDEN,
                ) 


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
                "name": user.username,
                "email": user.email,
                "profile_completed": user.profile_completed,
                "aadhar_verification": user.is_aadhar_verified,
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
    permission_classes = [AllowAny]

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

    permission_classes = [AllowAny]

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
                "name": user.username,
                "email": user.email,
                "profile_completed": user.profile_completed,
                "aadhar_verification": user.is_aadhar_verified,
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

    permission_classes = [AllowAny]

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

            # Check if the user is blocked (is_active=False)
            if not user.is_active:
                return Response(
                    {"error": "You are blocked by admin."},
                    status=status.HTTP_403_FORBIDDEN
                )
            
            # Generate JWT tokens
            refresh_token, access_token = generate_tokens(user)
          

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
                        "name": user.username,
                        "email": user.email,
                        "first_name": first_name,
                        "profile_completed": user.profile_completed,
                        "aadhar_verification": user.is_aadhar_verified,

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

# ========================== Token creation for users only =======================================#
class RefreshTokenView(APIView):

    permission_classes = [AllowAny]  # required

    def post(self, request):

        refresh_token = request.COOKIES.get(
            'refresh_token')  # Get refresh token from cookies

        if not refresh_token:

            return Response(
                {'message': 'Refresh token not found!'},
                status=status.HTTP_401_UNAUTHORIZED
            )

        try:
            # Decode and validate refresh token
            refresh = RefreshToken(refresh_token)
            # Generate new access token
            access_token = str(refresh.access_token)

            return Response(
                {'access': access_token},
                status=status.HTTP_200_OK
            )
        except Exception as e:

            return Response(
                {'message': 'Invalid or expired refresh token!'},
                status=status.HTTP_401_UNAUTHORIZED
            )


# ==============================   Token creation for Admin   =====================================#
class AdminRefreshTokenView(APIView):

    # Allow unauthenticated requests to refresh
    permission_classes = [AllowAny]

    def post(self, request, *args, **kwargs):
        print("\n [DEBUG] Admin RefreshTokenView Called")
        print(" [DEBUG] Request Headers:", request.headers)
        print(" [DEBUG] Request Cookies:", request.COOKIES)

        # Admin refresh token from cookies
        admin_refresh_token = request.COOKIES.get('admin_refresh_token')

        print("[DEBUG] Extracted Admin Refresh Token:", admin_refresh_token)

        if not admin_refresh_token:
            print("[ERROR] Admin refresh token not found in cookies!")
            return Response(
                {'message': 'Admin refresh token not found!'},
                status=status.HTTP_401_UNAUTHORIZED
            )

        try:
            # Decode and validate admin refresh token
            refresh = RefreshToken(admin_refresh_token)
            # Generate new access token
            access_token = str(refresh.access_token)

            print("[SUCCESS] New Admin Access Token Generated:", access_token)

            return Response(
                {'access': access_token},
                status=status.HTTP_200_OK
            )
        except Exception as e:
            print(
                f" [ERROR] Invalid or expired admin refresh token! Exception: {str(e)}")
            return Response(
                {'message': 'Invalid or expired admin refresh token!'},
                status=status.HTTP_401_UNAUTHORIZED
            )


##################################################  Forgot password section #####################################

# =============================================== Forgot password email request view ============================
class ForgotPasswordView(APIView):

    permission_classes = [AllowAny]

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

    permission_classes = [AllowAny]

    def post(self, request):
        serializer = ForgotPasswordVerifyOTPSerializer(data=request.data)
        if serializer.is_valid():
            return Response({"message": "OTP verified successfully"}, status=status.HTTP_200_OK)
        return Response(serializer.errors, status.HTTP_400_BAD_REQUEST)

# ===========================================  Set new password after OTP verifiction View ====================================


class ForgotPasswordSetNewView(APIView):
    """API for resetting password and blacklisting old refresh tokens"""

    permission_classes = [AllowAny]

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
    permission_classes = [AllowAny]

    def post(self, request):
        email = request.data.get("email")
        # Default to "registration"
        email_type = request.data.get("email_type", "registration")
        if not email:
            return Response({"error": "Email is required"}, status=status.HTTP_400_BAD_REQUEST)

        # Call the existing function to generate and send OTP with the given email_type
        generate_otp_and_send_email(email, email_type=email_type)

        return Response({"message": "OTP has been resent successfully"}, status=status.HTTP_200_OK)


################################################################
"""" Admin side set up below..."""
################################################################

# Admin Login View for authentication  ###########################3


class AdminLoginView(APIView):
    """JWT-based Admin Login"""
    permission_classes = [AllowAny]

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

# =============================  Location IQ view for take user location with logitude abnd latitude ================================#


class LocationAutocompleteView(APIView):

    permission_classes = [IsAuthenticated]

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


# ==========================  User proflile update view  ===========================#


class ProfileUpdateView(APIView):
    """API endpoint for updating user profile using POST"""
    permission_classes = [
        permissions.IsAuthenticated]  # Only logged-in users can update
    # For handling image uploads
    parser_classes = (MultiPartParser, FormParser)

    def post(self, request, *args, **kwargs):
        """Handle profile update via POST request"""
        user = request.user
        serializer = ProfileUpdateSerializer(
            user, data=request.data, partial=True)
        print("Arived data:", request.data)
        if serializer.is_valid():
            print("Validated Data:", serializer.validated_data)
            serializer.save()
            return Response({"message": "Profile updated successfully", "profile_completed": user.profile_completed}, status=200)

        return Response(serializer.errors, status=400)


########################## Get user data view When user login ##########################


class GetUserDataView(RetrieveAPIView):
    """Fetch user data for dashboard."""

    serializer_class = UserDashboardSerializer
    permission_classes = [IsAuthenticated]  # Require authentication

    def get(self, request, *args, **kwargs):
        """Return authenticated user's details."""
        user = request.user  # Get logged-in user
        print("Logged In user :", user)
        serializer = self.get_serializer(user)  # Serialize data
        return Response(serializer.data)  # Send response


##################  Get all users data in the admin side #######################
# =======================Pagination set up with get user data =======================#
# Pagination part

class CustomUserPagination(PageNumberPagination):
    page_size = 5  # Deafault page size
    page_size_query_param = 'page_size'
    max_page_size = 50  # Limit max page size to avoid performance issues
# Data fetching part


class GetAllUsersInAdminSideView(generics.ListAPIView):
    """
    API view to fetch all users' data.
    Only admin users should access this endpoint.
    """
    serializer_class = GetAllUsersInAdminSideSerializer
    permission_classes = [IsAuthenticated, IsAdminUser]
    pagination_class = CustomUserPagination
    filter_backends = [filters.SearchFilter]
    search_fields = ['username', 'email']

    def get_queryset(self):
        queryset = User.objects.filter(is_superuser=False, is_verified=True)
        filter_type = self.request.query_params.get('filter', None)
        search_query = self.request.query_params.get('search', None)

        # Apply filtering
        if filter_type == 'profile_not_updated':
            queryset = queryset.filter(profile_completed=False)
        elif filter_type == 'aadhaar_not_verified':
            print("This called")
            queryset = queryset.filter(
                is_aadhar_verified=False, profile_completed=True)
        elif filter_type == "active":
            queryset = queryset.filter(is_active=True)  # Active users
        elif filter_type == "blocked":
            queryset = queryset.filter(is_active=False)  # Blocked users

        # Apply Search
        if search_query:
            queryset = queryset.filter(
                Q(username__icontains=search_query) | Q(
                    email__icontains=search_query)
            )

        return queryset

# ================== View for handle status of the user shwowed in the admin side user management ===============================#


class UserStatusUpdateView(generics.UpdateAPIView):
    queryset = User.objects.all()
    serializer_class = UserStatusSerializer
    # Only authenticated admins can change the status
    permission_classes = [IsAuthenticated, IsAdminUser]

    def patch(self, request, *args, **kwargs):
        user = self.get_object()
        # Ensure that the logged-in user has permission to update the status
        if not request.user.is_superuser and request.user != user:
            return Response({"detail": "Permission denied."}, status=status.HTTP_403_FORBIDDEN)
        return self.update(request, *args, **kwargs)

# ======================= Admin side user detail page view set up ======================#


class AdminSideUserDetailView(generics.RetrieveAPIView):
    """Fetch complete user details by ID (Admin Access Only)."""
    queryset = User.objects.filter(is_superuser=False)
    serializer_class = AdminSideUserDetailPageSerializer
    permission_classes = [IsAuthenticated, IsAdminUser]
    lookup_field = 'id'

# ==========================  Change Aadhar Verification status in the usertable View ==============================#


class VerifyAadhaarView(APIView):
    permission_classes = [IsAdminUser]

    def patch(self, request, user_id):
        user = get_object_or_404(User, id=user_id)
        serializer = AadhaarVerificationSerializer(
            user, data={'is_aadhar_verified': True}, partial=True)

        if serializer.is_valid():
            serializer.save()

            # Send welcome email on Aadhaar verification
            generate_otp_and_send_email(
                user.email, email_type="aadhaar_verified")

            return Response({'message': 'Aadhaar verified successfully!', 'data': serializer.data}, status=status.HTTP_200_OK)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

# ============================= Add Resubmission message according the user to the aadhar card in Admin side ====================================#


class UpdateAadharResubmissionMessageView(APIView):
    permission_classes = [permissions.IsAdminUser]

    def patch(self, request, user_id):
        user = get_object_or_404(User, id=user_id)
        serializer = AadharResubmissionMessageSerializer(
            user, data=request.data, partial=True)

        if serializer.is_valid():
            serializer.save()
            return Response({'message': 'Aadhar resubmission message updated successfully!', 'data': serializer.data}, status=status.HTTP_200_OK)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

# ==========================  Aadhar image resubmission view for user resubmission ==========================#


class AadhaarResubmissionUpdateView(APIView):
    permission_classes = [IsAuthenticated]
    parser_classes = [MultiPartParser, FormParser]

    def patch(self, request):
        user = request.user

        serializer = AadhaarResubmissionSerializer(
            user, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response({"message": "Aadhaar resubmission image updated"}, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

##################### Get the user details on the profile page of user and other user can see each other profiles ########################

class UserProfileView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, user_id):
        try:
            user = User.objects.select_related('address').get(id=user_id)
            serializer = UserProfileSerializer(user, context={'request':request})
            return Response(serializer.data)
        except User.DoesNotExist:
            return Response({"error": "User not found"}, status=404)