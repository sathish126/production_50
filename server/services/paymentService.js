const Razorpay = require('razorpay');
const crypto = require('crypto');
const pool = require('../config/database');
const emailService = require('./emailService');
const qrService = require('./qrService');

class PaymentService {
  constructor() {
    this.razorpay = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET
    });
  }

  async createOrder(userId, items) {
    try {
      const totalAmount = items.reduce((sum, item) => sum + parseFloat(item.amount), 0);
      const orderId = `order_${Date.now()}_${userId}`;
      
      // Create payment record in database
      const paymentResult = await pool.query(`
        INSERT INTO payments (user_id, order_id, amount, status)
        VALUES ($1, $2, $3, 'pending')
        RETURNING id, order_id, amount
      `, [userId, orderId, totalAmount]);
      
      const payment = paymentResult.rows[0];
      
      // Create Razorpay order
      const razorpayOrder = await this.razorpay.orders.create({
        amount: Math.round(totalAmount * 100), // Convert to paise
        currency: 'INR',
        receipt: orderId,
        payment_capture: 1
      });
      
      // Update payment with Razorpay order ID
      await pool.query(`
        UPDATE payments 
        SET order_id = $1, gateway_response = $2
        WHERE id = $3
      `, [razorpayOrder.id, JSON.stringify(razorpayOrder), payment.id]);
      
      return {
        order_id: razorpayOrder.id,
        amount: totalAmount,
        currency: 'INR',
        key: process.env.RAZORPAY_KEY_ID
      };
    } catch (error) {
      console.error('Payment order creation failed:', error);
      throw new Error('Failed to create payment order');
    }
  }

  async verifyPayment(orderId, paymentId, signature) {
    try {
      // Verify signature
      const hmac = crypto.createHmac('sha256', process.env.RAZORPAY_KEY_SECRET);
      hmac.update(orderId + '|' + paymentId);
      const generatedSignature = hmac.digest('hex');
      
      if (generatedSignature !== signature) {
        throw new Error('Invalid payment signature');
      }
      
      // Update payment status
      const paymentResult = await pool.query(`
        UPDATE payments 
        SET payment_id = $1, status = 'completed', updated_at = CURRENT_TIMESTAMP
        WHERE order_id = $2
        RETURNING id, user_id, amount
      `, [paymentId, orderId]);
      
      if (paymentResult.rows.length === 0) {
        throw new Error('Payment record not found');
      }
      
      const payment = paymentResult.rows[0];
      
      // Update event registrations
      await pool.query(`
        UPDATE event_registrations 
        SET payment_status = 'completed', payment_id = $1
        WHERE user_id = $2 AND payment_status = 'pending'
      `, [paymentId, payment.user_id]);
      
      // Generate QR codes for registrations
      const registrations = await pool.query(`
        SELECT er.id, er.user_id, er.event_id, e.title, e.date_time, e.venue
        FROM event_registrations er
        JOIN events e ON er.event_id = e.id
        WHERE er.user_id = $1 AND er.payment_id = $2
      `, [payment.user_id, paymentId]);
      
      for (const registration of registrations.rows) {
        await qrService.generateQRCode(
          registration.id,
          registration.user_id,
          registration.event_id
        );
      }
      
      // Send confirmation email
      const userResult = await pool.query(
        'SELECT full_name, email FROM users WHERE id = $1',
        [payment.user_id]
      );
      
      if (userResult.rows.length > 0) {
        const user = userResult.rows[0];
        await emailService.sendPaymentConfirmation(
          user,
          { order_id: orderId, amount: payment.amount },
          registrations.rows
        );
      }
      
      return {
        success: true,
        message: 'Payment verified successfully',
        payment_id: paymentId
      };
    } catch (error) {
      console.error('Payment verification failed:', error);
      
      // Update payment status to failed
      await pool.query(`
        UPDATE payments 
        SET status = 'failed', updated_at = CURRENT_TIMESTAMP
        WHERE order_id = $1
      `, [orderId]);
      
      throw error;
    }
  }

  async handleWebhook(event) {
    try {
      switch (event.event) {
        case 'payment.captured':
          await this.handlePaymentCaptured(event.payload.payment.entity);
          break;
        case 'payment.failed':
          await this.handlePaymentFailed(event.payload.payment.entity);
          break;
        default:
          console.log('Unhandled webhook event:', event.event);
      }
    } catch (error) {
      console.error('Webhook handling failed:', error);
      throw error;
    }
  }

  async handlePaymentCaptured(payment) {
    await pool.query(`
      UPDATE payments 
      SET status = 'completed', payment_id = $1, updated_at = CURRENT_TIMESTAMP
      WHERE order_id = $2
    `, [payment.id, payment.order_id]);
  }

  async handlePaymentFailed(payment) {
    await pool.query(`
      UPDATE payments 
      SET status = 'failed', updated_at = CURRENT_TIMESTAMP
      WHERE order_id = $1
    `, [payment.order_id]);
  }

  async getPaymentStatus(orderId) {
    try {
      const result = await pool.query(`
        SELECT p.*, u.full_name, u.email
        FROM payments p
        JOIN users u ON p.user_id = u.id
        WHERE p.order_id = $1
      `, [orderId]);
      
      return result.rows[0] || null;
    } catch (error) {
      console.error('Failed to get payment status:', error);
      throw error;
    }
  }

  async refundPayment(paymentId, amount = null) {
    try {
      const payment = await this.razorpay.payments.refund(paymentId, {
        amount: amount ? Math.round(amount * 100) : undefined
      });
      
      // Update payment status
      await pool.query(`
        UPDATE payments 
        SET status = 'refunded', updated_at = CURRENT_TIMESTAMP
        WHERE payment_id = $1
      `, [paymentId]);
      
      return payment;
    } catch (error) {
      console.error('Refund failed:', error);
      throw error;
    }
  }
}

module.exports = new PaymentService();