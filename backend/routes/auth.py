"""Auth Routes — Login + Register"""
from fastapi import APIRouter, HTTPException
from datetime import datetime
from bson import ObjectId

from database import get_db
from models.schemas import UserCreate, UserLogin, TokenResponse, UserResponse
from utils.auth import hash_password, verify_password, create_access_token

router = APIRouter()


@router.post("/register", status_code=201)
async def register(user: UserCreate):
    db = get_db()
    if await db.users.find_one({"email": user.email}):
        raise HTTPException(status_code=400, detail="Email already registered")

    user_dict = user.model_dump()
    user_dict["password"] = hash_password(user.password)
    user_dict["created_at"] = datetime.utcnow()
    user_dict["fcm_token"] = None

    result = await db.users.insert_one(user_dict)
    return {"id": str(result.inserted_id), "message": "Registered successfully"}


@router.post("/login", response_model=TokenResponse)
async def login(credentials: UserLogin):
    db = get_db()
    user = await db.users.find_one({"email": credentials.email, "role": credentials.role})

    # Demo credentials — always work
    demo = {
        "student": {"email": "student@nims.edu", "password": "student123"},
        "faculty": {"email": "faculty@nims.edu", "password": "faculty123"},
    }
    role = credentials.role
    if credentials.email == demo[role]["email"] and credentials.password == demo[role]["password"]:
        demo_user = UserResponse(
            id="demo_" + role,
            name="Prof. Anand Kumar" if role == "faculty" else "Muzzammil C",
            email=credentials.email,
            role=role,
            roll_number="BCA6A047" if role == "student" else None,
            department="Computer Science",
            semester=6 if role == "student" else None,
            college="NIMS Ballari"
        )
        token = create_access_token({"sub": demo_user.id, "role": role, "name": demo_user.name})
        return TokenResponse(access_token=token, user=demo_user)

    if not user:
        raise HTTPException(status_code=401, detail="Invalid email or password")
    if not verify_password(credentials.password, user["password"]):
        raise HTTPException(status_code=401, detail="Invalid email or password")

    user_resp = UserResponse(
        id=str(user["_id"]),
        name=user["name"],
        email=user["email"],
        role=user["role"],
        roll_number=user.get("roll_number"),
        department=user.get("department"),
        semester=user.get("semester"),
        college=user.get("college", "NIMS Ballari")
    )
    token = create_access_token({"sub": str(user["_id"]), "role": user["role"], "name": user["name"]})
    return TokenResponse(access_token=token, user=user_resp)
