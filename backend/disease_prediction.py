"""
Disease Prediction Model

This Python script implements a machine learning model for predicting diseases
based on medication patterns. In a production environment, this would be deployed
as an API endpoint using a framework like Flask or FastAPI.
"""

import numpy as np
from sklearn.ensemble import RandomForestClassifier
from sklearn.preprocessing import MultiLabelBinarizer
import pandas as pd
from datetime import datetime
import json

# Enhanced sample data with more detailed medication history
sample_data = [
    {
        "patient_id": "P001",
        "medications": [
            {
                "name": "Lisinopril",
                "dosage": "10mg",
                "duration_days": 180,
                "adherence_rate": 0.95
            },
            {
                "name": "Metformin",
                "dosage": "500mg",
                "duration_days": 365,
                "adherence_rate": 0.88
            }
        ],
        "diseases": ["Hypertension", "Type 2 Diabetes"]
    },
    {
        "patient_id": "P002",
        "medications": [
            {
                "name": "Atorvastatin",
                "dosage": "20mg",
                "duration_days": 240,
                "adherence_rate": 0.92
            }
        ],
        "diseases": ["Hypercholesterolemia"]
    }
]

# Enhanced medication-disease mapping with confidence scores
medication_disease_mapping = {
    "Lisinopril": {
        "diseases": ["Hypertension", "Heart Failure"],
        "confidence_scores": [0.9, 0.7],
        "min_duration_days": 30,
        "typical_dosages": ["5mg", "10mg", "20mg"]
    },
    "Metformin": {
        "diseases": ["Type 2 Diabetes", "Prediabetes"],
        "confidence_scores": [0.85, 0.65],
        "min_duration_days": 60,
        "typical_dosages": ["500mg", "1000mg"]
    },
    "Atorvastatin": {
        "diseases": ["Hypercholesterolemia", "Cardiovascular Disease"],
        "confidence_scores": [0.88, 0.75],
        "min_duration_days": 90,
        "typical_dosages": ["10mg", "20mg", "40mg"]
    }
}

