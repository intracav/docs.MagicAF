// Ensure theme toggle is always clickable
(function() {
    function fixThemeToggle() {
        const themeToggle = document.getElementById('theme-toggle');
        if (!themeToggle) {
            setTimeout(fixThemeToggle, 100);
            return;
        }
        
        // Force styles
        themeToggle.style.setProperty('pointer-events', 'auto', 'important');
        themeToggle.style.setProperty('z-index', '10000', 'important');
        themeToggle.style.setProperty('position', 'relative', 'important');
        themeToggle.style.setProperty('cursor', 'pointer', 'important');
        
        // Ensure parent doesn't block
        const logoSwitches = themeToggle.closest('.logo-switches');
        if (logoSwitches) {
            logoSwitches.style.setProperty('pointer-events', 'auto', 'important');
            logoSwitches.style.setProperty('z-index', '1000', 'important');
        }
        
        // Ensure search button doesn't overlap
        const searchToggle = document.getElementById('search-toggle');
        if (searchToggle) {
            searchToggle.style.setProperty('pointer-events', 'auto', 'important');
            searchToggle.style.setProperty('z-index', '1', 'important');
        }
        
        // Remove any overlays that might block
        const searchModal = document.getElementById('search-modal');
        if (searchModal && !searchModal.classList.contains('active')) {
            searchModal.style.setProperty('display', 'none', 'important');
            searchModal.style.setProperty('pointer-events', 'none', 'important');
        }
    }
    
    // Run immediately and on load
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', fixThemeToggle);
    } else {
        fixThemeToggle();
    }
    
    // Also run after a short delay to catch any late-loading elements
    setTimeout(fixThemeToggle, 500);
})();
