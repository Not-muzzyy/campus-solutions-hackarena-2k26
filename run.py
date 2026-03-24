import os

from dotenv import load_dotenv
from werkzeug.security import generate_password_hash

from app import create_app, socketio
from db import get_db, users_collection

load_dotenv()
app = create_app()


def seed_demo_users() -> None:
    if users_collection().count_documents({}) > 0:
        return

    users_collection().insert_many(
        [
            {
                "username": "admin",
                "password_hash": generate_password_hash("password"),
                "role": "admin",
            },
            {
                "username": "faculty",
                "password_hash": generate_password_hash("password"),
                "role": "faculty",
            },
            {
                "username": "student",
                "password_hash": generate_password_hash("password"),
                "role": "student",
            },
        ]
    )


if __name__ == "__main__":
    get_db()
    seed_demo_users()
    socketio.run(app, host="0.0.0.0", port=int(os.getenv("PORT", "5000")), debug=False)
