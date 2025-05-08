from .. import db

class Resource(db.Model):
    __tablename__ = 'resources'  # ✅ Explicitly define table name for clarity

    id = db.Column(db.Integer, primary_key=True)  # 🔑 Primary key identifier

    # 📄 Basic file metadata
    filename = db.Column(db.String(255), nullable=False)     # Original name of the uploaded file
    file_url = db.Column(db.String(500), nullable=False)     # Public URL from Google Cloud Storage

    # 📚 Educational classification metadata
    subject = db.Column(db.String(100), nullable=False)      # Subject name (e.g., Math, English)
    class_form = db.Column(db.String(50), nullable=False)    # Academic class/form (e.g., Form 2, Grade 4)
    level = db.Column(db.String(50), nullable=False)         # Educational level: "primary" or "highschool"
    term = db.Column(db.String(50), nullable=True)           # Term (e.g., "Term 1") or can be null for general use
    price = db.Column(db.Integer, nullable=False, default=0) # Pricing in KES: 0 = Free; >0 = Paid

    # 🔗 Foreign Key to Category table
    category_id = db.Column(db.Integer, db.ForeignKey('categories.id'), nullable=False)

    # 🔁 Many-to-Many relationship with User (via association table)
    users = db.relationship(
        "User",                          # User model
        secondary="user_resources",     # Association table for many-to-many mapping
        back_populates="resources",     # Sync with User.resources
        lazy="subquery"                 # Load efficiently using subquery strategy
    )

    # 🔁 Many-to-One relationship to Category (each resource belongs to one category)
    category = db.relationship(
        "Category",                     # Category model
        back_populates="resources",     # Sync with Category.resources
        lazy="joined"                   # Eager load category with resource
    )

    # 🔁 One-to-Many relationship to Purchases (each resource can have many purchase records)
    purchases = db.relationship(
        "Purchase",                     # Purchase model
        back_populates="resource",      # Sync with Purchase.resource
        lazy="subquery"
    )

    def __repr__(self):
        return f"<Resource #{self.id} '{self.filename}' | {self.subject} | {self.class_form}>"  # 🧾 Readable model output for debugging
