
from django.db import models
from users.models import CustomUser
from community.models import Community

class Notification(models.Model):
    NOTIFICATION_TYPES = [
        #for community notifications
        ("community_invite", "Community Invite"),
        ("community_request", "Community Request"),
        ("community_update", "Community Update"),
        ("message", "Message"),
        ("alert", "Alert"),

        #for connection notifications 
        ("connection_accepted", "Connection Accepted"), 
        ("connection_request","Connection Request"),
        
        ("custom", "Custom"),

        #for message notification 
        ("private_message","Private Message"),
        ("community_message","Community Message"),
    ]

    recipient = models.ForeignKey(CustomUser, on_delete=models.CASCADE, related_name="notifications")
    sender = models.ForeignKey(CustomUser, on_delete=models.SET_NULL, null=True, blank=True, related_name="sent_notifications")
    community = models.ForeignKey(Community, on_delete=models.SET_NULL, null=True, blank=True,related_name="notifications")
    notification_type = models.CharField(max_length=20, choices=NOTIFICATION_TYPES, default="custom")
    message = models.TextField(null=True,blank=True)
    is_read = models.BooleanField(default=False)
    image_url=models.URLField(null=True,blank=True) # For save image of the sender | optional file
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('recipient', 'sender', 'community', 'notification_type')
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.recipient.email} - {self.notification_type}"

