# 🚀 Production-50 Backend Configuration Guide

## 📋 Prerequisites

Before starting, make sure you have:
- Node.js 16+ installed
- PostgreSQL 12+ installed
- Redis server (optional, for caching)
- Git for version control

---

## 🗄️ 1. Database Configuration (PostgreSQL)

### **Option A: Local PostgreSQL Setup**

1. **Install PostgreSQL:**
   ```bash
   # Ubuntu/Debian
   sudo apt update
   sudo apt install postgresql postgresql-contrib
   
   # macOS (using Homebrew)
   brew install postgresql
   brew services start postgresql
   
   # Windows
   # Download from: https://www.postgresql.org/download/windows/
   ```

2. **Create Database and User:**
   ```bash
   # Connect to PostgreSQL
   sudo -u postgres psql
   
   # Create database
   CREATE DATABASE production50;
   
   # Create user with password
   CREATE USER production50_user WITH PASSWORD 'your_secure_password';
   
   # Grant privileges
   GRANT ALL PRIVILEGES ON DATABASE production50 TO production50_user;
   
   # Exit
   \q
   ```

3. **Database URL Format:**
   ```
   DATABASE_URL=postgresql://production50_user:your_secure_password@localhost:5432/production50
   ```

### **Option B: Cloud Database (Recommended for Production)**

