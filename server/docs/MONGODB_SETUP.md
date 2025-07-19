# 🍃 MongoDB Setup Guide for Production-50

## 📋 Prerequisites

- Node.js 16+ installed
- MongoDB 4.4+ or MongoDB Atlas account
- Git for version control

---

## 🗄️ MongoDB Configuration Options

### **Option A: Local MongoDB Setup**

1. **Install MongoDB:**
   ```bash
   # Ubuntu/Debian
   sudo apt update
   sudo apt install mongodb
   sudo systemctl start mongodb
   sudo systemctl enable mongodb
   
   # macOS (using Homebrew)
   brew tap mongodb/brew
   brew install mongodb-community
   brew services start mongodb-community
   
   # Windows
   # Download from: https://www.mongodb.com/try/download/community
   ```

2. **Create Database and User:**
   ```bash
   # Connect to MongoDB
   mongosh
   
   # Create database
   use production50
   
   # Create user with password
   db.createUser({
     user: "production50_user",
     pwd: "your_secure_password",
     roles: [
       { role: "readWrite", db: "production50" }
     ]
   })
   
   # Exit
   exit
   ```

3. **Connection String Format:**
   ```
   MONGODB_URI=mongodb://production50_user:your_secure_password@localhost:27017/production50
   ```

### **Option B: MongoDB Atlas (Cloud - Recommended)**

1. **Create MongoDB Atlas Account:**
   - Go to [MongoDB Atlas](https://www.mongodb.com/atlas)
   - Sign up for free account
   - Create new project

2. **Create Cluster:**
   - Choose "Build a Database"
   - Select "Shared" (Free tier)
   - Choose cloud provider and region
   - Create cluster

3. **Configure Database Access:**
   - Go to "Database Access"
   - Add new database user
   - Choose "Password" authentication
   - Set username and password
   - Grant "Atlas admin" or "Read and write to any database"

4. **Configure Network Access:**
   - Go to "Network Access"
   - Add IP Address
   - Choose "Allow access from anywhere" (0.0.0.0/0) for development
   - Or add your specific IP address

5. **Get Connection String:**
   - Go to "Databases"
   - Click "Connect" on your cluster
   - Choose "Connect your application"
   - Copy the connection string
   - Replace `<password>` with your database user password

6. **Connection String Format:**
   ```
   MONGODB_URI=mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/production50?retryWrites=true&w=majority
   ```

---

## 🚀 Project Setup

### **1. Install Dependencies**

```bash
cd server
npm install mongodb
```

### **2. Environment Configuration**

Create `.env` file in server directory:

```env
# Server Configuration
PORT=5000
NODE_ENV=development
FRONTEND_URL=http://localhost:3000

# MongoDB Configuration
MONGODB_URI=mongodb://localhost:27017/production50
# For Atlas: mongodb+srv://username:password@cluster.mongodb.net/production50
DB_NAME=production50

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

# Admin Configuration
ADMIN_EMAIL=admin@production50.com
ADMIN_PASSWORD=SecureAdminPassword123!
```

### **3. Database Initialization**

```bash
# Start the server (this will create indexes automatically)
npm run dev
```

---

## 📊 Database Schema

### **Collections Structure:**

#### **1. Users Collection**
```javascript
{
  _id: ObjectId,
  name: String,
  email: String (unique),
  password: String (hashed),
  mobile: String,
  alternateMobile: String,
  gender: String,
  category: String, // 'college' or 'alumni'
  
  // College specific
  course: String,
  yearOfGraduation: Number,
  idCardPhoto: String,
  
  // Alumni specific
  profession: String,
  yearOfPassedOut: Number,
  
  // Additional
  accommodation: Boolean,
  dietary: String,
  
  // System fields
  uniqueCode: String (unique),
  isVerified: Boolean,
  isActive: Boolean,
  verificationToken: String,
  resetToken: String,
  resetTokenExpiry: Date,
  
  // Timestamps
  createdAt: Date,
  updatedAt: Date,
  lastLogin: Date
}
```

#### **2. Events Collection**
```javascript
{
  _id: ObjectId,
  title: String,
  description: String,
  eventType: String, // 'Workshop', 'Competition', etc.
  dateTime: Date,
  venue: String,
  maxParticipants: Number,
  currentParticipants: Number,
  registrationFee: Number,
  imageUrl: String,
  prerequisites: String,
  instructorName: String,
  instructorBio: String,
  isActive: Boolean,
  createdAt: Date,
  updatedAt: Date
}
```

#### **3. Registrations Collection**
```javascript
{
  _id: ObjectId,
  userId: ObjectId,
  eventId: ObjectId,
  paymentStatus: String, // 'pending', 'completed', 'failed', 'refunded'
  paymentId: String,
  amountPaid: Number,
  registrationDate: Date,
  qrCode: String,
  verificationCode: String,
  attendanceStatus: String, // 'registered', 'present', 'absent'
  dietaryPreferences: String,
  createdAt: Date,
  updatedAt: Date
}
```

#### **4. OTPs Collection**
```javascript
{
  _id: ObjectId,
  email: String,
  otp: String,
  createdAt: Date,
  expiresAt: Date, // TTL index
  attempts: Number,
  maxAttempts: Number
}
```

---

## 🔧 API Endpoints

### **Authentication Endpoints:**

```bash
POST /api/auth/register          # User registration
POST /api/auth/login             # User login
POST /api/auth/send-otp          # Send OTP for verification
POST /api/auth/verify-otp        # Verify OTP
POST /api/auth/forgot-password   # Request password reset
POST /api/auth/reset-password    # Reset password
```

### **User Management:**

```bash
GET  /api/users                  # Get all users (admin)
GET  /api/users/:id              # Get user by ID
PUT  /api/users/:id              # Update user
GET  /api/users/stats            # Get user statistics
```

### **Event Management:**

```bash
GET  /api/events                 # Get all events
GET  /api/events/:id             # Get event by ID
POST /api/events                 # Create event (admin)
PUT  /api/events/:id             # Update event (admin)
DELETE /api/events/:id           # Delete event (admin)
```

### **Registration Management:**

```bash
POST /api/registrations          # Register for event
GET  /api/registrations/user/:id # Get user registrations
GET  /api/registrations/event/:id # Get event registrations
PUT  /api/registrations/:id      # Update registration
DELETE /api/registrations/:id    # Cancel registration
```

---

## 🧪 Testing the Setup

### **1. Test Database Connection:**
```bash
node -e "
const mongodb = require('./config/mongodb');
mongodb.connect().then(() => {
  console.log('✅ MongoDB connection successful');
  process.exit(0);
}).catch(err => {
  console.error('❌ MongoDB connection failed:', err);
  process.exit(1);
});
"
```

### **2. Test User Registration:**
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "password": "password123",
    "mobile": "9876543210",
    "gender": "Male",
    "category": "college",
    "course": "B.Tech CSE",
    "yearOfGraduation": 2025
  }'
