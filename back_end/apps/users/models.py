from django.contrib.auth.models import AbstractUser
from django.db import models
from cloudinary.models import CloudinaryField
import time
from cloudinary.utils import cloudinary_url

class Address(models.Model):
    """Stores address details separately for better normalization."""

    place_id = models.CharField(max_length=50, unique=True)  # Unique ID from location API
    full_location=models.CharField(max_length=150,null=True, blank=True)
    latitude = models.DecimalField(max_digits=9, decimal_places=6)
    longitude = models.DecimalField(max_digits=9, decimal_places=6)
    location_name=models.CharField(max_length=100,null=True, blank=True,)
    country = models.CharField(max_length=100)
    
    home_address = models.CharField(max_length=255, null=True, blank=True)

    class Meta:
        app_label = 'users' 

    def __str__(self):
        return f"{self.location_name}"



class CustomUser(AbstractUser):
    """User model with detailed farming and location information."""
    email = models.EmailField(unique=True)
    username = models.CharField(max_length=45, unique=True, blank=True, null=True)  # Optional username
    phone_number = models.CharField(max_length=15, unique=True, null=True, blank=True, help_text="User's phone number")  # New field
    profile_picture = models.CharField(
        max_length=255, 
        blank=True, 
        null=True, 
        help_text="Stores the secure Cloudinary URL for the user's profile picture."
    )

    is_verified = models.BooleanField(default=False)  # OTP verification status

    # Address (ForeignKey to Address Model)
    address = models.ForeignKey(Address, on_delete=models.SET_NULL, null=True, blank=True, related_name="users")

    # Farming 
    farming_type = models.CharField(max_length=100, null=True, blank=True, help_text="Type of farming practiced")  # No predefined choices  
    experience = models.IntegerField(null=True, blank=True, help_text="Years of farming experience")  # Allow null for flexibility
    bio = models.TextField(null=True, blank=True)

    # Aadhar Verification
    aadhar_card = models.CharField(
        max_length=255,  
        blank=True,
        null=True,
        help_text="Stores the Cloudinary public ID for the user's Aadhaar card."
    )
    is_aadhar_verified = models.BooleanField(default=False)  # Admin verification status for Aadhar
    aadhar_resubmission_message = models.TextField(blank=True, null=True)
   
    # Date of Birth
    date_of_birth = models.DateField(null=True, blank=True, help_text="User's date of birth")  

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
            return ""
        
        # Generate a signed URL that expires in 1 hour
        url, options = cloudinary_url(
            self.profile_picture, # Use public ID
            type="authenticated",  # Only accessible via signed URL
            secure=True, # Ensure HTTPS
            sign_url=True, # Enable signed URL
            # URL expires in 1 hour (3600 seconds)
            sign_valid_until=int(time.time()) + 3600 # Expires in 1 hour
        )
        return url
    
    def get_secure_aadhar_card_url(self):
        """Generate a secure URL for Aadhar card with a short expiration."""
        if not self.aadhar_card:
            return ""
        
        # Generate a signed URL with shorter expiration for sensitive document
        url, options = cloudinary_url(
            self.aadhar_card,
            type="authenticated",
            secure=True,
            sign_url=True,
            # URL expires in 15 minutes (900 seconds)
            sign_valid_until=int(time.time()) + 900    # Expires in 15 minutes
        )
        return url