class DiseasePredictionModel:
    def __init__(self):
        self.medication_encoder = MultiLabelBinarizer()
        self.disease_encoder = MultiLabelBinarizer()
        self.model = RandomForestClassifier(n_estimators=100, random_state=42)
        self.fitted = False
    
    def preprocess_medication_history(self, medications):
        """
        Preprocess medication history with enhanced features
        """
        features = []
        for med in medications:
            med_info = medication_disease_mapping.get(med['name'], {})
            features.extend([
                med.get('duration_days', 0) / 365.0,  # Normalize to years
                med.get('adherence_rate', 1.0),
                len(med_info.get('diseases', [])),
                max(med_info.get('confidence_scores', [0]))
            ])
        return np.array(features)

    def fit(self, patient_data):
        """
        Train the model with enhanced feature engineering
        """
        X = []
        y = []
        
        for record in patient_data:
            # Extract medication names for encoding
            med_names = [med['name'] for med in record['medications']]
            
            # Create feature vector
            med_features = self.preprocess_medication_history(record['medications'])
            
            X.append(med_features)
            y.append(record['diseases'])
        
        # Convert to numpy arrays
        X = np.array(X)
        self.disease_encoder.fit(y)
        y = self.disease_encoder.transform(y)
        
        # Train model
        self.model.fit(X, y)
        self.fitted = True
        
        print(f"Model trained on {len(X)} records")
        print(f"Disease classes: {self.disease_encoder.classes_}")

    def predict(self, medications):
        """
        Predict diseases with confidence scores and detailed analysis
        """
        if not self.fitted:
            raise ValueError("Model not fitted yet. Call fit() first.")
        
        # Preprocess input medications
        med_features = self.preprocess_medication_history(medications)
        
        # Reshape for single prediction
        if med_features.ndim == 1:
            med_features = med_features.reshape(1, -1)
        
        # Get prediction probabilities
        disease_probabilities = self.model.predict_proba(med_features)[0]
        
        # Process results
        results = []
        for i, disease in enumerate(self.disease_encoder.classes_):
            prob = disease_probabilities[i] * 100
            if prob > 15:  # Threshold for reporting
                result = {
                    "disease": disease,
                    "probability": min(round(prob), 95),
                    "contributing_factors": self._analyze_contributing_factors(medications, disease),
                    "confidence_level": self._calculate_confidence_level(medications, disease)
                }
                results.append(result)
        
        # Apply domain knowledge
        results = self._apply_domain_knowledge(medications, results)
        results.sort(key=lambda x: x["probability"], reverse=True)
        
        return results

    def _analyze_contributing_factors(self, medications, disease):
        """
        Analyze factors contributing to disease prediction
        """
        factors = []
        for med in medications:
            med_info = medication_disease_mapping.get(med['name'], {})
            if disease in med_info.get('diseases', []):
                factor = {
                    "medication": med['name'],
                    "duration": med.get('duration_days', 0),
                    "adherence": med.get('adherence_rate', 1.0),
                    "typical_duration": med_info.get('min_duration_days', 0)
                }
                factors.append(factor)
        return factors

    def _calculate_confidence_level(self, medications, disease):
        """
        Calculate confidence level for prediction
        """
        confidence = 0
        relevant_meds = 0
        
        for med in medications:
            med_info = medication_disease_mapping.get(med['name'], {})
            if disease in med_info.get('diseases', []):
                relevant_meds += 1
                idx = med_info['diseases'].index(disease)
                confidence += med_info['confidence_scores'][idx]
        
        if relevant_meds > 0:
            return min(round((confidence / relevant_meds) * 100), 95)
        return 0

    def _apply_domain_knowledge(self, medications, results):
        """
        Apply medical domain knowledge to refine predictions
        """
        for med in medications:
            med_name = med['name']
            if med_name in medication_disease_mapping:
                med_info = medication_disease_mapping[med_name]
                
                for disease, conf_score in zip(med_info['diseases'], med_info['confidence_scores']):
                    # Find if disease already in results
                    existing = next((r for r in results if r['disease'] == disease), None)
                    
                    if existing:
                        # Adjust probability based on duration and adherence
                        duration_factor = min(med['duration_days'] / med_info['min_duration_days'], 1.5)
                        adherence_factor = med.get('adherence_rate', 1.0)
                        
                        adjusted_prob = existing['probability'] * duration_factor * adherence_factor
                        existing['probability'] = min(round(adjusted_prob), 95)
                    else:
                        # Add new disease prediction
                        base_prob = conf_score * 100
                        results.append({
                            "disease": disease,
                            "probability": min(round(base_prob), 95),
                            "contributing_factors": self._analyze_contributing_factors([med], disease),
                            "confidence_level": self._calculate_confidence_level([med], disease)
                        })
        
        return results

def predict_diseases_api(request_data):
    """
    API endpoint function for disease prediction
    """
    medications = request_data.get('medications', [])
    
    if not medications:
        return {
            "error": "No medications provided",
            "predictions": []
        }
    
    try:
        # Initialize and train model
        model = DiseasePredictionModel()
        model.fit(sample_data)
        
        # Make prediction
        predictions = model.predict(medications)
        
        return {
            "medications_analyzed": medications,
            "predictions": predictions,
            "analysis_timestamp": datetime.now().isoformat(),
            "disclaimer": "This prediction is based on medication patterns and is not a medical diagnosis. Please consult with healthcare professionals."
        }
    except Exception as e:
        return {
            "error": str(e),
            "predictions": []
        }

if __name__ == "__main__":
    # Test prediction
    test_medications = [
        {
            "name": "Lisinopril",
            "dosage": "10mg",
            "duration_days": 180,
            "adherence_rate": 0.95
        }
    ]
    results = predict_diseases_api({"medications": test_medications})
    print(json.dumps(results, indent=2))