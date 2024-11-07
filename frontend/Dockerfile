################################
## BUILD ENVIRONMENT ###########
################################

# Use the official Node.js Alpine image to build the app
FROM node:18-alpine as build

# Set the working directory inside the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json to the container
COPY package.json package-lock.json ./

# Install dependencies
RUN npm install --legacy-peer-deps

# Copy the rest of the project files to the working directory
COPY . .

# Build the Vite app for production
RUN npm run build

################################
#### PRODUCTION ENVIRONMENT ####
################################

# Use the official Nginx image to serve the app
FROM nginx:stable-alpine as production

# Copy the Nginx configuration for the Vite app
COPY nginx/default.conf /etc/nginx/conf.d/default.conf

# Copy the build output to the Nginx HTML directory
COPY --from=build /usr/src/app/dist /usr/share/nginx/html

# Expose port 80
EXPOSE 80

# Run Nginx in the foreground
ENTRYPOINT ["nginx", "-g", "daemon off;"]