#### **Railway PostgreSQL:**
1. Go to [Railway.app](https://railway.app)
2. Sign up/Login with GitHub
3. Create new project → Add PostgreSQL
4. Copy the connection string from the dashboard
5. Format: `postgresql://username:password@host:port/database`

#### **Supabase PostgreSQL:**
1. Go to [Supabase.com](https://supabase.com)
2. Create new project
3. Go to Settings → Database
4. Copy the connection string
5. Format: `postgresql://postgres:password@host:5432/postgres`

#### **AWS RDS PostgreSQL:**
1. Go to AWS Console → RDS
2. Create database → PostgreSQL
3. Configure instance class and storage
4. Set master username/password
5. Note the endpoint URL
6. Format: `postgresql://username:password@endpoint:5432/database`

---

## 📧 2. Email Service Configuration (SendGrid)

### **SendGrid Setup:**

1. **Create SendGrid Account:**
   - Go to [SendGrid.com](https://sendgrid.com)
   - Sign up for free account (100 emails/day free)
   - Verify your email address

2. **Create API Key:**
   ```bash
   # Go to SendGrid Dashboard
   # Settings → API Keys → Create API Key
   # Choose "Restricted Access"
   # Give permissions: Mail Send (Full Access)
   # Copy the API key (starts with SG.)
   ```

3. **Verify Sender Identity:**
   ```bash
   # Go to Settings → Sender Authentication
   # Single Sender Verification → Create New Sender
   # Fill in your details:
   # - From Name: Production-50 Team
   # - From Email: noreply@yourdomain.com (or your email)
   # - Reply To: support@yourdomain.com
   ```

4. **Environment Variables:**
   ```env
   SENDGRID_API_KEY=SG.your_api_key_here
   FROM_EMAIL=noreply@yourdomain.com
   ```

### **Alternative: Gmail SMTP (Development Only)**

```env
# Gmail SMTP Configuration
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-gmail@gmail.com
SMTP_PASS=your-app-password  # Generate app password in Gmail settings
FROM_EMAIL=your-gmail@gmail.com
```

---

## 💳 3. Payment Gateway Configuration (Razorpay)

### **Razorpay Setup (For Indian Payments):**

1. **Create Razorpay Account:**
   - Go to [Razorpay.com](https://razorpay.com)
   - Sign up with business details
   - Complete KYC verification

2. **Get API Keys:**
   ```bash
   # Go to Dashboard → Settings → API Keys
   # Generate Test Keys (for development)
   # Generate Live Keys (for production)
   ```

3. **Test Credentials:**
   ```env
   # Test Mode (Development)
   RAZORPAY_KEY_ID=rzp_test_xxxxxxxxxx
   RAZORPAY_KEY_SECRET=your_test_secret_key
   ```

4. **Live Credentials:**
   ```env
   # Live Mode (Production)
   RAZORPAY_KEY_ID=rzp_live_xxxxxxxxxx
   RAZORPAY_KEY_SECRET=your_live_secret_key
   ```

5. **Webhook Configuration:**
   ```bash
   # Go to Settings → Webhooks
   # Add Endpoint: https://yourdomain.com/api/payment/webhook
   # Select Events: payment.captured, payment.failed
   # Generate webhook secret
   ```

### **Alternative: Stripe (International Payments)**

```env
# Stripe Configuration
STRIPE_PUBLISHABLE_KEY=pk_test_xxxxxxxxxx
STRIPE_SECRET_KEY=sk_test_xxxxxxxxxx
STRIPE_WEBHOOK_SECRET=whsec_xxxxxxxxxx
```

---

## ☁️ 4. AWS S3 Configuration (File Storage)

### **AWS S3 Setup:**

1. **Create AWS Account:**
   - Go to [AWS Console](https://aws.amazon.com)
   - Sign up for free tier account

2. **Create S3 Bucket:**
   ```bash
   # Go to S3 Console
   # Create Bucket → Choose unique name: production50-files
   # Region: Choose closest to your users
   # Block Public Access: Uncheck (for public file access)
   # Versioning: Enable (optional)
   ```

3. **Create IAM User:**
   ```bash
   # Go to IAM Console → Users → Add User
   # Username: production50-s3-user
   # Access Type: Programmatic access
   # Attach Policy: AmazonS3FullAccess
   # Download CSV with Access Key ID and Secret
   ```

4. **Bucket Policy (for public read access):**
   ```json
   {
     "Version": "2012-10-17",
     "Statement": [
       {
         "Sid": "PublicReadGetObject",
         "Effect": "Allow",
         "Principal": "*",
         "Action": "s3:GetObject",
         "Resource": "arn:aws:s3:::production50-files/*"
       }
     ]
   }
   ```

5. **Environment Variables:**
   ```env
   AWS_ACCESS_KEY_ID=AKIAXXXXXXXXXX
   AWS_SECRET_ACCESS_KEY=your_secret_access_key
   AWS_REGION=us-east-1
   S3_BUCKET_NAME=production50-files
   ```

### **Alternative: Cloudinary (Image Management)**

```env
# Cloudinary Configuration
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

---

## 🔐 5. Security Configuration

### **JWT Secret:**
```bash
# Generate strong JWT secret
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

```env
JWT_SECRET=your_generated_64_character_secret
JWT_EXPIRES_IN=7d
```

### **Admin User:**
```env
ADMIN_EMAIL=admin@production50.com
ADMIN_PASSWORD=SecureAdminPassword123!
```

---

## 📱 6. Push Notifications (Optional)

### **Web Push (VAPID Keys):**

1. **Generate VAPID Keys:**
   ```bash
   npm install -g web-push
   web-push generate-vapid-keys
   ```

2. **Environment Variables:**
   ```env
   VAPID_PUBLIC_KEY=your_public_key
   VAPID_PRIVATE_KEY=your_private_key
   ```

---

## 🌐 7. Complete .env File Template

```env
# Server Configuration
PORT=5000
NODE_ENV=development
FRONTEND_URL=http://localhost:3000

# Database Configuration
DATABASE_URL=postgresql://username:password@localhost:5432/production50
REDIS_URL=redis://localhost:6379

# JWT Configuration
JWT_SECRET=your_64_character_secret_here
JWT_EXPIRES_IN=7d

# Email Configuration (SendGrid)
SENDGRID_API_KEY=SG.your_sendgrid_api_key
FROM_EMAIL=noreply@production50.com

# Payment Gateway (Razorpay)
RAZORPAY_KEY_ID=rzp_test_xxxxxxxxxx
RAZORPAY_KEY_SECRET=your_razorpay_secret

# AWS S3 Configuration
AWS_ACCESS_KEY_ID=AKIAXXXXXXXXXX
AWS_SECRET_ACCESS_KEY=your_aws_secret_key
AWS_REGION=us-east-1
S3_BUCKET_NAME=production50-files

# Push Notifications
VAPID_PUBLIC_KEY=your_vapid_public_key
VAPID_PRIVATE_KEY=your_vapid_private_key

# Admin Configuration
ADMIN_EMAIL=admin@production50.com
ADMIN_PASSWORD=SecurePassword123!
```

---

## 🚀 8. Quick Setup Commands

```bash
# 1. Clone and setup
git clone <your-repo>
cd server
npm install

# 2. Copy environment file
cp .env.example .env
# Edit .env with your credentials

# 3. Setup database
npm run migrate
npm run seed

# 4. Start development server
npm run dev

# 5. Test the setup
curl http://localhost:5000/health
```

---

## 🧪 9. Testing Configuration

### **Test Database Connection:**
```bash
node -e "
const pool = require('./config/database');
pool.query('SELECT NOW()', (err, res) => {
  if (err) console.error('DB Error:', err);
  else console.log('DB Connected:', res.rows[0]);
  process.exit();
});
"
```

### **Test Email Service:**
```bash
node -e "
const emailService = require('./services/emailService');
emailService.sendEmail('test@example.com', 'verification', {
  name: 'Test User',
  verification_link: 'http://localhost:3000/verify'
}).then(() => console.log('Email sent!')).catch(console.error);
"
```

### **Test Payment Service:**
```bash
node -e "
const paymentService = require('./services/paymentService');
paymentService.createOrder(1, [{type: 'event', item_id: 1, amount: 500}])
.then(order => console.log('Order created:', order))
.catch(console.error);
"
```

---

## 🔧 10. Troubleshooting

### **Common Issues:**

1. **Database Connection Error:**
   ```bash
   # Check if PostgreSQL is running
   sudo service postgresql status
   
   # Check connection string format
   # Make sure username, password, host, port are correct
   ```

2. **Email Not Sending:**
   ```bash
   # Verify SendGrid API key
   # Check sender verification status
   # Ensure FROM_EMAIL matches verified sender
   ```

3. **Payment Errors:**
   ```bash
   # Verify Razorpay keys are correct
   # Check if webhook URL is accessible
   # Ensure proper CORS configuration
   ```

4. **File Upload Issues:**
   ```bash
   # Verify AWS credentials
   # Check S3 bucket permissions
   # Ensure bucket policy allows public read
   ```

---

## 📊 11. Monitoring & Logs

### **Enable Logging:**
```env
# Add to .env
LOG_LEVEL=debug
ENABLE_QUERY_LOGGING=true
```

### **Health Check Endpoint:**
```bash
# Test all services
curl http://localhost:5000/health

# Expected response:
{
  "success": true,
  "message": "Production-50 API is running",
  "services": {
    "database": "connected",
    "redis": "connected",
    "email": "configured",
    "payment": "configured",
    "storage": "configured"
  }
}
```

---

## 🚀 12. Production Deployment

### **Environment Variables for Production:**
```env
NODE_ENV=production
PORT=5000
FRONTEND_URL=https://production50.com

# Use production database
DATABASE_URL=postgresql://prod_user:secure_pass@prod-host:5432/production50

# Use live payment keys
RAZORPAY_KEY_ID=rzp_live_xxxxxxxxxx
RAZORPAY_KEY_SECRET=live_secret_key

# Production email settings
FROM_EMAIL=noreply@production50.com
```

### **Security Checklist:**
- [ ] Use strong passwords for all services
- [ ] Enable SSL/TLS for database connections
- [ ] Set up proper CORS origins
- [ ] Use environment variables for all secrets
- [ ] Enable rate limiting in production
- [ ] Set up monitoring and alerting
- [ ] Regular database backups
- [ ] Update dependencies regularly

---

## 📞 Support

If you encounter any issues during setup:

1. Check the logs: `npm run dev` shows detailed error messages
2. Verify all environment variables are set correctly
3. Test each service individually using the test commands above
4. Check service status pages (SendGrid, Razorpay, AWS)

For additional help, refer to the official documentation:
- [PostgreSQL Docs](https://www.postgresql.org/docs/)
- [SendGrid API Docs](https://docs.sendgrid.com/)
- [Razorpay API Docs](https://razorpay.com/docs/)
- [AWS S3 Docs](https://docs.aws.amazon.com/s3/)