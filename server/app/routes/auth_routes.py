# 📁 server/app/routes/auth_routes.py

from flask import Blueprint, request, jsonify, make_response
from ..models.user import User
from .. import db
import os
import jwt
from datetime import datetime, timedelta

# ✅ Blueprint registration
auth_routes = Blueprint("auth_routes", __name__)
SECRET_KEY = os.getenv("SECRET_KEY", "elimu-secret-dev-key")

# ✅ Register a new user
@auth_routes.route("/api/register", methods=["POST"])
def register():
    try:
        print("📨 Incoming registration request...")
        data = request.get_json(force=True)
        print("📦 Request JSON:", data)

        # Validate required fields
        if not data or not all(k in data for k in ("full_name", "email", "password")):
            print("⚠️ Missing required registration fields.")
            return jsonify({"error": "Missing registration fields."}), 400

        # Check for duplicate email
        if User.query.filter_by(email=data["email"]).first():
            print(f"❌ Email already registered: {data['email']}")
            return jsonify({"error": "Email already registered."}), 409

        # Create and store new user
        user = User(full_name=data["full_name"], email=data["email"])
        user.set_password(data["password"])
        db.session.add(user)
        db.session.commit()

        print(f"✅ User registered successfully: {data['email']}")
        return jsonify({"message": "User registered successfully."}), 201

    except Exception as e:
        print("🔥 Registration error:", str(e))
        return jsonify({"error": "Registration failed. Please try again."}), 500

# ✅ Login user and issue JWT token
@auth_routes.route("/api/login", methods=["POST"])
def login():
    try:
        print("📨 Incoming login request...")
        data = request.get_json(force=True)
        print("📦 Request JSON:", data)

        if not data or not all(k in data for k in ("email", "password")):
            print("⚠️ Missing login fields.")
            return jsonify({"error": "Missing login fields."}), 400

        user = User.query.filter_by(email=data["email"]).first()

        if user and user.check_password(data["password"]):
            token = jwt.encode({
                "user_id": user.id,
                "email": user.email,
                "full_name": user.full_name,
                "is_admin": user.is_admin,
                "exp": datetime.utcnow() + timedelta(days=1)
            }, SECRET_KEY, algorithm="HS256")

            print(f"✅ Login successful for {data['email']}")
            return jsonify({
                "message": "Login successful.",
                "token": token,
                "user": {
                    "user_id": user.id,
                    "full_name": user.full_name,
                    "is_admin": user.is_admin
                }
            }), 200

        print("❌ Invalid login attempt for:", data["email"])
        return jsonify({"error": "Invalid email or password."}), 401

    except Exception as e:
        print("🔥 Login error:", str(e))
        return jsonify({"error": "Login failed due to server error."}), 500

# ✅ Logout route with CORS headers for frontend integration
@auth_routes.route("/api/logout", methods=["POST", "OPTIONS"])
def logout():
    if request.method == "OPTIONS":
        response = jsonify({"message": "CORS preflight OK for logout"})
        response.headers.add("Access-Control-Allow-Origin", "http://localhost:5173")
        response.headers.add("Access-Control-Allow-Credentials", "true")
        response.headers.add("Access-Control-Allow-Headers", "Content-Type,Authorization")
        response.headers.add("Access-Control-Allow-Methods", "POST,OPTIONS")
        return response

    print("👋 Logout request received.")
    response = make_response(jsonify({"message": "Logout successful."}), 200)
    response.headers.add("Access-Control-Allow-Origin", "http://localhost:5173")
    response.headers.add("Access-Control-Allow-Credentials", "true")
    return response
