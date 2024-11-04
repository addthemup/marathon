# Use the latest Node.js image
FROM node:16-alpine

# Set the working directory
WORKDIR /app

# Copy package.json and yarn.lock (if applicable) and install dependencies
COPY package.json /app/
RUN npm install --legacy-peer-deps

# Copy the rest of the application code
COPY . /app

# Build the frontend
RUN npm run build

# Serve the application
CMD ["npx", "vite", "preview"]  # Use npx to run Vite without installing globally
