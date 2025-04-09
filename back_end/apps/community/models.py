from django.db import models
from users.models import CustomUser  # Assuming this is your custom user model

# Main community model 
class Community(models.Model):
    name = models.CharField(max_length=100, unique=True)
    description = models.TextField(blank=True)
    is_private = models.BooleanField(default=False)
    created_by = models.ForeignKey(CustomUser, on_delete=models.CASCADE, related_name='created_communities')
    created_at = models.DateTimeField(auto_now_add=True)
    community_logo = models.CharField(
        max_length=255, 
        blank=True, 
        null=True, 
        help_text="Stores the secure Cloudinary URL for the community logo."
    )
    tags = models.ManyToManyField('Tag', blank=True, related_name='communities')

    def __str__(self):
        return self.name
# Comuunity members model for now different famres who are belong to the perticular group/community 
class CommunityMembership(models.Model):
    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('approved', 'Approved'),
        ('rejected', 'Rejected'),
        ('left', 'Left'),
    ]

    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE, related_name='community_memberships')
    community = models.ForeignKey(Community, on_delete=models.CASCADE, related_name='memberships')
    status = models.CharField(max_length=10, choices=STATUS_CHOICES, default='pending')
    is_admin = models.BooleanField(default=False)
    join_message = models.TextField(blank=True, null=True)
    approved_by = models.ForeignKey(CustomUser, null=True, blank=True, on_delete=models.SET_NULL, related_name='approved_memberships')
    joined_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('user', 'community')  # Prevent duplicate memberships
        ordering = ['-joined_at']  # Newest memberships first

    def __str__(self):
        return f"{self.user.email} - {self.community.name}"


class Tag(models.Model):
    name = models.CharField(max_length=30, unique=True)

    def __str__(self):
        return self.name
