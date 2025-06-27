from cloudinary.utils import cloudinary_url
import cloudinary.uploader
import cloudinary
import json
from users.models import Address
import re
from django.core.cache import cache
from rest_framework import serializers
from django.contrib.auth import get_user_model
# for inbuild password validation
from django.contrib.auth.password_validation import validate_password
# for inbuild email validation
from django.core.validators import EmailValidator
# To authenticate the user
from django.contrib.auth import authenticate
# import model from community
from community.models import CommunityMembership
# impot model from connection
from connections.models import Connection
from django.db.models import Q
# get secure image url using id, get image from cloudinary
from apps.common.cloudinary_utils import generate_secure_image_url
from datetime import timedelta
from django.utils import timezone
from users.models import PrivateMessage

User = get_user_model()

# User Login  ################################3


class LoginSerializer(serializers.Serializer):
    """Serializer for user login"""
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True, required=True)

################################## User registration ####################################


class RegisterSerializer(serializers.ModelSerializer):
    password2 = serializers.CharField(
        write_only=True, required=True, label="Confirm Password")
    email = serializers.EmailField(
        validators=[EmailValidator(message="Enter a valid email address.")])

    class Meta:
        model = User
        fields = ['email', 'username', 'password', 'password2']
        extra_kwargs = {
            'password': {'write_only': True},
            'username': {'validators': []},  # Disable the default UniqueValidator
        }

    def validate(self, data):
        """Ensure password and password2 match"""
        if data['password'] != data['password2']:
            raise serializers.ValidationError(
                {"password": "Passwords do not match!"})
        return data

    def validate_password(self, password):
        """Custom password validation with industry standards."""
        if len(password) < 8:
            raise serializers.ValidationError(
                {"password": "Password must be at least 8 characters long."})

        if not re.search(r'[A-Z]', password):
            raise serializers.ValidationError(
                {"password": "Password must contain at least one uppercase letter."})

        if not re.search(r'[a-z]', password):
            raise serializers.ValidationError(
                {"password": "Password must contain at least one lowercase letter."})

        if not re.search(r'\d', password):
            raise serializers.ValidationError(
                {"password": "Password must contain at least one digit."})

        if not re.search(r'[!@#$%^&*(),.?":{}|<>]', password):
            raise serializers.ValidationError(
                {"password": "Password must contain at least one special character."})

        if ' ' in password:
            raise serializers.ValidationError(
                {"password": "Password cannot contain spaces."})

        return password

    def validate_email(self, value):
        """Manually check if email exists but allow unverified users"""
        user = User.objects.filter(email=value).first()
        if user:
            if user.is_verified:
                raise serializers.ValidationError(
                    "Enter a valid email address")
            else:
                return value  # Allow the user to proceed if unverified
        return value  # Allow new users

    def validate_username(self, value):
        """Ensure username contains only letters (uppercase/lowercase) and spaces, and has at least 4 characters"""
        # Remove leading and trailing spaces
        value = value.strip()

        existing_user = User.objects.filter(username=value).first()
        if existing_user:
            if existing_user.is_verified:
                raise serializers.ValidationError(
                    "Username already taken. Please choose another one.")
            # else: allow reuse of username if not verified

        if len(value) < 4:
            raise serializers.ValidationError(
                "Username must be at least 4 characters long.")

        if not re.match(r'^[A-Za-z ]+$', value):
            raise serializers.ValidationError(
                "Username can only contain letters and spaces. No numbers or special characters allowed.")

        return value

    # To override over the normaml serializer validation of email (For is_verified=False users)
    email = serializers.EmailField()

####################################  Otp verification ########################################


class VerifyOTPSerializer(serializers.Serializer):
    email = serializers.EmailField()
    otp = serializers.CharField(max_length=6)

    def validate(self, data):
        """Validate OTP"""
        email = data['email']
        otp = data['otp']

        # Retrieve OTP from cache
        cached_otp = cache.get(f"otp_{email}")

        if not cached_otp or cached_otp != otp:
            raise serializers.ValidationError(
                {"otp": "Invalid or expired OTP!"})

        return data

##################################  Forgot password section ###########################

# ================================ Forgot password email serializer =========================


