import React from 'react';
import { Users, Award, Calendar, Building, Star, Target, Quote, ChevronLeft, ChevronRight } from 'lucide-react';

const AboutPage: React.FC = () => {
  const alumniTestimonials = [
    {
      name: "Dr. Rajesh Kumar",
      batch: "1995",
      position: "CTO, Tech Innovations Inc.",
      image: "https://images.pexels.com/photos/2182970/pexels-photo-2182970.jpeg?auto=compress&cs=tinysrgb&w=150&h=150",
      testimonial: "PSG College shaped my career in ways I never imagined. The foundation I received here has been instrumental in my journey to becoming a technology leader."
    },
    {
      name: "Priya Sharma",
      batch: "2010",
      position: "Senior Software Engineer, Google",
      image: "https://images.pexels.com/photos/3785079/pexels-photo-3785079.jpeg?auto=compress&cs=tinysrgb&w=150&h=150",
      testimonial: "The quality of education and the innovative environment at PSG prepared me for the challenges in the tech industry. Proud to be an alumna!"
    },
    {
      name: "Arun Krishnan",
      batch: "2005",
      position: "Founder, StartupTech Solutions",
      image: "https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=150&h=150",
      testimonial: "PSG College not only gave me technical knowledge but also the entrepreneurial spirit to start my own company. Forever grateful!"
    }
  ];

  const studentCorner = [
    {
      name: "Ananya Patel",
      year: "Final Year CSE",
      achievement: "Winner - National Coding Championship 2024",
      image: "https://images.pexels.com/photos/3769021/pexels-photo-3769021.jpeg?auto=compress&cs=tinysrgb&w=150&h=150"
    },
    {
      name: "Vikram Singh",
      year: "Third Year ECE",
      achievement: "Best Innovation Award - Tech Fest 2024",
      image: "https://images.pexels.com/photos/2182970/pexels-photo-2182970.jpeg?auto=compress&cs=tinysrgb&w=150&h=150"
    },
    {
      name: "Meera Nair",
      year: "Second Year IT",
      achievement: "Published Research Paper in IEEE",
      image: "https://images.pexels.com/photos/3785079/pexels-photo-3785079.jpeg?auto=compress&cs=tinysrgb&w=150&h=150"
    },
    {
      name: "Arjun Reddy",
      year: "Final Year Mechanical",
      achievement: "International Robotics Competition Finalist",
      image: "https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=150&h=150"
    }
  ];

  const sponsors = [
    { name: "Google", logo: "https://via.placeholder.com/120x60/4285F4/FFFFFF?text=Google" },
    { name: "Microsoft", logo: "https://via.placeholder.com/120x60/00A4EF/FFFFFF?text=Microsoft" },
    { name: "Amazon", logo: "https://via.placeholder.com/120x60/FF9900/FFFFFF?text=Amazon" },
    { name: "IBM", logo: "https://via.placeholder.com/120x60/1261FE/FFFFFF?text=IBM" },
    { name: "Intel", logo: "https://via.placeholder.com/120x60/0071C5/FFFFFF?text=Intel" },
    { name: "TCS", logo: "https://via.placeholder.com/120x60/004C8C/FFFFFF?text=TCS" },
    { name: "Infosys", logo: "https://via.placeholder.com/120x60/007CC3/FFFFFF?text=Infosys" },
    { name: "Wipro", logo: "https://via.placeholder.com/120x60/634F9C/FFFFFF?text=Wipro" }
  ];

  const facultyCoordinators = [
    {
      name: "Dr. Suresh Kumar",
      position: "Professor & Head, CSE",
      image: "https://images.pexels.com/photos/2182970/pexels-photo-2182970.jpeg?auto=compress&cs=tinysrgb&w=200&h=200"
    },
    {
      name: "Dr. Lakshmi Priya",
      position: "Associate Professor, ECE",
      image: "https://images.pexels.com/photos/3785079/pexels-photo-3785079.jpeg?auto=compress&cs=tinysrgb&w=200&h=200"
    },
    {
      name: "Dr. Ramesh Babu",
      position: "Professor, Mechanical",
      image: "https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=200&h=200"
    }
  ];

  const studentCoordinators = [
    {
      name: "Rahul Sharma",
      position: "Event Coordinator, Final Year CSE",
      image: "https://images.pexels.com/photos/2182970/pexels-photo-2182970.jpeg?auto=compress&cs=tinysrgb&w=200&h=200"
    },
    {
      name: "Sneha Patel",
      position: "Technical Coordinator, Final Year ECE",
      image: "https://images.pexels.com/photos/3769021/pexels-photo-3769021.jpeg?auto=compress&cs=tinysrgb&w=200&h=200"
    },
    {
      name: "Karthik Reddy",
      position: "Marketing Coordinator, Final Year IT",
      image: "https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=200&h=200"
    },
    {
      name: "Divya Krishnan",
      position: "Logistics Coordinator, Final Year Mechanical",
      image: "https://images.pexels.com/photos/3785079/pexels-photo-3785079.jpeg?auto=compress&cs=tinysrgb&w=200&h=200"
    }
  ];

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

        {/* Alumni Testimonials Section */}
        <div className="mb-16">
          <h2 className="orbitron text-3xl font-bold cosmic-gradient text-center mb-8">
            Alumni Testimonials
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {alumniTestimonials.map((alumni, index) => (
              <div key={index} className="glass-morphism p-6 rounded-2xl">
                <div className="flex items-center mb-4">
                  <img 
                    src={alumni.image}
                    alt={alumni.name}
                    className="w-16 h-16 rounded-full object-cover mr-4"
                  />
                  <div>
                    <h3 className="text-white font-semibold">{alumni.name}</h3>
                    <p className="text-purple-300 text-sm">Batch of {alumni.batch}</p>
                    <p className="text-gray-400 text-xs">{alumni.position}</p>
                  </div>
                </div>
                <Quote className="w-6 h-6 text-purple-400 mb-2" />
                <p className="text-gray-300 text-sm italic">"{alumni.testimonial}"</p>
              </div>
            ))}
          </div>
        </div>

        {/* Students Corner Section */}
        <div className="mb-16">
          <h2 className="orbitron text-3xl font-bold cosmic-gradient text-center mb-8">
            Students Corner
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {studentCorner.map((student, index) => (
              <div key={index} className="glass-morphism p-6 rounded-2xl text-center">
                <img 
                  src={student.image}
                  alt={student.name}
                  className="w-20 h-20 rounded-full object-cover mx-auto mb-4"
                />
                <h3 className="text-white font-semibold mb-1">{student.name}</h3>
                <p className="text-purple-300 text-sm mb-2">{student.year}</p>
                <p className="text-gray-300 text-xs">{student.achievement}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Sponsors Section */}
        <div className="mb-16">
          <h2 className="orbitron text-3xl font-bold cosmic-gradient text-center mb-8">
            Our Sponsors
          </h2>
          <div className="glass-morphism p-8 rounded-2xl overflow-hidden">
            <div className="sponsors-scroll">
              <div className="sponsors-track">
                {[...sponsors, ...sponsors].map((sponsor, index) => (
                  <div key={index} className="sponsor-item">
                    <img 
                      src={sponsor.logo}
                      alt={sponsor.name}
                      className="h-12 object-contain filter brightness-0 invert opacity-70 hover:opacity-100 transition-opacity"
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Team Section */}
        <div className="mb-16">
          <h2 className="orbitron text-3xl font-bold cosmic-gradient text-center mb-8">
            Our Team
          </h2>
          
          {/* Faculty Coordinators */}
          <div className="mb-12">
            <h3 className="orbitron text-2xl font-bold text-center mb-6 text-purple-300">
              Faculty Coordinators
            </h3>
            <div className="grid md:grid-cols-3 gap-8">
              {facultyCoordinators.map((faculty, index) => (
                <div key={index} className="glass-morphism p-6 rounded-2xl text-center">
                  <img 
                    src={faculty.image}
                    alt={faculty.name}
                    className="w-24 h-24 rounded-full object-cover mx-auto mb-4"
                  />
                  <h4 className="text-white font-semibold mb-2">{faculty.name}</h4>
                  <p className="text-gray-300 text-sm">{faculty.position}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Student Coordinators */}
          <div>
            <h3 className="orbitron text-2xl font-bold text-center mb-6 text-blue-300">
              Student Coordinators
            </h3>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {studentCoordinators.map((student, index) => (
                <div key={index} className="glass-morphism p-6 rounded-2xl text-center">
                  <img 
                    src={student.image}
                    alt={student.name}
                    className="w-20 h-20 rounded-full object-cover mx-auto mb-4"
                  />
                  <h4 className="text-white font-semibold mb-2">{student.name}</h4>
                  <p className="text-gray-300 text-sm">{student.position}</p>
                </div>
              ))}
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

      <style jsx>{`
        .sponsors-scroll {
          width: 100%;
          overflow: hidden;
        }
        
        .sponsors-track {
          display: flex;
          animation: scroll 30s linear infinite;
          width: calc(240px * 16);
        }
        
        .sponsor-item {
          flex: 0 0 240px;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 0 20px;
        }
        
        @keyframes scroll {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(calc(-240px * 8));
          }
        }
        
        .sponsors-track:hover {
          animation-play-state: paused;
        }
      `}</style>
    </div>
  );
};

export default AboutPage;