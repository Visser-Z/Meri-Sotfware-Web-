// Flowing teal lines behind the hero: a ribbon of thin waves, brighter towards the right.
// Draws on <canvas data-waves>. Moves slowly, and stays still when the visitor prefers less motion.
(() => {
  const canvas = document.querySelector('canvas[data-waves]');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const still = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const LINES = 42;
  let width = 0;
  let height = 0;

  const size = () => {
    const ratio = Math.min(window.devicePixelRatio || 1, 2);
    width = canvas.clientWidth;
    height = canvas.clientHeight;
    canvas.width = Math.round(width * ratio);
    canvas.height = Math.round(height * ratio);
    ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
  };

  const draw = (time) => {
    const t = time / 9000;
    ctx.clearRect(0, 0, width, height);
    const phone = width < 700;
    // The ribbon sits on the right on wide screens, and along the bottom on phones
    const centre = phone ? height * 0.78 : height * 0.56;
    const spread = phone ? height * 0.16 : height * 0.26;
    const start = phone ? 0 : width * 0.32;
    const gradient = ctx.createLinearGradient(start, 0, width, 0);
    gradient.addColorStop(0, 'rgba(15, 111, 105, 0)');
    gradient.addColorStop(0.3, 'rgba(22, 132, 125, 0.8)');
    gradient.addColorStop(0.7, 'rgba(63, 159, 151, 1)');
    gradient.addColorStop(1, 'rgba(212, 235, 232, 1)');
    ctx.strokeStyle = gradient;
    // A soft glow, so the ribbon reads as light rather than thin wire
    ctx.shadowColor = 'rgba(63, 159, 151, 0.55)';
    ctx.shadowBlur = 8;

    for (let i = 0; i < LINES; i++) {
      const k = i / (LINES - 1);
      ctx.globalAlpha = 0.35 + 0.65 * Math.sin(Math.PI * k);
      ctx.lineWidth = 1 + 0.9 * Math.sin(Math.PI * k);
      ctx.beginPath();
      for (let x = start; x <= width + 10; x += 8) {
        const u = (x - start) / Math.max(width - start, 1);
        const twist = Math.sin(u * 3.1 + t * 2 + k * 1.6) * spread * (0.55 + 0.45 * u);
        const swell = Math.sin(u * 7.3 - t * 3 + k * 4.2) * spread * 0.12;
        const y = centre + (k - 0.5) * spread * (0.35 + 0.9 * u) + twist + swell;
        if (x === start) ctx.moveTo(x, y); else ctx.lineTo(x, y);
      }
      ctx.stroke();
    }
    ctx.globalAlpha = 1;
  };

  let running = false;
  const loop = (time) => { draw(time); if (running) requestAnimationFrame(loop); };
  size();
  if (still) { draw(0); } else {
    // Only animate while the hero is on screen
    const watch = new IntersectionObserver(([entry]) => {
      const wasRunning = running;
      running = entry.isIntersecting;
      if (running && !wasRunning) requestAnimationFrame(loop);
    });
    watch.observe(canvas);
  }
  window.addEventListener('resize', () => { size(); if (still || !running) draw(0); });
})();
