# 📁 sync_gcs_to_db.py
# ✅ Synchronizes files from GCS with the 'resources' table in PostgreSQL

from google.cloud import storage
from app import create_app, db
from app.models.resource import Resource
from app.models.category import Category
import os

# 🔧 Configuration
BUCKET_NAME = os.getenv("GCS_BUCKET_NAME", "elimu-online-resources")

# ✅ Initialize Flask app context
app = create_app()

def sync_from_gcs():
    with app.app_context():
        try:
            client = storage.Client()
            bucket = client.bucket(BUCKET_NAME)
            blobs = bucket.list_blobs()

            synced = 0
            skipped = 0

            for blob in blobs:
                path = blob.name
                parts = path.split("/")  # expected: category/level/form/subject/term/filename

                if len(parts) != 6:
                    print(f"⚠️ Skipping malformed path: {path}")
                    continue

                category_name, level, form_class, subject, term, filename = parts

                # ✅ Skip duplicates
                file_url = f"https://storage.googleapis.com/{BUCKET_NAME}/{path}"
                if Resource.query.filter_by(filename=filename, file_url=file_url).first():
                    skipped += 1
                    continue

                # ✅ Get or create category
                category = Category.query.filter_by(name=category_name.lower()).first()
                if not category:
                    category = Category(name=category_name.lower())
                    db.session.add(category)
                    db.session.commit()

                # ✅ Add resource entry
                new_resource = Resource(
                    filename=filename,
                    subject=subject.title(),
                    class_form=form_class.upper(),
                    level=level.lower(),
                    term=term.title(),
                    category_id=category.id,
                    price=0,
                    file_url=file_url
                )

                db.session.add(new_resource)
                synced += 1

            db.session.commit()
            print(f"✅ Synced {synced} files. Skipped {skipped} duplicates.")

        except Exception as e:
            print(f"🔥 Error during sync: {e}")

# 🚀 Run it
if __name__ == "__main__":
    sync_from_gcs()
