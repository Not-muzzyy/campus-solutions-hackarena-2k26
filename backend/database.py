"""MongoDB Atlas connection"""
import os
from motor.motor_asyncio import AsyncIOMotorClient
from dotenv import load_dotenv

load_dotenv()

client = None
db = None

async def connect_db():
    global client, db
    client = AsyncIOMotorClient(os.getenv("MONGODB_URL"))
    db = client[os.getenv("DB_NAME", "campusiq")]
    # Create indexes
    await db.users.create_index("email", unique=True)
    await db.announcements.create_index("created_at")
    await db.leave_applications.create_index([("student_id", 1), ("status", 1)])
    await db.attendance.create_index([("student_id", 1), ("subject", 1)])
    await db.marks.create_index([("student_id", 1), ("subject", 1)])

async def close_db():
    global client
    if client:
        client.close()

def get_db():
    return db
