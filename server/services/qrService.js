const QRCode = require('qrcode');
const { v4: uuidv4 } = require('uuid');
const AWS = require('aws-sdk');
const pool = require('../config/database');

// Configure AWS S3
const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION
});

class QRService {
  async generateQRCode(registrationId, userId, eventId) {
    try {
      const verificationCode = uuidv4();
      
      const qrData = {
        registration_id: registrationId,
        user_id: userId,
        event_id: eventId,
        verification_code: verificationCode,
        timestamp: new Date().toISOString(),
        type: 'event_entry'
      };
      
      const qrString = JSON.stringify(qrData);
      
      // Generate QR code as buffer
      const qrCodeBuffer = await QRCode.toBuffer(qrString, {
        type: 'png',
        width: 300,
        margin: 2,
        color: {
          dark: '#000000',
          light: '#FFFFFF'
        },
        errorCorrectionLevel: 'M'
      });
      
      // Upload to S3
      const s3Key = `qr-codes/${registrationId}_${Date.now()}.png`;
      const uploadParams = {
        Bucket: process.env.S3_BUCKET_NAME,
        Key: s3Key,
        Body: qrCodeBuffer,
        ContentType: 'image/png',
        ACL: 'public-read'
      };
      
      const uploadResult = await s3.upload(uploadParams).promise();
      const qrCodeUrl = uploadResult.Location;
      
      // Update registration with QR code
      await pool.query(`
        UPDATE event_registrations 
        SET qr_code = $1, verification_code = $2
        WHERE id = $3
      `, [qrCodeUrl, verificationCode, registrationId]);
      
      console.log(`✅ QR code generated for registration ${registrationId}`);
      return qrCodeUrl;
    } catch (error) {
      console.error('❌ QR code generation failed:', error);
      throw new Error('Failed to generate QR code');
    }
  }

  async verifyQRCode(qrData) {
    try {
      const data = JSON.parse(qrData);
      
      // Validate required fields
      if (!data.registration_id || !data.verification_code || !data.user_id || !data.event_id) {
        return { valid: false, message: 'Invalid QR code format' };
      }
      
      // Get registration details
      const result = await pool.query(`
        SELECT 
          er.*,
          u.full_name,
          u.email,
          e.title as event_title,
          e.date_time,
          e.venue
        FROM event_registrations er
        JOIN users u ON er.user_id = u.id
        JOIN events e ON er.event_id = e.id
        WHERE er.id = $1 AND er.verification_code = $2
      `, [data.registration_id, data.verification_code]);
      
      if (result.rows.length === 0) {
        return { valid: false, message: 'Registration not found or invalid QR code' };
      }
      
      const registration = result.rows[0];
      
      // Check payment status
      if (registration.payment_status !== 'completed') {
        return { valid: false, message: 'Payment not completed for this registration' };
      }
      
      // Check if already checked in
      if (registration.attendance_status === 'present') {
        return { 
          valid: false, 
          message: 'Already checked in',
          user: registration.full_name,
          event: registration.event_title,
          check_in_time: registration.updated_at
        };
      }
      
      // Check event date (optional - can be disabled for testing)
      const eventDate = new Date(registration.date_time);
      const now = new Date();
      const timeDiff = Math.abs(eventDate - now) / (1000 * 60 * 60); // hours
      
      if (timeDiff > 24) {
        return { 
          valid: false, 
          message: 'QR code can only be used within 24 hours of event time' 
        };
      }
      
      // Mark as present
      await pool.query(`
        UPDATE event_registrations 
        SET attendance_status = 'present', updated_at = CURRENT_TIMESTAMP
        WHERE id = $1
      `, [data.registration_id]);
      
      return { 
        valid: true,
        message: 'Check-in successful',
        user: {
          name: registration.full_name,
          email: registration.email
        },
        event: {
          title: registration.event_title,
          date_time: registration.date_time,
          venue: registration.venue
        },
        check_in_time: new Date().toISOString()
      };
    } catch (error) {
      console.error('QR verification failed:', error);
      return { valid: false, message: 'Invalid QR code format or system error' };
    }
  }

  async generateBulkQRCodes(registrations) {
    const results = [];
    
    for (const registration of registrations) {
      try {
        const qrUrl = await this.generateQRCode(
          registration.id,
          registration.user_id,
          registration.event_id
        );
        results.push({ registration_id: registration.id, qr_url: qrUrl, success: true });
      } catch (error) {
        results.push({ 
          registration_id: registration.id, 
          error: error.message, 
          success: false 
        });
      }
    }
    
    return results;
  }

  async getQRCodeStats() {
    try {
      const result = await pool.query(`
        SELECT 
          COUNT(*) as total_qr_codes,
          COUNT(CASE WHEN attendance_status = 'present' THEN 1 END) as used_qr_codes,
          COUNT(CASE WHEN attendance_status = 'registered' THEN 1 END) as unused_qr_codes
        FROM event_registrations
        WHERE qr_code IS NOT NULL
      `);
      
      return result.rows[0];
    } catch (error) {
      console.error('Failed to get QR code stats:', error);
      throw error;
    }
  }
}

module.exports = new QRService();