# 📁 server/app/config.py

import os
from dotenv import load_dotenv

# ✅ Load environment variables from .env file
load_dotenv()

class Config:
    # 🔐 Secret key used for signing sessions and JWT tokens
    SECRET_KEY = os.getenv("SECRET_KEY", "default_fallback_key")

    # 🗃️ SQLAlchemy DB URI (PostgreSQL in production, SQLite fallback for development)
    SQLALCHEMY_DATABASE_URI = os.getenv(
        "DATABASE_URL", "sqlite:///../instance/elimu.db"
    )

    # 🔁 Disable modification tracking for performance
    SQLALCHEMY_TRACK_MODIFICATIONS = False

    # ☁️ Google Cloud Storage: bucket name and credentials file path
    GCS_BUCKET_NAME = os.getenv("GCS_BUCKET_NAME")
    GOOGLE_APPLICATION_CREDENTIALS = os.getenv("GOOGLE_APPLICATION_CREDENTIALS")
