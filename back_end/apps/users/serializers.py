import re
from django.core.cache import cache
from rest_framework import serializers
from django.contrib.auth import get_user_model
#for inbuild password validation
from django.contrib.auth.password_validation import validate_password
#for inbuild email validation
from django.core.validators import EmailValidator
#To authenticate the user 
from django.contrib.auth import authenticate
#User profile updation 


User = get_user_model()

################################ User Login  ################################3

class LoginSerializer(serializers.Serializer):
    """Serializer for user login"""
    email=serializers.EmailField()
    password=serializers.CharField( write_only=True,required=True)

################################## User registration ####################################

class RegisterSerializer(serializers.ModelSerializer):
    password2 = serializers.CharField(write_only=True, required=True, label="Confirm Password")
    email = serializers.EmailField(validators=[EmailValidator(message="Enter a valid email address.")])  

    class Meta:
        model = User
        fields = ['email', 'username', 'password', 'password2']
        extra_kwargs = {"password": {"write_only": True}}
    
    def validate(self, data):
        """Ensure password and password2 match"""
        if data['password'] != data['password2']:
            raise serializers.ValidationError({"password": "Passwords do not match!"})
        return data
 
    def validate_password(self, password):
        """Custom password validation with industry standards."""
        if len(password) < 8:
            raise serializers.ValidationError({"password": "Password must be at least 8 characters long."})

        if not re.search(r'[A-Z]', password):
            raise serializers.ValidationError({"password": "Password must contain at least one uppercase letter."})

        if not re.search(r'[a-z]', password):
            raise serializers.ValidationError({"password": "Password must contain at least one lowercase letter."})

        if not re.search(r'\d', password):
            raise serializers.ValidationError({"password": "Password must contain at least one digit."})

        if not re.search(r'[!@#$%^&*(),.?":{}|<>]', password):
            raise serializers.ValidationError({"password": "Password must contain at least one special character."})

        if ' ' in password:
            raise serializers.ValidationError({"password": "Password cannot contain spaces."})

        return password


    def validate_email(self, value):
        """Manually check if email exists but allow unverified users"""
        user = User.objects.filter(email=value).first()
        if user:
            if user.is_verified:
                raise serializers.ValidationError("Enter a valid email address")
            else:
                return value  # Allow the user to proceed if unverified
        return value  # Allow new users

    def validate_username(self, value):

        """Ensure username contains only letters (uppercase/lowercase) and spaces, and has at least 4 characters"""
        # Remove leading and trailing spaces
        value = value.strip()

        if User.objects.filter(username=value).exists():
            raise serializers.ValidationError("Username already taken. Please choose another one.")
        
        if len(value) < 4:
            raise serializers.ValidationError("Username must be at least 4 characters long.")
        
        if not re.match(r'^[A-Za-z ]+$', value):
            raise serializers.ValidationError("Username can only contain letters and spaces. No numbers or special characters allowed.")

        return value

    email = serializers.EmailField()  #To override over the normaml serializer validation of email (For is_verified=False users)

####################################  Otp verification ########################################

class VerifyOTPSerializer(serializers.Serializer):
    email = serializers.EmailField()
    otp = serializers.CharField(max_length=6)
  
    def validate(self,data):
        """Validate OTP"""
        email=data['email']
        otp=data['otp']

        # Retrieve OTP from cache
        cached_otp = cache.get(f"otp_{email}")

        if not cached_otp or cached_otp != otp:
            raise serializers.ValidationError({"otp":"Invalid or expired OTP!"})
        
        return data 

##################################  Forgot password section ###########################

#================================ Forgot password email serializer =========================

class ForgotPasswordSerialzier(serializers.Serializer):
    email=serializers.EmailField()

    def validate_email(self,value):
        """Check if email exist and is Verified = True"""
        user=User.objects.filter(email=value,is_verified=True).first()

        if not user:
            raise serializers.ValidationError("No verified account found with this email.")
        return value
        

#=============================== Forgot password email otp verification view =======================

class ForgotPasswordVerifyOTPSerializer(serializers.Serializer):
    email=serializers.EmailField()
    otp=serializers.CharField(max_length=6,min_length=6)

    def validate(self,data):
        """Check if OTP is correct"""
        email=data["email"]
        otp=data["otp"]
        stored_otp=cache.get(f"otp_{email}")

        if stored_otp is None:
            raise serializers.ValidationError({"otp":"OTP expired or invalid. Request a new one."})
        
        if stored_otp != otp:
            raise serializers.ValidationError({"otp":"Incorrect OTP. Please try again"})
        return data 

#=============================  Forgot passwort set new password after otp verification =================================

class ForgotPasswordSetSerializer(serializers.Serializer):
    email = serializers.EmailField()
    new_password = serializers.CharField(write_only=True)
    confirm_password = serializers.CharField(write_only=True)

    def validate_new_password(self, password):
        """Custom password validation with industry standards."""
        if len(password) < 8:
            raise serializers.ValidationError("Password must be at least 8 characters long.")

        if not re.search(r'[A-Z]', password):
            raise serializers.ValidationError("Password must contain at least one uppercase letter.")

        if not re.search(r'[a-z]', password):
            raise serializers.ValidationError("Password must contain at least one lowercase letter.")

        if not re.search(r'\d', password):
            raise serializers.ValidationError("Password must contain at least one digit.")

        if not re.search(r'[!@#$%^&*(),.?\":{}|<>]', password):
            raise serializers.ValidationError("Password must contain at least one special character.")

        if ' ' in password:
            raise serializers.ValidationError("Password cannot contain spaces.")

        return password

    def validate_confirm_password(self, confirm_password):
        """Validate confirm_password field separately to ensure it matches new_password."""
        new_password = self.initial_data.get("new_password")

        if new_password and confirm_password != new_password:
            raise serializers.ValidationError("Passwords do not match.")

        return confirm_password

    
######################################   For admin related authentiation serializers  ##############################3

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
            raise serializers.ValidationError("Access denied. Admin privileges required.")

        return {
            "user": user # Return the actual User instance
        }

########################  User proile updation section serilizes #######################
#=========================== User profile updation ========================#

class UserProfileUpdateSerializer(serializers.Serializer):
    """Serializer for validating user profile update fields."""

    firstName = serializers.CharField(required=True, max_length=255)
    lastName = serializers.CharField(required=True, max_length=255)
    username = serializers.CharField(required=True, max_length=255)
    email = serializers.EmailField(required=True)
    experience = serializers.IntegerField(required=False, allow_null=True)
    cropsGrown = serializers.CharField(required=False, allow_blank=True)
    bio = serializers.CharField(required=False, allow_blank=True)

    location = serializers.DictField(required=False)  # Address (Nested Object)
    farmingType = serializers.DictField(required=False)  # Farming Type (Nested Object)

   

    def validate_location(self, value):
        """Validate location dictionary structure."""
        required_keys = ["place_id", "latitude", "longitude", "display_name", "address"]
        if not isinstance(value, dict):
            raise serializers.ValidationError("Location must be a dictionary.")
        for key in required_keys:
            if key not in value:
                raise serializers.ValidationError(f"Missing required location key: {key}")
        return value

    def validate_farmingType(self, value):
        """Validate farming type dictionary structure."""
        if not isinstance(value, dict) or "name" not in value or not value["name"].strip():
            raise serializers.ValidationError("Farming type name is required.")
        return value
