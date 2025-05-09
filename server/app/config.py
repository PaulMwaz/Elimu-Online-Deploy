# 📁 server/app/config.py

import os
from dotenv import load_dotenv

# ✅ Load environment variables from .env file
load_dotenv()

class Config:
    # 🔐 Secret key for JWTs and Flask sessions
    SECRET_KEY = os.getenv("SECRET_KEY", "default_fallback_key")
    if SECRET_KEY == "default_fallback_key":
        print("⚠️ WARNING: Using fallback SECRET_KEY (this is insecure for production)", flush=True)
    else:
        print("✅ SECRET_KEY loaded", flush=True)

    # 🗃️ SQLAlchemy DB URI (PostgreSQL preferred)
    SQLALCHEMY_DATABASE_URI = os.getenv("DATABASE_URL", "sqlite:///../instance/elimu.db")
    if "postgresql" in SQLALCHEMY_DATABASE_URI:
        print("✅ PostgreSQL DB configured", flush=True)
    else:
        print("⚠️ Using fallback SQLite DB — check DATABASE_URL in Render settings", flush=True)

    # 🔁 Disable modification tracking for performance
    SQLALCHEMY_TRACK_MODIFICATIONS = False

    # ☁️ Google Cloud Storage Configuration
    GCS_BUCKET_NAME = os.getenv("GCS_BUCKET_NAME")
    if not GCS_BUCKET_NAME:
        print("❌ GCS_BUCKET_NAME is missing!", flush=True)
    else:
        print(f"✅ GCS_BUCKET_NAME: {GCS_BUCKET_NAME}", flush=True)

    GOOGLE_APPLICATION_CREDENTIALS = os.getenv("GOOGLE_APPLICATION_CREDENTIALS")
    if not GOOGLE_APPLICATION_CREDENTIALS:
        print("❌ GOOGLE_APPLICATION_CREDENTIALS path is missing!", flush=True)
    else:
        print(f"✅ GCS credentials file: {GOOGLE_APPLICATION_CREDENTIALS}", flush=True)

    # 📧 SMTP Email Configuration
    MAIL_USERNAME = os.getenv("MAIL_USERNAME")
    MAIL_PASSWORD = os.getenv("MAIL_PASSWORD")
    MAIL_SERVER = os.getenv("MAIL_SERVER", "smtp.gmail.com")
    MAIL_PORT = int(os.getenv("MAIL_PORT", 465))
    MAIL_USE_SSL = os.getenv("MAIL_USE_SSL", "true").lower() == "true"
    MAIL_USE_TLS = os.getenv("MAIL_USE_TLS", "false").lower() == "true"

    if MAIL_USERNAME and MAIL_PASSWORD:
        print(f"✅ Email configured: {MAIL_USERNAME}", flush=True)
    else:
        print("❌ Email username or password is missing!", flush=True)

    # 🌐 Frontend URL for links (e.g., password reset)
    FRONTEND_URL = os.getenv("FRONTEND_URL", "http://localhost:5173")
    print(f"🌐 FRONTEND_URL set to: {FRONTEND_URL}", flush=True)
