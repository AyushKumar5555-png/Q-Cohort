"""
DATABASE CONNECTION & SESSION MANAGEMENT
Supports PostgreSQL (production) and SQLite (development/demo fallback)
"""

import os
from sqlalchemy import create_engine, text
from sqlalchemy.orm import sessionmaker, Session
from contextlib import contextmanager
from .models import Base, ClinicalTrial, Patient
import json

# ─────────────────────────────────────────────────────────────────────────────
# DATABASE URL — PostgreSQL preferred, SQLite fallback for demo
# ─────────────────────────────────────────────────────────────────────────────
DATABASE_URL = os.environ.get(
    "DATABASE_URL",
    "sqlite:///./clinical_trial_platform.db"   # fallback for demo
)

# Convert postgres:// to postgresql:// if needed (Railway/Heroku style)
if DATABASE_URL.startswith("postgres://"):
    DATABASE_URL = DATABASE_URL.replace("postgres://", "postgresql://", 1)

# Engine config
if DATABASE_URL.startswith("sqlite"):
    engine = create_engine(
        DATABASE_URL,
        connect_args={"check_same_thread": False},
        echo=False
    )
else:
    engine = create_engine(
        DATABASE_URL,
        pool_size=10,
        max_overflow=20,
        pool_pre_ping=True,
        echo=False
    )

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)


# ─────────────────────────────────────────────────────────────────────────────
# DEPENDENCY — FastAPI dependency injection
# ─────────────────────────────────────────────────────────────────────────────
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


@contextmanager
def get_db_context():
    db = SessionLocal()
    try:
        yield db
        db.commit()
    except Exception:
        db.rollback()
        raise
    finally:
        db.close()


# ─────────────────────────────────────────────────────────────────────────────
# INIT — create all tables
# ─────────────────────────────────────────────────────────────────────────────
def init_db():
    Base.metadata.create_all(bind=engine)
    print(f"Database initialized: {DATABASE_URL.split('///')[0]}")
    seed_trials()
    seed_patients()


# ─────────────────────────────────────────────────────────────────────────────
# SEED — populate active clinical trials
# ─────────────────────────────────────────────────────────────────────────────
SEED_TRIALS = [
    {
        "trial_id": "NCT_DM_001",
        "title": "Novel GLP-2 Agonist for Type 2 Diabetes Management",
        "sponsor": "PharmaCorp India Pvt Ltd",
        "location": "Chennai, India",
        "disease": "T2DM", "phase": "Phase III",
        "min_age": 35, "max_age": 65,
        "required_diagnoses": ["T2DM"],
        "exclude_cardiac": True,
        "min_hba1c": 7.0, "max_hba1c": 12.0,
        "patients_needed": 200, "patients_enrolled": 142,
        "urgency": "HIGH", "status": "ACTIVE",
    },
    {
        "trial_id": "NCT_DM_002",
        "title": "Insulin Sensitizer Combination Therapy Trial",
        "sponsor": "AIIMS New Delhi",
        "location": "New Delhi, India",
        "disease": "T2DM", "phase": "Phase II",
        "min_age": 40, "max_age": 70,
        "required_diagnoses": ["T2DM", "Pre-diabetic"],
        "exclude_cardiac": False,
        "min_hba1c": 6.5, "max_hba1c": 14.0,
        "patients_needed": 150, "patients_enrolled": 89,
        "urgency": "MEDIUM", "status": "ACTIVE",
    },
    {
        "trial_id": "NCT_CARD_001",
        "title": "Cardioprotective Agent in Diabetic Patients",
        "sponsor": "Tata Memorial Centre",
        "location": "Mumbai, India",
        "disease": "Hypertension", "phase": "Phase III",
        "min_age": 45, "max_age": 75,
        "required_diagnoses": ["Hypertension", "T2DM"],
        "exclude_cardiac": False,
        "min_hba1c": 0.0, "max_hba1c": 10.0,
        "patients_needed": 300, "patients_enrolled": 201,
        "urgency": "LOW", "status": "ACTIVE",
    },
    {
        "trial_id": "NCT_PRE_001",
        "title": "Lifestyle Intervention for Pre-Diabetic Reversal",
        "sponsor": "Apollo Hospitals Bangalore",
        "location": "Bangalore, India",
        "disease": "Pre-diabetic", "phase": "Phase II",
        "min_age": 30, "max_age": 60,
        "required_diagnoses": ["Pre-diabetic"],
        "exclude_cardiac": True,
        "min_hba1c": 5.7, "max_hba1c": 8.0,
        "patients_needed": 100, "patients_enrolled": 34,
        "urgency": "HIGH", "status": "ACTIVE",
    },
    {
        "trial_id": "NCT_TB_001",
        "title": "Novel Regimen for Drug-Resistant Tuberculosis",
        "sponsor": "ICMR National Institute",
        "location": "Pune, India",
        "disease": "MDR-TB", "phase": "Phase II",
        "min_age": 18, "max_age": 65,
        "required_diagnoses": ["MDR-TB"],
        "exclude_cardiac": False,
        "min_hba1c": 0.0, "max_hba1c": 20.0,
        "patients_needed": 120, "patients_enrolled": 45,
        "urgency": "HIGH", "status": "ACTIVE",
    },
]

