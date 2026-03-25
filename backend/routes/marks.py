"""Marks Routes"""
from fastapi import APIRouter, Depends
from datetime import datetime
from bson import ObjectId

from database import get_db
from models.schemas import MarksEntryRequest
from utils.auth import get_current_user, require_faculty, require_student

router = APIRouter()

SEED_MARKS = [
    {"subject": "DBMS",                "subject_code": "CSE601", "ia1": 18, "ia2": 22, "assignment": 8},
    {"subject": "Computer Networks",   "subject_code": "CSE602", "ia1": 20, "ia2": 19, "assignment": 9},
    {"subject": "Machine Learning",    "subject_code": "CSE603", "ia1": 22, "ia2": 20, "assignment": 10},
    {"subject": "Software Engineering","subject_code": "CSE604", "ia1": 17, "ia2": 21, "assignment": 8},
    {"subject": "Project",             "subject_code": "CSE699", "ia1": 23, "ia2": 24, "assignment": 10},
]


@router.get("/my")
async def my_marks(current_user=Depends(require_student)):
    db = get_db()
    records = await db.marks.find({"student_id": current_user["user_id"]}).to_list(20)
    if not records:
        records = [{**s, "student_id": current_user["user_id"]} for s in SEED_MARKS]
    result = []
    for m in records:
        total = (m.get("ia1") or 0) + (m.get("ia2") or 0) + (m.get("assignment") or 0)
        max_total = 60
        result.append({
            "subject": m["subject"],
            "subject_code": m.get("subject_code", ""),
            "ia1": m.get("ia1"),
            "ia2": m.get("ia2"),
            "assignment": m.get("assignment"),
            "total": total,
            "max_total": max_total,
            "percentage": round((total / max_total) * 100, 1)
        })
    return result


@router.post("/enter")
async def enter_marks(req: MarksEntryRequest, current_user=Depends(require_faculty)):
    db = get_db()
    field_map = {"IA 1": "ia1", "IA1": "ia1", "IA 2": "ia2", "IA2": "ia2", "Assignment": "assignment"}
    field = field_map.get(req.assessment_type, "ia1")
    for entry in req.entries:
        await db.marks.update_one(
            {"student_id": entry.student_id, "subject": req.subject},
            {"$set": {field: entry.marks, "subject_code": req.subject_code, "updated_at": datetime.utcnow()}},
            upsert=True
        )
    return {"status": "saved", "subject": req.subject, "assessment": req.assessment_type, "count": len(req.entries)}
