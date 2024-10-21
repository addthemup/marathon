#!/bin/sh

# Wait for the database to be ready
echo "Waiting for the database..."
while ! nc -z db 5432; do
  sleep 1
done
echo "Database started"

# Apply database migrations
echo "Applying database migrations..."
python manage.py migrate

# Load initial data
echo "Loading initial data..."
python manage.py loaddata data.json

# Collect static files
echo "Collecting static files..."
python manage.py collectstatic --noinput

# Start Gunicorn server
echo "Starting Gunicorn server..."
gunicorn --bind 0.0.0.0:8000 --workers 3 backend.wsgi:application
