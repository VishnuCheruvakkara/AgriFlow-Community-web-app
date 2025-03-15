from django.core.cache import cache
from rest_framework import serializers
from django.contrib.auth import get_user_model
#for inbuild password validation
from django.contrib.auth.password_validation import validate_password

User = get_user_model()

################################ User Login  ################################3

class LoginSerializer(serializers.Serializer):
    """Serializer for user login"""
    email=serializers.EmailField()
    password=serializers.CharField( write_only=True,required=True)

################################## User registration ####################################

class RegisterSerializer(serializers.ModelSerializer):
    password2 = serializers.CharField(write_only=True, required=True, label="Confirm Password")

    class Meta:
        model = User
        fields = ['email', 'username', 'password', 'password2']
        extra_kwargs = {"password": {"write_only": True}}
    
    def validate(self, data):
        """Ensure password and password2 match"""
        if data['password'] != data['password2']:
            raise serializers.ValidationError({"password": "Passwords do not match!"})
        return data

    def validate_email(self, value):
        """Manually check if email exists but allow unverified users"""
        user = User.objects.filter(email=value).first()
        if user:
            if user.is_verified:
                raise serializers.ValidationError("Email already verified. Please log in.")
            else:
                return value  # Allow the user to proceed if unverified
        return value  # Allow new users

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
    email=serializers.EmailField()
    new_password=serializers.CharField(write_only=True)
    confirm_password = serializers.CharField(write_only=True)

    def validate(self,data):
        if data['new_password'] != data['confirm_password'] :
            raise serializers.ValidationError({"confirm_password":"Password do not match."})
  
        # Validate password strength
        validate_password(data['new_password'])

        return data