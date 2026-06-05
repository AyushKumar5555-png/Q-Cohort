# AI-Powered Clinical Trial Optimization Platform
## Team: The Collapse Architects | HACK4SOC 3.0

### What is built
- DSL Compiler (Lexer → Parser → AST → Semantic → FDA Compliance)
- Quantum Cohort Optimizer (QUBO on Qiskit Aer)
- AI Response Predictor (Cox PH Survival Analysis)
- Trial Matching Engine (Global patient-trial matching)
- FastAPI Backend (all engines connected)
- PostgreSQL/SQLite Database (all data persisted)

### To run
```bash
pip install -r requirements.txt
bash run.sh
```

### Switch to PostgreSQL
Edit .env:
```
DATABASE_URL=postgresql://user:password@localhost:5432/clinical_trial_db
```

### API Endpoints
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | / | Platform info |
| GET | /health | All systems status |
| GET | /stats | Dashboard statistics |
| POST | /compile | Compile DSL protocol |
| POST | /predict | AI response prediction |
| POST | /optimize-cohort | Quantum cohort selection |
| POST | /match | Match patient to trials |
| POST | /full-pipeline | Run all 4 engines |
| POST | /iot/reading | Receive ESP32 sensor data |
| GET | /iot/history/{id} | IoT reading history |
| GET | /trials | All active trials |
| GET | /patients | All patients |
| GET | /predictions/recent | Recent predictions |
| GET | /cohorts/recent | Recent cohorts |
| GET | /compiler/history | Compiler logs |

### What is left for you to do
1. Frontend — React/Next.js dashboard
2. IoT — ESP32 Arduino code

### IoT endpoint
POST /iot/reading
```json
{ "patient_id": "PAT_001", "heart_rate": 88.0, "spo2": 97.5 }
```
