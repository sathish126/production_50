import React, { createContext, useContext, useState, useEffect } from 'react';

interface Event {
  id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  venue: string;
  category: string;
  fee: number;
  maxParticipants: number;
  currentParticipants: number;
  instructor?: string;
  prerequisites?: string;
  image: string;
}

interface Registration {
  id: string;
  userId: string;
  eventId: string;
  registrationDate: string;
  paymentStatus: 'pending' | 'completed' | 'failed';
  amount: number;
}

interface EventContextType {
  events: Event[];
  workshops: Event[];
  registrations: Registration[];
  registerForEvent: (eventId: string, userId: string) => Promise<boolean>;
  getRegistrations: (userId: string) => Registration[];
  isEventRegistered: (eventId: string, userId: string) => boolean;
}

const EventContext = createContext<EventContextType | undefined>(undefined);

export const useEvent = () => {
  const context = useContext(EventContext);
  if (!context) {
    throw new Error('useEvent must be used within an EventProvider');
  }
  return context;
};

export const EventProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [events, setEvents] = useState<Event[]>([]);
  const [workshops, setWorkshops] = useState<Event[]>([]);
  const [registrations, setRegistrations] = useState<Registration[]>([]);

  useEffect(() => {
    // Initialize events and workshops
    const initialEvents: Event[] = [
      {
        id: '1',
        title: 'AI Revolution Hackathon',
        description: 'Build innovative AI solutions in 48 hours',
        date: '2025-08-20',
        time: '09:00 AM',
        venue: 'Innovation Lab',
        category: 'Competition',
        fee: 500,
        maxParticipants: 100,
        currentParticipants: 45,
        image: 'https://images.pexels.com/photos/3861969/pexels-photo-3861969.jpeg?auto=compress&cs=tinysrgb&w=500'
      },
      {
        id: '2',
        title: 'Robotics Championship',
        description: 'Compete with autonomous robots',
        date: '2025-08-20',
        time: '10:00 AM',
        venue: 'Robotics Arena',
        category: 'Competition',
        fee: 800,
        maxParticipants: 50,
        currentParticipants: 32,
        image: 'https://images.pexels.com/photos/2085831/pexels-photo-2085831.jpeg?auto=compress&cs=tinysrgb&w=500'
      },
      {
        id: '3',
        title: 'Tech Innovation Expo',
        description: 'Showcase your innovative projects',
        date: '2025-08-20',
        time: '11:00 AM',
        venue: 'Exhibition Hall',
        category: 'Exhibition',
        fee: 200,
        maxParticipants: 200,
        currentParticipants: 78,
        image: 'https://images.pexels.com/photos/1181677/pexels-photo-1181677.jpeg?auto=compress&cs=tinysrgb&w=500'
      },
      {
        id: '4',
        title: 'Cybersecurity Summit',
        description: 'Learn about latest security threats',
        date: '2025-08-20',
        time: '02:00 PM',
        venue: 'Auditorium',
        category: 'Lecture',
        fee: 300,
        maxParticipants: 300,
        currentParticipants: 156,
        image: 'https://images.pexels.com/photos/60504/security-protection-anti-virus-software-60504.jpeg?auto=compress&cs=tinysrgb&w=500'
      }
    ];

    const initialWorkshops: Event[] = [
      {
        id: 'w1',
        title: 'Machine Learning Masterclass',
        description: 'Complete hands-on ML workshop',
        date: '2025-08-20',
        time: '09:00 AM',
        venue: 'Computer Lab 1',
        category: 'Workshop',
        fee: 1200,
        maxParticipants: 30,
        currentParticipants: 18,
        instructor: 'Dr. Priya Sharma',
        prerequisites: 'Basic Python knowledge',
        image: 'https://images.pexels.com/photos/3861969/pexels-photo-3861969.jpeg?auto=compress&cs=tinysrgb&w=500'
      },
      {
        id: 'w2',
        title: 'Full Stack Web Development',
        description: 'Build modern web applications',
        date: '2025-08-20',
        time: '10:00 AM',
        venue: 'Computer Lab 2',
        category: 'Workshop',
        fee: 1000,
        maxParticipants: 25,
        currentParticipants: 12,
        instructor: 'Raj Kumar',
        prerequisites: 'HTML, CSS, JavaScript basics',
        image: 'https://images.pexels.com/photos/4164418/pexels-photo-4164418.jpeg?auto=compress&cs=tinysrgb&w=500'
      },
      {
        id: 'w3',
        title: 'IoT and Smart Systems',
        description: 'Internet of Things development',
        date: '2025-08-20',
        time: '11:00 AM',
        venue: 'Electronics Lab',
        category: 'Workshop',
        fee: 1500,
        maxParticipants: 20,
        currentParticipants: 8,
        instructor: 'Prof. Arun Mehta',
        prerequisites: 'Basic electronics knowledge',
        image: 'https://images.pexels.com/photos/2599244/pexels-photo-2599244.jpeg?auto=compress&cs=tinysrgb&w=500'
      },
      {
        id: 'w4',
        title: 'Blockchain Development',
        description: 'Build decentralized applications',
        date: '2025-08-20',
        time: '02:00 PM',
        venue: 'Computer Lab 3',
        category: 'Workshop',
        fee: 1800,
        maxParticipants: 15,
        currentParticipants: 6,
        instructor: 'Dr. Neha Gupta',
        prerequisites: 'Programming experience',
        image: 'https://images.pexels.com/photos/844124/pexels-photo-844124.jpeg?auto=compress&cs=tinysrgb&w=500'
      }
    ];

    setEvents(initialEvents);
    setWorkshops(initialWorkshops);

    // Load registrations from localStorage
    const savedRegistrations = localStorage.getItem('production50_registrations');
    if (savedRegistrations) {
      setRegistrations(JSON.parse(savedRegistrations));
    }
  }, []);

  const registerForEvent = async (eventId: string, userId: string): Promise<boolean> => {
    // Check if already registered
    const existingRegistration = registrations.find(
      r => r.eventId === eventId && r.userId === userId
    );
    
    if (existingRegistration) {
      return false;
    }

    // Find the event
    const event = [...events, ...workshops].find(e => e.id === eventId);
    if (!event) {
      return false;
    }

    // Check if event is full
    if (event.currentParticipants >= event.maxParticipants) {
      return false;
    }

    // Simulate payment processing
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Create registration
    const newRegistration: Registration = {
      id: Date.now().toString(),
      userId,
      eventId,
      registrationDate: new Date().toISOString(),
      paymentStatus: 'completed',
      amount: event.fee,
    };

    const updatedRegistrations = [...registrations, newRegistration];
    setRegistrations(updatedRegistrations);
    localStorage.setItem('production50_registrations', JSON.stringify(updatedRegistrations));

    // Update participant count
    if (event.category === 'Workshop') {
      setWorkshops(prev => prev.map(w => 
        w.id === eventId 
          ? { ...w, currentParticipants: w.currentParticipants + 1 }
          : w
      ));
    } else {
      setEvents(prev => prev.map(e => 
        e.id === eventId 
          ? { ...e, currentParticipants: e.currentParticipants + 1 }
          : e
      ));
    }

    return true;
  };

  const getRegistrations = (userId: string): Registration[] => {
    return registrations.filter(r => r.userId === userId);
  };

  const isEventRegistered = (eventId: string, userId: string): boolean => {
    return registrations.some(r => r.eventId === eventId && r.userId === userId);
  };

  return (
    <EventContext.Provider value={{
      events,
      workshops,
      registrations,
      registerForEvent,
      getRegistrations,
      isEventRegistered,
    }}>
      {children}
    </EventContext.Provider>
  );
};