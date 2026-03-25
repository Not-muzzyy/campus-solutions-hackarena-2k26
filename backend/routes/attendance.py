"""Attendance Routes"""
from fastapi import APIRouter, Depends
from datetime import datetime
from bson import ObjectId
from bson.errors import InvalidId

from database import get_db
from models.schemas import AttendanceMarkRequest
from utils.auth import get_current_user, require_faculty, require_student
from utils.notifications import notify_low_attendance

router = APIRouter()

SEED_ATTENDANCE = [
    {"subject": "Database Management Systems", "subject_code": "CSE601", "present": 18, "total": 25},
    {"subject": "Computer Networks",            "subject_code": "CSE602", "present": 22, "total": 26},
    {"subject": "Machine Learning",             "subject_code": "CSE603", "present": 20, "total": 24},
    {"subject": "Software Engineering",         "subject_code": "CSE604", "present": 23, "total": 26},
    {"subject": "Project Work",                 "subject_code": "CSE699", "present": 15, "total": 17},
]


def safe_object_id(id_str: str):
    try:
        return ObjectId(id_str)
    except (InvalidId, Exception):
        return None


@router.get("/my")
async def my_attendance(current_user=Depends(require_student)):
    db = get_db()
    records = await db.attendance.find({"student_id": current_user["user_id"]}).to_list(20)
    if not records:
        records = [{**s, "student_id": current_user["user_id"]} for s in SEED_ATTENDANCE]
    result = []
    for r in records:
        pct = round((r["present"] / max(r["total"], 1)) * 100, 1)
        result.append({
            "subject": r["subject"], "subject_code": r.get("subject_code", ""),
            "present": r["present"], "total": r["total"], "percentage": pct,
            "status": "danger" if pct < 75 else "warning" if pct < 80 else "safe"
        })
    return result


@router.post("/mark")
async def mark_attendance(req: AttendanceMarkRequest, current_user=Depends(require_faculty)):
    db = get_db()
    for rec in req.records:
        await db.attendance.update_one(
            {"student_id": rec.student_id, "subject": req.subject},
            {"$inc": {"total": 1, "present": 1 if rec.status == "present" else 0},
             "$set": {"subject_code": req.subject_code}},
            upsert=True
        )
        att = await db.attendance.find_one({"student_id": rec.student_id, "subject": req.subject})
        if att:
            pct = (att["present"] / max(att["total"], 1)) * 100
            if pct < 75:
                oid = safe_object_id(rec.student_id)
                if oid:
                    student = await db.users.find_one({"_id": oid})
                    if student and student.get("fcm_token"):
                        await notify_low_attendance(student["fcm_token"], req.subject, pct)
    return {"status": "saved", "subject": req.subject, "date": req.date}
