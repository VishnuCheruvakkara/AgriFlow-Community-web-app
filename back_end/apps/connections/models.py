from django.db import models
from django.conf import settings

User = settings.AUTH_USER_MODEL

class Connection(models.Model):
    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('accepted', 'Accepted'),
        ('rejected', 'Rejected'),
        ('cancelled', 'Cancelled'),
        ('blocked', 'Blocked'),
    ]

    sender = models.ForeignKey(User, related_name='sent_connections', on_delete=models.CASCADE)
    receiver = models.ForeignKey(User, related_name='received_connections', on_delete=models.CASCADE)
    status = models.CharField(max_length=10, choices=STATUS_CHOICES, default='pending')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        unique_together = ('sender', 'receiver')
        ordering = ['-updated_at']

    def __str__(self):
        return f"{self.sender} → {self.receiver} ({self.status})"


class BlockedUser(models.Model):
    blocker = models.ForeignKey(User, related_name='blocked_users', on_delete=models.CASCADE)
    blocked = models.ForeignKey(User, related_name='blocked_by', on_delete=models.CASCADE)
    blocked_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('blocker', 'blocked')
        ordering = ['-blocked_at']

    def __str__(self):
        return f"{self.blocker} blocked {self.blocked}"
