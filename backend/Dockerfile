# Use the official slim Python image from Docker Hub
FROM python:3.10-slim

# Set environment variables
ENV PYTHONDONTWRITEBYTECODE=1 
ENV PYTHONUNBUFFERED=1

# Set the working directory in the container
WORKDIR /app

# Install system dependencies and PostgreSQL client
RUN apt-get update && apt-get install -y \
    libpq-dev \
    build-essential \
    netcat-openbsd \
    && rm -rf /var/lib/apt/lists/*

# Copy the requirements.txt file first for dependency installation
COPY requirements.txt /app/requirements.txt

# Copy only requirements first to allow caching of dependencies
COPY requirements.txt /app/requirements.txt
RUN pip install --no-cache-dir -r /app/requirements.txt

# Copy the rest of the application after dependencies are installed
COPY . /app




# Expose the port on which the Django app will run
EXPOSE 8000


