/**
 * Form Validation Tests - TDD RED Phase
 * These tests define the expected behavior of form validation before implementation.
 */

import {
  validateEmail,
  validateRequired,
  validateForm,
  sanitizeInput
} from '../../js/form-validation.js';

describe('Form Validation', () => {

  describe('validateEmail', () => {
    test('accepts valid email addresses', () => {
      expect(validateEmail('user@example.com')).toBe(true);
      expect(validateEmail('user.name@example.com')).toBe(true);
      expect(validateEmail('user+tag@example.com')).toBe(true);
      expect(validateEmail('user@subdomain.example.com')).toBe(true);
      expect(validateEmail('user@example.co.uk')).toBe(true);
    });

    test('rejects invalid email addresses', () => {
      expect(validateEmail('invalid')).toBe(false);
      expect(validateEmail('user@')).toBe(false);
      expect(validateEmail('@example.com')).toBe(false);
      expect(validateEmail('user@.com')).toBe(false);
      expect(validateEmail('')).toBe(false);
      expect(validateEmail(null)).toBe(false);
      expect(validateEmail(undefined)).toBe(false);
    });

    test('rejects disposable email domains', () => {
      const disposableDomains = [
        'tempmail.com',
        'guerrillamail.com',
        'mailinator.com',
        '10minutemail.com',
        'throwaway.email'
      ];

      disposableDomains.forEach(domain => {
        expect(validateEmail(`user@${domain}`)).toBe(false);
      });
    });
  });

  describe('validateRequired', () => {
    test('accepts non-empty string values', () => {
      expect(validateRequired('hello')).toBe(true);
      expect(validateRequired('a')).toBe(true);
      expect(validateRequired('0')).toBe(true);
    });

    test('trims whitespace before validation', () => {
      expect(validateRequired('  text  ')).toBe(true);
      expect(validateRequired('   ')).toBe(false);
    });

    test('rejects empty values', () => {
      expect(validateRequired('')).toBe(false);
      expect(validateRequired(null)).toBe(false);
      expect(validateRequired(undefined)).toBe(false);
    });
  });

  describe('sanitizeInput', () => {
    test('removes HTML tags', () => {
      // Note: quotes are also escaped for XSS prevention
      expect(sanitizeInput('<script>alert("xss")</script>')).toBe('alert(&quot;xss&quot;)');
      expect(sanitizeInput('<b>bold</b>')).toBe('bold');
    });

    test('escapes special characters', () => {
      expect(sanitizeInput('a < b')).toBe('a &lt; b');
      expect(sanitizeInput('a > b')).toBe('a &gt; b');
      expect(sanitizeInput('say "hello"')).toBe('say &quot;hello&quot;');
    });

    test('trims whitespace', () => {
      expect(sanitizeInput('  hello  ')).toBe('hello');
    });

    test('handles null/undefined', () => {
      expect(sanitizeInput(null)).toBe('');
      expect(sanitizeInput(undefined)).toBe('');
    });
  });

  describe('validateForm (contact form)', () => {
    const validForm = {
      name: 'John Doe',
      email: 'john@example.com',
      message: 'Hello, I have a question about Jock Block.',
      honeypot: '' // Should be empty (bot trap)
    };

    test('passes with valid data', () => {
      const result = validateForm(validForm);

      expect(result.isValid).toBe(true);
      expect(result.errors).toEqual({});
      expect(result.isBot).toBe(false);
    });

    test('fails with missing name', () => {
      const result = validateForm({ ...validForm, name: '' });

      expect(result.isValid).toBe(false);
      expect(result.errors.name).toBe('Name is required');
    });

    test('fails with missing email', () => {
      const result = validateForm({ ...validForm, email: '' });

      expect(result.isValid).toBe(false);
      expect(result.errors.email).toBe('Email is required');
    });

    test('fails with invalid email format', () => {
      const result = validateForm({ ...validForm, email: 'invalid-email' });

      expect(result.isValid).toBe(false);
      expect(result.errors.email).toBe('Please enter a valid email address');
    });

    test('fails with disposable email', () => {
      const result = validateForm({ ...validForm, email: 'user@tempmail.com' });

      expect(result.isValid).toBe(false);
      expect(result.errors.email).toBe('Please use a non-disposable email address');
    });

    test('fails with missing message', () => {
      const result = validateForm({ ...validForm, message: '' });

      expect(result.isValid).toBe(false);
      expect(result.errors.message).toBe('Message is required');
    });

    test('fails with message too short', () => {
      const result = validateForm({ ...validForm, message: 'Hi' });

      expect(result.isValid).toBe(false);
      expect(result.errors.message).toBe('Message must be at least 10 characters');
    });

    test('detects bot via honeypot field', () => {
      const result = validateForm({ ...validForm, honeypot: 'bot-filled-this' });

      expect(result.isValid).toBe(false);
      expect(result.isBot).toBe(true);
    });

    test('collects multiple errors', () => {
      const result = validateForm({
        name: '',
        email: 'invalid',
        message: '',
        honeypot: ''
      });

      expect(result.isValid).toBe(false);
      expect(Object.keys(result.errors)).toHaveLength(3);
      expect(result.errors.name).toBeDefined();
      expect(result.errors.email).toBeDefined();
      expect(result.errors.message).toBeDefined();
    });

    test('sanitizes input values', () => {
      const result = validateForm({
        name: '<script>alert("xss")</script>John',
        email: 'john@example.com',
        message: 'This is a valid message.',
        honeypot: ''
      });

      expect(result.isValid).toBe(true);
      expect(result.sanitized.name).not.toContain('<script>');
    });
  });

  describe('validateForm (newsletter signup)', () => {
    test('passes with valid email only', () => {
      const result = validateForm({ email: 'user@example.com' }, 'newsletter');

      expect(result.isValid).toBe(true);
    });

    test('fails with invalid email', () => {
      const result = validateForm({ email: 'invalid' }, 'newsletter');

      expect(result.isValid).toBe(false);
      expect(result.errors.email).toBeDefined();
    });
  });
});
