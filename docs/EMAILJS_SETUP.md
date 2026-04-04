# EmailJS Secure Contact Form Setup Guide

## Overview
Your contact form now includes enterprise-grade security features with EmailJS integration. This guide will walk you through the setup process.

---

## 🔐 Security Features Implemented

### 1. **Input Validation & Sanitization**
- Real-time field validation with visual feedback
- XSS protection through input sanitization
- Pattern matching for name fields (letters, spaces, hyphens, apostrophes only)
- Email format validation
- Character limits enforced (Name: 100, Email: 254, Message: 2000)

### 2. **Bot Protection**
- **Honeypot Field**: Hidden field that catches automated bots
- **Minimum Submission Time**: Prevents rapid-fire submissions (< 3 seconds blocked)
- **Headless Browser Detection**: Blocks automated testing tools

### 3. **Rate Limiting**
- Maximum 3 attempts per minute
- Throttling between submissions (10 seconds)
- Automatic cooldown period after failed attempts

### 4. **CSRF Protection**
- Dynamic token generation using crypto API
- Token validation on each submission
- Session-based token storage
- Token regeneration after successful submission

### 5. **User Experience**
- Real-time character counter
- Visual error indicators
- Loading state with spinner
- Success/error status messages
- Form auto-reset after successful submission

---

## 📋 Setup Instructions

### Step 1: Create EmailJS Account

1. Go to [https://www.emailjs.com/](https://www.emailjs.com/)
2. Click "Sign Up Free"
3. Create your account (free tier includes 200 emails/month)

### Step 2: Add Email Service

1. After logging in, go to **Email Services**
2. Click **"Add New Service"**
3. Choose your email provider (Gmail, Outlook, etc.)
4. Follow the connection wizard
5. Note down your **Service ID** (looks like: `service_xxxxxxx`)

#### For Gmail:
- Click "Connect Account"
- Authorize EmailJS to access your Gmail
- Your Service ID will be displayed

### Step 3: Create Email Template

1. Go to **Email Templates**
2. Click **"Create New Template"**
3. Use this template structure:

```html
Subject: New Contact Form Submission from {{from_name}}

Message Details:
━━━━━━━━━━━━━━━━━━━━━━━
From: {{from_name}}
Email: {{reply_to}}
Timestamp: {{timestamp}}

Message:
{{message}}

━━━━━━━━━━━━━━━━━━━━━━━
Technical Info:
User Agent: {{user_agent}}
CSRF Token: {{csrf_token}}
```

4. Save the template
5. Note down your **Template ID** (looks like: `template_xxxxxxx`)

### Step 4: Get Your Public Key

1. Go to **Account** → **API Keys**
2. Copy your **Public Key** (looks like: `user_xxxxxxxxxxxxx`)

### Step 5: Update index.html

Replace the placeholder values in your `index.html` file:

#### Location 1: EmailJS Initialization (around line 30)
```javascript
emailjs.init({
    publicKey: "YOUR_PUBLIC_KEY", // ← Replace with your actual public key
    blockHeadless: true,
    limitRate: {
        id: "contact-form",
        throttle: 10000
    }
});
```

#### Location 2: Form Configuration (around line 1860)
```javascript
this.config = {
    serviceId: 'YOUR_SERVICE_ID',    // ← Replace with your service ID
    templateId: 'YOUR_TEMPLATE_ID',  // ← Replace with your template ID
    maxAttempts: 3,
    rateLimitWindow: 60000,
    honeypotField: 'website_url',
    minSubmissionTime: 3000,
    formStartTime: Date.now()
};
```

**Example:**
```javascript
// Before:
publicKey: "YOUR_PUBLIC_KEY"
serviceId: 'YOUR_SERVICE_ID'
templateId: 'YOUR_TEMPLATE_ID'

// After:
publicKey: "user_abc123def456"
serviceId: 'service_xyz789'
templateId: 'template_qwe456'
```

---

## 🧪 Testing

### Test Successful Submission
1. Fill out all form fields with valid data
2. Wait at least 3 seconds before submitting
3. Click "Submit Request"
4. You should see a green success message
5. Check your email inbox for the message

### Test Validation
1. Try submitting with empty fields → Should show errors
2. Enter invalid email format → Should show error
3. Enter special characters in name → Should show error
4. Type more than 2000 characters in message → Counter turns red

### Test Bot Protection
1. Try submitting immediately after page load (< 3 seconds) → Should be blocked
2. Submit 3 times within 1 minute → Should show rate limit message

---

## 🔒 Security Best Practices

### ✅ What's Protected
- SQL injection (sanitized inputs)
- XSS attacks (HTML entity encoding)
- CSRF attacks (token validation)
- Spam bots (honeypot + timing checks)
- Brute force (rate limiting)
- Automated scripts (headless browser detection)

### ⚠️ Important Notes

1. **Never expose your Private Key** - Only use the Public Key in frontend code
2. **Monitor your EmailJS dashboard** - Check for unusual activity
3. **Upgrade plan if needed** - Free tier: 200 emails/month
4. **Keep API keys secure** - Don't commit them to public repositories
5. **Regular updates** - Keep EmailJS SDK updated

### 🛡️ Additional Recommendations

For production deployment, consider:

1. **Environment Variables**: Store API keys in environment variables
   ```javascript
   // In production build process
   publicKey: process.env.EMAILJS_PUBLIC_KEY
   ```

2. **Backend Verification**: Add server-side validation
   ```javascript
   // Verify CSRF token on backend
   if (req.body.csrf_token !== session.csrf_token) {
       return res.status(403).json({ error: 'Invalid token' });
   }
   ```

3. **IP-based Rate Limiting**: Implement server-side rate limiting
4. **reCAPTCHA**: Add Google reCAPTCHA for extra bot protection
5. **HTTPS Only**: Ensure your site uses HTTPS in production

---

## 📊 Monitoring & Analytics

EmailJS provides:
- Email delivery status
- Open rates (if enabled)
- Error logs
- Usage statistics

Check your dashboard regularly at: [https://dashboard.emailjs.com/](https://dashboard.emailjs.com/)

---

## 🆘 Troubleshooting

### Issue: Emails not sending
**Solution:**
- Verify Service ID and Template ID are correct
- Check EmailJS dashboard for errors
- Ensure email service is properly connected
- Check browser console for error messages

### Issue: "Too many attempts" error
**Solution:**
- Wait 60 seconds before trying again
- Clear browser cache and cookies
- Check if rate limiting is too aggressive

### Issue: Form validation not working
**Solution:**
- Check browser console for JavaScript errors
- Ensure all field IDs match (`user-name`, `user-email`, `user-message`)
- Verify EmailJS SDK is loaded correctly

### Issue: Honeypot blocking legitimate users
**Solution:**
- This shouldn't happen as the field is hidden with CSS
- If it does, check that no browser extensions are filling hidden fields

---

## 📞 Support

- EmailJS Documentation: [https://www.emailjs.com/docs/](https://www.emailjs.com/docs/)
- EmailJS Support: support@emailjs.com
- Community Forum: [https://forum.emailjs.com/](https://forum.emailjs.com/)

---

## 🎯 Next Steps

1. ✅ Set up EmailJS account
2. ✅ Configure service and template
3. ✅ Update API keys in index.html
4. ✅ Test form submission
5. ✅ Monitor first few submissions
6. ✅ Consider adding reCAPTCHA for extra security
7. ✅ Set up email notifications for new submissions

---

**Your contact form is now protected with enterprise-grade security!** 🎉
