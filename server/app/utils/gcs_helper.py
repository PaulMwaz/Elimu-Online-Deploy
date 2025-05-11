# 📁 server/app/utils/gcs_helper.py

import os
import json
from google.cloud import storage
from google.auth.exceptions import DefaultCredentialsError
from google.oauth2 import service_account

def upload_to_gcs(bucket_name, file_obj, destination_blob_name):
    """
    Uploads a file object to Google Cloud Storage using credentials from an env variable.

    Args:
        bucket_name (str): The GCS bucket name.
        file_obj: werkzeug FileStorage object.
        destination_blob_name (str): Path in GCS bucket.

    Returns:
        str: Public file URL.
    """
    try:
        raw_json = os.getenv("GOOGLE_APPLICATION_CREDENTIALS_JSON")
        if not raw_json:
            raise RuntimeError("Missing GOOGLE_APPLICATION_CREDENTIALS_JSON environment variable.")

        credentials_info = json.loads(raw_json)
        credentials = service_account.Credentials.from_service_account_info(credentials_info)

        client = storage.Client(credentials=credentials)
        bucket = client.bucket(bucket_name)
        blob = bucket.blob(destination_blob_name)

        blob.upload_from_file(
            file_obj.stream,
            content_type=file_obj.content_type,
            rewind=True,
            timeout=600
        )

        return f"https://storage.googleapis.com/{bucket_name}/{destination_blob_name}"

    except json.JSONDecodeError:
        raise RuntimeError("Invalid JSON in GOOGLE_APPLICATION_CREDENTIALS_JSON.")
    except DefaultCredentialsError as cred_err:
        raise RuntimeError(f"GCS default credentials error: {cred_err}")
    except Exception as e:
        raise RuntimeError(f"GCS upload failed: {e}")