class ForgotPasswordSerialzier(serializers.Serializer):
    email = serializers.EmailField()

    def validate_email(self, value):
        """Check if email exist and is Verified = True"""
        user = User.objects.filter(email=value, is_verified=True).first()

        if not user:
            raise serializers.ValidationError(
                "No verified account found with this email.")
        return value


# =============================== Forgot password email otp verification view =======================

class ForgotPasswordVerifyOTPSerializer(serializers.Serializer):
    email = serializers.EmailField()
    otp = serializers.CharField(max_length=6, min_length=6)

    def validate(self, data):
        """Check if OTP is correct"""
        email = data["email"]
        otp = data["otp"]
        stored_otp = cache.get(f"otp_{email}")

        if stored_otp is None:
            raise serializers.ValidationError(
                {"otp": "OTP expired or invalid. Request a new one."})

        if stored_otp != otp:
            raise serializers.ValidationError(
                {"otp": "Incorrect OTP. Please try again"})
        return data

# =============================  Forgot passwort set new password after otp verification =================================


class ForgotPasswordSetSerializer(serializers.Serializer):
    email = serializers.EmailField()
    new_password = serializers.CharField(write_only=True)
    confirm_password = serializers.CharField(write_only=True)

    def validate_new_password(self, password):
        """Custom password validation with industry standards."""
        if len(password) < 8:
            raise serializers.ValidationError(
                "Password must be at least 8 characters long.")

        if not re.search(r'[A-Z]', password):
            raise serializers.ValidationError(
                "Password must contain at least one uppercase letter.")

        if not re.search(r'[a-z]', password):
            raise serializers.ValidationError(
                "Password must contain at least one lowercase letter.")

        if not re.search(r'\d', password):
            raise serializers.ValidationError(
                "Password must contain at least one digit.")

        if not re.search(r'[!@#$%^&*(),.?\":{}|<>]', password):
            raise serializers.ValidationError(
                "Password must contain at least one special character.")

        if ' ' in password:
            raise serializers.ValidationError(
                "Password cannot contain spaces.")

        return password

    def validate_confirm_password(self, confirm_password):
        """Validate confirm_password field separately to ensure it matches new_password."""
        new_password = self.initial_data.get("new_password")

        if new_password and confirm_password != new_password:
            raise serializers.ValidationError("Passwords do not match.")

        return confirm_password


# For admin related authentiation serializers  ##############################3

class AdminLoginSerializer(serializers.Serializer):
    """Serializer for admin login"""
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True, required=True)

    def validate(self, data):
        email = data.get("email")
        password = data.get("password")

        # Authenticate user
        user = authenticate(username=email, password=password)
        if not user:
            raise serializers.ValidationError("Invalid email or password!")

        # Ensure only admins can log in
        if not user.is_staff:
            raise serializers.ValidationError(
                "Access denied. Admin privileges required.")

        return {
            "user": user  # Return the actual User instance
        }

########################  User proile updation section serilizes #######################
# =========================== User profile updation ========================#

from rest_framework import serializers
from django.contrib.auth import get_user_model
from users.models import Address
import json
from .validators import (
    validate_phone_number, validate_experience, validate_email,
    validate_aadhaar_image, validate_profile_image, validate_name,
    validate_date_of_birth, validate_text_field, validate_home_address
)

