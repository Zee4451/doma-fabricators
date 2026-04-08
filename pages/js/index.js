// ============================================
// SECURE CREDENTIAL MANAGEMENT
// ============================================
// 
// SECURITY NOTE: EmailJS Public Keys are designed to be client-side.
// They can only SEND emails using your pre-configured templates.
// They CANNOT read emails or access your account.
//
// For production, consider:
// 1. Using environment variables with a build tool (Vite, Webpack)
// 2. Implementing a backend proxy for additional security
// 3. Setting up domain restrictions in EmailJS dashboard
//
// IMPORTANT: Never expose Private Keys or Service Account credentials!
// ============================================

// Configuration object - Replace these values before deployment
const EMAIL_CONFIG = {
    // Get your Public Key from: https://dashboard.emailjs.com/admin/account
    publicKey: "YOUR_PUBLIC_KEY", // ← REPLACE THIS WITH YOUR ACTUAL KEY
    
    // Rate limiting configuration
    rateLimit: {
        id: "contact-form",
        throttle: 10000 // 10 seconds between submissions
    },
    
    // Security settings
    security: {
        blockHeadless: true, // Block automated bots
        blockListed: true,   // Block known malicious IPs
        requireUserInteraction: true // Require genuine user interaction
    }
};

// Initialize EmailJS with security features
(function() {
    // Validate configuration before initialization
    if (!EMAIL_CONFIG.publicKey || EMAIL_CONFIG.publicKey === "YOUR_PUBLIC_KEY") {
        console.warn('%c⚠️ EmailJS Not Configured', 'color: orange; font-size: 16px; font-weight: bold;');
        console.warn('Please update EMAIL_CONFIG.publicKey in index.html with your actual EmailJS Public Key.');
        console.warn('Get your key from: https://dashboard.emailjs.com/admin/account');
        return;
    }
    
    emailjs.init({
        publicKey: EMAIL_CONFIG.publicKey,
        blockHeadless: EMAIL_CONFIG.security.blockHeadless,
        blockListed: EMAIL_CONFIG.security.blockListed,
        limitRate: EMAIL_CONFIG.rateLimit
    });
    
    console.log('%c✓ EmailJS Initialized Successfully', 'color: green; font-weight: bold;');
})();

// ============================================
// MAIN APPLICATION CODE
// ============================================

