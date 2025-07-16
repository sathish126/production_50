import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useEvent } from '../context/EventContext';
import { User, Calendar, Award, Settings, CreditCard, QrCode, Bell, Download } from 'lucide-react';
import Notification from '../components/Notification';

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const { getRegistrations, events, workshops } = useEvent();
  const [notification, setNotification] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null);

  if (!user) {
    return (
      <div className="min-h-screen pt-20 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white mb-4">Access Denied</h1>
          <p className="text-gray-300">Please log in to access your dashboard.</p>
        </div>
      </div>
    );
  }

  const userRegistrations = getRegistrations(user.id);
  const registeredEvents = userRegistrations.map(reg => {
    const event = [...events, ...workshops].find(e => e.id === reg.eventId);
    return { ...reg, event };
  });

  const generateQRCode = () => {
    setNotification({ message: 'QR Code generated successfully!', type: 'success' });
  };

  const downloadTicket = () => {
    setNotification({ message: 'Ticket downloaded successfully!', type: 'success' });
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
      
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="glass-morphism p-6 rounded-2xl mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full flex items-center justify-center">
                <User className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="orbitron text-2xl font-bold cosmic-gradient">
                  Welcome, {user.name}!
                </h1>
                <p className="text-gray-300">
                  {user.participationType} • {user.institution}
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <button className="cosmic-button">
                <Settings className="w-4 h-4 mr-2" />
                Settings
              </button>
              <button 
                onClick={generateQRCode}
                className="cosmic-button"
              >
                <QrCode className="w-4 h-4 mr-2" />
                QR Code
              </button>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <div className="glass-morphism p-6 rounded-2xl text-center">
            <Calendar className="w-8 h-8 text-purple-400 mx-auto mb-3" />
            <h3 className="text-2xl font-bold text-white">{registeredEvents.length}</h3>
            <p className="text-gray-300">Events Registered</p>
          </div>
          
          <div className="glass-morphism p-6 rounded-2xl text-center">
            <Award className="w-8 h-8 text-blue-400 mx-auto mb-3" />
            <h3 className="text-2xl font-bold text-white">
              ₹{registeredEvents.reduce((sum, reg) => sum + reg.amount, 0)}
            </h3>
            <p className="text-gray-300">Total Investment</p>
          </div>
          
          <div className="glass-morphism p-6 rounded-2xl text-center">
            <Bell className="w-8 h-8 text-pink-400 mx-auto mb-3" />
            <h3 className="text-2xl font-bold text-white">
              {registeredEvents.filter(reg => reg.paymentStatus === 'completed').length}
            </h3>
            <p className="text-gray-300">Confirmed Events</p>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid lg:grid-cols-2 gap-8">
          {/* User Profile */}
          <div className="glass-morphism p-6 rounded-2xl">
            <h2 className="orbitron text-xl font-bold cosmic-gradient mb-6">
              Profile Information
            </h2>
            <div className="space-y-4">
              <div className="flex justify-between">
                <span className="text-gray-300">Email:</span>
                <span className="text-white">{user.email}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-300">Phone:</span>
                <span className="text-white">{user.phone}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-300">Registration Date:</span>
                <span className="text-white">
                  {new Date(user.registrationDate).toLocaleDateString()}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-300">Verification:</span>
                <span className={`font-medium ${user.isVerified ? 'text-green-400' : 'text-red-400'}`}>
                  {user.isVerified ? '✓ Verified' : '✗ Not Verified'}
                </span>
              </div>
            </div>
            
            <div className="mt-6 pt-6 border-t border-gray-600">
              <h3 className="font-semibold text-white mb-4">Quick Actions</h3>
              <div className="grid grid-cols-2 gap-4">
                <button className="cosmic-button text-sm">
                  <User className="w-4 h-4 mr-2" />
                  Edit Profile
                </button>
                <button 
                  onClick={downloadTicket}
                  className="cosmic-button text-sm"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Download Ticket
                </button>
              </div>
            </div>
          </div>

          {/* QR Code */}
          <div className="glass-morphism p-6 rounded-2xl">
            <h2 className="orbitron text-xl font-bold cosmic-gradient mb-6">
              Entry Pass
            </h2>
            <div className="text-center">
              <div className="qr-code-container">
                <div className="w-48 h-48 bg-white rounded-lg flex items-center justify-center mx-auto mb-4">
                  <div className="text-center">
                    <QrCode className="w-24 h-24 text-gray-800 mx-auto mb-2" />
                    <p className="text-gray-800 text-sm font-mono">
                      {user.qrCode}
                    </p>
                  </div>
                </div>
              </div>
              <p className="text-gray-300 mb-4">
                Show this QR code at the event venue for entry
              </p>
              <button 
                onClick={generateQRCode}
                className="cosmic-button"
              >
                <Download className="w-4 h-4 mr-2" />
                Download QR Code
              </button>
            </div>
          </div>
        </div>

        {/* Registered Events */}
        <div className="mt-8">
          <div className="glass-morphism p-6 rounded-2xl">
            <h2 className="orbitron text-xl font-bold cosmic-gradient mb-6">
              My Registrations
            </h2>
            
            {registeredEvents.length === 0 ? (
              <div className="text-center py-8">
                <Calendar className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-300 mb-4">No events registered yet</p>
                <button className="cosmic-button">
                  Browse Events
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {registeredEvents.map((registration) => (
                  <div key={registration.id} className="event-card">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <img 
                          src={registration.event?.image || 'https://images.pexels.com/photos/1181677/pexels-photo-1181677.jpeg?auto=compress&cs=tinysrgb&w=100&h=100'}
                          alt={registration.event?.title}
                          className="w-16 h-16 rounded-lg object-cover"
                        />
                        <div>
                          <h3 className="text-white font-semibold">
                            {registration.event?.title || 'Event Title'}
                          </h3>
                          <p className="text-gray-300 text-sm">
                            {registration.event?.date} • {registration.event?.time}
                          </p>
                          <p className="text-gray-400 text-sm">
                            {registration.event?.venue}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-semibold text-white">
                          ₹{registration.amount}
                        </div>
                        <div className={`text-sm font-medium ${
                          registration.paymentStatus === 'completed' 
                            ? 'text-green-400' 
                            : registration.paymentStatus === 'pending'
                            ? 'text-yellow-400'
                            : 'text-red-400'
                        }`}>
                          {registration.paymentStatus === 'completed' ? '✓ Paid' : 
                           registration.paymentStatus === 'pending' ? '⏳ Pending' : '✗ Failed'}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;