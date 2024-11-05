# Use Node.js version 18 to meet Vite requirements
FROM node:18-alpine

# Set the working directory
WORKDIR /app

# Copy package.json and install dependencies
COPY package.json /app/
RUN npm install --legacy-peer-deps

# Install Vite globally so it's available everywhere
RUN npm install -g vite

RUN npm install @vitejs/plugin-react --force

# Copy the rest of the application code
COPY . /app

# Build the frontend
RUN npm run build

# Serve the application
CMD ["vite", "preview"]
