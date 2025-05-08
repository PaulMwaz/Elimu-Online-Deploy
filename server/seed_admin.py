# 📁 promote_and_list_files.py
# Script to create or update an admin user and optionally list grouped files from the API

from app import create_app, db
from app.models.user import User
import requests

# ✅ Initialize the Flask application context
app = create_app()

with app.app_context():
    email = "paulmwaz@gmail.com"
    password = "1234567"

    # ✅ Check if the user exists, else create new
    user = User.query.filter_by(email=email).first()

    if user:
        user.set_password(password)
        user.is_admin = True
    else:
        user = User(full_name="Paul Mwaz", email=email)
        user.set_password(password)
        user.is_admin = True
        db.session.add(user)

    db.session.commit()

    # ✅ Optional: Fetch and display grouped uploaded files from the API
    BASE_URL = "http://localhost:5555/api/files/grouped"  # Update if running in production

    try:
        response = requests.get(BASE_URL)
        if response.status_code == 200:
            data = response.json()
            for path, files in data.items():
                for f in files:
                    pass  # Replace with logic to process each file if needed
    except Exception:
        pass  # Handle API errors silently or log to a file if needed
