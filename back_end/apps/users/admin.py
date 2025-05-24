from django.contrib import admin
from .models import CustomUser, Address

# Simple model registrations
admin.site.register(CustomUser)
admin.site.register(Address)