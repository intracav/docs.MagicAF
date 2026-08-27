/* ================================================================
   MAGICAF DOCS — Interaction & Animation Engine
   Content must remain fully readable with JavaScript disabled:
   the `js` class gates every style that hides or moves elements.
   ================================================================ */

document.documentElement.classList.add('js');

const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

document.addEventListener('DOMContentLoaded', () => {
  initScrollReveal();
  initScrollProgress();
  initSidebarActive();
  initMobileMenu();
  initSmoothAnchors();
  initThemeToggle();
  initTabs();
  initCodeCopy();
  initScrollTop();
  initKbdHint();
});

/* ---------- Scroll Reveal (Intersection Observer) ---------- */
function initScrollReveal() {
  const targets = document.querySelectorAll('.reveal, .stagger-children, .step');
  if (prefersReducedMotion || !('IntersectionObserver' in window)) {
    targets.forEach((el) => el.classList.add('visible'));
    return;
  }
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
  );
  targets.forEach((el) => observer.observe(el));
}

/* ---------- Scroll Progress Bar ---------- */
function initScrollProgress() {
  const bar = document.querySelector('.scroll-progress');
  if (!bar) return;
  const update = () => {
    const max = document.documentElement.scrollHeight - window.innerHeight;
    const progress = max > 0 ? window.scrollY / max : 0;
    bar.style.transform = `scaleX(${Math.min(progress, 1)})`;
  };
  window.addEventListener('scroll', update, { passive: true });
  update();
}

/* ---------- Sidebar Active Link ---------- */
function initSidebarActive() {
  const normalize = (p) => (p.endsWith('/') ? p : p + '/');
  const path = normalize(window.location.pathname);
  document.querySelectorAll('.sidebar-link').forEach((link) => {
    if (normalize(link.getAttribute('href')) === path) {
      link.classList.add('active');
      link.setAttribute('aria-current', 'page');
    }
  });
  document.querySelectorAll('.header-nav a').forEach((link) => {
    const href = link.getAttribute('href');
    if (href && !href.startsWith('http') && path.startsWith(normalize(href)) && href !== '/') {
      link.classList.add('active');
    }
  });
}

/* ---------- Mobile Menu ---------- */
function initMobileMenu() {
  const btn = document.querySelector('.mobile-menu-btn');
  const sidebar = document.querySelector('.sidebar');
  const nav = document.querySelector('.header-nav');
  if (!btn) return;
  // Docs pages get the section sidebar; everywhere else the header nav, which
  // is styled as a dropdown by .header-nav.open.
  const target = sidebar || nav;
  if (!target) return;

  const setOpen = (open) => {
    target.classList.toggle('open', open);
    btn.setAttribute('aria-expanded', open ? 'true' : 'false');
  };

  btn.addEventListener('click', (e) => {
    e.stopPropagation();
    setOpen(!target.classList.contains('open'));
  });

  document.addEventListener('click', (e) => {
    // btn.contains, not e.target !== btn: the button wraps an <svg>, so a tap
    // reports the svg (or its <path>) as the target and never the button.
    if (target.classList.contains('open') && !target.contains(e.target) && !btn.contains(e.target)) {
      setOpen(false);
    }
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && target.classList.contains('open')) {
      setOpen(false);
      btn.focus();
    }
  });

  // Following a link leaves the panel open behind the next page's paint.
  target.addEventListener('click', (e) => {
    if (e.target.closest('a')) setOpen(false);
  });
}

/* ---------- Smooth Anchor Scrolling ---------- */
function initSmoothAnchors() {
  if (prefersReducedMotion) return;
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', (e) => {
      const id = anchor.getAttribute('href').slice(1);
      if (!id) return;
      const el = document.getElementById(id);
      if (!el) return;
      e.preventDefault();
      el.scrollIntoView({ behavior: 'smooth' });
      history.pushState(null, '', '#' + id);
    });
  });
}

/* ---------- Theme Toggle ---------- */
function initThemeToggle() {
  const toggle = document.getElementById('theme-toggle');
  if (!toggle) return;
  const icon = toggle.querySelector('.theme-icon');
  const media = window.matchMedia('(prefers-color-scheme: dark)');

  const effectiveTheme = () => {
    const explicit = document.documentElement.getAttribute('data-theme');
    if (explicit) return explicit;
    return media.matches ? 'dark' : 'light';
  };
  const syncIcon = () => {
    if (icon) icon.textContent = effectiveTheme() === 'dark' ? '☀' : '☽';
  };
  toggle.addEventListener('click', () => {
    const next = effectiveTheme() === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', next);
    localStorage.setItem('theme', next);
    syncIcon();
  });
  media.addEventListener('change', syncIcon);
  syncIcon();
}

/* ---------- Tabs (shortcode) ---------- */
function initTabs() {
  document.querySelectorAll('.tabs').forEach((tabs) => {
    const btns = tabs.querySelectorAll(':scope > .tabs-nav > .tab-btn');
    const panels = tabs.querySelectorAll(':scope > .tab-panel');
    btns.forEach((btn) => {
      btn.addEventListener('click', () => {
        const idx = btn.dataset.tabIndex;
        btns.forEach((b) => {
          b.classList.toggle('active', b === btn);
          b.setAttribute('aria-selected', b === btn ? 'true' : 'false');
        });
        panels.forEach((p) => p.classList.toggle('active', p.dataset.tabIndex === idx));
      });
    });
  });
}

/* ---------- Code Copy Buttons ---------- */
function initCodeCopy() {
  document.querySelectorAll('.highlight').forEach((block) => {
    const code = block.querySelector('pre code');
    if (!code) return;
    const btn = document.createElement('button');
    btn.className = 'copy-code';
    btn.type = 'button';
    btn.textContent = 'Copy';
    btn.setAttribute('aria-label', 'Copy code to clipboard');
    btn.addEventListener('click', () => {
      navigator.clipboard.writeText(code.textContent).then(() => {
        btn.textContent = 'Copied';
        setTimeout(() => { btn.textContent = 'Copy'; }, 2000);
      });
    });
    block.appendChild(btn);
  });
}

/* ---------- Scroll To Top ---------- */
function initScrollTop() {
  const btn = document.getElementById('scroll-top');
  if (!btn) return;
  const update = () => {
    btn.classList.toggle('show', window.scrollY > 600);
  };
  window.addEventListener('scroll', update, { passive: true });
  update();
  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: prefersReducedMotion ? 'auto' : 'smooth' });
  });
}

/* ---------- Platform-aware kbd hint (⌘ vs Ctrl) ---------- */
function initKbdHint() {
  const isMac = /Mac|iPhone|iPad/.test(navigator.platform || navigator.userAgent);
  document.querySelectorAll('.kbd-meta').forEach((el) => {
    el.textContent = isMac ? '⌘' : 'Ctrl';
  });
}
