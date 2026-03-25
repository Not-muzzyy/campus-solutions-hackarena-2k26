"""Grievance — Anonymous + Encrypted"""
from fastapi import APIRouter, Depends
from datetime import datetime

from database import get_db
from models.schemas import GrievanceCreate, GrievanceStatus
from utils.auth import get_current_user, require_faculty
from utils.encryption import encrypt_text, generate_anonymous_ref

router = APIRouter()


@router.post("/", status_code=201)
async def submit(grievance: GrievanceCreate, current_user=Depends(get_current_user)):
    db = get_db()
    ref = generate_anonymous_ref()
    doc = {
        "reference_id": ref,
        "grievance_type": grievance.grievance_type,
        "encrypted_description": encrypt_text(grievance.description),
        "location": grievance.location,
        "incident_date": grievance.incident_date,
        "status": GrievanceStatus.pending,
        "student_id": None if grievance.is_anonymous else current_user["user_id"],
        "is_anonymous": grievance.is_anonymous,
        "created_at": datetime.utcnow()
    }
    await db.grievances.insert_one(doc)
    return {"reference_id": ref, "status": "submitted", "message": "Grievance submitted securely."}


@router.get("/mine")
async def my_grievances(current_user=Depends(get_current_user)):
    db = get_db()
    items = await db.grievances.find(
        {"student_id": current_user["user_id"]},
        {"reference_id": 1, "grievance_type": 1, "status": 1, "created_at": 1}
    ).to_list(20)
    return [{"reference_id": g["reference_id"], "type": g["grievance_type"], "status": g["status"], "date": str(g["created_at"])} for g in items]


@router.get("/")
async def all_grievances(current_user=Depends(require_faculty)):
    db = get_db()
    items = await db.grievances.find({}, {"encrypted_description": 0, "student_id": 0}).to_list(100)
    return [{"id": str(g["_id"]), "reference_id": g["reference_id"], "type": g["grievance_type"],
             "status": g["status"], "location": g.get("location"), "date": str(g["created_at"])} for g in items]


@router.patch("/{ref}/resolve")
async def resolve(ref: str, current_user=Depends(require_faculty)):
    db = get_db()
    await db.grievances.update_one({"reference_id": ref}, {"$set": {"status": "resolved"}})
    return {"status": "resolved"}
