# CampusIQ — Heroku Deployment Guide

## What was fixed (Python 3.11 → 3.12+ compatible)

| Issue | Fix |
|-------|-----|
| `pydantic-core` meta generation error | Upgraded to `pydantic==2.10.4` + `pydantic-settings==2.7.0` |
| `user.dict()` deprecated in Pydantic v2 | Replaced all `.dict()` → `.model_dump()` across all route files |
| `langchain.text_splitter` removed in 0.3.x | Changed to `langchain_text_splitters.RecursiveCharacterTextSplitter` |
| `RetrievalQA` deprecated/removed in 0.3.x | Replaced with LCEL chain (`retriever | prompt | llm | parser`) |
| `langchain.prompts` moved | Updated to `langchain_core.prompts` |
| `bcrypt` incompatibility | Pinned `bcrypt==4.2.1` alongside `passlib` |
| Heroku `PORT` env var not used | `main.py` now reads `$PORT` (Heroku sets this automatically) |
| No `Procfile` | Added `Procfile` with `uvicorn` command |
| No `runtime.txt` | Added `runtime.txt` → Python 3.12.8 |
| All package versions bumped | Compatible with Python 3.12, all current as of 2026 |

---

## Backend Deploy to Heroku

### 1. Prerequisites
```bash
# Install Heroku CLI
# https://devcenter.heroku.com/articles/heroku-cli

heroku login
```

### 2. Create Heroku app
```bash
cd campusiq2-fixed/backend
git init
heroku create campusiq-backend
```

### 3. Set config vars (replace values with yours)
```bash
heroku config:set MONGODB_URL="mongodb+srv://user:pass@cluster.mongodb.net/campusiq?retryWrites=true&w=majority"
heroku config:set DB_NAME="campusiq"
heroku config:set JWT_SECRET="your_super_secret_jwt_key_min_32_chars"
heroku config:set JWT_ALGORITHM="HS256"
heroku config:set JWT_EXPIRE_HOURS="24"
heroku config:set GROQ_API_KEY="gsk_your_groq_api_key_here"
heroku config:set GROQ_MODEL="llama-3.1-70b-versatile"
heroku config:set EMBEDDING_MODEL="sentence-transformers/all-MiniLM-L6-v2"
heroku config:set GRIEVANCE_ENCRYPTION_KEY="any_random_32_char_string_here!!"
heroku config:set ALLOWED_ORIGINS="https://your-frontend.vercel.app"
heroku config:set APP_ENV="production"
```

### 4. Deploy
```bash
git add .
git commit -m "Deploy CampusIQ backend"
git push heroku main
```

### 5. Check logs
```bash
heroku logs --tail
```

### 6. Open app
```bash
heroku open
# Should show: {"status":"running","app":"CampusIQ API",...}
```

---

## Frontend Deploy (Vercel — recommended, free)

```bash
cd campusiq2-fixed/frontend

# Create .env.production
echo "VITE_API_URL=https://campusiq-backend.herokuapp.com/api" > .env.production

# Install Vercel CLI
npm i -g vercel
vercel --prod
```

Or push to GitHub and connect to Vercel dashboard — zero config needed.

---

## Local Development

### Backend
```bash
cd backend
python -m venv venv
source venv/bin/activate   # Windows: venv\Scripts\activate
pip install -r requirements.txt
cp .env.example .env       # Fill in your keys
uvicorn main:app --reload --port 8000
```

### Frontend
```bash
cd frontend
npm install
cp .env.example .env       # Set VITE_API_URL=http://localhost:8000/api
npm run dev
```

---

## Demo Credentials (built-in, no DB needed)
- **Student**: `student@nims.edu` / `student123`
- **Faculty**: `faculty@nims.edu` / `faculty123`

## Health Check
`GET /health` → `{"status": "healthy"}`
`GET /` → app info JSON
