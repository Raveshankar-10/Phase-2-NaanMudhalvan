/**
 * This file simulates the API calls that would be made to a Python backend
 * In a real application, this would interface with a Flask/FastAPI backend running the ML model
 */

// Sample mock data - this would come from the Python ML model in a real app
const commonDiseasesData = {
  "Lisinopril": ["Hypertension", "Heart Failure", "Chronic Kidney Disease"],
  "Metformin": ["Type 2 Diabetes", "Insulin Resistance", "Prediabetes"],
  "Atorvastatin": ["Hypercholesterolemia", "Coronary Artery Disease", "Stroke Prevention"],
  "Levothyroxine": ["Hypothyroidism", "Thyroid Cancer", "Goiter"],
  "Albuterol": ["Asthma", "COPD", "Bronchitis"],
  "Omeprazole": ["GERD", "Peptic Ulcer Disease", "Barrett's Esophagus"],
  "Amlodipine": ["Hypertension", "Angina", "Raynaud's Phenomenon"],
  "Gabapentin": ["Neuropathic Pain", "Epilepsy", "Postherpetic Neuralgia"],
  "Losartan": ["Hypertension", "Diabetic Nephropathy", "Heart Failure"],
  "Sertraline": ["Depression", "Anxiety Disorders", "PTSD"]
};

// Simulated machine learning model for disease prediction
export const predictDisease = async (medications: string[]) => {
  // This would be a real API call in a production app
  return new Promise((resolve) => {
    // Simulate network delay
    setTimeout(() => {
      const results: { disease: string; probability: number; }[] = [];
      const processedDiseases = new Set<string>();
      
      // Process each medication
      medications.forEach(medication => {
        // Normalize medication name for lookup
        const normalizedMed = Object.keys(commonDiseasesData).find(
          med => med.toLowerCase().includes(medication.toLowerCase()) || 
                medication.toLowerCase().includes(med.toLowerCase())
        );
        
        if (normalizedMed) {
          // Get associated diseases
          const diseases = commonDiseasesData[normalizedMed as keyof typeof commonDiseasesData];
          
          // Add each disease with a probability
          diseases.forEach((disease, index) => {
            if (!processedDiseases.has(disease)) {
              processedDiseases.add(disease);
              // First disease has higher probability, others diminish
              const baseProbability = 85 - (index * 15);
              // Add some randomness
              const probability = Math.min(Math.max(
                baseProbability + (Math.random() * 10 - 5), 
                30), 95);
                
              results.push({
                disease,
                probability: Math.round(probability),
              });
            }
          });
        }
      });
      
      // Sort by probability
      results.sort((a, b) => b.probability - a.probability);
      
      resolve(results);
    }, 1500); // Simulate API delay
  });
};

// This would be implemented in Python in a real application
export const getMedicationInsights = async (medication: string) => {
  // Simulate API call
  return new Promise(resolve => {
    setTimeout(() => {
      // Sample response data
      resolve({
        medication,
        commonUsage: "Treatment of high blood pressure and heart failure",
        sideEffects: ["Dizziness", "Headache", "Dry cough", "Fatigue"],
        interactions: ["NSAIDs", "Potassium supplements", "Lithium"],
        precautions: "Monitor kidney function and blood pressure regularly"
      });
    }, 800);
  });
};

// Python backend would likely offer this endpoint
export const analyzeMedicationHistory = async (medicationHistory: any[]) => {
  // Simulate API call
  return new Promise(resolve => {
    setTimeout(() => {
      // Sample analysis that would come from Python
      resolve({
        adherenceRate: Math.round(75 + Math.random() * 20), // percentage
        potentialInteractions: medicationHistory.length > 3,
        recommendedMonitoring: ["Blood pressure", "Blood glucose", "Cholesterol levels"],
        followUpNeeded: medicationHistory.some(med => 
          med.name.toLowerCase().includes('metformin') || 
          med.name.toLowerCase().includes('insulin'))
      });
    }, 1200);
  });
};