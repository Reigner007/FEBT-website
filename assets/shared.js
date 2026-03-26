/* =============================================================
   shared.js  —  Final Exodus Bride Tabernacle
   Runs on every page. Keep this file clean and well-commented.
   ============================================================= */

document.addEventListener('DOMContentLoaded', () => {


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
   Simplified for maximum mobile reliability.
   Uses 'click' as primary listener (modern mobile browsers handle taps reliably).
   Removed conflicting touchend listeners that were causing issues on real devices.
-------------------------------------------------------------- */
const hamburger  = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobile-menu');

function openMenu() {
  mobileMenu.classList.add('open');
  hamburger.setAttribute('aria-expanded', 'true');
}

function closeMenu() {
  mobileMenu.classList.remove('open');
  hamburger.setAttribute('aria-expanded', 'false');
}

function toggleMenu(e) {
  if (e) {
    e.preventDefault();
    e.stopPropagation();
  }
  mobileMenu.classList.contains('open') ? closeMenu() : openMenu();
}

if (hamburger && mobileMenu) {

  // Main listener - click works reliably on mobile
  hamburger.addEventListener('click', toggleMenu);

  // Close menu when any link inside is clicked
  mobileMenu.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', closeMenu);
  });

  // Close menu when tapping anywhere outside the menu
  document.addEventListener('click', (e) => {
    if (
      mobileMenu.classList.contains('open') &&
      !hamburger.contains(e.target) &&
      !mobileMenu.contains(e.target)
    ) {
      closeMenu();
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
  const hrefPage = href ? href.split('#')[0].split('?')[0] : '';
  if (
    hrefPage === currentPage ||
    (currentPage === '' && hrefPage === 'index.html')
  ) {
    link.classList.add('active');
  }
});


/* ── 4. SCROLL REVEAL ─────────────────────────────────────────
   Any element with class .reveal starts invisible and animates
   in when it enters the viewport.
-------------------------------------------------------------- */
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, {
  threshold: 0.10,
  rootMargin: '0px 0px -40px 0px'
});

document.querySelectorAll('.reveal').forEach((el) => {
  const siblings = Array.from(el.parentElement.querySelectorAll(':scope > .reveal'));
  const siblingIndex = siblings.indexOf(el);
  if (siblings.length > 1) {
    el.style.transitionDelay = `${siblingIndex * 80}ms`;
  }
  revealObserver.observe(el);
});


/* ── 5. CONTACT FORM SUBMISSION ───────────────────────────────
   Only runs if a #contact-form exists on the current page.
-------------------------------------------------------------- */
const contactForm = document.getElementById('contact-form');

if (contactForm) {
  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const submitBtn = contactForm.querySelector('button[type="submit"]');
    if (!submitBtn) return;
    const originalText = submitBtn.textContent;
    submitBtn.textContent = 'Message Sent ✓';
    submitBtn.style.background = '#4a7c59';
    submitBtn.disabled = true;
    setTimeout(() => {
      contactForm.reset();
      submitBtn.textContent = originalText;
      submitBtn.style.background = '';
      submitBtn.disabled = false;
    }, 3000);
  });
}


/* ── 6. SMOOTH SCROLL for anchor links ───────────────────────
   Scrolls to target with offset for the fixed navbar.
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


/* ── 7. CURRENT YEAR in footer copyright ─────────────────── */
const yearEl = document.getElementById('copyright-year');
if (yearEl) {
  yearEl.textContent = new Date().getFullYear();
}


/* ── 8. SERMON FILTER BUTTONS ─────────────────────────────── */
document.querySelectorAll('.filter-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
  });
});


/* ── 9. GIVE PAGE — frequency toggle ──────────────────────── */
document.querySelectorAll('.freq-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.freq-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
  });
});


/* ── 10. GIVE PAGE — preset amount selection ──────────────── */
document.querySelectorAll('.amount-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.amount-btn').forEach(b => b.classList.remove('selected'));
    btn.classList.add('selected');
    const customInput = document.getElementById('custom-amount');
    if (customInput) customInput.value = '';
  });
});


}); // end DOMContentLoaded