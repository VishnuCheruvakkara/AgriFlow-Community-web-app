from django.db import models
from users.models import CustomUser

# Post saving mode 
class Post(models.Model):
    author = models.ForeignKey(
        CustomUser, on_delete=models.CASCADE, related_name='posts')
    content = models.TextField(blank=True)
    media = models.FileField(upload_to='temp_uploads/', null=True, blank=True)  # Temporary file
    image_url = models.URLField(
        max_length=500, blank=True, null=True, help_text="Cloudinary image URL")
    video_url = models.URLField(
        max_length=500, blank=True, null=True, help_text="Cloudinary video URL")
    is_deleted = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.author} - {self.content or 'Untitled'}"

# Comment model 
class Comment(models.Model):
    user = models.ForeignKey(
        CustomUser, on_delete=models.CASCADE, related_name='comments')
    post = models.ForeignKey(
        Post, on_delete=models.CASCADE, related_name='comments')
    content = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.user} commented on post {self.post.id}"


# Like tracking model 
class Like(models.Model):
    user = models.ForeignKey(
        CustomUser, on_delete=models.CASCADE, related_name='likes')
    post = models.ForeignKey(
        Post, on_delete=models.CASCADE, related_name='likes')
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('user', 'post')

    def __str__(self):
        return f"{self.user} liked post {self.post.id}"
