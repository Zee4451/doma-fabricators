# Server Configuration Guide - Security Headers

## Important Note

Some security headers **CANNOT** be set via HTML meta tags and must be configured on your web server:
- ❌ X-Frame-Options (meta tag doesn't work)
- ❌ X-Content-Type-Options (meta tag doesn't work)
- ❌ X-XSS-Protection (meta tag doesn't work)
- ✅ Content-Security-Policy (works in meta tag, but better in HTTP header)

---

## Apache (.htaccess)

Create or edit `.htaccess` file in your website root:

```apache
# Enable Rewrite Engine
RewriteEngine On

# Force HTTPS
RewriteCond %{HTTPS} off
RewriteRule ^(.*)$ https://%{HTTP_HOST}%{REQUEST_URI} [L,R=301]

# Security Headers
<IfModule mod_headers.c>
    # Prevent clickjacking
    Header always set X-Frame-Options "SAMEORIGIN"
    
    # Prevent MIME type sniffing
    Header always set X-Content-Type-Options "nosniff"
    
    # Enable XSS filtering
    Header always set X-XSS-Protection "1; mode=block"
    
    # Content Security Policy
    Header always set Content-Security-Policy "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://cdn.jsdelivr.net https://cdnjs.cloudflare.com https://cdn.tailwindcss.com https://unpkg.com; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; img-src 'self' data: https:; frame-src https://www.google.com; connect-src 'self' https://api.emailjs.com;"
    
    # Referrer Policy
    Header always set Referrer-Policy "strict-origin-when-cross-origin"
    
    # Permissions Policy (formerly Feature-Policy)
    Header always set Permissions-Policy "geolocation=(), microphone=(), camera=()"
</IfModule>

# Remove server signature
ServerSignature Off

# Disable directory browsing
Options -Indexes
```

---

## Nginx

Add to your `nginx.conf` or site configuration:

```nginx
server {
    listen 80;
    server_name yourdomain.com www.yourdomain.com;
    
    # Force HTTPS
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name yourdomain.com www.yourdomain.com;
    
    # SSL Configuration
    ssl_certificate /path/to/cert.pem;
    ssl_certificate_key /path/to/key.pem;
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers HIGH:!aNULL:!MD5;
    
    # Security Headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header Content-Security-Policy "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://cdn.jsdelivr.net https://cdnjs.cloudflare.com https://cdn.tailwindcss.com https://unpkg.com; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; img-src 'self' data: https:; frame-src https://www.google.com; connect-src 'self' https://api.emailjs.com;" always;
    add_header Referrer-Policy "strict-origin-when-cross-origin" always;
    add_header Permissions-Policy "geolocation=(), microphone=(), camera=()" always;
    
    # Hide server version
    server_tokens off;
    
    # Root directory
    root /var/www/yourdomain;
    index index.html;
    
    location / {
        try_files $uri $uri/ =404;
    }
}
```

---

## Netlify

Create `_headers` file in your site root:

```
/*
  X-Frame-Options: SAMEORIGIN
  X-Content-Type-Options: nosniff
  X-XSS-Protection: 1; mode=block
  Content-Security-Policy: default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://cdn.jsdelivr.net https://cdnjs.cloudflare.com https://cdn.tailwindcss.com https://unpkg.com; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; img-src 'self' data: https:; frame-src https://www.google.com; connect-src 'self' https://api.emailjs.com;
  Referrer-Policy: strict-origin-when-cross-origin
  Permissions-Policy: geolocation=(), microphone=(), camera=()
```

Or in `netlify.toml`:

```toml
[[headers]]
  for = "/*"
  [headers.values]
    X-Frame-Options = "SAMEORIGIN"
    X-Content-Type-Options = "nosniff"
    X-XSS-Protection = "1; mode=block"
    Content-Security-Policy = "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://cdn.jsdelivr.net https://cdnjs.cloudflare.com https://cdn.tailwindcss.com https://unpkg.com; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; img-src 'self' data: https:; frame-src https://www.google.com; connect-src 'self' https://api.emailjs.com;"
    Referrer-Policy = "strict-origin-when-cross-origin"
    Permissions-Policy = "geolocation=(), microphone=(), camera=()"
```

---

## Vercel

Create `vercel.json` in your project root:

```json
{
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        {
          "key": "X-Frame-Options",
          "value": "SAMEORIGIN"
        },
        {
          "key": "X-Content-Type-Options",
          "value": "nosniff"
        },
        {
          "key": "X-XSS-Protection",
          "value": "1; mode=block"
        },
        {
          "key": "Content-Security-Policy",
          "value": "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://cdn.jsdelivr.net https://cdnjs.cloudflare.com https://cdn.tailwindcss.com https://unpkg.com; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; img-src 'self' data: https:; frame-src https://www.google.com; connect-src 'self' https://api.emailjs.com;"
        },
        {
          "key": "Referrer-Policy",
          "value": "strict-origin-when-cross-origin"
        },
        {
          "key": "Permissions-Policy",
          "value": "geolocation=(), microphone=(), camera=()"
        }
      ]
    }
  ]
}
```

---

## GitHub Pages

GitHub Pages has limited header support. Use a custom domain with Cloudflare:

### Cloudflare Workers (Free Tier)

Create a Worker to add headers:

```javascript
addEventListener('fetch', event => {
  event.respondWith(addHeaders(event.request))
})

async function addHeaders(request) {
  const response = await fetch(request)
  const newHeaders = new Headers(response.headers)
  
  newHeaders.set('X-Frame-Options', 'SAMEORIGIN')
  newHeaders.set('X-Content-Type-Options', 'nosniff')
  newHeaders.set('X-XSS-Protection', '1; mode=block')
  newHeaders.set('Content-Security-Policy', "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://cdn.jsdelivr.net https://cdnjs.cloudflare.com https://cdn.tailwindcss.com https://unpkg.com; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; img-src 'self' data: https:; frame-src https://www.google.com; connect-src 'self' https://api.emailjs.com;")
  newHeaders.set('Referrer-Policy', 'strict-origin-when-cross-origin')
  
  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers: newHeaders
  })
}
```

---

## IIS (web.config)

Add to your `web.config`:

```xml
<?xml version="1.0" encoding="UTF-8"?>
<configuration>
  <system.webServer>
    <httpProtocol>
      <customHeaders>
        <add name="X-Frame-Options" value="SAMEORIGIN" />
        <add name="X-Content-Type-Options" value="nosniff" />
        <add name="X-XSS-Protection" value="1; mode=block" />
        <add name="Content-Security-Policy" value="default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://cdn.jsdelivr.net https://cdnjs.cloudflare.com https://cdn.tailwindcss.com https://unpkg.com; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; img-src 'self' data: https:; frame-src https://www.google.com; connect-src 'self' https://api.emailjs.com;" />
        <add name="Referrer-Policy" value="strict-origin-when-cross-origin" />
      </customHeaders>
    </httpProtocol>
  </system.webServer>
</configuration>
```

---

## Testing Your Headers

After configuring, test your headers:

### Online Tools:
1. [Security Headers](https://securityheaders.com/)
2. [Mozilla Observatory](https://observatory.mozilla.org/)
3. [CSP Evaluator](https://csp-evaluator.withgoogle.com/)

### Browser DevTools:
```javascript
// Open console and run:
fetch(window.location.href)
  .then(response => {
    console.log('X-Frame-Options:', response.headers.get('X-Frame-Options'));
    console.log('X-Content-Type-Options:', response.headers.get('X-Content-Type-Options'));
    console.log('Content-Security-Policy:', response.headers.get('Content-Security-Policy'));
  });
```

### Command Line:
```bash
curl -I https://yourdomain.com
```

---

## Current Status

✅ **Working (via meta tags):**
- Content-Security-Policy (partially)
- Referrer-Policy

❌ **Not Working (needs server config):**
- X-Frame-Options
- X-Content-Type-Options
- X-XSS-Protection

---

## Quick Fix for Development

For local development with Live Server or similar, the meta tag CSP is sufficient. The warnings you see are expected and won't affect functionality.

For production deployment, choose the appropriate server configuration above.

---

## Recommended Minimum Headers

At minimum, configure these on your production server:

```
X-Frame-Options: SAMEORIGIN
X-Content-Type-Options: nosniff
Content-Security-Policy: (as configured)
Referrer-Policy: strict-origin-when-cross-origin
```

---

**Note:** The EmailJS warning you see is expected - you need to replace the placeholder credentials with your actual keys. See `CREDENTIAL_SECURITY.md` for instructions.
