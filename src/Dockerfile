FROM node:latest

# Path: /app
WORKDIR /app

# Pass everything, but the node_modules folder to the container
COPY . /app

# Expose port 3001 to the host
EXPOSE 3001

# Pass environment variables to the container
# USSURL is the URL of the User Service Server
# USSPORT is the port of the User Service Server

ENV MSURL http://localhost
ENV MSPORT 3000

# Install dependencies
RUN npm install

# Start the app
CMD ["npm", "start"]

