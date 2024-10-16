from django.contrib import admin
from .models import Brand

@admin.register(Brand)
class BrandAdmin(admin.ModelAdmin):
    list_display = ('name', 'website', 'city', 'zip_code', 'phone')
    search_fields = ('name', 'city')
    list_filter = ('city',)

    # Customizing form to preview logo in the admin
    def logo_tag(self, obj):
        if obj.logo:
            return f'<img src="{obj.logo.url}" style="max-height: 50px;" />'
        return "No Logo"
    logo_tag.short_description = 'Logo'
    logo_tag.allow_tags = True

    readonly_fields = ['logo_tag']  # Display logo preview in the admin form
