const { body } = require('express-validator');

// Validation rules for customer creation and updates
const customerValidationRules = () => {
  return [
    body('firstName')
      .trim()
      .notEmpty()
      .withMessage('First name is required')
      .isLength({ min: 2, max: 50 })
      .withMessage('First name must be between 2 and 50 characters')
      .matches(/^[a-zA-Z\s'-]+$/)
      .withMessage('First name can only contain letters, spaces, hyphens, and apostrophes'),

    body('lastName')
      .trim()
      .notEmpty()
      .withMessage('Last name is required')
      .isLength({ min: 2, max: 50 })
      .withMessage('Last name must be between 2 and 50 characters')
      .matches(/^[a-zA-Z\s'-]+$/)
      .withMessage('Last name can only contain letters, spaces, hyphens, and apostrophes'),

    body('dateOfBirth')
      .optional({ checkFalsy: true })
      .isISO8601()
      .withMessage('Date of birth must be a valid date (YYYY-MM-DD)')
      .custom((value) => {
        const birthDate = new Date(value);
        const today = new Date();
        const age = today.getFullYear() - birthDate.getFullYear();
        
        if (birthDate > today) {
          throw new Error('Date of birth cannot be in the future');
        }
        
        if (age > 150) {
          throw new Error('Date of birth seems unrealistic');
        }
        
        return true;
      }),

    body('mobileNumber')
      .optional({ checkFalsy: true })
      .trim()
      .matches(/^[\+]?[1-9][\d]{0,15}$/)
      .withMessage('Mobile number must be a valid phone number (10-15 digits)')
      .isLength({ min: 10, max: 15 })
      .withMessage('Mobile number must be between 10 and 15 digits'),

    body('email')
      .optional({ checkFalsy: true })
      .trim()
      .isEmail()
      .withMessage('Please provide a valid email address')
      .normalizeEmail()
      .isLength({ max: 100 })
      .withMessage('Email must not exceed 100 characters'),

    body('address')
      .optional({ checkFalsy: true })
      .trim()
      .isLength({ max: 200 })
      .withMessage('Address must not exceed 200 characters'),

    body('city')
      .optional({ checkFalsy: true })
      .trim()
      .isLength({ max: 50 })
      .withMessage('City must not exceed 50 characters')
      .matches(/^[a-zA-Z\s'-]+$/)
      .withMessage('City can only contain letters, spaces, hyphens, and apostrophes'),

    body('state')
      .optional({ checkFalsy: true })
      .trim()
      .isLength({ max: 50 })
      .withMessage('State must not exceed 50 characters')
      .matches(/^[a-zA-Z\s'-]+$/)
      .withMessage('State can only contain letters, spaces, hyphens, and apostrophes'),

    body('zipCode')
      .optional({ checkFalsy: true })
      .trim()
      .matches(/^[a-zA-Z0-9\s-]+$/)
      .withMessage('ZIP code can only contain letters, numbers, spaces, and hyphens')
      .isLength({ max: 10 })
      .withMessage('ZIP code must not exceed 10 characters'),

    body('country')
      .optional({ checkFalsy: true })
      .trim()
      .isLength({ max: 50 })
      .withMessage('Country must not exceed 50 characters')
      .matches(/^[a-zA-Z\s'-]+$/)
      .withMessage('Country can only contain letters, spaces, hyphens, and apostrophes'),

    body('notes')
      .optional({ checkFalsy: true })
      .trim()
      .isLength({ max: 500 })
      .withMessage('Notes must not exceed 500 characters')
  ];
};

// Validation for required fields only (for customer creation)
const customerCreateValidationRules = () => {
  return [
    body('firstName')
      .trim()
      .notEmpty()
      .withMessage('First name is required')
      .isLength({ min: 2, max: 50 })
      .withMessage('First name must be between 2 and 50 characters'),

    body('lastName')
      .trim()
      .notEmpty()
      .withMessage('Last name is required')
      .isLength({ min: 2, max: 50 })
      .withMessage('Last name must be between 2 and 50 characters'),

    // At least one contact method required
    body().custom((value, { req }) => {
      if (!req.body.mobileNumber && !req.body.email) {
        throw new Error('Either mobile number or email is required');
      }
      return true;
    }),

    ...customerValidationRules()
  ];
};

// Validation for customer search
const customerSearchValidationRules = () => {
  return [
    body('q')
      .optional()
      .trim()
      .isLength({ min: 1, max: 100 })
      .withMessage('Search query must be between 1 and 100 characters')
  ];
};

module.exports = {
  customerValidationRules,
  customerCreateValidationRules,
  customerSearchValidationRules
};
