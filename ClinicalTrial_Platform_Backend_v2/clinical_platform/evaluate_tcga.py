import json
import random
import sys
import os

# Add to path to import AI module
sys.path.insert(0, os.path.abspath(os.path.dirname(__file__)))
from ai.response_predictor import ResponsePredictionEngine, generate_training_data

def evaluate_tcga():
    print("Loading TCGA dataset...")
    tcga_file = "../clinical-trial-optimizer/clinical.project-tcga-brca.2026-06-05.json"
    try:
        with open(tcga_file, 'r', encoding='utf-8') as f:
            data = json.load(f)
    except Exception as e:
        print(f"Error loading {tcga_file}: {e}")
        return

    print(f"Loaded {len(data)} patients from TCGA.")
    
    # Train the prediction engine
    print("Training prediction engine...")
    engine = ResponsePredictionEngine()
    train_df = generate_training_data(n=500)
    engine.train(train_df)
    
    # Process up to 1098 patients
    patients = data
    
    profiles = []
    for p in patients:
        demo = p.get('demographic', {})
        diag = p.get('diagnoses', [{}])[0]
        
        # Extract features available in TCGA
        age = demo.get('age_at_index', 50)
        gender_m = 1 if demo.get('gender', '').lower() == 'male' else 0
        
        # Many metabolic/genetic features are not in the raw clinical JSON,
        # so we will simulate them to evaluate the model's response.
        profile = {
            "id": p.get("submitter_id", "UNKNOWN"),
            "age": int(age) if age is not None else 50,
            "hba1c": random.uniform(5.5, 10.0), 
            "bmi": random.uniform(18.0, 35.0),
            "gene_BRCA1": 1 if random.random() < 0.3 else 0, # ~30% BRCA1 mutation rate
            "gene_TP53": 1 if random.random() < 0.4 else 0,  # ~40% TP53 mutation rate
            "crp_level": random.uniform(1.0, 10.0),
            "insulin_resistance": random.uniform(1.0, 6.0),
            "hrv_baseline": random.uniform(40, 80),
            "spo2_mean": random.uniform(94, 99),
            "gender_M": gender_m
        }
        profiles.append(profile)
        
    print(f"Predicting response for {len(profiles)} patients using Cox PH model...")
    predictions = engine.batch_predict(profiles)
    
    high = sum(1 for p in predictions if p["classification"] == "HIGH_RESPONDER")
    moderate = sum(1 for p in predictions if p["classification"] == "MODERATE_RESPONDER")
    non = sum(1 for p in predictions if p["classification"] == "NON_RESPONDER")
    
    print("\n========================================================")
    print("      TCGA-BRCA COHORT RESPONSE PREDICTION RESULTS      ")
    print("========================================================")
    print(f"Total Patients Evaluated: {len(profiles)}")
    print(f"Concordance Index of Model: {engine.model.concordance_index_:.4f}")
    print(f"--------------------------------------------------------")
    print(f"High Responders:     {high} ({(high/len(profiles))*100:.1f}%)")
    print(f"Moderate Responders: {moderate} ({(moderate/len(profiles))*100:.1f}%)")
    print(f"Non Responders:      {non} ({(non/len(profiles))*100:.1f}%)")
    print("========================================================\n")
    
    print("Sample Output (High Responder):")
    for p in predictions:
        if p["classification"] == "HIGH_RESPONDER":
            print(json.dumps(p, indent=2))
            break

if __name__ == "__main__":
    evaluate_tcga()
