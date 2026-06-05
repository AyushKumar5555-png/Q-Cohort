"""
DATABASE CRUD OPERATIONS
All create, read, update, delete operations for every table.
"""

from sqlalchemy.orm import Session
from sqlalchemy import desc
from .models import (
    Patient, ClinicalTrial, Prediction,
    Cohort, IoTReading, CompilerLog, TrialMatch
)
from datetime import datetime
from typing import Optional, List


# ─────────────────────────────────────────────────────────────────────────────
# PATIENTS
# ─────────────────────────────────────────────────────────────────────────────
def create_patient(db: Session, data: dict) -> Patient:
    existing = db.query(Patient).filter_by(patient_code=data.get("patient_code", data.get("id"))).first()
    if existing:
        return existing
    patient = Patient(
        patient_code      = data.get("id", data.get("patient_code", f"PAT_{datetime.now().timestamp()}")),
        name              = data.get("name", "Anonymous"),
        age               = data.get("age", 0),
        gender            = data.get("gender", "M"),
        diagnosis         = data.get("diagnosis", "Unknown"),
        hba1c             = data.get("hba1c"),
        bmi               = data.get("bmi"),
        cardiac_history   = data.get("cardiac_history", False),
        insulin_dose      = data.get("insulin_dose", 0),
        gene_BRCA1        = data.get("gene_BRCA1", 0),
        gene_TP53         = data.get("gene_TP53", 0),
        crp_level         = data.get("crp_level"),
        insulin_resistance= data.get("insulin_resistance"),
        hrv_baseline      = data.get("hrv_baseline"),
        spo2_mean         = data.get("spo2_mean"),
        gender_M          = data.get("gender_M", 1),
        location          = data.get("location", "India"),
    )
    db.add(patient)
    db.commit()
    db.refresh(patient)
    return patient


def get_patient(db: Session, patient_code: str) -> Optional[Patient]:
    return db.query(Patient).filter_by(patient_code=patient_code).first()


def get_all_patients(db: Session, skip: int = 0, limit: int = 100) -> List[Patient]:
    return db.query(Patient).offset(skip).limit(limit).all()


def get_patient_count(db: Session) -> int:
    return db.query(Patient).count()


# ─────────────────────────────────────────────────────────────────────────────
# PREDICTIONS
# ─────────────────────────────────────────────────────────────────────────────
def save_prediction(db: Session, patient_db_id: int, patient_code: str, pred: dict, concordance: float) -> Prediction:
    prediction = Prediction(
        patient_id             = patient_db_id,
        patient_code           = patient_code,
        response_probability   = pred.get("response_probability_12m"),
        median_response_months = pred.get("median_response_months"),
        risk_score             = pred.get("risk_score"),
        classification         = pred.get("classification"),
        recommendation         = pred.get("recommendation"),
        causal_drivers         = pred.get("causal_drivers"),
        model_used             = pred.get("model", "Cox PH"),
        concordance_index      = concordance,
    )
    db.add(prediction)
    db.commit()
    db.refresh(prediction)
    return prediction


def get_predictions_for_patient(db: Session, patient_code: str) -> List[Prediction]:
    p = get_patient(db, patient_code)
    if not p:
        return []
    return db.query(Prediction).filter_by(patient_id=p.id).order_by(desc(Prediction.created_at)).all()


def get_recent_predictions(db: Session, limit: int = 20) -> List[Prediction]:
    return db.query(Prediction).order_by(desc(Prediction.created_at)).limit(limit).all()


# ─────────────────────────────────────────────────────────────────────────────
# COHORTS
# ─────────────────────────────────────────────────────────────────────────────
def save_cohort(db: Session, result: dict, criteria: dict, cohort_name: str = None) -> Cohort:
    qr = result.get("quantum_result", {})
    cohort = Cohort(
        cohort_name                = cohort_name or f"COHORT_{datetime.now().strftime('%Y%m%d_%H%M%S')}",
        total_screened             = result.get("total_patients_screened"),
        eligible_after_filter      = result.get("eligible_after_filter"),
        candidates_sent_to_quantum = result.get("candidates_sent_to_quantum"),
        selected_count             = qr.get("selected_count"),
        target_count               = qr.get("target_count"),
        total_response_score       = qr.get("total_response_score"),
        total_cost                 = qr.get("total_cost"),
        qubits_used                = qr.get("qubits_used"),
        shots                      = qr.get("shots"),
        unique_states_explored     = qr.get("unique_states_explored"),
        circuit_depth              = qr.get("circuit_depth"),
        selected_patients          = qr.get("selected_patients", []),
        criteria                   = criteria,
    )
    db.add(cohort)
    db.commit()
    db.refresh(cohort)
    return cohort


def get_recent_cohorts(db: Session, limit: int = 10) -> List[Cohort]:
    return db.query(Cohort).order_by(desc(Cohort.created_at)).limit(limit).all()


