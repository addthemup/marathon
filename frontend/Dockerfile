# Use an official Node.js runtime as the base image
FROM node:16-alpine

# Set the working directory inside the container
WORKDIR /app

# Copy the package.json and package-lock.json (or yarn.lock) files
COPY package*.json ./

# Install the project dependencies
RUN npm install

# Copy the rest of the application files to the container
COPY . .

# Build the Vite project
RUN npm run build

# Expose port 3000 (or your Vite app port)
EXPOSE 3000

# Start the app
CMD ["npm", "run", "serve"]

