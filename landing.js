(() => {
  const block = document.querySelector('[data-ram-block]');
  if (!block) return;
  const variants = {
    gold: {
      name: 'С золотыми рожками',
      description: 'Пышные фарфоровые завитки и выразительные золотые рожки. Небольшая скульптура, которая становится заметной деталью праздничной ёлки.',
      material: 'Белый фарфор. Декор золотом ручного нанесения. В фирменной подарочной упаковке SAGARTI.',
      price: '12 000 ₽',
      url: 'https://sagarti.com/shop/p/erp-658/',
      nextLabel: 'Перевернуть карточку: показать белого барашка'
    },
    white: {
      name: 'Белоснежный',
      description: 'Матовый белый фарфор, мягкие завитки и спокойная улыбка. Боковой свет раскрывает рельеф — каждую деталь хочется рассмотреть поближе.',
      material: 'Белый фарфор, матовые рожки и золотистая лента. В фирменной подарочной упаковке SAGARTI.',
      price: '8 000 ₽',
      url: 'https://sagarti.com/shop/p/erp-676/',
      nextLabel: 'Перевернуть карточку: показать барашка с золотыми рожками'
    }
  };
  const flip = block.querySelector('[data-ram-flip]');
  const choices = [...block.querySelectorAll('[data-ram-choice]')];
  let selected = 'gold';
  function selectVariant(key) {
    if (!variants[key] || key === selected) return;
    selected = key;
    const variant = variants[key];
    flip.classList.toggle('is-white', key === 'white');
    flip.setAttribute('aria-label', variant.nextLabel);
    choices.forEach(button => button.setAttribute('aria-pressed', String(button.dataset.ramChoice === key)));
    block.querySelectorAll('[data-ram-face]').forEach(face => face.setAttribute('aria-hidden', String(face.dataset.ramFace !== key)));
    for (const field of ['name', 'description', 'material', 'price']) {
      block.querySelector(`[data-ram-${field}]`).textContent = variant[field];
    }
    block.querySelector('[data-ram-link]').href = variant.url;
  }
  flip.addEventListener('click', () => selectVariant(selected === 'gold' ? 'white' : 'gold'));
  choices.forEach(button => button.addEventListener('click', () => selectVariant(button.dataset.ramChoice)));
})();
