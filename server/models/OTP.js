const mongodb = require('../config/mongodb');

class OTP {
  constructor() {
    this.collection = 'otps';
  }

  async create(email, otp, expiresInMinutes = 10) {
    try {
      const db = mongodb.getDb();
      
      // Remove any existing OTP for this email
      await this.removeByEmail(email);
      
      const otpDoc = {
        email: email.toLowerCase(),
        otp: otp,
        createdAt: new Date(),
        expiresAt: new Date(Date.now() + expiresInMinutes * 60 * 1000),
        attempts: 0,
        maxAttempts: 3
      };

      const result = await db.collection(this.collection).insertOne(otpDoc);
      return { ...otpDoc, _id: result.insertedId };
    } catch (error) {
      throw error;
    }
  }

  async findByEmail(email) {
    try {
      const db = mongodb.getDb();
      return await db.collection(this.collection).findOne({ 
        email: email.toLowerCase(),
        expiresAt: { $gt: new Date() }
      });
    } catch (error) {
      throw error;
    }
  }

  async verify(email, otp) {
    try {
      const db = mongodb.getDb();
      
      const otpDoc = await this.findByEmail(email);
      
      if (!otpDoc) {
        return { success: false, message: 'OTP not found or expired' };
      }

      if (otpDoc.attempts >= otpDoc.maxAttempts) {
        await this.removeByEmail(email);
        return { success: false, message: 'Maximum attempts exceeded' };
      }

      // Increment attempts
      await db.collection(this.collection).updateOne(
        { _id: otpDoc._id },
        { $inc: { attempts: 1 } }
      );

      if (otpDoc.otp !== otp) {
        return { success: false, message: 'Invalid OTP' };
      }

      // OTP is valid, remove it
      await this.removeByEmail(email);
      return { success: true, message: 'OTP verified successfully' };
    } catch (error) {
      throw error;
    }
  }

  async removeByEmail(email) {
    try {
      const db = mongodb.getDb();
      return await db.collection(this.collection).deleteMany({ 
        email: email.toLowerCase() 
      });
    } catch (error) {
      throw error;
    }
  }

  generateOTP(length = 6) {
    const digits = '0123456789';
    let otp = '';
    for (let i = 0; i < length; i++) {
      otp += digits[Math.floor(Math.random() * digits.length)];
    }
    return otp;
  }

  async cleanupExpired() {
    try {
      const db = mongodb.getDb();
      const result = await db.collection(this.collection).deleteMany({
        expiresAt: { $lt: new Date() }
      });
      console.log(`🧹 Cleaned up ${result.deletedCount} expired OTPs`);
      return result.deletedCount;
    } catch (error) {
      console.error('Failed to cleanup expired OTPs:', error);
      throw error;
    }
  }
}

module.exports = new OTP();