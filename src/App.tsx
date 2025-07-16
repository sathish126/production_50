import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import Dashboard from './pages/Dashboard';
import EventsPage from './pages/EventsPage';
import WorkshopsPage from './pages/WorkshopsPage';
import AboutPage from './pages/AboutPage';
import ContactPage from './pages/ContactPage';
import AdminPage from './pages/AdminPage';
import CircularNavigation from './components/CircularNavigation';
import { AuthProvider } from './context/AuthContext';
import { EventProvider } from './context/EventContext';
import CosmicBackground from './components/CosmicBackground';
import './App.css';

function App() {
  const [showCircularNav, setShowCircularNav] = useState(false);

  return (
    <AuthProvider>
      <EventProvider>
        <Router>
          <div className="App relative min-h-screen overflow-x-hidden">
            <CosmicBackground />
            <Header />
            <CircularNavigation 
              isOpen={showCircularNav} 
              onToggle={() => setShowCircularNav(!showCircularNav)}
            />
            
            <main className="relative z-10">
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/events" element={<EventsPage />} />
                <Route path="/workshops" element={<WorkshopsPage />} />
                <Route path="/about" element={<AboutPage />} />
                <Route path="/contact" element={<ContactPage />} />
                <Route path="/admin" element={<AdminPage />} />
              </Routes>
            </main>
          </div>
        </Router>
      </EventProvider>
    </AuthProvider>
  );
}

export default App;