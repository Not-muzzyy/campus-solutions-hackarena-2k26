"""Placements Routes"""
from fastapi import APIRouter, Depends, HTTPException
from datetime import datetime
from bson import ObjectId
from bson.errors import InvalidId

from database import get_db
from models.schemas import PlacementCreate, EnrollRequest
from utils.auth import get_current_user, require_faculty, require_student
from utils.notifications import notify_placement_posted

router = APIRouter()

SEED_PLACEMENTS = [
    {"company": "Infosys", "role": "Systems Engineer", "placement_type": "placement", "compensation": "3.6 LPA", "location": "Bengaluru", "eligibility": "BCA · 60%+", "deadline": "25 Mar 2026", "description": "3 rounds: Online Test, Technical, HR.", "required_skills": ["Java", "DSA", "SQL"], "posted_by": "Prof. Anand Kumar", "enrolled_students": [], "posted_at": datetime.utcnow()},
    {"company": "TCS iON", "role": "Digital Intern", "placement_type": "internship", "compensation": "Rs.10,000/mo", "location": "Remote", "eligibility": "Any · 55%+", "deadline": "20 Mar 2026", "description": "6-month remote internship. PPO opportunity.", "required_skills": ["Python", "Excel"], "posted_by": "Prof. Suma Patil", "enrolled_students": [], "posted_at": datetime.utcnow()},
    {"company": "Wipro WILP", "role": "ML Intern", "placement_type": "internship", "compensation": "Rs.15,000/mo", "location": "Bengaluru", "eligibility": "BCA · ML knowledge", "deadline": "30 Mar 2026", "description": "ML internship — NLP and vision projects.", "required_skills": ["Python", "ML", "Pandas"], "posted_by": "Prof. Ravi Nair", "enrolled_students": [], "posted_at": datetime.utcnow()},
    {"company": "Capgemini", "role": "Analyst", "placement_type": "placement", "compensation": "4.0 LPA", "location": "Pune / Chennai", "eligibility": "BCA · No backlogs", "deadline": "5 Apr 2026", "description": "4 rounds: Aptitude, Pseudocode, Technical, HR.", "required_skills": ["Aptitude", "C"], "posted_by": "Prof. Anand Kumar", "enrolled_students": [], "posted_at": datetime.utcnow()},
    {"company": "NIMS Research Cell", "role": "AI Researcher", "placement_type": "research", "compensation": "Rs.3,000/mo", "location": "On-Campus", "eligibility": "BCA · AI interest", "deadline": "18 Mar 2026", "description": "6-month on-campus AI research.", "required_skills": ["Python", "Research"], "posted_by": "Prof. Deepa Rao", "enrolled_students": [], "posted_at": datetime.utcnow()},
    {"company": "Zoho Corp", "role": "Frontend Dev Intern", "placement_type": "internship", "compensation": "Rs.12,000/mo", "location": "Chennai", "eligibility": "BCA · Web dev portfolio", "deadline": "1 Apr 2026", "description": "Work on real Zoho products.", "required_skills": ["HTML", "CSS", "JS"], "posted_by": "Prof. Suma Patil", "enrolled_students": [], "posted_at": datetime.utcnow()},
]


def safe_object_id(id_str: str):
    try:
        return ObjectId(id_str)
    except (InvalidId, Exception):
        return None


@router.get("/")
async def get_placements(current_user=Depends(get_current_user)):
    db = get_db()
    count = await db.placements.count_documents({})
    if count == 0:
        await db.placements.insert_many(SEED_PLACEMENTS)
    items = await db.placements.find({}).sort("posted_at", -1).to_list(50)
    return [{"id": str(p["_id"]), "company": p["company"], "role": p["role"],
             "placement_type": p["placement_type"], "compensation": p["compensation"],
             "location": p["location"], "eligibility": p["eligibility"],
             "deadline": p["deadline"], "description": p["description"],
             "required_skills": p.get("required_skills", []),
             "posted_by": p["posted_by"],
             "enrolled_count": len(p.get("enrolled_students", [])),
             "is_enrolled": current_user["user_id"] in p.get("enrolled_students", [])} for p in items]


@router.post("/", status_code=201)
async def post_placement(pl: PlacementCreate, current_user=Depends(require_faculty)):
    db = get_db()
    doc = {**pl.model_dump(), "posted_by": current_user.get("name", "Faculty"),
           "faculty_id": current_user["user_id"], "enrolled_students": [], "posted_at": datetime.utcnow()}
    result = await db.placements.insert_one(doc)
    students = await db.users.find({"role": "student", "fcm_token": {"$ne": None}}, {"fcm_token": 1}).to_list(1000)
    tokens = [s["fcm_token"] for s in students if s.get("fcm_token")]
    if tokens:
        await notify_placement_posted(tokens, pl.company, pl.role)
    return {"id": str(result.inserted_id), "status": "posted"}


@router.post("/enroll")
async def enroll(req: EnrollRequest, current_user=Depends(require_student)):
    db = get_db()
    oid = safe_object_id(req.placement_id)
    if not oid:
        raise HTTPException(status_code=400, detail="Invalid placement ID")
    await db.placements.update_one(
        {"_id": oid},
        {"$addToSet": {"enrolled_students": current_user["user_id"]}}
    )
    pl = await db.placements.find_one({"_id": oid})
    return {"status": "enrolled", "company": pl["company"] if pl else "", "role": pl["role"] if pl else ""}
