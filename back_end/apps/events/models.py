from django.db import models
from django.contrib.auth import get_user_model
from community.models import Community

CustomUser = get_user_model()

class EventLocation(models.Model):
    place_id = models.CharField(max_length=255, blank=True, null=True, db_index=True)
    full_location = models.TextField(blank=True, null=True)
    latitude = models.FloatField(blank=True, null=True, db_index=True)
    longitude = models.FloatField(blank=True, null=True, db_index=True)
    location_name = models.CharField(max_length=255, blank=True, null=True, db_index=True)
    country = models.CharField(max_length=100, blank=True, null=True, db_index=True)

    def __str__(self):
        return f"{self.location_name}"

class CommunityEvent(models.Model):
    EVENT_TYPE_CHOICES = [
        ('online', 'Online'),
        ('offline', 'Offline'),
    ]

    EVENT_STATUS_CHOICES = [
        ('upcoming', 'Upcoming'),
        ('completed', 'Completed'),
        ('cancelled', 'Cancelled'),
    ]

    max_participants = models.PositiveIntegerField(null=True, blank=True)
    is_full = models.BooleanField(default=False, db_index=True)
    title = models.CharField(max_length=150, db_index=True)
    description = models.TextField()
    banner = models.CharField(
        max_length=255,
        blank=True,
        null=True,
        help_text="Cloudinary public_id for the event banner (private image)"
    )
    community = models.ForeignKey(
        Community, on_delete=models.CASCADE, related_name='events', db_index=True)
    event_type = models.CharField(max_length=10, choices=EVENT_TYPE_CHOICES, db_index=True)
    event_location = models.ForeignKey(EventLocation, null=True, blank=True,
                                       on_delete=models.CASCADE, related_name="events", help_text="Only for offline events")
    address = models.TextField(
        blank=True, null=True, help_text="Manually entered address by the user")

    start_datetime = models.DateTimeField()
    created_by = models.ForeignKey(
        CustomUser, on_delete=models.CASCADE, related_name='created_events')
    created_at = models.DateTimeField(auto_now_add=True, db_index=True)
    updated_at = models.DateTimeField(auto_now=True, db_index=True)
    is_deleted = models.BooleanField(default=False, db_index=True)
    event_status = models.CharField( max_length=10, choices=EVENT_STATUS_CHOICES, default='upcoming', help_text="Status of the event" )

    class Meta:
        ordering = ['-start_datetime']
        indexes = [
            models.Index(fields=['community', 'start_datetime', 'event_status']),  # filter events quickly
            models.Index(fields=['created_by', 'start_datetime']),  # events created by user
        ]


    def __str__(self):
        return f"{self.title} - {self.community.name}"

# RSVP part where users can participate in event
class EventParticipation(models.Model):
    event = models.ForeignKey(
        CommunityEvent, on_delete=models.CASCADE, related_name='participations', db_index=True)
    user = models.ForeignKey(
        CustomUser, on_delete=models.CASCADE, related_name='event_participations', db_index=True)
    # Optional message from user
    message = models.TextField(blank=True, null=True)
    joined_at = models.DateTimeField(auto_now_add=True, db_index=True)
    notification_sent = models.BooleanField(default=False, db_index=True)

    class Meta:
        unique_together = ('event', 'user')
        ordering = ['-joined_at']
        indexes = [
            models.Index(fields=['event', 'joined_at']),  # fast lookup of participants per event
            models.Index(fields=['user', 'joined_at']),   # fast lookup of events joined by user
        ]


    def __str__(self):
        return f"{self.user.email} - {self.event.title} (Joined)"
