# harenspaceinvadders

---
# JS Invaders - Flask Version

This is a web-based text arcade shooter game, reminiscent of Space Invaders, served by a Python Flask application.

## Features (Client-Side)
- Player ship movement and shooting
- Invader grid with movement and descent
- Projectile collision detection
- Scoring and High Score tracking (using browser localStorage)
- Username entry

## Setup and Running the Flask App

1.  **Clone the repository (if you haven't already):**
    ```bash
    git clone <repository-url>
    cd <repository-directory>
    ```

2.  **Create a virtual environment (recommended):**
    ```bash
    python -m venv venv
    ```

3.  **Activate the virtual environment:**
    *   On Windows:
        ```bash
        .\venv\Scripts\activate
        ```
    *   On macOS/Linux:
        ```bash
        source venv/bin/activate
        ```

4.  **Install dependencies:**
    ```bash
    pip install -r requirements.txt
    ```

5.  **Run the Flask application:**
    ```bash
    python app.py
    ```

6.  **Open your web browser and navigate to:**
    [http://127.0.0.1:5000/](http://127.0.0.1:5000/)

The game should now be running in your browser.

## Deploying to Google Cloud Run

These instructions guide you through deploying the JS Invaders Flask application to Google Cloud Run using the provided `deploy.sh` script.

### Prerequisites

1.  **Google Cloud SDK (`gcloud` CLI)**: Ensure you have the `gcloud` CLI installed and initialized.
    *   [Installation Guide](https://cloud.google.com/sdk/docs/install)
    *   Initialize: `gcloud init`

2.  **Google Cloud Project**:
    *   Create a new Google Cloud Project or use an existing one.
    *   Ensure **Billing is enabled** for your project.
    *   Note your **Project ID**.

3.  **Enable APIs**: The `deploy.sh` script attempts to enable the required APIs (Cloud Build, Cloud Run, Container Registry/Artifact Registry). However, you might need to do this manually if you encounter permission issues:
    *   Cloud Build API
    *   Cloud Run API
    *   Container Registry API (or Artifact Registry API if you modify the script)
    You can enable these in the Google Cloud Console under "APIs & Services".

4.  **Permissions**: Ensure the authenticated `gcloud` user has sufficient permissions to manage Cloud Build, Container Registry/Artifact Registry, and Cloud Run (e.g., roles like "Cloud Build Editor", "Storage Admin" for GCR/Artifact Registry, "Cloud Run Admin", "Service Account User").

5.  **Docker (Optional, for local building/testing)**: While Cloud Build is used for deployment, having Docker installed locally can be useful for testing the `Dockerfile` if needed.

### Deployment Steps

1.  **Set Project ID in `deploy.sh` (if not using gcloud config)**:
    *   Open the `deploy.sh` script.
    *   Locate the line `PROJECT_ID=""`.
    *   Replace `""` with your actual Google Cloud Project ID.
    *   Alternatively, ensure your `gcloud` CLI is configured with the correct project: `gcloud config set project YOUR_PROJECT_ID`. The script will attempt to use this if `PROJECT_ID` is not set in the script.

2.  **Make the script executable:**
    ```bash
    chmod +x deploy.sh
    ```

3.  **Run the deployment script:**
    ```bash
    ./deploy.sh
    ```

4.  **Access the application:**
    *   After the script completes successfully, it will output the URL of your deployed Cloud Run service.
    *   Open this URL in your web browser to access the JS Invaders game.

### Notes

*   The `deploy.sh` script uses Google Container Registry (`gcr.io`) by default. If you prefer to use Artifact Registry, you will need to:
    1.  Enable the Artifact Registry API.
    2.  Create an Artifact Registry Docker repository.
    3.  Update the `IMAGE_NAME` variable in `deploy.sh` to point to your Artifact Registry repository (e.g., `REGION-docker.pkg.dev/PROJECT_ID/REPOSITORY_NAME/SERVICE_NAME`).
*   The service is deployed with `--allow-unauthenticated` to make it publicly accessible. For private applications, you would need to adjust the deployment settings.