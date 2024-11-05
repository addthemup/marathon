#!/bin/bash
set -e

# Wait for PostgreSQL to be available
echo "Waiting for PostgreSQL..."
until pg_isready -h "$DJANGO_DB_HOST" -U "$DJANGO_DB_USER"; do
  >&2 echo "Postgres is unavailable - retrying in 1 second"
  sleep 1
done

>&2 echo "Postgres is available - continuing with setup"

# Run migrations
echo "Running migrations..."
python manage.py migrate --noinput

# Load initial data if data.json exists
if [ -f /app/data.json ]; then
  echo "Loading initial data from data.json..."
  python manage.py loaddata data.json
fi

# Collect static files
echo "Collecting static files..."
python manage.py collectstatic --noinput

# Start Gunicorn
echo "Starting Gunicorn server..."
exec gunicorn backend.wsgi:application --bind 0.0.0.0:8000
