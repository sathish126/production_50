const pool = require('../config/database');

const createTables = async () => {
  try {
    console.log('🚀 Starting database migration...');

    // Create enums
    await pool.query(`
      DO $$ BEGIN
        CREATE TYPE user_gender AS ENUM ('Male', 'Female', 'Other', 'Prefer not to say');
      EXCEPTION
        WHEN duplicate_object THEN null;
      END $$;
    `);

    await pool.query(`
      DO $$ BEGIN
        CREATE TYPE participant_type AS ENUM ('Student', 'Faculty', 'Industry Professional');
      EXCEPTION
        WHEN duplicate_object THEN null;
      END $$;
    `);

    await pool.query(`
      DO $$ BEGIN
        CREATE TYPE event_type_enum AS ENUM ('Workshop', 'Competition', 'Lecture', 'Cultural', 'Exhibition');
      EXCEPTION
        WHEN duplicate_object THEN null;
      END $$;
    `);

    await pool.query(`
      DO $$ BEGIN
        CREATE TYPE payment_status_enum AS ENUM ('pending', 'completed', 'failed', 'refunded');
      EXCEPTION
        WHEN duplicate_object THEN null;
      END $$;
    `);

    await pool.query(`
      DO $$ BEGIN
        CREATE TYPE attendance_enum AS ENUM ('registered', 'present', 'absent');
      EXCEPTION
        WHEN duplicate_object THEN null;
      END $$;
    `);

    await pool.query(`
      DO $$ BEGIN
        CREATE TYPE room_type_enum AS ENUM ('Single', 'Double', 'Triple', 'Dormitory');
      EXCEPTION
        WHEN duplicate_object THEN null;
      END $$;
    `);

    await pool.query(`
      DO $$ BEGIN
        CREATE TYPE admin_role_enum AS ENUM ('super_admin', 'admin', 'moderator');
      EXCEPTION
        WHEN duplicate_object THEN null;
      END $$;
    `);

    await pool.query(`
      DO $$ BEGIN
        CREATE TYPE notification_type_enum AS ENUM ('info', 'warning', 'success', 'error');
      EXCEPTION
        WHEN duplicate_object THEN null;
      END $$;
    `);

    await pool.query(`
      DO $$ BEGIN
        CREATE TYPE message_status_enum AS ENUM ('new', 'in_progress', 'resolved', 'closed');
      EXCEPTION
        WHEN duplicate_object THEN null;
      END $$;
    `);

    // Create users table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        full_name VARCHAR(100) NOT NULL,
        email VARCHAR(100) UNIQUE NOT NULL,
        password_hash VARCHAR(255) NOT NULL,
        phone VARCHAR(15) NOT NULL,
        date_of_birth DATE NOT NULL,
        gender user_gender NOT NULL,
        institution VARCHAR(200),
        participation_type participant_type NOT NULL,
        emergency_contact_name VARCHAR(100),
        emergency_contact_phone VARCHAR(15),
        emergency_relationship VARCHAR(50),
        profile_picture VARCHAR(255),
        is_verified BOOLEAN DEFAULT FALSE,
        is_active BOOLEAN DEFAULT TRUE,
        verification_token VARCHAR(255),
        reset_token VARCHAR(255),
        reset_token_expiry TIMESTAMP,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Create events table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS events (
        id SERIAL PRIMARY KEY,
        title VARCHAR(200) NOT NULL,
        description TEXT,
        event_type event_type_enum NOT NULL,
        date_time TIMESTAMP NOT NULL,
        venue VARCHAR(100),
        max_participants INT DEFAULT 100,
        current_participants INT DEFAULT 0,
        registration_fee DECIMAL(10,2) NOT NULL,
        image_url VARCHAR(255),
        prerequisites TEXT,
        instructor_name VARCHAR(100),
        instructor_bio TEXT,
        is_active BOOLEAN DEFAULT TRUE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Create event_registrations table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS event_registrations (
        id SERIAL PRIMARY KEY,
        user_id INT REFERENCES users(id) ON DELETE CASCADE,
        event_id INT REFERENCES events(id) ON DELETE CASCADE,
        payment_status payment_status_enum DEFAULT 'pending',
        payment_id VARCHAR(100),
        amount_paid DECIMAL(10,2),
        registration_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        qr_code VARCHAR(255),
        verification_code VARCHAR(255),
        attendance_status attendance_enum DEFAULT 'registered',
        dietary_preferences TEXT,
        UNIQUE(user_id, event_id)
      )
    `);

    // Create accommodation table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS accommodation (
        id SERIAL PRIMARY KEY,
        user_id INT REFERENCES users(id) ON DELETE CASCADE,
        room_type room_type_enum NOT NULL,
        check_in_date DATE NOT NULL,
        check_out_date DATE NOT NULL,
        total_amount DECIMAL(10,2) NOT NULL,
        payment_status payment_status_enum DEFAULT 'pending',
        payment_id VARCHAR(100),
        special_requests TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Create payments table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS payments (
        id SERIAL PRIMARY KEY,
        user_id INT REFERENCES users(id) ON DELETE CASCADE,
        order_id VARCHAR(100) UNIQUE NOT NULL,
        payment_id VARCHAR(100),
        amount DECIMAL(10,2) NOT NULL,
        currency VARCHAR(3) DEFAULT 'INR',
        status payment_status_enum DEFAULT 'pending',
        payment_method VARCHAR(50),
        gateway_response JSONB,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Create admin_users table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS admin_users (
        id SERIAL PRIMARY KEY,
        username VARCHAR(50) UNIQUE NOT NULL,
        email VARCHAR(100) UNIQUE NOT NULL,
        password_hash VARCHAR(255) NOT NULL,
        role admin_role_enum NOT NULL,
        is_active BOOLEAN DEFAULT TRUE,
        last_login TIMESTAMP,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Create notifications table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS notifications (
        id SERIAL PRIMARY KEY,
        user_id INT REFERENCES users(id) ON DELETE CASCADE,
        title VARCHAR(200) NOT NULL,
        message TEXT NOT NULL,
        type notification_type_enum NOT NULL,
        is_read BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Create contact_messages table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS contact_messages (
        id SERIAL PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        email VARCHAR(100) NOT NULL,
        phone VARCHAR(15),
        subject VARCHAR(200) NOT NULL,
        message TEXT NOT NULL,
        category VARCHAR(50) DEFAULT 'General Inquiry',
        status message_status_enum DEFAULT 'new',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Create push_subscriptions table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS push_subscriptions (
        id SERIAL PRIMARY KEY,
        user_id INT REFERENCES users(id) ON DELETE CASCADE,
        endpoint TEXT NOT NULL,
        p256dh TEXT NOT NULL,
        auth TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Create indexes for better performance
    await pool.query('CREATE INDEX IF NOT EXISTS idx_users_email ON users(email)');
    await pool.query('CREATE INDEX IF NOT EXISTS idx_events_date ON events(date_time)');
    await pool.query('CREATE INDEX IF NOT EXISTS idx_registrations_user ON event_registrations(user_id)');
    await pool.query('CREATE INDEX IF NOT EXISTS idx_registrations_event ON event_registrations(event_id)');
    await pool.query('CREATE INDEX IF NOT EXISTS idx_payments_order ON payments(order_id)');
    await pool.query('CREATE INDEX IF NOT EXISTS idx_notifications_user ON notifications(user_id)');

    console.log('✅ Database migration completed successfully!');
  } catch (error) {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  }
};

// Run migration
createTables().then(() => {
  process.exit(0);
});