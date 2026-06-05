# AI-Powered Clinical Trial Optimization Platform
### Team: The Collapse Architects | HACK4SOC 3.0 | Full-Stack Integration

---

## Architecture Overview

```
ClinicalTrial_Platform_Backend_v2/
├── clinical_platform/          ← Python FastAPI Backend (port 8000)
│   ├── api/main.py             ← All REST endpoints
│   ├── compiler/               ← Copernicus DSL Compiler
│   ├── quantum/                ← QUBO Cohort Optimizer (Qiskit)
│   ├── ai/                     ← Cox PH Survival Model
│   ├── matching/               ← Trial Matching Engine
│   ├── database/               ← SQLAlchemy models + CRUD + migrations
│   ├── requirements.txt
│   └── .env                    ← DATABASE_URL (SQLite default)
│
├── clinical-trial-optimizer/   ← React + Vite + TailwindCSS Frontend (port 3000)
│   ├── src/
│   │   ├── App.tsx             ← Root component (backend-aware)
│   │   ├── services/api.ts     ← Typed API service layer
│   │   ├── hooks/useBackend.ts ← Health-check + stats polling hook
│   │   └── components/         ← DnaBackground, Sidebar, Dashboard, Editor, …
│   ├── vite.config.ts          ← /api proxy → localhost:8000
│   └── .env                    ← VITE_API_URL=http://localhost:8000
│
├── start.ps1                   ← Windows one-click launcher
├── start.sh                    ← macOS/Linux/WSL one-click launcher
└── README.md                   ← This file
```

---

## Quick Start

### Windows (PowerShell)
```powershell
cd ClinicalTrial_Platform_Backend_v2
.\start.ps1
```

### macOS / Linux / WSL
```bash
cd ClinicalTrial_Platform_Backend_v2
bash start.sh
```

Both scripts will:
1. Check for Python and Node.js
2. Install backend pip dependencies
3. Install frontend npm dependencies (first run only)
4. Start FastAPI on **http://localhost:8000**
5. Start the Vite dev server on **http://localhost:3000**

---

## Manual Start

### Backend only
```bash
cd clinical_platform
pip install -r requirements.txt
python -m uvicorn api.main:app --host 0.0.0.0 --port 8000 --reload
```

### Frontend only
```bash
cd clinical-trial-optimizer
npm install
npm run dev
```

---

## How the Integration Works

| Layer | Mechanism |
|---|---|
| **Proxy** | Vite dev server rewrites `/api/*` → `http://localhost:8000/*` (no CORS issues) |
| **API Service** | `src/services/api.ts` — fully typed wrapper for every FastAPI endpoint |
| **Health Hook** | `src/hooks/useBackend.ts` — polls `/health` on mount, every 30 s |
| **Compile** | `handleCompile` in App.tsx calls `POST /api/compile`; falls back to local animation if backend is offline |
| **Status Badge** | Top-right pill shows Backend Online / Offline and live Concordance Index |
| **Demo Mode** | All UI features work offline with simulated data |

---

## API Endpoints

| Method | Path | Description |
|--------|------|-------------|
| GET | `/health` | All engine statuses |
| GET | `/stats` | Dashboard aggregated counts |
| POST | `/compile` | Compile Copernicus DSL |
| POST | `/predict` | AI response prediction |
| POST | `/optimize-cohort` | Quantum cohort optimizer |
| POST | `/match` | Match patient to active trials |
| POST | `/full-pipeline` | All 4 engines in sequence |
| POST | `/iot/reading` | Receive ESP32 sensor data |
| GET | `/iot/history/{id}` | Patient IoT history |
| GET | `/trials` | All active trials |
| GET | `/patients` | All patients |
| GET | `/predictions/recent` | Recent AI predictions |
| GET | `/cohorts/recent` | Recent cohorts |
| GET | `/compiler/history` | Compiler run history |

Interactive API docs: **http://localhost:8000/docs**

---

## Database

Defaults to **SQLite** (zero setup). To switch to PostgreSQL, edit `clinical_platform/.env`:

```env
DATABASE_URL=postgresql://username:password@localhost:5432/clinical_trial_db
```

---

## Prerequisites

| Tool | Version |
|------|---------|
| Python | 3.10 + |
| Node.js | 18 + |
| npm | 9 + |
