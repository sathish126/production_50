const pool = require('../config/database');
const bcrypt = require('bcryptjs');

const seedData = async () => {
  try {
    console.log('🌱 Starting database seeding...');

    // Create admin user
    const adminPassword = await bcrypt.hash(process.env.ADMIN_PASSWORD || 'admin123456', 12);
    await pool.query(`
      INSERT INTO admin_users (username, email, password_hash, role)
      VALUES ($1, $2, $3, $4)
      ON CONFLICT (email) DO NOTHING
    `, ['admin', process.env.ADMIN_EMAIL || 'admin@production50.com', adminPassword, 'super_admin']);

    // Seed events
    const events = [
      {
        title: 'AI Revolution Hackathon',
        description: 'Build innovative AI solutions in 48 hours with cutting-edge technologies',
        event_type: 'Competition',
        date_time: '2025-08-20 09:00:00',
        venue: 'Innovation Lab',
        max_participants: 100,
        registration_fee: 500.00,
        image_url: 'https://images.pexels.com/photos/3861969/pexels-photo-3861969.jpeg?auto=compress&cs=tinysrgb&w=500',
        prerequisites: 'Basic programming knowledge, familiarity with AI/ML concepts'
      },
      {
        title: 'Robotics Championship',
        description: 'Compete with autonomous robots in challenging scenarios',
        event_type: 'Competition',
        date_time: '2025-08-20 10:00:00',
        venue: 'Robotics Arena',
        max_participants: 50,
        registration_fee: 800.00,
        image_url: 'https://images.pexels.com/photos/2085831/pexels-photo-2085831.jpeg?auto=compress&cs=tinysrgb&w=500',
        prerequisites: 'Robotics experience, Arduino/Raspberry Pi knowledge'
      },
      {
        title: 'Tech Innovation Expo',
        description: 'Showcase your innovative projects to industry experts',
        event_type: 'Exhibition',
        date_time: '2025-08-20 11:00:00',
        venue: 'Exhibition Hall',
        max_participants: 200,
        registration_fee: 200.00,
        image_url: 'https://images.pexels.com/photos/1181677/pexels-photo-1181677.jpeg?auto=compress&cs=tinysrgb&w=500',
        prerequisites: 'Completed project or prototype'
      },
      {
        title: 'Cybersecurity Summit',
        description: 'Learn about latest security threats and defense mechanisms',
        event_type: 'Lecture',
        date_time: '2025-08-20 14:00:00',
        venue: 'Main Auditorium',
        max_participants: 300,
        registration_fee: 300.00,
        image_url: 'https://images.pexels.com/photos/60504/security-protection-anti-virus-software-60504.jpeg?auto=compress&cs=tinysrgb&w=500',
        prerequisites: 'Basic understanding of computer networks'
      },
      {
        title: 'Machine Learning Masterclass',
        description: 'Complete hands-on ML workshop with real-world projects',
        event_type: 'Workshop',
        date_time: '2025-08-20 09:00:00',
        venue: 'Computer Lab 1',
        max_participants: 30,
        registration_fee: 1200.00,
        image_url: 'https://images.pexels.com/photos/3861969/pexels-photo-3861969.jpeg?auto=compress&cs=tinysrgb&w=500',
        instructor_name: 'Dr. Priya Sharma',
        instructor_bio: 'PhD in Machine Learning, 10+ years industry experience',
        prerequisites: 'Python programming, basic statistics knowledge'
      },
      {
        title: 'Full Stack Web Development',
        description: 'Build modern web applications from scratch',
        event_type: 'Workshop',
        date_time: '2025-08-20 10:00:00',
        venue: 'Computer Lab 2',
        max_participants: 25,
        registration_fee: 1000.00,
        image_url: 'https://images.pexels.com/photos/4164418/pexels-photo-4164418.jpeg?auto=compress&cs=tinysrgb&w=500',
        instructor_name: 'Raj Kumar',
        instructor_bio: 'Senior Full Stack Developer, Tech Lead at major startup',
        prerequisites: 'HTML, CSS, JavaScript basics'
      },
      {
        title: 'IoT and Smart Systems',
        description: 'Internet of Things development with practical implementations',
        event_type: 'Workshop',
        date_time: '2025-08-20 11:00:00',
        venue: 'Electronics Lab',
        max_participants: 20,
        registration_fee: 1500.00,
        image_url: 'https://images.pexels.com/photos/2599244/pexels-photo-2599244.jpeg?auto=compress&cs=tinysrgb&w=500',
        instructor_name: 'Prof. Arun Mehta',
        instructor_bio: 'Professor of Electronics, IoT research specialist',
        prerequisites: 'Basic electronics knowledge, C programming'
      },
      {
        title: 'Blockchain Development',
        description: 'Build decentralized applications and smart contracts',
        event_type: 'Workshop',
        date_time: '2025-08-20 14:00:00',
        venue: 'Computer Lab 3',
        max_participants: 15,
        registration_fee: 1800.00,
        image_url: 'https://images.pexels.com/photos/844124/pexels-photo-844124.jpeg?auto=compress&cs=tinysrgb&w=500',
        instructor_name: 'Dr. Neha Gupta',
        instructor_bio: 'Blockchain researcher, Cryptocurrency expert',
        prerequisites: 'Programming experience, understanding of cryptography'
      }
    ];

    for (const event of events) {
      await pool.query(`
        INSERT INTO events (title, description, event_type, date_time, venue, max_participants, registration_fee, image_url, prerequisites, instructor_name, instructor_bio)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
        ON CONFLICT DO NOTHING
      `, [
        event.title, event.description, event.event_type, event.date_time,
        event.venue, event.max_participants, event.registration_fee, event.image_url,
        event.prerequisites, event.instructor_name, event.instructor_bio
      ]);
    }

    console.log('✅ Database seeding completed successfully!');
  } catch (error) {
    console.error('❌ Seeding failed:', error);
    process.exit(1);
  }
};

// Run seeding
seedData().then(() => {
  process.exit(0);
});