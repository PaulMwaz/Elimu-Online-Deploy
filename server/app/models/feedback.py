# 📁 server/app/models/feedback.py

from .. import db
from datetime import datetime

class Feedback(db.Model):
    __tablename__ = 'feedbacks'  # ✅ Define custom table name for feedback entries

    id = db.Column(db.Integer, primary_key=True)  # 🔑 Unique identifier for each feedback entry
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)  # 🔗 Link to the submitting user
    message = db.Column(db.Text, nullable=False)  # 💬 Feedback content
    created_at = db.Column(db.DateTime, default=datetime.utcnow)  # 🕒 Timestamp of submission (defaults to now)

    # 🔁 Relationship to the User who submitted the feedback
    user = db.relationship(
        "User",                  # 🧍 Reference the User model
        back_populates="feedbacks",  # 🔄 Sync with `feedbacks` in User model
        lazy=True                # 💤 Load relationship only when accessed
    )

    def __repr__(self):
        return f"<Feedback from User {self.user_id}>"  # 📌 String representation for easier debugging
