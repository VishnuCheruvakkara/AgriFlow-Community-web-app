from django.contrib import admin
from .models import CommunityEvent,EventParticipation

# Simple admin registrations
admin.site.register(CommunityEvent)
admin.site.register(EventParticipation)
