from bson import ObjectId
from flask import Blueprint, render_template, request, session

from db import assignments_collection, attendance_collection, submissions_collection
from utils import attendance_insight, now_iso, performance_indicator, role_required

student_bp = Blueprint("student", __name__, url_prefix="/student")


@student_bp.get("/dashboard")
@role_required("student")
def dashboard():
    user_id = session["user"]["id"]

    assignments = list(assignments_collection().find().sort("deadline", 1))
    attendance_rows = list(attendance_collection().find({"student_id": user_id}))

    present_count = sum(1 for item in attendance_rows if item["status"] == "Present")
    attendance_percent = (present_count / len(attendance_rows) * 100) if attendance_rows else 0.0

    submissions = list(submissions_collection().find({"student_id": user_id}))
    submitted_assignment_ids = {str(row["assignment_id"]) for row in submissions}

    for assignment in assignments:
        assignment["id"] = str(assignment["_id"])

    return render_template(
        "student_dashboard.html",
        user=session["user"],
        assignments=assignments,
        attendance_rows=attendance_rows,
        attendance_percent=round(attendance_percent, 2),
        attendance_message=attendance_insight(attendance_percent),
        submitted_assignment_ids=submitted_assignment_ids,
        performance=performance_indicator(attendance_percent, len(submissions), len(assignments)),
    )


@student_bp.post("/submit")
@role_required("student")
def submit_assignment():
    user_id = session["user"]["id"]
    assignment_id = request.form.get("assignment_id", "")
    submission_text = request.form.get("submission_text", "").strip()

    if assignment_id and submission_text:
        submissions_collection().update_one(
            {
                "assignment_id": ObjectId(assignment_id),
                "student_id": user_id,
            },
            {
                "$set": {
                    "submission_text": submission_text,
                    "timestamp": now_iso(),
                }
            },
            upsert=True,
        )

    return dashboard()
