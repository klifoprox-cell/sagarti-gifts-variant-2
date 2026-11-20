(() => {
  // Match the porcelain figures' visual scale independently of their ribbons.
  document.querySelectorAll('.variants img').forEach(picture => {
    const file = picture.getAttribute('src');
    const variant = file.includes('yoga-classic') ? 'classic' : file.includes('yoga-shorts') ? 'shorts' : file.includes('yoga-shirt') ? 'shirt' : null;
    if (!variant) return;
    const frame = document.createElement('div');
    frame.className = 'variant-frame variant-' + variant;
    frame.style.setProperty('--variant-background', `url("${file}")`);
    picture.replaceWith(frame);
    frame.append(picture);
  });
  const heroVideo = document.getElementById('hero-video');
  if (heroVideo && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    heroVideo.muted = true;
    heroVideo.play().catch(() => { /* Native controls remain available if autoplay is blocked. */ });
  }
})();

// A single, quiet entrance for each card; content stays visible without JS.
(() => {
  const preference = window.matchMedia('(prefers-reduced-motion: reduce)');
  if (preference.matches || !('IntersectionObserver' in window) || !Element.prototype.animate) return;
  const animations = new Set();
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      observer.unobserve(entry.target);
      if (preference.matches) return;
      const siblings = Array.from(entry.target.parentElement.children);
      const stagger = Math.min(siblings.indexOf(entry.target), 2) * 70;
      const animation = entry.target.animate([
        { opacity: 0, transform: 'translateY(20px)' },
        { opacity: 1, transform: 'translateY(0)' }
      ], { duration: 650, delay: stagger, easing: 'cubic-bezier(.22,1,.36,1)', fill: 'backwards' });
      animations.add(animation);
      animation.finished.catch(() => {}).finally(() => animations.delete(animation));
    });
  }, { threshold: 0.06, rootMargin: '0px 0px -24px 0px' });
  document.querySelectorAll('.gallery, .variants figure, .horse-sets .pair > article').forEach(card => observer.observe(card));
  preference.addEventListener('change', event => {
    if (!event.matches) return;
    observer.disconnect();
    animations.forEach(animation => animation.cancel());
    animations.clear();
  });
})();

