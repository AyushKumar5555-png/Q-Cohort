#!/usr/bin/env bash
# ============================================================
#  start.sh — One-click launcher (macOS / Linux / WSL)
#  Usage:  bash start.sh
# ============================================================

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
BACKEND="$ROOT/clinical_platform"
FRONTEND="$ROOT/clinical-trial-optimizer"

echo ""
echo "╔══════════════════════════════════════════════════════════╗"
echo "║   AI-Powered Clinical Trial Optimization Platform        ║"
echo "║   Team: The Collapse Architects | HACK4SOC 3.0           ║"
echo "╚══════════════════════════════════════════════════════════╝"
echo ""

# ── Backend ──────────────────────────────────────────────────────────────────
echo "[1/2] Starting FastAPI backend on http://localhost:8000 ..."
cd "$BACKEND"
pip install -r requirements.txt -q
python -m uvicorn api.main:app --host 0.0.0.0 --port 8000 --reload &
BACKEND_PID=$!

sleep 2

# ── Frontend ─────────────────────────────────────────────────────────────────
echo "[2/2] Starting React frontend on http://localhost:3000 ..."
cd "$FRONTEND"
[ ! -d node_modules ] && npm install --silent
npm run dev &
FRONTEND_PID=$!

echo ""
echo "╔══════════════════════════════════════════════════════════╗"
echo "║  Frontend  →  http://localhost:3000                      ║"
echo "║  Backend   →  http://localhost:8000                      ║"
echo "║  API Docs  →  http://localhost:8000/docs                 ║"
echo "║                                                          ║"
echo "║  Press Ctrl+C to stop both services.                     ║"
echo "╚══════════════════════════════════════════════════════════╝"
echo ""

# Trap Ctrl+C and kill both processes
trap "kill $BACKEND_PID $FRONTEND_PID 2>/dev/null; echo 'Services stopped.'; exit 0" SIGINT SIGTERM

wait
