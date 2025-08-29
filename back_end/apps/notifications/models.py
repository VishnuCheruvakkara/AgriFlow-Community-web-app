from django.db import models
from users.models import CustomUser
from community.models import Community
from products.models import Product
from posts.models import Post

class Notification(models.Model):
    NOTIFICATION_TYPES = [

        #for community notifications
        ("community_join_request_received","Community Join Request Received"),
        ("community_joined","Community Joined"),
        ("community_request_approved_by_admin","Community Request Approved By Admin"),
        ("community_invite", "Community Invite"),
        ("community_update", "Community Update"),
        ("message", "Message"),
        ("alert", "Alert"),

        #for connection notifications 
        ("connection_accepted", "Connection Accepted"), 
        ("connection_request","Connection Request"),
        ("custom", "Custom"),

        #For message notification 
        ("private_message","Private Message"),
        ("community_message","Community Message"),
        ("product_message","Product Message"),

        #For Events 
        ("event_start_notification","Event Start Notification"),
        ("event_deleted","Event Deleted"),
        ("event_completed","Event Completed"),
        ("event_cancelled","Event Cancelled"),

        #For products 
        ("product_deleted","Product Deleted"),

        #For posts 
        ("post_liked","Post Liked"),
        ("post_commented","Post Commented"),
    ]

    recipient = models.ForeignKey(CustomUser, on_delete=models.CASCADE, related_name="notifications", db_index=True)
    sender = models.ForeignKey(CustomUser, on_delete=models.SET_NULL, null=True, blank=True, related_name="sent_notifications", db_index=True)
    community = models.ForeignKey(Community, on_delete=models.SET_NULL, null=True, blank=True,related_name="notifications", db_index=True)
    notification_type = models.CharField(max_length=50, choices=NOTIFICATION_TYPES, default="custom", db_index=True)
    message = models.TextField(null=True,blank=True)
    is_read = models.BooleanField(default=False, db_index=True)
    image_url=models.URLField(null=True,blank=True) # For save image of the sender | optional file
    created_at = models.DateTimeField(auto_now_add=True, db_index=True)
    is_deleted = models.BooleanField(default=False, db_index=True)
    product = models.ForeignKey(Product, on_delete=models.SET_NULL, null=True, blank=True, related_name='notifications', db_index=True)
    post = models.ForeignKey(Post, on_delete=models.SET_NULL, null=True, blank=True, related_name='notifications', db_index=True)
    
    class Meta:
        unique_together = ('recipient', 'sender', 'community', 'notification_type')
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['recipient', 'is_read', 'created_at']),  # fetch unread notifications quickly
            models.Index(fields=['recipient', 'notification_type', 'created_at']),  # filter by type
        ]

    def __str__(self):
        return f"{self.recipient.email} - {self.notification_type}"

