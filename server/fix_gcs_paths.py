# 📁 fix_gcs_paths.py
# ----------------------------------------
# Utility Script to Fix GCS Paths
# Removes redundant "resources/" prefix from blob names in the bucket
# ----------------------------------------

from google.cloud import storage
import os

# Load the target Google Cloud Storage bucket name from environment
BUCKET_NAME = os.getenv("GCS_BUCKET_NAME", "elimu-online-resources")

def fix_paths():
    """
    Corrects blob paths in the specified GCS bucket by removing
    the redundant 'resources/' prefix from each file.
    """
    client = storage.Client()
    bucket = client.bucket(BUCKET_NAME)

    # List all blobs starting with 'resources/' prefix
    blobs = client.list_blobs(BUCKET_NAME, prefix="resources/")
    moved = 0

    for blob in blobs:
        if blob.name.startswith("resources/"):
            # Remove the first occurrence of 'resources/' only
            correct_path = blob.name.replace("resources/", "", 1)

            if correct_path == blob.name:
                continue  # No update needed

            # Copy the blob to the new corrected path and delete the old one
            new_blob = bucket.blob(correct_path)
            new_blob.rewrite(blob)
            blob.delete()
            moved += 1

    # Summary log of how many files were updated
    print(f"Total fixed files: {moved}")

# Run the script when executed directly
if __name__ == "__main__":
    fix_paths()
