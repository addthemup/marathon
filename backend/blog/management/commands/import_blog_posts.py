import json
from django.core.management.base import BaseCommand
from blog.models import BlogPost
from datetime import datetime

class Command(BaseCommand):
    help = 'Load blog posts from blog_posts.json'

    def handle(self, *args, **kwargs):
        with open('files/blog_posts.json', 'r') as file:
            data = json.load(file)
            for post_data in data:
                date = datetime.strptime(post_data['date'], '%B %d, %Y').date()
                BlogPost.objects.create(
                    title=post_data['title'],
                    url=post_data['url'],
                    date=date,
                    excerpt=post_data['excerpt'],
                    image_url=post_data['image_url'],
                    content_html=post_data['content_html']
                )
        self.stdout.write(self.style.SUCCESS('Successfully loaded blog posts'))
