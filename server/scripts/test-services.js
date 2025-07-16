#!/usr/bin/env node

/**
 * Service Configuration Test Script
 * Tests all external service connections and configurations
 */

require('dotenv').config();
const pool = require('../config/database');
const emailService = require('../services/emailService');
const paymentService = require('../services/paymentService');

const colors = {
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  reset: '\x1b[0m'
};

const log = (color, message) => console.log(`${colors[color]}${message}${colors.reset}`);

async function testDatabase() {
  log('blue', '\n🗄️  Testing Database Connection...');
  try {
    const result = await pool.query('SELECT NOW() as current_time, version() as version');
    log('green', '✅ Database connected successfully');
    log('yellow', `   Time: ${result.rows[0].current_time}`);
    log('yellow', `   Version: ${result.rows[0].version.split(' ')[0]} ${result.rows[0].version.split(' ')[1]}`);
    return true;
  } catch (error) {
    log('red', '❌ Database connection failed');
    log('red', `   Error: ${error.message}`);
    log('yellow', '   💡 Check your DATABASE_URL in .env file');
    return false;
  }
}

async function testEmail() {
  log('blue', '\n📧 Testing Email Service...');
  
  if (!process.env.SENDGRID_API_KEY) {
    log('red', '❌ SendGrid API key not configured');
    log('yellow', '   💡 Set SENDGRID_API_KEY in .env file');
    return false;
  }

  if (!process.env.FROM_EMAIL) {
    log('red', '❌ From email not configured');
    log('yellow', '   💡 Set FROM_EMAIL in .env file');
    return false;
  }

  try {
    // Test email configuration (don't actually send)
    log('green', '✅ Email service configured');
    log('yellow', `   Provider: SendGrid`);
    log('yellow', `   From Email: ${process.env.FROM_EMAIL}`);
    log('yellow', `   API Key: ${process.env.SENDGRID_API_KEY.substring(0, 10)}...`);
    
    // Uncomment to test actual email sending
    // await emailService.sendEmail('test@example.com', 'verification', {
    //   name: 'Test User',
    //   verification_link: 'http://localhost:3000/verify-test'
    // });
    // log('green', '✅ Test email sent successfully');
    
    return true;
  } catch (error) {
    log('red', '❌ Email service test failed');
    log('red', `   Error: ${error.message}`);
    return false;
  }
}

async function testPayment() {
  log('blue', '\n💳 Testing Payment Service...');
  
  if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
    log('red', '❌ Razorpay credentials not configured');
    log('yellow', '   💡 Set RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET in .env file');
    return false;
  }

  try {
    const testOrder = await paymentService.createOrder(1, [{
      type: 'event',
      item_id: 1,
      amount: 100
    }]);
    
    log('green', '✅ Payment service configured');
    log('yellow', `   Provider: Razorpay`);
    log('yellow', `   Key ID: ${process.env.RAZORPAY_KEY_ID}`);
    log('yellow', `   Test Order: ${testOrder.order_id}`);
    return true;
  } catch (error) {
    log('red', '❌ Payment service test failed');
    log('red', `   Error: ${error.message}`);
    return false;
  }
}

async function testAWS() {
  log('blue', '\n☁️  Testing AWS S3 Configuration...');
  
  const requiredVars = ['AWS_ACCESS_KEY_ID', 'AWS_SECRET_ACCESS_KEY', 'AWS_REGION', 'S3_BUCKET_NAME'];
  const missing = requiredVars.filter(key => !process.env[key]);
  
  if (missing.length > 0) {
    log('red', '❌ AWS credentials incomplete');
    log('yellow', `   💡 Missing: ${missing.join(', ')}`);
    return false;
  }

  try {
    const AWS = require('aws-sdk');
    const s3 = new AWS.S3({
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
      region: process.env.AWS_REGION
    });

    // Test bucket access
    await s3.headBucket({ Bucket: process.env.S3_BUCKET_NAME }).promise();
    
    log('green', '✅ AWS S3 configured');
    log('yellow', `   Region: ${process.env.AWS_REGION}`);
    log('yellow', `   Bucket: ${process.env.S3_BUCKET_NAME}`);
    log('yellow', `   Access Key: ${process.env.AWS_ACCESS_KEY_ID.substring(0, 8)}...`);
    return true;
  } catch (error) {
    log('red', '❌ AWS S3 test failed');
    log('red', `   Error: ${error.message}`);
    log('yellow', '   💡 Check AWS credentials and bucket permissions');
    return false;
  }
}

async function testJWT() {
  log('blue', '\n🔐 Testing JWT Configuration...');
  
  if (!process.env.JWT_SECRET) {
    log('red', '❌ JWT secret not configured');
    log('yellow', '   💡 Set JWT_SECRET in .env file');
    log('yellow', '   💡 Generate with: node -e "console.log(require(\'crypto\').randomBytes(64).toString(\'hex\'))"');
    return false;
  }

  if (process.env.JWT_SECRET.length < 32) {
    log('red', '❌ JWT secret too short (minimum 32 characters)');
    return false;
  }

  try {
    const jwt = require('jsonwebtoken');
    const testPayload = { userId: 1, email: 'test@example.com' };
    const token = jwt.sign(testPayload, process.env.JWT_SECRET, { expiresIn: '1h' });
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    log('green', '✅ JWT configuration valid');
    log('yellow', `   Secret Length: ${process.env.JWT_SECRET.length} characters`);
    log('yellow', `   Expires In: ${process.env.JWT_EXPIRES_IN || '7d'}`);
    return true;
  } catch (error) {
    log('red', '❌ JWT test failed');
    log('red', `   Error: ${error.message}`);
    return false;
  }
}

