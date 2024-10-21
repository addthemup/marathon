# Use the official slim Python image from Docker Hub
FROM python:3.10-slim

# Set environment variables
ENV PYTHONDONTWRITEBYTECODE=1 
ENV PYTHONUNBUFFERED=1

# Set the working directory in the container
WORKDIR /app

# Install system dependencies, PostgreSQL client, and Nginx
RUN apt-get update && apt-get install -y \
    libpq-dev \
    build-essential \
    netcat-openbsd \
    nginx \
    && rm -rf /var/lib/apt/lists/*

# Copy the requirements.txt file for dependency installation
COPY requirements.txt /app/requirements.txt

# Install Python dependencies
RUN pip install --no-cache-dir -r /app/requirements.txt

# Copy the entire application code to the container
COPY . /app

# Copy the Nginx configuration file
COPY /nginx/nginx.conf /etc/nginx/nginx.conf

# Create necessary directories for Nginx logs and static files
RUN mkdir -p /var/log/nginx /app/staticfiles /app/media

# Ensure the entrypoint script is executable
RUN chmod +x /app/backend/entrypoint.sh

# Expose necessary ports (80 for HTTP, 443 for HTTPS)
EXPOSE 80 443

# Start Nginx and then run Gunicorn to serve Django
CMD service nginx start && gunicorn --workers 3 --bind 0.0.0.0:8000 backend.wsgi:application
