#!/bin/bash

# Exit immediately if a command exits with a non-zero status.
set -e

# --- Configuration ---
# Google Cloud Project ID. Replace with your actual Project ID.
PROJECT_ID=""
# Name of the Cloud Run service.
SERVICE_NAME="js-invaders"
# Google Cloud region where the service will be deployed.
REGION="us-central1"
# Name of the Docker image.
IMAGE_NAME="gcr.io/${PROJECT_ID}/${SERVICE_NAME}" # Using gcr.io, can be replaced with Artifact Registry path

# --- Ensure Project ID is Set ---
if [ -z "${PROJECT_ID}" ]; then
    echo "Error: PROJECT_ID is not set. Please edit this script and set your Google Cloud Project ID."
    # Attempt to get Project ID from gcloud config if not set in script
    PROJECT_ID=$(gcloud config get-value project 2>/dev/null)
    if [ -z "${PROJECT_ID}" ]; then
        echo "Could not automatically determine Project ID. Please set it manually in the script or via 'gcloud config set project YOUR_PROJECT_ID'."
        exit 1
    else
        echo "Using Project ID from gcloud config: ${PROJECT_ID}"
        # Update IMAGE_NAME with the fetched PROJECT_ID
        IMAGE_NAME="gcr.io/${PROJECT_ID}/${SERVICE_NAME}"
    fi
fi


# --- Enable Necessary APIs ---
echo "Enabling necessary Google Cloud services..."
gcloud services enable run.googleapis.com     cloudbuild.googleapis.com     containerregistry.googleapis.com # Or artifactregistry.googleapis.com if you prefer

# --- Build Docker Image using Google Cloud Build ---
echo "Building Docker image with Google Cloud Build..."
# The source for the build is the current directory '.'
# The image will be tagged with the IMAGE_NAME
gcloud builds submit --tag "${IMAGE_NAME}" .

# --- Deploy to Google Cloud Run ---
echo "Deploying image to Google Cloud Run..."
gcloud run deploy "${SERVICE_NAME}" \
    --image "${IMAGE_NAME}" \
    --region "${REGION}" \
    --platform "managed" \
    --allow-unauthenticated \
    --project "${PROJECT_ID}" \
    --quiet

#    --port 8080 # Not needed if Gunicorn uses $PORT from environment

SERVICE_URL=$(gcloud run services describe "${SERVICE_NAME}" --platform managed --region "${REGION}" --format 'value(status.url)' --project "${PROJECT_ID}")

echo ""
echo "${SERVICE_NAME} deployed successfully!"
echo "Service URL: ${SERVICE_URL}"
echo ""
echo "Note: If this is the first deployment, it might take a few minutes for the service to become fully available."
