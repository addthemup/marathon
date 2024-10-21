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

# Copy the requirements.txt file first for dependency installation
COPY requirements.txt /app/requirements.txt
RUN pip install --no-cache-dir -r /app/requirements.txt

# Copy the rest of the application after dependencies are installed
COPY . /app

# Configure Nginx
COPY nginx/nginx.conf /etc/nginx/nginx.conf

# Ensure the Nginx log directory exists
RUN mkdir -p /var/log/nginx

# Expose the ports used by Nginx (80 for HTTP, 443 for HTTPS)
EXPOSE 80 443

# Copy and make the entrypoint script executable
RUN chmod +x /app/backend/entrypoint.sh

# Start Nginx in the background, then start Gunicorn (Django)
CMD service nginx start && gunicorn --bind 0.0.0.0:8000 backend.wsgi:application