# ─────────────────────────────────────────────────────────────────────────────
# IOT READINGS
# ─────────────────────────────────────────────────────────────────────────────
def save_iot_reading(db: Session, patient_code: str, heart_rate: float,
                     spo2: float, risk_score: float, risk_level: str, alerts: list) -> IoTReading:
    p = get_patient(db, patient_code)
    reading = IoTReading(
        patient_id   = p.id if p else None,
        patient_code = patient_code,
        heart_rate   = heart_rate,
        spo2         = spo2,
        risk_score   = risk_score,
        risk_level   = risk_level,
        alerts       = alerts,
    )
    db.add(reading)
    db.commit()
    db.refresh(reading)
    return reading


def get_iot_history(db: Session, patient_code: str, limit: int = 100) -> List[IoTReading]:
    return (
        db.query(IoTReading)
        .filter_by(patient_code=patient_code)
        .order_by(desc(IoTReading.recorded_at))
        .limit(limit)
        .all()
    )


def get_latest_iot(db: Session, patient_code: str) -> Optional[IoTReading]:
    return (
        db.query(IoTReading)
        .filter_by(patient_code=patient_code)
        .order_by(desc(IoTReading.recorded_at))
        .first()
    )


def get_all_recent_iot(db: Session, limit: int = 50) -> List[IoTReading]:
    return db.query(IoTReading).order_by(desc(IoTReading.recorded_at)).limit(limit).all()


# ─────────────────────────────────────────────────────────────────────────────
# COMPILER LOGS
# ─────────────────────────────────────────────────────────────────────────────
def save_compiler_log(db: Session, result: dict, dsl_source: str) -> CompilerLog:
    compliance = result.get("compliance", {})
    log = CompilerLog(
        trial_name        = result.get("trial_name"),
        dsl_source        = dsl_source,
        success           = result.get("success"),
        tokens_count      = result.get("tokens_count"),
        errors            = result.get("errors"),
        warnings          = result.get("warnings"),
        compliance_passed = compliance.get("passed"),
        compliance_failed = compliance.get("violations"),
        ir_output         = result.get("ir"),
        stages_completed  = result.get("stages_completed"),
    )
    db.add(log)
    db.commit()
    db.refresh(log)
    return log


def get_compiler_history(db: Session, limit: int = 20) -> List[CompilerLog]:
    return db.query(CompilerLog).order_by(desc(CompilerLog.compiled_at)).limit(limit).all()


# ─────────────────────────────────────────────────────────────────────────────
# TRIAL MATCHES
# ─────────────────────────────────────────────────────────────────────────────
def save_match(db: Session, patient_db_id: int, patient_code: str,
               match: dict, response_prob: float) -> TrialMatch:
    trial_obj = db.query(ClinicalTrial).filter_by(trial_id=match.get("trial_id")).first()
    tm = TrialMatch(
        patient_id          = patient_db_id,
        trial_db_id         = trial_obj.id if trial_obj else None,
        patient_code        = patient_code,
        trial_id            = match.get("trial_id"),
        match_score         = match.get("match_score"),
        eligible            = match.get("eligible"),
        match_reasons       = match.get("match_reasons"),
        disqualifiers       = match.get("disqualifiers"),
        response_probability= response_prob,
    )
    db.add(tm)
    db.commit()
    db.refresh(tm)
    return tm


def get_matches_for_patient(db: Session, patient_code: str) -> List[TrialMatch]:
    return (
        db.query(TrialMatch)
        .filter_by(patient_code=patient_code)
        .order_by(desc(TrialMatch.match_score))
        .all()
    )


# ─────────────────────────────────────────────────────────────────────────────
# CLINICAL TRIALS
# ─────────────────────────────────────────────────────────────────────────────
def get_all_trials(db: Session) -> List[ClinicalTrial]:
    return db.query(ClinicalTrial).filter_by(status="ACTIVE").all()


def get_trial(db: Session, trial_id: str) -> Optional[ClinicalTrial]:
    return db.query(ClinicalTrial).filter_by(trial_id=trial_id).first()


def update_trial_enrollment(db: Session, trial_id: str, increment: int = 1) -> Optional[ClinicalTrial]:
    trial = get_trial(db, trial_id)
    if trial:
        trial.patients_enrolled = min(trial.patients_enrolled + increment, trial.patients_needed)
        db.commit()
        db.refresh(trial)
    return trial


# ─────────────────────────────────────────────────────────────────────────────
# DASHBOARD STATS
# ─────────────────────────────────────────────────────────────────────────────
def get_dashboard_stats(db: Session) -> dict:
    total_patients   = db.query(Patient).count()
    total_trials     = db.query(ClinicalTrial).filter_by(status="ACTIVE").count()
    total_predictions= db.query(Prediction).count()
    total_matches    = db.query(TrialMatch).filter_by(eligible=True).count()
    total_iot        = db.query(IoTReading).count()
    total_cohorts    = db.query(Cohort).count()
    high_responders  = db.query(Prediction).filter_by(classification="HIGH_RESPONDER").count()
    critical_alerts  = db.query(IoTReading).filter_by(risk_level="HIGH").count()

    return {
        "total_patients":    total_patients,
        "active_trials":     total_trials,
        "total_predictions": total_predictions,
        "eligible_matches":  total_matches,
        "iot_readings":      total_iot,
        "cohorts_optimized": total_cohorts,
        "high_responders":   high_responders,
        "critical_alerts":   critical_alerts,
    }
