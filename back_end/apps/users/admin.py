from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import CustomUser

class CustomUserAdmin(UserAdmin):
    list_display = ('email', 'username', 'is_staff', 'is_verified')
    search_fields = ('email', 'username')
    ordering = ('email',)

admin.site.register(CustomUser, CustomUserAdmin)
