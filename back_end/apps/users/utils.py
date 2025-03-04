
import random
from django.core.cache import cache
from django.core.mail import send_mail
from django.conf import settings

def generate_otp_and_send_email(email):
    """Generate OTP, store in cache, and send via email"""
    otp = str(random.randint(100000, 999999))

    # Store OTP in cache for 5 minutes
    cache.set(f"otp_{email}", otp, timeout=1200)  # just for testing purpost I set that as 1 hour  

    try:
        send_mail(
            subject="OTP for AgriFlow Registration",
            message=f"Your OTP is {otp}. It will expire in 5 minutes.",
            from_email=settings.EMAIL_HOST_USER,
            recipient_list=[email],
            fail_silently=True,
        )
    except Exception as e:
        print(f"Email error: {e}")
