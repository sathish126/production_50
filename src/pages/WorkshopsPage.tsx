import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useEvent } from '../context/EventContext';
import { Calendar, Clock, MapPin, Users, BookOpen, User, CheckCircle } from 'lucide-react';
import Notification from '../components/Notification';

const WorkshopsPage: React.FC = () => {
  const { user } = useAuth();
  const { workshops, registerForEvent, isEventRegistered } = useEvent();
  const [notification, setNotification] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null);
  const [registeringWorkshopId, setRegisteringWorkshopId] = useState<string | null>(null);

  const handleRegister = async (workshopId: string) => {
    if (!user) {
      setNotification({ message: 'Please log in to register for workshops', type: 'error' });
      return;
    }

    if (isEventRegistered(workshopId, user.id)) {
      setNotification({ message: 'You are already registered for this workshop', type: 'info' });
      return;
    }

    setRegisteringWorkshopId(workshopId);
    
    try {
      const success = await registerForEvent(workshopId, user.id);
      if (success) {
        setNotification({ message: 'Successfully registered for workshop!', type: 'success' });
      } else {
        setNotification({ message: 'Registration failed. Workshop might be full.', type: 'error' });
      }
    } catch (error) {
      setNotification({ message: 'An error occurred during registration', type: 'error' });
    } finally {
      setRegisteringWorkshopId(null);
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
      
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="orbitron text-4xl font-bold cosmic-gradient mb-4">
            Premium Tech Workshops
          </h1>
          <p className="text-xl text-gray-300">
            Learn from industry experts and advance your technical skills
          </p>
        </div>

        {/* Workshops Grid */}
        <div className="workshop-grid">
          {workshops.map(workshop => (
            <div key={workshop.id} className="event-card">
              <div className="relative mb-4">
                <img 
                  src={workshop.image}
                  alt={workshop.title}
                  className="w-full h-48 object-cover rounded-lg"
                />
                <div className="absolute top-4 right-4">
                  <span className="px-3 py-1 bg-blue-600 text-white text-sm rounded-full">
                    Workshop
                  </span>
                </div>
              </div>

              <h3 className="orbitron text-xl font-bold text-white mb-2">
                {workshop.title}
              </h3>
              
              <p className="text-gray-300 mb-4">
                {workshop.description}
              </p>

              {/* Instructor Info */}
              {workshop.instructor && (
                <div className="flex items-center text-purple-300 mb-4">
                  <User className="w-4 h-4 mr-2" />
                  <span className="text-sm font-medium">Instructor: {workshop.instructor}</span>
                </div>
              )}

              {/* Prerequisites */}
              {workshop.prerequisites && (
                <div className="flex items-start text-cyan-300 mb-4">
                  <CheckCircle className="w-4 h-4 mr-2 mt-0.5" />
                  <span className="text-sm">Prerequisites: {workshop.prerequisites}</span>
                </div>
              )}

              <div className="space-y-2 mb-4">
                <div className="flex items-center text-gray-300">
                  <Calendar className="w-4 h-4 mr-2" />
                  <span className="text-sm">{workshop.date}</span>
                </div>
                <div className="flex items-center text-gray-300">
                  <Clock className="w-4 h-4 mr-2" />
                  <span className="text-sm">{workshop.time}</span>
                </div>
                <div className="flex items-center text-gray-300">
                  <MapPin className="w-4 h-4 mr-2" />
                  <span className="text-sm">{workshop.venue}</span>
                </div>
                <div className="flex items-center text-gray-300">
                  <Users className="w-4 h-4 mr-2" />
                  <span className="text-sm">
                    {workshop.currentParticipants}/{workshop.maxParticipants} enrolled
                  </span>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="mb-4">
                <div className="flex justify-between text-sm text-gray-400 mb-1">
                  <span>Enrollment</span>
                  <span>{Math.round((workshop.currentParticipants / workshop.maxParticipants) * 100)}%</span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-2">
                  <div 
                    className="bg-gradient-to-r from-purple-500 to-blue-500 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${(workshop.currentParticipants / workshop.maxParticipants) * 100}%` }}
                  ></div>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="text-2xl font-bold text-white">
                  ₹{workshop.fee}
                </div>
                
                {user ? (
                  <button
                    onClick={() => handleRegister(workshop.id)}
                    disabled={
                      registeringWorkshopId === workshop.id ||
                      isEventRegistered(workshop.id, user.id) ||
                      workshop.currentParticipants >= workshop.maxParticipants
                    }
                    className={`px-6 py-2 rounded-lg font-medium transition-all duration-300 ${
                      isEventRegistered(workshop.id, user.id)
                        ? 'bg-green-600 text-white cursor-not-allowed'
                        : workshop.currentParticipants >= workshop.maxParticipants
                        ? 'bg-gray-600 text-gray-300 cursor-not-allowed'
                        : 'cosmic-button'
                    }`}
                  >
                    {registeringWorkshopId === workshop.id ? (
                      <div className="flex items-center">
                        <div className="loading-spinner w-4 h-4 mr-2"></div>
                        Enrolling...
                      </div>
                    ) : isEventRegistered(workshop.id, user.id) ? (
                      '✓ Enrolled'
                    ) : workshop.currentParticipants >= workshop.maxParticipants ? (
                      'Workshop Full'
                    ) : (
                      'Enroll Now'
                    )}
                  </button>
                ) : (
                  <button className="cosmic-button">
                    Login to Enroll
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>

        {workshops.length === 0 && (
          <div className="text-center py-16">
            <BookOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-300 text-lg">No workshops available at the moment</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default WorkshopsPage;