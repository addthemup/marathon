# Use an official Node.js runtime as the base image
FROM node:18-alpine

# Set the working directory inside the container
WORKDIR /app

# Install curl for health checks
RUN apk --no-cache add curl

# Copy package.json and package-lock.json for better caching of npm install
COPY package*.json ./

# Set the environment variable (default to development)
ARG NODE_ENV=development
ENV NODE_ENV=$NODE_ENV

# Install dependencies with verbose output for debugging
RUN npm install --legacy-peer-deps --verbose

# Copy the rest of the application files to the container
COPY . .

# Expose the port Vite uses
EXPOSE 5173

# Health check to ensure the server is running
HEALTHCHECK --interval=10s --timeout=5s --start-period=10s \
    CMD curl -f http://localhost:5173/ || exit 1

# Start the Vite development server, accessible from outside
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]
