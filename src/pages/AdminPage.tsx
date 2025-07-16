import React, { useState } from 'react';
import { Users, Calendar, CreditCard, TrendingUp, Download, Settings, Bell, UserCheck } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useEvent } from '../context/EventContext';

const AdminPage: React.FC = () => {
  const { user } = useAuth();
  const { events, workshops, registrations } = useEvent();
  const [activeTab, setActiveTab] = useState('dashboard');

  // Check if user is admin (in a real app, this would be checked against proper roles)
  const isAdmin = user?.email === 'admin@production50.com';

  if (!isAdmin) {
    return (
      <div className="min-h-screen pt-20 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white mb-4">Access Denied</h1>
          <p className="text-gray-300">You don't have permission to access this page.</p>
        </div>
      </div>
    );
  }

  const totalUsers = JSON.parse(localStorage.getItem('production50_users') || '[]').length;
  const totalRevenue = registrations.reduce((sum, reg) => sum + reg.amount, 0);
  const totalEvents = events.length + workshops.length;
  const totalRegistrations = registrations.length;

  const tabs = [
    { id: 'dashboard', label: 'Dashboard', icon: TrendingUp },
    { id: 'users', label: 'Users', icon: Users },
    { id: 'events', label: 'Events', icon: Calendar },
    { id: 'payments', label: 'Payments', icon: CreditCard },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <div className="min-h-screen pt-20 py-12 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="glass-morphism p-6 rounded-2xl mb-8">
          <h1 className="orbitron text-3xl font-bold cosmic-gradient mb-2">
            Admin Dashboard
          </h1>
          <p className="text-gray-300">
            Manage Production-50 event administration
          </p>
        </div>

        {/* Navigation Tabs */}
        <div className="flex flex-wrap gap-2 mb-8">
          {tabs.map(tab => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-all duration-300 ${
                  activeTab === tab.id
                    ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white'
                    : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Dashboard Tab */}
        {activeTab === 'dashboard' && (
          <div className="space-y-8">
            {/* Stats Cards */}
            <div className="admin-stats">
              <div className="stat-card">
                <Users className="w-8 h-8 text-purple-400 mx-auto mb-2" />
                <h3 className="text-2xl font-bold text-white">{totalUsers}</h3>
                <p className="text-gray-300">Total Users</p>
              </div>
              
              <div className="stat-card">
                <Calendar className="w-8 h-8 text-blue-400 mx-auto mb-2" />
                <h3 className="text-2xl font-bold text-white">{totalEvents}</h3>
                <p className="text-gray-300">Total Events</p>
              </div>
              
              <div className="stat-card">
                <UserCheck className="w-8 h-8 text-pink-400 mx-auto mb-2" />
                <h3 className="text-2xl font-bold text-white">{totalRegistrations}</h3>
                <p className="text-gray-300">Registrations</p>
              </div>
              
              <div className="stat-card">
                <CreditCard className="w-8 h-8 text-cyan-400 mx-auto mb-2" />
                <h3 className="text-2xl font-bold text-white">₹{totalRevenue.toLocaleString()}</h3>
                <p className="text-gray-300">Total Revenue</p>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="glass-morphism p-6 rounded-2xl">
              <h2 className="orbitron text-xl font-bold cosmic-gradient mb-4">
                Recent Activity
              </h2>
              <div className="space-y-4">
                <div className="flex items-center justify-between py-2 border-b border-gray-600">
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                    <span className="text-gray-300">New user registration</span>
                  </div>
                  <span className="text-gray-400 text-sm">2 minutes ago</span>
                </div>
                <div className="flex items-center justify-between py-2 border-b border-gray-600">
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                    <span className="text-gray-300">Workshop registration completed</span>
                  </div>
                  <span className="text-gray-400 text-sm">5 minutes ago</span>
                </div>
                <div className="flex items-center justify-between py-2 border-b border-gray-600">
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
                    <span className="text-gray-300">Payment verification pending</span>
                  </div>
                  <span className="text-gray-400 text-sm">10 minutes ago</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Users Tab */}
        {activeTab === 'users' && (
          <div className="glass-morphism p-6 rounded-2xl">
            <div className="flex items-center justify-between mb-6">
              <h2 className="orbitron text-xl font-bold cosmic-gradient">
                User Management
              </h2>
              <button className="cosmic-button">
                <Download className="w-4 h-4 mr-2" />
                Export Users
              </button>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-gray-600">
                    <th className="py-3 px-4 text-gray-300">Name</th>
                    <th className="py-3 px-4 text-gray-300">Email</th>
                    <th className="py-3 px-4 text-gray-300">Type</th>
                    <th className="py-3 px-4 text-gray-300">Status</th>
                    <th className="py-3 px-4 text-gray-300">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {JSON.parse(localStorage.getItem('production50_users') || '[]').slice(0, 10).map((user: any) => (
                    <tr key={user.id} className="border-b border-gray-700">
                      <td className="py-3 px-4 text-white">{user.name}</td>
                      <td className="py-3 px-4 text-gray-300">{user.email}</td>
                      <td className="py-3 px-4 text-gray-300">{user.participationType}</td>
                      <td className="py-3 px-4">
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          user.isVerified ? 'bg-green-600 text-white' : 'bg-red-600 text-white'
                        }`}>
                          {user.isVerified ? 'Verified' : 'Pending'}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <button className="text-blue-400 hover:text-blue-300 mr-2">Edit</button>
                        <button className="text-red-400 hover:text-red-300">Delete</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Events Tab */}
        {activeTab === 'events' && (
          <div className="glass-morphism p-6 rounded-2xl">
            <div className="flex items-center justify-between mb-6">
              <h2 className="orbitron text-xl font-bold cosmic-gradient">
                Event Management
              </h2>
              <button className="cosmic-button">
                <Calendar className="w-4 h-4 mr-2" />
                Add Event
              </button>
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...events, ...workshops].map(event => (
                <div key={event.id} className="event-card">
                  <img 
                    src={event.image}
                    alt={event.title}
                    className="w-full h-32 object-cover rounded-lg mb-4"
                  />
                  <h3 className="text-white font-semibold mb-2">{event.title}</h3>
                  <p className="text-gray-300 text-sm mb-2">{event.category}</p>
                  <div className="flex justify-between items-center">
                    <span className="text-purple-400">₹{event.fee}</span>
                    <span className="text-gray-400 text-sm">
                      {event.currentParticipants}/{event.maxParticipants}
                    </span>
                  </div>
                  <div className="mt-4 flex space-x-2">
                    <button className="text-blue-400 hover:text-blue-300 text-sm">Edit</button>
                    <button className="text-red-400 hover:text-red-300 text-sm">Delete</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Payments Tab */}
        {activeTab === 'payments' && (
          <div className="glass-morphism p-6 rounded-2xl">
            <div className="flex items-center justify-between mb-6">
              <h2 className="orbitron text-xl font-bold cosmic-gradient">
                Payment Management
              </h2>
              <button className="cosmic-button">
                <Download className="w-4 h-4 mr-2" />
                Export Payments
              </button>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-gray-600">
                    <th className="py-3 px-4 text-gray-300">Transaction ID</th>
                    <th className="py-3 px-4 text-gray-300">User</th>
                    <th className="py-3 px-4 text-gray-300">Event</th>
                    <th className="py-3 px-4 text-gray-300">Amount</th>
                    <th className="py-3 px-4 text-gray-300">Status</th>
                    <th className="py-3 px-4 text-gray-300">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {registrations.slice(0, 10).map((reg) => (
                    <tr key={reg.id} className="border-b border-gray-700">
                      <td className="py-3 px-4 text-white font-mono">{reg.id}</td>
                      <td className="py-3 px-4 text-gray-300">{reg.userId}</td>
                      <td className="py-3 px-4 text-gray-300">{reg.eventId}</td>
                      <td className="py-3 px-4 text-white">₹{reg.amount}</td>
                      <td className="py-3 px-4">
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          reg.paymentStatus === 'completed' 
                            ? 'bg-green-600 text-white'
                            : reg.paymentStatus === 'pending'
                            ? 'bg-yellow-600 text-white'
                            : 'bg-red-600 text-white'
                        }`}>
                          {reg.paymentStatus}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-gray-300">
                        {new Date(reg.registrationDate).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Settings Tab */}
        {activeTab === 'settings' && (
          <div className="glass-morphism p-6 rounded-2xl">
            <h2 className="orbitron text-xl font-bold cosmic-gradient mb-6">
              System Settings
            </h2>
            
            <div className="space-y-6">
              <div className="flex items-center justify-between py-4 border-b border-gray-600">
                <div>
                  <h3 className="text-white font-semibold">Email Notifications</h3>
                  <p className="text-gray-300 text-sm">Send email notifications to users</p>
                </div>
                <button className="cosmic-button">
                  <Bell className="w-4 h-4 mr-2" />
                  Configure
                </button>
              </div>
              
              <div className="flex items-center justify-between py-4 border-b border-gray-600">
                <div>
                  <h3 className="text-white font-semibold">Payment Gateway</h3>
                  <p className="text-gray-300 text-sm">Configure payment processing</p>
                </div>
                <button className="cosmic-button">
                  <CreditCard className="w-4 h-4 mr-2" />
                  Settings
                </button>
              </div>
              
              <div className="flex items-center justify-between py-4 border-b border-gray-600">
                <div>
                  <h3 className="text-white font-semibold">Database Backup</h3>
                  <p className="text-gray-300 text-sm">Backup user and event data</p>
                </div>
                <button className="cosmic-button">
                  <Download className="w-4 h-4 mr-2" />
                  Backup Now
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminPage;