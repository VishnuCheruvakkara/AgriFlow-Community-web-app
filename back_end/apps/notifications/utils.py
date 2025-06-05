
from notifications.models import Notification
from channels.layers import get_channel_layer
from asgiref.sync import async_to_sync
from django.utils.timezone import now

# Common function for handle the real-time private messages  and save that to the db table  #########################3


def create_and_send_notification(recipient, sender, type, message=None, community=None, image_url=None):
    # Save notification data into the table
    notification,created = Notification.objects.get_or_create(
        recipient=recipient,
        sender=sender,
        notification_type=type,
        defaults={
            'message':message,
            'community' :community,
            'image_url' : image_url,
        }
    )

    # If it already exists, just update the content and timestamp
    if not created:
        notification.message = message
        notification.community = community
        notification.image_url = image_url
        notification.created_at = now()  # Manually update created_at
        notification.save()

    # Send the real-time notification
    channel_layer = get_channel_layer()
    async_to_sync(channel_layer.group_send)(
        f"user_{recipient.id}",
        {
            "type": "send_notification",
            "data": {
                "id": notification.id,
                "type": type,
                "message": message,
                "sender": sender.username if sender else None,
                "sender_id": sender.id,
                "timestamp": str(notification.created_at),
                "image_url": image_url
            }
        }
    )


# def create_and_send_private_messages(recipient, sender, type, message=None,community=None,image_url=None):
#     # Save notification data into the table
#     notification = Notification.objects.create(
#         recipient = recipient,
#         sender = sender,
#         notification_type = type,
#         message = message,
#         community = community,
#         image_url = image_url,
#     )

#     #Send the real-time notification
#     channel_layer = get_channel_layer()
#     async_to_sync(channel_layer.group_send)(
#         f"user_{recipient.id}",
#         {
#             "type":"send_notification",
#             "data":{
#                 "id":notification.id,
#                 "type":type,
#                 "message":message,
#                 "sender":sender.username if sender else None,
#                 "sender_id":sender.id,
#                 "timestamp":str(notification.created_at),
#                 "image_url":image_url
#             }
#         }
#     )
