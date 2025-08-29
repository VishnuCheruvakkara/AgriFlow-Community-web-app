from django.db import models
from users.models import CustomUser

# Post saving mode 
class Post(models.Model):
    author = models.ForeignKey(
        CustomUser, on_delete=models.CASCADE, related_name='posts', db_index=True)
    content = models.TextField(blank=True)
    media = models.FileField(upload_to='temp_uploads/', null=True, blank=True)  # Temporary file
    image_url = models.URLField(
        max_length=500, blank=True, null=True, help_text="Cloudinary image URL")
    video_url = models.URLField(
        max_length=500, blank=True, null=True, help_text="Cloudinary video URL")
    is_deleted = models.BooleanField(default=False, db_index=True)
    created_at = models.DateTimeField(auto_now_add=True, db_index=True)
    updated_at = models.DateTimeField(auto_now=True, db_index=True)

    class Meta:
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['author', 'is_deleted', 'created_at']),  # fast lookup of posts by author
        ]

    def __str__(self):
        return f"{self.author} - {self.content or 'Untitled'}"

# Comment model 
class Comment(models.Model):
    user = models.ForeignKey(
        CustomUser, on_delete=models.CASCADE, related_name='comments', db_index=True)
    post = models.ForeignKey(
        Post, on_delete=models.CASCADE, related_name='comments', db_index=True)
    content = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True, db_index=True)

    class Meta:
        indexes = [
            models.Index(fields=['post', 'created_at']),  # fast retrieval of comments per post
            models.Index(fields=['user', 'created_at']),  # fast retrieval of comments per user
        ]

    def __str__(self):
        return f"{self.user} commented on post {self.post.id}"


# Like tracking model 
class Like(models.Model):
    user = models.ForeignKey(
        CustomUser, on_delete=models.CASCADE, related_name='likes', db_index=True)
    post = models.ForeignKey(
        Post, on_delete=models.CASCADE, related_name='likes', db_index=True)
    created_at = models.DateTimeField(auto_now_add=True, db_index=True)

    class Meta:
        unique_together = ('user', 'post')
        indexes = [
            models.Index(fields=['post', 'created_at']),  # fast retrieval of likes per post
            models.Index(fields=['user', 'created_at']),  # fast retrieval of likes per user
        ]

    def __str__(self):
        return f"{self.user} liked post {self.post.id}"
