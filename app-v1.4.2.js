// Super Websites v1.4.2 | 2026-10-14
// Updated floating artwork, two-series cost animation, mobile navigation and local brief builder.
// Demo-only brief: no enquiry transmission or server storage.
(() => {
  'use strict';
  const root = document.documentElement;
  const reducedQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
  const motion = document.querySelector('#motion-toggle');
  const menu = document.querySelector('.menu-toggle');
  const navigation = document.querySelector('#navigation');
  const costCard = document.querySelector('#cost-story');
  const agencyTotal = document.querySelector('#agency-total');
  const swTotal = document.querySelector('#sw-total');
  const progress = document.querySelector('#cost-progress');
  const replay = document.querySelector('#cost-replay');
  const bars = [...document.querySelectorAll('.cost-bar')];
  const monthlyAgencyCost = 79;
  const annualUpdateCost = 4 * 50;
  const monthCount = 60;
  const duration = 5200;
  let animationFrame = 0;
  let elapsed = 0;
  let lastTime = null;
  let isAnimating = false;
  let costObserver = null;
  const formatMoney = amount => 'NZ$' + Math.round(amount).toLocaleString('en-NZ');

  function closeMenu() {
    navigation.classList.remove('open');
    menu.setAttribute('aria-expanded', 'false');
    menu.setAttribute('aria-label', 'Open navigation');
  }
  menu.addEventListener('click', () => {
    const open = menu.getAttribute('aria-expanded') !== 'true';
    navigation.classList.toggle('open', open);
    menu.setAttribute('aria-expanded', String(open));
    menu.setAttribute('aria-label', open ? 'Close navigation' : 'Open navigation');
  });
  navigation.querySelectorAll('a,button').forEach(element => element.addEventListener('click', closeMenu));
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape') closeMenu();
  });

  // Both totals and both sets of bars share the same five-year timeline.
  // Labels/alt text expose final costs even while visual values are moving.
  function renderCosts(month) {
    agencyTotal.textContent = formatMoney(month * monthlyAgencyCost);
    swTotal.textContent = formatMoney(month / 12 * annualUpdateCost);
    for (const bar of bars) {
      const year = Number(bar.dataset.year);
      const height = Number(bar.dataset.height);
      const yearProgress = Math.max(0, Math.min(1, (month - (year - 1) * 12) / 12));
      const currentHeight = height * yearProgress;
      bar.setAttribute('y', String(250 - currentHeight));
      bar.setAttribute('height', String(currentHeight));
    }
    progress.textContent = month >= monthCount ? 'Five years later.' : Math.floor(month) + ' of 60 months';
  }
  function finishCosts() {
    cancelAnimationFrame(animationFrame);
    animationFrame = 0;
    isAnimating = false;
    elapsed = duration;
    lastTime = null;
    renderCosts(monthCount);
    costCard.dataset.animating = 'false';
    replay.disabled = false;
  }
  function tick(time) {
    if (!isAnimating) return;
    if (lastTime !== null) elapsed += time - lastTime;
    lastTime = time;
    const fraction = Math.min(1, elapsed / duration);
    renderCosts(fraction * monthCount);
    if (fraction < 1) animationFrame = requestAnimationFrame(tick);
    else finishCosts();
  }
  function resumeCosts() {
    if (!isAnimating || root.classList.contains('motion-paused') || document.hidden) return;
    lastTime = null;
    cancelAnimationFrame(animationFrame);
    animationFrame = requestAnimationFrame(tick);
  }
  function startCosts() {
    if (reducedQuery.matches) return finishCosts();
    cancelAnimationFrame(animationFrame);
    elapsed = 0;
    lastTime = null;
    isAnimating = true;
    costCard.dataset.animating = 'true';
    replay.disabled = true;
    renderCosts(0);
    resumeCosts();
  }
  function suspendCosts() {
    cancelAnimationFrame(animationFrame);
    animationFrame = 0;
    lastTime = null;
  }
  replay.addEventListener('click', startCosts);
  motion.hidden = reducedQuery.matches;
  motion.addEventListener('click', () => {
    const paused = root.classList.toggle('motion-paused');
    motion.setAttribute('aria-pressed', String(paused));
    motion.textContent = paused ? 'Resume motion' : 'Pause motion';
    if (paused) suspendCosts();
    else resumeCosts();
  });
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) suspendCosts();
    else resumeCosts();
  });
  if (!reducedQuery.matches) {
    replay.hidden = false;
    if ('IntersectionObserver' in window) {
      // Initial HTML stays complete with JavaScript off. Prepare only after JS loads.
      renderCosts(0);
      costCard.dataset.animating = 'true';
      costObserver = new IntersectionObserver(entries => {
        if (entries.some(entry => entry.isIntersecting)) {
          costObserver.disconnect();
          costObserver = null;
          startCosts();
        }
      }, { threshold: 0.25 });
      costObserver.observe(costCard);
    } else startCosts();
  } else finishCosts();
  reducedQuery.addEventListener?.('change', () => {
    motion.hidden = reducedQuery.matches;
    replay.hidden = reducedQuery.matches;
    if (reducedQuery.matches) {
      costObserver?.disconnect();
      costObserver = null;
      root.classList.remove('motion-paused');
      motion.setAttribute('aria-pressed', 'false');
      motion.textContent = 'Pause motion';
      finishCosts();
    }
  });

  const brief = document.querySelector('#brief-dialog');
  // v1.4.1: expand and spin the clicked button's rectangle into the actual modal.
  // Measure before mobile navigation closes; use transforms rather than animating layout.
  let briefMorph = null;
  function settleBriefMorph() {
    const morph = briefMorph;
    briefMorph = null;
    brief.classList.remove('dialog-morphing');
    if (!morph) return;
    morph.source.classList.remove('brief-launching');
    for (const animation of morph.animations) animation.cancel();
  }
  function openBrief(sourceButton) {
    if (brief.open) return;
    settleBriefMorph();
    const source = sourceButton.getBoundingClientRect();
    brief.showModal();
    if (reducedQuery.matches || root.classList.contains('motion-paused') || typeof brief.animate !== 'function') return;
    const target = brief.getBoundingClientRect();
    if (!source.width || !source.height || !target.width || !target.height) return;
    const dx = source.left + source.width / 2 - target.left - target.width / 2;
    const dy = source.top + source.height / 2 - target.top - target.height / 2;
    const sx = source.width / target.width;
    const sy = source.height / target.height;
    const sourceColour = getComputedStyle(sourceButton).backgroundColor;
    const targetColour = getComputedStyle(brief).backgroundColor;
    const morph = { source: sourceButton, animations: [] };
    briefMorph = morph;
    brief.classList.add('dialog-morphing');
    sourceButton.classList.add('brief-launching');
    try {
      const options = { duration: 720, easing: 'cubic-bezier(.22,.75,.3,1)', fill: 'both' };
      morph.animations.push(brief.animate([
        { offset: 0, transform: `translate(${dx}px, ${dy}px) rotate(0deg) scale(${sx}, ${sy})`, backgroundColor: sourceColour, borderRadius: '3px' },
        { offset: 0.42, transform: `translate(${dx * 0.4}px, ${dy * 0.4 - 24}px) rotate(165deg) scale(.62, .52)`, backgroundColor: sourceColour, borderRadius: '12px' },
        { offset: 0.82, transform: 'translate(0px, 0px) rotate(354deg) scale(1.025, 1.025)', backgroundColor: targetColour, borderRadius: '2px' },
        { offset: 1, transform: 'translate(0px, 0px) rotate(360deg) scale(1, 1)', backgroundColor: targetColour, borderRadius: '0px' }
      ], options));
      for (const content of brief.querySelectorAll('.dialog-head, .dialog-body')) {
        morph.animations.push(content.animate([
          { offset: 0, opacity: 0 },
          { offset: 0.52, opacity: 0 },
          { offset: 1, opacity: 1 }
        ], options));
      }
      Promise.all(morph.animations.map(animation => animation.finished)).then(
        () => { if (briefMorph === morph) settleBriefMorph(); },
        () => { if (briefMorph === morph) settleBriefMorph(); }
      );
    } catch {
      // An animation failure must never block opening or using the form.
      settleBriefMorph();
    }
  }
  document.querySelectorAll('[data-brief]').forEach(element => {
    element.addEventListener('click', () => openBrief(element), { capture: true });
  });
  brief.addEventListener('cancel', settleBriefMorph);
  brief.addEventListener('close', settleBriefMorph);
  window.addEventListener('resize', settleBriefMorph);
  reducedQuery.addEventListener?.('change', () => {
    if (reducedQuery.matches) settleBriefMorph();
  });
  brief.querySelector('.dialog-close').addEventListener('click', () => brief.close());
  brief.addEventListener('click', event => {
    if (event.target !== brief) return;
    const rect = brief.getBoundingClientRect();
    if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) brief.close();
  });
  const form = document.querySelector('#brief-form');
  const result = document.querySelector('#brief-result');
  const copy = document.querySelector('#copy-brief');
  const status = document.querySelector('#brief-status');
  let draft = '';
  form.addEventListener('submit', event => {
    event.preventDefault();
    const fields = new FormData(form);
    draft = 'SUPER WEBSITES / PROJECT BRIEF\n\nBusiness: ' + fields.get('business').trim()
      + '\nProject: ' + fields.get('type')
      + '\nExisting website: ' + (fields.get('website').trim() || 'None supplied')
      + '\n\nWhat I want the website to do:\n' + fields.get('goal').trim()
      + '\n\nPreference: A website I own, without a required ongoing website subscription.';
    result.textContent = draft;
    result.hidden = false;
    copy.hidden = false;
    status.textContent = 'Brief ready. Nothing has been sent.';
  });
  form.addEventListener('input', () => {
    if (!draft) return;
    result.hidden = true;
    copy.hidden = true;
    draft = '';
    status.textContent = 'Prepare your brief again to include your changes.';
  });
  copy.addEventListener('click', async () => {
    if (!draft) return;
    try {
      await navigator.clipboard.writeText(draft);
      status.textContent = 'Copied. Ready to paste wherever you need it.';
    } catch {
      const selection = window.getSelection();
      const range = document.createRange();
      range.selectNodeContents(result);
      selection.removeAllRanges();
      selection.addRange(range);
      status.textContent = 'Select and copy the brief below.';
    }
  });
})();


