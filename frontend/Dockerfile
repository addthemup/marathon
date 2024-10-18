# Use an official Node.js runtime as the base image
FROM node:16-alpine

# Set the working directory inside the container
WORKDIR /app

# Copy only package.json and package-lock.json first for better caching of npm install
COPY package*.json ./

# Install project dependencies (including devDependencies)
# Ensure NODE_ENV is development to include devDependencies like Vite
ARG NODE_ENV=development
ENV NODE_ENV=$NODE_ENV

# Install dependencies
RUN npm install --legacy-peer-deps

# Copy the rest of the application files to the container
COPY . .

# Expose the port Vite uses
EXPOSE 5173

# Run the Vite dev server on 0.0.0.0 (accessible from outside)
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]
