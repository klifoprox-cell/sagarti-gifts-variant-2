(() => {
  const hero = document.querySelector('.snow-hero');
  if (!hero) return;
  const preference = matchMedia('(prefers-reduced-motion: reduce)');
  let enabled = !preference.matches;
  let visible = true;
  const layer = document.createElement('div');
  layer.className = 'page-snow';
  layer.setAttribute('aria-hidden', 'true');
  for (let i = 0; i < 42; i++) {
    const flake = document.createElement('i');
    flake.className = 'page-snow-flake';
    const size = 8 + (i * 7 % 12);
    const duration = 11 + (i * 3 % 10);
    flake.style.cssText = `--x:${(i * 37.7) % 100}%;--size:${size}px;--duration:${duration}s;--delay:-${(i * 2.73) % duration}s;--drift:${(i % 2 ? 1 : -1) * (16 + i % 40)}px;--alpha:${0.4 + (i % 5) * 0.09};--blur:${i % 3 === 0 ? 1.3 : 0.45}px`;
    layer.append(flake);
  }
  const toggle = document.createElement('button');
  toggle.type = 'button';
  toggle.className = 'snow-toggle';
  const update = () => {
    layer.hidden = !enabled;
    layer.dataset.running = String(enabled && visible && !document.hidden);
    toggle.textContent = enabled ? '❄ Снег: вкл.' : '❄ Снег: выкл.';
    toggle.setAttribute('aria-label', enabled ? 'Остановить снег' : 'Включить снег');
    toggle.setAttribute('aria-pressed', String(enabled));
  };
  toggle.addEventListener('click', () => { enabled = !enabled; update(); });
  preference.addEventListener('change', () => { enabled = !preference.matches; update(); });
  document.addEventListener('visibilitychange', update);
  hero.append(layer, toggle);
  const resize = () => layer.style.setProperty('--snow-travel', `${hero.clientHeight}px`);
  new ResizeObserver(resize).observe(hero);
  new IntersectionObserver(entries => {
    visible = entries[0].isIntersecting;
    update();
  }).observe(hero);
  resize();
  update();
})();
