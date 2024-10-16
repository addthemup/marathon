from django.db import models
from ckeditor.fields import RichTextField

class BlogPost(models.Model):
    title = models.CharField(max_length=255)
    url = models.URLField()
    date = models.DateField()
    excerpt = models.TextField()
    image_url = models.URLField()
    content_html = RichTextField()

    def __str__(self):
        return self.title