document.addEventListener('DOMContentLoaded', function() {
    gsap.registerPlugin(ScrollTrigger);

    // Performance Check & cleanup
    let activeAnimations = [];
    const addToCleanup = (anim) => activeAnimations.push(anim);

    // Hero Slider Logic
    const slides = document.querySelectorAll('.slide');
    const imgs = document.querySelectorAll('.slide img');
    const texts = document.querySelectorAll('.slide-text');
    let current = 0;
    let total = slides.length;

    // Set initial state: only first slide visible
    gsap.set(slides, { opacity: 0, zIndex: 0 });
    gsap.set(slides[0], { opacity: 1, zIndex: 1 });
    gsap.set(imgs[0], { scale: 1.15 });
    gsap.set(texts, { opacity: 0, zIndex: 0 });
    gsap.set(texts[0], { opacity: 1, zIndex: 3 });

    // Animate current image zooming out slowly
    gsap.to(imgs[0], { scale: 1.0, duration: 5, ease: "none" });

    function goToNext() {
      const next = (current + 1) % total;
      const tl = gsap.timeline();

      // Set next slide behind, reset its image scale and text opacity
      gsap.set(slides[next], { zIndex: 0, opacity: 0 });
      gsap.set(imgs[next], { scale: 1.15 });
      gsap.set(texts[next], { opacity: 0, zIndex: 0 });

      // Bring next slide on top with synchronized animation
      tl.set(slides[next], { zIndex: 2 })
        .set(texts[next], { zIndex: 3 })
        .to(slides[next], { opacity: 1, duration: 1.2, ease: "power2.inOut" }, 0)
        .to(texts[next], { opacity: 1, duration: 1.2, ease: "power2.inOut" }, 0)
        .to(imgs[next], { scale: 1.0, duration: 5, ease: "none" }, 0)
        .to(slides[current], { opacity: 0, duration: 1.2, ease: "power2.inOut" }, 0)
        .to(texts[current], { opacity: 0, duration: 1.2, ease: "power2.inOut" }, 0)
        .set(slides[current], { zIndex: 0 })
        .set(texts[current], { zIndex: 0 });

      current = next;
    }

    setInterval(goToNext, 5000);

// 1. Lenis Smooth Scroll — synced with GSAP ticker
const lenis = new Lenis({
    duration: 1.2,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    wheelMultiplier: 1.0,
    smoothWheel: true,
    autoRaf: false, // We drive raf manually via GSAP
});

// Sync Lenis scroll position with GSAP ScrollTrigger
lenis.on('scroll', ScrollTrigger.update);

// Drive Lenis from GSAP's single ticker (eliminates double-rAF)
gsap.ticker.add((time) => {
    lenis.raf(time * 1000); // GSAP ticker time is in seconds
});
gsap.ticker.lagSmoothing(0); // Prevent GSAP from throttling on lag

// 3. Background Grid — lightweight velocity-based offset (no per-frame tween creation)
let bgGridY = 0;
const bgGrid = document.getElementById('bg-grid');
if (bgGrid) {
    gsap.ticker.add(() => {
        const target = lenis.velocity * 0.1;
        bgGridY += (target - bgGridY) * 0.1; // simple lerp
        bgGrid.style.transform = `translateY(${bgGridY}px)`;
    });
}

// 5. 3D Tilt Effect for Cards - Disabled on mobile for performance
const isMobileDevice = window.innerWidth <= 768;

if (!isMobileDevice) {
    const tiltCards = document.querySelectorAll('.tilt-card');
    tiltCards.forEach(card => {
        let tiltRAF = null;
        let tiltX = 0, tiltY = 0;
        card.addEventListener('mousemove', (e) => {
            // Cache mouse position but only animate on next tick
            const rect = card.getBoundingClientRect();
            tiltX = e.clientX - rect.left - rect.width / 2;
            tiltY = e.clientY - rect.top - rect.height / 2;
            if (!tiltRAF) {
                tiltRAF = requestAnimationFrame(() => {
                    gsap.to(card, {
                        rotateX: -tiltY / 20,
                        rotateY: tiltX / 20,
                        x: tiltX * 0.05,
                        y: tiltY * 0.05,
                        duration: 0.5,
                        ease: 'power2.out',
                        overwrite: 'auto'
                    });
                    tiltRAF = null;
                });
            }
        });
        card.addEventListener('mouseleave', () => {
            if (tiltRAF) { cancelAnimationFrame(tiltRAF); tiltRAF = null; }
            gsap.to(card, { rotateX: 0, rotateY: 0, x: 0, y: 0, duration: 0.8, ease: 'elastic.out(1, 0.3)', overwrite: 'auto' });
        });
    });
}

// 6. Magnetic Elements - Reduced sensitivity on mobile
document.querySelectorAll('.magnetic-btn').forEach(btn => {
    let magRAF = null;
    let magX = 0, magY = 0;
    btn.addEventListener('mousemove', (e) => {
        const rect = btn.getBoundingClientRect();
        magX = e.clientX - rect.left - rect.width / 2;
        magY = e.clientY - rect.top - rect.height / 2;
        if (!magRAF) {
            magRAF = requestAnimationFrame(() => {
                const strength = 0.4;
                gsap.to(btn, { x: magX * strength, y: magY * strength, duration: 0.3, ease: 'power2.out', overwrite: 'auto' });
                magRAF = null;
            });
        }
    });
    btn.addEventListener('mouseleave', () => {
        if (magRAF) { cancelAnimationFrame(magRAF); magRAF = null; }
        gsap.to(btn, { x: 0, y: 0, duration: 0.6, ease: 'elastic.out(1, 0.3)', overwrite: 'auto' });
    });
});

// 7. Core Reveals
const maskWrappers = document.querySelectorAll('.mask-reveal-wrapper');
maskWrappers.forEach(wrapper => {
    addToCleanup(gsap.to(wrapper, {
        scrollTrigger: { trigger: wrapper, start: 'top 90%' },
        clipPath: 'polygon(0 0, 100% 0, 100% 100%, 0% 100%)',
        duration: 1.5,
        ease: 'power4.inOut'
    }));
});

document.querySelectorAll('.divider-draw').forEach(divider => {
    addToCleanup(gsap.to(divider, {
        scrollTrigger: { trigger: divider, start: 'top 90%' },
        scaleX: 1,
        duration: 1.5,
        ease: 'power4.inOut'
    }));
});

document.querySelectorAll('.reveal-mask span').forEach(reveal => {
    addToCleanup(gsap.from(reveal, {
        scrollTrigger: { trigger: reveal, start: 'top 95%' },
        y: 100,
        skewY: 5,
        duration: 1.2,
        ease: 'power4.out',
    }));
});

// Project Hovers - GSAP animations
const projectRows = document.querySelectorAll('.project-row');
const projectBgPreview = document.getElementById('project-bg-preview');
projectRows.forEach(row => {
    row.addEventListener('mouseenter', () => {
        projectBgPreview.style.backgroundImage = `url(${row.getAttribute('data-bg')})`;
        gsap.to(projectBgPreview, { opacity: 0.05, duration: 0.5 });
    });
    row.addEventListener('mouseleave', () => gsap.to(projectBgPreview, { opacity: 0, duration: 0.5 }));
});

// Parallax - Optimized for mobile performance
const allParallaxImgs = document.querySelectorAll('.parallax-img');
allParallaxImgs.forEach(img => {
    // Skip parallax on mobile for better performance, keep only essential ones
    if (isMobileDevice && !img.closest('#about')) {
        return; // Skip non-critical parallax on mobile
    }
    
    addToCleanup(gsap.to(img, {
        scrollTrigger: {
            trigger: img.parentElement,
            start: 'top bottom',
            end: 'bottom top',
            scrub: 0.5 // Smooth scrub instead of raw pixel-lock
        },
        y: isMobileDevice ? -10 : -20, // Reduced movement on mobile
        ease: 'none'
    }));
});

// Services Section Parallax - Enhanced for all screen sizes
const isMobile = window.innerWidth <= 768;

if (!isMobile) {
    // Desktop: Full parallax effect
    gsap.to("#parallax-left", {
        x: "0%",
        ease: "none",
        scrollTrigger: {
            trigger: "#services",
            start: "top bottom",
            end: "bottom top",
            scrub: 1.5,
        }
    });

    gsap.to("#parallax-right", {
        x: "0%",
        ease: "none",
        scrollTrigger: {
            trigger: "#services",
            start: "top bottom",
            end: "bottom top",
            scrub: 1.5,
        }
    });
} else {
    // Mobile: Subtle parallax with reduced movement
    gsap.to("#parallax-left", {
        x: "20%",
        ease: "none",
        scrollTrigger: {
            trigger: "#services",
            start: "top bottom",
            end: "bottom top",
            scrub: true,
        }
    });

    gsap.to("#parallax-right", {
        x: "-20%",
        ease: "none",
        scrollTrigger: {
            trigger: "#services",
            start: "top bottom",
            end: "bottom top",
            scrub: true,
        }
    });
}

// Service cards entrance animation with stagger
gsap.from(".service-card", {
    y: 50,
    opacity: 0,
    duration: 0.8,
    stagger: 0.2,
    ease: "power2.out",
    scrollTrigger: {
        trigger: ".service-card",
        start: "top 85%",
    }
});

// Window resize handling — debounced
let resizeTimer;
window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => ScrollTrigger.refresh(), 250);
});

