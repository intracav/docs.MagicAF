/* ============================================================================
   Lumen UI — Interactive Mock Component Behaviors
   ============================================================================ */

document.addEventListener('DOMContentLoaded', () => {
  initTabs();
  initAccordions();
  initToggles();
  initCheckboxes();
  initRadioGroups();
  initThinkingBlocks();
  initToolCalls();
  initAlertDismiss();
  initChecklists();
  initCodePreviewTabs();
  initSections();
  initAnimateOnScroll();
});

/* --- Tabs ----------------------------------------------------------------- */
function initTabs() {
  document.querySelectorAll('.lm-tabs').forEach(tabGroup => {
    const tabs = tabGroup.querySelectorAll('.lm-tabs__tab');
    const panels = tabGroup.querySelectorAll('.lm-tabs__panel');

    tabs.forEach(tab => {
      tab.addEventListener('click', () => {
        const target = tab.dataset.tab;
        tabs.forEach(t => t.classList.remove('active'));
        panels.forEach(p => p.classList.remove('active'));
        tab.classList.add('active');
        const panel = tabGroup.querySelector(`.lm-tabs__panel[data-tab="${target}"]`);
        if (panel) panel.classList.add('active');
      });
    });
  });
}

/* --- Accordions ----------------------------------------------------------- */
function initAccordions() {
  document.querySelectorAll('.lm-accordion__trigger').forEach(trigger => {
    trigger.addEventListener('click', () => {
      const item = trigger.closest('.lm-accordion__item');
      item.classList.toggle('open');
    });
  });
}

/* --- Toggles -------------------------------------------------------------- */
function initToggles() {
  document.querySelectorAll('.lm-toggle').forEach(toggle => {
    toggle.addEventListener('click', () => {
      toggle.classList.toggle('on');
    });
  });
}

/* --- Checkboxes ----------------------------------------------------------- */
function initCheckboxes() {
  document.querySelectorAll('.lm-checkbox').forEach(cb => {
    cb.addEventListener('click', () => {
      cb.classList.toggle('checked');
    });
  });
}

/* --- Radio Groups --------------------------------------------------------- */
function initRadioGroups() {
  document.querySelectorAll('.lm-radio-group').forEach(group => {
    const radios = group.querySelectorAll('.lm-radio');
    radios.forEach(radio => {
      radio.addEventListener('click', () => {
        radios.forEach(r => r.classList.remove('selected'));
        radio.classList.add('selected');
      });
    });
  });
}

/* --- Thinking Blocks ------------------------------------------------------ */
function initThinkingBlocks() {
  document.querySelectorAll('.lm-thinking__trigger').forEach(trigger => {
    trigger.addEventListener('click', () => {
      const block = trigger.closest('.lm-thinking');
      block.classList.toggle('open');
    });
  });
}

/* --- Tool Calls (expandable) ---------------------------------------------- */
function initToolCalls() {
  document.querySelectorAll('.lm-tool-call[data-expandable]').forEach(tc => {
    tc.addEventListener('click', () => {
      tc.classList.toggle('expanded');
    });
  });
}

/* --- Alert Dismiss -------------------------------------------------------- */
function initAlertDismiss() {
  document.querySelectorAll('.lm-alert__dismiss').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const alert = btn.closest('.lm-alert');
      alert.style.transition = 'opacity 0.2s ease, transform 0.2s ease';
      alert.style.opacity = '0';
      alert.style.transform = 'translateX(8px)';
      setTimeout(() => alert.style.display = 'none', 200);
    });
  });
}

/* --- Checklists ----------------------------------------------------------- */
function initChecklists() {
  document.querySelectorAll('.lm-checklist__item').forEach(item => {
    item.addEventListener('click', () => {
      item.classList.toggle('checked');
    });
  });
}

/* --- Code/Preview Tabs ---------------------------------------------------- */
function initCodePreviewTabs() {
  document.querySelectorAll('.lm-code-preview').forEach(group => {
    const tabs = group.querySelectorAll('.lm-code-preview__tab');
    const panels = group.querySelectorAll('.lm-code-preview__panel');

    tabs.forEach(tab => {
      tab.addEventListener('click', () => {
        const target = tab.dataset.panel;
        tabs.forEach(t => t.classList.remove('active'));
        panels.forEach(p => p.classList.remove('active'));
        tab.classList.add('active');
        const panel = group.querySelector(`.lm-code-preview__panel[data-panel="${target}"]`);
        if (panel) panel.classList.add('active');
      });
    });
  });
}

/* --- Sections (collapsible) ----------------------------------------------- */
function initSections() {
  document.querySelectorAll('.lm-section__header').forEach(header => {
    header.addEventListener('click', () => {
      const section = header.closest('.lm-section');
      section.classList.toggle('collapsed');
    });
  });
}

/* --- Animate on Scroll (IntersectionObserver) ----------------------------- */
function initAnimateOnScroll() {
  if (!('IntersectionObserver' in window)) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('lm-animate-in');
        // Trigger bar chart animations
        if (entry.target.classList.contains('lm-bar-chart')) {
          entry.target.classList.add('lm-animate-bars');
        }
        // Trigger progress animations
        if (entry.target.querySelector('.lm-progress__fill')) {
          entry.target.classList.add('lm-animate-progress');
        }
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.2 });

  document.querySelectorAll('.lumen-demo__frame, .lm-bar-chart, .lm-progress').forEach(el => {
    observer.observe(el);
  });
}
