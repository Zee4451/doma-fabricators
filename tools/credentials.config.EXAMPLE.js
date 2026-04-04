//  # ============================================
// # EMAILJS CREDENTIALS TEMPLATE
// # ============================================
// # 
// # INSTRUCTIONS:
// # 1. Copy this file to 'credentials.config.js'
// # 2. Replace placeholder values with your actual credentials
// # 3. NEVER commit 'credentials.config.js' to version control
// # 4. Add 'credentials.config.js' to .gitignore (already done)
// #
// # GET YOUR CREDENTIALS FROM:
// # https://dashboard.emailjs.com/
// # ============================================

const EMAIL_CREDENTIALS = {
    // Get from: Account → API Keys
    publicKey: "user_YOUR_PUBLIC_KEY_HERE",
    
    // Get from: Email Services → Your Service
    serviceId: "service_YOUR_SERVICE_ID_HERE",
    
    // Get from: Email Templates → Your Template
    templateId: "template_YOUR_TEMPLATE_ID_HERE"
};

// Export for use in your application
if (typeof module !== 'undefined' && module.exports) {
    module.exports = EMAIL_CREDENTIALS;
}

// For browser usage, you can copy these values to index.html
console.log('%c⚠️ SECURITY WARNING', 'color: red; font-size: 20px; font-weight: bold;');
console.log('%cNever commit this file with real credentials to version control!', 'color: orange; font-size: 14px;');
