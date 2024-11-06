# backend/wsgi.py
import os
from django.core.wsgi import get_wsgi_application

# Set the default Django settings module for the 'wsgi' command
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')

# Get the WSGI application
application = get_wsgi_application()
