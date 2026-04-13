// ============================================
// ACTIVE NAV LINK — Shared across all pages
// ============================================

(function () {
    /**
     * Returns the bare filename portion of a URL string,
     * e.g. "about.html" or "index.html"
     * Strips hash and query, handles root "/" → "index.html"
     */
    function getFilename(url) {
        if (!url) return '';
        // Strip origin if present, then hash and query
        let path = url;
        try {
            if (url.startsWith('http') || url.startsWith('//')) {
                path = new URL(url, window.location.origin).pathname;
            } else {
                path = url.split('#')[0].split('?')[0];
            }
        } catch (e) {
            path = url.split('#')[0].split('?')[0];
        }
        
        const clean = path.split('#')[0].split('?')[0];
        const parts = clean.split('/');
        let file = parts[parts.length - 1] || 'index.html';
        if (file === '' || file === 'index') file = 'index.html';
        return file.toLowerCase();
    }

    const currentPath = window.location.pathname;
    const currentFile = getFilename(currentPath);

    // ---- Desktop nav items ----
    const navItems = document.querySelectorAll('.nav-item');

    function setActive(matchFile) {
        navItems.forEach(link => {
            const href = link.getAttribute('href');
            if (!href) return;
            const linkFile = getFilename(href);
            
            if (linkFile === matchFile) {
                link.classList.add('active');
            } else {
                link.classList.remove('active');
            }
        });
    }

    // Set initial active state
    setActive(currentFile);

    // ---- Mobile menu links ----
    const mobileLinks = document.querySelectorAll('#mobile-menu .mobile-link');

    function setMobileActive(matchFile) {
        mobileLinks.forEach(link => {
            const linkFile = getFilename(link.getAttribute('href'));
            if (linkFile === matchFile) {
                link.classList.add('text-primary', '!text-primary');
                link.classList.remove('text-white/70');
            } else {
                link.classList.remove('text-primary', '!text-primary');
                link.classList.add('text-white/70');
            }
        });
    }

    setMobileActive(currentFile);

    // ---- Scroll-spy for index.html sections ----
    // Only run on index.html where links point to #sections
    if (currentFile === 'index.html') {
        // Map of section id → nav href
        const sectionNavMap = {
            'home':       'index.html',
            'about':      'index.html',
            'services':   'index.html',
            'industries': 'index.html',
            'projects':   'index.html',
            'contact':    'index.html#contact',
        };

        // For index.html, use the scroll position to decide which nav link is active.
        // Links that navigate to *other pages* stay active only on those pages.
        // On index.html, the section-based links (Home, E-Catalogue, Contact) react to scroll.

        const sections = Array.from(
            document.querySelectorAll('section[id]')
        );

        if (sections.length > 0 && 'IntersectionObserver' in window) {
            let currentSection = sections[0].id;

            const observer = new IntersectionObserver(
                (entries) => {
                    entries.forEach(entry => {
                        if (entry.isIntersecting) {
                            currentSection = entry.target.id;
                            highlightForSection(currentSection);
                        }
                    });
                },
                {
                    rootMargin: '-30% 0px -60% 0px',
                    threshold: 0,
                }
            );

            sections.forEach(sec => observer.observe(sec));

            function highlightForSection(sectionId) {
                navItems.forEach(link => {
                    const href = link.getAttribute('href') || '';
                    const hashSection = href.includes('#') ? href.split('#')[1] : null;
                    const linkFile = getFilename(href);

                    // Highlight "Home" when at the top (home section)
                    if (sectionId === 'home' && linkFile === 'index.html' && !hashSection) {
                        link.classList.add('active');
                    }
                    // Highlight any hash-link whose hash === current section
                    else if (hashSection && hashSection === sectionId) {
                        link.classList.add('active');
                    }
                    // Highlight page-level links (about.html, service.html, etc.)
                    // only when we're on that page — not on index.html
                    else if (linkFile !== 'index.html') {
                        link.classList.remove('active');
                    }
                    else {
                        link.classList.remove('active');
                    }
                });
            }

            // Set initial highlight based on scroll position
            highlightForSection(currentSection);
        }
    }
})();
