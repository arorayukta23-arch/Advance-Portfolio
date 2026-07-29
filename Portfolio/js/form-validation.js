/* ============================================
   PORTFOLIO - Form Validation
   Accessible client-side validation
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {
  'use strict';

  const form = document.getElementById('contact-form');
  if (!form) return;

  const fields = {
    name: {
      element: document.getElementById('full-name'),
      rules: [
        { test: v => v.trim().length > 0, message: 'Full name is required.' },
        { test: v => v.trim().length >= 2, message: 'Name must be at least 2 characters.' }
      ]
    },
    email: {
      element: document.getElementById('email'),
      rules: [
        { test: v => v.trim().length > 0, message: 'Email address is required.' },
        { test: v => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v), message: 'Please enter a valid email address.' }
      ]
    },
    subject: {
      element: document.getElementById('subject'),
      rules: [
        { test: v => v.trim().length > 0, message: 'Subject is required.' }
      ]
    },
    message: {
      element: document.getElementById('message'),
      rules: [
        { test: v => v.trim().length > 0, message: 'Message is required.' },
        { test: v => v.trim().length >= 10, message: 'Message must be at least 10 characters.' }
      ]
    }
  };

  /**
   * Validate a single field
   * @param {string} fieldKey - Key in the fields object
   * @returns {boolean} Whether the field is valid
   */
  function validateField(fieldKey) {
    const field = fields[fieldKey];
    if (!field || !field.element) return true;

    const value = field.element.value;
    const group = field.element.closest('.form-group');
    const errorEl = group.querySelector('.error-message');

    for (const rule of field.rules) {
      if (!rule.test(value)) {
        group.classList.add('error');
        if (errorEl) {
          errorEl.textContent = rule.message;
          errorEl.style.display = 'block';
        }
        field.element.setAttribute('aria-invalid', 'true');
        return false;
      }
    }

    group.classList.remove('error');
    if (errorEl) {
      errorEl.textContent = '';
      errorEl.style.display = 'none';
    }
    field.element.setAttribute('aria-invalid', 'false');
    return true;
  }

  // Real-time validation on blur
  Object.keys(fields).forEach(key => {
    const el = fields[key].element;
    if (el) {
      el.addEventListener('blur', () => validateField(key));
      el.addEventListener('input', () => {
        const group = el.closest('.form-group');
        if (group.classList.contains('error')) {
          validateField(key);
        }
      });
    }
  });

  // Form submission
  form.addEventListener('submit', (e) => {
    e.preventDefault();

    let isValid = true;
    let firstInvalid = null;

    Object.keys(fields).forEach(key => {
      const valid = validateField(key);
      if (!valid && !firstInvalid) {
        firstInvalid = fields[key].element;
      }
      if (!valid) isValid = false;
    });

    if (!isValid && firstInvalid) {
      firstInvalid.focus();
      // Announce error to screen readers
      const liveRegion = document.getElementById('form-status');
      if (liveRegion) {
        liveRegion.textContent = 'There are errors in the form. Please correct them and try again.';
      }
      return;
    }

    // Success
    const liveRegion = document.getElementById('form-status');
    if (liveRegion) {
      liveRegion.textContent = 'Thank you! Your message has been sent successfully.';
    }

    // Show success message
    const successMsg = document.getElementById('form-success');
    if (successMsg) {
      successMsg.style.display = 'block';
      successMsg.focus();
    }

    form.reset();

    // Clear success after 5 seconds
    setTimeout(() => {
      if (successMsg) successMsg.style.display = 'none';
      if (liveRegion) liveRegion.textContent = '';
    }, 5000);
  });
});
