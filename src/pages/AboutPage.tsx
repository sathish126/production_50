import React from 'react';
import { Users, Award, Calendar, Building, Star, Target } from 'lucide-react';

const AboutPage: React.FC = () => {
  return (
    <div className="min-h-screen pt-20 py-12 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="orbitron text-4xl font-bold cosmic-gradient mb-4">
            About Production-50
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Celebrating 50 years of technological excellence, innovation, and academic leadership 
            at PSG College of Technology
          </p>
        </div>

        {/* Main Content */}
        <div className="grid lg:grid-cols-2 gap-12 mb-16">
          {/* Left Content */}
          <div className="space-y-6">
            <div className="glass-morphism p-8 rounded-2xl">
              <h2 className="orbitron text-2xl font-bold cosmic-gradient mb-4">
                Our Legacy
              </h2>
              <p className="text-gray-300 leading-relaxed mb-4">
                Production-50 represents the golden jubilee of PSG College of Technology, 
                marking five decades of pioneering education in engineering and technology. 
                Since our inception, we have been at the forefront of technological advancement, 
                producing world-class engineers and innovators.
              </p>
              <p className="text-gray-300 leading-relaxed">
                This milestone celebration brings together students, faculty, alumni, and 
                industry leaders to showcase the incredible journey of innovation, research, 
                and academic excellence that has defined our institution.
              </p>
            </div>

            <div className="glass-morphism p-8 rounded-2xl">
              <h2 className="orbitron text-2xl font-bold cosmic-gradient mb-4">
                Vision & Mission
              </h2>
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <Target className="w-6 h-6 text-purple-400 mt-1" />
                  <div>
                    <h3 className="text-white font-semibold mb-2">Vision</h3>
                    <p className="text-gray-300 text-sm">
                      To be a globally recognized center of excellence in engineering education, 
                      research, and innovation, fostering leaders who shape the future of technology.
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <Star className="w-6 h-6 text-blue-400 mt-1" />
                  <div>
                    <h3 className="text-white font-semibold mb-2">Mission</h3>
                    <p className="text-gray-300 text-sm">
                      To provide quality education, promote research and innovation, and develop 
                      skilled professionals with ethical values to serve society and industry.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Content - Image Gallery */}
          <div className="space-y-6">
            <div className="glass-morphism p-6 rounded-2xl">
              <h2 className="orbitron text-2xl font-bold cosmic-gradient mb-4">
                College Highlights
              </h2>
              <div className="grid grid-cols-2 gap-4">
                <img 
                  src="https://images.pexels.com/photos/1181677/pexels-photo-1181677.jpeg?auto=compress&cs=tinysrgb&w=300&h=200"
                  alt="Campus"
                  className="w-full h-24 object-cover rounded-lg"
                />
                <img 
                  src="https://images.pexels.com/photos/3861969/pexels-photo-3861969.jpeg?auto=compress&cs=tinysrgb&w=300&h=200"
                  alt="Research"
                  className="w-full h-24 object-cover rounded-lg"
                />
                <img 
                  src="https://images.pexels.com/photos/2085831/pexels-photo-2085831.jpeg?auto=compress&cs=tinysrgb&w=300&h=200"
                  alt="Labs"
                  className="w-full h-24 object-cover rounded-lg"
                />
                <img 
                  src="https://images.pexels.com/photos/4164418/pexels-photo-4164418.jpeg?auto=compress&cs=tinysrgb&w=300&h=200"
                  alt="Innovation"
                  className="w-full h-24 object-cover rounded-lg"
                />
              </div>
            </div>

            <div className="glass-morphism p-6 rounded-2xl">
              <h2 className="orbitron text-2xl font-bold cosmic-gradient mb-4">
                Key Statistics
              </h2>
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center">
                  <div className="text-3xl font-bold text-purple-400">50+</div>
                  <div className="text-sm text-gray-300">Years of Excellence</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-400">15+</div>
                  <div className="text-sm text-gray-300">Departments</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-pink-400">10,000+</div>
                  <div className="text-sm text-gray-300">Students</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-cyan-400">500+</div>
                  <div className="text-sm text-gray-300">Faculty</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Departments */}
        <div className="mb-16">
          <h2 className="orbitron text-3xl font-bold cosmic-gradient text-center mb-8">
            Our Departments
          </h2>
          <div className="grid md:grid-cols-3 lg:grid-cols-4 gap-6">
            {[
              'Computer Science',
              'Electronics & Communication',
              'Mechanical Engineering',
              'Civil Engineering',
              'Electrical Engineering',
              'Information Technology',
              'Aerospace Engineering',
              'Biomedical Engineering',
              'Chemical Engineering',
              'Industrial Engineering',
              'Automobile Engineering',
              'Textile Technology'
            ].map((dept, index) => (
              <div key={index} className="glass-morphism p-4 rounded-xl text-center">
                <Building className="w-8 h-8 text-purple-400 mx-auto mb-2" />
                <h3 className="text-white font-medium text-sm">{dept}</h3>
              </div>
            ))}
          </div>
        </div>

        {/* Event Features */}
        <div className="grid md:grid-cols-3 gap-8">
          <div className="glass-morphism p-6 rounded-2xl text-center">
            <Users className="w-12 h-12 text-purple-400 mx-auto mb-4" />
            <h3 className="orbitron text-xl font-bold text-white mb-2">
              Expert Faculty
            </h3>
            <p className="text-gray-300 text-sm">
              Learn from renowned professors and industry experts with decades of experience
            </p>
          </div>

          <div className="glass-morphism p-6 rounded-2xl text-center">
            <Award className="w-12 h-12 text-blue-400 mx-auto mb-4" />
            <h3 className="orbitron text-xl font-bold text-white mb-2">
              Award-Winning Programs
            </h3>
            <p className="text-gray-300 text-sm">
              Nationally recognized academic programs and research initiatives
            </p>
          </div>

          <div className="glass-morphism p-6 rounded-2xl text-center">
            <Calendar className="w-12 h-12 text-pink-400 mx-auto mb-4" />
            <h3 className="orbitron text-xl font-bold text-white mb-2">
              50 Years of Innovation
            </h3>
            <p className="text-gray-300 text-sm">
              Five decades of technological advancement and academic excellence
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;