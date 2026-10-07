// MURR page: full-size screenshot viewer + module nav highlighting

// Lightbox
const lightbox = document.getElementById('lightbox');
const lightboxImg = lightbox.querySelector('img');
let lastShot = null;

document.querySelectorAll('.shot').forEach((shot) => {
  shot.addEventListener('click', () => {
    lastShot = shot;
    lightboxImg.src = shot.dataset.full;
    lightboxImg.alt = shot.querySelector('img').alt;
    lightbox.showModal();
    lightbox.scrollTop = 0;
  });
});
lightbox.querySelector('.lightbox__close').addEventListener('click', () => lightbox.close());
// Clicking the dark backdrop closes it
lightbox.addEventListener('click', (event) => {
  if (event.target === lightbox) lightbox.close();
});
lightbox.addEventListener('close', () => {
  if (lastShot) lastShot.focus();
});

// Module nav: highlight the module in view, mark when the bar is stuck
const moduleLinks = [...document.querySelectorAll('.m-nav__pill a')];
const modules = moduleLinks.map((a) => document.querySelector(a.getAttribute('href')));
const moduleNav = document.querySelector('.m-nav');

if ('IntersectionObserver' in window) {
  const spy = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        moduleLinks.forEach((a) => {
          const active = a.getAttribute('href') === `#${entry.target.id}`;
          a.classList.toggle('is-active', active);
          if (active) {
            // Keep the active pill visible on narrow screens without moving the page
            const pill = a.parentElement;
            pill.scrollTo({ left: a.offsetLeft - pill.clientWidth / 2 + a.offsetWidth / 2, behavior: 'smooth' });
          }
        });
      });
    },
    { rootMargin: '-45% 0px -50% 0px' }
  );
  modules.forEach((m) => m && spy.observe(m));

  const sentinel = document.createElement('div');
  moduleNav.before(sentinel);
  new IntersectionObserver(([entry]) => moduleNav.classList.toggle('is-stuck', !entry.isIntersecting)).observe(sentinel);
}
