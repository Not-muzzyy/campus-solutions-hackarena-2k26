"""Leave Application Routes"""
from fastapi import APIRouter, Depends, HTTPException
from datetime import datetime
from bson import ObjectId

from database import get_db
from models.schemas import LeaveCreate, LeaveAction, LeaveStatus
from utils.auth import get_current_user, require_faculty, require_student
from utils.notifications import notify_leave_update

router = APIRouter()


@router.post("/", status_code=201)
async def submit_leave(leave: LeaveCreate, current_user=Depends(require_student)):
    db = get_db()
    from_dt = datetime.strptime(leave.from_date, "%Y-%m-%d")
    to_dt = datetime.strptime(leave.to_date, "%Y-%m-%d")
    if to_dt < from_dt:
        raise HTTPException(status_code=400, detail="To date must be after From date")
    days = (to_dt - from_dt).days + 1

    count = await db.leave_applications.count_documents({})
    reference = f"#LV-{datetime.utcnow().year}-{str(count + 1).zfill(3)}"

    # Get student name
    student_name = current_user.get("name", "Student")
    if not current_user["user_id"].startswith("demo"):
        student = await db.users.find_one({"_id": ObjectId(current_user["user_id"])})
        if student:
            student_name = student["name"]

    doc = {
        **leave.model_dump(),
        "student_id": current_user["user_id"],
        "student_name": student_name,
        "days": days,
        "status": LeaveStatus.pending,
        "reference": reference,
        "remark": None,
        "created_at": datetime.utcnow()
    }
    result = await db.leave_applications.insert_one(doc)
    doc["id"] = str(result.inserted_id)
    doc["_id"] = str(result.inserted_id)
    return doc


@router.get("/")
async def my_leaves(current_user=Depends(require_student)):
    db = get_db()
    leaves = await db.leave_applications.find(
        {"student_id": current_user["user_id"]}
    ).sort("created_at", -1).to_list(50)
    return [{"id": str(l["_id"]), **{k: str(v) if hasattr(v, 'generation_time') else v for k, v in l.items() if k != "_id"}} for l in leaves]


@router.get("/pending")
async def pending_leaves(current_user=Depends(require_faculty)):
    db = get_db()
    leaves = await db.leave_applications.find({"status": "pending"}).sort("created_at", -1).to_list(100)
    return [{"id": str(l["_id"]), **{k: v for k, v in l.items() if k != "_id"}} for l in leaves]


@router.get("/all")
async def all_leaves(current_user=Depends(require_faculty)):
    db = get_db()
    leaves = await db.leave_applications.find({}).sort("created_at", -1).to_list(200)
    return [{"id": str(l["_id"]), **{k: v for k, v in l.items() if k != "_id"}} for l in leaves]


@router.patch("/{leave_id}/action")
async def action_leave(leave_id: str, action: LeaveAction, current_user=Depends(require_faculty)):
    db = get_db()
    await db.leave_applications.update_one(
        {"_id": ObjectId(leave_id)},
        {"$set": {"status": action.action, "remark": action.remark, "updated_at": datetime.utcnow()}}
    )
    return {"status": "updated", "action": action.action}
