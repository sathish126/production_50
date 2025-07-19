const mongodb = require('../config/mongodb');
const bcrypt = require('bcryptjs');
const { ObjectId } = require('mongodb');

class User {
  constructor() {
    this.collection = 'users';
  }

  async create(userData) {
    try {
      const db = mongodb.getDb();
      
      // Hash password
      const hashedPassword = await bcrypt.hash(userData.password, 12);
      
      // Generate unique code
      const uniqueCode = this.generateUniqueCode();
      
      const user = {
        name: userData.name,
        email: userData.email.toLowerCase(),
        password: hashedPassword,
        mobile: userData.mobile,
        alternateMobile: userData.alternateMobile || null,
        gender: userData.gender,
        category: userData.category, // 'college' or 'alumni'
        
        // College specific fields
        course: userData.course || null,
        yearOfGraduation: userData.yearOfGraduation || null,
        idCardPhoto: userData.idCardPhoto || null,
        
        // Alumni specific fields
        profession: userData.profession || null,
        yearOfPassedOut: userData.yearOfPassedOut || null,
        
        // Additional fields
        accommodation: userData.accommodation || false,
        dietary: userData.dietary || 'Vegetarian',
        
        // System fields
        uniqueCode: uniqueCode,
        isVerified: false,
        isActive: true,
        verificationToken: null,
        resetToken: null,
        resetTokenExpiry: null,
        
        // Timestamps
        createdAt: new Date(),
        updatedAt: new Date(),
        lastLogin: null
      };

      const result = await db.collection(this.collection).insertOne(user);
      
      // Return user without password
      const { password, ...userWithoutPassword } = user;
      return { ...userWithoutPassword, _id: result.insertedId };
    } catch (error) {
      if (error.code === 11000) {
        if (error.keyPattern.email) {
          throw new Error('Email already exists');
        }
        if (error.keyPattern.uniqueCode) {
          throw new Error('Unique code already exists');
        }
      }
      throw error;
    }
  }

  async findByEmail(email) {
    try {
      const db = mongodb.getDb();
      return await db.collection(this.collection).findOne({ 
        email: email.toLowerCase() 
      });
    } catch (error) {
      throw error;
    }
  }

  async findById(id) {
    try {
      const db = mongodb.getDb();
      return await db.collection(this.collection).findOne({ 
        _id: new ObjectId(id) 
      });
    } catch (error) {
      throw error;
    }
  }

  async findByUniqueCode(uniqueCode) {
    try {
      const db = mongodb.getDb();
      return await db.collection(this.collection).findOne({ uniqueCode });
    } catch (error) {
      throw error;
    }
  }

  async updateVerificationStatus(email, isVerified = true) {
    try {
      const db = mongodb.getDb();
      return await db.collection(this.collection).updateOne(
        { email: email.toLowerCase() },
        { 
          $set: { 
            isVerified,
            verificationToken: null,
            updatedAt: new Date()
          }
        }
      );
    } catch (error) {
      throw error;
    }
  }

  async updateLastLogin(email) {
    try {
      const db = mongodb.getDb();
      return await db.collection(this.collection).updateOne(
        { email: email.toLowerCase() },
        { 
          $set: { 
            lastLogin: new Date(),
            updatedAt: new Date()
          }
        }
      );
    } catch (error) {
      throw error;
    }
  }

  async updateResetToken(email, resetToken, resetTokenExpiry) {
    try {
      const db = mongodb.getDb();
      return await db.collection(this.collection).updateOne(
        { email: email.toLowerCase() },
        { 
          $set: { 
            resetToken,
            resetTokenExpiry,
            updatedAt: new Date()
          }
        }
      );
    } catch (error) {
      throw error;
    }
  }

  async updatePassword(email, newPassword) {
    try {
      const db = mongodb.getDb();
      const hashedPassword = await bcrypt.hash(newPassword, 12);
      
      return await db.collection(this.collection).updateOne(
        { email: email.toLowerCase() },
        { 
          $set: { 
            password: hashedPassword,
            resetToken: null,
            resetTokenExpiry: null,
            updatedAt: new Date()
          }
        }
      );
    } catch (error) {
      throw error;
    }
  }

  async validatePassword(plainPassword, hashedPassword) {
    return await bcrypt.compare(plainPassword, hashedPassword);
  }

  generateUniqueCode() {
    const timestamp = Date.now().toString().slice(-6);
    const random = Math.random().toString(36).substring(2, 6).toUpperCase();
    return `PSG50-${timestamp}${random}`;
  }

  async getAllUsers(page = 1, limit = 10, filters = {}) {
    try {
      const db = mongodb.getDb();
      const skip = (page - 1) * limit;
      
      const query = { isActive: true };
      
      // Add filters
      if (filters.category) {
        query.category = filters.category;
      }
      if (filters.isVerified !== undefined) {
        query.isVerified = filters.isVerified;
      }
      if (filters.search) {
        query.$or = [
          { name: { $regex: filters.search, $options: 'i' } },
          { email: { $regex: filters.search, $options: 'i' } }
        ];
      }

      const users = await db.collection(this.collection)
        .find(query, { projection: { password: 0 } })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .toArray();

      const total = await db.collection(this.collection).countDocuments(query);

      return {
        users,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit)
        }
      };
    } catch (error) {
      throw error;
    }
  }

  async getUserStats() {
    try {
      const db = mongodb.getDb();
      
      const stats = await db.collection(this.collection).aggregate([
        {
          $group: {
            _id: null,
            totalUsers: { $sum: 1 },
            verifiedUsers: { $sum: { $cond: ['$isVerified', 1, 0] } },
            collegeUsers: { $sum: { $cond: [{ $eq: ['$category', 'college'] }, 1, 0] } },
            alumniUsers: { $sum: { $cond: [{ $eq: ['$category', 'alumni'] }, 1, 0] } }
          }
        }
      ]).toArray();

      return stats[0] || {
        totalUsers: 0,
        verifiedUsers: 0,
        collegeUsers: 0,
        alumniUsers: 0
      };
    } catch (error) {
      throw error;
    }
  }
}

module.exports = new User();