# 📁 run.py
# Entry point for running the Flask application

from app import create_app
from flask_cors import CORS
import os

# ✅ Create and configure the Flask app
app = create_app()

# ✅ Debug: Confirm environment mode and loaded values
print("✅ Starting Elimu-Online Flask server...", flush=True)
print("🔐 FLASK SECRET_KEY:", os.getenv("SECRET_KEY", "Not Set"), flush=True)
print("🗃️ DATABASE_URL:", os.getenv("DATABASE_URL", "Not Set"), flush=True)
print("🌍 RENDER/ENVIRONMENT:", os.getenv("RENDER", "Local / Unknown"), flush=True)

# ✅ Enable CORS for both local dev and deployed frontend
CORS(app, origins=[
    "http://localhost:5173",           # Local dev
    "https://elimu-online.onrender.com"  # Render production frontend
], supports_credentials=True)

if __name__ == "__main__":
    port = int(os.getenv("PORT", 5555))  # Default to 5555 if not specified
    debug = os.getenv("FLASK_DEBUG", "True") == "True"

    print(f"🚀 Flask app running on http://0.0.0.0:{port} | Debug: {debug}", flush=True)

    # ✅ Start the development server (not used in Render, only for local dev)
    app.run(host="0.0.0.0", port=port, debug=debug)
