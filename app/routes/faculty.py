from datetime import datetime

from flask import Blueprint, flash, redirect, render_template, request, session, url_for

from app import socketio
from db import assignments_collection, attendance_collection, submissions_collection, users_collection
from utils import now_iso, role_required, summarize_assignment

faculty_bp = Blueprint("faculty", __name__, url_prefix="/faculty")


@faculty_bp.get("/dashboard")
@role_required("faculty")
def dashboard():
    students = list(users_collection().find({"role": "student"}, {"password_hash": 0}))
    assignments = list(assignments_collection().find().sort("deadline", 1))
    submissions = list(submissions_collection().find().sort("timestamp", -1))

    assignment_titles = {str(item["_id"]): item["title"] for item in assignments}
    student_names = {str(item["_id"]): item["username"] for item in students}

    return render_template(
        "faculty_dashboard.html",
        user=session["user"],
        students=students,
        assignments=assignments,
        submissions=submissions,
        assignment_titles=assignment_titles,
        student_names=student_names,
    )


@faculty_bp.post("/assignments")
@role_required("faculty")
def create_assignment():
    title = request.form.get("title", "").strip()
    description = request.form.get("description", "").strip()
    deadline = request.form.get("deadline", "").strip()

    if not title or not description or not deadline:
        flash("Please fill all assignment fields.", "error")
        return redirect(url_for("faculty.dashboard"))

    assignment = {
        "title": title,
        "description": description,
        "summary": summarize_assignment(description),
        "deadline": deadline,
        "created_by": session["user"]["username"],
        "created_at": now_iso(),
    }
    result = assignments_collection().insert_one(assignment)

    socketio.emit(
        "new_assignment",
        {
            "id": str(result.inserted_id),
            "title": title,
            "deadline": deadline,
        },
    )
    flash("Assignment created.", "success")
    return redirect(url_for("faculty.dashboard"))


@faculty_bp.post("/attendance")
@role_required("faculty")
def mark_attendance():
    student_id = request.form.get("student_id", "").strip()
    subject = request.form.get("subject", "").strip()
    status = request.form.get("status", "Absent")
    date = request.form.get("date", datetime.utcnow().date().isoformat())

    if not student_id or not subject:
        flash("Student and subject are required.", "error")
        return redirect(url_for("faculty.dashboard"))

    attendance_collection().insert_one(
        {
            "student_id": student_id,
            "subject": subject,
            "date": date,
            "status": status,
        }
    )

    socketio.emit(
        "attendance_updated",
        {
            "student_id": student_id,
            "subject": subject,
            "date": date,
            "status": status,
        },
    )

    flash("Attendance marked.", "success")
    return redirect(url_for("faculty.dashboard"))
