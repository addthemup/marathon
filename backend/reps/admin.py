from django.contrib import admin
from .models import SalesRep, SalesRepZipCode

class SalesRepZipCodeInline(admin.TabularInline):
    model = SalesRepZipCode
    extra = 1  # Allows adding multiple ZIP codes inline

@admin.register(SalesRep)
class SalesRepAdmin(admin.ModelAdmin):
    list_display = ('user', 'code', 'region', 'hire_date', 'role', 'profile_pic_tag')  # Display profile picture
    search_fields = ('user__first_name', 'user__last_name', 'code', 'region', 'role')  # Add role to search
    list_filter = ('region', 'role')  # Add role to the filter
    inlines = [SalesRepZipCodeInline]  # Allow adding ZIP codes directly in the SalesRep admin form

    # Custom method to display the profile picture thumbnail in the admin interface
    def profile_pic_tag(self, obj):
        if obj.profile_pic:
            return f'<img src="{obj.profile_pic.url}" style="max-height: 50px;" />'
        return "No Image"
    profile_pic_tag.short_description = 'Profile Picture'
    profile_pic_tag.allow_tags = True

# Register the SalesRepZipCode model (if needed)
admin.site.register(SalesRepZipCode)
