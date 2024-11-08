# Stage 1: Build
FROM node:18-alpine as builder
WORKDIR /app

# Copy only package files to install dependencies
COPY package.json package-lock.json ./
RUN npm install --legacy-peer-deps

# Copy source code separately
COPY . .  # This is safe now because `node_modules` is already cached
RUN npm run build

# Stage 2: Serve with Nginx
FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
