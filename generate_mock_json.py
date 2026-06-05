import json
import random
import uuid

patients = []
diagnoses = ['Infiltrating duct carcinoma', 'Lobular carcinoma', 'Metastatic breast cancer', 'Triple-negative breast cancer']

for i in range(150):
    patients.append({
        'id': f'TCGA-BRCA-{str(uuid.uuid4())[:6].upper()}',
        'name': f'Mock Patient {i+1}',
        'age': random.randint(30, 85),
        'gender': 'F',
        'diagnosis': random.choice(diagnoses),
        'gene_BRCA1': 1 if random.random() < 0.35 else 0,
        'gene_TP53': 1 if random.random() < 0.45 else 0,
        'hba1c': round(random.uniform(5.0, 9.5), 2),
        'bmi': round(random.uniform(18.5, 38.0), 2),
        'cardiac_history': random.random() < 0.15,
        'insulin_dose': random.choice([0, 0, 0, 10, 20, 30]),
        'crp_level': round(random.uniform(1.0, 8.0), 2),
        'insulin_resistance': round(random.uniform(1.0, 5.0), 2),
        'hrv_baseline': round(random.uniform(45, 80), 2),
        'spo2_mean': round(random.uniform(93, 99), 2),
        'location': 'Generated Mock Data'
    })

with open('c:/Users/Ayush/OneDrive/Desktop/Clinical_Trial/valid_bulk_patients.json', 'w') as f:
    json.dump(patients, f, indent=2)

print('Generated 150 mock patients successfully.')
