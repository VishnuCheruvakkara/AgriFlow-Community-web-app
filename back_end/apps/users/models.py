from django.contrib.auth.models import AbstractUser
from django.db import models
from cloudinary.models import CloudinaryField
import time
from cloudinary.utils import cloudinary_url

class Address(models.Model):
    """Stores address details separately for better normalization."""
    name = models.CharField(max_length=255, null=True, blank=True)  # City/Village name
    state = models.CharField(max_length=100)
    country = models.CharField(max_length=100)
    latitude = models.DecimalField(max_digits=9, decimal_places=6)
    longitude = models.DecimalField(max_digits=9, decimal_places=6)
    place_id = models.CharField(max_length=50, unique=True)  # Unique ID from location API
    local_address = models.CharField(max_length=255, null=True, blank=True, help_text="User's home or farm address")
    location_address = models.CharField(max_length=255, null=True, blank=True, help_text="User's general location (e.g., city, town)")

    class Meta:
        app_label = 'users' 

    def __str__(self):
        return f"{self.name}"


class FarmingType(models.Model):
    """Predefined farming types to avoid redundancy."""
    name = models.CharField(max_length=255, unique=True)  # Example: "Conventional Farming"
    description = models.TextField(null=True, blank=True, help_text="Brief description of the farming type")  # New field

    def __str__(self):
        return self.name


class CustomUser(AbstractUser):
    """User model with detailed farming and location information."""
    email = models.EmailField(unique=True)
    username = models.CharField(max_length=45, unique=False, blank=True, null=True)  # Optional username
    phone_number = models.CharField(max_length=15, unique=True, null=True, blank=True, help_text="User's phone number")  # New field
    profile_picture = CloudinaryField("image", folder="private_files/profile_pictures/", resource_type="image", null=True, blank=True)
    is_verified = models.BooleanField(default=False)  # OTP verification status

    # Address (ForeignKey to Address Model)
    address = models.ForeignKey(Address, on_delete=models.SET_NULL, null=True, blank=True, related_name="users")

    # Farming Details
    experience = models.IntegerField(null=True, blank=True, help_text="Years of farming experience")  # Allow null for flexibility
    bio = models.TextField(null=True, blank=True)
    farming_type = models.ForeignKey(FarmingType, on_delete=models.SET_NULL, null=True, blank=True, related_name="farmers")
    crops_grown = models.TextField(null=True, blank=True, help_text="Comma-separated list of crops")  # Can be a JSONField for PostgreSQL

    # Aadhar Verification
    aadhar_card = CloudinaryField("image", folder="private_files/aadhar_cards/", resource_type="image", null=True, blank=True)
    is_aadhar_verified = models.BooleanField(default=False)  # Admin verification status for Aadhar

    # Access Control
    profile_completed = models.BooleanField(default=False)  # Restrict app access until True
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['username']

    def __str__(self):
        return self.username or self.email or "Unnamed User"

    def get_secure_profile_picture_url(self):
        """Generate a secure URL for profile picture with a short expiration."""
        if not self.profile_picture:
            return None
        
        # Generate a signed URL that expires in 1 hour
        url, options = cloudinary_url(
            str(self.profile_picture),
            type="authenticated",
            secure=True,
            sign_url=True,
            # URL expires in 1 hour (3600 seconds)
            sign_valid_until=int(time.time()) + 3600 # Expires in 1 hour
        )
        return url
    
    def get_secure_aadhar_card_url(self):
        """Generate a secure URL for Aadhar card with a short expiration."""
        if not self.aadhar_card:
            return None
        
        # Generate a signed URL with shorter expiration for sensitive document
        url, options = cloudinary_url(
            str(self.aadhar_card),
            type="authenticated",
            secure=True,
            sign_url=True,
            # URL expires in 15 minutes (900 seconds)
            sign_valid_until=int(time.time()) + 900    # Expires in 15 minutes
        )
        return url