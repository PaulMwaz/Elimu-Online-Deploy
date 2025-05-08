# 📁 create_default_admin.py
# Script to create a default admin user if not already present in the database

from app import create_app, db
from app.models.user import User

# ✅ Initialize the Flask app
app = create_app()

with app.app_context():
    # ✅ Check if the admin user exists
    if not User.query.filter_by(email="admin@elimu.org").first():
        # ✅ Create new admin user with default credentials
        admin = User(full_name="Paul", email="admin@elimu.org", is_admin=True)
        admin.set_password("1234")
        db.session.add(admin)
        db.session.commit()
    # No action needed if admin already exists
