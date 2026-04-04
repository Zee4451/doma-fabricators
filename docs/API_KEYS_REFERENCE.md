# 🔑 EmailJS Configuration - Quick Reference

## ⚠️ IMPORTANT: Replace these placeholder values in index.html

### Current Placeholders to Update:

1. **Line ~30** - Public Key Initialization:
   ```javascript
   publicKey: "YOUR_PUBLIC_KEY"  // ← CHANGE THIS
   ```

2. **Line ~1860** - Service and Template IDs:
   ```javascript
   serviceId: 'YOUR_SERVICE_ID'    // ← CHANGE THIS
   templateId: 'YOUR_TEMPLATE_ID'  // ← CHANGE THIS
   ```

---

## 📝 Where to Find Your Keys

### 1. Public Key
- Login to EmailJS Dashboard
- Navigate to: **Account** → **API Keys**
- Copy the **Public Key** (format: `user_xxxxxxxxxxxxx`)

### 2. Service ID
- Go to: **Email Services**
- Find your connected email service
- Copy the **Service ID** (format: `service_xxxxxxx`)

### 3. Template ID
- Go to: **Email Templates**
- Select your contact form template
- Copy the **Template ID** (format: `template_xxxxxxx`)

---

## ✏️ Example Configuration

After setup, your code should look like this:

```javascript
// EmailJS Initialization (line ~30)
emailjs.init({
    publicKey: "user_abc123def456ghi789",
    blockHeadless: true,
    limitRate: {
        id: "contact-form",
        throttle: 10000
    }
});

// Form Configuration (line ~1860)
this.config = {
    serviceId: 'service_xyz789abc',
    templateId: 'template_qwe456rty',
    maxAttempts: 3,
    rateLimitWindow: 60000,
    honeypotField: 'website_url',
    minSubmissionTime: 3000,
    formStartTime: Date.now()
};
```

---

## 🔒 Security Checklist

Before going live, verify:

- [ ] Public Key is set correctly
- [ ] Service ID is set correctly  
- [ ] Template ID is set correctly
- [ ] Test email was received successfully
- [ ] Form validation works (try invalid inputs)
- [ ] Rate limiting works (submit 3+ times quickly)
- [ ] Honeypot is hidden (inspect element to verify)
- [ ] CSRF token is generated (check hidden input)
- [ ] No console errors on form submission

---

## 🚀 Testing Checklist

### Valid Submission Test
- [ ] Fill all fields with valid data
- [ ] Wait 3+ seconds
- [ ] Click Submit
- [ ] See success message
- [ ] Receive email

### Validation Tests
- [ ] Empty name → Error shown
- [ ] Invalid email → Error shown
- [ ] Special chars in name → Error shown
- [ ] Message < 10 chars → Error shown
- [ ] Message > 2000 chars → Counter turns red

### Security Tests
- [ ] Submit immediately (< 3s) → Blocked
- [ ] Submit 4 times in 1 minute → Rate limited
- [ ] View page source → Honeypot field exists but hidden

---

## 📧 Sample Email Template

Copy this into your EmailJS template:

```
Subject: New Contact from {{from_name}} - DOMA Fabricators

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
NEW CONTACT FORM SUBMISSION
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

👤 Name: {{from_name}}
📧 Email: {{reply_to}}
🕐 Time: {{timestamp}}

💬 Message:
{{message}}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
TECHNICAL DETAILS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Browser: {{user_agent}}
CSRF Token: {{csrf_token}}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Reply directly to: {{reply_to}}
```

---

## 🆘 Need Help?

1. Check browser console for errors (F12)
2. Verify all three IDs are updated
3. Review EMAILJS_SETUP.md for detailed instructions
4. Test with valid data first
5. Check EmailJS dashboard for delivery status

---

**Remember:** Never share your Private Key or commit API keys to public repositories!
