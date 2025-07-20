
from django.db import models
from django.contrib.auth import get_user_model
User = get_user_model()

# product location 
class ProductLocation(models.Model):
    place_id = models.CharField(max_length=255, blank=True, null=True)
    full_location = models.TextField(blank=True, null=True)
    latitude = models.FloatField(blank=True, null=True)
    longitude = models.FloatField(blank=True, null=True)
    location_name = models.CharField(max_length=255, blank=True, null=True)
    country = models.CharField(max_length=100, blank=True, null=True)

    def __str__(self):
        return f"{self.location_name or 'Unknown Location'}"

# model for the product
class Product(models.Model):
    UNIT_CHOICES = [
        ('kg', 'Kilogram'),
        ('litre', 'Litre'),
        ('piece', 'Piece'),
        ('dozen', 'Dozen'),
        ('unit', 'Unit'),  # fallback generic unit
    ]

    seller = models.ForeignKey(User, on_delete=models.CASCADE, related_name='products')
    title = models.CharField(max_length=255)
    description = models.TextField()
    price = models.DecimalField(max_digits=10, decimal_places=2)
    quantity = models.PositiveIntegerField()
    unit = models.CharField(max_length=20, choices=UNIT_CHOICES)

    image1 = models.URLField()
    image2 = models.URLField()
    image3 = models.URLField()

    location = models.ForeignKey(ProductLocation,on_delete=models.SET_NULL,null=True,related_name="products")
    is_available = models.BooleanField(default=True)
    is_deleted = models.BooleanField(default=False)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    closing_date = models.DateTimeField(null=True, blank=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.title} by {self.seller.username}"

# model for wish-list 
class Wishlist(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='wishlist_items')
    product = models.ForeignKey(Product, on_delete=models.CASCADE, related_name='wishlisted_by')
    added_at = models.DateTimeField(auto_now_add=True)
    is_active = models.BooleanField(default=True)  # soft delete flag
    removed_at = models.DateTimeField(null=True, blank=True)
    
    class Meta:
        unique_together = ('user', 'product')  # prevents duplicates

    def __str__(self):
        status = "Active" if self.is_active else "Removed"
        return f"{self.user.username} → {self.product.title} ({status})"

# Save the product messages 
class ProductChatMessage(models.Model):
    sender = models.ForeignKey(User, on_delete=models.CASCADE, related_name='product_messages_sent')
    receiver = models.ForeignKey(User, on_delete=models.CASCADE, related_name='product_messages_received')
    product = models.ForeignKey(Product, on_delete=models.CASCADE, related_name='chat_messages')
    message = models.TextField()
    timestamp = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['timestamp']

    def __str__(self):
        return f"From {self.sender} to {self.receiver} about {self.product}"

