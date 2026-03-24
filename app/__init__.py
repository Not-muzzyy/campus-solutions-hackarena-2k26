import os
from flask import Flask, redirect, url_for
from flask_socketio import SocketIO

from app.routes.auth import auth_bp
from app.routes.student import student_bp
from app.routes.faculty import faculty_bp
from app.routes.admin import admin_bp


socketio = SocketIO(cors_allowed_origins="*", async_mode="threading")


def create_app() -> Flask:
    app = Flask(__name__)
    app.config["SECRET_KEY"] = os.getenv("SECRET_KEY", "change-me-in-env")
    app.config["MONGO_URI"] = os.getenv("MONGO_URI", "")

    app.register_blueprint(auth_bp)
    app.register_blueprint(student_bp)
    app.register_blueprint(faculty_bp)
    app.register_blueprint(admin_bp)

    @app.get("/")
    def home_redirect():
        return redirect(url_for("auth.login"))

    socketio.init_app(app)
    return app
