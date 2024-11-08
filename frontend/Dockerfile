# Dockerfile for Vite Frontend
FROM node:18 as builder

WORKDIR /app

# Copy package files and install dependencies
COPY package*.json /app/
RUN npm install

# Copy all files and build the app
COPY . /app/
RUN npm run build

# Stage 2: Serve with nginx
FROM nginx:stable-alpine

# Copy built files from the previous stage
COPY --from=builder /app/dist /usr/share/nginx/html/marathon

# Copy nginx configuration
COPY ./nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
