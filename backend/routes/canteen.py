"""Canteen — Simulated Payment (no Razorpay needed)"""
from fastapi import APIRouter, Depends
from datetime import datetime

from database import get_db
from models.schemas import OrderCreate, OrderStatus
from utils.auth import get_current_user

router = APIRouter()

MENU = [
    {"id": "1",  "name": "Veg Thali",       "price": 60,  "category": "Meals",           "desc": "Rice + Dal + Sabzi + Roti"},
    {"id": "2",  "name": "Egg Thali",        "price": 70,  "category": "Meals",           "desc": "Rice + Dal + Egg Curry + Roti"},
    {"id": "3",  "name": "Chicken Biryani",  "price": 90,  "category": "Meals",           "desc": "Full plate with raita"},
    {"id": "4",  "name": "Veg Biryani",      "price": 70,  "category": "Meals",           "desc": "Full plate with raita"},
    {"id": "5",  "name": "Masala Dosa",      "price": 30,  "category": "Snacks",          "desc": "With sambar & chutney"},
    {"id": "6",  "name": "Bread Omelette",   "price": 25,  "category": "Snacks",          "desc": "2 eggs with bread"},
    {"id": "7",  "name": "Tea / Coffee",     "price": 10,  "category": "Drinks",          "desc": "Freshly prepared"},
    {"id": "8",  "name": "Cold Drink",       "price": 20,  "category": "Drinks",          "desc": "Pepsi / Sprite / Maaza"},
    {"id": "9",  "name": "Samosa (2 pcs)",   "price": 15,  "category": "Snacks",          "desc": "With chutney"},
    {"id": "10", "name": "Vada Pav",         "price": 20,  "category": "Snacks",          "desc": "With chutney"},
]


@router.get("/menu")
async def get_menu():
    return MENU


@router.post("/order", status_code=201)
async def place_order(order: OrderCreate, current_user=Depends(get_current_user)):
    db = get_db()
    subtotal = sum(item.price * item.quantity for item in order.items)
    gst = round(subtotal * 0.05, 2)
    total = round(subtotal + gst, 2)

    count = await db.canteen_orders.count_documents({})
    token = f"IQ-{str(count + 47).zfill(3)}"

    doc = {
        "student_id": current_user["user_id"],
        "items": [i.model_dump() for i in order.items],
        "subtotal": subtotal,
        "gst": gst,
        "total": total,
        "token": token,
        "status": OrderStatus.placed,
        "counter": "Counter 2",
        "estimated_minutes": 12,
        "payment_method": "cash_on_pickup",  # Simulated — no Razorpay
        "created_at": datetime.utcnow()
    }
    result = await db.canteen_orders.insert_one(doc)

    return {
        "id": str(result.inserted_id),
        "token": token,
        "subtotal": subtotal,
        "gst": gst,
        "total": total,
        "status": "placed",
        "estimated_minutes": 12,
        "counter": "Counter 2",
        "message": f"Order placed! Token {token} — Ready in 12 min at Counter 2."
    }


@router.get("/my-orders")
async def my_orders(current_user=Depends(get_current_user)):
    db = get_db()
    orders = await db.canteen_orders.find(
        {"student_id": current_user["user_id"]}
    ).sort("created_at", -1).to_list(20)
    return [{"id": str(o["_id"]), "token": o["token"], "total": o["total"],
             "status": o["status"], "items": o["items"]} for o in orders]
