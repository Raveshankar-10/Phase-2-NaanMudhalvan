import React from 'react';
import { Link } from 'react-router-dom';
import { Activity, Pill, FileSearch, Phone } from 'lucide-react';

const Home = () => {
  return (
    <div className="container mx-auto px-4 py-12">
      {/* Hero Section */}
      <section className="text-center mb-16">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold text-blue-700 mb-6 leading-tight">
            Transforming Healthcare with AI-Powered Disease Prediction
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Advanced analytics to identify potential health risks based on your medication history
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link 
              to="/disease-prediction" 
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition duration-300 transform hover:scale-105"
            >
              Try Disease Prediction
            </Link>
            <Link 
              to="/medication-tracker" 
              className="bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-6 rounded-lg transition duration-300 transform hover:scale-105"
            >
              Track Medications
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-12">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-12">
          Key Features
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300">
            <div className="flex justify-center mb-4">
              <div className="p-3 bg-blue-100 rounded-full">
                <FileSearch size={28} className="text-blue-600" />
              </div>
            </div>
            <h3 className="text-xl font-semibold text-gray-800 text-center mb-2">Disease Prediction</h3>
            <p className="text-gray-600 text-center">
              Advanced AI algorithms analyze medication patterns to identify potential health risks.
            </p>
          </div>
          
          <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300">
            <div className="flex justify-center mb-4">
              <div className="p-3 bg-green-100 rounded-full">
                <Pill size={28} className="text-green-600" />
              </div>
            </div>
            <h3 className="text-xl font-semibold text-gray-800 text-center mb-2">Medication Tracking</h3>
            <p className="text-gray-600 text-center">
              Keep track of your medication history and receive personalized insights.
            </p>
          </div>
          
          <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300">
            <div className="flex justify-center mb-4">
              <div className="p-3 bg-purple-100 rounded-full">
                <Activity size={28} className="text-purple-600" />
              </div>
            </div>
            <h3 className="text-xl font-semibold text-gray-800 text-center mb-2">Health Insights</h3>
            <p className="text-gray-600 text-center">
              Get personalized health recommendations based on your medication profile.
            </p>
          </div>
          
          <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300">
            <div className="flex justify-center mb-4">
              <div className="p-3 bg-yellow-100 rounded-full">
                <Phone size={28} className="text-yellow-600" />
              </div>
            </div>
            <h3 className="text-xl font-semibold text-gray-800 text-center mb-2">Expert Support</h3>
            <p className="text-gray-600 text-center">
              Contact healthcare professionals for guidance and support.
            </p>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-12 bg-gray-100 rounded-2xl my-16 p-8">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-12">
          How It Works
        </h2>
        <div className="max-w-4xl mx-auto">
          <div className="flex flex-col md:flex-row gap-8 items-center mb-12">
            <div className="bg-blue-500 text-white rounded-full w-12 h-12 flex items-center justify-center font-bold text-xl flex-shrink-0">1</div>
            <div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">Input Your Medication History</h3>
              <p className="text-gray-600">
                Enter the medications you've been taking, along with dosage and duration information.
              </p>
            </div>
          </div>
          
          <div className="flex flex-col md:flex-row gap-8 items-center mb-12">
            <div className="bg-blue-500 text-white rounded-full w-12 h-12 flex items-center justify-center font-bold text-xl flex-shrink-0">2</div>
            <div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">AI Analysis</h3>
              <p className="text-gray-600">
                Our advanced algorithm analyzes your medication patterns and identifies potential health risks.
              </p>
            </div>
          </div>
          
          <div className="flex flex-col md:flex-row gap-8 items-center">
            <div className="bg-blue-500 text-white rounded-full w-12 h-12 flex items-center justify-center font-bold text-xl flex-shrink-0">3</div>
            <div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">Receive Personalized Insights</h3>
              <p className="text-gray-600">
                Get detailed information about potential diseases and recommended next steps.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="text-center py-16 bg-gradient-to-r from-blue-600 to-blue-800 rounded-2xl text-white p-8">
        <h2 className="text-3xl font-bold mb-6">Ready to Transform Your Healthcare Experience?</h2>
        <p className="text-xl mb-8 max-w-2xl mx-auto">
          Start tracking your medications and get AI-powered insights into your health.
        </p>
        <Link 
          to="/disease-prediction" 
          className="bg-white text-blue-700 hover:bg-blue-50 font-semibold py-3 px-8 rounded-lg transition duration-300 inline-block"
        >
          Get Started Now
        </Link>
      </section>
    </div>
  );
};

export default Home;