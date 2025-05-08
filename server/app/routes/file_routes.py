# 📁 server/app/routes/file_routes.py

from flask import Blueprint, request, jsonify
from ..utils.auth_utils import verify_token
from ..models.resource import Resource
from .. import db
import os
from urllib.parse import unquote
from werkzeug.utils import secure_filename
from google.cloud import storage

file_routes = Blueprint("file_routes", __name__)
BUCKET_NAME = os.getenv("GCS_BUCKET_NAME")

# ✅ Helper to initialize and return the GCS bucket
def get_bucket():
    client = storage.Client()
    return client.bucket(BUCKET_NAME)

# ✅ List uploaded files grouped by path (category/level/form/subject/term)
@file_routes.route("/api/files/grouped", methods=["GET"])
def list_grouped_files():
    try:
        resources = Resource.query.all()
        grouped = {}

        for res in resources:
            path = f"{res.category.name}/{res.level}/{res.class_form}/{res.subject}/{res.term}"
            grouped.setdefault(path, []).append({
                "id": res.id,
                "name": res.filename,
                "url": res.file_url,
                "price": res.price
            })

        return jsonify(grouped), 200
    except Exception as e:
        return jsonify({"error": "Failed to list files", "details": str(e)}), 500

# ✅ Safely delete file from GCS and database
@file_routes.route("/api/files/delete", methods=["POST"])
def delete_file():
    try:
        token = request.headers.get("Authorization", "").replace("Bearer ", "")
        user = verify_token(token)

        if not user or not user.get("is_admin"):
            return jsonify({"error": "Admin access required"}), 403

        data = request.get_json()
        file_id = data.get("id")
        if not file_id:
            return jsonify({"error": "Missing file ID"}), 400

        resource = Resource.query.get(file_id)
        if not resource:
            return jsonify({"error": "File not found in DB"}), 404

        blob_path = unquote(resource.file_url.split(f"/{BUCKET_NAME}/")[-1])
        bucket = get_bucket()
        blob = bucket.blob(blob_path)

        if blob.exists():
            blob.delete()

        db.session.delete(resource)
        db.session.commit()

        return jsonify({"message": "✅ File deleted successfully"}), 200

    except Exception as e:
        return jsonify({"error": "Failed to delete file", "details": str(e)}), 500

# ✅ Rename file in GCS and update its metadata in the database
@file_routes.route("/api/files/rename", methods=["POST"])
def rename_file():
    try:
        token = request.headers.get("Authorization", "").replace("Bearer ", "")
        user = verify_token(token)

        if not user or not user.get("is_admin"):
            return jsonify({"error": "Admin access required"}), 403

        data = request.get_json()
        file_id = data.get("id")
        new_name = data.get("new_name")

        if not file_id or not new_name:
            return jsonify({"error": "Missing file ID or new name"}), 400

        resource = Resource.query.get(file_id)
        if not resource:
            return jsonify({"error": "File not found"}), 404

        old_blob_path = unquote(resource.file_url.split(f"/{BUCKET_NAME}/")[-1])
        new_filename = secure_filename(new_name)
        new_blob_path = "/".join(old_blob_path.split("/")[:-1]) + f"/{new_filename}"

        bucket = get_bucket()
        old_blob = bucket.blob(old_blob_path)
        new_blob = bucket.blob(new_blob_path)

        if not old_blob.exists():
            return jsonify({"error": "Original file not found in GCS"}), 404

        bucket.copy_blob(old_blob, bucket, new_blob_path)
        old_blob.delete()
        new_blob.make_public()

        resource.filename = new_filename
        resource.file_url = f"https://storage.googleapis.com/{BUCKET_NAME}/{new_blob_path}"
        db.session.commit()

        return jsonify({
            "message": "✅ File renamed successfully",
            "new_url": resource.file_url
        }), 200

    except Exception as e:
        return jsonify({"error": "Failed to rename file", "details": str(e)}), 500
