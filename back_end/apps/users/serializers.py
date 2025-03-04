from django.core.cache import cache
from rest_framework import serializers
from django.contrib.auth import get_user_model

User = get_user_model()


class RegisterSerializer(serializers.ModelSerializer):
    password2 = serializers.CharField(
        write_only=True, required=True, label="Confirm Password")

    class Meta:
        model = User
        fields = ['email', 'username', 'password', 'password2']
        extra_kwargs = {"password": {"write_only": True}}

    def validate(self, data):
        """Ensure password and password2 match"""
        if data['password'] != data['password2']:
            raise serializers.ValidationError({"password":"Passwords do not match!"})
        return data 
    
class VerifyOTPSerializer(serializers.Serializer):
    email = serializers.EmailField()
    otp = serializers.CharField(max_length=6)
    username = serializers.CharField()
    password = serializers.CharField(write_only=True)

    def validate(self,data):
        """Validate OTP"""
        email=data['email']
        otp=data['otp']

        # Retrieve OTP from cache
        cached_otp = cache.get(f"otp_{email}")

        if not cached_otp or cached_otp != otp:
            raise serializers.ValidationError({"otp":"Invalid or expired OTP!"})
        
        return data 