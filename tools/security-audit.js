/**
 * Security Audit Script for DOMA Fabricators Website
 * 
 * This script performs automated security checks on the contact form
 * Run this in browser console or as part of CI/CD pipeline
 */

class SecurityAudit {
    constructor() {
        this.results = [];
        this.passed = 0;
        this.failed = 0;
        this.warnings = 0;
    }

    // Run all security checks
    async runAudit() {
        console.log('%c🔒 Starting Security Audit...', 'color: blue; font-size: 18px; font-weight: bold;');
        console.log('=====================================');

        // Check credentials configuration
        this.checkCredentialsConfig();
        
        // Check security headers
        this.checkSecurityHeaders();
        
        // Check form structure
        this.checkFormStructure();
        
        // Check input validation
        await this.checkInputValidation();
        
        // Check bot protection
        this.checkBotProtection();
        
        // Check rate limiting
        this.checkRateLimiting();
        
        // Check CSRF protection
        this.checkCSRFProtection();
        
        // Print results
        this.printResults();
    }

    checkCredentialsConfig() {
        console.log('\n%c1. Checking Credentials Configuration', 'color: purple; font-weight: bold;');
        
        // Check if EMAIL_CONFIG exists
        if (typeof EMAIL_CONFIG === 'undefined') {
            this.fail('EMAIL_CONFIG object not found');
            return;
        }

        // Check if placeholder values are still present
        if (EMAIL_CONFIG.publicKey === 'YOUR_PUBLIC_KEY') {
            this.fail('EmailJS Public Key is still set to placeholder value');
        } else if (EMAIL_CONFIG.publicKey && EMAIL_CONFIG.publicKey.startsWith('user_')) {
            this.pass('EmailJS Public Key is configured');
        } else {
            this.warning('EmailJS Public Key format may be incorrect');
        }

        // Check SecureContactForm config
        const form = document.getElementById('contact-form');
        if (form) {
            // We can't directly access the class instance, but we can check the form exists
            this.pass('Contact form element exists');
        } else {
            this.fail('Contact form element not found');
        }
    }

    checkSecurityHeaders() {
        console.log('\n%c2. Checking Security Headers', 'color: purple; font-weight: bold;');
        
        const metaTags = document.querySelectorAll('meta[http-equiv]');
        const headers = {};
        
        metaTags.forEach(meta => {
            headers[meta.getAttribute('http-equiv')] = meta.getAttribute('content');
        });

        // Check CSP
        if (headers['Content-Security-Policy']) {
            this.pass('Content-Security-Policy header present');
            
            const csp = headers['Content-Security-Policy'];
            if (csp.includes("'unsafe-inline'")) {
                this.warning('CSP allows unsafe-inline scripts (consider using nonces in production)');
            }
            if (csp.includes("'unsafe-eval'")) {
                this.warning('CSP allows unsafe-eval (consider removing if not needed)');
            }
        } else {
            this.fail('Content-Security-Policy header missing');
        }

        // Check X-Frame-Options
        if (headers['X-Frame-Options']) {
            this.pass('X-Frame-Options header present');
        } else {
            this.fail('X-Frame-Options header missing');
        }

        // Check X-Content-Type-Options
        if (headers['X-Content-Type-Options'] === 'nosniff') {
            this.pass('X-Content-Type-Options header correctly set');
        } else {
            this.fail('X-Content-Type-Options header missing or incorrect');
        }

        // Check X-XSS-Protection
        if (headers['X-XSS-Protection']) {
            this.pass('X-XSS-Protection header present');
        } else {
            this.warning('X-XSS-Protection header missing');
        }
    }

    checkFormStructure() {
        console.log('\n%c3. Checking Form Structure', 'color: purple; font-weight: bold;');
        
        const form = document.getElementById('contact-form');
        if (!form) {
            this.fail('Contact form not found');
            return;
        }

        // Check for honeypot field
        const honeypot = form.querySelector('[name="website_url"]');
        if (honeypot) {
            const style = window.getComputedStyle(honeypot.parentElement);
            if (style.position === 'absolute' && style.left === '-9999px') {
                this.pass('Honeypot field properly hidden');
            } else {
                this.warning('Honeypot field exists but may not be properly hidden');
            }
        } else {
            this.fail('Honeypot field not found');
        }

        // Check for CSRF token
        const csrfToken = document.getElementById('csrf-token');
        if (csrfToken) {
            this.pass('CSRF token field present');
        } else {
            this.fail('CSRF token field missing');
        }

        // Check for required attributes
        const requiredFields = ['user-name', 'user-email', 'user-message'];
        requiredFields.forEach(fieldId => {
            const field = document.getElementById(fieldId);
            if (field) {
                if (field.hasAttribute('required')) {
                    this.pass(`${fieldId} has required attribute`);
                } else {
                    this.warning(`${fieldId} missing required attribute`);
                }
            } else {
                this.fail(`${fieldId} not found`);
            }
        });

        // Check form has novalidate (for custom validation)
        if (form.hasAttribute('novalidate')) {
            this.pass('Form uses custom validation (novalidate attribute present)');
        } else {
            this.warning('Form does not have novalidate attribute');
        }
    }