class ProfileUpdateSerializer(serializers.ModelSerializer):
    """Unified serializer for updating user profile, address, and file uploads."""

    profileImage = serializers.ImageField(
        required=False, write_only=True, validators=[validate_profile_image])
    aadhaarImage = serializers.ImageField(
        required=False, write_only=True, validators=[validate_aadhaar_image])
    location = serializers.JSONField(
        required=False)  # Directly handle JSON input
    home_address = serializers.CharField(
        required=False, allow_blank=True, validators=[validate_home_address])

    class Meta:
        model = get_user_model()
        fields = [
            'first_name', 'last_name', 'username', 'phone_number', 'email',
            'date_of_birth', 'farming_type', 'experience', 'bio',
            'profileImage', 'aadhaarImage', 'location', 'home_address'
        ]
        extra_kwargs = {
            'first_name': {'required': True, 'label': "First Name", 'validators': [validate_name]},
            'last_name': {'required': True, 'label': "Last Name", 'validators': [validate_name]},
            'username': {'required': True, 'label': "Username", 'validators': [validate_name]},
            'phone_number': {'required': True, 'label': "Phone Number", 'validators': [validate_phone_number]},
            'email': {'required': True, 'label': "Email", 'validators': [validate_email]},
            'date_of_birth': {'required': True, 'label': "Date of Birth", 'validators': [validate_date_of_birth]},
            'farming_type': {'required': True, 'label': "Farming Type"},
            'experience': {'required': True, 'label': "Experience", 'validators': [validate_experience]},
            'bio': {'required': True, 'label': "Bio", 'validators': [validate_text_field]}
        }


    # Validation for every fields are required
    def validate(self, data):
        """Ensure all fields are provided and not empty, with readable field names."""

        # Mapping field names to human-readable labels
        field_labels = {field: self.fields[field].label or field.replace(
            "_", " ").title() for field in self.fields}

        required_fields = list(field_labels.keys())

        missing_fields = [
            field for field in required_fields if field not in data or data[field] in [None, '', [], {}]]

        if missing_fields:
            raise serializers.ValidationError({
                field: f"{field_labels[field]} is required and cannot be empty." for field in missing_fields
            })

        return data

    def update(self, instance, validated_data):
        """Handles updating user profile, address, and file uploads in a single method."""

        location_data = validated_data.pop('location', None)
        home_address = validated_data.pop('home_address', '')
        print("location_data:", location_data)  # Debugging

        if location_data:
            # Create or update Address
            address, created = Address.objects.update_or_create(
                place_id=location_data.get('place_id'),
                defaults={
                    'full_location': location_data.get('full_location'),
                    'latitude': location_data.get('latitude'),
                    'longitude': location_data.get('longitude'),
                    'location_name': location_data.get('location_name'),
                    'country': location_data.get('country'),
                    'home_address': home_address
                }
            )
            instance.address = address  # Assign address to user


        if 'profileImage' in validated_data:
            image = validated_data.pop('profileImage')

            # Upload image to Cloudinary with transformations and security settings
            upload_result = cloudinary.uploader.upload(
                image,
                folder="private_files/profile_pictures/",  # Store images in a private folder
                resource_type="image",  # Specify resource type
                # Ensure secure access (authenticated delivery)
                type="authenticated",
                transformation=[
                    # Resize max 500x500
                    {"width": 500, "height": 500, "crop": "limit"},
                    # Optimize quality while reducing size
                    {"quality": "auto:good"},
                    # Serve best format (e.g., WebP, JPEG)
                    {"fetch_format": "auto"}
                ]
            )

            # Store Cloudinary public ID
            instance.profile_picture = upload_result["public_id"]

        if 'aadhaarImage' in validated_data:
            image = validated_data.pop('aadhaarImage')

            # Upload Aadhaar card to Cloudinary with transformations & security settings
            upload_result = cloudinary.uploader.upload(
                image,
                folder="private_files/aadhaar_cards/",  # Secure storage path
                resource_type="image",
                # Ensure secure access (authenticated delivery)
                type="authenticated",
                transformation=[
                    # Resize max 1000x1000
                    {"width": 1000, "height": 1000, "crop": "limit"},
                    # Optimize quality while reducing size
                    {"quality": "auto:good"},
                    # Serve best format (e.g., WebP, JPEG)
                    {"fetch_format": "auto"}
                ]
            )

            # Store only the Cloudinary public ID (not full URL)
            instance.aadhar_card = upload_result["public_id"]

        for attr, value in validated_data.items():
            setattr(instance, attr, value)

        # mark profile was updated with proper data
        instance.profile_completed = True
        instance.save()
        return instance

####################### User Management Admin Side ######################

# ================================== get users data serializers ========================#

from rest_framework import serializers


