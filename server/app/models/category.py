# 📁 server/app/models/category.py

from .. import db

class Category(db.Model):
    __tablename__ = 'categories'  # ✅ Define explicit table name for clarity in migrations

    id = db.Column(db.Integer, primary_key=True)  # 🔑 Unique identifier for each category
    name = db.Column(db.String(100), unique=True, nullable=False)  # 📛 Category name (must be unique)
    description = db.Column(db.Text, nullable=True)  # 📝 Optional description of the category

    # 🔗 One-to-Many relationship: A category can have many resources
    resources = db.relationship(
        "Resource",               # 🎯 Related model
        back_populates="category", # 🔄 Sync with `category` field in Resource model
        cascade="all, delete",     # 🧹 Delete related resources if category is deleted
        lazy=True                  # 💤 Load resources only when accessed
    )

    def __repr__(self):
        return f"<Category {self.name}>"  # 📌 Developer-friendly string representation
