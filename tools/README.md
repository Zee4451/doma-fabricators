# 🛠️ Development Tools

This folder contains development utilities and testing scripts for the DOMA Fabricators website.

---

## 📦 Available Tools

### 1. **security-audit.js**
**Purpose:** Automated security testing script  
**Usage:** Load in browser console to run comprehensive security checks

#### How to Use:

**Option A: Temporary Load (Recommended)**
```html
<!-- Add this line temporarily to index.html for testing -->
<script src="tools/security-audit.js"></script>
```

Then open browser console and run:
```javascript
runSecurityAudit()
```

**Option B: Direct Console Execution**
Copy and paste the entire script into browser console, then run:
```javascript
const audit = new SecurityAudit();
audit.runAudit();
```

#### What It Checks:
- ✅ Credentials configuration
- ✅ Security headers presence
- ✅ Form structure validation
- ✅ Input validation functionality
- ✅ Bot protection mechanisms
- ✅ Rate limiting setup
- ✅ CSRF token generation

#### Output:
Provides pass/fail/warning results with detailed explanations.

---

### 2. **credentials.config.EXAMPLE.js**
**Purpose:** Template for managing EmailJS credentials  
**Usage:** Reference file showing credential structure

#### How to Use:

1. **Copy the template:**
   ```bash
   copy credentials.config.EXAMPLE.js credentials.config.js
   ```

2. **Edit `credentials.config.js`:**
   ```javascript
   const EMAIL_CREDENTIALS = {
       publicKey: "user_YOUR_ACTUAL_KEY",
       serviceId: "service_YOUR_ID",
       templateId: "template_YOUR_ID"
   };
   ```

3. **Use in your project:**
   - Copy values to `index.html` EMAIL_CONFIG object
   - OR import if using a build tool

#### ⚠️ Important:
- **NEVER commit `credentials.config.js`** with real credentials
- This EXAMPLE file is safe to commit (has placeholders)
- Always use `.gitignore` to exclude real credential files

---

## 🔒 Security Notes

### For security-audit.js:
- Safe to commit (no sensitive data)
- Only reveals what's already visible in browser
- Useful for periodic security checks
- Run before major deployments

### For credentials.config.EXAMPLE.js:
- Safe to commit (contains only placeholders)
- Helps developers understand required structure
- Actual credentials should NEVER be in version control

---

## 💡 Best Practices

### Using Security Audit:
1. Run after making security-related changes
2. Run before deploying to production
3. Run periodically (monthly recommended)
4. Document any failures and fix them
5. Share results with team

### Managing Credentials:
1. Keep real credentials out of version control
2. Use environment variables when possible
3. Rotate credentials regularly
4. Monitor EmailJS dashboard for unusual activity
5. Use separate credentials for dev/prod environments

---

## 🔄 Updating Tools

When updating these tools:
1. Test thoroughly before committing
2. Update this README if functionality changes
3. Document breaking changes
4. Version major updates
5. Notify team of important changes

---

## 📞 Support

- **Security Issues:** See `/docs/SECURITY_IMPLEMENTATION.md`
- **Credential Setup:** See `/docs/CREDENTIAL_SECURITY.md`
- **General Questions:** Check main project README

---

## 🚀 Future Tools

Potential additions:
- Performance audit script
- Accessibility testing tool
- SEO checker
- Build optimization scripts
- Deployment automation

---

**Last Updated:** April 2026  
**Maintained By:** DOMA Fabricators Development Team
