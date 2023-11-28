# Use an official Node.js runtime as a base image
FROM node:18.11.0-alpine

# Set the working directory in the container
WORKDIR /usr/src/app

# Copy the package.json and package-lock.json files to the working directory
COPY package*.json ./

# Install application dependencies
RUN npm install

# Copy the rest of the application code to the container
COPY . .


# Expose the port your app runs on
EXPOSE 8081

# Define the command to run your application
CMD ["npm", "run", "start"]
