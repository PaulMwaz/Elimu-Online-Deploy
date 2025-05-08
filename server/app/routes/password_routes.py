# 📁 server/app/routes/password_routes.py

from flask import Blueprint, request, jsonify
from itsdangerous import URLSafeTimedSerializer
from ..models.user import User
from .. import db
from ..utils.email_utils import send_reset_email
import os

password_routes = Blueprint("password_routes", __name__)

# 🔐 Initialize secure serializer for generating tokens
serializer = URLSafeTimedSerializer(os.getenv("SECRET_KEY", "default-secret"))

# ✅ Endpoint to initiate password reset
@password_routes.route("/api/forgot-password", methods=["POST"])
def forgot_password():
    data = request.get_json()
    email = data.get("email")

    if not email:
        return jsonify({"error": "Email is required."}), 400

    user = User.query.filter_by(email=email).first()

    # Return generic success even if user not found (to prevent email enumeration)
    if not user:
        return jsonify({"message": "If the email exists, a reset link will be sent."}), 200

    # Generate reset token and store it
    token = serializer.dumps(email, salt="password-reset-salt")
    user.reset_token = token
    db.session.commit()

    # Construct frontend reset URL
    frontend_url = os.getenv("FRONTEND_URL", "http://localhost:5173")
    reset_url = f"{frontend_url}/reset-password?token={token}"

    try:
        send_reset_email(email, reset_url)
        return jsonify({"message": "Reset email sent."}), 200
    except Exception as e:
        return jsonify({"error": f"Failed to send email: {str(e)}"}), 500

# ✅ Endpoint to update password using a valid token
@password_routes.route("/api/reset-password", methods=["POST"])
def reset_password():
    data = request.get_json()
    token = data.get("token")
    new_password = data.get("new_password")

    if not token or not new_password:
        return jsonify({"error": "Token and new password are required."}), 400

    try:
        email = serializer.loads(token, salt="password-reset-salt", max_age=3600)
    except Exception:
        return jsonify({"error": "Invalid or expired token."}), 400

    user = User.query.filter_by(email=email).first()

    if not user or user.reset_token != token:
        return jsonify({"error": "Invalid reset attempt."}), 400

    # Update password and clear token
    user.set_password(new_password)
    user.reset_token = None
    db.session.commit()

    return jsonify({"message": "Password reset successfully."}), 200
