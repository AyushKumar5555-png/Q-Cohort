"""
AI PRECISION TRIAL MATCHING ENGINE
Matches predicted responders to active clinical trials globally.
Like LinkedIn for clinical trials.
"""

import json
import numpy as np
from dataclasses import dataclass, field, asdict
from typing import List


# ─────────────────────────────────────────────────────────────────────────────
# TRIAL DATABASE — simulates ClinicalTrials.gov data
# ─────────────────────────────────────────────────────────────────────────────
ACTIVE_TRIALS = [
    {
        "trial_id": "NCT_DM_001",
        "title": "Novel GLP-2 Agonist for Type 2 Diabetes Management",
        "sponsor": "PharmaCorp India Pvt Ltd",
        "location": "Chennai, India",
        "disease": "T2DM",
        "min_age": 35, "max_age": 65,
        "required_diagnosis": ["T2DM"],
        "exclude_cardiac": True,
        "max_hba1c": 12.0, "min_hba1c": 7.0,
        "patients_needed": 200,
        "patients_enrolled": 142,
        "urgency": "HIGH",
        "phase": "Phase III",
    },
    {
        "trial_id": "NCT_DM_002",
        "title": "Insulin Sensitizer Combination Therapy Trial",
        "sponsor": "AIIMS New Delhi",
        "location": "New Delhi, India",
        "disease": "T2DM",
        "min_age": 40, "max_age": 70,
        "required_diagnosis": ["T2DM", "Pre-diabetic"],
        "exclude_cardiac": False,
        "max_hba1c": 14.0, "min_hba1c": 6.5,
        "patients_needed": 150,
        "patients_enrolled": 89,
        "urgency": "MEDIUM",
        "phase": "Phase II",
    },
    {
        "trial_id": "NCT_CARD_001",
        "title": "Cardioprotective Agent in Diabetic Patients",
        "sponsor": "Tata Memorial Centre",
        "location": "Mumbai, India",
        "disease": "Hypertension",
        "min_age": 45, "max_age": 75,
        "required_diagnosis": ["Hypertension", "T2DM"],
        "exclude_cardiac": False,
        "max_hba1c": 10.0, "min_hba1c": 0.0,
        "patients_needed": 300,
        "patients_enrolled": 201,
        "urgency": "LOW",
        "phase": "Phase III",
    },
    {
        "trial_id": "NCT_PRE_001",
        "title": "Lifestyle Intervention for Pre-Diabetic Reversal",
        "sponsor": "Apollo Hospitals",
        "location": "Bangalore, India",
        "disease": "Pre-diabetic",
        "min_age": 30, "max_age": 60,
        "required_diagnosis": ["Pre-diabetic"],
        "exclude_cardiac": True,
        "max_hba1c": 8.0, "min_hba1c": 5.7,
        "patients_needed": 100,
        "patients_enrolled": 34,
        "urgency": "HIGH",
        "phase": "Phase II",
    },
]


# ─────────────────────────────────────────────────────────────────────────────
# MATCH SCORER — calculates compatibility score between patient and trial
# ─────────────────────────────────────────────────────────────────────────────
def compute_match_score(patient: dict, trial: dict, response_prob: float = 0.5) -> dict:
    score = 0.0
    reasons = []
    disqualifiers = []

    # Age check
    if trial["min_age"] <= patient.get("age", 0) <= trial["max_age"]:
        score += 20
        reasons.append("Age within trial range")
    else:
        disqualifiers.append(f"Age {patient.get('age')} outside range [{trial['min_age']}-{trial['max_age']}]")

    # Diagnosis check
    if patient.get("diagnosis") in trial["required_diagnosis"]:
        score += 30
        reasons.append("Diagnosis matches trial requirement")
    else:
        disqualifiers.append(f"Diagnosis {patient.get('diagnosis')} not in {trial['required_diagnosis']}")

    # Cardiac exclusion
    if trial["exclude_cardiac"] and patient.get("cardiac_history", False):
        disqualifiers.append("Cardiac history — excluded by this trial")
    elif not (trial["exclude_cardiac"] and patient.get("cardiac_history", False)):
        score += 15
        reasons.append("Cardiac status compatible")

    # HbA1c check
    hba1c = patient.get("hba1c", 7.0)
    if trial["min_hba1c"] <= hba1c <= trial["max_hba1c"]:
        score += 15
        reasons.append(f"HbA1c {hba1c} within trial range")
    else:
        disqualifiers.append(f"HbA1c {hba1c} outside range")

    # Response probability bonus
    score += response_prob * 20
    reasons.append(f"AI response probability: {round(response_prob*100,1)}%")

    # Urgency bonus
    urgency_bonus = {"HIGH": 10, "MEDIUM": 5, "LOW": 0}
    score += urgency_bonus.get(trial["urgency"], 0)
    if trial["urgency"] == "HIGH":
        reasons.append("Trial urgently needs patients")

    # Slots remaining
    slots = trial["patients_needed"] - trial["patients_enrolled"]
    if slots > 0:
        score += 5
        reasons.append(f"{slots} slots still available")
    else:
        disqualifiers.append("Trial fully enrolled")

    eligible = len(disqualifiers) == 0
    final_score = round(score, 2) if eligible else 0.0

    return {
        "trial_id": trial["trial_id"],
        "trial_title": trial["title"],
        "sponsor": trial["sponsor"],
        "location": trial["location"],
        "phase": trial["phase"],
        "urgency": trial["urgency"],
        "slots_remaining": trial["patients_needed"] - trial["patients_enrolled"],
        "eligible": eligible,
        "match_score": final_score,
        "match_reasons": reasons,
        "disqualifiers": disqualifiers,
    }


# ─────────────────────────────────────────────────────────────────────────────
# MATCHING ENGINE
# ─────────────────────────────────────────────────────────────────────────────
def match_patient_to_trials(patient: dict, response_prob: float = 0.5) -> dict:
    matches = []
    for trial in ACTIVE_TRIALS:
        match = compute_match_score(patient, trial, response_prob)
        matches.append(match)

    eligible_matches = [m for m in matches if m["eligible"]]
    eligible_matches.sort(key=lambda x: x["match_score"], reverse=True)

    return {
        "patient_id": patient.get("id", "UNKNOWN"),
        "patient_name": patient.get("name", "Anonymous"),
        "response_probability": response_prob,
        "total_trials_checked": len(ACTIVE_TRIALS),
        "eligible_trials_found": len(eligible_matches),
        "top_matches": eligible_matches[:3],
        "all_matches": matches,
        "recommendation": (
            f"Patient matched to {len(eligible_matches)} active trial(s). "
            f"Top recommendation: {eligible_matches[0]['trial_title'] if eligible_matches else 'No eligible trials found.'}"
        )
    }


def batch_match(patients_with_predictions: list) -> list:
    results = []
    for item in patients_with_predictions:
        patient = item.get("patient", {})
        response_prob = item.get("response_probability_12m", 0.5)
        result = match_patient_to_trials(patient, response_prob)
        results.append(result)
    return results


if __name__ == "__main__":
    test_patient = {
        "id": "PAT_RAVI_001",
        "name": "Ravi Kumar",
        "age": 52,
        "diagnosis": "T2DM",
        "hba1c": 8.5,
        "cardiac_history": False,
        "location": "Mangaluru, India",
    }
    result = match_patient_to_trials(test_patient, response_prob=0.72)
    print(json.dumps(result, indent=2))
