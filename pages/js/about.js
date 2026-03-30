// About Page JavaScript
gsap.registerPlugin(ScrollTrigger);

// 1. 3D Tilt Interaction
document.querySelectorAll('.tilt-card').forEach(card => {
    card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        const rotateX = (y - centerY) / 10;
        const rotateY = (centerX - x) / 10;
        gsap.to(card, {
            rotateX: rotateX,
            rotateY: rotateY,
            scale: 1.05,
            duration: 0.3,
            ease: 'power2.out'
        });
    });
    card.addEventListener('mouseleave', () => {
        gsap.to(card, {
            rotateX: 0,
            rotateY: 0,
            scale: 1,
            duration: 0.5,
            ease: 'elastic.out(1, 0.3)'
        });
    });
});

// 2. Kinetic Path-Drawing Timeline
gsap.to('#timeline-path', {
    strokeDashoffset: 0,
    scrollTrigger: {
        trigger: '.timeline-item',
        start: 'top center',
        endTrigger: '.timeline-item:last-child',
        end: 'bottom center',
        scrub: 1
    }
});

// Timeline Glitch into view
document.querySelectorAll('.timeline-item').forEach(item => {
    gsap.from(item.querySelector('.glitch-target'), {
        opacity: 0,
        x: -20,
        duration: 0.5,
        scrollTrigger: {
            trigger: item,
            start: 'top 80%',
            onEnter: () => {
                item.querySelector('.glitch-target').classList.add('glitch-text');
                setTimeout(() => item.querySelector('.glitch-target').classList.remove('glitch-text'), 1000);
            }
        }
    });
    gsap.from(item.querySelector('.timeline-year'), {
        opacity: 0,
        scale: 0.8,
        duration: 1,
        scrollTrigger: {
            trigger: item,
            start: 'top 80%'
        }
    });
});

// 3. Deep-Map Parallax Workshop
gsap.to('#parallax-bg', {
    yPercent: -20,
    ease: 'none',
    scrollTrigger: {
        trigger: '#pithampur-core',
        start: 'top bottom',
        end: 'bottom top',
        scrub: true
    }
});

gsap.to('#parallax-title', {
    y: 100,
    ease: 'none',
    scrollTrigger: {
        trigger: '#pithampur-core',
        start: 'top bottom',
        end: 'bottom top',
        scrub: true
    }
});

// 4. Hero Reveal
gsap.from('#hero-title', {
    opacity: 0,
    y: 100,
    duration: 1.5,
    ease: 'power4.out',
    delay: 0.5
});

// 5. Smooth Scroll Performance (Browser Native + Minimal Enhancements)
// Handled via scroll-smooth class on html
