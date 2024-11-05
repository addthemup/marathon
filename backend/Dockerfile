# Dockerfile
FROM python:3.10-slim

WORKDIR /app

# Copy and install dependencies
COPY requirements.txt /app/
RUN pip install --no-cache-dir -r requirements.txt

# Copy application code
COPY . /app/

# Copy and prepare entrypoint script
COPY ./entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh

# Expose the application port
EXPOSE 8000

# Use entrypoint.sh as the main entrypoint, which handles Gunicorn startup
ENTRYPOINT ["/entrypoint.sh"]
