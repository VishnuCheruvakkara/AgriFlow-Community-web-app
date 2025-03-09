from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import CustomUser

class CustomUserAdmin(UserAdmin):
    list_display = ('email', 'username', 'is_staff', 'is_active', 'is_verified')  # Show is_verified in the list
    search_fields = ('email', 'username')
    ordering = ('email',)
    
    # Modify the "Permissions" section to include is_verified
    fieldsets = (
        (None, {'fields': ('email', 'username', 'password')}),
        ('Personal Info', {'fields': ('first_name', 'last_name')}),
        ('Permissions', {'fields': ('is_active', 'is_staff', 'is_superuser', 'is_verified', 'groups', 'user_permissions')}),
        ('Important Dates', {'fields': ('last_login', 'date_joined')}),
    )

    add_fieldsets = (
        (None, {
            'classes': ('wide',),
            'fields': ('email', 'username', 'password1', 'password2', 'is_verified'),
        }),
    )

    list_filter = ('is_staff', 'is_active', 'is_verified')  # Add filtering option
    list_editable = ('is_verified',)  # Allows inline editing in the list view

admin.site.register(CustomUser, CustomUserAdmin)
