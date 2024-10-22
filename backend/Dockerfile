FROM python:3.10-slim

# Environment variables to prevent Python from writing pyc files and enable unbuffered stdout
ENV PYTHONDONTWRITEBYTECODE=1 
ENV PYTHONUNBUFFERED=1

# Set the working directory
WORKDIR /app

# Install system dependencies, PostgreSQL client, and Nginx
RUN apt-get update && apt-get install -y \
    libpq-dev \
    build-essential \
    netcat-openbsd \
    nginx \
    && rm -rf /var/lib/apt/lists/*

# Install Python dependencies
COPY requirements.txt /app/requirements.txt
RUN pip install --no-cache-dir -r /app/requirements.txt

# Copy the application code
COPY . /app

# Copy the Nginx configuration
COPY nginx.conf /etc/nginx/nginx.conf

# Create necessary directories for Nginx logs, static, and media files
RUN mkdir -p /var/log/nginx /app/staticfiles /app/media

# Ensure the entrypoint script is executable
RUN chmod +x /app/backend/entrypoint.sh

# Expose necessary ports (80 for HTTP, 443 for HTTPS)
EXPOSE 80 443

# Start Nginx and run Gunicorn to serve the Django app
CMD service nginx start && gunicorn --workers 3 --bind 0.0.0.0:8000 backend.wsgi:application
