
from notifications.models import Notification
from channels.layers import get_channel_layer
from asgiref.sync import async_to_sync
from django.utils.timezone import now

# Common function for handle the real-time private messages  and save that to the db table
def create_and_send_notification(recipient, sender, type, message=None, community=None, image_url=None, product=None,post=None,):
    # Save notification data into the table
    notification, created = Notification.objects.get_or_create(
        recipient=recipient,
        sender=sender,
        notification_type=type,
        community=community,
        defaults={
            'message': message,
            'image_url': image_url,
            'product': product,
            'post': post,
        }
    )

    # If it already exists, just update the content and timestamp
    if not created:
        notification.message = message
        notification.image_url = image_url
        notification.created_at = now() 
        notification.is_read = False
        notification.is_deleted = False
        if product:
            notification.product = product
        if post:
            notification.post = post
        notification.save()

    # Send the real-time notification
    channel_layer = get_channel_layer()
    async_to_sync(channel_layer.group_send)(
        f"user_{recipient.id}",
        {
            "type": "send_notification",
            "data": {
                "id": notification.id,
                "notification_type": type,
                "message": message,
                "sender": sender.username if sender else None,
                "sender_id": sender.id,
                "community_id": community.id if community else None,
                "community_name": community.name if community else None,
                "timestamp": str(notification.created_at),
                "image_url": image_url,
                "is_read": False,
                "product_id": product.id if product else None,
                "product_name": product.title if product else None,
                "product_image": product.image1 if product else None,
                "post_id": post.id if post else None,
            }
        }
    )