// Hamburger Menu Functionality
const hamburgerBtn = document.getElementById('hamburger-btn');
const mobileMenu = document.getElementById('mobile-menu');
const closeMenuBtn = document.getElementById('close-menu-btn');
const hamburgerIcon = document.getElementById('hamburger-icon');
const mobileLinks = document.querySelectorAll('.mobile-link');
let isMenuOpen = false;

// Toggle menu (open/close)
hamburgerBtn.addEventListener('click', () => {
    if (isMenuOpen) {
        closeMenu();
    } else {
        isMenuOpen = true;
        mobileMenu.classList.remove('translate-x-full');
        hamburgerIcon.textContent = 'close';
        document.body.style.overflow = 'hidden';
        
        mobileLinks.forEach((link, index) => {
            setTimeout(() => {
                link.style.opacity = '1';
                link.querySelector('span').style.transform = 'translateX(0)';
            }, 100 + (index * 50));
        });
    }
});

// Close menu
const closeMenu = () => {
    isMenuOpen = false;
    mobileMenu.classList.add('translate-x-full');
    hamburgerIcon.textContent = 'menu';
    document.body.style.overflow = '';
    
    // Reset links
    mobileLinks.forEach(link => {
        link.style.opacity = '0';
        link.querySelector('span').style.transform = 'translateX(-20px)';
    });
};

