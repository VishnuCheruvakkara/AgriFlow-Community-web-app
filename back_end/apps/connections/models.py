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

    sender = models.ForeignKey(User, related_name='sent_connections', on_delete=models.CASCADE, db_index=True)
    receiver = models.ForeignKey(User, related_name='received_connections', on_delete=models.CASCADE, db_index=True)
    status = models.CharField(max_length=10, choices=STATUS_CHOICES, default='pending', db_index=True)
    created_at = models.DateTimeField(auto_now_add=True, db_index=True)
    updated_at = models.DateTimeField(auto_now=True, db_index=True)

    class Meta:
        unique_together = ('sender', 'receiver')
        ordering = ['-updated_at']
        indexes = [
            models.Index(fields=['sender', 'status']),   # fast lookup of connections by sender & status
            models.Index(fields=['receiver', 'status']), # fast lookup of connections by receiver & status
            models.Index(fields=['sender', 'receiver', 'status']), # optional composite index
        ]

    def __str__(self):
        return f"{self.sender} → {self.receiver} ({self.status})"

class BlockedUser(models.Model):
    blocker = models.ForeignKey(User, related_name='blocked_users', on_delete=models.CASCADE, db_index=True)
    blocked = models.ForeignKey(User, related_name='blocked_by', on_delete=models.CASCADE, db_index=True)
    blocked_at = models.DateTimeField(auto_now_add=True, db_index=True)

    class Meta:
        unique_together = ('blocker', 'blocked')
        ordering = ['-blocked_at']
        indexes = [
            models.Index(fields=['blocker', 'blocked_at']), # fast lookup of blocked users by blocker
            models.Index(fields=['blocked', 'blocked_at']), # fast lookup of who blocked a specific user
        ]

    def __str__(self):
        return f"{self.blocker} blocked {self.blocked}"
