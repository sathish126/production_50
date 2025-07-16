import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Home, 
  Calendar, 
  BookOpen, 
  Users, 
  Building, 
  Award, 
  Phone, 
  Info,
  Menu,
  X
} from 'lucide-react';

interface CircularNavigationProps {
  isOpen: boolean;
  onToggle: () => void;
}

const CircularNavigation: React.FC<CircularNavigationProps> = ({ isOpen, onToggle }) => {
  const menuItems = [
    { icon: Home, label: 'Home', path: '/', color: 'from-purple-500 to-blue-500' },
    { icon: Calendar, label: 'Events', path: '/events', color: 'from-blue-500 to-cyan-500' },
    { icon: BookOpen, label: 'Workshops', path: '/workshops', color: 'from-cyan-500 to-teal-500' },
    { icon: Info, label: 'About', path: '/about', color: 'from-teal-500 to-green-500' },
    { icon: Building, label: 'Accommodation', path: '/accommodation', color: 'from-green-500 to-yellow-500' },
    { icon: Award, label: 'Sponsors', path: '/sponsors', color: 'from-yellow-500 to-orange-500' },
    { icon: Users, label: 'Team', path: '/team', color: 'from-orange-500 to-red-500' },
    { icon: Phone, label: 'Contact', path: '/contact', color: 'from-red-500 to-pink-500' },
  ];

  const getItemPosition = (index: number, total: number) => {
    const angle = (index * 2 * Math.PI) / total - Math.PI / 2;
    const radius = 140;
    const x = Math.cos(angle) * radius;
    const y = Math.sin(angle) * radius;
    return { x, y };
  };

  return (
    <>
      {/* Toggle Button */}
      <button
        onClick={onToggle}
        className="fixed top-1/2 left-8 transform -translate-y-1/2 z-50 w-16 h-16 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full flex items-center justify-center neon-glow transition-all duration-300 hover:scale-110"
      >
        {isOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={onToggle}
        />
      )}

      {/* Circular Menu */}
      {isOpen && (
        <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50">
          <div className="relative w-80 h-80">
            {/* Central Hub */}
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-20 h-20 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full flex items-center justify-center">
              <span className="orbitron text-sm font-bold">P-50</span>
            </div>

            {/* Menu Items */}
            {menuItems.map((item, index) => {
              const position = getItemPosition(index, menuItems.length);
              const Icon = item.icon;
              
              return (
                <Link
                  key={item.label}
                  to={item.path}
                  onClick={onToggle}
                  className={`absolute w-16 h-16 bg-gradient-to-r ${item.color} rounded-full flex items-center justify-center hover:scale-110 transition-all duration-300 group`}
                  style={{
                    left: `calc(50% + ${position.x}px - 2rem)`,
                    top: `calc(50% + ${position.y}px - 2rem)`,
                    animation: `fadeIn 0.3s ease ${index * 0.1}s both`,
                  }}
                >
                  <Icon size={20} className="text-white" />
                  <span className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 text-xs font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap">
                    {item.label}
                  </span>
                </Link>
              );
            })}
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: scale(0.5);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
      `}</style>
    </>
  );
};

export default CircularNavigation;