"""
DATABASE MODELS — SQLAlchemy ORM
Tables: patients, trials, predictions, cohorts, iot_readings, compiler_logs, matches
"""

from sqlalchemy import (
    Column, Integer, Float, String, Boolean,
    DateTime, Text, ForeignKey, JSON, create_engine
)
from sqlalchemy.orm import declarative_base, relationship, sessionmaker
from sqlalchemy.sql import func
from datetime import datetime

Base = declarative_base()


# ─────────────────────────────────────────────────────────────────────────────
# PATIENTS TABLE
# ─────────────────────────────────────────────────────────────────────────────
class Patient(Base):
    __tablename__ = "patients"

    id             = Column(Integer, primary_key=True, autoincrement=True)
    patient_code   = Column(String(50), unique=True, nullable=False)
    name           = Column(String(100), default="Anonymous")
    age            = Column(Integer, nullable=False)
    gender         = Column(String(10))
    diagnosis      = Column(String(100))
    hba1c          = Column(Float)
    bmi            = Column(Float)
    cardiac_history= Column(Boolean, default=False)
    insulin_dose   = Column(Integer, default=0)
    gene_BRCA1     = Column(Integer, default=0)
    gene_TP53      = Column(Integer, default=0)
    crp_level      = Column(Float)
    insulin_resistance = Column(Float)
    hrv_baseline   = Column(Float)
    spo2_mean      = Column(Float)
    gender_M       = Column(Integer, default=1)
    location       = Column(String(200))
    created_at     = Column(DateTime, default=func.now())
    updated_at     = Column(DateTime, default=func.now(), onupdate=func.now())

    # Relationships
    predictions    = relationship("Prediction", back_populates="patient", cascade="all, delete")
    iot_readings   = relationship("IoTReading", back_populates="patient", cascade="all, delete")
    matches        = relationship("TrialMatch", back_populates="patient", cascade="all, delete")

    def to_dict(self):
        return {c.name: getattr(self, c.name) for c in self.__table__.columns}


# ─────────────────────────────────────────────────────────────────────────────
# CLINICAL TRIALS TABLE
# ─────────────────────────────────────────────────────────────────────────────
class ClinicalTrial(Base):
    __tablename__ = "clinical_trials"

    id                 = Column(Integer, primary_key=True, autoincrement=True)
    trial_id           = Column(String(50), unique=True, nullable=False)
    title              = Column(String(500), nullable=False)
    sponsor            = Column(String(200))
    location           = Column(String(200))
    disease            = Column(String(100))
    phase              = Column(String(50))
    min_age            = Column(Integer)
    max_age            = Column(Integer)
    required_diagnoses = Column(JSON)
    exclude_cardiac    = Column(Boolean, default=False)
    min_hba1c          = Column(Float)
    max_hba1c          = Column(Float)
    patients_needed    = Column(Integer)
    patients_enrolled  = Column(Integer, default=0)
    urgency            = Column(String(20))
    status             = Column(String(20), default="ACTIVE")
    dsl_protocol       = Column(Text)
    created_at         = Column(DateTime, default=func.now())
    updated_at         = Column(DateTime, default=func.now(), onupdate=func.now())

    matches            = relationship("TrialMatch", back_populates="trial", cascade="all, delete")

    def to_dict(self):
        return {c.name: getattr(self, c.name) for c in self.__table__.columns}


# ─────────────────────────────────────────────────────────────────────────────
# PREDICTIONS TABLE — AI response predictions
# ─────────────────────────────────────────────────────────────────────────────
class Prediction(Base):
    __tablename__ = "predictions"

    id                      = Column(Integer, primary_key=True, autoincrement=True)
    patient_id              = Column(Integer, ForeignKey("patients.id"), nullable=False)
    patient_code            = Column(String(50))
    response_probability    = Column(Float)
    median_response_months  = Column(Float)
    risk_score              = Column(Float)
    classification          = Column(String(30))
    recommendation          = Column(Text)
    causal_drivers          = Column(JSON)
    model_used              = Column(String(200))
    concordance_index       = Column(Float)
    created_at              = Column(DateTime, default=func.now())

    patient = relationship("Patient", back_populates="predictions")

    def to_dict(self):
        return {c.name: getattr(self, c.name) for c in self.__table__.columns}


