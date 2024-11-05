#!/bin/bash
set -e

# Wait for PostgreSQL to be available
until psql -h "$DJANGO_DB_HOST" -U "$DJANGO_DB_USER" -c '\q'; do
  >&2 echo "Postgres is unavailable - sleeping"
  sleep 1
done

>&2 echo "Postgres is up - executing commands"

# Run migrations
python manage.py migrate

# Load initial data if data.json exists
if [ -f /app/data.json ]; then
  python manage.py loaddata data.json
fi

# Collect static files
python manage.py collectstatic --noinput

# Start Gunicorn
exec gunicorn --bind 0.0.0.0:8000 backend.wsgi:application
