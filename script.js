/* ============================================
   SHAUN — Visual Journal
   Interactive behaviors
   ============================================ */

// Cursor glow
const cursorGlow = document.getElementById('cursorGlow');
document.addEventListener('mousemove', (e) => {
    cursorGlow.style.left = e.clientX + 'px';
    cursorGlow.style.top = e.clientY + 'px';
});

// Mobile nav toggle
const navToggle = document.getElementById('navToggle');
const mobileMenu = document.getElementById('mobileMenu');
let menuOpen = false;

navToggle.addEventListener('click', () => {
    menuOpen = !menuOpen;
    mobileMenu.classList.toggle('active');
    navToggle.classList.toggle('active');
});

// Close mobile menu on link click
document.querySelectorAll('.mobile-link').forEach(link => {
    link.addEventListener('click', () => {
        menuOpen = false;
        mobileMenu.classList.remove('active');
        navToggle.classList.remove('active');
    });
});

// Animate on Scroll (AOS)
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry, index) => {
        if (entry.isIntersecting) {
            setTimeout(() => {
                entry.target.classList.add('visible');
            }, index * 100);
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

document.querySelectorAll('[data-aos]').forEach(el => observer.observe(el));

// Photo filter
const filterBtns = document.querySelectorAll('.filter-btn');
const photoItems = document.querySelectorAll('.photo-item');

filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        const filter = btn.dataset.filter;
        
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        
        photoItems.forEach(item => {
            if (filter === 'all' || item.dataset.category === filter) {
                item.style.opacity = '1';
                item.style.transform = 'scale(1)';
                item.style.pointerEvents = 'all';
            } else {
                item.style.opacity = '0.15';
                item.style.transform = 'scale(0.98)';
                item.style.pointerEvents = 'none';
            }
        });
    });
});

// Lightbox
const lightbox = document.getElementById('lightbox');
const lightboxClose = document.querySelector('.lightbox-close');

photoItems.forEach(item => {
    item.addEventListener('click', () => {
        lightbox.classList.add('active');
    });
});

lightboxClose.addEventListener('click', () => {
    lightbox.classList.remove('active');
});

lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) {
        lightbox.classList.remove('active');
    }
});

// Escape key closes lightbox
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        lightbox.classList.remove('active');
    }
});

// Smooth parallax on scroll for abstract shapes
let ticking = false;
window.addEventListener('scroll', () => {
    if (!ticking) {
        requestAnimationFrame(() => {
            const scrollY = window.scrollY;
            const shapes = document.querySelectorAll('.abstract-shape');
            shapes.forEach((shape, i) => {
                const speed = (i + 1) * 0.05;
                shape.style.transform = `translateY(${scrollY * speed}px)`;
            });
            ticking = false;
        });
        ticking = true;
    }
});

// Active nav link on scroll
const sections = document.querySelectorAll('.section');
const navLinks = document.querySelectorAll('.nav-link');

const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const id = entry.target.id;
            navLinks.forEach(link => {
                link.style.color = link.dataset.section === id ? '#f5f5f5' : '';
            });
        }
    });
}, { threshold: 0.3 });

sections.forEach(section => sectionObserver.observe(section));

// Stagger animation for music and film cards
const staggerElements = document.querySelectorAll('.music-card, .film-card, .book-card');
const staggerObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry, index) => {
        if (entry.isIntersecting) {
            setTimeout(() => {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }, index * 80);
            staggerObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.1 });

staggerElements.forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(20px)';
    el.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
    staggerObserver.observe(el);
});

// Blog stack expand/collapse
document.querySelectorAll('.blog-entry').forEach(entry => {
    entry.addEventListener('click', () => {
        // Defender 90 opens notebook modal
        if (entry.id === 'defenderEntry') {
            document.getElementById('notebookOverlay').classList.add('open');
            document.body.style.overflow = 'hidden';
            return;
        }
        const isExpanded = entry.classList.contains('expanded');
        // Close all
        document.querySelectorAll('.blog-entry').forEach(e => e.classList.remove('expanded'));
        // Toggle clicked
        if (!isExpanded) {
            entry.classList.add('expanded');
        }
    });
});

// Notebook close
document.getElementById('notebookClose')?.addEventListener('click', () => {
    document.getElementById('notebookOverlay').classList.remove('open');
    document.body.style.overflow = '';
});

document.getElementById('notebookOverlay')?.addEventListener('click', (e) => {
    if (e.target === e.currentTarget) {
        e.currentTarget.classList.remove('open');
        document.body.style.overflow = '';
    }
});

// Infinite horizontal scroll (Netflix-style loop)
function initInfiniteScroll(selector) {
    document.querySelectorAll(selector).forEach(container => {
        const items = Array.from(container.children);
        if (items.length < 2) return;

        // Clone all items and append for seamless loop
        items.forEach(item => {
            const clone = item.cloneNode(true);
            clone.setAttribute('aria-hidden', 'true');
            container.appendChild(clone);
        });

        const totalOriginalWidth = items.reduce((w, el) => {
            const style = getComputedStyle(container);
            const gap = parseFloat(style.gap) || 0;
            return w + el.offsetWidth + gap;
        }, 0);

        container.addEventListener('scroll', () => {
            if (container.scrollLeft >= totalOriginalWidth) {
                container.scrollLeft -= totalOriginalWidth;
            } else if (container.scrollLeft <= 0) {
                container.scrollLeft += totalOriginalWidth;
            }
        });
    });
}

initInfiniteScroll('.book-cards');
initInfiniteScroll('.book-cards-aligned');
initInfiniteScroll('.music-grid');
initInfiniteScroll('.film-grid');

console.log('⚡ Visual Journal loaded');
