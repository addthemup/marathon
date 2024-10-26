# Use a slim Python base image
FROM python:3.10-slim

# Environment variables to prevent Python from writing pyc files and enable unbuffered stdout
ENV PYTHONDONTWRITEBYTECODE=1 
ENV PYTHONUNBUFFERED=1

# Set the working directory
WORKDIR /app

# Install system dependencies and PostgreSQL client
RUN echo "Updating package lists..." && apt-get update -qq \
    && echo "Installing required packages..." \
    && apt-get install -y --no-install-recommends \
    libpq-dev \
    build-essential \
    netcat-openbsd \
    && rm -rf /var/lib/apt/lists/* \
    && echo "System dependencies installed successfully."

# Install Python dependencies
COPY requirements.txt /app/requirements.txt
RUN echo "Installing Python dependencies..." \
    && pip install --no-cache-dir -r /app/requirements.txt \
    && echo "Python dependencies installed successfully."

# Copy the application code
COPY . /app
RUN echo "Application code copied to /app."

# Expose the application's port
EXPOSE 8000

# Default command to start the Django server
CMD ["sh", "-c", "\
    echo 'Waiting for the database...' && \
    while ! nc -z db 5432; do sleep 1; done && \
    echo 'Database started' && \
    python manage.py migrate --noinput && \
    python manage.py loaddata data.json && \
    python manage.py collectstatic --noinput && \
    gunicorn --bind 0.0.0.0:8000 --workers 3 --log-level info backend.wsgi:application \
"]
