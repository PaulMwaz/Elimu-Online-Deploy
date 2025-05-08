# 📁 server/app/models/purchase.py

from .. import db
from datetime import datetime

class Purchase(db.Model):
    __tablename__ = 'purchases'  # ✅ Define custom table name for purchases

    id = db.Column(db.Integer, primary_key=True)  # 🔑 Unique identifier for each purchase
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)  # 🔗 ID of the user who made the purchase
    resource_id = db.Column(db.Integer, db.ForeignKey('resources.id'), nullable=False)  # 🔗 ID of the purchased resource
    amount = db.Column(db.Integer, nullable=False)  # 💵 Amount paid for the resource
    timestamp = db.Column(db.DateTime, default=datetime.utcnow)  # 🕒 Time of purchase (defaults to current time)

    # 🔁 Relationship to the User model (who made the purchase)
    user = db.relationship(
        "User",                  # 🧍 Link to User model
        back_populates="purchases",  # 🔄 Syncs with User.purchases
        lazy=True                # 💤 Load only when accessed
    )

    # 🔁 Relationship to the Resource model (what was purchased)
    resource = db.relationship(
        "Resource",              # 📚 Link to Resource model
        back_populates="purchases",  # 🔄 Syncs with Resource.purchases
        lazy=True
    )

    def __repr__(self):
        return f"<Purchase User {self.user_id} Resource {self.resource_id}>"  # 📌 Helpful string representation
