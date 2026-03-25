# CampusIQ — AI-Powered Smart Campus Assistant
## HackArena 2K26 · Team Codex · NIMS Ballari · Campus Solutions

---

## Quick Setup (Windows VS Code)

### Step 1 — Setup Backend .env
```
1. Go to backend/ folder
2. Copy .env.example → rename to .env
3. Fill in your API keys (see below)
```

### Step 2 — Setup Frontend .env
```
1. Go to frontend/ folder
2. Copy .env.example → rename to .env
3. It only needs: VITE_API_URL=http://localhost:8000/api
```

### Step 3 — Open TWO terminals in VS Code (Ctrl + `)

**Terminal 1 — Backend:**
```bash
cd backend
pip install -r requirements.txt
uvicorn main:app --reload --port 8000
```

**Terminal 2 — Frontend:**
```bash
cd frontend
npm install
npm run dev
```

### Step 4 — Open Browser
- App: http://localhost:5173
- API Docs: http://localhost:8000/docs

### Demo Login
| Role    | Email                | Password    |
|---------|----------------------|-------------|
| Student | student@nims.edu     | student123  |
| Faculty | faculty@nims.edu     | faculty123  |

---

## .env File (backend/.env)

```
MONGODB_URL=mongodb+srv://username:password@cluster.mongodb.net/campusiq?retryWrites=true&w=majority
DB_NAME=campusiq
JWT_SECRET=campusiq_secret_key_hackarena_2026
JWT_ALGORITHM=HS256
JWT_EXPIRE_HOURS=24
GROQ_API_KEY=gsk_xxxxxxxxxxxxxxxxxxxx
GROQ_MODEL=llama-3.1-70b-versatile
HUGGINGFACE_API_TOKEN=hf_xxxxxxxxxxxxxxxxxxxx
EMBEDDING_MODEL=sentence-transformers/all-MiniLM-L6-v2
FIREBASE_SERVICE_ACCOUNT_PATH=./firebase-service-account.json
GRIEVANCE_ENCRYPTION_KEY=campusiq_grievance_key_2026_secure
ALLOWED_ORIGINS=http://localhost:5173
APP_ENV=development
APP_PORT=8000
```

---

## Project Structure

```
campusiq/
├── backend/
│   ├── main.py               ← FastAPI app entry point
│   ├── database.py           ← MongoDB Atlas connection
│   ├── requirements.txt      ← All Python packages (Windows friendly)
│   ├── .env.example          ← Copy to .env and fill keys
│   ├── models/
│   │   └── schemas.py        ← All Pydantic models
│   ├── routes/
│   │   ├── auth.py           ← Login / Register
│   │   ├── announcements.py  ← Notices + Read Receipts
│   │   ├── leave.py          ← Leave applications
│   │   ├── grievance.py      ← Anonymous grievances
│   │   ├── canteen.py        ← Food ordering
│   │   ├── library.py        ← Books borrow/return
│   │   ├── placements.py     ← Jobs + internships
│   │   ├── attendance.py     ← Attendance tracking
│   │   ├── marks.py          ← Internal marks
│   │   └── ai.py             ← RAG AI assistant
│   ├── rag/
│   │   └── pipeline.py       ← LangChain + Groq LLaMA 3.1
│   └── utils/
│       ├── auth.py           ← JWT helpers
│       ├── encryption.py     ← AES grievance encryption
│       ├── notifications.py  ← Firebase FCM (optional)
│       └── translate.py      ← Free translation (no API key)
│
└── frontend/
    ├── src/
    │   ├── App.jsx            ← All routes
    │   ├── context/           ← Auth state
    │   ├── api/               ← Axios instance
    │   ├── components/        ← Layout + UI components
    │   └── pages/
    │       ├── Login.jsx
    │       ├── student/       ← 15 student pages
    │       └── faculty/       ← 9 faculty pages
    ├── package.json
    └── vite.config.js
```

---

## Features

### Student Portal (15 features)
- AI Academic Assistant (LLaMA 3.1 + RAG)
- Announcements with Read Receipts
- Exam Tracker with Countdown
- Attendance Tracker with Warnings
- Internal Marks (live updates)
- Results Dashboard
- Previous Year Papers
- Events & Activities
- Smart Canteen Ordering
- Library (borrow/return)
- Placements & Internships
- Leave Application
- Anonymous Grievance Portal
- Lost & Found

### Faculty Portal (9 features)
- Dashboard with alerts
- Post Announcements + Push Notify
- Read Receipts (who read what)
- Leave Approvals
- Mark Attendance
- Enter Internal Marks
- Post Placements
- Canteen (shared)
- View Grievances

---

## APIs Used

| API | Purpose | Free? |
|-----|---------|-------|
| MongoDB Atlas | Database | Yes (512MB) |
| Groq (LLaMA 3.1) | AI Chat | Yes |
| HuggingFace | Embeddings | Yes |
| Firebase | Push Notifications | Yes (optional) |
| deep-translator | Multilingual | Yes (no key needed) |

---

## Team Codex
Muzzammil C · Zahid Ahmed · Ummi Nishath Afza
NIMS Bellary · HackArena 2K26
