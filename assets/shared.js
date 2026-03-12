/* =============================================================
   shared.js  —  Grace Community Church
   Runs on every page. Keep this file clean and well-commented.
   ============================================================= */

/* ── 1. NAVBAR: shadow on scroll ──────────────────────────────
   Adds .scrolled to #navbar once the user scrolls past 20px,
   which triggers the box-shadow defined in shared.css.
-------------------------------------------------------------- */
const navbar = document.getElementById('navbar');

if (navbar) {
  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 20);
  }, { passive: true });
}


/* ── 2. HAMBURGER MENU ────────────────────────────────────────
   Toggles the mobile nav open/closed.
   Also closes it when:
     a) a nav link is clicked
     b) the user clicks anywhere outside the menu
-------------------------------------------------------------- */
const hamburger  = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobile-menu');

if (hamburger && mobileMenu) {

  // Toggle open / closed
  hamburger.addEventListener('click', (e) => {
    e.stopPropagation();
    const isOpen = mobileMenu.classList.toggle('open');
    hamburger.setAttribute('aria-expanded', isOpen);
  });

  // Close when a link inside the menu is clicked
  mobileMenu.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      mobileMenu.classList.remove('open');
      hamburger.setAttribute('aria-expanded', 'false');
    });
  });

  // Close when clicking anywhere outside the nav
  document.addEventListener('click', (e) => {
    if (!navbar.contains(e.target) && !mobileMenu.contains(e.target)) {
      mobileMenu.classList.remove('open');
      hamburger.setAttribute('aria-expanded', 'false');
    }
  });
}


/* ── 3. ACTIVE NAV LINK ───────────────────────────────────────
   Compares the current page filename against each nav link's
   href and marks the matching one .active.
   Works for both desktop nav and mobile menu.
-------------------------------------------------------------- */
const currentPage = location.pathname.split('/').pop() || 'index.html';

document.querySelectorAll('.nav-links a, .mobile-menu a').forEach(link => {
  const href = link.getAttribute('href');

  // Strip any hash/query from the href before comparing
  const hrefPage = href ? href.split('#')[0].split('?')[0] : '';

  if (
    hrefPage === currentPage ||
    (currentPage === '' && hrefPage === 'index.html')
  ) {
    link.classList.add('active');
  }
});


/* ── 4. SCROLL REVEAL ─────────────────────────────────────────
   Any element with class .reveal starts invisible (opacity 0,
   translateY 24px — defined in shared.css).
   IntersectionObserver adds .visible once the element enters
   the viewport, triggering the CSS transition.

   Stagger: if multiple .reveal siblings appear at the same time
   (e.g. a card grid), each gets a small additional delay so
   they animate in one after another instead of all at once.
-------------------------------------------------------------- */
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target); // fire once only
    }
  });
}, {
  threshold: 0.10,       // trigger when 10% of element is visible
  rootMargin: '0px 0px -40px 0px' // slight offset from bottom edge
});

// Apply stagger delay to siblings inside grid/flex containers
document.querySelectorAll('.reveal').forEach((el, index) => {

  // Find siblings that are also .reveal inside the same parent
  const siblings = Array.from(el.parentElement.querySelectorAll(':scope > .reveal'));
  const siblingIndex = siblings.indexOf(el);

  // Only stagger if there are multiple reveal siblings (e.g. card grids)
  if (siblings.length > 1) {
    el.style.transitionDelay = `${siblingIndex * 80}ms`;
  }

  revealObserver.observe(el);
});


/* ── 5. CONTACT FORM SUBMISSION ───────────────────────────────
   Prevents the default form POST, shows a success state on the
   button, then resets after 3 seconds.
   Only runs if a #contact-form exists on the current page.
-------------------------------------------------------------- */
const contactForm = document.getElementById('contact-form');

if (contactForm) {
  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const submitBtn = contactForm.querySelector('button[type="submit"]');
    if (!submitBtn) return;

    const originalText = submitBtn.textContent;

    // Success state
    submitBtn.textContent = 'Message Sent ✓';
    submitBtn.style.background = '#4a7c59';
    submitBtn.disabled = true;

    // Reset after 3 seconds
    setTimeout(() => {
      contactForm.reset();
      submitBtn.textContent = originalText;
      submitBtn.style.background = '';
      submitBtn.disabled = false;
    }, 3000);
  });
}


/* ── 6. SMOOTH SCROLL for anchor links ───────────────────────
   Handles links like href="#about" and scrolls to the target
   with an offset to account for the fixed navbar height.
-------------------------------------------------------------- */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', (e) => {
    const targetId = anchor.getAttribute('href');
    if (targetId === '#') return;

    const target = document.querySelector(targetId);
    if (!target) return;

    e.preventDefault();

    const navHeight = navbar ? navbar.offsetHeight : 80;
    const targetTop = target.getBoundingClientRect().top + window.scrollY - navHeight - 16;

    window.scrollTo({ top: targetTop, behavior: 'smooth' });
  });
});


/* ── 7. CURRENT YEAR in footer copyright ─────────────────────
   Automatically keeps the copyright year up to date without
   needing to edit HTML each January.
-------------------------------------------------------------- */
const yearEl = document.getElementById('copyright-year');
if (yearEl) {
  yearEl.textContent = new Date().getFullYear();
}


/* ── 8. SERMON FILTER BUTTONS ─────────────────────────────
   Activates the clicked filter and deactivates the rest.
   Only runs when .filter-btn elements exist (sermons page).
-------------------------------------------------------------- */
document.querySelectorAll('.filter-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
  });
});


/* ── 9. GIVE PAGE — frequency toggle ──────────────────────
   Switches the active state on the One-Time/Weekly/Monthly
   toggle. Only runs when .freq-btn elements exist (give page).
-------------------------------------------------------------- */
document.querySelectorAll('.freq-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.freq-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
  });
});


/* ── 10. GIVE PAGE — preset amount selection ──────────────
   Highlights the selected amount button and clears the
   custom amount input when a preset is chosen.
-------------------------------------------------------------- */
document.querySelectorAll('.amount-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.amount-btn').forEach(b => b.classList.remove('selected'));
    btn.classList.add('selected');
    const customInput = document.getElementById('custom-amount');
    if (customInput) customInput.value = '';
  });
});