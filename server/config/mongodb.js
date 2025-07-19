const { MongoClient } = require('mongodb');
require('dotenv').config();

class MongoDB {
  constructor() {
    this.client = null;
    this.db = null;
  }

  async connect() {
    try {
      this.client = new MongoClient(process.env.MONGODB_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      });

      await this.client.connect();
      this.db = this.client.db(process.env.DB_NAME || 'production50');
      
      console.log('✅ Connected to MongoDB successfully');
      
      // Create indexes for better performance
      await this.createIndexes();
      
      return this.db;
    } catch (error) {
      console.error('❌ MongoDB connection failed:', error);
      throw error;
    }
  }

  async createIndexes() {
    try {
      // Users collection indexes
      await this.db.collection('users').createIndex({ email: 1 }, { unique: true });
      await this.db.collection('users').createIndex({ uniqueCode: 1 }, { unique: true });
      await this.db.collection('users').createIndex({ mobile: 1 });
      await this.db.collection('users').createIndex({ verificationToken: 1 });
      await this.db.collection('users').createIndex({ resetToken: 1 });

      // Events collection indexes
      await this.db.collection('events').createIndex({ eventType: 1 });
      await this.db.collection('events').createIndex({ dateTime: 1 });
      await this.db.collection('events').createIndex({ isActive: 1 });

      // Registrations collection indexes
      await this.db.collection('registrations').createIndex({ userId: 1 });
      await this.db.collection('registrations').createIndex({ eventId: 1 });
      await this.db.collection('registrations').createIndex({ userId: 1, eventId: 1 }, { unique: true });
      await this.db.collection('registrations').createIndex({ paymentStatus: 1 });

      // OTP collection indexes
      await this.db.collection('otps').createIndex({ email: 1 });
      await this.db.collection('otps').createIndex({ expiresAt: 1 }, { expireAfterSeconds: 0 });

      console.log('✅ Database indexes created successfully');
    } catch (error) {
      console.error('❌ Failed to create indexes:', error);
    }
  }

  getDb() {
    if (!this.db) {
      throw new Error('Database not connected. Call connect() first.');
    }
    return this.db;
  }

  async disconnect() {
    if (this.client) {
      await this.client.close();
      console.log('✅ Disconnected from MongoDB');
    }
  }
}

module.exports = new MongoDB();