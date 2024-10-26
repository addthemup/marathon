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

# Copy the application code with debug info
COPY . /app
RUN echo "Application code copied to /app."

# Ensure the entrypoint script is executable
RUN chmod +x /app/backend/entrypoint.sh

# Expose the application's port
EXPOSE 8000

# Run the entrypoint script
ENTRYPOINT ["/app/backend/entrypoint.sh"]
