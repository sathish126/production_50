import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useEvent } from '../context/EventContext';
import { Calendar, Clock, MapPin, Users, Trophy, CreditCard } from 'lucide-react';
import Notification from '../components/Notification';

const EventsPage: React.FC = () => {
  const { user } = useAuth();
  const { events, registerForEvent, isEventRegistered } = useEvent();
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [notification, setNotification] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null);
  const [registeringEventId, setRegisteringEventId] = useState<string | null>(null);

  const categories = ['All', 'Competition', 'Exhibition', 'Lecture', 'Cultural'];

  const filteredEvents = selectedCategory === 'All' 
    ? events 
    : events.filter(event => event.category === selectedCategory);

  const handleRegister = async (eventId: string) => {
    if (!user) {
      setNotification({ message: 'Please log in to register for events', type: 'error' });
      return;
    }

    if (isEventRegistered(eventId, user.id)) {
      setNotification({ message: 'You are already registered for this event', type: 'info' });
      return;
    }

    setRegisteringEventId(eventId);
    
    try {
      const success = await registerForEvent(eventId, user.id);
      if (success) {
        setNotification({ message: 'Successfully registered for event!', type: 'success' });
      } else {
        setNotification({ message: 'Registration failed. Event might be full.', type: 'error' });
      }
    } catch (error) {
      setNotification({ message: 'An error occurred during registration', type: 'error' });
    } finally {
      setRegisteringEventId(null);
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
            Tech Events & Competitions
          </h1>
          <p className="text-xl text-gray-300">
            Challenge yourself in cutting-edge technology competitions
          </p>
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap justify-center gap-4 mb-8">
          {categories.map(category => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-6 py-3 rounded-full font-medium transition-all duration-300 ${
                selectedCategory === category
                  ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white'
                  : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Events Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredEvents.map(event => (
            <div key={event.id} className="event-card">
              <div className="relative mb-4">
                <img 
                  src={event.image}
                  alt={event.title}
                  className="w-full h-48 object-cover rounded-lg"
                />
                <div className="absolute top-4 right-4">
                  <span className="px-3 py-1 bg-purple-600 text-white text-sm rounded-full">
                    {event.category}
                  </span>
                </div>
              </div>

              <h3 className="orbitron text-xl font-bold text-white mb-2">
                {event.title}
              </h3>
              
              <p className="text-gray-300 mb-4 line-clamp-3">
                {event.description}
              </p>

              <div className="space-y-2 mb-4">
                <div className="flex items-center text-gray-300">
                  <Calendar className="w-4 h-4 mr-2" />
                  <span className="text-sm">{event.date}</span>
                </div>
                <div className="flex items-center text-gray-300">
                  <Clock className="w-4 h-4 mr-2" />
                  <span className="text-sm">{event.time}</span>
                </div>
                <div className="flex items-center text-gray-300">
                  <MapPin className="w-4 h-4 mr-2" />
                  <span className="text-sm">{event.venue}</span>
                </div>
                <div className="flex items-center text-gray-300">
                  <Users className="w-4 h-4 mr-2" />
                  <span className="text-sm">
                    {event.currentParticipants}/{event.maxParticipants} registered
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="text-2xl font-bold text-white">
                  ₹{event.fee}
                </div>
                
                {user ? (
                  <button
                    onClick={() => handleRegister(event.id)}
                    disabled={
                      registeringEventId === event.id ||
                      isEventRegistered(event.id, user.id) ||
                      event.currentParticipants >= event.maxParticipants
                    }
                    className={`px-6 py-2 rounded-lg font-medium transition-all duration-300 ${
                      isEventRegistered(event.id, user.id)
                        ? 'bg-green-600 text-white cursor-not-allowed'
                        : event.currentParticipants >= event.maxParticipants
                        ? 'bg-gray-600 text-gray-300 cursor-not-allowed'
                        : 'cosmic-button'
                    }`}
                  >
                    {registeringEventId === event.id ? (
                      <div className="flex items-center">
                        <div className="loading-spinner w-4 h-4 mr-2"></div>
                        Registering...
                      </div>
                    ) : isEventRegistered(event.id, user.id) ? (
                      '✓ Registered'
                    ) : event.currentParticipants >= event.maxParticipants ? (
                      'Event Full'
                    ) : (
                      'Register Now'
                    )}
                  </button>
                ) : (
                  <button className="cosmic-button">
                    Login to Register
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>

        {filteredEvents.length === 0 && (
          <div className="text-center py-16">
            <Trophy className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-300 text-lg">No events found in this category</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default EventsPage;