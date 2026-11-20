(() => {
  const section = document.getElementById('boutique-catalog');
  if (!section) return;
  const track = section.querySelector('.catalog-track');
  const cards = [...section.querySelectorAll('.catalog-card')];
  const previous = section.querySelector('[data-catalog-previous]');
  const next = section.querySelector('[data-catalog-next]');
  const toggle = section.querySelector('[data-catalog-toggle]');
  const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
  let paused = reducedMotion.matches;
  let visible = false;
  let hovered = false;
  let focused = false;
  let dragging = false;
  let coolingDown = false;
  let cooldown;
  let frame = 0;
  let lastTime = 0;
  let cardStep = 0;
  let loopWidth = 0;
  let motionPosition = 0;
  // The second copy makes the moving row continuous; assistive technology reads each product once.
  cards.forEach(card => {
    const clone = card.cloneNode(true);
    clone.classList.add('catalog-card-clone');
    clone.setAttribute('aria-hidden', 'true');
    clone.querySelectorAll('img').forEach(img => { img.alt = ''; });
    track.append(clone);
  });
  const canRun = () => !paused && visible && !hovered && !focused && !dragging && !coolingDown && !document.hidden;
  function tick(now) {
    frame = 0;
    if (!canRun()) { lastTime = 0; return; }
    if (lastTime && loopWidth) {
      const seconds = Math.min((now - lastTime) / 1000, .05);
      const speed = matchMedia('(max-width: 700px)').matches ? 18 : 25;
      // Accumulate fractional movement independently of browser scroll rounding.
      motionPosition += speed * seconds;
      if (motionPosition >= loopWidth) motionPosition %= loopWidth;
      track.scrollLeft = motionPosition;
    }
    lastTime = now;
    frame = requestAnimationFrame(tick);
  }
  function syncMotion() {
    toggle.setAttribute('aria-pressed', String(paused));
    toggle.setAttribute('aria-label', paused ? 'Продолжить движение карточек' : 'Приостановить движение карточек');
    if (canRun()) {
      if (!frame) { motionPosition = track.scrollLeft; lastTime = 0; frame = requestAnimationFrame(tick); }
    } else {
      cancelAnimationFrame(frame); frame = 0; lastTime = 0;
    }
  }
  const restAfterInteraction = () => {
    coolingDown = true;
    clearTimeout(cooldown);
    cooldown = setTimeout(() => { coolingDown = false; syncMotion(); }, 4000);
    syncMotion();
  };
  const move = direction => {
    restAfterInteraction();
    if (direction < 0 && track.scrollLeft < cardStep) track.scrollLeft += loopWidth;
    track.scrollBy({left: direction * cardStep, behavior: reducedMotion.matches ? 'instant' : 'smooth'});
  };
  toggle.addEventListener('click', () => { paused = !paused; syncMotion(); });
  previous.addEventListener('click', () => move(-1));
  next.addEventListener('click', () => move(1));
  track.addEventListener('mouseenter', () => { hovered = true; syncMotion(); });
  track.addEventListener('mouseleave', () => { hovered = false; syncMotion(); });
  track.addEventListener('focusin', () => { focused = true; syncMotion(); });
  track.addEventListener('focusout', () => { focused = false; syncMotion(); });
  track.addEventListener('pointerdown', () => { dragging = true; syncMotion(); });
  window.addEventListener('pointerup', () => {
    if (!dragging) return;
    dragging = false; restAfterInteraction();
  });
  track.addEventListener('pointercancel', () => { dragging = false; restAfterInteraction(); });
  track.addEventListener('wheel', restAfterInteraction, {passive:true});
  track.addEventListener('keydown', event => {
    if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
      event.preventDefault();
      move(event.key === 'ArrowRight' ? 1 : -1);
    }
    if (event.key === 'Home' || event.key === 'End') {
      event.preventDefault();
      restAfterInteraction();
      track.scrollTo({left: event.key === 'Home' ? 0 : loopWidth - cardStep, behavior: reducedMotion.matches ? 'instant' : 'smooth'});
    }
  });
  new ResizeObserver(() => {
    const progress = loopWidth ? (track.scrollLeft % loopWidth) / loopWidth : 0;
    cardStep = cards.length > 1 ? cards[1].getBoundingClientRect().left - cards[0].getBoundingClientRect().left : track.clientWidth;
    loopWidth = cardStep * cards.length;
    motionPosition = progress * loopWidth;
    track.scrollLeft = motionPosition;
  }).observe(track);
  new IntersectionObserver(entries => { visible = entries[0].isIntersecting; syncMotion(); }, {threshold:.1}).observe(section);
  reducedMotion.addEventListener('change', () => { paused = reducedMotion.matches; syncMotion(); });
  document.addEventListener('visibilitychange', syncMotion);
  syncMotion();
})();
