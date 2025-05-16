import React, { useState } from 'react';
import { FileSearch, ArrowRight, Shield, AlertCircle } from 'lucide-react';

// Sample data for demonstration
const sampleDiseases = [
  {
    name: 'Hypertension (High Blood Pressure)',
    medications: ['Lisinopril', 'Amlodipine', 'Losartan', 'Hydrochlorothiazide'],
    symptoms: ['Headaches', 'Shortness of breath', 'Nosebleeds', 'Visual changes'],
    description: 'A common condition where the long-term force of the blood against your artery walls is high enough that it may eventually cause health problems.'
  },
  {
    name: 'Type 2 Diabetes',
    medications: ['Metformin', 'Glipizide', 'Januvia', 'Jardiance'],
    symptoms: ['Increased thirst', 'Frequent urination', 'Increased hunger', 'Weight loss', 'Fatigue', 'Blurred vision'],
    description: 'A chronic condition that affects the way your body metabolizes sugar (glucose), causing higher than normal blood sugar levels.'
  },
  {
    name: 'Hypercholesterolemia',
    medications: ['Atorvastatin', 'Rosuvastatin', 'Simvastatin', 'Ezetimibe'],
    symptoms: ['Usually asymptomatic', 'Chest pain (in severe cases)', 'Xanthomas (in genetic cases)'],
    description: 'A condition characterized by high levels of cholesterol in the blood, increasing the risk of heart disease and stroke.'
  },
  {
    name: 'Asthma',
    medications: ['Albuterol', 'Fluticasone', 'Montelukast', 'Budesonide'],
    symptoms: ['Shortness of breath', 'Chest tightness or pain', 'Wheezing', 'Coughing'],
    description: 'A condition in which your airways narrow and swell and may produce extra mucus, making breathing difficult.'
  },
  {
    name: 'Hypothyroidism',
    medications: ['Levothyroxine'],
    symptoms: ['Fatigue', 'Increased sensitivity to cold', 'Weight gain', 'Dry skin', 'Depression'],
    description: 'A condition in which the thyroid gland doesn\'t produce enough thyroid hormone, affecting metabolism and other bodily functions.'
  }
];

