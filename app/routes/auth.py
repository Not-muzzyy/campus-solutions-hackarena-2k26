from flask import Blueprint, flash, redirect, render_template, request, session, url_for
from werkzeug.security import check_password_hash

from db import users_collection
from utils import serialize_user

auth_bp = Blueprint("auth", __name__, url_prefix="/auth")


@auth_bp.route("/login", methods=["GET", "POST"])
def login():
    if session.get("user"):
        role = session["user"]["role"]
        return redirect(url_for(f"{role}.dashboard"))

    if request.method == "POST":
        username = request.form.get("username", "").strip().lower()
        password = request.form.get("password", "")

        user = users_collection().find_one({"username": username})
        if not user or not check_password_hash(user["password_hash"], password):
            flash("Invalid username or password", "error")
            return render_template("login.html")

        session["user"] = serialize_user(user)
        return redirect(url_for(f"{user['role']}.dashboard"))

    return render_template("login.html")


@auth_bp.get("/logout")
def logout():
    session.clear()
    flash("Logged out successfully.", "success")
    return redirect(url_for("auth.login"))
