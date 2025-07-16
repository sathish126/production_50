import React, { useState } from 'react';
import { Mail, Phone, MapPin, Clock, Send, MessageCircle } from 'lucide-react';
import Notification from '../components/Notification';

const ContactPage: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    category: 'General Inquiry',
    message: ''
  });
  const [notification, setNotification] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate form submission
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    setNotification({ message: 'Message sent successfully! We will get back to you soon.', type: 'success' });
    setFormData({
      name: '',
      email: '',
      phone: '',
      subject: '',
      category: 'General Inquiry',
      message: ''
    });
    setIsSubmitting(false);
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
            Get In Touch
          </h1>
          <p className="text-xl text-gray-300">
            Have questions about Production-50? We're here to help!
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Contact Information */}
          <div className="space-y-8">
            <div className="glass-morphism p-8 rounded-2xl">
              <h2 className="orbitron text-2xl font-bold cosmic-gradient mb-6">
                Contact Information
              </h2>
              
              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <MapPin className="w-6 h-6 text-purple-400 mt-1" />
                  <div>
                    <h3 className="text-white font-semibold mb-1">Address</h3>
                    <p className="text-gray-300 text-sm">
                      PSG College of Technology<br />
                      Avinashi Road, Peelamedu<br />
                      Coimbatore - 641004<br />
                      Tamil Nadu, India
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <Phone className="w-6 h-6 text-blue-400 mt-1" />
                  <div>
                    <h3 className="text-white font-semibold mb-1">Phone</h3>
                    <p className="text-gray-300 text-sm">
                      Main Office: +91 422 2572177<br />
                      Event Coordinator: +91 9876543210<br />
                      Technical Support: +91 9876543211
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <Mail className="w-6 h-6 text-pink-400 mt-1" />
                  <div>
                    <h3 className="text-white font-semibold mb-1">Email</h3>
                    <p className="text-gray-300 text-sm">
                      General: info@production50.com<br />
                      Registration: register@production50.com<br />
                      Support: support@production50.com
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <Clock className="w-6 h-6 text-cyan-400 mt-1" />
                  <div>
                    <h3 className="text-white font-semibold mb-1">Office Hours</h3>
                    <p className="text-gray-300 text-sm">
                      Monday - Friday: 9:00 AM - 6:00 PM<br />
                      Saturday: 9:00 AM - 2:00 PM<br />
                      Sunday: Closed
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Emergency Contact */}
            <div className="glass-morphism p-6 rounded-2xl">
              <h3 className="orbitron text-xl font-bold cosmic-gradient mb-4">
                Emergency Contact
              </h3>
              <div className="space-y-2">
                <p className="text-gray-300 text-sm">
                  <strong>24/7 Emergency Hotline:</strong> +91 9876543200
                </p>
                <p className="text-gray-300 text-sm">
                  <strong>Medical Emergency:</strong> +91 9876543201
                </p>
                <p className="text-gray-300 text-sm">
                  <strong>Security:</strong> +91 9876543202
                </p>
              </div>
            </div>

            {/* Social Media */}
            <div className="glass-morphism p-6 rounded-2xl">
              <h3 className="orbitron text-xl font-bold cosmic-gradient mb-4">
                Follow Us
              </h3>
              <div className="flex space-x-4">
                <a href="#" className="w-10 h-10 bg-purple-600 rounded-full flex items-center justify-center hover:bg-purple-700 transition-colors">
                  <span className="text-white">📘</span>
                </a>
                <a href="#" className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center hover:bg-blue-600 transition-colors">
                  <span className="text-white">🐦</span>
                </a>
                <a href="#" className="w-10 h-10 bg-pink-600 rounded-full flex items-center justify-center hover:bg-pink-700 transition-colors">
                  <span className="text-white">📷</span>
                </a>
                <a href="#" className="w-10 h-10 bg-blue-700 rounded-full flex items-center justify-center hover:bg-blue-800 transition-colors">
                  <span className="text-white">💼</span>
                </a>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="glass-morphism p-8 rounded-2xl">
            <h2 className="orbitron text-2xl font-bold cosmic-gradient mb-6">
              Send Us a Message
            </h2>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-2">
                    Full Name *
                  </label>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    value={formData.name}
                    onChange={handleChange}
                    className="form-input"
                    placeholder="Enter your name"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
                    Email Address *
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="form-input"
                    placeholder="Enter your email"
                    required
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-300 mb-2">
                    Phone Number
                  </label>
                  <input
                    id="phone"
                    name="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={handleChange}
                    className="form-input"
                    placeholder="Enter your phone number"
                  />
                </div>

                <div>
                  <label htmlFor="category" className="block text-sm font-medium text-gray-300 mb-2">
                    Inquiry Category
                  </label>
                  <select
                    id="category"
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    className="form-input"
                  >
                    <option value="General Inquiry">General Inquiry</option>
                    <option value="Registration">Registration</option>
                    <option value="Technical Support">Technical Support</option>
                    <option value="Accommodation">Accommodation</option>
                    <option value="Payment">Payment</option>
                    <option value="Workshop">Workshop</option>
                    <option value="Competition">Competition</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>

              <div>
                <label htmlFor="subject" className="block text-sm font-medium text-gray-300 mb-2">
                  Subject *
                </label>
                <input
                  id="subject"
                  name="subject"
                  type="text"
                  value={formData.subject}
                  onChange={handleChange}
                  className="form-input"
                  placeholder="Enter the subject"
                  required
                />
              </div>

              <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-300 mb-2">
                  Message *
                </label>
                <textarea
                  id="message"
                  name="message"
                  rows={6}
                  value={formData.message}
                  onChange={handleChange}
                  className="form-input resize-none"
                  placeholder="Enter your message here..."
                  required
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full cosmic-button py-3 text-lg font-semibold disabled:opacity-50"
              >
                {isSubmitting ? (
                  <div className="flex items-center justify-center">
                    <div className="loading-spinner w-5 h-5 mr-2"></div>
                    Sending...
                  </div>
                ) : (
                  <div className="flex items-center justify-center">
                    <Send className="w-5 h-5 mr-2" />
                    Send Message
                  </div>
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;