import React from 'react';
import CountdownTimer from '../components/CountdownTimer';
import { Calendar, Users, Award, MapPin, Mail, Phone, Globe, Download } from 'lucide-react';

const HomePage: React.FC = () => {
  return (
    <div className="min-h-screen pt-20">
      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <div className="mb-8">
            <h1 className="hero-title orbitron cosmic-gradient">
              Production-50
            </h1>
            <p className="text-2xl md:text-3xl text-gray-300 mb-4">
              The Future of Innovation Begins Here
            </p>
            <p className="text-lg text-purple-300 mb-8">
              Golden Jubilee Tech Festival - Where Technology Meets Tomorrow
            </p>
            <button className="cosmic-button text-lg px-8 py-4">
              🚀 Explore the Universe
            </button>
          </div>
        </div>
      </section>

      {/* Countdown Timer */}
      <section className="py-16 bg-black bg-opacity-20">
        <div className="max-w-7xl mx-auto px-4">
          <CountdownTimer />
        </div>
      </section>

      {/* About Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <div className="space-y-6">
              <h2 className="orbitron text-4xl font-bold cosmic-gradient">
                50 Years of Innovation Legacy
              </h2>
              <p className="text-xl text-cyan-300 mb-6">
                Where Technology Meets Tomorrow
              </p>
              
              <div className="space-y-4 text-gray-300">
                <p className="text-lg leading-relaxed">
                  Production-50 marks the golden jubilee of technological excellence at PSG College of Technology. 
                  For five decades, we've been at the forefront of innovation, nurturing brilliant minds and 
                  revolutionary ideas that shape the future.
                </p>
                
                <p className="text-lg leading-relaxed">
                  This year's festival celebrates our rich legacy while embracing cutting-edge technologies 
                  like AI, blockchain, IoT, and quantum computing. Join us for an extraordinary journey 
                  through the cosmos of innovation.
                </p>
              </div>

              {/* Statistics */}
              <div className="grid grid-cols-2 gap-6 mt-8">
                <div className="text-center">
                  <div className="text-3xl font-bold cosmic-gradient">5000+</div>
                  <div className="text-gray-400">Expected Participants</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold cosmic-gradient">50+</div>
                  <div className="text-gray-400">Technical Workshops</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold cosmic-gradient">100+</div>
                  <div className="text-gray-400">Industry Experts</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold cosmic-gradient">25+</div>
                  <div className="text-gray-400">Premium Sponsors</div>
                </div>
              </div>

              <button className="cosmic-button mt-8">
                🌟 Join the Revolution
              </button>
            </div>

            {/* Right Collage */}
            <div className="relative">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-4">
                  <div className="relative group">
                    <img 
                      src="https://images.pexels.com/photos/3861969/pexels-photo-3861969.jpeg?auto=compress&cs=tinysrgb&w=300&h=200"
                      alt="AI Technology"
                      className="w-full h-32 object-cover rounded-lg border-2 border-purple-500 border-opacity-30 group-hover:border-opacity-100 transition-all duration-300"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-purple-900 to-transparent opacity-60 rounded-lg"></div>
                  </div>
                  <div className="relative group">
                    <img 
                      src="https://images.pexels.com/photos/2085831/pexels-photo-2085831.jpeg?auto=compress&cs=tinysrgb&w=300&h=250"
                      alt="Robotics"
                      className="w-full h-40 object-cover rounded-lg border-2 border-blue-500 border-opacity-30 group-hover:border-opacity-100 transition-all duration-300"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-blue-900 to-transparent opacity-60 rounded-lg"></div>
                  </div>
                </div>
                <div className="space-y-4 mt-8">
                  <div className="relative group">
                    <img 
                      src="https://images.pexels.com/photos/1181677/pexels-photo-1181677.jpeg?auto=compress&cs=tinysrgb&w=300&h=250"
                      alt="Innovation"
                      className="w-full h-40 object-cover rounded-lg border-2 border-pink-500 border-opacity-30 group-hover:border-opacity-100 transition-all duration-300"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-pink-900 to-transparent opacity-60 rounded-lg"></div>
                  </div>
                  <div className="relative group">
                    <img 
                      src="https://images.pexels.com/photos/4164418/pexels-photo-4164418.jpeg?auto=compress&cs=tinysrgb&w=300&h=200"
                      alt="Coding"
                      className="w-full h-32 object-cover rounded-lg border-2 border-cyan-500 border-opacity-30 group-hover:border-opacity-100 transition-all duration-300"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-cyan-900 to-transparent opacity-60 rounded-lg"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-20 bg-black bg-opacity-40">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Address & Location */}
            <div className="glass-morphism p-6 text-center group hover:scale-105 transition-all duration-300">
              <div className="flex justify-center mb-4">
                <MapPin className="w-8 h-8 text-purple-400 group-hover:text-purple-300" />
              </div>
              <h3 className="orbitron text-lg font-bold mb-3 cosmic-gradient">Location</h3>
              <p className="text-gray-300 text-sm leading-relaxed">
                PSG College of Technology<br />
                Coimbatore, Tamil Nadu<br />
                India - 641004
              </p>
              <button className="mt-4 text-purple-400 hover:text-purple-300 text-sm transition-colors">
                📍 View on Maps
              </button>
            </div>

            {/* Contact & Support */}
            <div className="glass-morphism p-6 text-center group hover:scale-105 transition-all duration-300">
              <div className="flex justify-center mb-4">
                <Phone className="w-8 h-8 text-blue-400 group-hover:text-blue-300" />
              </div>
              <h3 className="orbitron text-lg font-bold mb-3 cosmic-gradient">Contact</h3>
              <div className="text-gray-300 text-sm space-y-2">
                <p>📧 info@production50.com</p>
                <p>📞 +91 9876543210</p>
                <p>⏰ 24/7 Support</p>
              </div>
              <button className="mt-4 text-blue-400 hover:text-blue-300 text-sm transition-colors">
                🎫 Lodge Complaint
              </button>
            </div>

            {/* Social Media */}
            <div className="glass-morphism p-6 text-center group hover:scale-105 transition-all duration-300">
              <div className="flex justify-center mb-4">
                <Globe className="w-8 h-8 text-pink-400 group-hover:text-pink-300" />
              </div>
              <h3 className="orbitron text-lg font-bold mb-3 cosmic-gradient">Follow Us</h3>
              <div className="flex justify-center space-x-4 mb-4">
                <a href="#" className="text-pink-400 hover:text-pink-300 transition-colors">📱</a>
                <a href="#" className="text-pink-400 hover:text-pink-300 transition-colors">💼</a>
                <a href="#" className="text-pink-400 hover:text-pink-300 transition-colors">💬</a>
                <a href="#" className="text-pink-400 hover:text-pink-300 transition-colors">🐦</a>
              </div>
              <p className="text-gray-300 text-sm">Stay connected for updates</p>
            </div>

            {/* Brochure */}
            <div className="glass-morphism p-6 text-center group hover:scale-105 transition-all duration-300">
              <div className="flex justify-center mb-4">
                <Download className="w-8 h-8 text-cyan-400 group-hover:text-cyan-300" />
              </div>
              <h3 className="orbitron text-lg font-bold mb-3 cosmic-gradient">Brochure</h3>
              <div className="mb-4">
                <div className="w-16 h-20 bg-gradient-to-b from-purple-600 to-blue-600 rounded mx-auto mb-2 flex items-center justify-center">
                  <span className="text-white text-xs">PDF</span>
                </div>
                <p className="text-gray-300 text-sm">Complete Event Guide</p>
              </div>
              <button className="cosmic-button text-sm">
                📄 Download Now
              </button>
            </div>
          </div>

          <div className="mt-12 pt-8 border-t border-purple-500 border-opacity-30 text-center">
            <p className="text-gray-400">
              © 2025 Production-50 | PSG College of Technology. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;