from django.db import models
from django.contrib.auth import get_user_model # Assuming this is your custom user model
CustomUser = get_user_model()

# Main community model 
class Community(models.Model):
    name = models.CharField(max_length=100, unique=True, db_index=True)
    description = models.TextField(blank=True)
    is_private = models.BooleanField(default=False, db_index=True)
    created_by = models.ForeignKey(CustomUser, on_delete=models.CASCADE, related_name='created_communities', db_index=True)
    created_at = models.DateTimeField(auto_now_add=True, db_index=True)
    community_logo = models.CharField(
        max_length=255, 
        blank=True, 
        null=True, 
        help_text="Stores the secure Cloudinary URL for the community logo."
    )
    tags = models.ManyToManyField('Tag', blank=True, related_name='communities')
    is_deleted = models.BooleanField(default=False, db_index=True)
    updated_at = models.DateTimeField(auto_now=True, db_index=True)

    class Meta:
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['created_by', 'is_private', 'is_deleted']),  # for filtering communities by creator, privacy, and deletion
        ]

    def __str__(self):
        return f"{self.name} - {self.id}"
    
# Comuunity members model for now different famres who are belong to the perticular group/community 
class CommunityMembership(models.Model):
    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('approved', 'Approved'),
        ('rejected', 'Rejected'),
        ('left', 'Left'),
        ('ignored', 'Ignored'),
        ('cancelled','Cancelled'),
        ('blocked', 'Blocked'),
        ('requested','Requested'),
        ('leaved','Leaved'),
    ]

    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE, related_name='community_memberships', db_index=True)
    community = models.ForeignKey(Community, on_delete=models.CASCADE, related_name='memberships', db_index=True)
    status = models.CharField(max_length=10, choices=STATUS_CHOICES, default='pending', db_index=True)
    is_admin = models.BooleanField(default=False, db_index=True)
    message = models.TextField(blank=True, null=True)
    approved_by = models.ForeignKey(CustomUser, null=True, blank=True, on_delete=models.SET_NULL, related_name='approved_memberships', db_index=True)
    joined_at = models.DateTimeField(null=True,blank=True, db_index=True)
    updated_at = models.DateTimeField(auto_now=True, db_index=True)
    class Meta:
        unique_together = ('user', 'community')  # Prevent duplicate memberships
        ordering = ['-updated_at','-joined_at']  # Newest memberships first
        indexes = [
            models.Index(fields=['community', 'status']),  # quick lookup of members by community and status
            models.Index(fields=['user', 'status']),       # quick lookup of user's memberships
        ]

    def __str__(self):
        return f"{self.user.email} - {self.community.name}"

class Tag(models.Model):
    name = models.CharField(max_length=30, unique=True)

    def __str__(self):
        return self.name


# community based chat model for save the messages for each community 
class CommunityMessage(models.Model):
    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE, related_name='messages')
    community = models.ForeignKey(Community, on_delete=models.CASCADE, related_name='messages')
    content = models.TextField()
    media_url = models.URLField(blank=True,null=True)
    timestamp = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['timestamp']
        indexes = [
            models.Index(fields=['community', 'timestamp']),  # quick retrieval of messages per community
            models.Index(fields=['user', 'timestamp']),       # messages by user
        ]
        
    def __str__(self):
        return f"{self.user.email} in {self.community.name}: {self.content[:20]}"