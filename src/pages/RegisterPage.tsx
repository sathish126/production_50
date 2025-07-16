import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, Mail, Lock, Phone, Building, Calendar, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import Notification from '../components/Notification';

const RegisterPage: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    institution: '',
    participationType: 'Student',
    emergencyContact: '',
    emergencyPhone: '',
    emergencyRelation: '',
    accommodation: false,
    dietary: 'Vegetarian'
  });
  
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [notification, setNotification] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { register, isLoading } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Validation
    if (!formData.name || !formData.email || !formData.password || !formData.phone) {
      setNotification({ message: 'Please fill in all required fields', type: 'error' });
      setIsSubmitting(false);
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setNotification({ message: 'Passwords do not match', type: 'error' });
      setIsSubmitting(false);
      return;
    }

    if (formData.password.length < 8) {
      setNotification({ message: 'Password must be at least 8 characters long', type: 'error' });
      setIsSubmitting(false);
      return;
    }

    try {
      const success = await register(formData);
      if (success) {
        setNotification({ message: 'Registration successful! Redirecting to dashboard...', type: 'success' });
        setTimeout(() => navigate('/dashboard'), 1000);
      } else {
        setNotification({ message: 'Registration failed. Email might already exist.', type: 'error' });
      }
    } catch (error) {
      setNotification({ message: 'An error occurred. Please try again.', type: 'error' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen pt-20 py-12 px-4">
      {notification && (
        <Notification
          message={notification.message}
          type={notification.type}
          onClose={() => setNotification(null)}
        />
      )}
      
      <div className="max-w-2xl mx-auto">
        <div className="glass-morphism p-8 rounded-2xl">
          <div className="text-center mb-8">
            <h1 className="orbitron text-3xl font-bold cosmic-gradient mb-2">
              Join Production-50
            </h1>
            <p className="text-gray-300">
              Create your account for the ultimate tech experience
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Personal Information */}
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-2">
                  Full Name *
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    id="name"
                    name="name"
                    type="text"
                    value={formData.name}
                    onChange={handleChange}
                    className="form-input pl-10"
                    placeholder="Enter your full name"
                    required
                  />
                </div>
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
                  Email Address *
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="form-input pl-10"
                    placeholder="Enter your email"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Password Fields */}
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-2">
                  Password *
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    value={formData.password}
                    onChange={handleChange}
                    className="form-input pl-10 pr-10"
                    placeholder="Create a password"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-300"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-300 mb-2">
                  Confirm Password *
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type={showConfirmPassword ? 'text' : 'password'}
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className="form-input pl-10 pr-10"
                    placeholder="Confirm your password"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-300"
                  >
                    {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>
            </div>

            {/* Contact Information */}
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-300 mb-2">
                  Phone Number *
                </label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    id="phone"
                    name="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={handleChange}
                    className="form-input pl-10"
                    placeholder="Enter your phone number"
                    required
                  />
                </div>
              </div>

              <div>
                <label htmlFor="institution" className="block text-sm font-medium text-gray-300 mb-2">
                  Institution/Company
                </label>
                <div className="relative">
                  <Building className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    id="institution"
                    name="institution"
                    type="text"
                    value={formData.institution}
                    onChange={handleChange}
                    className="form-input pl-10"
                    placeholder="Enter your institution"
                  />
                </div>
              </div>
            </div>

            {/* Participation Type */}
            <div>
              <label htmlFor="participationType" className="block text-sm font-medium text-gray-300 mb-2">
                Participation Type
              </label>
              <select
                id="participationType"
                name="participationType"
                value={formData.participationType}
                onChange={handleChange}
                className="form-input"
              >
                <option value="Student">Student</option>
                <option value="Faculty">Faculty</option>
                <option value="Industry Professional">Industry Professional</option>
              </select>
            </div>

            {/* Emergency Contact */}
            <div className="grid md:grid-cols-3 gap-4">
              <div>
                <label htmlFor="emergencyContact" className="block text-sm font-medium text-gray-300 mb-2">
                  Emergency Contact Name
                </label>
                <input
                  id="emergencyContact"
                  name="emergencyContact"
                  type="text"
                  value={formData.emergencyContact}
                  onChange={handleChange}
                  className="form-input"
                  placeholder="Contact person name"
                />
              </div>

              <div>
                <label htmlFor="emergencyPhone" className="block text-sm font-medium text-gray-300 mb-2">
                  Emergency Phone
                </label>
                <input
                  id="emergencyPhone"
                  name="emergencyPhone"
                  type="tel"
                  value={formData.emergencyPhone}
                  onChange={handleChange}
                  className="form-input"
                  placeholder="Emergency contact number"
                />
              </div>

              <div>
                <label htmlFor="emergencyRelation" className="block text-sm font-medium text-gray-300 mb-2">
                  Relationship
                </label>
                <select
                  id="emergencyRelation"
                  name="emergencyRelation"
                  value={formData.emergencyRelation}
                  onChange={handleChange}
                  className="form-input"
                >
                  <option value="">Select relationship</option>
                  <option value="Parent">Parent</option>
                  <option value="Guardian">Guardian</option>
                  <option value="Sibling">Sibling</option>
                  <option value="Friend">Friend</option>
                  <option value="Other">Other</option>
                </select>
              </div>
            </div>

            {/* Preferences */}
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    name="accommodation"
                    checked={formData.accommodation}
                    onChange={handleChange}
                    className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                  />
                  <span className="ml-2 text-sm text-gray-300">Need accommodation</span>
                </label>
              </div>

              <div>
                <label htmlFor="dietary" className="block text-sm font-medium text-gray-300 mb-2">
                  Dietary Preference
                </label>
                <select
                  id="dietary"
                  name="dietary"
                  value={formData.dietary}
                  onChange={handleChange}
                  className="form-input"
                >
                  <option value="Vegetarian">Vegetarian</option>
                  <option value="Non-Vegetarian">Non-Vegetarian</option>
                  <option value="Vegan">Vegan</option>
                  <option value="Jain">Jain</option>
                </select>
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting || isLoading}
              className="w-full cosmic-button py-3 text-lg font-semibold disabled:opacity-50"
            >
              {isSubmitting || isLoading ? (
                <div className="flex items-center justify-center">
                  <div className="loading-spinner w-5 h-5 mr-2"></div>
                  Creating account...
                </div>
              ) : (
                'Create Account'
              )}
            </button>
          </form>

          <div className="mt-8 text-center">
            <p className="text-gray-300">
              Already have an account?{' '}
              <Link to="/login" className="text-purple-400 hover:text-purple-300 font-medium">
                Sign in here
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;