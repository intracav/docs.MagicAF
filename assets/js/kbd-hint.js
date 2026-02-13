// Update keyboard hint based on platform
document.addEventListener('DOMContentLoaded', function() {
  const kbdMeta = document.querySelector('.kbd-meta');
  if (kbdMeta) {
    // Detect platform
    const isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0 || 
                  navigator.userAgent.toUpperCase().indexOf('MAC') >= 0;
    kbdMeta.textContent = isMac ? '⌘' : 'Ctrl';
  }
});
