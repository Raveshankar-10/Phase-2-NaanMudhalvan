"""
Flask API for Disease Prediction Model

This script sets up a Flask API to serve the disease prediction model.
"""

from flask import Flask, request, jsonify
from flask_cors import CORS
import os
from disease_prediction import predict_diseases_api
from datetime import datetime, timedelta

# Initialize Flask app
app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

@app.route('/api/health', methods=['GET'])
def health_check():
    """
    Simple health check endpoint
    """
    return jsonify({"status": "ok", "message": "Service is running"})

@app.route('/api/predict', methods=['POST'])
def predict():
    """
    Enhanced endpoint for disease prediction based on detailed medication history
    """
    if not request.is_json:
        return jsonify({"error": "Request must be JSON"}), 400
    
    data = request.json
    
    if 'medications' not in data:
        return jsonify({"error": "No medications provided in request"}), 400
    
    medications = data['medications']
    
    if not isinstance(medications, list):
        return jsonify({"error": "Medications must be provided as a list"}), 400
    
    # Validate medication entries
    for med in medications:
        if not isinstance(med, dict):
            return jsonify({"error": "Each medication must be an object with name, dosage, and duration"}), 400
        if 'name' not in med:
            return jsonify({"error": "Each medication must have a name"}), 400
    
    # Call prediction function
    results = predict_diseases_api({"medications": medications})
    
    return jsonify(results)

@app.route('/api/medication_info/<medication>', methods=['GET'])
def medication_info(medication):
    """
    Enhanced endpoint to get detailed information about a specific medication
    """
    medication_info = {
        "lisinopril": {
            "name": "Lisinopril",
            "drug_class": "ACE Inhibitor",
            "common_uses": ["Hypertension", "Heart Failure", "Post-Heart Attack"],
            "side_effects": ["Dry cough", "Dizziness", "Headache", "Fatigue"],
            "precautions": ["Monitor kidney function", "Avoid potassium supplements"],
            "typical_dosages": ["5mg", "10mg", "20mg"],
            "monitoring_requirements": ["Blood pressure", "Kidney function", "Potassium levels"],
            "interactions": ["NSAIDs", "Potassium supplements", "Lithium"]
        },
        "metformin": {
            "name": "Metformin",
            "drug_class": "Biguanide",
            "common_uses": ["Type 2 Diabetes", "Insulin Resistance", "PCOS"],
            "side_effects": ["Nausea", "Diarrhea", "Abdominal discomfort", "Vitamin B12 deficiency"],
            "precautions": ["Monitor kidney function", "Temporarily stop before procedures with contrast dye"],
            "typical_dosages": ["500mg", "850mg", "1000mg"],
            "monitoring_requirements": ["Blood glucose", "Kidney function", "Vitamin B12 levels"],
            "interactions": ["Alcohol", "Contrast dyes", "Certain diabetes medications"]
        },
        "atorvastatin": {
            "name": "Atorvastatin",
            "drug_class": "Statin",
            "common_uses": ["High Cholesterol", "Cardiovascular Disease Prevention"],
            "side_effects": ["Muscle pain", "Liver enzyme elevation", "Digestive problems"],
            "precautions": ["Monitor liver function", "Report unexplained muscle pain"],
            "typical_dosages": ["10mg", "20mg", "40mg", "80mg"],
            "monitoring_requirements": ["Liver function", "Cholesterol levels", "Muscle symptoms"],
            "interactions": ["Grapefruit juice", "Certain antibiotics", "Other cholesterol medications"]
        }
    }
    
    med_info = medication_info.get(medication.lower(), {"error": "Medication information not found"})
    return jsonify(med_info)

@app.route('/api/analyze_history', methods=['POST'])
def analyze_history():
    """
    Enhanced endpoint to analyze detailed medication history
    """
    if not request.is_json:
        return jsonify({"error": "Request must be JSON"}), 400
    
    data = request.json
    
    if 'history' not in data:
        return jsonify({"error": "No medication history provided in request"}), 400
    
    history = data['history']
    
    # Calculate adherence metrics
    total_adherence = 0
    adherence_count = 0
    long_term_meds = []
    potential_interactions = []
    
    for med in history:
        if 'adherence_rate' in med:
            total_adherence += med['adherence_rate']
            adherence_count += 1
        
        if med.get('duration_days', 0) > 90:
            long_term_meds.append(med)
        
        # Check for potential interactions
        for other_med in history:
            if med != other_med:
                if _check_interaction(med['name'], other_med['name']):
                    potential_interactions.append({
                        "medications": [med['name'], other_med['name']],
                        "severity": "moderate",
                        "recommendation": "Monitor closely"
                    })
    
    average_adherence = (total_adherence / adherence_count * 100) if adherence_count > 0 else 0
    
    # Generate recommendations
    recommendations = _generate_recommendations(history, average_adherence, potential_interactions)
    
    analysis = {
        "analysis_date": datetime.now().isoformat(),
        "medication_metrics": {
            "total_medications": len(history),
            "long_term_medications": len(long_term_meds),
            "average_adherence": round(average_adherence, 1),
            "adherence_status": _get_adherence_status(average_adherence)
        },
        "long_term_medications": [
            {
                "name": med['name'],
                "duration_days": med['duration_days'],
                "adherence_rate": med.get('adherence_rate', None)
            } for med in long_term_meds
        ],
        "potential_interactions": potential_interactions,
        "recommendations": recommendations
    }
    
    return jsonify(analysis)

def _check_interaction(med1, med2):
    """
    Check for known interactions between medications
    """
    # Simplified interaction checking logic
    high_risk_combinations = [
        {"meds": ["Lisinopril", "Spironolactone"], "risk": "high"},
        {"meds": ["Metformin", "Atorvastatin"], "risk": "moderate"},
        {"meds": ["Warfarin", "Aspirin"], "risk": "high"}
    ]
    
    for combo in high_risk_combinations:
        if med1 in combo["meds"] and med2 in combo["meds"]:
            return True
    
    return False

def _get_adherence_status(adherence_rate):
    """
    Determine adherence status based on rate
    """
    if adherence_rate >= 90:
        return "Excellent"
    elif adherence_rate >= 80:
        return "Good"
    elif adherence_rate >= 70:
        return "Fair"
    else:
        return "Needs Improvement"

def _generate_recommendations(history, adherence_rate, interactions):
    """
    Generate personalized recommendations based on medication history
    """
    recommendations = []
    
    # Adherence recommendations
    if adherence_rate < 80:
        recommendations.append({
            "category": "Adherence",
            "recommendation": "Consider using medication reminders or pill organizers to improve adherence",
            "priority": "High"
        })
    
    # Interaction recommendations
    if interactions:
        recommendations.append({
            "category": "Interactions",
            "recommendation": "Discuss potential medication interactions with your healthcare provider",
            "priority": "High"
        })
    
    # Monitoring recommendations
    for med in history:
        if med['name'].lower() == 'lisinopril':
            recommendations.append({
                "category": "Monitoring",
                "recommendation": "Schedule regular blood pressure monitoring",
                "priority": "Medium"
            })
        elif med['name'].lower() == 'metformin':
            recommendations.append({
                "category": "Monitoring",
                "recommendation": "Schedule regular blood glucose monitoring",
                "priority": "Medium"
            })
    
    return recommendations

if __name__ == '__main__':
    # Get port from environment variable or use default
    port = int(os.environ.get('PORT', 5000))
    
    # Run app
    app.run(host='0.0.0.0', port=port, debug=True)