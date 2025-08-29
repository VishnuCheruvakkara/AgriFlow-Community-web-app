
from django.db import models
from django.contrib.auth import get_user_model
User = get_user_model()

# product location 
class ProductLocation(models.Model):
    place_id = models.CharField(max_length=255, blank=True, null=True ,db_index=True)
    full_location = models.TextField(blank=True, null=True,db_index=True)
    latitude = models.FloatField(blank=True, null=True,db_index=True)
    longitude = models.FloatField(blank=True, null=True,db_index=True)
    location_name = models.CharField(max_length=255, blank=True, null=True,db_index=True)
    country = models.CharField(max_length=100, blank=True, null=True,db_index=True)

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

    seller = models.ForeignKey(User, on_delete=models.CASCADE, related_name='products',db_index=True)
    title = models.CharField(max_length=255,db_index=True)
    description = models.TextField()
    price = models.DecimalField(max_digits=10, decimal_places=2,db_index=True)
    quantity = models.PositiveIntegerField()
    unit = models.CharField(max_length=20, choices=UNIT_CHOICES,db_index=True)

    image1 = models.URLField()
    image2 = models.URLField()
    image3 = models.URLField()

    location = models.ForeignKey(ProductLocation,on_delete=models.SET_NULL,null=True,related_name="products",db_index=True)
    is_available = models.BooleanField(default=True,db_index=True)
    is_deleted = models.BooleanField(default=False,db_index=True)

    created_at = models.DateTimeField(auto_now_add=True,db_index=True)
    updated_at = models.DateTimeField(auto_now=True,db_index=True)
    closing_date = models.DateTimeField(null=True, blank=True,db_index=True)

    class Meta:
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['seller', 'is_available', 'is_deleted']),  # composite index for filtering products
        ]

    def __str__(self):
        return f"{self.title} by {self.seller.username}"

# model for wish-list 
class Wishlist(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='wishlist_items',db_index=True)
    product = models.ForeignKey(Product, on_delete=models.CASCADE, related_name='wishlisted_by',db_index=True)
    added_at = models.DateTimeField(auto_now_add=True,db_index=True)
    is_active = models.BooleanField(default=True,db_index=True)  # soft delete flag
    removed_at = models.DateTimeField(null=True, blank=True,db_index=True)
    
    class Meta:
        unique_together = ('user', 'product')  # prevents duplicates
        indexes = [
            models.Index(fields=['user', 'is_active']),  # for filtering active wishlist items
        ]

    def __str__(self):
        status = "Active" if self.is_active else "Removed"
        return f"{self.user.username} → {self.product.title} ({status})"

# Save the product messages 
class ProductChatMessage(models.Model):
    sender = models.ForeignKey(User, on_delete=models.CASCADE, related_name='product_messages_sent',db_index=True)
    receiver = models.ForeignKey(User, on_delete=models.CASCADE, related_name='product_messages_received',db_index=True)
    product = models.ForeignKey(Product, on_delete=models.CASCADE, related_name='chat_messages',db_index=True)
    message = models.TextField()
    timestamp = models.DateTimeField(auto_now_add=True,db_index=True)

    class Meta:
        ordering = ['timestamp']
        indexes = [
            models.Index(fields=['sender', 'receiver', 'product', 'timestamp']),  # composite index for fast chat lookup
        ]

    def __str__(self):
        return f"From {self.sender} to {self.receiver} about {self.product}"