// Close menu when clicking close button (with stopPropagation)
closeMenuBtn.addEventListener('click', (e) => {
    e.stopPropagation(); // Prevent event from bubbling to overlay
    closeMenu();
});

// Close menu when clicking on a link
mobileLinks.forEach(link => {
    link.addEventListener('click', closeMenu);
});

// Close menu when clicking outside (on the overlay itself)
mobileMenu.addEventListener('click', (e) => {
    if (e.target === mobileMenu) {
        closeMenu();
    }
});

// Initialize mobile links state
mobileLinks.forEach(link => {
    link.style.opacity = '0';
    link.querySelector('span').style.transform = 'translateX(-20px)';
    link.querySelector('span').style.transition = 'transform 0.3s ease-out';
});

// Industries Carousel Functionality
const carouselTrack = document.getElementById('carousel-track');
if (carouselTrack) {
    const industrialCards = Array.from(document.querySelectorAll('.industrial-card'));
    const prevBtn = document.getElementById('prev-btn');
    const nextBtn = document.getElementById('next-btn');
    const currentSlideEl = document.getElementById('current-slide');
    const totalSlidesEl = document.getElementById('total-slides');
    const progressBar = document.getElementById('progress-bar');
    
    let currentIndex = 1; // Start at Chemical Industry (Index 1)
    const totalSlides = industrialCards.length;
    if (totalSlidesEl) totalSlidesEl.textContent = totalSlides;

    function updateCarousel() {
        const isMobile = window.innerWidth < 768;
        const cardWidth = isMobile ? 256 : 320; 
        const activeWidth = isMobile ? 320 : 450;
        const margin = 24;
        
        // Kill all existing animations to prevent conflicts
        gsap.killTweensOf('.active-card-overlay');
        gsap.killTweensOf('.overlay-title');
        gsap.killTweensOf('.overlay-details');
        gsap.killTweensOf('.technical-svg');
        gsap.killTweensOf('.card-title');
        gsap.killTweensOf(carouselTrack);
        gsap.killTweensOf(progressBar);
        
        industrialCards.forEach((card, index) => {
            const overlay = card.querySelector('.active-card-overlay');
            const title = card.querySelector('.overlay-title');
            const details = card.querySelector('.overlay-details');
            const svg = card.querySelector('.technical-svg');
            const baseTitle = card.querySelector('.card-title');
            const img = card.querySelector('img');

            if (index === currentIndex) {
                // Set dimensions first before animations
                card.style.width = isMobile ? '320px' : '450px';
                card.style.height = isMobile ? '450px' : '550px';
                card.classList.add('active');
                
                // Remove grayscale immediately for active card
                img.classList.remove('grayscale');
                
                // Hide base title immediately
                gsap.set(baseTitle, { opacity: 0 });
                
                // Animate overlay elements in with proper sequencing
                gsap.fromTo(overlay, 
                    { opacity: 0 }, 
                    { opacity: 1, duration: 0.4, ease: "power2.out" }
                );
                gsap.fromTo(title, 
                    { y: 10, opacity: 0 }, 
                    { y: 0, opacity: 1, duration: 0.5, delay: 0.15, ease: "power2.out" }
                );
                gsap.fromTo(details, 
                    { y: 10, opacity: 0 }, 
                    { y: 0, opacity: 1, duration: 0.5, delay: 0.25, ease: "power2.out" }
                );
                gsap.fromTo(svg, 
                    { scale: 0.9, opacity: 0 }, 
                    { scale: 1, opacity: 0.2, duration: 0.6, delay: 0.1, ease: "power2.out" }
                );
            } else {
                // Set dimensions first
                card.style.width = isMobile ? '256px' : '320px';
                card.style.height = '450px';
                card.classList.remove('active');
                
                // Add grayscale immediately for inactive cards
                img.classList.add('grayscale');
                
                // Show base title immediately
                gsap.set(baseTitle, { opacity: 1 });
                
                // Fade out overlay elements
                gsap.to(overlay, { opacity: 0, duration: 0.3, ease: "power2.in" });
                gsap.to([title, details], { 
                    opacity: 0, 
                    y: 10, 
                    duration: 0.3, 
                    ease: "power2.in" 
                });
            }
        });

        // Animate carousel track movement
        const moveX = - (currentIndex * (cardWidth + margin));
        gsap.to(carouselTrack, {
            x: moveX,
            duration: 0.7,
            ease: "power3.inOut"
        });

        // Update counter and progress bar
        if (currentSlideEl) currentSlideEl.textContent = currentIndex + 1;
        const progressPercent = ((currentIndex + 1) / totalSlides) * 100;
        gsap.to(progressBar, {
            width: `${progressPercent}%`,
            duration: 0.7,
            ease: "power3.inOut"
        });
    }

    if (nextBtn) {
        nextBtn.addEventListener('click', () => {
            currentIndex = (currentIndex + 1) % totalSlides;
            updateCarousel();
        });
    }

    if (prevBtn) {
        prevBtn.addEventListener('click', () => {
            currentIndex = (currentIndex - 1 + totalSlides) % totalSlides;
            updateCarousel();
        });
    }

    industrialCards.forEach((card, index) => {
        card.addEventListener('click', () => {
            if (currentIndex !== index) {
                currentIndex = index;
                updateCarousel();
            }
        });
    });

    // Initialize carousel
    updateCarousel();
    window.addEventListener('resize', updateCarousel);
}

    // Cleanup on unmount (best practice)
    window.addEventListener('beforeunload', () => {
        activeAnimations.forEach(a => a.kill());
        lenis.destroy();
    });
}); // End DOMContentLoaded for main app code

