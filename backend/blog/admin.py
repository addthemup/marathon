from django.contrib import admin
from .models import BlogPost

class BlogPostAdmin(admin.ModelAdmin):
    list_display = ('title', 'date', 'url')
    search_fields = ('title', 'excerpt')

admin.site.register(BlogPost, BlogPostAdmin)
