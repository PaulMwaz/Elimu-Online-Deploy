# 📁 server/app/routes/resource_routes.py

from flask import Blueprint, request, jsonify
from sqlalchemy import func  # ✅ Enables case-insensitive queries
from ..models.resource import Resource
from ..models.category import Category
from .. import db

resource_routes = Blueprint("resource_routes", __name__)

# ✅ Endpoint to filter and return resources based on query parameters
@resource_routes.route("/api/resources", methods=["GET"])
def get_filtered_resources():
    subject = request.args.get("subject")
    form_class = request.args.get("formClass")
    level = request.args.get("level")
    term = request.args.get("term")
    category = request.args.get("category")

    # Start building base query
    query = Resource.query

    # ✅ Apply filters if provided
    if subject:
        query = query.filter(Resource.subject == subject)
    if form_class:
        query = query.filter(Resource.class_form == form_class)
    if level:
        query = query.filter(Resource.level == level)
    if term:
        query = query.filter(Resource.term == term)
    if category:
        category_obj = Category.query.filter(func.lower(Category.name) == category.lower()).first()
        if category_obj:
            query = query.filter(Resource.category_id == category_obj.id)
        else:
            # Return empty list if category doesn't match
            return jsonify([]), 200

    # ✅ Fetch and serialize results
    resources = query.all()
    data = [{
        "id": r.id,
        "filename": r.filename,
        "file_url": r.file_url,
        "subject": r.subject,
        "level": r.level,
        "class_form": r.class_form,
        "term": r.term,
        "category": r.category.name if r.category else None,
        "price": r.price or 0,
    } for r in resources]

    return jsonify({
        "resources": data,
        "count": len(data)
    }), 200
