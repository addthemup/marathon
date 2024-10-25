#!/bin/sh

# Wait for the PostgreSQL database to be ready
echo "Waiting for the database..."
while ! nc -z db 5432; do
  sleep 10
done
echo "Database started"

# Apply database migrations
echo "Applying database migrations..."
if python manage.py migrate --noinput; then
    echo "Migrations applied successfully"
else
    echo "Error applying migrations" >&2
    exit 1
fi

# Load initial data
echo "Loading initial data..."
if python manage.py loaddata data.json; then
    echo "Initial data loaded successfully"
else
    echo "Error loading initial data" >&2
    exit 1
fi

# Collect static files
echo "Collecting static files..."
if python manage.py collectstatic --noinput; then
    echo "Static files collected successfully"
else
    echo "Error collecting static files" >&2
    exit 1
fi

# Start the Gunicorn server with 3 workers
echo "Starting Gunicorn server..."
exec gunicorn --bind 0.0.0.0:8000 --workers 3 backend.wsgi:application
