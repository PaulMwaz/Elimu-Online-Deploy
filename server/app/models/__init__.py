# 📁 server/app/models/__init__.py

from .. import db  # 🔗 Import the SQLAlchemy instance

# ✅ Import all model definitions
from .user import User, user_resources
from .resource import Resource
from .category import Category
from .purchase import Purchase
from .feedback import Feedback

# ✅ Register all models for Flask-Migrate to detect during migrations
__all__ = [
    "User",
    "Resource",
    "Category",
    "Purchase",
    "Feedback",
    "user_resources"
]
