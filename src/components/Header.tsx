import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Download, LogIn, User, LogOut } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Header: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 glass-morphism">
      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo Section */}
          <div className="flex items-center space-x-4">
            <div className="flex space-x-2">
              <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center">
                <span className="text-white font-bold">P</span>
              </div>
              <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-pink-500 rounded-full flex items-center justify-center">
                <span className="text-white font-bold">S</span>
              </div>
              <div className="w-10 h-10 bg-gradient-to-r from-pink-500 to-purple-500 rounded-full flex items-center justify-center">
                <span className="text-white font-bold">G</span>
              </div>
            </div>
            <Link to="/" className="orbitron text-2xl font-bold cosmic-gradient">
              Production-50
            </Link>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center space-x-4">
            {/* Brochure Download */}
            <button className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg hover:from-purple-700 hover:to-blue-700 transition-all duration-300 neon-glow">
              <Download size={18} />
              <span className="hidden sm:inline">Brochure</span>
            </button>

            {/* Auth Section */}
            {user ? (
              <div className="flex items-center space-x-4">
                <Link 
                  to="/dashboard"
                  className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-green-600 to-teal-600 rounded-lg hover:from-green-700 hover:to-teal-700 transition-all duration-300"
                >
                  <User size={18} />
                  <span className="hidden sm:inline">{user.name}</span>
                </Link>
                <button 
                  onClick={handleLogout}
                  className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-red-600 to-pink-600 rounded-lg hover:from-red-700 hover:to-pink-700 transition-all duration-300"
                >
                  <LogOut size={18} />
                  <span className="hidden sm:inline">Logout</span>
                </button>
              </div>
            ) : (
              <Link 
                to="/login"
                className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all duration-300 neon-glow"
              >
                <LogIn size={18} />
                <span className="hidden sm:inline">Login</span>
              </Link>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;