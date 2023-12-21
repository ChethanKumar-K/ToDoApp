# Use an official Node.js runtime as a base image
FROM node:18-alpine

# Create and set the working directory
WORKDIR /app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install app dependencies
RUN npm install

# Bundle app source
COPY . .

# Expose the port the app runs on
EXPOSE 3000

# Define environment variables
ENV NODE_ENV=production

# Command to run your application
CMD ["node","app.js"]