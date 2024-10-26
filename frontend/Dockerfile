# Use an official Node.js runtime as the base image
FROM node:18-alpine

# Set the working directory inside the container
WORKDIR /app

# Install curl for health checks
RUN apk --no-cache add curl

# Copy package.json and package-lock.json for better caching of npm install
COPY package*.json ./

# Set the environment variable (default to development) and log it
ARG NODE_ENV=development
ENV NODE_ENV=$NODE_ENV
RUN echo "Environment set to: $NODE_ENV"

# Install dependencies with verbose output for debugging
RUN echo "Installing dependencies with npm..." \
    && npm install --legacy-peer-deps --verbose \
    && echo "Dependencies installed successfully."

# Install Vite globally to ensure it's available and log the action
RUN echo "Installing Vite globally..." \
    && npm install vite --force --verbose \
    && echo "Vite installed successfully."

# Install Vite's React plugin globally with logging
RUN echo "Installing Vite React plugin..." \
    && npm install @vitejs/plugin-react --force --verbose \
    && echo "Vite React plugin installed successfully."

# Copy the rest of the application files to the container
COPY . .

# Expose the port Vite uses
EXPOSE 5173

# Health check for debugging purposes
HEALTHCHECK --interval=10s --timeout=5s --start-period=10s \
    CMD curl -f http://localhost:5173/ || exit 1

# Start the Vite development server, accessible from outside, and log the command
CMD echo "Starting Vite development server..." \
    && npm run dev -- --host 0.0.0.0
