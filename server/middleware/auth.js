const jwt = require('jsonwebtoken');
const pool = require('../config/database');

const authenticateToken = async (req, res, next) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
      return res.status(401).json({ 
        success: false, 
        message: 'Access token required' 
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Verify user still exists and is active
    const result = await pool.query(
      'SELECT id, full_name, email, is_verified, is_active FROM users WHERE id = $1',
      [decoded.userId]
    );

    if (result.rows.length === 0) {
      return res.status(401).json({ 
        success: false, 
        message: 'User not found' 
      });
    }

    const user = result.rows[0];
    
    if (!user.is_active) {
      return res.status(401).json({ 
        success: false, 
        message: 'Account deactivated' 
      });
    }

    req.user = user;
    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ 
        success: false, 
        message: 'Token expired' 
      });
    }
    
    return res.status(403).json({ 
      success: false, 
      message: 'Invalid token' 
    });
  }
};

const requireVerified = (req, res, next) => {
  if (!req.user.is_verified) {
    return res.status(403).json({ 
      success: false, 
      message: 'Email verification required' 
    });
  }
  next();
};

const requireAdmin = async (req, res, next) => {
  try {
    const result = await pool.query(
      'SELECT role FROM admin_users WHERE email = $1 AND is_active = true',
      [req.user.email]
    );

    if (result.rows.length === 0) {
      return res.status(403).json({ 
        success: false, 
        message: 'Admin access required' 
      });
    }

    req.admin = result.rows[0];
    next();
  } catch (error) {
    return res.status(500).json({ 
      success: false, 
      message: 'Server error' 
    });
  }
};

module.exports = {
  authenticateToken,
  requireVerified,
  requireAdmin
};