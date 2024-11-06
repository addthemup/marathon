# Use Node.js as the base image
FROM node:18-alpine as builder

# Set the working directory in the container
WORKDIR /app

# Copy the package.json and package-lock.json to install dependencies
COPY package.json package-lock.json ./

# Install dependencies
RUN npm install

# Copy the rest of the frontend files to the container
COPY . .

# Build the Vite app for production
RUN npm run build

# Use a minimal web server image to serve the built files
FROM nginx:alpine as production

# Copy the build output from the builder stage
COPY --from=builder /app/dist /usr/share/nginx/html

# Expose the port Nginx will serve on
EXPOSE 80

# Run Nginx as the default command
CMD ["nginx", "-g", "daemon off;"]
