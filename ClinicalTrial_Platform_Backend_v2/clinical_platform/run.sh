#!/bin/bash
echo "======================================================"
echo " AI Clinical Trial Optimization Platform v2.0"
echo " Team: The Collapse Architects | HACK4SOC 3.0"
echo "======================================================"
echo ""
echo "Step 1: Installing dependencies..."
pip install -r requirements.txt -q

echo ""
echo "Step 2: Running tests..."

python -c "
from database.connection import init_db, check_db_health
init_db()
h = check_db_health()
print('  DATABASE:', h['status'].upper(), '| Trials:', h['trials'])
"

python -c "
from compiler.dsl_compiler import compile_trial
r = compile_trial('TRIAL t { PATIENT: age IN [40,60] DURATION: months = 6 ARMS: m = \"X\" MONITOR: s = true BUDGET: a = 100000 SITES: c = 2 }')
print('  COMPILER: PASS' if r['success'] else '  COMPILER: FAIL')
"

python -c "
from ai.response_predictor import ResponsePredictionEngine, generate_training_data
e = ResponsePredictionEngine()
e.train(generate_training_data())
p = e.predict_patient({'id':'T','age':52,'hba1c':8.5,'bmi':28,'gene_BRCA1':1,'gene_TP53':0,'crp_level':3.2,'insulin_resistance':4.5,'hrv_baseline':45,'spo2_mean':97,'gender_M':1})
print('  AI ENGINE: PASS |', p['classification'])
"

python -c "
from quantum.cohort_optimizer import optimize_cohort
r = optimize_cohort({'min_age':40,'max_age':65,'diagnoses':['T2DM'],'exclude_cardiac':True,'max_insulin':40},target_n=3,budget=80000)
print('  QUANTUM: PASS | Qubits:', r['quantum_result']['qubits_used'], '| Selected:', r['quantum_result']['selected_count'])
"

python -c "
from matching.trial_matcher import match_patient_to_trials
r = match_patient_to_trials({'id':'T','age':52,'diagnosis':'T2DM','hba1c':8.5,'cardiac_history':False},0.72)
print('  MATCHER: PASS | Eligible trials:', r['eligible_trials_found'])
"

echo ""
echo "======================================================"
echo " ALL SYSTEMS OPERATIONAL"
echo " Starting server on http://localhost:8000"
echo " API Docs: http://localhost:8000/docs"
echo " Database: SQLite (switch to PostgreSQL via .env)"
echo "======================================================"
echo ""

python -m uvicorn api.main:app --host 0.0.0.0 --port 8000 --reload
