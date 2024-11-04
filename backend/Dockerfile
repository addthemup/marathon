FROM python:3.10-slim

# Set the working directory in the container
WORKDIR /app

# Copy requirements.txt first, for separate dependency installation
COPY requirements.txt /app/

# Install dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Copy the rest of the application code
COPY . /app/

# Set build argument for Django secret key
ARG DJANGO_SECRET_KEY
ENV DJANGO_SECRET_KEY=$DJANGO_SECRET_KEY

# Collect static files and expose the app
RUN python manage.py collectstatic --noinput
EXPOSE 8000
