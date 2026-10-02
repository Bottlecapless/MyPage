(function () {
  'use strict';

  var root = document.documentElement;
  var toggle = document.getElementById('themeToggle');
  var label = toggle ? toggle.querySelector('.theme-toggle__label') : null;
  var langBtns = Array.prototype.slice.call(document.querySelectorAll('[data-lang-btn]'));

  function themeLabel() {
    var dark = root.getAttribute('data-theme') === 'dark';
    var zh = root.getAttribute('data-lang') === 'zh';
    if (zh) return dark ? '浅色' : '深色';
    return dark ? 'Light' : 'Dark';
  }

  function applyTheme(theme) {
    root.setAttribute('data-theme', theme);
    if (toggle) toggle.setAttribute('aria-pressed', String(theme === 'dark'));
    if (label) label.textContent = themeLabel();
    try { localStorage.setItem('theme', theme); } catch (e) {}
  }

  function applyLang(lang) {
    root.setAttribute('data-lang', lang);
    root.setAttribute('lang', lang === 'en' ? 'en' : 'zh-CN');
    langBtns.forEach(function (btn) {
      btn.setAttribute('aria-pressed', String(btn.getAttribute('data-lang-btn') === lang));
    });
    if (label) label.textContent = themeLabel();
    try { localStorage.setItem('lang.v2', lang); } catch (e) {}
  }

  applyTheme(root.getAttribute('data-theme') === 'dark' ? 'dark' : 'light');
  applyLang(root.getAttribute('data-lang') === 'en' ? 'en' : 'zh');

  if (toggle) {
    toggle.addEventListener('click', function () {
      applyTheme(root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark');
    });
  }

  langBtns.forEach(function (btn) {
    btn.addEventListener('click', function () {
      applyLang(btn.getAttribute('data-lang-btn'));
    });
  });

  var navLinks = Array.prototype.slice.call(document.querySelectorAll('.nav a'));
  var sections = navLinks
    .map(function (link) { return document.querySelector(link.getAttribute('href')); })
    .filter(Boolean);

  function setActive(id) {
    navLinks.forEach(function (link) {
      link.classList.toggle('is-active', link.getAttribute('href') === '#' + id);
    });
  }

  if ('IntersectionObserver' in window) {
    var spy = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) setActive(entry.target.id);
      });
    }, { rootMargin: '-45% 0px -50% 0px', threshold: 0 });

    sections.forEach(function (section) { spy.observe(section); });

    window.addEventListener('scroll', function () {
      var atBottom = window.innerHeight + window.scrollY >= document.body.offsetHeight - 4;
      if (atBottom && sections.length) setActive(sections[sections.length - 1].id);
    }, { passive: true });
  }

  var revealEls = Array.prototype.slice.call(document.querySelectorAll('.reveal'));
  var reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (!('IntersectionObserver' in window) || reduceMotion) {
    revealEls.forEach(function (el) { el.classList.add('is-visible'); });
  } else {
    var revealer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          revealer.unobserve(entry.target);
        }
      });
    }, { rootMargin: '0px 0px -6% 0px', threshold: 0.05 });

    revealEls.forEach(function (el) { revealer.observe(el); });
  }

  var lightbox = document.getElementById('lightbox');
  var avatarBtn = document.getElementById('avatarBtn');
  var lightboxClose = document.getElementById('lightboxClose');
  var lastFocus = null;

  function openLightbox() {
    if (!lightbox) return;
    lastFocus = document.activeElement;
    lightbox.hidden = false;
    document.body.classList.add('is-locked');
    if (lightboxClose) lightboxClose.focus();
  }

  function closeLightbox() {
    if (!lightbox || lightbox.hidden) return;
    lightbox.hidden = true;
    document.body.classList.remove('is-locked');
    var back = lastFocus && lastFocus !== document.body ? lastFocus : avatarBtn;
    if (back && back.focus) back.focus();
  }

  if (avatarBtn) avatarBtn.addEventListener('click', openLightbox);
  if (lightboxClose) lightboxClose.addEventListener('click', closeLightbox);
  if (lightbox) {
    lightbox.addEventListener('click', function (e) {
      if (e.target === lightbox) closeLightbox();
    });
  }
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') closeLightbox();
  });
})();
