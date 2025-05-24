from django.contrib import admin
from .models import BlockedUser,Connection

# Simple admin registrations
admin.site.register(BlockedUser)
admin.site.register(Connection)
