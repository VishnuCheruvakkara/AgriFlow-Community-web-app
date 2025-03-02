import random 
from django.core.cache import cache 
from django.core.mail import send_mail 
from django.conf import settings 
from django.contrib.auth import get_user_model 
from rest_framework.views import APIView
from rest_framework.response import Response 
from rest_framework import status 
from .serializers import RegisterSerializer,VerifyOTPSerializer 
from .utils import generate_otp_and_send_email

User = get_user_model()

class RegisterView(APIView):
    """User Registration API with OTP Generation"""
    def post(self,request):
        serializer=RegisterSerializer(data=request.data)
        if serializer.is_valid():
            validated_data=serializer.validated_data
            email=validated_data['email']

            # Generate OTP and send email (Moved to utils.py)
            generate_otp_and_send_email(email)

            return Response(
                {"message":"OTP sent successfully to your email."},
                status=status.HTTP_201_CREATED,
            )
        return Response(serializer.errors,status=status.HTTP_400_BAD_REQUEST)
    
class VerifyOTPView(APIView):
    """OTP Verification API"""
    def post(self,request):
        serializer=VerifyOTPSerializer(data=request.data)
        if serializer.is_valid():
            validated_data=serializer.validated_data 
            email=validated_data['email']

            # Delete OTP after successful verification
            cache.delete(f"otp_{email}")

            # Create the user 
            user=User.objects.create_user(
                email=email,
                username=validated_data['username'],
                password=validated_data['password'],
            )

            return Response(
                {"message":"User registered succesfully!"},
                status=status.HTTP_201_CREATED,
            )
        return Response(serializer.errors,status=status.HTTP_400_BAD_REQUEST)