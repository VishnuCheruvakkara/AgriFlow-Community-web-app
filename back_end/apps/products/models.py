
#################### model for the product ##################
from django.db import models
from django.contrib.auth import get_user_model

User = get_user_model()

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

    location = models.CharField(max_length=255)
    is_available = models.BooleanField(default=True)

    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.title} by {self.seller.username}"

##############  model for wish-list ##################

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