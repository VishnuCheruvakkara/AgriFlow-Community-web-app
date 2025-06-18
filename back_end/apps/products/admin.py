from django.contrib import admin
from .models import ProductLocation,Product,Wishlist,ProductChatMessage

# Simple admin registrations
admin.site.register(ProductLocation)
admin.site.register(Product)
admin.site.register(Wishlist)
admin.site.register(ProductChatMessage)