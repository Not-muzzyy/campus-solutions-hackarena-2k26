import os
from pymongo import MongoClient, ASCENDING
from pymongo.collection import Collection
from pymongo.database import Database

_client: MongoClient | None = None
_db: Database | None = None


def get_db() -> Database:
    global _client, _db
    if _db is not None:
        return _db

    mongo_uri = os.getenv("MONGO_URI")
    if not mongo_uri:
        raise RuntimeError("MONGO_URI is not set in environment variables")

    _client = MongoClient(mongo_uri)
    db_name = os.getenv("MONGO_DB_NAME", "campus_solutions")
    _db = _client[db_name]
    ensure_indexes(_db)
    return _db


def users_collection() -> Collection:
    return get_db()["users"]


def attendance_collection() -> Collection:
    return get_db()["attendance"]


def assignments_collection() -> Collection:
    return get_db()["assignments"]


def submissions_collection() -> Collection:
    return get_db()["submissions"]


def ensure_indexes(database: Database) -> None:
    database["users"].create_index([("username", ASCENDING)], unique=True)
    database["attendance"].create_index([("student_id", ASCENDING), ("subject", ASCENDING), ("date", ASCENDING)])
    database["assignments"].create_index([("deadline", ASCENDING)])
    database["submissions"].create_index([("assignment_id", ASCENDING), ("student_id", ASCENDING)], unique=True)
