# Start from an official Node image
FROM node:16-alpine

# Set the working directory
WORKDIR /app

# Copy package.json to install dependencies
COPY package.json /app/

# Install dependencies using npm
RUN npm install --legacy-peer-deps

# Copy the rest of the application code
COPY . /app

# Build the application
RUN npm run build

# Expose the port the app runs on
EXPOSE 3000

# Serve the application
CMD ["npm", "run", "preview"]
