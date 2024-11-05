# Use the latest Node.js image
FROM node:16-alpine

# Set the working directory
WORKDIR /app

# Copy package.json and yarn.lock (if applicable) and install dependencies
COPY package.json /app/
RUN npm install --legacy-peer-deps
RUN npm install vite --force

# Copy the rest of the application code
COPY . /app

# Build the frontend
RUN npm run build

# Serve the application
EXPOSE 5173
CMD ["npx", "vite", "preview"]
