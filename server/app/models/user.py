from .. import db
from werkzeug.security import generate_password_hash, check_password_hash

# =====================================
# 🔗 Association Table: Users ↔ Resources (Many-to-Many)
# =====================================
user_resources = db.Table(
    'user_resources',
    db.Column('user_id', db.Integer, db.ForeignKey('users.id'), primary_key=True),
    db.Column('resource_id', db.Integer, db.ForeignKey('resources.id'), primary_key=True)
)

# =====================================
# 👤 User Model Definition
# =====================================
class User(db.Model):
    __tablename__ = 'users'  # Explicit table name

    id = db.Column(db.Integer, primary_key=True)  # Primary key
    full_name = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password_hash = db.Column(db.String(255), nullable=False)
    is_admin = db.Column(db.Boolean, default=False)
    reset_token = db.Column(db.String(255), nullable=True)  # Optional reset token

    # =====================================
    # 🔁 Relationships
    # =====================================

    # Many-to-Many: Users <-> Resources
    resources = db.relationship(
        "Resource",
        secondary=user_resources,
        back_populates="users",
        lazy="subquery"
    )

    # One-to-Many: User → Purchases
    purchases = db.relationship(
        "Purchase",
        back_populates="user",
        lazy="subquery"
    )

    # One-to-Many: User → Feedback
    feedbacks = db.relationship(
        "Feedback",
        back_populates="user",
        lazy="subquery"
    )

    # =====================================
    # 🔐 Password Methods
    # =====================================
    def set_password(self, password):
        """🔒 Securely hash and store the user's password."""
        print(f"🔐 Hashing password for user: {self.email}")
        self.password_hash = generate_password_hash(password)
        print("✅ Password hash generated.")

    def check_password(self, password):
        """🔑 Validate a plaintext password against the stored hash."""
        is_valid = check_password_hash(self.password_hash, password)
        print(f"🔍 Password validation for {self.email}: {'valid' if is_valid else 'invalid'}")
        return is_valid
