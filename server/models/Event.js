const mongodb = require('../config/mongodb');
const { ObjectId } = require('mongodb');

class Event {
  constructor() {
    this.collection = 'events';
  }

  async create(eventData) {
    try {
      const db = mongodb.getDb();
      
      const event = {
        title: eventData.title,
        description: eventData.description,
        eventType: eventData.eventType, // 'Workshop', 'Competition', 'Lecture', 'Cultural', 'Exhibition'
        dateTime: new Date(eventData.dateTime),
        venue: eventData.venue,
        maxParticipants: eventData.maxParticipants || 100,
        currentParticipants: 0,
        registrationFee: eventData.registrationFee || 0,
        imageUrl: eventData.imageUrl || null,
        prerequisites: eventData.prerequisites || null,
        instructorName: eventData.instructorName || null,
        instructorBio: eventData.instructorBio || null,
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date()
      };

      const result = await db.collection(this.collection).insertOne(event);
      return { ...event, _id: result.insertedId };
    } catch (error) {
      throw error;
    }
  }

  async findAll(filters = {}) {
    try {
      const db = mongodb.getDb();
      
      const query = { isActive: true };
      
      if (filters.eventType) {
        query.eventType = filters.eventType;
      }
      
      if (filters.date) {
        const startDate = new Date(filters.date);
        const endDate = new Date(startDate);
        endDate.setDate(endDate.getDate() + 1);
        
        query.dateTime = {
          $gte: startDate,
          $lt: endDate
        };
      }
      
      if (filters.availableOnly) {
        query.$expr = { $lt: ['$currentParticipants', '$maxParticipants'] };
      }

      return await db.collection(this.collection)
        .find(query)
        .sort({ dateTime: 1 })
        .toArray();
    } catch (error) {
      throw error;
    }
  }

  async findById(id) {
    try {
      const db = mongodb.getDb();
      return await db.collection(this.collection).findOne({ 
        _id: new ObjectId(id),
        isActive: true
      });
    } catch (error) {
      throw error;
    }
  }

  async updateParticipantCount(eventId, increment = 1) {
    try {
      const db = mongodb.getDb();
      return await db.collection(this.collection).updateOne(
        { _id: new ObjectId(eventId) },
        { 
          $inc: { currentParticipants: increment },
          $set: { updatedAt: new Date() }
        }
      );
    } catch (error) {
      throw error;
    }
  }

  async getEventStats() {
    try {
      const db = mongodb.getDb();
      
      const stats = await db.collection(this.collection).aggregate([
        { $match: { isActive: true } },
        {
          $group: {
            _id: null,
            totalEvents: { $sum: 1 },
            totalParticipants: { $sum: '$currentParticipants' },
            totalRevenue: { $sum: { $multiply: ['$currentParticipants', '$registrationFee'] } },
            avgParticipants: { $avg: '$currentParticipants' }
          }
        }
      ]).toArray();

      const typeStats = await db.collection(this.collection).aggregate([
        { $match: { isActive: true } },
        {
          $group: {
            _id: '$eventType',
            count: { $sum: 1 },
            participants: { $sum: '$currentParticipants' }
          }
        }
      ]).toArray();

      return {
        overall: stats[0] || {
          totalEvents: 0,
          totalParticipants: 0,
          totalRevenue: 0,
          avgParticipants: 0
        },
        byType: typeStats
      };
    } catch (error) {
      throw error;
    }
  }

  async update(id, updateData) {
    try {
      const db = mongodb.getDb();
      
      const updateFields = { ...updateData };
      delete updateFields._id;
      updateFields.updatedAt = new Date();

      return await db.collection(this.collection).updateOne(
        { _id: new ObjectId(id) },
        { $set: updateFields }
      );
    } catch (error) {
      throw error;
    }
  }

  async delete(id) {
    try {
      const db = mongodb.getDb();
      return await db.collection(this.collection).updateOne(
        { _id: new ObjectId(id) },
        { 
          $set: { 
            isActive: false,
            updatedAt: new Date()
          }
        }
      );
    } catch (error) {
      throw error;
    }
  }
}

module.exports = new Event();