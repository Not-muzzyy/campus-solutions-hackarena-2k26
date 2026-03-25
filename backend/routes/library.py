"""Library Routes"""
from fastapi import APIRouter, Depends, HTTPException
from datetime import datetime, timedelta
from bson import ObjectId

from database import get_db
from models.schemas import BookBorrowRequest, BookReturnRequest
from utils.auth import get_current_user, require_student

router = APIRouter()

# Seed books if empty
SEED_BOOKS = [
    {"title": "Database System Concepts", "author": "Silberschatz", "isbn": "978-0-07-802215-9", "department": "CSE", "total_copies": 3, "available_copies": 2},
    {"title": "Computer Networks", "author": "Tanenbaum", "isbn": "978-0-13-212695-3", "department": "CSE", "total_copies": 2, "available_copies": 1},
    {"title": "Introduction to Machine Learning", "author": "Alpaydin", "isbn": "978-0-26-207466-3", "department": "CSE", "total_copies": 2, "available_copies": 2},
    {"title": "Software Engineering", "author": "Sommerville", "isbn": "978-0-13-703515-1", "department": "CSE", "total_copies": 3, "available_copies": 3},
    {"title": "Python Programming", "author": "John Zelle", "isbn": "978-1-59028-241-0", "department": "CSE", "total_copies": 4, "available_copies": 3},
    {"title": "Data Structures in C", "author": "Reema Thareja", "isbn": "978-0-19-945386-6", "department": "CSE", "total_copies": 2, "available_copies": 1},
    {"title": "Web Technologies", "author": "Uttam K. Roy", "isbn": "978-0-19-806430-7", "department": "CSE", "total_copies": 3, "available_copies": 2},
    {"title": "Operating Systems", "author": "Silberschatz", "isbn": "978-0-47-069466-3", "department": "CSE", "total_copies": 2, "available_copies": 0},
]


@router.get("/books")
async def get_books(current_user=Depends(get_current_user)):
    db = get_db()
    count = await db.books.count_documents({})
    if count == 0:
        await db.books.insert_many(SEED_BOOKS)
    books = await db.books.find({}).to_list(100)
    return [{"id": str(b["_id"]), **{k: v for k, v in b.items() if k != "_id"}} for b in books]


@router.post("/borrow")
async def borrow(req: BookBorrowRequest, current_user=Depends(require_student)):
    db = get_db()
    book = await db.books.find_one({"_id": ObjectId(req.book_id)})
    if not book:
        raise HTTPException(status_code=404, detail="Book not found")
    if book["available_copies"] <= 0:
        raise HTTPException(status_code=400, detail="No copies available")

    active = await db.borrows.count_documents({"student_id": current_user["user_id"], "returned": False})
    if active >= 3:
        raise HTTPException(status_code=400, detail="Borrow limit reached (max 3)")

    due = datetime.utcnow() + timedelta(days=30)
    result = await db.borrows.insert_one({
        "book_id": req.book_id,
        "book_title": book["title"],
        "author": book["author"],
        "student_id": current_user["user_id"],
        "borrowed_at": datetime.utcnow(),
        "due_date": due,
        "returned": False
    })
    await db.books.update_one({"_id": ObjectId(req.book_id)}, {"$inc": {"available_copies": -1}})
    return {"id": str(result.inserted_id), "due_date": due.strftime("%d %b %Y"), "status": "borrowed"}


@router.post("/return")
async def return_book(req: BookReturnRequest, current_user=Depends(require_student)):
    db = get_db()
    borrow = await db.borrows.find_one({"_id": ObjectId(req.borrow_id)})
    if not borrow:
        raise HTTPException(status_code=404, detail="Borrow record not found")
    await db.borrows.update_one({"_id": ObjectId(req.borrow_id)}, {"$set": {"returned": True, "returned_at": datetime.utcnow()}})
    await db.books.update_one({"_id": ObjectId(borrow["book_id"])}, {"$inc": {"available_copies": 1}})
    return {"status": "returned"}


@router.get("/my-borrows")
async def my_borrows(current_user=Depends(require_student)):
    db = get_db()
    borrows = await db.borrows.find({"student_id": current_user["user_id"], "returned": False}).to_list(10)
    result = []
    for b in borrows:
        days_left = (b["due_date"] - datetime.utcnow()).days
        result.append({
            "id": str(b["_id"]),
            "book_title": b.get("book_title", ""),
            "author": b.get("author", ""),
            "borrowed_date": b["borrowed_at"].strftime("%d %b %Y"),
            "due_date": b["due_date"].strftime("%d %b %Y"),
            "days_remaining": days_left,
            "status": "overdue" if days_left < 0 else "warning" if days_left <= 3 else "ok"
        })
    return result
