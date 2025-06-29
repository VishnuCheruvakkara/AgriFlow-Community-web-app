from celery import shared_task 
from django.utils import timezone 
from users.models import CustomUser 
from datetime import timedelta
from notifications.utils import create_and_send_notification
from events.models import CommunityEvent, EventParticipation

@shared_task 
def send_event_notification(event_title,event_start_time,recipient_id,sender_id=None):
    """
    Sends a notification about an upcoming event to one recipient.
    """
    try:
        recipient = CustomUser.objects.get(id=recipient_id)
        sender = CustomUser.objects.get(id=sender_id) if sender_id else None 

        message = f"The event '{event_title}' starts at {event_start_time}. Get ready!"
      
        # create and send notification 
        create_and_send_notification(
            recipient=recipient,
            sender=sender,
            type="event_start_notification",
            message=message
        )

        print(f"Notification sent to {recipient.username}")

    except Exception as e:
        print(f"Error sending event notification: {e}")

###################### function for the crone job ##################################

# @shared_task
# def scan_and_send_event_notifications():
#     now = timezone.now()
#     notification_time_start = now + timedelta(minutes=10)
#     notification_time_end = now + timedelta(minutes=15)

#     events = CommunityEvent.objects.filter(
#         start_datetime__gte=notification_time_start,
#         start_datetime__lt=notification_time_end,
#         is_deleted=False
#     )

#     for event in events:
#         participations = EventParticipation.objects.filter(event=event, notification_sent=False)
#         for participation in participations:
#             recipient = participation.user
#             sender = event.created_by if hasattr(event, "created_by") else None

#             send_event_notification.delay(
#                 event_title=event.title,
#                 event_start_time=str(event.start_datetime),
#                 recipient_id=recipient.id,
#                 sender_id=sender.id if sender else None
#             )

#             # mark as sent
#             participation.notification_sent = True
#             participation.save()


@shared_task
def scan_and_send_event_notifications():
    now = timezone.now()
    notification_time_start = now + timedelta(minutes=10)
    notification_time_end = now + timedelta(minutes=15)

    print(f"[DEBUG] scan_and_send_event_notifications started at {now.strftime('%Y-%m-%d %H:%M:%S')}")
    print(f"[DEBUG] Looking for events starting between {notification_time_start} and {notification_time_end}")

    events = CommunityEvent.objects.filter(
        start_datetime__gte=notification_time_start,
        start_datetime__lt=notification_time_end,
        is_deleted=False
    )



    print(f"[DEBUG] Found {events.count()} event(s) scheduled in the next window")

    for event in events:
        participations = EventParticipation.objects.filter(event=event, notification_sent=False)
        print(f"[DEBUG] Processing event '{event.title}' ({event.id}) with {participations.count()} participant(s)")

        for participation in participations:
            recipient = participation.user
            sender = event.created_by if hasattr(event, "created_by") else None

            print(f"[DEBUG] Scheduling notification to user '{recipient.username}' (ID {recipient.id})")

            send_event_notification.delay(
                event_title=event.title,
                event_start_time=str(event.start_datetime),
                recipient_id=recipient.id,
                sender_id=sender.id if sender else None
            )

            participation.notification_sent = True
            participation.save()
            print(f"[DEBUG] Marked notification_sent=True for participation ID {participation.id}")