```

### **3. Test OTP System:**
```bash
# Send OTP
curl -X POST http://localhost:5000/api/auth/send-otp \
  -H "Content-Type: application/json" \
  -d '{"email": "test@example.com"}'

# Verify OTP
curl -X POST http://localhost:5000/api/auth/verify-otp \
  -H "Content-Type: application/json" \
  -d '{"email": "test@example.com", "otp": "123456"}'
```

---

## 📈 Performance Optimization

### **1. Indexes Created Automatically:**
- Users: email (unique), uniqueCode (unique), mobile, verificationToken, resetToken
- Events: eventType, dateTime, isActive
- Registrations: userId, eventId, compound (userId + eventId), paymentStatus
- OTPs: email, expiresAt (TTL)

### **2. Connection Pooling:**
MongoDB driver automatically handles connection pooling.

### **3. Query Optimization:**
- Use projection to limit returned fields
- Implement pagination for large datasets
- Use aggregation pipeline for complex queries

---

## 🔒 Security Best Practices

### **1. Authentication:**
- Passwords hashed with bcrypt (12 rounds)
- JWT tokens with expiration
- OTP system with attempt limits

### **2. Data Validation:**
- Input validation using express-validator
- Email format validation
- Password strength requirements

### **3. Rate Limiting:**
- Authentication endpoints limited
- OTP sending limited
- General API rate limiting

---

## 🚀 Deployment

### **Production Environment Variables:**
```env
NODE_ENV=production
MONGODB_URI=mongodb+srv://prod_user:secure_pass@prod-cluster.mongodb.net/production50
DB_NAME=production50

# Use production email service
SENDGRID_API_KEY=SG.live_api_key

# Use live payment keys
RAZORPAY_KEY_ID=rzp_live_xxxxxxxxxx
RAZORPAY_KEY_SECRET=live_secret_key
```

### **MongoDB Atlas Production Setup:**
1. Create production cluster
2. Configure proper network access
3. Set up database backups
4. Monitor performance metrics
5. Set up alerts for issues

---

## 📞 Troubleshooting

### **Common Issues:**

1. **Connection Timeout:**
   ```bash
   # Check network access in MongoDB Atlas
   # Verify connection string format
   # Check firewall settings
   ```

2. **Authentication Failed:**
   ```bash
   # Verify username/password
   # Check database user permissions
   # Ensure correct database name
   ```

3. **Index Creation Failed:**
   ```bash
   # Check database permissions
   # Verify collection exists
   # Check for duplicate data
   ```

### **Debug Commands:**
```bash
# Check MongoDB status
mongosh --eval "db.adminCommand('ismaster')"

# Test connection
node -e "require('./config/mongodb').connect()"

# Check collections
mongosh production50 --eval "show collections"
```

---

## 📚 Additional Resources

- [MongoDB Documentation](https://docs.mongodb.com/)
- [MongoDB Atlas Documentation](https://docs.atlas.mongodb.com/)
- [MongoDB Node.js Driver](https://mongodb.github.io/node-mongodb-native/)
- [Mongoose ODM](https://mongoosejs.com/) (Alternative)

---

This setup provides a robust, scalable database solution for the Production-50 application with proper authentication, validation, and security measures.