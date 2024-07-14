# Use the official Node.js image from the Docker Hub
FROM node:latest

# Create and change to the app directory
WORKDIR /usr/src/app

# Copy the package.json and package-lock.json files
COPY src/package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY src/ .

# Expose the port the server will run on
EXPOSE ${WEB_PORT}

# Command to run the server
CMD ["node", "app.js"]
