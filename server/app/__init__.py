from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from flask_cors import CORS
from dotenv import load_dotenv
import os
import traceback

# =====================================
# 🔧 Load environment variables
# =====================================
load_dotenv()

# =====================================
# 🗃️ Initialize extensions
# =====================================
db = SQLAlchemy()
migrate = Migrate()

def create_app():
    # ✅ Initialize Flask app
    app = Flask(
        __name__,
        instance_path=os.path.join(os.path.abspath(os.path.dirname(__file__)), '..', 'instance'),
        instance_relative_config=True,
    )
    print("✅ Flask app initialized.", flush=True)

    # =====================================
    # 🌐 Configure CORS
    # =====================================
    allowed_origins = [
        "http://localhost:5173",                     # Local dev
        "https://elimu-online.onrender.com"          # Render production frontend
    ]

    CORS(app,
         resources={r"/api/*": {"origins": allowed_origins}},
         supports_credentials=True)

    print(f"✅ CORS enabled for: {allowed_origins}", flush=True)

    # =====================================
    # ⚙️ Load Configuration
    # =====================================
    from .config import Config
    app.config.from_object(Config)
    print("✅ Configuration loaded from config.py", flush=True)
    print("🔐 SECRET_KEY:", app.config.get("SECRET_KEY", "Not Set"), flush=True)
    print("🗃️ DATABASE_URL:", app.config.get("SQLALCHEMY_DATABASE_URI", "Not Set"), flush=True)

    # =====================================
    # 🔗 Initialize DB and Migration
    # =====================================
    db.init_app(app)
    migrate.init_app(app, db)
    print("✅ SQLAlchemy and Flask-Migrate initialized", flush=True)

    # =====================================
    # 🔌 Register Blueprints (APIs)
    # =====================================
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
    print("✅ All API blueprints registered", flush=True)

    # =====================================
    # 🔥 Global error handler
    # =====================================
    @app.errorhandler(Exception)
    def handle_error(e):
        print("🔥 Global error:", str(e), flush=True)
        traceback.print_exc()
        return {"error": "An internal server error occurred", "details": str(e)}, 500

    # =====================================
    # 🛠 Auto-create tables in development
    # =====================================
    if app.config.get("ENV") == "development":
        with app.app_context():
            db.create_all()
            print("🛠️ Development mode: Auto-created DB tables", flush=True)

    return app