class UserDashboardSerializer(serializers.ModelSerializer):
    """Serializer for fetching user dashboard data."""

    profile_picture = serializers.SerializerMethodField()  # Secure URL
    address = serializers.SerializerMethodField()  # Format Address

    class Meta:
        model = User
        fields = [
            "id", "email", "username", "phone_number",
            "profile_picture", "address", "farming_type",
            "experience", "bio", "date_of_birth", "profile_completed",
            "created_at", "is_active", "is_aadhar_verified", "aadhar_resubmission_message",
        ]  

    def get_profile_picture(self, obj):
        """Return a secure profile picture URL."""
        return obj.get_secure_profile_picture_url()  # Uses model method

    def get_address(self, obj):
        """Return structured address details if available."""
        if obj.address:
            return {
                "full_location": obj.address.full_location,
                "latitude": obj.address.latitude,
                "longitude": obj.address.longitude,
                "location_name": obj.address.location_name,
                "country": obj.address.country,
                "home_address": obj.address.home_address,
            }
        return None  # If no address is set



# =======================  Get all the usrs data in the admin side =======================#

class GetAllUsersInAdminSideSerializer(serializers.ModelSerializer):
    profile_picture = serializers.SerializerMethodField()  # Secure URL
    address_details = serializers.SerializerMethodField()  # Custom field for address

    class Meta:
        model = User
        fields = ['id', 'email', 'username', 'is_verified', 'address_details', 'profile_picture',
            'profile_completed', 'is_aadhar_verified', 'is_active']  # Include only needed fields

    def get_profile_picture(self, obj):
        """Return a secure profile picture URL."""
        return obj.get_secure_profile_picture_url()  # Uses model method

    def get_address_details(self, obj):
        if obj.address:  # If the user has an address
            return {
                'location_name': obj.address.location_name,
                'country': obj.address.country,
                'home_address': obj.address.home_address
            }
        return None  # No address assigned

# ======================= Change user status in admin side ===========================#
class UserStatusSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'is_active']

# ===========================  User deatail view page serializer in the admin side for user management ========================#

class AdminSideUserDetailPageSerializer(serializers.ModelSerializer):
    """Serializer for fetching complete user details (for Admin use)."""

    profile_picture = serializers.SerializerMethodField()  # Secure Profile Picture URL
    address = serializers.SerializerMethodField()  # Structured Address Data
    aadhar_card = serializers.SerializerMethodField()  # Secure Aadhar Card URL

    class Meta:
        model = User
        fields = [
            "id", "email", "username", "phone_number",
            "profile_picture", "address", "farming_type",
            "experience", "bio", "aadhar_card", "is_aadhar_verified",
            "date_of_birth", "profile_completed", "created_at", "updated_at", "is_verified", 'is_active',
        ]  # Includes additional admin-specific fields

    def get_profile_picture(self, obj):
        """Return a secure profile picture URL."""
        return obj.get_secure_profile_picture_url()

    def get_aadhar_card(self, obj):
        """Return a secure Aadhar card URL."""
        return obj.get_secure_aadhar_card_url()  # Assuming this method exists in model

    def get_address(self, obj):
        """Return structured address details if available."""
        if obj.address:
            return {
                "full_location": obj.address.full_location,
                "latitude": obj.address.latitude,
                "longitude": obj.address.longitude,
                "location_name": obj.address.location_name,
                "country": obj.address.country,
                "home_address": obj.address.home_address,
            }
        return None  # If no address is set

# ==========================  Change Aadhar Verification status in the usertable Serializer ==============================#

class AadhaarVerificationSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['is_aadhar_verified']

    def update(self, instance, validated_data):
        instance.is_aadhar_verified = validated_data.get(
            'is_aadhar_verified', instance.is_aadhar_verified)
        instance.save()
        return instance

# =========================== Adhar resubmission message end point for admin can notify to the user that any deffect in the submitted aadhar ===========================#


class AadharResubmissionMessageSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['aadhar_resubmission_message']

    def validate_aadhar_resubmission_message(self, value):
        """Field-level validation using custom validator"""
        return validate_text_field(value)

    def update(self, instance, validated_data):
        instance.aadhar_resubmission_message = validated_data.get(
            'aadhar_resubmission_message', instance.aadhar_resubmission_message)
        instance.save()
        return instance

# ========================  Adhar resubmission endpoint for uesr if admin notify any mistakes in the aadhar image ==========================#

