# 📁 sync_gcs_to_db.py
# Synchronizes files stored in Google Cloud Storage with the local database

from google.cloud import storage
from app import create_app, db
from app.models.resource import Resource

# ✅ Initialize Flask app context
app = create_app()
BUCKET_NAME = "elimu-online-resources"

with app.app_context():
    try:
        client = storage.Client()
        bucket = client.bucket(BUCKET_NAME)
        blobs = bucket.list_blobs()

        for blob in blobs:
            path = blob.name
            parts = path.split("/")

            # ✅ Skip blobs that don't match expected path structure
            if len(parts) != 6:
                continue

            category, level, form_class, subject, term, filename = parts

            # ✅ Avoid inserting duplicate entries
            if Resource.query.filter_by(filename=filename).first():
                continue

            file_url = f"https://storage.googleapis.com/{BUCKET_NAME}/{path}"

            # ✅ Insert new resource into DB
            new_resource = Resource(
                filename=filename,
                subject=subject,
                class_form=form_class,
                level=level,
                category_id=1,  # ⚠️ Default value; update later to resolve correct category ID
                term=term,
                price=0,
                file_url=file_url
            )
            db.session.add(new_resource)

        # ✅ Commit all additions
        db.session.commit()

    except Exception:
        pass  # ⚠️ Suppress all errors silently; add logging if needed in production
