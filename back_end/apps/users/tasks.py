from celery import shared_task
from .utils import generate_otp_and_send_email

@shared_task 
def send_otp_email_task(email,email_type="registration"):
    generate_otp_and_send_email(email,email_type)
    