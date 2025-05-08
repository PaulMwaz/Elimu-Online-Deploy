# 📁 server/app/models/user.py

from .. import db
from werkzeug.security import generate_password_hash, check_password_hash

# ✅ Association table for many-to-many relationship: Users ↔ Resources
user_resources = db.Table(
    'user_resources',
    db.Column('user_id', db.Integer, db.ForeignKey('users.id'), primary_key=True),         # FK to user
    db.Column('resource_id', db.Integer, db.ForeignKey('resources.id'), primary_key=True)  # FK to resource
)

class User(db.Model):
    __tablename__ = 'users'  # ✅ Explicit table name for clarity

    id = db.Column(db.Integer, primary_key=True)  # 🔑 Unique user ID
    full_name = db.Column(db.String(100), nullable=False)  # User's full name
    email = db.Column(db.String(120), unique=True, nullable=False)  # Must be unique
    password_hash = db.Column(db.String(255), nullable=False)  # Hashed password
    is_admin = db.Column(db.Boolean, default=False)  # Flag for admin-level access
    
    # 🔐 Optional field for storing reset password tokens
    reset_token = db.Column(db.String(255), nullable=True)

    # 🔁 Many-to-Many: User ↔ Resources
    resources = db.relationship(
        "Resource",                  # Resource model
        secondary=user_resources,    # Link via association table
        back_populates="users",      # Reflect in Resource model
        lazy="subquery"
    )

    # 🔁 One-to-Many: User → Purchases
    purchases = db.relationship(
        "Purchase",                 # Purchase model
        back_populates="user",      # Reflect in Purchase model
        lazy="subquery"
    )

    # 🔁 One-to-Many: User → Feedback
    feedbacks = db.relationship(
        "Feedback",                 # Feedback model
        back_populates="user",      # Reflect in Feedback model
        lazy="subquery"
    )

    def set_password(self, password):
        """🔒 Hash and store the user's password securely."""
        self.password_hash = generate_password_hash(password)

    def check_password(self, password):
        """🔑 Validate a plaintext password against the hashed value."""
        return check_password_hash(self.password_hash, password)