// ============================================
// SECURE CONTACT FORM WITH EMAILJS
// ============================================

class SecureContactForm {
    constructor() {
        this.form = document.getElementById('contact-form');
        this.submitBtn = document.getElementById('submit-btn');
        this.btnText = document.getElementById('btn-text');
        this.btnSpinner = document.getElementById('btn-spinner');
        this.formStatus = document.getElementById('form-status');
        this.charCounter = document.getElementById('char-counter');
        
        // Security configuration
        this.config = {
            // Get these from EmailJS Dashboard
            serviceId: 'YOUR_SERVICE_ID',    // ← REPLACE WITH YOUR SERVICE ID
            templateId: 'YOUR_TEMPLATE_ID',  // ← REPLACE WITH YOUR TEMPLATE ID
            
            // Rate limiting & security
            maxAttempts: 3,
            rateLimitWindow: 60000, // 1 minute
            honeypotField: 'website_url',
            minSubmissionTime: 3000, // 3 seconds minimum (human behavior)
            formStartTime: Date.now(),
            
            // Additional security settings
            allowedDomains: window.location.hostname ? [window.location.hostname] : [],
            maxMessageLength: 2000,
            sanitizeInputs: true
        };
        
        // Rate limiting storage
        this.submissionHistory = [];
        this.attemptCount = 0;
        
        this.init();
    }
    
