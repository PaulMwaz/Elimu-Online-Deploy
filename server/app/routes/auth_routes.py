from flask import Blueprint, request, jsonify, make_response
from ..models.user import User
from .. import db
import os
import jwt
from datetime import datetime, timedelta

auth_routes = Blueprint("auth_routes", __name__)
SECRET_KEY = os.getenv("SECRET_KEY", "elimu-secret-dev-key")


# 🧪 Health Check Route
@auth_routes.route("/api/test-json", methods=["GET"])
def test_json():
    print("🧪 /api/test-json route accessed")
    return jsonify({"status": "OK"}), 200


# ✅ Register a new user
@auth_routes.route("/api/register", methods=["POST"])
def register():
    print("📨 Incoming registration request...")

    try:
        if not request.is_json:
            print("❌ Request content type is not JSON.")
            return jsonify({"error": "Content-Type must be application/json"}), 400

        data = request.get_json(silent=True)
        print("📦 Parsed JSON payload:", data)

        if not data:
            print("⚠️ Missing or invalid JSON body.")
            return jsonify({"error": "Invalid or missing JSON body"}), 400

        required_fields = ("full_name", "email", "password")
        if not all(k in data for k in required_fields):
            print("⚠️ Missing registration fields. Expected:", required_fields)
            return jsonify({"error": "Missing registration fields."}), 400

        existing_user = User.query.filter_by(email=data["email"]).first()
        if existing_user:
            print(f"❌ Email already registered: {data['email']}")
            return jsonify({"error": "Email already registered."}), 409

        user = User(full_name=data["full_name"], email=data["email"])
        user.set_password(data["password"])
        db.session.add(user)
        db.session.commit()

        print(f"✅ User registered: {data['email']}")
        return jsonify({"message": "User registered successfully."}), 201

    except Exception as e:
        print("🔥 Registration error:", str(e))
        return jsonify({
            "error": "Registration failed",
            "details": str(e)
        }), 500


# ✅ Login user and issue JWT token
@auth_routes.route("/api/login", methods=["POST"])
def login():
    print("📨 Incoming login request...")

    try:
        if not request.is_json:
            print("❌ Request content type is not JSON.")
            return jsonify({"error": "Content-Type must be application/json"}), 400

        data = request.get_json(silent=True)
        print("📦 Parsed JSON payload:", data)

        if not data:
            print("⚠️ Missing or invalid JSON body.")
            return jsonify({"error": "Invalid or missing JSON body"}), 400

        required_fields = ("email", "password")
        if not all(k in data for k in required_fields):
            print("⚠️ Missing login fields. Expected:", required_fields)
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

        print(f"❌ Invalid login attempt for: {data['email']}")
        return jsonify({"error": "Invalid email or password."}), 401

    except Exception as e:
        print("🔥 Login error:", str(e))
        return jsonify({
            "error": "Login failed due to server error.",
            "details": str(e)
        }), 500


# ✅ Logout with CORS headers
@auth_routes.route("/api/logout", methods=["POST", "OPTIONS"])
def logout():
    if request.method == "OPTIONS":
        print("🌐 CORS preflight request for /api/logout")
        response = jsonify({"message": "CORS preflight OK for logout"})
    else:
        print("👋 Logout request received.")
        response = jsonify({"message": "Logout successful."})

    response.headers.add("Access-Control-Allow-Origin", "http://localhost:5173")
    response.headers.add("Access-Control-Allow-Credentials", "true")
    response.headers.add("Access-Control-Allow-Headers", "Content-Type,Authorization")
    response.headers.add("Access-Control-Allow-Methods", "POST,OPTIONS")
    return response
