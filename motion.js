(() => {
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  document.querySelectorAll('[data-motion]').forEach(block => {
    const button = block.querySelector('.motion-control');
    const image = block.querySelector('[data-animated-src]');
    const poster = image?.getAttribute('src');
    let enabled = !reduced.matches;
    let visible = false;
    const update = () => {
      const active = enabled && visible && !document.hidden;
      block.dataset.motionActive = String(active);
      if (image) {
        const source = active ? image.dataset.animatedSrc : poster;
        if (image.getAttribute('src') !== source) image.src = source;
      }
      button.textContent = enabled ? 'Пауза анимации' : 'Включить анимацию';
      button.setAttribute('aria-pressed', String(enabled));
    };
    button.hidden = false;
    button.addEventListener('click', () => { enabled = !enabled; update(); });
    reduced.addEventListener('change', () => { enabled = !reduced.matches; update(); });
    document.addEventListener('visibilitychange', update);
    new IntersectionObserver(entries => {
      visible = entries[0].isIntersecting;
      update();
    }, {threshold: 0.05}).observe(block);
    update();
  });
})();
