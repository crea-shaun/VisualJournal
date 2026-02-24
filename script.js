/* ============================================
   SHAUN — Visual Journal
   Interactive behaviors (cleaned + safer)
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {
    const body = document.body;

    /* ============================================
       Cursor Glow (desktop only + null-safe)
       ============================================ */
    const cursorGlow = document.getElementById('cursorGlow');
    const isFinePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;

    if (cursorGlow && isFinePointer) {
        document.addEventListener('mousemove', (e) => {
            cursorGlow.style.left = `${e.clientX}px`;
            cursorGlow.style.top = `${e.clientY}px`;
        });

        document.addEventListener('mouseleave', () => {
            cursorGlow.style.opacity = '0';
        });

        document.addEventListener('mouseenter', () => {
            cursorGlow.style.opacity = '1';
        });
    }

    /* ============================================
       Mobile nav toggle
       ============================================ */
    const navToggle = document.getElementById('navToggle');
    const mobileMenu = document.getElementById('mobileMenu');
    let menuOpen = false;

    function setMenuState(open) {
        if (!navToggle || !mobileMenu) return;

        menuOpen = open;
        mobileMenu.classList.toggle('active', open);
        navToggle.classList.toggle('active', open);
        navToggle.setAttribute('aria-expanded', String(open));

        // prevent body scroll when menu open
        if (open) {
            body.style.overflow = 'hidden';
        } else {
            // only restore if notebook isn't open
            const notebookOverlay = document.getElementById('notebookOverlay');
            if (!notebookOverlay || !notebookOverlay.classList.contains('open')) {
                body.style.overflow = '';
            }
        }
    }

    if (navToggle && mobileMenu) {
        navToggle.addEventListener('click', () => setMenuState(!menuOpen));

        document.querySelectorAll('.mobile-link').forEach((link) => {
            link.addEventListener('click', () => setMenuState(false));
        });
    }

    /* ============================================
       Animate on Scroll (AOS)
       ============================================ */
    const aosElements = document.querySelectorAll('[data-aos]');
    if ('IntersectionObserver' in window && aosElements.length) {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const aosObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    const delay = Number(entry.target.dataset.aosDelay || 0);
                    window.setTimeout(() => {
                        entry.target.classList.add('visible');
                    }, delay);
                    observer.unobserve(entry.target);
                }
            });
        }, observerOptions);

        aosElements.forEach((el, i) => {
            // default stagger if not explicitly provided
            if (!el.dataset.aosDelay) el.dataset.aosDelay = String(i * 60);
            aosObserver.observe(el);
        });
    } else {
        aosElements.forEach((el) => el.classList.add('visible'));
    }

    /* ============================================
       Photo filter
       ============================================ */
    const filterBtns = document.querySelectorAll('.filter-btn');
    const photoItems = document.querySelectorAll('.photo-item');

    if (filterBtns.length && photoItems.length) {
        filterBtns.forEach((btn) => {
            btn.addEventListener('click', () => {
                const filter = btn.dataset.filter || 'all';

                filterBtns.forEach((b) => b.classList.remove('active'));
                btn.classList.add('active');

                photoItems.forEach((item) => {
                    const category = item.dataset.category;
                    const matches = filter === 'all' || category === filter;

                    item.style.opacity = matches ? '1' : '0.15';
                    item.style.transform = matches ? 'scale(1)' : 'scale(0.98)';
                    item.style.pointerEvents = matches ? 'auto' : 'none';
                });
            });
        });
    }

    /* ============================================
       Lightbox (loads clicked image if present)
       ============================================ */
    const lightbox = document.getElementById('lightbox');
    const lightboxClose = document.querySelector('.lightbox-close');
    const lightboxContent =
        lightbox?.querySelector('.lightbox-content') || null;

    function openLightboxFromItem(item) {
        if (!lightbox || !lightboxContent) return;

        const img = item.querySelector('img');
        lightbox.classList.add('active');
        body.style.overflow = 'hidden';

        // If image exists, render it in lightbox
        if (img) {
            let lbImg = lightboxContent.querySelector('img');

            if (!lbImg) {
                lbImg = document.createElement('img');
                lightboxContent.innerHTML = '';
                lightboxContent.appendChild(lbImg);
            }

            lbImg.src = img.currentSrc || img.src;
            lbImg.alt = img.alt || 'Expanded photo';
        }
    }

    function closeLightbox() {
        if (!lightbox) return;
        lightbox.classList.remove('active');

        // only restore if no notebook/menu is open
        const notebookOpen = document.getElementById('notebookOverlay')?.classList.contains('open');
        if (!notebookOpen && !menuOpen) {
            body.style.overflow = '';
        }
    }

    if (lightbox && photoItems.length) {
        photoItems.forEach((item) => {
            item.addEventListener('click', () => openLightboxFromItem(item));
        });
    }

    if (lightboxClose) {
        lightboxClose.addEventListener('click', closeLightbox);
    }

    if (lightbox) {
        lightbox.addEventListener('click', (e) => {
            if (e.target === lightbox) closeLightbox();
        });
    }

    /* ============================================
       Escape key (close overlays / menu)
       ============================================ */
    document.addEventListener('keydown', (e) => {
        if (e.key !== 'Escape') return;

        const notebookOverlay = document.getElementById('notebookOverlay');

        if (lightbox?.classList.contains('active')) {
            closeLightbox();
            return;
        }

        if (notebookOverlay?.classList.contains('open')) {
            notebookOverlay.classList.remove('open');
            if (!menuOpen) body.style.overflow = '';
            return;
        }

        if (menuOpen) {
            setMenuState(false);
        }
    });

    /* ============================================
       Smooth parallax on scroll for abstract shapes
       (preserves base transforms better)
       ============================================ */
    const abstractShapes = document.querySelectorAll('.abstract-shape');
    let ticking = false;

    if (abstractShapes.length) {
        window.addEventListener('scroll', () => {
            if (ticking) return;

            ticking = true;
            window.requestAnimationFrame(() => {
                const scrollY = window.scrollY;

                abstractShapes.forEach((shape, i) => {
                    const speed = (i + 1) * 0.05;
                    shape.style.transform = `translate3d(0, ${scrollY * speed}px, 0)`;
                });

                ticking = false;
            });
        }, { passive: true });
    }

    /* ============================================
       Active nav link on scroll
       ============================================ */
    const sections = document.querySelectorAll('.section[id]');
    const navLinks = document.querySelectorAll('.nav-link[data-section]');

    if ('IntersectionObserver' in window && sections.length && navLinks.length) {
        const sectionObserver = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (!entry.isIntersecting) return;
                const id = entry.target.id;

                navLinks.forEach((link) => {
                    const isActive = link.dataset.section === id;
                    link.classList.toggle('is-active', isActive);

                    // inline fallback if CSS .is-active isn't added
                    link.style.color = isActive ? '#f5f5f5' : '';
                });
            });
        }, { threshold: 0.3 });

        sections.forEach((section) => sectionObserver.observe(section));
    }

    /* ============================================
       Stagger animation for cards
       ============================================ */
    const staggerElements = document.querySelectorAll('.music-card, .film-card, .book-card');

    if ('IntersectionObserver' in window && staggerElements.length) {
        const staggerObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach((entry) => {
                if (!entry.isIntersecting) return;

                const el = entry.target;
                const index = Number(el.dataset.staggerIndex || 0);

                window.setTimeout(() => {
                    el.style.opacity = '1';
                    el.style.transform = 'translateY(0)';
                }, index * 80);

                observer.unobserve(el);
            });
        }, { threshold: 0.1 });

        staggerElements.forEach((el, i) => {
            el.dataset.staggerIndex = String(i % 8); // repeat cadence per viewport batch
            el.style.opacity = '0';
            el.style.transform = 'translateY(20px)';
            el.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
            staggerObserver.observe(el);
        });
    }

    /* ============================================
       Blog stack expand/collapse
       ============================================ */
    const blogEntries = document.querySelectorAll('.blog-entry');

    blogEntries.forEach((entry) => {
        entry.addEventListener('click', (e) => {
            // Optional: ignore clicks on links/buttons inside entry
            if (e.target.closest('a, button')) return;

            // Defender 90 opens notebook modal
            if (entry.id === 'defenderEntry') {
                const notebookOverlay = document.getElementById('notebookOverlay');
                if (notebookOverlay) {
                    notebookOverlay.classList.add('open');
                    body.style.overflow = 'hidden';
                }
                return;
            }

            const isExpanded = entry.classList.contains('expanded');

            blogEntries.forEach((el) => el.classList.remove('expanded'));

            if (!isExpanded) {
                entry.classList.add('expanded');
            }
        });
    });

    /* ============================================
       Notebook modal close
       ============================================ */
    const notebookOverlay = document.getElementById('notebookOverlay');
    const notebookClose = document.getElementById('notebookClose');

    function closeNotebook() {
        if (!notebookOverlay) return;
        notebookOverlay.classList.remove('open');
        if (!menuOpen && !lightbox?.classList.contains('active')) {
            body.style.overflow = '';
        }
    }

    if (notebookClose) {
        notebookClose.addEventListener('click', closeNotebook);
    }

    if (notebookOverlay) {
        notebookOverlay.addEventListener('click', (e) => {
            if (e.target === e.currentTarget) {
                closeNotebook();
            }
        });
    }

    /* ============================================
       Infinite horizontal scroll (Netflix-style loop)
       - prevents duplicate init
       - handles resize recalculation
       ============================================ */
    function initInfiniteScroll(selector) {
        document.querySelectorAll(selector).forEach((container) => {
            if (container.dataset.infiniteInitialized === 'true') return;

            const originalItems = Array.from(container.children);
            if (originalItems.length < 2) return;

            container.dataset.infiniteInitialized = 'true';

            // Clone original items once
            originalItems.forEach((item) => {
                const clone = item.cloneNode(true);
                clone.setAttribute('aria-hidden', 'true');

                // Prevent duplicate IDs
                if (clone.id) clone.removeAttribute('id');

                container.appendChild(clone);
            });

            let totalOriginalWidth = 0;

            const recalcWidth = () => {
                const style = getComputedStyle(container);
                const gap = parseFloat(style.gap) || 0;

                totalOriginalWidth = originalItems.reduce((w, el, idx) => {
                    const addGap = idx < originalItems.length - 1 ? gap : 0;
                    return w + el.offsetWidth + addGap;
                }, 0);

                // Put scroll at start of original set for smoother UX
                if (container.scrollLeft === 0) {
                    container.scrollLeft = 1;
                }
            };

            recalcWidth();

            container.addEventListener('scroll', () => {
                if (!totalOriginalWidth) return;

                if (container.scrollLeft >= totalOriginalWidth) {
                    container.scrollLeft -= totalOriginalWidth;
                } else if (container.scrollLeft <= 0) {
                    container.scrollLeft += totalOriginalWidth;
                }
            }, { passive: true });

            window.addEventListener('resize', recalcWidth);
        });
    }

    initInfiniteScroll('.book-cards');
    initInfiniteScroll('.book-cards-aligned');
    initInfiniteScroll('.music-grid');
    initInfiniteScroll('.film-grid');

    console.log('⚡ Visual Journal loaded');
});