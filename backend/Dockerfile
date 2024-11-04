# Use a slim Python base image
FROM python:3.10-slim as builder

# Environment variables to prevent Python from writing pyc files and enable unbuffered stdout
ENV PYTHONDONTWRITEBYTECODE=1 
ENV PYTHONUNBUFFERED=1

# Set the working directory
WORKDIR /app

# Install system dependencies, PostgreSQL client, and curl
RUN apt-get update -qq \
    && apt-get install -y --no-install-recommends \
    libpq-dev \
    build-essential \
    curl \
    && rm -rf /var/lib/apt/lists/*

# Install Python dependencies
COPY requirements.txt /app/requirements.txt
RUN pip install --user --no-cache-dir -r /app/requirements.txt

# Use a second stage to minimize final image size
FROM python:3.10-slim

# Set the working directory
WORKDIR /app

# Copy the installed dependencies from the builder stage
COPY --from=builder /root/.local /root/.local
ENV PATH=/root/.local/bin:$PATH

# Copy only necessary application files
COPY . /app

# Expose the application's port
EXPOSE 8000

# Default command to start the Django server with Gunicorn
CMD ["sh", "-c", "\
    echo 'Waiting for the database...' && \
    while ! nc -z db 5432; do sleep 1; done && \
    echo 'Database started' && \
    python manage.py migrate --noinput && \
    python manage.py loaddata data.json && \
    python manage.py collectstatic --noinput && \
    gunicorn backend.wsgi:application --bind 0.0.0.0:8000 --workers 3 --log-level info \
"]
