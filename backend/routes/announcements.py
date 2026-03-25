"""Announcements with Read Receipts"""
from fastapi import APIRouter, Depends, HTTPException
from datetime import datetime
from bson import ObjectId
from bson.errors import InvalidId

from database import get_db
from models.schemas import AnnouncementCreate, MarkReadRequest
from utils.auth import get_current_user, require_faculty
from utils.notifications import notify_announcement

router = APIRouter()


def safe_object_id(id_str: str):
    """Convert string to ObjectId safely — returns None for demo/invalid IDs"""
    try:
        return ObjectId(id_str)
    except (InvalidId, Exception):
        return None


@router.get("/")
async def get_announcements(current_user=Depends(get_current_user)):
    db = get_db()
    items = await db.announcements.find({}).sort("created_at", -1).to_list(50)
    result = []
    for a in items:
        read_by = a.get("read_by", [])
        result.append({
            "id": str(a["_id"]),
            "title": a["title"],
            "body": a["body"],
            "category": a.get("category", "General"),
            "target": a.get("target", "All Students"),
            "priority": a.get("priority", "Normal"),
            "faculty_name": a.get("faculty_name", "Faculty"),
            "department": a.get("department", "Administration"),
            "created_at": a["created_at"],
            "read_count": len(read_by),
            "total_students": a.get("total_students", 0),
            "is_read": current_user["user_id"] in read_by
        })
    return result


@router.post("/", status_code=201)
async def post_announcement(ann: AnnouncementCreate, current_user=Depends(require_faculty)):
    db = get_db()
    faculty = None
    oid = safe_object_id(current_user["user_id"])
    if oid:
        faculty = await db.users.find_one({"_id": oid})
    faculty_name = faculty["name"] if faculty else current_user.get("name", "Faculty")
    student_count = await db.users.count_documents({"role": "student"})

    doc = {
        **ann.model_dump(),
        "faculty_id": current_user["user_id"],
        "faculty_name": faculty_name,
        "department": faculty.get("department", "Administration") if faculty else "Administration",
        "read_by": [],
        "read_timestamps": {},
        "total_students": student_count,
        "created_at": datetime.utcnow()
    }
    result = await db.announcements.insert_one(doc)

    students = await db.users.find({"role": "student", "fcm_token": {"$ne": None}}, {"fcm_token": 1}).to_list(1000)
    tokens = [s["fcm_token"] for s in students if s.get("fcm_token")]
    if tokens:
        await notify_announcement(tokens, ann.title, doc["department"])

    return {"id": str(result.inserted_id), "status": "posted"}


@router.post("/read")
async def mark_read(req: MarkReadRequest, current_user=Depends(get_current_user)):
    db = get_db()
    oid = safe_object_id(req.announcement_id)
    if not oid:
        raise HTTPException(status_code=400, detail="Invalid announcement ID")
    await db.announcements.update_one(
        {"_id": oid},
        {"$addToSet": {"read_by": current_user["user_id"]},
         "$set": {f"read_timestamps.{current_user['user_id']}": datetime.utcnow()}}
    )
    return {"status": "marked as read"}


@router.get("/{ann_id}/receipts")
async def get_receipts(ann_id: str, current_user=Depends(require_faculty)):
    db = get_db()
    oid = safe_object_id(ann_id)
    if not oid:
        raise HTTPException(status_code=400, detail="Invalid announcement ID")
    ann = await db.announcements.find_one({"_id": oid})
    if not ann:
        raise HTTPException(status_code=404, detail="Not found")

    read_by = ann.get("read_by", [])
    timestamps = ann.get("read_timestamps", {})
    students = await db.users.find({"role": "student"}).to_list(200)

    receipts = []
    for s in students:
        sid = str(s["_id"])
        receipts.append({
            "student_name": s["name"],
            "roll_number": s.get("roll_number", "—"),
            "is_read": sid in read_by,
            "read_at": str(timestamps.get(sid, "—"))
        })

    return {
        "title": ann["title"],
        "total": len(students),
        "read_count": len(read_by),
        "percentage": round(len(read_by) / max(len(students), 1) * 100),
        "receipts": receipts
    }
