import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, Mail, Lock, Phone, Building, Calendar, Eye, EyeOff, Upload, GraduationCap, Briefcase } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import Notification from '../components/Notification';

const RegisterPage: React.FC = () => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    // Basic Information
    name: '',
    email: 'example@domain.com',
    password: '',
    confirmPassword: '',
    
    // Contact Information
    mobile: '',
    alternateMobile: '',
    
    // Personal Information
    gender: '',
    category: '', // college or alumni
    
    // College specific
    course: '',
    yearOfGraduation: '',
    idCard: null as File | null,
    
    // Alumni specific
    profession: '',
    yearOfPassedOut: '',
    
    // Additional
    accommodation: false,
    dietary: 'Vegetarian'
  });
  
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [notification, setNotification] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState('');
  const [uniqueCode, setUniqueCode] = useState('');
  
  const { register, isLoading } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    if (type === 'file') {
      const file = (e.target as HTMLInputElement).files?.[0] || null;
      setFormData(prev => ({ ...prev, [name]: file }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
      }));
    }
  };

  const validateStep = (stepNumber: number) => {
    switch (stepNumber) {
      case 1:
        if (!formData.name || !formData.email || !formData.password || !formData.confirmPassword) {
          setNotification({ message: 'Please fill in all required fields', type: 'error' });
          return false;
        }
        if (formData.password !== formData.confirmPassword) {
          setNotification({ message: 'Passwords do not match', type: 'error' });
          return false;
        }
        if (formData.password.length < 8) {
          setNotification({ message: 'Password must be at least 8 characters long', type: 'error' });
          return false;
        }
        return true;
      case 2:
        if (!formData.mobile) {
          setNotification({ message: 'Mobile number is required', type: 'error' });
          return false;
        }
        return true;
      case 3:
        if (!formData.gender || !formData.category) {
          setNotification({ message: 'Please select gender and category', type: 'error' });
          return false;
        }
        if (formData.category === 'college' && (!formData.course || !formData.yearOfGraduation)) {
          setNotification({ message: 'Please fill in course and graduation year', type: 'error' });
          return false;
        }
        if (formData.category === 'alumni' && (!formData.profession || !formData.yearOfPassedOut)) {
          setNotification({ message: 'Please fill in profession and year of passing', type: 'error' });
          return false;
        }
        return true;
      default:
        return true;
    }
  };

  const nextStep = () => {
    if (validateStep(step)) {
      setStep(step + 1);
    }
  };

  const prevStep = () => {
    setStep(step - 1);
  };

  const sendOTP = async () => {
    setIsSubmitting(true);
    // Simulate OTP sending
    await new Promise(resolve => setTimeout(resolve, 1000));
    setOtpSent(true);
    setNotification({ message: 'OTP sent to your email successfully!', type: 'success' });
    setIsSubmitting(false);
  };

  const verifyOTP = async () => {
    if (!otp || otp.length !== 6) {
      setNotification({ message: 'Please enter a valid 6-digit OTP', type: 'error' });
      return;
    }

    setIsSubmitting(true);
    // Simulate OTP verification
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Generate unique code
    const code = `PSG50-${Date.now().toString().slice(-6)}`;
    setUniqueCode(code);
    
    try {
      const success = await register({ ...formData, uniqueCode: code });
      if (success) {
        setNotification({ message: 'Registration successful! Redirecting to dashboard...', type: 'success' });
        setTimeout(() => navigate('/dashboard'), 2000);
      } else {
        setNotification({ message: 'Registration failed. Email might already exist.', type: 'error' });
      }
    } catch (error) {
      setNotification({ message: 'An error occurred. Please try again.', type: 'error' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold text-white mb-4">Basic Information</h2>
            
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Name <span className="text-red-400">*</span>
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-purple-400 w-5 h-5" />
                  <input
                    name="name"
                    type="text"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full bg-black/30 border border-purple-500/30 rounded-xl pl-10 pr-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-400/20 transition-all duration-300"
                    placeholder="Enter your full name"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Email <span className="text-red-400">*</span>
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-purple-400 w-5 h-5" />
                  <input
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full bg-black/30 border border-purple-500/30 rounded-xl pl-10 pr-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-400/20 transition-all duration-300"
                    placeholder="Enter your email"
                    required
                  />
                </div>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Password <span className="text-red-400">*</span>
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-purple-400 w-5 h-5" />
                  <input
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    value={formData.password}
                    onChange={handleChange}
                    className="w-full bg-black/30 border border-purple-500/30 rounded-xl pl-10 pr-12 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-400/20 transition-all duration-300"
                    placeholder="••••••••"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-purple-400 hover:text-purple-300 transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Confirm Password <span className="text-red-400">*</span>
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-purple-400 w-5 h-5" />
                  <input
                    name="confirmPassword"
                    type={showConfirmPassword ? 'text' : 'password'}
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className="w-full bg-black/30 border border-purple-500/30 rounded-xl pl-10 pr-12 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-400/20 transition-all duration-300"
                    placeholder="••••••••"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-purple-400 hover:text-purple-300 transition-colors"
                  >
                    {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold text-white mb-4">Contact Information</h2>
            
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Mobile Number <span className="text-red-400">*</span>
                </label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-purple-400 w-5 h-5" />
                  <input
                    name="mobile"
                    type="tel"
                    value={formData.mobile}
                    onChange={handleChange}
                    className="w-full bg-black/30 border border-purple-500/30 rounded-xl pl-10 pr-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-400/20 transition-all duration-300"
                    placeholder="Enter mobile number"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Alternate Mobile Number
                </label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-purple-400 w-5 h-5" />
                  <input
                    name="alternateMobile"
                    type="tel"
                    value={formData.alternateMobile}
                    onChange={handleChange}
                    className="w-full bg-black/30 border border-purple-500/30 rounded-xl pl-10 pr-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-400/20 transition-all duration-300"
                    placeholder="Alternate mobile number"
                  />
                </div>
              </div>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold text-white mb-4">Personal Information</h2>
            
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Gender <span className="text-red-400">*</span>
                </label>
                <select
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                  className="w-full bg-black/30 border border-purple-500/30 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-400/20 transition-all duration-300"
                  required
                >
                  <option value="">Select Gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Category <span className="text-red-400">*</span>
                </label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className="w-full bg-black/30 border border-purple-500/30 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-400/20 transition-all duration-300"
                  required
                >
                  <option value="">Select Category</option>
                  <option value="college">College Student</option>
                  <option value="alumni">Alumni</option>
                </select>
              </div>
            </div>

            {formData.category === 'college' && (
              <div className="space-y-4 p-4 bg-blue-900/20 rounded-xl border border-blue-500/20">
                <h3 className="text-lg font-medium text-blue-300 flex items-center">
                  <GraduationCap className="w-5 h-5 mr-2" />
                  College Information
                </h3>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Course <span className="text-red-400">*</span>
                    </label>
                    <input
                      name="course"
                      type="text"
                      value={formData.course}
                      onChange={handleChange}
                      className="w-full bg-black/30 border border-blue-500/30 rounded-xl px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-400/20 transition-all duration-300"
                      placeholder="e.g., B.Tech CSE"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Year of Graduation <span className="text-red-400">*</span>
                    </label>
                    <input
                      name="yearOfGraduation"
                      type="number"
                      value={formData.yearOfGraduation}
                      onChange={handleChange}
                      className="w-full bg-black/30 border border-blue-500/30 rounded-xl px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-400/20 transition-all duration-300"
                      placeholder="2025"
                      min="2020"
                      max="2030"
                      required
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    ID Card Photo <span className="text-red-400">*</span>
                  </label>
                  <div className="relative">
                    <Upload className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-400 w-5 h-5" />
                    <input
                      name="idCard"
                      type="file"
                      onChange={handleChange}
                      accept="image/*"
                      className="w-full bg-black/30 border border-blue-500/30 rounded-xl pl-10 pr-4 py-3 text-white file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-600 file:text-white hover:file:bg-blue-700 focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-400/20 transition-all duration-300"
                      required
                    />
                  </div>
                </div>
              </div>
            )}

            {formData.category === 'alumni' && (
              <div className="space-y-4 p-4 bg-green-900/20 rounded-xl border border-green-500/20">
                <h3 className="text-lg font-medium text-green-300 flex items-center">
                  <Briefcase className="w-5 h-5 mr-2" />
                  Alumni Information
                </h3>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Profession <span className="text-red-400">*</span>
                    </label>
                    <input
                      name="profession"
                      type="text"
                      value={formData.profession}
                      onChange={handleChange}
                      className="w-full bg-black/30 border border-green-500/30 rounded-xl px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-green-400 focus:ring-2 focus:ring-green-400/20 transition-all duration-300"
                      placeholder="e.g., Software Engineer"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Year of Passing <span className="text-red-400">*</span>
                    </label>
                    <input
                      name="yearOfPassedOut"
                      type="number"
                      value={formData.yearOfPassedOut}
                      onChange={handleChange}
                      className="w-full bg-black/30 border border-green-500/30 rounded-xl px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-green-400 focus:ring-2 focus:ring-green-400/20 transition-all duration-300"
                      placeholder="2020"
                      min="1975"
                      max="2024"
                      required
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold text-white mb-4">Email Verification</h2>
            
            {!otpSent ? (
              <div className="text-center">
                <p className="text-gray-300 mb-6">
                  We'll send a verification code to <strong>{formData.email}</strong>
                </p>
                <button
                  onClick={sendOTP}
                  disabled={isSubmitting}
                  className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold py-3 px-8 rounded-xl transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:transform-none neon-glow"
                >
                  {isSubmitting ? 'Sending...' : 'Send OTP'}
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                <p className="text-gray-300 text-center mb-4">
                  Enter the 6-digit code sent to your email
                </p>
                <div className="flex justify-center">
                  <input
                    type="text"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    className="w-48 bg-black/30 border border-purple-500/30 rounded-xl px-4 py-3 text-white text-center text-2xl tracking-widest placeholder-gray-400 focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-400/20 transition-all duration-300"
                    placeholder="000000"
                    maxLength={6}
                  />
                </div>
                <div className="text-center">
                  <button
                    onClick={verifyOTP}
                    disabled={isSubmitting || otp.length !== 6}
                    className="bg-gradient-to-r from-green-600 to-teal-600 hover:from-green-700 hover:to-teal-700 text-white font-semibold py-3 px-8 rounded-xl transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:transform-none neon-glow"
                  >
                    {isSubmitting ? 'Verifying...' : 'Verify OTP'}
                  </button>
                </div>
              </div>
            )}
          </div>
        );

      case 5:
        return (
          <div className="space-y-6 text-center">
            <div className="w-20 h-20 bg-gradient-to-r from-green-600 to-teal-600 rounded-full flex items-center justify-center mx-auto neon-glow">
              <span className="text-3xl">✓</span>
            </div>
            <h2 className="text-2xl font-bold text-white">Registration Successful!</h2>
            <div className="bg-green-900/20 border border-green-500/20 rounded-xl p-6">
              <p className="text-gray-300 mb-4">Your unique code is:</p>
              <div className="text-3xl font-bold cosmic-gradient">{uniqueCode}</div>
              <p className="text-sm text-gray-400 mt-2">Save this code for future reference</p>
            </div>
            <p className="text-gray-300">Redirecting to your dashboard...</p>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-8 relative overflow-hidden">
      {/* Cosmic Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-blue-900/20 to-pink-900/20"></div>
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-purple-600/10 via-transparent to-transparent"></div>
      
      {/* Floating particles */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(30)].map((_, i) => (
          <div
            key={i}
            className="absolute w-2 h-2 bg-purple-400 rounded-full opacity-20 animate-pulse"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${3 + Math.random() * 2}s`
            }}
          />
        ))}
      </div>

      {notification && (
        <Notification
          message={notification.message}
          type={notification.type}
          onClose={() => setNotification(null)}
        />
      )}
      
      <div className="w-full max-w-2xl relative z-10">
        {/* Registration Container */}
        <div className="glass-morphism p-8 rounded-3xl shadow-2xl border border-purple-500/20 backdrop-blur-xl">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full flex items-center justify-center neon-glow">
                <span className="orbitron text-2xl font-bold text-white">P50</span>
              </div>
            </div>
            <h1 className="orbitron text-3xl font-bold cosmic-gradient mb-2">
              Sign Up
            </h1>
            <p className="text-gray-300 text-sm">
              Join the Production-50 community
            </p>
          </div>

          {/* Progress Bar */}
          {step <= 4 && (
            <div className="mb-8">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm text-gray-400">Step {step} of 4</span>
                <span className="text-sm text-gray-400">{Math.round((step / 4) * 100)}%</span>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-2">
                <div 
                  className="bg-gradient-to-r from-purple-500 to-blue-500 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${(step / 4) * 100}%` }}
                ></div>
              </div>
            </div>
          )}

          {/* Form Content */}
          <div className="min-h-[400px]">
            {renderStep()}
          </div>

          {/* Navigation Buttons */}
          {step <= 4 && (
            <div className="flex justify-between mt-8">
              {step > 1 && step < 4 && (
                <button
                  onClick={prevStep}
                  className="bg-gray-600 hover:bg-gray-700 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-300"
                >
                  Previous
                </button>
              )}
              
              {step < 3 && (
                <button
                  onClick={nextStep}
                  className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-300 transform hover:scale-105 neon-glow ml-auto"
                >
                  Next
                </button>
              )}
              
              {step === 3 && (
                <button
                  onClick={nextStep}
                  className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-300 transform hover:scale-105 neon-glow ml-auto"
                >
                  Continue to Verification
                </button>
              )}
            </div>
          )}

          {/* Login Link */}
          {step === 1 && (
            <div className="text-center mt-6">
              <p className="text-gray-300 text-sm">
                Already have an account?{' '}
                <Link to="/login" className="text-purple-400 hover:text-purple-300 transition-colors">
                  Sign in here
                </Link>
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;