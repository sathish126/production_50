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