def seed_trials():
    with get_db_context() as db:
        for t in SEED_TRIALS:
            exists = db.query(ClinicalTrial).filter_by(trial_id=t["trial_id"]).first()
            if not exists:
                trial = ClinicalTrial(**t)
                db.add(trial)
        print(f"Seeded {len(SEED_TRIALS)} clinical trials into database.")


def seed_patients():
    import json
    import random
    
    paths_to_try = [
        "../clinical-trial-optimizer/clinical.project-tcga-brca.2026-06-05.json",
        "clinical-trial-optimizer/clinical.project-tcga-brca.2026-06-05.json",
        "./clinical-trial-optimizer/clinical.project-tcga-brca.2026-06-05.json",
        "c:\\Users\\Ayush\\OneDrive\\Desktop\\Clinical_Trial\\ClinicalTrial_Platform_Backend_v2\\clinical-trial-optimizer\\clinical.project-tcga-brca.2026-06-05.json"
    ]
    data = None
    for p_path in paths_to_try:
        if os.path.exists(p_path):
            with open(p_path, 'r', encoding='utf-8') as f:
                try:
                    data = json.load(f)
                    break
                except Exception:
                    continue
    if data is None:
        print("TCGA dataset JSON not found for patient seeding, skipping startup seed.")
        return
        
    with get_db_context() as db:
        # Check if we already have patients
        count = db.query(Patient).count()
        if count > 0:
            print(f"Database already has {count} patients, skipping startup seed.")
            return
            
        print("Seeding database with TCGA patients...")
        # Seed 200 patients
        seeded = 0
        for p in data[:200]:
            demo = p.get('demographic', {})
            diagnoses_list = p.get('diagnoses', [{}])
            diagnosis = diagnoses_list[0].get('primary_diagnosis', 'Infiltrating duct carcinoma, NOS') if diagnoses_list else 'Infiltrating duct carcinoma, NOS'
            
            age = demo.get('age_at_index', 50)
            gender_m = 1 if demo.get('gender', '').lower() == 'male' else 0
            gender_str = "M" if gender_m == 1 else "F"
            patient_code = p.get("submitter_id", f"TCGA_{p.get('patient_id', 'UNKNOWN')}")
            
            patient = Patient(
                patient_code=patient_code,
                name=f"TCGA Patient {patient_code}",
                age=int(age) if age is not None else 50,
                gender=gender_str,
                diagnosis=diagnosis,
                hba1c=round(random.uniform(5.5, 10.0), 2),
                bmi=round(random.uniform(18.0, 35.0), 2),
                cardiac_history=random.random() < 0.1,
                insulin_dose=random.randint(0, 80),
                gene_BRCA1=1 if random.random() < 0.3 else 0,
                gene_TP53=1 if random.random() < 0.4 else 0,
                crp_level=round(random.uniform(1.0, 10.0), 2),
                insulin_resistance=round(random.uniform(1.0, 6.0), 2),
                hrv_baseline=round(random.uniform(40, 80), 2),
                spo2_mean=round(random.uniform(94, 99), 2),
                gender_M=gender_m,
                location="USA"
            )
            db.add(patient)
            seeded += 1
        print(f"Seeded {seeded} TCGA patients into database.")


# ─────────────────────────────────────────────────────────────────────────────
# DATABASE HEALTH CHECK
# ─────────────────────────────────────────────────────────────────────────────
def check_db_health() -> dict:
    try:
        with get_db_context() as db:
            db.execute(text("SELECT 1"))
            patient_count = db.query(Patient).count()
            trial_count   = db.query(ClinicalTrial).count()
        return {
            "status": "connected",
            "database": DATABASE_URL.split("///")[0],
            "patients": patient_count,
            "trials": trial_count,
        }
    except Exception as e:
        return {"status": "error", "message": str(e)}
