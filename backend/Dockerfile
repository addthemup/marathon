# Use a slim Python base image
FROM python:3.10-slim

# Environment variables to prevent Python from writing pyc files and enable unbuffered stdout
ENV PYTHONDONTWRITEBYTECODE=1 
ENV PYTHONUNBUFFERED=1

# Set the working directory
WORKDIR /app

# Install system dependencies, PostgreSQL client, and Nginx with detailed output for debugging
RUN echo "Updating package lists..." && apt-get update -qq \
    && echo "Installing required packages..." \
    && apt-get install -y --no-install-recommends \
    libpq-dev \
    build-essential \
    netcat-openbsd \
    nginx \
    && rm -rf /var/lib/apt/lists/* \
    && echo "System dependencies installed successfully."

# Install Python dependencies
COPY requirements.txt /app/requirements.txt
RUN echo "Installing Python dependencies..." \
    && pip install --no-cache-dir -r /app/requirements.txt \
    && echo "Python dependencies installed successfully."

# Copy the application code with debug info
COPY . /app
RUN echo "Application code copied to /app."

# Copy the Nginx configuration with debug info
COPY nginx.conf /etc/nginx/nginx.conf
RUN echo "Nginx configuration copied."

# Create necessary directories for Nginx logs, static, and media files
RUN echo "Creating directories for logs, static, and media files..." \
    && mkdir -p /var/log/nginx /app/staticfiles /app/media \
    && echo "Directories created successfully."

# Ensure the entrypoint script is executable with a debug message
RUN echo "Making entrypoint script executable..." \
    && chmod +x /app/backend/entrypoint.sh \
    && echo "Entrypoint script is now executable."

# Expose necessary ports (80 for HTTP, 443 for HTTPS)
EXPOSE 80 443

# Health check for debugging purpose
HEALTHCHECK --interval=10s --timeout=5s --start-period=10s \
    CMD curl -f http://localhost:8000/ || exit 1

# Debug information for container startup
CMD echo "Starting Nginx server..." \
    && service nginx start \
    && echo "Nginx started successfully." \
    && echo "Starting Gunicorn server..." \
    && gunicorn --workers 3 --bind 0.0.0.0:8000 backend.wsgi:application
