from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import UserProfile
from django.utils.translation import gettext_lazy as _

class UserProfileAdmin(UserAdmin):
    # Define the list of fields to be displayed in the admin interface
    list_display = ('username', 'email', 'first_name', 'last_name', 'city', 'state', 'zip', 'is_staff', 'is_active')
    list_filter = ('is_staff', 'is_superuser', 'is_active', 'groups', 'state')

    # Define the fields to display on the user form in admin
    fieldsets = (
        (None, {'fields': ('username', 'password')}),
        (_('Personal info'), {'fields': ('first_name', 'last_name', 'email', 'phone', 'pronouns', 'city', 'state', 'zip')}),
        (_('Permissions'), {'fields': ('is_active', 'is_staff', 'is_superuser', 'groups', 'user_permissions')}),
        (_('Important dates'), {'fields': ('last_login', 'date_joined')}),
    )

    # Fields to display when adding a new user via the admin
    add_fieldsets = (
        (None, {
            'classes': ('wide',),
            'fields': ('username', 'email', 'password1', 'password2', 'first_name', 'last_name', 'phone', 'pronouns', 'city', 'state', 'zip', 'is_active', 'is_staff', 'is_superuser', 'groups', 'user_permissions'),
        }),
    )

    search_fields = ('username', 'first_name', 'last_name', 'email', 'city', 'state')
    ordering = ('username',)
    filter_horizontal = ('groups', 'user_permissions')


# Register the custom user model in the admin
admin.site.register(UserProfile, UserProfileAdmin)
