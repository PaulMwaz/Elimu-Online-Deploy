# 📁 promote_user.py
# ----------------------------------------
# Script to Promote a User to Admin Role
# ----------------------------------------

from app import create_app, db
from app.models.user import User

# Initialize Flask application context
app = create_app()

with app.app_context():
    # Target user email to promote
    email = "paulmwaz@gmail.com"

    # Retrieve user from the database
    user = User.query.filter_by(email=email).first()

    if user:
        # Promote only if not already an admin
        if not user.is_admin:
            user.is_admin = True
            db.session.commit()
        # No changes made if already admin
    # Handle case where user does not exist