# ─────────────────────────────────────────────────────────────────────────────
# COHORTS TABLE — quantum optimizer results
# ─────────────────────────────────────────────────────────────────────────────
class Cohort(Base):
    __tablename__ = "cohorts"

    id                         = Column(Integer, primary_key=True, autoincrement=True)
    cohort_name                = Column(String(200))
    total_screened             = Column(Integer)
    eligible_after_filter      = Column(Integer)
    candidates_sent_to_quantum = Column(Integer)
    selected_count             = Column(Integer)
    target_count               = Column(Integer)
    total_response_score       = Column(Float)
    total_cost                 = Column(Float)
    qubits_used                = Column(Integer)
    shots                      = Column(Integer)
    unique_states_explored     = Column(Integer)
    circuit_depth              = Column(Integer)
    selected_patients          = Column(JSON)
    criteria                   = Column(JSON)
    created_at                 = Column(DateTime, default=func.now())

    def to_dict(self):
        return {c.name: getattr(self, c.name) for c in self.__table__.columns}


# ─────────────────────────────────────────────────────────────────────────────
# IOT READINGS TABLE — live biosensor data
# ─────────────────────────────────────────────────────────────────────────────
class IoTReading(Base):
    __tablename__ = "iot_readings"

    id          = Column(Integer, primary_key=True, autoincrement=True)
    patient_id  = Column(Integer, ForeignKey("patients.id"), nullable=True)
    patient_code= Column(String(50))
    heart_rate  = Column(Float, nullable=False)
    spo2        = Column(Float, nullable=False)
    risk_score  = Column(Float)
    risk_level  = Column(String(20))
    alerts      = Column(JSON)
    source      = Column(String(100), default="ESP32+MAX30102")
    recorded_at = Column(DateTime, default=func.now())

    patient = relationship("Patient", back_populates="iot_readings")

    def to_dict(self):
        return {c.name: getattr(self, c.name) for c in self.__table__.columns}


# ─────────────────────────────────────────────────────────────────────────────
# COMPILER LOGS TABLE — all DSL compilations
# ─────────────────────────────────────────────────────────────────────────────
class CompilerLog(Base):
    __tablename__ = "compiler_logs"

    id               = Column(Integer, primary_key=True, autoincrement=True)
    trial_name       = Column(String(200))
    dsl_source       = Column(Text)
    success          = Column(Boolean)
    tokens_count     = Column(Integer)
    errors           = Column(JSON)
    warnings         = Column(JSON)
    compliance_passed= Column(JSON)
    compliance_failed= Column(JSON)
    ir_output        = Column(JSON)
    stages_completed = Column(JSON)
    compiled_at      = Column(DateTime, default=func.now())

    def to_dict(self):
        return {c.name: getattr(self, c.name) for c in self.__table__.columns}


# ─────────────────────────────────────────────────────────────────────────────
# TRIAL MATCHES TABLE — patient-trial match results
# ─────────────────────────────────────────────────────────────────────────────
class TrialMatch(Base):
    __tablename__ = "trial_matches"

    id               = Column(Integer, primary_key=True, autoincrement=True)
    patient_id       = Column(Integer, ForeignKey("patients.id"), nullable=False)
    trial_db_id      = Column(Integer, ForeignKey("clinical_trials.id"), nullable=True)
    patient_code     = Column(String(50))
    trial_id         = Column(String(50))
    match_score      = Column(Float)
    eligible         = Column(Boolean)
    match_reasons    = Column(JSON)
    disqualifiers    = Column(JSON)
    response_probability = Column(Float)
    matched_at       = Column(DateTime, default=func.now())

    patient = relationship("Patient", back_populates="matches")
    trial   = relationship("ClinicalTrial", back_populates="matches")

    def to_dict(self):
        return {c.name: getattr(self, c.name) for c in self.__table__.columns}