    async checkInputValidation() {
        console.log('\n%c4. Checking Input Validation', 'color: purple; font-weight: bold;');
        
        const nameField = document.getElementById('user-name');
        const emailField = document.getElementById('user-email');
        const messageField = document.getElementById('user-message');

        if (!nameField || !emailField || !messageField) {
            this.fail('One or more form fields missing');
            return;
        }

        // Test name field pattern
        nameField.value = 'Test@123'; // Invalid
        nameField.dispatchEvent(new Event('input'));
        await this.sleep(100);
        
        const nameError = document.getElementById('name-error');
        if (nameError && !nameError.classList.contains('hidden')) {
            this.pass('Name field validation working (rejects invalid characters)');
        } else {
            this.warning('Name field validation may not be working correctly');
        }

        // Test email field
        emailField.value = 'invalid-email';
        emailField.dispatchEvent(new Event('input'));
        await this.sleep(100);
        
        const emailError = document.getElementById('email-error');
        if (emailError && !emailError.classList.contains('hidden')) {
            this.pass('Email field validation working (rejects invalid format)');
        } else {
            this.warning('Email field validation may not be working correctly');
        }

        // Reset fields
        nameField.value = '';
        emailField.value = '';
        messageField.value = '';
    }

    checkBotProtection() {
        console.log('\n%c5. Checking Bot Protection', 'color: purple; font-weight: bold;');
        
        // Check for honeypot (already checked in form structure)
        const honeypot = document.querySelector('[name="website_url"]');
        if (honeypot) {
            this.pass('Honeypot field present for bot detection');
        }

        // Check if EmailJS blocks headless browsers
        if (typeof emailjs !== 'undefined') {
            this.pass('EmailJS SDK loaded (includes headless browser detection)');
        } else {
            this.fail('EmailJS SDK not loaded');
        }
    }

    checkRateLimiting() {
        console.log('\n%c6. Checking Rate Limiting', 'color: purple; font-weight: bold;');
        
        // Check if rate limit config exists
        if (typeof EMAIL_CONFIG !== 'undefined' && EMAIL_CONFIG.rateLimit) {
            this.pass('Rate limiting configured in EMAIL_CONFIG');
        } else {
            this.warning('Rate limiting configuration not found');
        }
    }

    checkCSRFProtection() {
        console.log('\n%c7. Checking CSRF Protection', 'color: purple; font-weight: bold;');
        
        const csrfToken = document.getElementById('csrf-token');
        if (!csrfToken) {
            this.fail('CSRF token field not found');
            return;
        }

        // Check if token has a value
        if (csrfToken.value && csrfToken.value.length > 0) {
            this.pass('CSRF token generated and present');
            
            // Check token length (should be 32 chars)
            if (csrfToken.value.length >= 32) {
                this.pass('CSRF token has sufficient length');
            } else {
                this.warning('CSRF token may be too short');
            }
        } else {
            this.fail('CSRF token is empty');
        }

        // Check sessionStorage
        const storedToken = sessionStorage.getItem('csrf_token');
        if (storedToken) {
            this.pass('CSRF token stored in sessionStorage');
        } else {
            this.warning('CSRF token not found in sessionStorage');
        }
    }

    printResults() {
        console.log('\n=====================================');
        console.log('%c📊 Security Audit Results', 'color: blue; font-size: 18px; font-weight: bold;');
        console.log('=====================================\n');
        
        console.log(`%c✅ Passed: ${this.passed}`, 'color: green; font-weight: bold;');
        console.log(`%c❌ Failed: ${this.failed}`, 'color: red; font-weight: bold;');
        console.log(`%c⚠️  Warnings: ${this.warnings}`, 'color: orange; font-weight: bold;');
        console.log('=====================================\n');

        if (this.failed === 0 && this.warnings === 0) {
            console.log('%c🎉 Excellent! All security checks passed!', 'color: green; font-size: 16px; font-weight: bold;');
        } else if (this.failed === 0) {
            console.log('%c✓ Good! No critical failures, but review warnings.', 'color: orange; font-size: 16px; font-weight: bold;');
        } else {
            console.log('%c✗ Action Required! Fix the failed checks before deployment.', 'color: red; font-size: 16px; font-weight: bold;');
        }

        console.log('\nDetailed recommendations in SECURITY_IMPLEMENTATION.md');
    }

    pass(message) {
        console.log(`%c✓ PASS: ${message}`, 'color: green');
        this.passed++;
        this.results.push({ status: 'PASS', message });
    }

    fail(message) {
        console.log(`%c✗ FAIL: ${message}`, 'color: red');
        this.failed++;
        this.results.push({ status: 'FAIL', message });
    }

    warning(message) {
        console.log(`%c⚠ WARN: ${message}`, 'color: orange');
        this.warnings++;
        this.results.push({ status: 'WARN', message });
    }

    sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}

// Auto-run audit when script loads
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        setTimeout(() => {
            const audit = new SecurityAudit();
            audit.runAudit();
        }, 1000); // Wait 1 second for everything to initialize
    });
} else {
    setTimeout(() => {
        const audit = new SecurityAudit();
        audit.runAudit();
    }, 1000);
}

// Export for manual execution
if (typeof window !== 'undefined') {
    window.runSecurityAudit = () => {
        const audit = new SecurityAudit();
        return audit.runAudit();
    };
    
    console.log('%c💡 Tip: Run "runSecurityAudit()" in console to re-run the audit', 'color: blue; font-style: italic;');
}
