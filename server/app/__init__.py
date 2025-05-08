# 📁 server/app/__init__.py

from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from flask_cors import CORS
from dotenv import load_dotenv
import os

# Load environment variables
load_dotenv()

# Initialize DB and Migrate
db = SQLAlchemy()
migrate = Migrate()

def create_app():
    app = Flask(
        __name__,
        instance_path=os.path.join(os.path.abspath(os.path.dirname(__file__)), '..', 'instance'),
        instance_relative_config=True,
    )

    # Enable CORS for frontend (adjust origin in production)
    CORS(app, resources={r"/api/*": {"origins": ["http://localhost:5173"]}}, supports_credentials=True)

    # Load config
    from .config import Config
    app.config.from_object(Config)

    # Initialize DB and migrations
    db.init_app(app)
    migrate.init_app(app, db)

    # Register blueprints
    from .routes.auth_routes import auth_routes
    from .routes.resource_routes import resource_routes
    from .routes.admin_routes import admin_routes
    from .routes.test_routes import test_routes
    from .routes.file_routes import file_routes
    from .routes.password_routes import password_routes

    app.register_blueprint(auth_routes)
    app.register_blueprint(resource_routes)
    app.register_blueprint(admin_routes)
    app.register_blueprint(test_routes)
    app.register_blueprint(file_routes)
    app.register_blueprint(password_routes)

    # Global error handler
    @app.errorhandler(Exception)
    def handle_error(e):
        return {"error": str(e)}, 500

    # Auto-create tables (for development only)
    if app.config.get("ENV") == "development":
        with app.app_context():
            db.create_all()

    return app