async function testEnvironment() {
  log('blue', '\n🌍 Testing Environment Configuration...');
  
  const requiredVars = [
    'NODE_ENV',
    'PORT',
    'FRONTEND_URL',
    'DATABASE_URL',
    'JWT_SECRET'
  ];

  const missing = requiredVars.filter(key => !process.env[key]);
  
  if (missing.length > 0) {
    log('red', '❌ Required environment variables missing');
    log('yellow', `   💡 Missing: ${missing.join(', ')}`);
    return false;
  }

  log('green', '✅ Environment variables configured');
  log('yellow', `   Environment: ${process.env.NODE_ENV}`);
  log('yellow', `   Port: ${process.env.PORT}`);
  log('yellow', `   Frontend URL: ${process.env.FRONTEND_URL}`);
  
  return true;
}

async function generateSampleEnv() {
  log('blue', '\n📝 Generating sample .env file...');
  
  const fs = require('fs');
  const crypto = require('crypto');
  
  const sampleEnv = `# Server Configuration
PORT=5000
NODE_ENV=development
FRONTEND_URL=http://localhost:3000

# Database Configuration
DATABASE_URL=postgresql://username:password@localhost:5432/production50
REDIS_URL=redis://localhost:6379

# JWT Configuration
JWT_SECRET=${crypto.randomBytes(64).toString('hex')}
JWT_EXPIRES_IN=7d

# Email Configuration (SendGrid)
SENDGRID_API_KEY=SG.your_sendgrid_api_key_here
FROM_EMAIL=noreply@production50.com

# Payment Gateway (Razorpay)
RAZORPAY_KEY_ID=rzp_test_xxxxxxxxxx
RAZORPAY_KEY_SECRET=your_razorpay_secret_key

# AWS S3 Configuration
AWS_ACCESS_KEY_ID=AKIAXXXXXXXXXX
AWS_SECRET_ACCESS_KEY=your_aws_secret_access_key
AWS_REGION=us-east-1
S3_BUCKET_NAME=production50-files

# Push Notifications (Optional)
VAPID_PUBLIC_KEY=your_vapid_public_key
VAPID_PRIVATE_KEY=your_vapid_private_key

# Admin Configuration
ADMIN_EMAIL=admin@production50.com
ADMIN_PASSWORD=SecureAdminPassword123!
`;

  try {
    if (!fs.existsSync('.env')) {
      fs.writeFileSync('.env', sampleEnv);
      log('green', '✅ Sample .env file created');
      log('yellow', '   💡 Please update the values with your actual credentials');
    } else {
      log('yellow', '⚠️  .env file already exists, skipping generation');
    }
    return true;
  } catch (error) {
    log('red', '❌ Failed to create .env file');
    log('red', `   Error: ${error.message}`);
    return false;
  }
}

async function runAllTests() {
  log('blue', '🚀 Production-50 Backend Service Configuration Test');
  log('blue', '================================================');
  
  const results = {
    environment: await testEnvironment(),
    database: await testDatabase(),
    jwt: await testJWT(),
    email: await testEmail(),
    payment: await testPayment(),
    aws: await testAWS()
  };
  
  const passed = Object.values(results).filter(Boolean).length;
  const total = Object.keys(results).length;
  
  log('blue', '\n📊 Test Results Summary:');
  log('blue', '========================');
  
  Object.entries(results).forEach(([service, passed]) => {
    const status = passed ? '✅ PASS' : '❌ FAIL';
    const color = passed ? 'green' : 'red';
    log(color, `${status} ${service.toUpperCase()}`);
  });
  
  log('blue', `\n🎯 Overall: ${passed}/${total} services configured correctly`);
  
  if (passed === total) {
    log('green', '\n🎉 All services configured! Ready to start the server.');
    log('yellow', '   Run: npm run dev');
  } else {
    log('red', '\n⚠️  Some services need configuration. Check the errors above.');
    log('yellow', '   💡 Refer to server/docs/SETUP_GUIDE.md for detailed instructions');
  }
  
  process.exit(passed === total ? 0 : 1);
}

// Handle command line arguments
const args = process.argv.slice(2);

if (args.includes('--generate-env')) {
  generateSampleEnv().then(() => process.exit(0));
} else if (args.includes('--help')) {
  console.log(`
🚀 Production-50 Service Configuration Test

Usage:
  node test-services.js              Run all service tests
  node test-services.js --generate-env    Generate sample .env file
  node test-services.js --help            Show this help message

Tests:
  - Environment variables
  - Database connection (PostgreSQL)
  - JWT configuration
  - Email service (SendGrid)
  - Payment service (Razorpay)
  - File storage (AWS S3)
`);
  process.exit(0);
} else {
  runAllTests();
}