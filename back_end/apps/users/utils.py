import random
from django.core.cache import cache
from django.core.mail import send_mail, EmailMultiAlternatives
from django.conf import settings


def generate_otp_and_send_email(email, email_type="registration"):
    """Generate OTP, store in cache, and send a customized email with a farm-friendly theme"""

    otp = str(random.randint(100000, 999999))

    # Store OTP in cache for 5 minutes
    cache.set(f"otp_{email}", otp, timeout=300)  # Time in seconds.

    # Define email subject & message
    if email_type == "registration":
        subject = "Welcome to AgriFlow – Verify Your Registration"
        message = "Thank you for joining AgriFlow! Use the OTP below to complete your registration."
    elif email_type == "forgot_password":
        subject = "AgriFlow – Reset Your Password"
        message = "You requested a password reset. Use the OTP below to proceed."
    elif email_type == "aadhaar_verified":
        subject = "Aadhaar Verified – Welcome to AgriFlow!"
        message = "Your Aadhaar has been successfully verified. Welcome aboard!"
        otp = ""  # No OTP needed
    elif email_type == "aadhaar_rejected":
        subject = "Aadhaar Rejected – Please Resubmit on AgriFlow"
        message = "Unfortunately, the Aadhaar you submitted was not valid. Kindly resubmit a correct Aadhaar card to continue using AgriFlow."
        otp = ""  # No OTP
    else:
        subject = "AgriFlow OTP Verification"
        message = "Use the OTP below to verify your account."

    # HTML Email content
    otp_block = f"""
    <div style="background: #e8f5e9; color: #1b5e20; font-size: 24px; font-weight: bold; padding: 12px 18px; display: inline-block; border-radius: 8px; margin-top: 15px; border: 1px solid #c5e1a5;">
        {otp}
    </div>
    """ if otp else ""

    html_message = f"""
        <html>
            <body style="font-family: Arial, sans-serif; background-color: #f4f9f4; text-align: center; padding: 20px;">
                <div style="max-width: 500px; margin: auto; background: #ffffff; padding: 20px; border-radius: 10px; border: 1px solid #c5e1a5; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">

                    <h3 style="color: #2e7d32; margin-bottom: 10px;">{subject}</h3>
                    <p style="font-size: 16px; color: #555;">{message}</p>
                    {otp_block}

                    <p style="font-size: 14px; color: #777; margin-top: 20px;">This message was sent from AgriFlow Admin Dashboard.</p>

                    <div style="border-top: 1px solid #ddd; margin-top: 20px; padding-top: 10px; font-size: 12px; color: #777;">
                        &copy; 2025 AgriFlow. All rights reserved.
                    </div>
                </div>
            </body>
        </html>
        """

    try:
        # Sending an HTML email
        email_message = EmailMultiAlternatives(
            subject, message, settings.EMAIL_HOST_USER, [email])
        email_message.attach_alternative(html_message, "text/html")
        email_message.send()
    except Exception as e:
        print(f"Email error: {e}")

