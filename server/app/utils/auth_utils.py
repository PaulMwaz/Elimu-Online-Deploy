# 📁 server/app/utils/auth_utils.py

import os
import jwt
from functools import wraps
from flask import request, jsonify, g

# 🔐 Fallback secret key for development environments
SECRET_KEY = os.getenv("SECRET_KEY", "elimu-secret-dev-key")

# ✅ Decode and verify JWT token
def verify_token(token):
    try:
        return jwt.decode(token, SECRET_KEY, algorithms=["HS256"])
    except jwt.ExpiredSignatureError:
        return None  # Token has expired
    except jwt.InvalidTokenError:
        return None  # Token is invalid

# ✅ Decorator to enforce user authentication
def login_required(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        token = request.headers.get("Authorization", "").replace("Bearer ", "")
        if not token:
            return jsonify({"error": "Authentication token missing."}), 401

        user = verify_token(token)
        if not user:
            return jsonify({"error": "Invalid or expired token. Please login again."}), 401

        g.current_user = user  # Store user info in Flask global context
        return f(*args, **kwargs)
    return decorated_function

# ✅ Decorator to enforce admin access
def admin_required(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        token = request.headers.get("Authorization", "").replace("Bearer ", "")
        if not token:
            return jsonify({"error": "Authentication token missing."}), 401

        user = verify_token(token)
        if not user or not user.get("is_admin"):
            return jsonify({"error": "Admin privileges required."}), 403

        g.current_user = user  # Store admin info in Flask global context
        return f(*args, **kwargs)
    return decorated_function
