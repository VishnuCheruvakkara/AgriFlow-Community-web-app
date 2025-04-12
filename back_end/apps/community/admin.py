from django.contrib import admin
from .models import Community, CommunityMembership, Tag

# Simple admin registrations
admin.site.register(Community)
admin.site.register(CommunityMembership)
admin.site.register(Tag)
