"""All Pydantic Models"""
from pydantic import BaseModel, EmailStr
from typing import Optional, List
from datetime import datetime
from enum import Enum


class UserRole(str, Enum):
    student = "student"
    faculty = "faculty"

class LeaveStatus(str, Enum):
    pending = "pending"
    approved = "approved"
    rejected = "rejected"

class GrievanceStatus(str, Enum):
    pending = "pending"
    review = "review"
    resolved = "resolved"

class OrderStatus(str, Enum):
    placed = "placed"
    preparing = "preparing"
    ready = "ready"

class PlacementType(str, Enum):
    placement = "placement"
    internship = "internship"
    research = "research"


# ── User ─────────────────────────────────────────────
class UserCreate(BaseModel):
    name: str
    email: EmailStr
    password: str
    role: UserRole
    roll_number: Optional[str] = None
    department: Optional[str] = None
    semester: Optional[int] = None
    college: str = "NIMS Ballari"

class UserLogin(BaseModel):
    email: EmailStr
    password: str
    role: UserRole

class UserResponse(BaseModel):
    id: str
    name: str
    email: str
    role: UserRole
    roll_number: Optional[str] = None
    department: Optional[str] = None
    semester: Optional[int] = None
    college: str

class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: UserResponse


# ── Announcement ─────────────────────────────────────
class AnnouncementCreate(BaseModel):
    title: str
    body: str
    category: str = "General"
    target: str = "All Students"
    priority: str = "Normal"

class MarkReadRequest(BaseModel):
    announcement_id: str


# ── Leave ─────────────────────────────────────────────
class LeaveCreate(BaseModel):
    leave_type: str
    from_date: str
    to_date: str
    reason: str
    faculty_id: str = "default"

class LeaveAction(BaseModel):
    leave_id: str
    action: LeaveStatus
    remark: Optional[str] = None


# ── Grievance ─────────────────────────────────────────
class GrievanceCreate(BaseModel):
    grievance_type: str
    description: str
    location: Optional[str] = None
    incident_date: Optional[str] = None
    is_anonymous: bool = True


# ── Canteen ───────────────────────────────────────────
class CartItem(BaseModel):
    item_name: str
    quantity: int
    price: float

class OrderCreate(BaseModel):
    items: List[CartItem]


# ── Library ───────────────────────────────────────────
class BookBorrowRequest(BaseModel):
    book_id: str

class BookReturnRequest(BaseModel):
    borrow_id: str


# ── Placements ────────────────────────────────────────
class PlacementCreate(BaseModel):
    company: str
    role: str
    placement_type: PlacementType
    compensation: str
    location: str
    eligibility: str
    deadline: str
    description: str
    required_skills: List[str] = []

class EnrollRequest(BaseModel):
    placement_id: str


# ── Attendance ────────────────────────────────────────
class AttendanceRecord(BaseModel):
    student_id: str
    status: str

class AttendanceMarkRequest(BaseModel):
    subject: str
    subject_code: str
    date: str
    records: List[AttendanceRecord]


# ── Marks ─────────────────────────────────────────────
class MarkEntry(BaseModel):
    student_id: str
    marks: int

class MarksEntryRequest(BaseModel):
    subject: str
    subject_code: str
    assessment_type: str
    max_marks: int
    entries: List[MarkEntry]


# ── AI ────────────────────────────────────────────────
class AIQueryRequest(BaseModel):
    query: str
    mode: str = "qa"
    language: str = "en"
