FROM node:20

# Create and set the working directory
RUN mkdir -p /home/delivery-ma/gateway

# Copy all files to the working directory
COPY . /home/delivery-ma/gateway

# Expose the port the app runs on
EXPOSE 3080

# Command to run the application
CMD ["npm", "run", "dev"]