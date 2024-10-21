FROM python:3.10-slim


ENV PYTHONDONTWRITEBYTECODE=1 
ENV PYTHONUNBUFFERED=1


WORKDIR /app


RUN apt-get update && apt-get install -y \
    libpq-dev \
    build-essential \
    netcat-openbsd \
    nginx \
    && rm -rf /var/lib/apt/lists/*


COPY requirements.txt /app/requirements.txt


RUN pip install --no-cache-dir -r /app/requirements.txt


COPY . /app

COPY nginx.conf /etc/nginx/nginx.conf



# Create necessary directories for Nginx logs and static files
RUN mkdir -p /var/log/nginx /app/staticfiles /app/media

# Ensure the entrypoint script is executable
RUN chmod +x /app/backend/entrypoint.sh

# Expose necessary ports (80 for HTTP, 443 for HTTPS)
EXPOSE 80 443

# Start Nginx and then run Gunicorn to serve Django
CMD service nginx start && gunicorn --workers 3 --bind 0.0.0.0:8000 backend.wsgi:application
