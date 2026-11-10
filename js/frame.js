// Small helpers for the frame look pages (home, Custom Software, AI Workforce).
(() => {
  // "Get in touch" style links take you to the first form's field, ready to type
  document.querySelectorAll('[data-to-form]').forEach((link) => link.addEventListener('click', () => {
    const input = document.querySelector('.lead-form .contact');
    if (input) input.focus({ preventScroll: true });
  }));

  // Hide the phone button while a form is on screen
  const stick = document.getElementById('stick');
  if (stick && 'IntersectionObserver' in window) {
    const onScreen = new Set();
    const watcher = new IntersectionObserver((entries) => {
      entries.forEach((entry) => { if (entry.isIntersecting) onScreen.add(entry.target); else onScreen.delete(entry.target); });
      stick.hidden = onScreen.size > 0;
    });
    document.querySelectorAll('.hero__main, .close').forEach((part) => watcher.observe(part));
  }

  const year = document.getElementById('year');
  if (year) year.textContent = String(new Date().getFullYear());
})();
