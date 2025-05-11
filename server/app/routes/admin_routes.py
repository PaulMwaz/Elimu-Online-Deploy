from flask import Blueprint, request, jsonify, make_response
from werkzeug.utils import secure_filename
from ..models.resource import Resource
from ..models.category import Category
from ..models.user import User
from .. import db
from ..utils.auth_utils import verify_token
from google.cloud import storage
from google.api_core.exceptions import NotFound
import os
import jwt
from datetime import datetime, timedelta

admin_routes = Blueprint("admin_routes", __name__)

BUCKET_NAME = os.getenv("GCS_BUCKET_NAME", "elimu-online-resources")
SECRET_KEY = os.getenv("SECRET_KEY", "elimu-secret-dev-key")

def get_bucket():
    print("🔁 Connecting to Google Cloud Storage...")
    client = storage.Client()
    return client.bucket(BUCKET_NAME)

# ✅ Admin Login
@admin_routes.route("/api/admin/login", methods=["POST", "OPTIONS"])
def admin_login():
    if request.method == "OPTIONS":
        response = jsonify({"message": "CORS preflight for admin login"})
        response.headers.add("Access-Control-Allow-Origin", "*")
        response.headers.add("Access-Control-Allow-Credentials", "true")
        response.headers.add("Access-Control-Allow-Headers", "Content-Type,Authorization")
        response.headers.add("Access-Control-Allow-Methods", "POST,OPTIONS")
        return response

    try:
        data = request.get_json()
        email = data.get("email")
        password = data.get("password")

        print(f"🔐 Admin login attempt for {email}")

        if not email or not password:
            return jsonify({"error": "Missing email or password."}), 400

        user = User.query.filter_by(email=email, is_admin=True).first()

        if user and user.check_password(password):
            token = jwt.encode({
                "user_id": user.id,
                "email": user.email,
                "full_name": user.full_name,
                "is_admin": True,
                "exp": datetime.utcnow() + timedelta(days=1)
            }, SECRET_KEY, algorithm="HS256")

            print("✅ Admin login successful.")
            return jsonify({
                "message": "Admin login successful",
                "token": token,
                "admin": {
                    "user_id": user.id,
                    "full_name": user.full_name,
                    "is_admin": True
                }
            }), 200

        print("❌ Invalid admin credentials.")
        return jsonify({"error": "Invalid admin login credentials."}), 401

    except Exception as e:
        print(f"🔥 Admin login error: {str(e)}")
        return jsonify({"error": "Admin login server error."}), 500

# ✅ Upload
@admin_routes.route("/api/admin/upload", methods=["POST"])
def admin_upload_file():
    try:
        token = request.headers.get("Authorization", "").replace("Bearer ", "")
        user = verify_token(token)
        if not user or not user.get("is_admin"):
            print("🚫 Unauthorized upload attempt")
            return jsonify({"error": "Admin access required"}), 403

        level = request.form.get("level")
        category_name = request.form.get("category")
        form_class = request.form.get("formClass")
        subject = request.form.get("subject")
        price = request.form.get("price", 0)
        term = request.form.get("term") or "General"
        file = request.files.get("file")

        print(f"📤 Upload requested with metadata: {subject}, {level}, {form_class}, {term}, {category_name}, price: {price}")

        if not all([level, category_name, form_class, subject, file]):
            return jsonify({"error": "Missing required fields."}), 400

        category_name = category_name.lower()
        level = level.lower()
        if category_name in ["notes", "e-books", "ebooks"]:
            term = "General"

        category = Category.query.filter_by(name=category_name).first()
        if not category:
            print(f"📁 Creating new category: {category_name}")
            category = Category(name=category_name)
            db.session.add(category)
            db.session.commit()

        filename = secure_filename(file.filename)
        blob_path = f"{category_name}/{level}/{form_class}/{subject}/{term}/{filename}"
        print(f"📁 Saving to GCS: {blob_path}")

        bucket = get_bucket()
        blob = bucket.blob(blob_path)
        blob.upload_from_file(file.stream, content_type=file.content_type)

        file_url = f"https://storage.googleapis.com/{BUCKET_NAME}/{blob_path}"
        print(f"✅ File uploaded to: {file_url}")

        resource = Resource(
            filename=filename,
            file_url=file_url,
            price=int(price),
            level=level,
            class_form=form_class,
            term=term,
            subject=subject,
            category_id=category.id
        )
        db.session.add(resource)
        db.session.commit()
        print("✅ File metadata saved to DB")

        return jsonify({"message": "File uploaded successfully.", "file_url": file_url}), 201

    except Exception as e:
        print(f"🔥 Upload error: {str(e)}")
        return jsonify({"error": "Failed to upload file", "details": str(e)}), 500

