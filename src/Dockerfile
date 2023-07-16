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
ENV MS_SECRET=M6$@31@%WiLl834F0rMeH1re
ENV US_SECRET=7h1$S3CrEtIsOuTT0Gue$$
ENV PY_SECRET=A1w1iLl83c0M3$0m3@1r

# Database
ENV DB_HOST=localhost
ENV DB_PORT=27017
ENV DB_NAME=zr_users
ENV ADMIN_USERNAME=zrAdmin
ENV ADMIN_PASSWORD=zrAdmin
ENV READER_USERNAME=zrReader
ENV READER_PASSWORD=zrReader
ENV READERWRITER_USERNAME=zrReaderWriter
ENV READERWRITER_PASSWORD=zrReaderWriter

# Install dependencies
RUN npm install

# Start the app
CMD ["npm", "start"]

