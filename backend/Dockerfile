# Start from an official Python image
FROM python:3.10-slim

# Set the working directory
WORKDIR /app

# Upgrade pip
RUN pip install --upgrade pip

# Set build arguments for environment variables
ARG DJANGO_SECRET_KEY

# Install dependencies
COPY requirements.txt /app/
RUN pip install --no-cache-dir -r requirements.txt

# Copy the Django project code
COPY . /app/

# Set environment variables
ENV DJANGO_SECRET_KEY=${DJANGO_SECRET_KEY}

# Collect static files and expose the app
RUN python manage.py collectstatic --noinput
EXPOSE 8000

# Run the Django server
CMD ["gunicorn", "--bind", "0.0.0.0:8000", "backend.wsgi:application"]
