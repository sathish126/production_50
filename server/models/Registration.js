const mongodb = require('../config/mongodb');
const { ObjectId } = require('mongodb');

class Registration {
  constructor() {
    this.collection = 'registrations';
  }

  async create(registrationData) {
    try {
      const db = mongodb.getDb();
      
      const registration = {
        userId: new ObjectId(registrationData.userId),
        eventId: new ObjectId(registrationData.eventId),
        paymentStatus: 'pending', // 'pending', 'completed', 'failed', 'refunded'
        paymentId: null,
        amountPaid: registrationData.amountPaid,
        registrationDate: new Date(),
        qrCode: null,
        verificationCode: null,
        attendanceStatus: 'registered', // 'registered', 'present', 'absent'
        dietaryPreferences: registrationData.dietaryPreferences || null,
        createdAt: new Date(),
        updatedAt: new Date()
      };

      const result = await db.collection(this.collection).insertOne(registration);
      return { ...registration, _id: result.insertedId };
    } catch (error) {
      if (error.code === 11000) {
        throw new Error('User already registered for this event');
      }
      throw error;
    }
  }

  async findByUserAndEvent(userId, eventId) {
    try {
      const db = mongodb.getDb();
      return await db.collection(this.collection).findOne({
        userId: new ObjectId(userId),
        eventId: new ObjectId(eventId)
      });
    } catch (error) {
      throw error;
    }
  }

  async findByUser(userId, page = 1, limit = 10) {
    try {
      const db = mongodb.getDb();
      const skip = (page - 1) * limit;

      const registrations = await db.collection(this.collection).aggregate([
        { $match: { userId: new ObjectId(userId) } },
        {
          $lookup: {
            from: 'events',
            localField: 'eventId',
            foreignField: '_id',
            as: 'event'
          }
        },
        { $unwind: '$event' },
        { $sort: { registrationDate: -1 } },
        { $skip: skip },
        { $limit: limit }
      ]).toArray();

      const total = await db.collection(this.collection).countDocuments({
        userId: new ObjectId(userId)
      });

      return {
        registrations,
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

  async findByEvent(eventId, page = 1, limit = 10) {
    try {
      const db = mongodb.getDb();
      const skip = (page - 1) * limit;

      const registrations = await db.collection(this.collection).aggregate([
        { $match: { eventId: new ObjectId(eventId) } },
        {
          $lookup: {
            from: 'users',
            localField: 'userId',
            foreignField: '_id',
            as: 'user',
            pipeline: [
              { $project: { password: 0, resetToken: 0, verificationToken: 0 } }
            ]
          }
        },
        { $unwind: '$user' },
        { $sort: { registrationDate: -1 } },
        { $skip: skip },
        { $limit: limit }
      ]).toArray();

      const total = await db.collection(this.collection).countDocuments({
        eventId: new ObjectId(eventId)
      });

      return {
        registrations,
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

  async updatePaymentStatus(registrationId, paymentStatus, paymentId = null) {
    try {
      const db = mongodb.getDb();
      
      const updateData = {
        paymentStatus,
        updatedAt: new Date()
      };

      if (paymentId) {
        updateData.paymentId = paymentId;
      }

      return await db.collection(this.collection).updateOne(
        { _id: new ObjectId(registrationId) },
        { $set: updateData }
      );
    } catch (error) {
      throw error;
    }
  }

  async updateQRCode(registrationId, qrCode, verificationCode) {
    try {
      const db = mongodb.getDb();
      return await db.collection(this.collection).updateOne(
        { _id: new ObjectId(registrationId) },
        { 
          $set: { 
            qrCode,
            verificationCode,
            updatedAt: new Date()
          }
        }
      );
    } catch (error) {
      throw error;
    }
  }

  async updateAttendance(registrationId, attendanceStatus) {
    try {
      const db = mongodb.getDb();
      return await db.collection(this.collection).updateOne(
        { _id: new ObjectId(registrationId) },
        { 
          $set: { 
            attendanceStatus,
            updatedAt: new Date()
          }
        }
      );
    } catch (error) {
      throw error;
    }
  }

  async getRegistrationStats() {
    try {
      const db = mongodb.getDb();
      
      const stats = await db.collection(this.collection).aggregate([
        {
          $group: {
            _id: null,
            totalRegistrations: { $sum: 1 },
            completedPayments: { $sum: { $cond: [{ $eq: ['$paymentStatus', 'completed'] }, 1, 0] } },
            pendingPayments: { $sum: { $cond: [{ $eq: ['$paymentStatus', 'pending'] }, 1, 0] } },
            totalRevenue: { 
              $sum: { 
                $cond: [
                  { $eq: ['$paymentStatus', 'completed'] }, 
                  '$amountPaid', 
                  0
                ] 
              }
            }
          }
        }
      ]).toArray();

      const attendanceStats = await db.collection(this.collection).aggregate([
        {
          $group: {
            _id: '$attendanceStatus',
            count: { $sum: 1 }
          }
        }
      ]).toArray();

      return {
        overall: stats[0] || {
          totalRegistrations: 0,
          completedPayments: 0,
          pendingPayments: 0,
          totalRevenue: 0
        },
        attendance: attendanceStats.reduce((acc, item) => {
          acc[item._id] = item.count;
          return acc;
        }, {})
      };
    } catch (error) {
      throw error;
    }
  }

  async delete(registrationId) {
    try {
      const db = mongodb.getDb();
      return await db.collection(this.collection).deleteOne({
        _id: new ObjectId(registrationId)
      });
    } catch (error) {
      throw error;
    }
  }

  async findById(registrationId) {
    try {
      const db = mongodb.getDb();
      return await db.collection(this.collection).findOne({
        _id: new ObjectId(registrationId)
      });
    } catch (error) {
      throw error;
    }
  }
}

module.exports = new Registration();