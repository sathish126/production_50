const sgMail = require('@sendgrid/mail');
const fs = require('fs').promises;
const path = require('path');

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

class EmailService {
  constructor() {
    this.templates = {
      verification: {
        subject: '🚀 Verify Your Email - Production-50',
        template: 'verification-email.html'
      },
      welcome: {
        subject: '🌟 Welcome to Production-50!',
        template: 'welcome-email.html'
      },
      paymentConfirmation: {
        subject: '✅ Payment Confirmation - Production-50',
        template: 'payment-confirmation.html'
      },
      eventReminder: {
        subject: '⏰ Event Reminder - Production-50',
        template: 'event-reminder.html'
      },
      passwordReset: {
        subject: '🔐 Password Reset - Production-50',
        template: 'password-reset.html'
      }
    };
  }

  async loadTemplate(templateName, data) {
    try {
      const templatePath = path.join(__dirname, '../templates', templateName);
      let html = await fs.readFile(templatePath, 'utf8');
      
      // Replace placeholders with actual data
      Object.keys(data).forEach(key => {
        const placeholder = new RegExp(`{{${key}}}`, 'g');
        html = html.replace(placeholder, data[key] || '');
      });
      
      return html;
    } catch (error) {
      console.error('Template loading failed:', error);
      throw new Error('Email template not found');
    }
  }

  async sendEmail(to, templateType, data) {
    try {
      const template = this.templates[templateType];
      if (!template) {
        throw new Error('Email template not found');
      }

      const html = await this.loadTemplate(template.template, {
        ...data,
        current_year: new Date().getFullYear(),
        frontend_url: process.env.FRONTEND_URL
      });
      
      const msg = {
        to: to,
        from: {
          email: process.env.FROM_EMAIL,
          name: 'Production-50 Team'
        },
        subject: template.subject,
        html: html
      };
      
      await sgMail.send(msg);
      console.log(`✅ Email sent to ${to}: ${template.subject}`);
      return true;
    } catch (error) {
      console.error('❌ Email sending failed:', error);
      throw error;
    }
  }

  async sendVerificationEmail(user) {
    return this.sendEmail(user.email, 'verification', {
      name: user.full_name,
      verification_link: `${process.env.FRONTEND_URL}/verify-email?token=${user.verification_token}`
    });
  }

  async sendOTPEmail(email, otp) {
    const msg = {
      to: email,
      from: {
        email: process.env.FROM_EMAIL,
        name: 'Production-50 Team'
      },
      subject: '🔐 Your OTP for Production-50 Verification',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background: linear-gradient(135deg, #0B0B1A 0%, #1A0B2E 50%, #0F0F23 100%); color: white; border-radius: 16px;">
          <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="color: #A855F7; font-size: 32px; margin-bottom: 10px;">Production-50</h1>
            <p style="color: #C084FC; font-size: 16px;">Email Verification</p>
          </div>
          
          <div style="background: rgba(255, 255, 255, 0.1); padding: 30px; border-radius: 12px; text-align: center;">
            <h2 style="color: white; margin-bottom: 20px;">Your Verification Code</h2>
            <div style="background: linear-gradient(45deg, #A855F7, #00D4FF); padding: 20px; border-radius: 12px; margin: 20px 0;">
              <span style="font-size: 36px; font-weight: bold; letter-spacing: 8px; color: white;">${otp}</span>
            </div>
            <p style="color: #C084FC; margin-bottom: 10px;">This code will expire in 10 minutes</p>
            <p style="color: #888; font-size: 14px;">If you didn't request this code, please ignore this email.</p>
          </div>
          
          <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid rgba(255, 255, 255, 0.2); color: #888; font-size: 14px;">
            <p>© ${new Date().getFullYear()} Production-50 | PSG College of Technology</p>
          </div>
        </div>
      `
    };
    
    await sgMail.send(msg);
    console.log(`✅ OTP email sent to ${email}`);
    return true;
  }

  async sendWelcomeEmail(user) {
    return this.sendEmail(user.email, 'welcome', {
      name: user.full_name,
      event_date: 'August 20, 2025',
      login_link: `${process.env.FRONTEND_URL}/login`,
      dashboard_link: `${process.env.FRONTEND_URL}/dashboard`
    });
  }

  async sendPaymentConfirmation(user, payment, registrations) {
    const eventsList = registrations.map(r => `
      <li>
        <strong>${r.event.title}</strong><br>
        Date: ${new Date(r.event.date_time).toLocaleDateString()}<br>
        Venue: ${r.event.venue}<br>
        Amount: ₹${r.amount_paid}
      </li>
    `).join('');

    return this.sendEmail(user.email, 'paymentConfirmation', {
      name: user.full_name,
      amount: payment.amount,
      order_id: payment.order_id,
      payment_date: new Date().toLocaleDateString(),
      events_list: eventsList,
      dashboard_link: `${process.env.FRONTEND_URL}/dashboard`
    });
  }

  async sendEventReminder(user, event, registration) {
    return this.sendEmail(user.email, 'eventReminder', {
      name: user.full_name,
      event_title: event.title,
      event_date: new Date(event.date_time).toLocaleDateString(),
      event_time: new Date(event.date_time).toLocaleTimeString(),
      event_venue: event.venue,
      qr_code_url: registration.qr_code
    });
  }

  async sendPasswordReset(user, resetToken) {
    return this.sendEmail(user.email, 'passwordReset', {
      name: user.full_name,
      reset_link: `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`,
      expiry_time: '1 hour'
    });
  }

  async sendBulkEmail(recipients, templateType, data) {
    const promises = recipients.map(recipient => 
      this.sendEmail(recipient.email, templateType, {
        ...data,
        name: recipient.full_name
      })
    );
    
    try {
      await Promise.all(promises);
      console.log(`✅ Bulk email sent to ${recipients.length} recipients`);
    } catch (error) {
      console.error('❌ Bulk email sending failed:', error);
      throw error;
    }
  }
}

module.exports = new EmailService();