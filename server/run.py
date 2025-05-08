# 📁 run.py
# Entry point for running the Flask application

from app import create_app
from flask_cors import CORS
import os

# ✅ Create and configure the Flask app
app = create_app()

# ✅ Enable Cross-Origin Resource Sharing globally
CORS(app)

if __name__ == "__main__":
    # ✅ Read environment settings
    port = int(os.getenv("PORT", 5555))  # Default to 5555 if not specified
    debug = os.getenv("FLASK_DEBUG", "True") == "True"

    # ✅ Start the development server
    app.run(host="0.0.0.0", port=port, debug=debug)
