const express = require('express');
const pool = require('../config/database');
const { authenticateToken, requireVerified } = require('../middleware/auth');
const { validateEventRegistration } = require('../middleware/validation');
const paymentService = require('../services/paymentService');

const router = express.Router();

// Get all events
router.get('/', async (req, res) => {
  try {
    const { type, date, available_only } = req.query;
    
    let query = `
      SELECT 
        id, title, description, event_type, date_time, venue,
        max_participants, current_participants, registration_fee,
        image_url, prerequisites, instructor_name, instructor_bio,
        is_active,
        (current_participants >= max_participants) as is_full
      FROM events 
      WHERE is_active = true
    `;
    
    const params = [];
    let paramCount = 0;
    
    if (type) {
      paramCount++;
      query += ` AND event_type = $${paramCount}`;
      params.push(type);
    }
    
    if (date) {
      paramCount++;
      query += ` AND DATE(date_time) = $${paramCount}`;
      params.push(date);
    }
    
    if (available_only === 'true') {
      query += ` AND current_participants < max_participants`;
    }
    
    query += ` ORDER BY date_time ASC`;
    
    const result = await pool.query(query, params);
    
    res.json({
      success: true,
      events: result.rows
    });
  } catch (error) {
    console.error('Get events error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch events'
    });
  }
});

// Get single event
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const result = await pool.query(`
      SELECT 
        id, title, description, event_type, date_time, venue,
        max_participants, current_participants, registration_fee,
        image_url, prerequisites, instructor_name, instructor_bio,
        is_active,
        (current_participants >= max_participants) as is_full
      FROM events 
      WHERE id = $1 AND is_active = true
    `, [id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Event not found'
      });
    }
    
    res.json({
      success: true,
      event: result.rows[0]
    });
  } catch (error) {
    console.error('Get event error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch event'
    });
  }
});

// Register for event
router.post('/register', authenticateToken, requireVerified, validateEventRegistration, async (req, res) => {
  try {
    const { event_id, dietary_preferences } = req.body;
    const userId = req.user.id;
    
    // Check if event exists and is available
    const eventResult = await pool.query(`
      SELECT id, title, registration_fee, max_participants, current_participants
      FROM events 
      WHERE id = $1 AND is_active = true
    `, [event_id]);
    
    if (eventResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Event not found'
      });
    }
    
    const event = eventResult.rows[0];
    
    // Check if event is full
    if (event.current_participants >= event.max_participants) {
      return res.status(400).json({
        success: false,
        message: 'Event is full'
      });
    }
    
    // Check if user already registered
    const existingRegistration = await pool.query(
      'SELECT id FROM event_registrations WHERE user_id = $1 AND event_id = $2',
      [userId, event_id]
    );
    
    if (existingRegistration.rows.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'Already registered for this event'
      });
    }
    
    // Create registration
    const registrationResult = await pool.query(`
      INSERT INTO event_registrations (user_id, event_id, amount_paid, dietary_preferences)
      VALUES ($1, $2, $3, $4)
      RETURNING id
    `, [userId, event_id, event.registration_fee, dietary_preferences]);
    
    const registrationId = registrationResult.rows[0].id;
    
    // Update participant count
    await pool.query(
      'UPDATE events SET current_participants = current_participants + 1 WHERE id = $1',
      [event_id]
    );
    
    // Create payment order if fee > 0
    let paymentOrder = null;
    if (event.registration_fee > 0) {
      paymentOrder = await paymentService.createOrder(userId, [{
        type: 'event',
        item_id: event_id,
        amount: event.registration_fee
      }]);
    } else {
      // Free event - mark as completed
      await pool.query(
        'UPDATE event_registrations SET payment_status = $1 WHERE id = $2',
        ['completed', registrationId]
      );
    }
    
    res.status(201).json({
      success: true,
      message: 'Registration successful',
      registration_id: registrationId,
      payment_required: event.registration_fee > 0,
      amount: event.registration_fee,
      payment_order: paymentOrder
    });
  } catch (error) {
    console.error('Event registration error:', error);
    res.status(500).json({
      success: false,
      message: 'Registration failed'
    });
  }
});

// Get user's registrations
router.get('/user/registrations', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    
    const result = await pool.query(`
      SELECT 
        er.id,
        er.payment_status,
        er.amount_paid,
        er.registration_date,
        er.qr_code,
        er.attendance_status,
        e.title,
        e.description,
        e.event_type,
        e.date_time,
        e.venue,
        e.image_url
      FROM event_registrations er
      JOIN events e ON er.event_id = e.id
      WHERE er.user_id = $1
      ORDER BY er.registration_date DESC
    `, [userId]);
    
    res.json({
      success: true,
      registrations: result.rows
    });
  } catch (error) {
    console.error('Get user registrations error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch registrations'
    });
  }
});

// Cancel registration
router.delete('/registration/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    
    // Get registration details
    const registrationResult = await pool.query(`
      SELECT er.*, e.date_time, e.title
      FROM event_registrations er
      JOIN events e ON er.event_id = e.id
      WHERE er.id = $1 AND er.user_id = $2
    `, [id, userId]);
    
    if (registrationResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Registration not found'
      });
    }
    
    const registration = registrationResult.rows[0];
    
    // Check if event is within 24 hours
    const eventDate = new Date(registration.date_time);
    const now = new Date();
    const hoursUntilEvent = (eventDate - now) / (1000 * 60 * 60);
    
    if (hoursUntilEvent < 24) {
      return res.status(400).json({
        success: false,
        message: 'Cannot cancel registration within 24 hours of event'
      });
    }
    
    // Delete registration
    await pool.query('DELETE FROM event_registrations WHERE id = $1', [id]);
    
    // Update participant count
    await pool.query(
      'UPDATE events SET current_participants = current_participants - 1 WHERE id = $1',
      [registration.event_id]
    );
    
    // Process refund if payment was completed
    if (registration.payment_status === 'completed' && registration.payment_id) {
      try {
        await paymentService.refundPayment(registration.payment_id, registration.amount_paid * 0.8); // 80% refund
      } catch (refundError) {
        console.error('Refund failed:', refundError);
        // Continue with cancellation even if refund fails
      }
    }
    
    res.json({
      success: true,
      message: 'Registration cancelled successfully'
    });
  } catch (error) {
    console.error('Cancel registration error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to cancel registration'
    });
  }
});

module.exports = router;