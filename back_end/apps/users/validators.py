import re
import bleach
from django.core.exceptions import ValidationError
from django.core.validators import EmailValidator, FileExtensionValidator
from rest_framework import serializers
from users.models import CustomUser

# Phone Number Validation
def validate_phone_number(value):
    """Validate phone number format and uniqueness (only for creation)."""
    if not re.match(r'^\d{10,15}$', value):
        raise serializers.ValidationError("Phone number must be 10 to 15 digits long.")

    if CustomUser.objects.filter(phone_number=value).exists():
        raise serializers.ValidationError("This phone number is already registered.")

    return value

# Experience Validation
def validate_experience(value):
    """Ensure experience is between 0 and 50 (inclusive)."""
    if value is None:  # Handle NoneType values
        raise serializers.ValidationError("Experience is required.")

    if not isinstance(value, int):  # Ensure value is an integer
        raise serializers.ValidationError("Experience must be a valid integer.")

    if not (0 <= value <= 50):  # Check range
        raise serializers.ValidationError("Experience must be between 0 and 50 years.")

    return value

# Email Validation using built-in EmailValidator
validate_email = EmailValidator(message="Enter a valid email address.")

# Image Size Validation (Max: 2MB)
def validate_image_size(image):
    """Ensure the uploaded image is less than 2MB."""
    max_size = 2 * 1024 * 1024  # 2MB
    if image.size > max_size:
        raise serializers.ValidationError("Image size must be less than 2MB.")
    return image

# Image Format Validation (Allow only JPEG, PNG)
validate_image_format = FileExtensionValidator(
    allowed_extensions=['jpg', 'jpeg', 'png'],
    message="Only JPEG and PNG image formats are allowed."
)

# Aadhaar Image Validation (Size + Format)
def validate_aadhaar_image(image):
    """Custom validation for Aadhaar image (JPEG/PNG & max 2MB)."""
    validate_image_size(image)
    validate_image_format(image)
    return image

# Profile Image Validation (Size + Format)
def validate_profile_image(image):
    """Custom validation for profile image (JPEG/PNG & max 2MB)."""
    validate_image_size(image)
    validate_image_format(image)
    return image

# Name Validation (First & Last Name)
def validate_name(value):
    """Ensure the name contains only alphabets and is at least 2 characters long."""
    value = value.strip()
    if not re.match(r'^[A-Za-z\s]{2,}$', value):
        raise serializers.ValidationError("Name must contain only alphabets and be at least 2 characters long.")
    return value

# Date of Birth Validation (User must be at least 18 years old)
from datetime import date
def validate_date_of_birth(value):
    """Ensure user is at least 18 years old."""
    today = date.today()
    age = today.year - value.year - ((today.month, today.day) < (value.month, value.day))
    if age < 18:
        raise serializers.ValidationError("User must be at least 18 years old.")
    return value

def validate_text_field(value):

    cleaned_value = bleach.clean(value, tags=[], strip=True).strip()

    # This catches scripts that bleach might miss due to clever formatting
    if re.search(r'(?i)<\s*script.*?>.*?<\s*/\s*script\s*>', value, re.DOTALL):
        raise ValidationError("Script tags are not allowed.")

    # Allow only letters, numbers, and select punctuation
    if not re.fullmatch(r"[A-Za-z0-9\s.,#()'’\"/-]+", cleaned_value):
        raise ValidationError("Invalid input: Use only letters, numbers, or common punctuation.")

    # Ensure it’s not empty or too short after cleaning
    if len(cleaned_value) < 10:
        raise ValidationError("Input too short. Please enter at least 10 characters.")

    return cleaned_value

def validate_home_address(value):
    """
    Basic address validation:
    - Strips HTML tags
    - Allows letters, numbers, basic punctuation
    - Requires minimum length of 5 characters
    """
    cleaned_value = bleach.clean(value, tags=[], strip=True).strip()

    # Allow only common address characters
    if not re.fullmatch(r"[A-Za-z0-9\s.,#'()/-]+", cleaned_value):
        raise ValidationError("Invalid characters in address.")

    if len(cleaned_value) < 5:
        raise ValidationError("Address must be at least 5 characters long.")

    return cleaned_value
