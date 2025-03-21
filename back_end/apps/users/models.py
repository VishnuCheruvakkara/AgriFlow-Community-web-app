from django.contrib.auth.models import AbstractUser
from django.db import models
from cloudinary.models import CloudinaryField

# Create your models here.

class CustomUser(AbstractUser):

    #=========== Basic user details ==============#
    email = models.EmailField(unique=True)
    username = models.CharField(max_length=45, unique=False, blank=True, null=True)  # Make it optional
    profile_picture = CloudinaryField("image", folder="private_files/profile_pictures/", resource_type="image", null=True, blank=True)
    is_verified = models.BooleanField(default=False)  # New field to track OTP verification
    
    #============ For locations ================#
    latitude = models.DecimalField(max_digits=9, decimal_places=6, null=True, blank=True)
    longitude = models.DecimalField(max_digits=9, decimal_places=6, null=True, blank=True)
    verified_address = models.CharField(max_length=255, null=True, blank=True)  # API-verified full address
    location_name = models.CharField(max_length=255, null=True, blank=True)  # City/Village name

    #============ Farmers experience & Extra details ===============#
    experience = models.IntegerField(help_text="Years of farming experience", default=0)
    bio = models.TextField(null=True, blank=True)
    farming_type = models.CharField(max_length=255, help_text="E.g., Organic, Dairy, Poultry", default="Not specified")
    crops_grown = models.TextField(help_text="Comma-separated list of crops", default="Not specified")

    #=========== Adhar Verification ===========#
    aadhar_card = CloudinaryField("image", folder="private_files/aadhar_cards/", resource_type="image", null=True, blank=True)
    is_aadhar_verified = models.BooleanField(default=False)  # Admin verification status for Aadhar
    
    #=========== Access Control ===============#
    profile_completed = models.BooleanField(default=False)  # Restrict app access until True
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    USERNAME_FIELD='email'
    REQUIRED_FIELDS=['username']

    def __str__(self):
        return self.username or self.email or "Unnamed User"