const DiseasePrediction = () => {
  const [medicationInput, setMedicationInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [predictionResults, setPredictionResults] = useState<any[]>([]);
  const [showPredictionInfo, setShowPredictionInfo] = useState(false);

  const handleMedicationChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setMedicationInput(e.target.value);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Parse medications from input
    const medications = medicationInput
      .split(',')
      .map(med => med.trim())
      .filter(med => med.length > 0);
    
    // Simulate API call to Python backend
    setTimeout(() => {
      // In a real application, this would call a Python backend for prediction
      const results = predictDiseasesBasedOnMedications(medications);
      setPredictionResults(results);
      setIsLoading(false);
      setShowPredictionInfo(true);
    }, 2000);
  };

  // This function simulates what would be done by the Python backend
  const predictDiseasesBasedOnMedications = (medications: string[]) => {
    const results = [];
    
    for (const disease of sampleDiseases) {
      const matchingMeds = disease.medications.filter(med => 
        medications.some(userMed => 
          userMed.toLowerCase().includes(med.toLowerCase()) || 
          med.toLowerCase().includes(userMed.toLowerCase())
        )
      );
      
      if (matchingMeds.length > 0) {
        const probability = (matchingMeds.length / disease.medications.length) * 100;
        
        results.push({
          disease: disease.name,
          probability: Math.min(Math.round(probability), 95), // Cap at 95% to acknowledge uncertainty
          matchingMedications: matchingMeds,
          description: disease.description,
          symptoms: disease.symptoms
        });
      }
    }
    
    // Sort by probability descending
    return results.sort((a, b) => b.probability - a.probability);
  };

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-bold text-blue-700 mb-4">Disease Prediction</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Our AI algorithm analyzes your medication patterns to identify potential health conditions.
          </p>
        </div>

        {/* Prediction Input Form */}
        <div className="bg-white rounded-xl shadow-md p-8 mb-12">
          <div className="flex items-start mb-6">
            <FileSearch className="h-8 w-8 text-blue-600 mr-4 flex-shrink-0" />
            <div>
              <h2 className="text-2xl font-bold text-gray-800 mb-2">Enter Your Medication History</h2>
              <p className="text-gray-600">
                List all medications you are currently taking or have taken for an extended period. Separate each medication with a comma.
              </p>
            </div>
          </div>
          
          <form onSubmit={handleSubmit}>
            <div className="mb-6">
              <label htmlFor="medications" className="block text-gray-700 font-medium mb-2">Your Medications</label>
              <textarea
                id="medications"
                value={medicationInput}
                onChange={handleMedicationChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                rows={4}
                placeholder="e.g., Lisinopril, Metformin, Atorvastatin"
                required
              ></textarea>
              <p className="text-sm text-gray-500 mt-2">
                Example: "Lisinopril 10mg, Metformin 500mg, Atorvastatin 20mg"
              </p>
            </div>
            
            <button
              type="submit"
              disabled={isLoading || medicationInput.trim() === ''}
              className={`flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition duration-300 w-full sm:w-auto ${isLoading || medicationInput.trim() === '' ? 'opacity-70 cursor-not-allowed' : ''}`}
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span>Analyzing...</span>
                </>
              ) : (
                <>
                  <ArrowRight size={18} />
                  <span>Predict Diseases</span>
                </>
              )}
            </button>
          </form>
        </div>

        {/* Prediction Results */}
        {showPredictionInfo && (
          <div className="bg-white rounded-xl shadow-md p-8 mb-12">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Prediction Results</h2>
            
            {predictionResults.length === 0 ? (
              <div className="bg-green-50 border-l-4 border-green-500 p-4 rounded mb-6">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <Shield className="h-5 w-5 text-green-600" />
                  </div>
                  <div className="ml-3">
                    <p className="text-green-700">
                      Based on the medications you provided, our AI model did not detect any significant disease patterns. 
                      This could mean you're taking medications for prevention or for conditions not in our database.
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <>
                <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4 rounded mb-6">
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <AlertCircle className="h-5 w-5 text-yellow-600" />
                    </div>
                    <div className="ml-3">
                      <p className="text-yellow-700">
                        <strong>Disclaimer:</strong> These predictions are based solely on medication patterns and are not a medical diagnosis. 
                        Always consult with healthcare professionals for proper medical advice.
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-6">
                  {predictionResults.map((result, index) => (
                    <div key={index} className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow duration-300">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-xl font-semibold text-gray-800">{result.disease}</h3>
                        <div className="bg-blue-100 text-blue-800 text-sm font-medium px-3 py-1 rounded-full">
                          {result.probability}% probability
                        </div>
                      </div>
                      
                      <p className="text-gray-600 mb-4">{result.description}</p>
                      
                      <div className="mb-4">
                        <h4 className="font-medium text-gray-700 mb-2">Matching Medications:</h4>
                        <div className="flex flex-wrap gap-2">
                          {result.matchingMedications.map((med: string, idx: number) => (
                            <span key={idx} className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-sm">
                              {med}
                            </span>
                          ))}
                        </div>
                      </div>
                      
                      <div>
                        <h4 className="font-medium text-gray-700 mb-2">Common Symptoms:</h4>
                        <ul className="list-disc list-inside text-gray-600">
                          {result.symptoms.map((symptom: string, idx: number) => (
                            <li key={idx}>{symptom}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}
            
            <div className="mt-8 p-4 bg-gray-50 rounded-lg">
              <h3 className="font-bold text-gray-700 mb-2">Next Steps</h3>
              <p className="text-gray-600 mb-4">
                If these predictions raise concerns, we recommend:
              </p>
              <ul className="list-disc list-inside text-gray-600">
                <li>Consulting with your healthcare provider</li>
                <li>Discussing your medication regimen and potential side effects</li>
                <li>Considering additional diagnostic tests if recommended</li>
                <li>Tracking any symptoms in the "Medication Tracker" section of our app</li>
              </ul>
            </div>
          </div>
        )}

        {/* How It Works */}
        <div className="bg-white rounded-xl shadow-md p-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">How Our AI Prediction Works</h2>
          
          <div className="space-y-6">
            <div className="flex items-start">
              <div className="bg-blue-100 rounded-full w-8 h-8 flex items-center justify-center text-blue-600 font-bold mr-4 flex-shrink-0">1</div>
              <div>
                <h3 className="font-semibold text-gray-800 mb-1">Data Analysis</h3>
                <p className="text-gray-600">
                  Our algorithm analyzes patterns in medication usage across thousands of patients with confirmed diagnoses.
                </p>
              </div>
            </div>
            
            <div className="flex items-start">
              <div className="bg-blue-100 rounded-full w-8 h-8 flex items-center justify-center text-blue-600 font-bold mr-4 flex-shrink-0">2</div>
              <div>
                <h3 className="font-semibold text-gray-800 mb-1">Pattern Recognition</h3>
                <p className="text-gray-600">
                  The AI identifies correlations between specific medications and health conditions, recognizing common treatment regimens.
                </p>
              </div>
            </div>
            
            <div className="flex items-start">
              <div className="bg-blue-100 rounded-full w-8 h-8 flex items-center justify-center text-blue-600 font-bold mr-4 flex-shrink-0">3</div>
              <div>
                <h3 className="font-semibold text-gray-800 mb-1">Probability Calculation</h3>
                <p className="text-gray-600">
                  Based on your specific medication profile, the system calculates the likelihood of various health conditions.
                </p>
              </div>
            </div>
            
            <div className="flex items-start">
              <div className="bg-blue-100 rounded-full w-8 h-8 flex items-center justify-center text-blue-600 font-bold mr-4 flex-shrink-0">4</div>
              <div>
                <h3 className="font-semibold text-gray-800 mb-1">Result Generation</h3>
                <p className="text-gray-600">
                  The system presents potential conditions, relevant information, and recommended next steps.
                </p>
              </div>
            </div>
          </div>
          
          <div className="mt-8 pt-6 border-t border-gray-200">
            <p className="text-gray-700 italic">
              <strong>Note:</strong> This tool is designed for educational purposes and to assist in health awareness, not to replace professional medical advice or diagnosis.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DiseasePrediction;