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