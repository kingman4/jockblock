/**
 * Form Validation Module
 * Provides validation and sanitization for contact and newsletter forms
 */

// List of disposable email domains to block
const DISPOSABLE_DOMAINS = [
  'tempmail.com',
  'guerrillamail.com',
  'mailinator.com',
  '10minutemail.com',
  'throwaway.email',
  'temp-mail.org',
  'fakeinbox.com',
  'trashmail.com',
  'sharklasers.com',
  'getnada.com'
];

/**
 * Validate email address format and domain
 * @param {string} email - Email address to validate
 * @returns {boolean} True if valid
 */
export function validateEmail(email) {
  if (!email || typeof email !== 'string') {
    return false;
  }

  // Basic email regex pattern
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!emailPattern.test(email)) {
    return false;
  }

  // Check for disposable email domains
  const domain = email.split('@')[1]?.toLowerCase();
  if (DISPOSABLE_DOMAINS.includes(domain)) {
    return false;
  }

  return true;
}

/**
 * Check if email is from a disposable domain
 * @param {string} email - Email address to check
 * @returns {boolean} True if disposable
 */
export function isDisposableEmail(email) {
  if (!email || typeof email !== 'string') {
    return false;
  }
  const domain = email.split('@')[1]?.toLowerCase();
  return DISPOSABLE_DOMAINS.includes(domain);
}

/**
 * Validate required field
 * @param {string} value - Value to validate
 * @returns {boolean} True if valid (non-empty after trimming)
 */
export function validateRequired(value) {
  if (value === null || value === undefined) {
    return false;
  }

  if (typeof value !== 'string') {
    return false;
  }

  return value.trim().length > 0;
}

/**
 * Sanitize input to prevent XSS
 * @param {string} input - Raw input string
 * @returns {string} Sanitized string
 */
export function sanitizeInput(input) {
  if (input === null || input === undefined) {
    return '';
  }

  let sanitized = String(input);

  // Remove HTML tags
  sanitized = sanitized.replace(/<[^>]*>/g, '');

  // Escape special characters
  sanitized = sanitized
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;');

  // Trim whitespace
  sanitized = sanitized.trim();

  return sanitized;
}

/**
 * Validate a form based on type
 * @param {Object} formData - Form data object
 * @param {string} formType - Type of form ('contact' or 'newsletter')
 * @returns {Object} Validation result with isValid, errors, isBot, and sanitized data
 */
export function validateForm(formData, formType = 'contact') {
  const errors = {};
  const sanitized = {};
  let isBot = false;

  // Check honeypot field (bot detection)
  if (formData.honeypot && formData.honeypot.trim() !== '') {
    isBot = true;
    return { isValid: false, errors: {}, isBot, sanitized: {} };
  }

  if (formType === 'newsletter') {
    // Newsletter only requires email
    if (!validateRequired(formData.email)) {
      errors.email = 'Email is required';
    } else if (!validateEmail(formData.email)) {
      if (isDisposableEmail(formData.email)) {
        errors.email = 'Please use a non-disposable email address';
      } else {
        errors.email = 'Please enter a valid email address';
      }
    }

    if (!errors.email) {
      sanitized.email = sanitizeInput(formData.email);
    }

    return {
      isValid: Object.keys(errors).length === 0,
      errors,
      isBot,
      sanitized
    };
  }

  // Contact form validation
  // Name validation
  if (!validateRequired(formData.name)) {
    errors.name = 'Name is required';
  } else {
    sanitized.name = sanitizeInput(formData.name);
  }

  // Email validation
  if (!validateRequired(formData.email)) {
    errors.email = 'Email is required';
  } else if (isDisposableEmail(formData.email)) {
    errors.email = 'Please use a non-disposable email address';
  } else if (!validateEmail(formData.email)) {
    errors.email = 'Please enter a valid email address';
  } else {
    sanitized.email = sanitizeInput(formData.email);
  }

  // Message validation
  if (!validateRequired(formData.message)) {
    errors.message = 'Message is required';
  } else if (formData.message.trim().length < 10) {
    errors.message = 'Message must be at least 10 characters';
  } else {
    sanitized.message = sanitizeInput(formData.message);
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
    isBot,
    sanitized
  };
}

export default {
  validateEmail,
  validateRequired,
  validateForm,
  sanitizeInput,
  isDisposableEmail
};
