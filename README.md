# Memes App - Setup & Usage

This project consists of two parts:

| Folder | Description |
|--------|-------------|
| `backend/memes-api` | NestJS server + MongoDB |
| `frontend/memes-web` | Next.js client UI |

---

## 1) Requirements

- Docker Desktop (for MongoDB)
- Node.js 18+
- PowerShell or Terminal

---

## 2) Start MongoDB (Docker)

From the project root, run:

```powershell
docker compose up -d
```

This will start:

| Service | Port | Purpose |
|--------|------|---------|
| MongoDB | 27017 | Database |
| Mongo Express UI (optional) | 8081 | Web UI to browse DB |

Verify:

```powershell
docker ps
```

---

## 3) Start the Backend (API)

```powershell
cd backend/memes-api
npm install
npm run start:dev
```

Backend runs at:

```
http://localhost:3000
```

---

## 4) Seed the Meme Data (Required!)

Before using the frontend, load memes into MongoDB:

```powershell
Invoke-RestMethod -Method Post http://localhost:3000/memes/seed
```

Expected output:

```json
{"insertedOrUpdated": 100}
```

If you see a number — ✅ Database is ready.

---

## 5) Start the Frontend (Next.js UI)

```powershell
cd frontend/memes-web
npm install
npm run dev
```

Open the app in your browser:

```
http://localhost:3001
```

---

## 6) Environment Setup

Copy `.env.example` files and fill in your values.

### Backend
```powershell
cd backend/memes-api
cp .env.example .env
```

### Frontend
```powershell
cd frontend/memes-web
cp .env.example.local .env.local
```

---

## ✅ Done

Your Meme App is now running.  
Scroll to load more memes and click **"עריכה"** to rename.
