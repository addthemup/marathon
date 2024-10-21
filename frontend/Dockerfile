# Use an official Node.js runtime as the base image
FROM node:16-alpine

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json for better caching of npm install
COPY package*.json ./

# Set the environment variable (default to development)
ARG NODE_ENV=development
ENV NODE_ENV=$NODE_ENV

# Install dependencies
RUN npm install --legacy-peer-deps

RUN npm install @vitejs/plugin-react --force


# Debug step to ensure Vite is installed (remove in production)
RUN npm list vite

# Copy the rest of the application files to the container
COPY . .

# Expose the port Vite uses
EXPOSE 5173

# Start the Vite development server, accessible from outside
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]
