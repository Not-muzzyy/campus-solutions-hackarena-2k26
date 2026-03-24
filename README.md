# Campus Solutions 2K26 (Upgraded)

Production-ready Flask + MongoDB Atlas campus management system with role-based workflows, AI-lite insights, and real-time updates.

## Features
- Secure auth with hashed passwords (`generate_password_hash`, `check_password_hash`)
- Roles: admin, faculty, student
- MongoDB collections:
  - `users`
  - `attendance`
  - `assignments`
  - `submissions`
- Faculty can create assignments and mark attendance
- Students can view attendance %, insights, performance indicator, and submit assignments
- Admin can create/delete users and view system stats
- Real-time events via Socket.IO:
  - `new_assignment`
  - `attendance_updated`

## Setup
```bash
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
cp .env.example .env
# edit .env with your Mongo URI and secret key
python run.py
```

Open: `http://127.0.0.1:5000`

## Demo users (seeded automatically if users collection is empty)
- admin / password
- faculty / password
- student / password

## Test flow
1. Login as `faculty` and create an assignment.
2. Keep a student dashboard tab open and observe real-time toast for `new_assignment`.
3. Faculty marks attendance and student dashboard receives `attendance_updated` toast.
4. Login as `admin` to add/remove users and view stats.
