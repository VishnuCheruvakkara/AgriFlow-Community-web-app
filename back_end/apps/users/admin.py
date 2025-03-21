from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import CustomUser

class CustomUserAdmin(UserAdmin):
    list_display = (
        'email', 'username', 'is_staff', 'is_active', 'is_verified', 
        'is_aadhar_verified', 'profile_completed', 'created_at'
    )  
    search_fields = ('email', 'username', 'verified_address', 'location_name')
    ordering = ('email',)
    
    #Mark non-editable fields as readonly
    readonly_fields = ('created_at', 'updated_at', 'last_login', 'date_joined')

    fieldsets = (
        (None, {'fields': ('email', 'username', 'password', 'profile_picture')}),
        ('Personal Info', {'fields': ('first_name', 'last_name', 'bio', 'farming_type', 'crops_grown', 'experience')}),
        ('Location Details', {'fields': ('latitude', 'longitude', 'verified_address', 'location_name')}),
        ('Adhar Verification', {'fields': ('aadhar_card', 'is_aadhar_verified')}),
        ('Permissions', {'fields': ('is_active', 'is_staff', 'is_superuser', 'is_verified', 'profile_completed', 'groups', 'user_permissions')}),
        ('Important Dates', {'fields': ('last_login', 'date_joined', 'created_at', 'updated_at')}),  # ✅ Fixed
    )

    add_fieldsets = (
        (None, {
            'classes': ('wide',),
            'fields': ('email', 'username', 'password1', 'password2', 'is_verified'),
        }),
    )

    list_filter = ('is_staff', 'is_active', 'is_verified', 'is_aadhar_verified', 'profile_completed')  
    list_editable = ('is_verified', 'is_aadhar_verified', 'profile_completed')

admin.site.register(CustomUser, CustomUserAdmin)
