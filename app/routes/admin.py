from flask import Blueprint, flash, redirect, render_template, request, session, url_for
from werkzeug.security import generate_password_hash

from db import assignments_collection, submissions_collection, users_collection
from utils import role_required

admin_bp = Blueprint("admin", __name__, url_prefix="/admin")


@admin_bp.get("/dashboard")
@role_required("admin")
def dashboard():
    users = list(users_collection().find({}, {"password_hash": 0}))
    stats = {
        "total_users": len(users),
        "students": sum(1 for user in users if user["role"] == "student"),
        "faculty": sum(1 for user in users if user["role"] == "faculty"),
        "assignments": assignments_collection().count_documents({}),
        "submissions": submissions_collection().count_documents({}),
    }
    return render_template("admin_dashboard.html", user=session["user"], users=users, stats=stats)


@admin_bp.post("/users")
@role_required("admin")
def create_user():
    username = request.form.get("username", "").strip().lower()
    password = request.form.get("password", "").strip()
    role = request.form.get("role", "student").strip().lower()

    if role not in {"student", "faculty", "admin"}:
        flash("Invalid role.", "error")
        return redirect(url_for("admin.dashboard"))

    if not username or not password:
        flash("Username and password required.", "error")
        return redirect(url_for("admin.dashboard"))

    try:
        users_collection().insert_one(
            {
                "username": username,
                "password_hash": generate_password_hash(password),
                "role": role,
            }
        )
        flash("User created.", "success")
    except Exception:
        flash("Could not create user (duplicate username likely).", "error")

    return redirect(url_for("admin.dashboard"))


@admin_bp.post("/users/delete")
@role_required("admin")
def delete_user():
    user_id = request.form.get("user_id", "")
    current_user_id = session["user"]["id"]

    if user_id == current_user_id:
        flash("You cannot delete your own account.", "error")
        return redirect(url_for("admin.dashboard"))

    from bson import ObjectId

    users_collection().delete_one({"_id": ObjectId(user_id)})
    flash("User deleted.", "success")
    return redirect(url_for("admin.dashboard"))
