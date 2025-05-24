from django.contrib import admin
from .models import CommunityEvent,EventParticipation,EventLocation

# Simple admin registrations
admin.site.register(CommunityEvent)
admin.site.register(EventParticipation)
admin.site.register(EventLocation)
