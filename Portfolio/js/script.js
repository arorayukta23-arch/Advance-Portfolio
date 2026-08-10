/* ============================================
   PORTFOLIO - Main JavaScript
   Author: Yukta Arora
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {
  'use strict';

  // ============================================
  // 1. DARK / LIGHT MODE THEME TOGGLE
  // ============================================
  const html          = document.documentElement;
  const themeToggle   = document.getElementById('theme-toggle');
  const THEME_KEY     = 'portfolio-theme';

  function getSystemTheme() {
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }

  function applyTheme(theme) {
    html.setAttribute('data-theme', theme);
    if (themeToggle) {
      themeToggle.setAttribute(
        'aria-label',
        theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'
      );
    }
  }

  function initTheme() {
    const saved = localStorage.getItem(THEME_KEY);
    applyTheme(saved || getSystemTheme());
  }

  initTheme();

  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      const current = html.getAttribute('data-theme') || getSystemTheme();
      const next    = current === 'dark' ? 'light' : 'dark';
      applyTheme(next);
      localStorage.setItem(THEME_KEY, next);

      // Brief pulse animation on toggle
      themeToggle.style.transform = 'scale(.88) rotate(20deg)';
      setTimeout(() => { themeToggle.style.transform = ''; }, 200);
    });
  }

  // Sync when OS theme changes (and user hasn't set a preference)
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
    if (!localStorage.getItem(THEME_KEY)) {
      applyTheme(e.matches ? 'dark' : 'light');
    }
  });

  // ============================================
  // 2. MOBILE NAVIGATION MENU
  // ============================================
  const hamburger  = document.getElementById('hamburger');
  const navMenu    = document.getElementById('nav-menu');
  const navOverlay = document.getElementById('nav-overlay');
  const navLinks   = document.querySelectorAll('.nav-link');

  function openMenu() {
    hamburger?.classList.add('active');
    navMenu?.classList.add('active');
    navOverlay?.classList.add('active');
    hamburger?.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
    const firstLink = navMenu?.querySelector('.nav-link');
    if (firstLink) firstLink.focus();
  }

  function closeMenu() {
    hamburger?.classList.remove('active');
    navMenu?.classList.remove('active');
    navOverlay?.classList.remove('active');
    hamburger?.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  }

  hamburger?.addEventListener('click', () => {
    hamburger.classList.contains('active') ? closeMenu() : openMenu();
  });

  navOverlay?.addEventListener('click', closeMenu);

  navLinks.forEach(link => link.addEventListener('click', closeMenu));

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && navMenu?.classList.contains('active')) {
      closeMenu();
      hamburger?.focus();
    }
  });

  // ============================================
  // 3. STICKY HEADER
  // ============================================
  const header = document.querySelector('.site-header');
  if (header) {
    const onScroll = () => {
      header.classList.toggle('scrolled', window.scrollY > 10);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll(); // run once on load
  }

  // ============================================
  // 4. ACTIVE NAVIGATION LINK
  // ============================================
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  navLinks.forEach(link => {
    const href = link.getAttribute('href');
    if (href === currentPage || (currentPage === '' && href === 'index.html')) {
      link.classList.add('active');
      link.setAttribute('aria-current', 'page');
    }
  });

  // ============================================
  // 5. BACK TO TOP BUTTON
  // ============================================
  const backToTop = document.getElementById('back-to-top');
  if (backToTop) {
    window.addEventListener('scroll', () => {
      backToTop.classList.toggle('visible', window.scrollY > 400);
    }, { passive: true });

    backToTop.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // ============================================
  // 6. SCROLL REVEAL ANIMATIONS
  // ============================================
  const animatedEls = document.querySelectorAll('.fade-in, .slide-in-left, .scale-in');

  if (animatedEls.length > 0 && 'IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });

    animatedEls.forEach(el => observer.observe(el));
  } else {
    // Fallback: show all elements immediately
    animatedEls.forEach(el => el.classList.add('visible'));
  }

  // ============================================
  // 7. SMOOTH SCROLL FOR ANCHOR LINKS
  // ============================================
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const targetId = anchor.getAttribute('href');
      if (targetId === '#') return;
      const target = document.querySelector(targetId);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        // Update URL without jumping
        history.pushState(null, '', targetId);
      }
    });
  });

  // ============================================
  // 8. SKILL TAGS STAGGER ANIMATION
  // ============================================
  document.querySelectorAll('.skills-category').forEach(category => {
    const tags = category.querySelectorAll('.skill-tag');
    tags.forEach((tag, i) => {
      tag.style.setProperty('--i', i);
    });
  });

});
