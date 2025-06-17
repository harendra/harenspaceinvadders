# Use an official Python runtime as a parent image
FROM python:3.9-slim

# Set environment variables
ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1

# Set the working directory in the container
WORKDIR /app

# Install system dependencies that might be needed by some Python packages
# (though likely not strictly necessary for this simple Flask app)
# RUN apt-get update && apt-get install -y --no-install-recommends gcc #     && rm -rf /var/lib/apt/lists/*

# Copy the requirements file into the container at /app
COPY requirements.txt .

# Install any needed packages specified in requirements.txt
RUN pip install --no-cache-dir -r requirements.txt

# Copy the rest of the application code into the container at /app
COPY . .

# Expose the port Gunicorn will run on (Cloud Run sets this via PORT env var)
# EXPOSE 8080 # Not strictly needed for Cloud Run as it uses the PORT env var

# Define the command to run the application using Gunicorn
# Cloud Run provides the PORT environment variable, so Gunicorn should listen on that port.
# The default host 0.0.0.0 makes it accessible from outside the container.
# app:app refers to the 'app' Flask instance in 'app.py'.
CMD exec gunicorn --bind 0.0.0.0:$PORT app:app