class AadhaarResubmissionSerializer(serializers.ModelSerializer):
    aadhaarImage = serializers.ImageField(write_only=True, required=False)
    class Meta:
        model = User
        fields = ['aadhar_card', 'aadhaarImage']

    def update(self, instance, validated_data):
        if 'aadhaarImage' in validated_data:
            image = validated_data.pop('aadhaarImage')

            upload_result = cloudinary.uploader.upload(
                image,
                folder="private_files/aadhaar_cards/",
                resource_type="image",
                type="authenticated",
                transformation=[
                    {"width": 1000, "height": 1000, "crop": "limit"},
                    {"quality": "auto:good"},
                    {"fetch_format": "auto"}
                ]
            )

            instance.aadhar_card = upload_result["public_id"]

        # Clear resubmission message
        instance.aadhar_resubmission_message = None
        instance.save()
        return instance

##################### Get the user details on the profile page of user and other user can see each other profiles ########################

class AddressSerializer(serializers.ModelSerializer):
    class Meta:
        model = Address
        fields = ['place_id', 'full_location', 'latitude',
            'longitude', 'location_name', 'country', 'home_address']


class UserProfileSerializer(serializers.ModelSerializer):
    address = AddressSerializer()
    community_count = serializers.SerializerMethodField()
    connection_count = serializers.SerializerMethodField()
    profile_picture = serializers.SerializerMethodField()
    banner_image = serializers.SerializerMethodField()
    connection_status = serializers.SerializerMethodField()
    post_count = serializers.SerializerMethodField()
    product_count = serializers.SerializerMethodField()
    class Meta:
        model = User
        fields = [
            'id', 'email', 'username', 'phone_number', 'profile_picture','banner_image',
            'is_verified', 'farming_type', 'experience', 'bio', 'aadhar_card',
            'is_aadhar_verified', 'aadhar_resubmission_message', 'date_of_birth',
            'profile_completed', 'created_at', 'updated_at',
            'address', 'community_count', 'connection_count', 'connection_status','post_count', 'product_count'
        ]
    
    def get_post_count(self, obj):
        return obj.posts.filter(is_deleted=False).count()


    def get_product_count(self, obj):
        return obj.products.filter(is_deleted=False, is_available=True).count()

    def get_community_count(self, obj):
        return CommunityMembership.objects.filter(user=obj, status='approved').count()

    def get_connection_count(self, obj):

        return Connection.objects.filter(
            (Q(sender=obj) | Q(receiver=obj)) & Q(status='accepted')
        ).count()

    def get_profile_picture(self, obj):
        return generate_secure_image_url(obj.profile_picture)
    
    def get_banner_image(self, obj): 
        return generate_secure_image_url(obj.banner_image)

    def get_connection_status(self, obj):
        request = self.context.get('request')
        if not request or not hasattr(request, 'user'):
            return 'not_connected'

        user = request.user

        if user.id == obj.id:
            return 'self'

        connections = Connection.objects.filter(
            (Q(sender=user, receiver=obj) | Q(sender=obj, receiver=user))
        ).order_by('-updated_at')  # Most recent first

        if not connections.exists():
            return 'not_connected'

        connection = connections.first()

        if connection.status == 'accepted':
            return 'connected'
        elif connection.status == 'pending':
            if connection.sender == user:
                return 'pending_sent'
            else:
                return 'pending_received'

        elif connection.status == 'cancelled':
            # Check if 3 days passed since update
            days_passed = timezone.now() - connection.updated_at
            if days_passed >= timedelta(days=3):
                return 'can_reconnect'
            else:
                return 'wait_to_reconnect'

        return 'not_connected'


######################################   Get all the saved messages from the table of private chat message #######################

class PrivateMessageSerializer(serializers.ModelSerializer):
    sender_id = serializers.IntegerField(source='sender.id')
    sender_name = serializers.SerializerMethodField()
    sender_image = serializers.SerializerMethodField()

    class Meta:
        model = PrivateMessage
        fields = ['id', 'message', 'sender_id',
            'sender_name', 'sender_image', 'timestamp']

    def get_sender_name(self, obj):
        return obj.sender.username or "Unknown"

    def get_sender_image(self, obj):
        return generate_secure_image_url(obj.sender.profile_picture)

#################################### User Profile update serializer  ######################################3

class UserProfileUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = [
            "username",
            "phone_number",
            "farming_type",
            "experience",
            "bio",
            "date_of_birth",
        ]