    init() {
        if (!this.form) return;
        
        this.generateCSRFToken();
        this.setupEventListeners();
        this.updateCharCounter();
        this.validateForm(); // Initial validation
    }
    
    // Generate CSRF token for form protection
    generateCSRFToken() {
        const token = this.generateRandomToken(32);
        const csrfInput = document.getElementById('csrf-token');
        if (csrfInput) {
            csrfInput.value = token;
        }
        
        // Store in sessionStorage for server-side verification
        sessionStorage.setItem('csrf_token', token);
    }
    
    generateRandomToken(length) {
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        let token = '';
        const array = new Uint32Array(length);
        crypto.getRandomValues(array);
        
        for (let i = 0; i < length; i++) {
            token += chars[array[i] % chars.length];
        }
        
        return token;
    }
    
    setupEventListeners() {
        // Real-time validation
        const inputs = this.form.querySelectorAll('input, textarea');
        inputs.forEach(input => {
            input.addEventListener('input', () => {
                this.validateField(input);
                this.validateForm();
                this.updateCharCounter();
            });
            
            input.addEventListener('blur', () => {
                this.validateField(input);
            });
        });
        
        // Form submission
        this.form.addEventListener('submit', (e) => this.handleSubmit(e));
    }
    
    updateCharCounter() {
        const messageField = document.getElementById('user-message');
        if (messageField && this.charCounter) {
            const currentLength = messageField.value.length;
            this.charCounter.textContent = `${currentLength} / 2000`;
            
            // Visual feedback
            if (currentLength > 1800) {
                this.charCounter.classList.add('text-red-500');
            } else {
                this.charCounter.classList.remove('text-red-500');
            }
        }
    }
    
