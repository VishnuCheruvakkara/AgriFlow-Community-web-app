
from django.db import models
from users.models import CustomUser
from community.models import Community

class Notification(models.Model):
    NOTIFICATION_TYPES = [
        ("community_invite", "Community Invite"),
        ("community_request", "Community Request"),
        ("community_update", "Community Update"),
        ("message", "Message"),
        ("alert", "Alert"),
        ("custom", "Custom"),
    ]

    recipient = models.ForeignKey(CustomUser, on_delete=models.CASCADE, related_name="notifications")
    sender = models.ForeignKey(CustomUser, on_delete=models.SET_NULL, null=True, blank=True, related_name="sent_notifications")
    community = models.ForeignKey(Community, on_delete=models.SET_NULL, null=True, blank=True,related_name="notifications")
    notification_type = models.CharField(max_length=20, choices=NOTIFICATION_TYPES, default="custom")
    message = models.TextField()
    is_read = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.recipient.email} - {self.notification_type}"
