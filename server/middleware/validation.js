const { body, validationResult } = require('express-validator');

const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errors.array()
    });
  }
  next();
};

const validateRegistration = [
  body('full_name')
    .isLength({ min: 2, max: 100 })
    .trim()
    .escape()
    .withMessage('Full name must be between 2 and 100 characters'),
  
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email address'),
  
  body('password')
    .isLength({ min: 8 })
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/)
    .withMessage('Password must be at least 8 characters with uppercase, lowercase, number, and special character'),
  
  body('phone')
    .isMobilePhone('en-IN')
    .withMessage('Please provide a valid Indian phone number'),
  
  body('date_of_birth')
    .isDate()
    .custom((value) => {
      const age = Math.floor((new Date() - new Date(value)) / (365.25 * 24 * 60 * 60 * 1000));
      if (age < 16) {
        throw new Error('Must be at least 16 years old');
      }
      if (age > 100) {
        throw new Error('Please provide a valid birth date');
      }
      return true;
    }),
  
  body('gender')
    .isIn(['Male', 'Female', 'Other', 'Prefer not to say'])
    .withMessage('Please select a valid gender option'),
  
  body('participation_type')
    .isIn(['Student', 'Faculty', 'Industry Professional'])
    .withMessage('Please select a valid participation type'),
  
  body('institution')
    .optional()
    .isLength({ max: 200 })
    .trim()
    .escape(),
  
  body('emergency_contact_name')
    .optional()
    .isLength({ max: 100 })
    .trim()
    .escape(),
  
  body('emergency_contact_phone')
    .optional()
    .isMobilePhone('en-IN'),
  
  body('emergency_relationship')
    .optional()
    .isLength({ max: 50 })
    .trim()
    .escape(),
  
  handleValidationErrors
];

const validateLogin = [
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email address'),
  
  body('password')
    .notEmpty()
    .withMessage('Password is required'),
  
  handleValidationErrors
];

const validateEventRegistration = [
  body('event_id')
    .isInt({ min: 1 })
    .withMessage('Valid event ID is required'),
  
  body('dietary_preferences')
    .optional()
    .isLength({ max: 500 })
    .trim()
    .escape(),
  
  handleValidationErrors
];

const validateContactMessage = [
  body('name')
    .isLength({ min: 2, max: 100 })
    .trim()
    .escape()
    .withMessage('Name must be between 2 and 100 characters'),
  
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email address'),
  
  body('phone')
    .optional()
    .isMobilePhone('en-IN'),
  
  body('subject')
    .isLength({ min: 5, max: 200 })
    .trim()
    .escape()
    .withMessage('Subject must be between 5 and 200 characters'),
  
  body('message')
    .isLength({ min: 10, max: 2000 })
    .trim()
    .escape()
    .withMessage('Message must be between 10 and 2000 characters'),
  
  body('category')
    .optional()
    .isIn(['General Inquiry', 'Registration', 'Technical Support', 'Accommodation', 'Payment', 'Workshop', 'Competition', 'Other'])
    .withMessage('Please select a valid category'),
  
  handleValidationErrors
];

const validatePasswordReset = [
  body('token')
    .notEmpty()
    .withMessage('Reset token is required'),
  
  body('new_password')
    .isLength({ min: 8 })
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/)
    .withMessage('Password must be at least 8 characters with uppercase, lowercase, number, and special character'),
  
  handleValidationErrors
];

module.exports = {
  validateRegistration,
  validateLogin,
  validateEventRegistration,
  validateContactMessage,
  validatePasswordReset,
  handleValidationErrors
};