    validateField(field) {
        const errorElement = document.getElementById(`${field.id.replace('user-', '')}-error`);
        if (!errorElement) return true;
        
        let isValid = true;
        let errorMessage = '';
        
        // Required field check
        if (field.hasAttribute('required') && !field.value.trim()) {
            isValid = false;
            errorMessage = 'This field is required';
        }
        // Pattern validation
        else if (field.pattern && field.value) {
            const pattern = new RegExp(field.pattern);
            if (!pattern.test(field.value)) {
                isValid = false;
                errorMessage = this.getPatternErrorMessage(field);
            }
        }
        // Length validation
        else if (field.minLength && field.value.length < parseInt(field.minLength)) {
            isValid = false;
            errorMessage = `Minimum ${field.minLength} characters required`;
        }
        else if (field.maxLength && field.value.length > parseInt(field.maxLength)) {
            isValid = false;
            errorMessage = `Maximum ${field.maxLength} characters allowed`;
        }
        // Email validation
        else if (field.type === 'email' && field.value) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(field.value)) {
                isValid = false;
                errorMessage = 'Please enter a valid email address';
            }
        }
        
        // XSS prevention - sanitize input
        if (field.value) {
            field.value = this.sanitizeInput(field.value);
        }
        
        // Display error
        if (!isValid) {
            errorElement.textContent = errorMessage;
            errorElement.classList.remove('hidden');
            field.classList.add('border-red-500');
            field.classList.remove('border-near-black/20', 'focus:border-primary');
        } else {
            errorElement.classList.add('hidden');
            field.classList.remove('border-red-500');
            field.classList.add('border-near-black/20', 'focus:border-primary');
        }
        
        return isValid;
    }
    
    getPatternErrorMessage(field) {
        if (field.pattern && field.pattern.includes('a-zA-Z')) {
            return 'Only letters, spaces, hyphens, apostrophes, and periods are allowed';
        }
        return 'Invalid format';
    }
    
    sanitizeInput(input) {
        if (!this.config.sanitizeInputs || !input) return input;
        
        // Create a temporary element to encode HTML entities
        const div = document.createElement('div');
        div.textContent = input;
        let sanitized = div.innerHTML;
        
        // Remove potentially dangerous patterns
        sanitized = sanitized
            .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '') // Remove script tags
            .replace(/javascript:/gi, '') // Remove javascript: protocol
            .replace(/on\w+=/gi, '') // Remove event handlers (onclick, onerror, etc.)
            .replace(/eval\(/gi, '') // Remove eval()
            .replace(/expression\(/gi, '') // Remove CSS expressions
            .replace(/url\(/gi, '') // Remove CSS url()
            .trim();
        
        return sanitized;
    }
    
    validateForm() {
        const fields = ['user-name', 'user-email', 'user-message'];
        let allValid = true;
        
        fields.forEach(fieldId => {
            const field = document.getElementById(fieldId);
            if (field && !this.validateField(field)) {
                allValid = false;
            }
        });
        
        // Enable/disable submit button
        if (this.submitBtn) {
            this.submitBtn.disabled = !allValid;
            this.submitBtn.style.opacity = allValid ? '1' : '0.5';
            this.submitBtn.style.cursor = allValid ? 'pointer' : 'not-allowed';
        }
        
        return allValid;
    }
    
    // Security checks before submission
    performSecurityChecks() {
        // 1. Honeypot check (bot detection)
        const honeypot = this.form.querySelector(`[name="${this.config.honeypotField}"]`);
        if (honeypot && honeypot.value) {
            console.warn('Bot detected via honeypot');
            return false;
        }
        
        // 2. Minimum time check (prevent automated submissions)
        const timeSpent = Date.now() - this.config.formStartTime;
        if (timeSpent < this.config.minSubmissionTime) {
            console.warn('Submission too fast - possible bot');
            this.showStatus('Please take your time to fill out the form', 'error');
            return false;
        }
        
        // 3. Rate limiting
        if (!this.checkRateLimit()) {
            return false;
        }
        
        // 4. CSRF token validation
        const csrfToken = document.getElementById('csrf-token')?.value;
        const storedToken = sessionStorage.getItem('csrf_token');
        if (!csrfToken || csrfToken !== storedToken) {
            console.warn('CSRF token mismatch');
            return false;
        }
        
        // 5. Check for repeated submissions
        if (this.attemptCount >= this.config.maxAttempts) {
            this.showStatus('Too many attempts. Please try again later.', 'error');
            return false;
        }
        
        // 6. Domain validation (if configured)
        if (this.config.allowedDomains.length > 0) {
            const currentDomain = window.location.hostname;
            if (!this.config.allowedDomains.includes(currentDomain)) {
                console.warn('Unauthorized domain:', currentDomain);
                return false;
            }
        }
        
        // 7. Validate configuration is set
        if (this.config.serviceId === 'YOUR_SERVICE_ID' || this.config.templateId === 'YOUR_TEMPLATE_ID') {
            console.error('EmailJS configuration incomplete. Please update serviceId and templateId.');
            this.showStatus('Configuration error. Please contact the administrator.', 'error');
            return false;
        }
        
        return true;
    }
    
    checkRateLimit() {
        const now = Date.now();
        
        // Remove old entries outside the rate limit window
        this.submissionHistory = this.submissionHistory.filter(
            timestamp => now - timestamp < this.config.rateLimitWindow
        );
        
        // Check if within rate limit
        if (this.submissionHistory.length >= this.config.maxAttempts) {
            const oldestAttempt = this.submissionHistory[0];
            const waitTime = Math.ceil((this.config.rateLimitWindow - (now - oldestAttempt)) / 1000);
            this.showStatus(`Please wait ${waitTime} seconds before trying again`, 'error');
            return false;
        }
        
        return true;
    }
    
    async handleSubmit(e) {
        e.preventDefault();
        
        // Perform security checks
        if (!this.performSecurityChecks()) {
            this.attemptCount++;
            return;
        }
        
        // Final validation
        if (!this.validateForm()) {
            return;
        }
        
        // Show loading state
        this.setLoadingState(true);
        
        try {
            // Record submission attempt
            this.submissionHistory.push(Date.now());
            
            // Prepare form data
            const formData = {
                from_name: this.sanitizeInput(document.getElementById('user-name').value.trim()),
                reply_to: this.sanitizeInput(document.getElementById('user-email').value.trim().toLowerCase()),
                message: this.sanitizeInput(document.getElementById('user-message').value.trim()),
                timestamp: new Date().toISOString(),
                user_agent: navigator.userAgent.substring(0, 100), // Truncate for privacy
                csrf_token: document.getElementById('csrf-token').value
            };
            
            // Send email via EmailJS
            const response = await emailjs.send(
                this.config.serviceId,
                this.config.templateId,
                formData
            );
            
            if (response.status === 200) {
                this.showStatus('Thank you! Your message has been sent successfully. We\'ll get back to you soon.', 'success');
                this.resetForm();
                this.attemptCount = 0; // Reset on success
            } else {
                throw new Error('Unexpected response status');
            }
            
        } catch (error) {
            console.error('Email sending failed:', error);
            
            // Don't expose technical details to users
            this.showStatus(
                'Sorry, there was an error sending your message. Please try again or contact us directly.',
                'error'
            );
            
            this.attemptCount++;
        } finally {
            this.setLoadingState(false);
        }
    }
    
    setLoadingState(isLoading) {
        if (isLoading) {
            this.submitBtn.disabled = true;
            this.btnText.textContent = 'Sending...';
            this.btnSpinner.classList.remove('hidden');
            this.btnSpinner.innerHTML = '<svg class="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>';
        } else {
            this.submitBtn.disabled = false;
            this.btnText.textContent = 'Submit Request';
            this.btnSpinner.classList.add('hidden');
            this.btnSpinner.innerHTML = '';
            this.validateForm(); // Re-validate to update button state
        }
    }
    
    showStatus(message, type) {
        if (!this.formStatus) return;
        
        this.formStatus.textContent = message;
        this.formStatus.classList.remove('hidden', 'text-green-600', 'text-red-600');
        
        if (type === 'success') {
            this.formStatus.classList.add('text-green-600');
        } else {
            this.formStatus.classList.add('text-red-600');
        }
        
        // Auto-hide after 5 seconds
        setTimeout(() => {
            this.formStatus.classList.add('hidden');
        }, 5000);
    }
    
    resetForm() {
        this.form.reset();
        this.updateCharCounter();
        
        // Clear all error states
        const errorElements = this.form.querySelectorAll('.error-message');
        errorElements.forEach(el => el.classList.add('hidden'));
        
        const inputs = this.form.querySelectorAll('input, textarea');
        inputs.forEach(input => {
            input.classList.remove('border-red-500');
            input.classList.add('border-near-black/20');
        });
        
        // Regenerate CSRF token for next submission
        this.generateCSRFToken();
        this.config.formStartTime = Date.now();
    }
}

// Initialize secure contact form when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        new SecureContactForm();
    });
} else {
    new SecureContactForm();
}

// ============================================
// CLIENT LOGO MARQUEE ANIMATION
// ============================================

document.addEventListener('DOMContentLoaded', () => {
    const track = document.getElementById('marquee-track');
    
    if (track) {
        // Calculate half width for looping
        const loopWidth = track.scrollWidth / 2;
        
        const animation = gsap.to(track, {
            x: -loopWidth,
            duration: 30, // Adjust for speed
            ease: "none",
            repeat: -1,
            onReverseComplete: () => {
                gsap.set(track, { x: 0 });
            }
        });
        
        // Pause on hover for better UX
        track.addEventListener('mouseenter', () => animation.pause());
        track.addEventListener('mouseleave', () => animation.play());
    }
});
