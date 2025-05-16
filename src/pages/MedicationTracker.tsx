import React, { useState, useEffect } from 'react';
import { Calendar, Plus, X, AlarmClock, ArrowRight } from 'lucide-react';

// Interface for medication data
interface Medication {
  id: string;
  name: string;
  dosage: string;
  frequency: string;
  startDate: string;
  endDate: string;
  notes: string;
}

const MedicationTracker = () => {
  const [medications, setMedications] = useState<Medication[]>([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newMedication, setNewMedication] = useState<Medication>({
    id: '',
    name: '',
    dosage: '',
    frequency: '',
    startDate: '',
    endDate: '',
    notes: ''
  });
  
  const [predictionResult, setPredictionResult] = useState<string | null>(null);

  // Load sample data on component mount
  useEffect(() => {
    const sampleMedications: Medication[] = [
      {
        id: '1',
        name: 'Lisinopril',
        dosage: '10mg',
        frequency: 'Once daily',
        startDate: '2023-01-15',
        endDate: '2023-07-15',
        notes: 'Take in the morning'
      },
      {
        id: '2',
        name: 'Metformin',
        dosage: '500mg',
        frequency: 'Twice daily',
        startDate: '2023-02-10',
        endDate: '2023-08-10',
        notes: 'Take with meals'
      },
      {
        id: '3',
        name: 'Atorvastatin',
        dosage: '20mg',
        frequency: 'Once daily',
        startDate: '2023-03-01',
        endDate: '2023-09-01',
        notes: 'Take at bedtime'
      }
    ];
    
    setMedications(sampleMedications);
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setNewMedication(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleAddMedication = (e: React.FormEvent) => {
    e.preventDefault();
    const newId = Date.now().toString();
    const medicationToAdd = { ...newMedication, id: newId };
    
    setMedications(prev => [...prev, medicationToAdd]);
    setShowAddForm(false);
    setNewMedication({
      id: '',
      name: '',
      dosage: '',
      frequency: '',
      startDate: '',
      endDate: '',
      notes: ''
    });
  };

  const handleRemoveMedication = (id: string) => {
    setMedications(prev => prev.filter(med => med.id !== id));
  };

  const handlePredictDisease = () => {
    // Simulate API call to Python backend
    setTimeout(() => {
      // This would normally call a backend API that runs the Python prediction model
      // For now, we'll simulate a prediction based on medications
      const hasLisinopril = medications.some(med => med.name.toLowerCase().includes('lisinopril'));
      const hasMetformin = medications.some(med => med.name.toLowerCase().includes('metformin'));
      const hasAtorvastatin = medications.some(med => med.name.toLowerCase().includes('atorvastatin'));
      
      if (hasLisinopril && hasMetformin) {
        setPredictionResult('Based on your medication history, our AI model suggests a potential risk of Type 2 Diabetes and Hypertension. We recommend consulting with your healthcare provider for further evaluation.');
      } else if (hasLisinopril) {
        setPredictionResult('Based on your medication history, our AI model suggests a potential risk of Hypertension. Regular blood pressure monitoring is recommended.');
      } else if (hasMetformin) {
        setPredictionResult('Based on your medication history, our AI model suggests a potential risk of Type 2 Diabetes. Regular blood glucose monitoring is recommended.');
      } else if (hasAtorvastatin) {
        setPredictionResult('Based on your medication history, our AI model suggests a potential risk of Hypercholesterolemia. Regular cholesterol level monitoring is recommended.');
      } else {
        setPredictionResult('No specific disease patterns detected based on your current medication history. Continue to follow your prescribed medication regimen.');
      }
    }, 1500);
  };

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-bold text-blue-700 mb-4">Medication Tracker</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Keep track of your medications and get AI-powered insights about potential health conditions.
          </p>
        </div>

        {/* Medication List */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800">Your Medications</h2>
            <button 
              onClick={() => setShowAddForm(true)}
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition duration-300"
            >
              <Plus size={18} />
              <span>Add Medication</span>
            </button>
          </div>

          {medications.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <Calendar className="h-12 w-12 mx-auto mb-4 text-gray-400" />
              <p>No medications added yet. Click "Add Medication" to get started.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Medication</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Dosage</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Frequency</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Duration</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Notes</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {medications.map((medication) => (
                    <tr key={medication.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{medication.name}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{medication.dosage}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{medication.frequency}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(medication.startDate).toLocaleDateString()} to {new Date(medication.endDate).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500">{medication.notes}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button 
                          onClick={() => handleRemoveMedication(medication.id)}
                          className="text-red-600 hover:text-red-900 transition duration-300"
                        >
                          <X size={18} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Prediction Section */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">AI Disease Prediction</h2>
          <p className="text-gray-600 mb-6">
            Our AI algorithm can analyze your medication patterns to identify potential health risks. Click the button below to get your prediction.
          </p>
          
          <button 
            onClick={handlePredictDisease}
            className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white font-medium py-3 px-6 rounded-lg transition duration-300 mb-6"
          >
            <ArrowRight size={18} />
            <span>Predict Potential Conditions</span>
          </button>
          
          {predictionResult && (
            <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded">
              <div className="flex">
                <div className="flex-shrink-0">
                  <AlarmClock className="h-5 w-5 text-blue-600" />
                </div>
                <div className="ml-3">
                  <h3 className="text-lg font-medium text-blue-800">Prediction Result</h3>
                  <p className="mt-2 text-blue-700">{predictionResult}</p>
                  <p className="mt-4 text-sm text-blue-500"><strong>Note:</strong> This is not a medical diagnosis. Always consult with healthcare professionals for proper medical advice.</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Add Medication Form Modal */}
        {showAddForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl p-6 max-w-md w-full max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold text-gray-800">Add New Medication</h3>
                <button onClick={() => setShowAddForm(false)} className="text-gray-500 hover:text-gray-700">
                  <X size={24} />
                </button>
              </div>
              
              <form onSubmit={handleAddMedication}>
                <div className="mb-4">
                  <label htmlFor="name" className="block text-gray-700 font-medium mb-2">Medication Name</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={newMedication.name}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="e.g., Lisinopril"
                    required
                  />
                </div>
                
                <div className="mb-4">
                  <label htmlFor="dosage" className="block text-gray-700 font-medium mb-2">Dosage</label>
                  <input
                    type="text"
                    id="dosage"
                    name="dosage"
                    value={newMedication.dosage}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="e.g., 10mg"
                    required
                  />
                </div>
                
                <div className="mb-4">
                  <label htmlFor="frequency" className="block text-gray-700 font-medium mb-2">Frequency</label>
                  <select
                    id="frequency"
                    name="frequency"
                    value={newMedication.frequency}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  >
                    <option value="">Select frequency</option>
                    <option value="Once daily">Once daily</option>
                    <option value="Twice daily">Twice daily</option>
                    <option value="Three times daily">Three times daily</option>
                    <option value="Four times daily">Four times daily</option>
                    <option value="Every other day">Every other day</option>
                    <option value="Weekly">Weekly</option>
                    <option value="As needed">As needed</option>
                  </select>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label htmlFor="startDate" className="block text-gray-700 font-medium mb-2">Start Date</label>
                    <input
                      type="date"
                      id="startDate"
                      name="startDate"
                      value={newMedication.startDate}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      required
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="endDate" className="block text-gray-700 font-medium mb-2">End Date</label>
                    <input
                      type="date"
                      id="endDate"
                      name="endDate"
                      value={newMedication.endDate}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      required
                    />
                  </div>
                </div>
                
                <div className="mb-4">
                  <label htmlFor="notes" className="block text-gray-700 font-medium mb-2">Notes</label>
                  <textarea
                    id="notes"
                    name="notes"
                    rows={3}
                    value={newMedication.notes}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Additional notes or instructions"
                  ></textarea>
                </div>
                
                <div className="flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setShowAddForm(false)}
                    className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 transition duration-300"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition duration-300"
                  >
                    Add Medication
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MedicationTracker;