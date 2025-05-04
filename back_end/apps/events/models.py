from django.db import models
from django.contrib.auth import get_user_model
from community.models import Community  # Assuming your community app is named `community`

CustomUser = get_user_model()

class CommunityEvent(models.Model):
    EVENT_TYPE_CHOICES = [
        ('online', 'Online'),
        ('offline', 'Offline'),
    ]

    max_participants = models.PositiveIntegerField(null=True, blank=True)
    is_full = models.BooleanField(default=False)
    title = models.CharField(max_length=150)
    description = models.TextField()
    community = models.ForeignKey(Community, on_delete=models.CASCADE, related_name='events')
    event_type = models.CharField(max_length=10, choices=EVENT_TYPE_CHOICES)
    location = models.TextField(blank=True, null=True, help_text="Only for offline events")
    online_link = models.URLField(blank=True, null=True, help_text="Only for online events (Google Meet/Zoom)")
    start_datetime = models.DateTimeField()
    created_by = models.ForeignKey(CustomUser, on_delete=models.CASCADE, related_name='created_events')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-start_datetime']

    def __str__(self):
        return f"{self.title} - {self.community.name}"


# RSVP part is here (User can accept of reject) 
class EventParticipation(models.Model):
    event = models.ForeignKey(CommunityEvent, on_delete=models.CASCADE, related_name='participations')
    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE, related_name='event_participations')
    message = models.TextField(blank=True, null=True)  # Optional message from user
    joined_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('event', 'user')  # Prevent multiple RSVPs by same user
        ordering = ['-joined_at']

    def __str__(self):
        return f"{self.user.email} - {self.event.title} (Joined)"