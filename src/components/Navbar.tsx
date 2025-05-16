import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Heart } from 'lucide-react';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-6 py-3">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <Heart className="h-8 w-8 text-blue-600" />
            <span className="text-xl font-bold text-blue-700">HealthPredict</span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex space-x-8">
            <Link 
              to="/" 
              className={`font-medium transition-colors ${isActive('/') ? 'text-blue-600' : 'text-gray-600 hover:text-blue-500'}`}
            >
              Home
            </Link>
            <Link 
              to="/disease-prediction" 
              className={`font-medium transition-colors ${isActive('/disease-prediction') ? 'text-blue-600' : 'text-gray-600 hover:text-blue-500'}`}
            >
              Disease Prediction
            </Link>
            <Link 
              to="/medication-tracker" 
              className={`font-medium transition-colors ${isActive('/medication-tracker') ? 'text-blue-600' : 'text-gray-600 hover:text-blue-500'}`}
            >
              Medication Tracker
            </Link>
            <Link 
              to="/contact" 
              className={`font-medium transition-colors ${isActive('/contact') ? 'text-blue-600' : 'text-gray-600 hover:text-blue-500'}`}
            >
              Contact Us
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button 
              onClick={toggleMenu}
              className="text-gray-600 hover:text-blue-600 focus:outline-none"
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden pt-4 pb-2 space-y-4">
            <Link 
              to="/" 
              className={`block py-2 px-4 rounded-md transition-colors ${isActive('/') ? 'bg-blue-50 text-blue-600' : 'text-gray-600 hover:bg-gray-50'}`}
              onClick={toggleMenu}
            >
              Home
            </Link>
            <Link 
              to="/disease-prediction" 
              className={`block py-2 px-4 rounded-md transition-colors ${isActive('/disease-prediction') ? 'bg-blue-50 text-blue-600' : 'text-gray-600 hover:bg-gray-50'}`}
              onClick={toggleMenu}
            >
              Disease Prediction
            </Link>
            <Link 
              to="/medication-tracker" 
              className={`block py-2 px-4 rounded-md transition-colors ${isActive('/medication-tracker') ? 'bg-blue-50 text-blue-600' : 'text-gray-600 hover:bg-gray-50'}`}
              onClick={toggleMenu}
            >
              Medication Tracker
            </Link>
            <Link 
              to="/contact" 
              className={`block py-2 px-4 rounded-md transition-colors ${isActive('/contact') ? 'bg-blue-50 text-blue-600' : 'text-gray-600 hover:bg-gray-50'}`}
              onClick={toggleMenu}
            >
              Contact Us
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;