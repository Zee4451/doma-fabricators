// Industries Page JavaScript
gsap.registerPlugin(ScrollTrigger);

// 1. Interactive Technical Grid Shift
const grid = document.getElementById('interactive-grid');
window.addEventListener('mousemove', (e) => {
    const xPos = (e.clientX / window.innerWidth - 0.5) * 20;
    const yPos = (e.clientY / window.innerHeight - 0.5) * 20;
    gsap.to(grid, {
        rotationY: xPos,
        rotationX: -yPos,
        duration: 1.5,
        ease: "power2.out"
    });
});

// 2. Cursor Tracked Metadata
const cursorMeta = document.getElementById('cursor-meta');
const sectorCards = document.querySelectorAll('.sector-card');

window.addEventListener('mousemove', (e) => {
    gsap.to(cursorMeta, {
        left: e.clientX,
        top: e.clientY,
        duration: 0.1
    });
});

sectorCards.forEach(card => {
    card.addEventListener('mouseenter', () => {
        const meta = card.getAttribute('data-meta') || 'TECHNICAL_SPECS: VERIFIED';
        cursorMeta.innerText = meta;
        gsap.to(cursorMeta, { opacity: 1, duration: 0.3 });
    });
    card.addEventListener('mouseleave', () => {
        gsap.to(cursorMeta, { opacity: 0, duration: 0.3 });
    });
});

// 3. Self-Drawing Blueprints
gsap.utils.toArray('.draw-line').forEach(line => {
    gsap.to(line, {
        scaleX: 1,
        duration: 1.5,
        ease: "expo.inOut",
        scrollTrigger: {
            trigger: line,
            start: "top 90%",
        }
    });
});

gsap.utils.toArray('.draw-line-v').forEach(line => {
    gsap.to(line, {
        scaleY: 1,
        duration: 1.5,
        ease: "expo.inOut",
        scrollTrigger: {
            trigger: line,
            start: "top 90%",
        }
    });
});

// 4. Liquid-Metal Scroll Sync
gsap.utils.toArray('.liquid-text, .liquid-text-white').forEach(text => {
    gsap.to(text, {
        backgroundPosition: "200% center",
        ease: "none",
        scrollTrigger: {
            trigger: text,
            start: "top bottom",
            end: "bottom top",
            scrub: 1
        }
    });
});

// 5. Parallax Layers
gsap.utils.toArray('.parallax-layer').forEach(layer => {
    const speed = layer.getAttribute('data-speed');
    gsap.to(layer, {
        y: (i, target) => -ScrollTrigger.maxScroll(window) * speed,
        ease: "none",
        scrollTrigger: {
            trigger: layer,
            start: "top bottom",
            end: "bottom top",
            scrub: true
        }
    });
});

ScrollTrigger.config({ limitCallbacks: true });
