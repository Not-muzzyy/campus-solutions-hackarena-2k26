from __future__ import annotations

from datetime import datetime
from functools import wraps
from typing import Any, Callable

from bson import ObjectId
from flask import flash, redirect, session, url_for


def to_object_id(value: str) -> ObjectId:
    return ObjectId(value)


def get_current_user() -> dict[str, Any] | None:
    return session.get("user")


def login_required(view: Callable) -> Callable:
    @wraps(view)
    def wrapped(*args, **kwargs):
        if not session.get("user"):
            flash("Please log in first.", "error")
            return redirect(url_for("auth.login"))
        return view(*args, **kwargs)

    return wrapped


def role_required(*roles: str) -> Callable:
    def decorator(view: Callable) -> Callable:
        @wraps(view)
        def wrapped(*args, **kwargs):
            user = session.get("user")
            if not user:
                flash("Please log in first.", "error")
                return redirect(url_for("auth.login"))
            if user.get("role") not in roles:
                flash("You do not have access to that page.", "error")
                return redirect(url_for("auth.login"))
            return view(*args, **kwargs)

        return wrapped

    return decorator


def serialize_user(user: dict[str, Any]) -> dict[str, Any]:
    return {
        "id": str(user["_id"]),
        "username": user["username"],
        "role": user["role"],
    }


def summarize_assignment(description: str, limit: int = 120) -> str:
    lines = [line.strip() for line in description.splitlines() if line.strip()]
    summary = lines[0] if lines else description.strip()
    if len(summary) <= limit:
        return summary
    return f"{summary[:limit].rstrip()}..."


def attendance_insight(percent: float) -> str:
    if percent < 75:
        return "Risk of shortage"
    if percent <= 90:
        return "Safe"
    return "Excellent"


def performance_indicator(attendance_percent: float, submitted: int, total: int) -> str:
    submission_rate = (submitted / total * 100) if total else 0
    score = (attendance_percent * 0.6) + (submission_rate * 0.4)
    if score < 55:
        return "Low Performer"
    if score < 80:
        return "Average"
    return "High Performer"


def now_iso() -> str:
    return datetime.utcnow().isoformat()
