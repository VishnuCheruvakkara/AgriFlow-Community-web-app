from celery import shared_task
from django.utils import timezone
from users.models import CustomUser
from datetime import timedelta
from notifications.utils import create_and_send_notification
from events.models import CommunityEvent, EventParticipation
from pytz import timezone as pytz_timezone
from apps.common.cloudinary_utils import generate_secure_image_url


# import logging

# logger = logging.getLogger(__name__)

@shared_task
def send_event_notification(event_title, event_start_time, recipient_id, sender_id=None,image_public_id=None):
    """
    Sends a notification about an upcoming event to one recipient.
    """
    try:
        recipient = CustomUser.objects.get(id=recipient_id)
        sender = CustomUser.objects.get(id=sender_id) if sender_id else None

        # Convert ISO string to datetime
        event_start_dt = timezone.datetime.fromisoformat(event_start_time)

        # Make timezone-aware if needed
        if timezone.is_naive(event_start_dt):
            event_start_dt = timezone.make_aware(event_start_dt, timezone.utc)

        # Convert to IST timezone
        ist_tz = pytz_timezone("Asia/Kolkata")
        ist_dt = event_start_dt.astimezone(ist_tz)

        # Format date and time (e.g., Today at 10:00 PM)
        date_label = ist_dt.strftime("%d-%m-%Y")
        time_label = ist_dt.strftime("%I:%M %p")


        message = f"The event '{event_title}' starts today ({date_label}) at {time_label}. Get ready!"

        # Generate signed URL for the image if provided
        secure_image_url = generate_secure_image_url(image_public_id) if image_public_id else None
        


        # create and send notification
        create_and_send_notification(
            recipient=recipient,
            sender=sender,
            type="event_start_notification",
            message=message,
            image_url=secure_image_url
        )

        print(f"Notification sent to {recipient.username}")

    except Exception as e:
        print(f"Error sending event notification: {e}")

###################### function for the crone job ##################################



@shared_task
def scan_and_send_event_notifications():
    now = timezone.now()
    notification_time_start = now + timedelta(minutes=10)
    notification_time_end = now + timedelta(minutes=15)

    print(
        f"[DEBUG] scan_and_send_event_notifications started at {now.strftime('%Y-%m-%d %H:%M:%S')}")
    print(
        f"[DEBUG] Looking for events starting between {notification_time_start} and {notification_time_end}")

    events = CommunityEvent.objects.filter(
        start_datetime__gte=notification_time_start,
        start_datetime__lt=notification_time_end,
        is_deleted=False
    )

    print(
        f"[DEBUG] Found {events.count()} event(s) scheduled in the next window")

    for event in events:
        participations = EventParticipation.objects.filter(
            event=event, notification_sent=False)
        print(
            f"[DEBUG] Processing event '{event.title}' ({event.id}) with {participations.count()} participant(s)")

        for participation in participations:
            recipient = participation.user
            sender = event.created_by if hasattr(event, "created_by") else None

            print(
                f"[DEBUG] Scheduling notification to user '{recipient.username}' (ID {recipient.id})")

            send_event_notification.delay(
                event_title=event.title,
                event_start_time=str(event.start_datetime),
                recipient_id=recipient.id,
                sender_id=sender.id if sender else None,
                image_public_id=event.banner
            )

            participation.notification_sent = True
            participation.save()
            print(
                f"[DEBUG] Marked notification_sent=True for participation ID {participation.id}")


