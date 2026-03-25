"""
CampusIQ Backend — FastAPI Entry Point
Team Codex | HackArena 2K26
Fixed for Python 3.12+ / Pydantic v2 / LangChain 0.3.x
"""
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
import uvicorn
import os
from dotenv import load_dotenv

from database import connect_db, close_db
from routes import auth, announcements, leave, grievance, canteen, library, placements, attendance, marks, ai

load_dotenv()

@asynccontextmanager
async def lifespan(app: FastAPI):
    await connect_db()
    print("✓ Connected to MongoDB Atlas")
    yield
    await close_db()
    print("✓ Disconnected from MongoDB")

app = FastAPI(
    title="CampusIQ API",
    description="AI-Powered Smart Campus Assistant — HackArena 2K26 | Team Codex",
    version="1.0.0",
    lifespan=lifespan
)

# CORS — support comma-separated origins from env
raw_origins = os.getenv("ALLOWED_ORIGINS", "http://localhost:5173")
origins = [o.strip() for o in raw_origins.split(",") if o.strip()]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Routers
app.include_router(auth.router,          prefix="/api/auth",          tags=["Auth"])
app.include_router(announcements.router, prefix="/api/announcements", tags=["Announcements"])
app.include_router(leave.router,         prefix="/api/leave",         tags=["Leave"])
app.include_router(grievance.router,     prefix="/api/grievance",     tags=["Grievance"])
app.include_router(canteen.router,       prefix="/api/canteen",       tags=["Canteen"])
app.include_router(library.router,       prefix="/api/library",       tags=["Library"])
app.include_router(placements.router,    prefix="/api/placements",    tags=["Placements"])
app.include_router(attendance.router,    prefix="/api/attendance",    tags=["Attendance"])
app.include_router(marks.router,         prefix="/api/marks",         tags=["Marks"])
app.include_router(ai.router,            prefix="/api/ai",            tags=["AI"])

@app.get("/")
async def root():
    return {
        "status": "running",
        "app": "CampusIQ API",
        "version": "1.0.0",
        "team": "Team Codex — HackArena 2K26"
    }

@app.get("/health")
async def health():
    return {"status": "healthy"}

if __name__ == "__main__":
    port = int(os.getenv("PORT", os.getenv("APP_PORT", 8000)))
    uvicorn.run("main:app", host="0.0.0.0", port=port, reload=False)
