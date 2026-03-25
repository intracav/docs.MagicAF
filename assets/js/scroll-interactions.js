/* ================================================================
   MagicAF Docs — Scroll Interactions
   Progress bar + Intersection Observer reveals
   ================================================================ */

document.addEventListener('DOMContentLoaded', function() {
  initScrollProgress();
  initScrollReveal();
});

/* ---------- Scroll Progress Bar ---------- */
function initScrollProgress() {
  var bar = document.querySelector('.scroll-progress');
  if (!bar) return;

  function update() {
    var scrollTop = window.scrollY;
    var docHeight = document.documentElement.scrollHeight - window.innerHeight;
    var progress = docHeight > 0 ? scrollTop / docHeight : 0;
    bar.style.transform = 'scaleX(' + Math.min(progress, 1) + ')';
  }

  window.addEventListener('scroll', update, { passive: true });
  update();
}

/* ---------- Scroll Reveal (Intersection Observer) ---------- */
function initScrollReveal() {
  if (!('IntersectionObserver' in window)) return;

  var observer = new IntersectionObserver(
    function(entries) {
      entries.forEach(function(entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
        }
      });
    },
    { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
  );

  document.querySelectorAll('.reveal, .stagger-children, .step').forEach(function(el) {
    observer.observe(el);
  });
}
