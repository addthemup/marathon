# Use an official Node.js runtime as the base image
FROM node:16-alpine

# Set the working directory inside the container
WORKDIR /app

# Copy the package.json and package-lock.json (or yarn.lock) files
COPY package*.json ./

# Install the project dependencies
RUN npm install -- force

# Copy the rest of the application files to the container
COPY . .

# Expose the correct port for Vite
EXPOSE 5173

# Start the Vite dev server on all interfaces
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]