# ✅ List All Files
@admin_routes.route("/api/admin/files", methods=["GET", "OPTIONS"])
def list_uploaded_files():
    if request.method == "OPTIONS":
        response = jsonify({"message": "CORS preflight OK"})
        response.headers.add("Access-Control-Allow-Origin", "*")
        response.headers.add("Access-Control-Allow-Credentials", "true")
        return response

    try:
        token = request.headers.get("Authorization", "").replace("Bearer ", "")
        user = verify_token(token)
        if not user or not user.get("is_admin"):
            return jsonify({"error": "Admin access required"}), 403

        resources = Resource.query.all()
        print(f"📋 Listing {len(resources)} uploaded files")

        files = [{
            "id": res.id,
            "filename": res.filename,
            "subject": res.subject,
            "level": res.level,
            "class_form": res.class_form,
            "category": res.category.name if res.category else "",
            "term": res.term,
            "price": res.price,
            "file_url": res.file_url,
        } for res in resources]

        return jsonify(files), 200

    except Exception as e:
        print(f"🔥 Fetch files error: {str(e)}")
        return jsonify({"error": "Failed to fetch files", "details": str(e)}), 500

# ✅ Rename File
@admin_routes.route("/api/admin/rename", methods=["PATCH"])
def rename_uploaded_file():
    try:
        token = request.headers.get("Authorization", "").replace("Bearer ", "")
        user = verify_token(token)
        if not user or not user.get("is_admin"):
            return jsonify({"error": "Admin access required"}), 403

        data = request.get_json()
        resource_id = data.get("id")
        new_name = data.get("newName")

        print(f"✏️ Rename requested: ID={resource_id}, new name={new_name}")

        if not resource_id or not new_name:
            return jsonify({"error": "Missing id or newName"}), 400

        resource = Resource.query.get(resource_id)
        if not resource:
            return jsonify({"error": "Resource not found"}), 404

        bucket = get_bucket()
        old_blob_path = resource.file_url.replace(f"https://storage.googleapis.com/{BUCKET_NAME}/", "")
        old_blob = bucket.blob(old_blob_path)
        if not old_blob.exists():
            return jsonify({"error": "Original file not found on GCS"}), 404

        new_blob_path = "/".join(old_blob_path.split("/")[:-1]) + f"/{secure_filename(new_name)}"
        new_blob = bucket.blob(new_blob_path)

        bucket.copy_blob(old_blob, bucket, new_blob_path)
        old_blob.delete()

        new_file_url = f"https://storage.googleapis.com/{BUCKET_NAME}/{new_blob_path}"
        resource.filename = secure_filename(new_name)
        resource.file_url = new_file_url
        db.session.commit()

        print(f"✅ File renamed successfully: {new_file_url}")
        return jsonify({"message": "File renamed successfully.", "file_url": new_file_url}), 200

    except Exception as e:
        print(f"🔥 Rename error: {str(e)}")
        return jsonify({"error": "Failed to rename file", "details": str(e)}), 500

# ✅ Delete File
@admin_routes.route("/api/admin/delete/<int:resource_id>", methods=["DELETE", "OPTIONS"])
def delete_uploaded_file(resource_id):
    if request.method == "OPTIONS":
        response = jsonify({"message": "CORS preflight for DELETE OK"})
        response.headers.add("Access-Control-Allow-Origin", "*")
        response.headers.add("Access-Control-Allow-Credentials", "true")
        return response

    try:
        token = request.headers.get("Authorization", "").replace("Bearer ", "")
        user = verify_token(token)
        if not user or not user.get("is_admin"):
            return jsonify({"error": "Admin access required"}), 403

        resource = Resource.query.get(resource_id)
        if not resource:
            return jsonify({"error": "File not found"}), 404

        blob_path = resource.file_url.replace(f"https://storage.googleapis.com/{BUCKET_NAME}/", "")
        bucket = get_bucket()
        blob = bucket.blob(blob_path)

        if blob.exists():
            blob.delete()

        db.session.delete(resource)
        db.session.commit()
        print(f"🗑️ File deleted: {resource.filename}")

        return jsonify({"message": "File deleted successfully."}), 200

    except Exception as e:
        print(f"🔥 Delete error: {str(e)}")
        return jsonify({"error": "Failed to delete file", "details": str(e)}), 500
