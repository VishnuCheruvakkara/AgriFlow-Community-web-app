import logging
from celery import shared_task
from .utils import generate_otp_and_send_email

logger=logging.getLogger(__name__)

@shared_task 
def send_otp_email_task(email,email_type):
    try:
        generate_otp_and_send_email(email,email_type)
    except Exception as e:
        logger.exception(f"Exception sending OTP email to {email}: {e}")

    