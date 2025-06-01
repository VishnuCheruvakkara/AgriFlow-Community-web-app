from django.contrib import admin
from .models import CustomUser, Address,PrivateMessage

# Simple model registrations
admin.site.register(CustomUser)
admin.site.register(Address)
admin.site.register(PrivateMessage)
