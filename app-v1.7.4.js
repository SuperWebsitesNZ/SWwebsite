// Super Websites v1.7.4 | Activate verified Resend delivery; visitor email remains Reply-To.
import {projectBrief, sendEnquiry} from "./enquiry-v1.5.1.js";
import {chartIsVisible, createCostAnimation} from "./cost-animation-v1.5.1.js";
(() => {
  'use strict';
  const root = document.documentElement;
  const reducedQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
  const motion = document.querySelector('#motion-toggle');
  const menu = document.querySelector('.menu-toggle');
  const navigation = document.querySelector('#navigation');
  const brief = document.querySelector('#brief-dialog');
  const costCard = document.querySelector('#cost-story');
  const agencyTotal = document.querySelector('#agency-total');
  const swTotal = document.querySelector('#sw-total');
  const progress = document.querySelector('#cost-progress');
  const replay = document.querySelector('#cost-replay');
  const bars = [...document.querySelectorAll('.cost-bar')];
  const monthlyAgencyCost = 79;
  const annualUpdateCost = 4 * 50;
  const monthCount = 60;
  const graph = costCard?.querySelector('.chart');
  let costs = null;
  let visibilityFrame = 0;
  let costObserver = null;
  let pageLeaving = false;
  const formatMoney = amount => 'NZ$' + Math.round(amount).toLocaleString('en-NZ');

  function closeMenu() {
    navigation.classList.remove('open');
    menu.setAttribute('aria-expanded', 'false');
    menu.setAttribute('aria-label', 'Open navigation');
    checkCostVisibility();
  }
  menu.addEventListener('click', () => {
    const open = menu.getAttribute('aria-expanded') !== 'true';
    navigation.classList.toggle('open', open);
    menu.setAttribute('aria-expanded', String(open));
    menu.setAttribute('aria-label', open ? 'Close navigation' : 'Open navigation');
    checkCostVisibility();
  });
  navigation.querySelectorAll('a,button').forEach(element => element.addEventListener('click', closeMenu));
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape') closeMenu();
  });

  // Both totals and both sets of bars share the same five-year timeline.
  // Labels/alt text expose final costs even while visual values are moving.
  function renderCosts(month) {
    if (!costCard) return;
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
  // Observe the graph throughout its lifetime; leaving view pauses, returning resumes.
  function checkCostVisibility() {
    if (!costs) return;
    const blocked = pageLeaving || reducedQuery.matches || document.hidden || brief.open
      || root.classList.contains('motion-paused') || navigation.classList.contains('open')
      || document.body.classList.contains('intro-lock');
    const headerBottom = document.querySelector('.header').getBoundingClientRect().bottom;
    costs.setVisibility(chartIsVisible(graph.getBoundingClientRect(), {height: window.innerHeight, width: window.innerWidth}, headerBottom), blocked);
  }
  function queueVisibilityCheck() {
    if (!visibilityFrame && costs) visibilityFrame = requestAnimationFrame(() => {
      visibilityFrame = 0;
      checkCostVisibility();
    });
  }
  if (graph) {
    costs = createCostAnimation({
      render: fraction => renderCosts(fraction * monthCount),
      onState: state => {
        costCard.dataset.animating = String(!state.complete);
        replay.disabled = state.started && !state.complete;
      },
      requestFrame: callback => requestAnimationFrame(callback),
      cancelFrame: id => cancelAnimationFrame(id)
    });
    if ('IntersectionObserver' in window) {
      costObserver = new IntersectionObserver(queueVisibilityCheck, {threshold: [0, .25, .5, .65, .75, 1]});
      costObserver.observe(graph);
    }
    // Geometry checks also handle sticky headers, resizing and the observer fallback.
    window.addEventListener('scroll', queueVisibilityCheck, {passive: true});
    window.addEventListener('resize', queueVisibilityCheck, {passive: true});
    window.addEventListener('pagehide', () => {pageLeaving = true; costs.setBlocked(true);});
    window.addEventListener('pageshow', () => {pageLeaving = false; checkCostVisibility();});
    document.addEventListener('visibilitychange', checkCostVisibility);
    document.addEventListener('sw:intro-started', checkCostVisibility);
    document.addEventListener('sw:intro-finished', checkCostVisibility);
    brief.addEventListener('close', checkCostVisibility);
    replay.addEventListener('click', () => {checkCostVisibility(); costs.replay();});
    if (reducedQuery.matches) costs.finish();
    else queueVisibilityCheck();
  }
  motion.hidden = reducedQuery.matches;
  if (replay) replay.hidden = reducedQuery.matches;
  motion.addEventListener('click', () => {
    const paused = root.classList.toggle('motion-paused');
    motion.setAttribute('aria-pressed', String(paused));
    motion.textContent = paused ? 'Resume motion' : 'Pause motion';
    checkCostVisibility();
  });
  reducedQuery.addEventListener?.('change', () => {
    motion.hidden = reducedQuery.matches;
    if (replay) replay.hidden = reducedQuery.matches;
    if (reducedQuery.matches) {
      root.classList.remove('motion-paused');
      motion.setAttribute('aria-pressed', 'false');
      motion.textContent = 'Pause motion';
      costs?.finish();
    }
    checkCostVisibility();
  });

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
    checkCostVisibility();
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
  const runtime = JSON.parse(document.querySelector('#site-runtime').textContent);
  const submit = form.querySelector('[type="submit"]');
  let submitting = false;
  form.addEventListener('submit', async event => {
    event.preventDefault();
    if (submitting) return;
    const values = new FormData(form);
    const fields = Object.fromEntries(['name', 'email', 'business', 'type', 'website', 'goal', 'company_url'].map(key => [key, String(values.get(key) || '').trim()]));
    if (fields.company_url) { status.textContent = 'Please leave the extra field empty.'; return; }
    for (const key of ['business', 'goal', ...(runtime.formEndpoint || runtime.contactEmail ? ['name', 'email'] : [])]) {
      if (!fields[key]) {
        status.textContent = 'Please complete the required fields.';
        form.elements.namedItem(key).focus();
        return;
      }
    }
    draft = projectBrief(fields);
    result.textContent = draft;
    result.hidden = false;
    copy.hidden = false;
    if (runtime.formEndpoint) {
      submitting = true;
      submit.disabled = true;
      form.setAttribute('aria-busy', 'true');
      // Keep the submitted snapshot stable while the request is in flight.
      const controls = [...form.querySelectorAll('input, select, textarea')];
      controls.forEach(control => control.disabled = true);
      status.textContent = 'Sending your enquiry…';
      try {
        await sendEnquiry(runtime.formEndpoint, fields);
        status.textContent = 'Thanks! Your enquiry has been sent to our team. We’ll be in touch.';
      } catch {
        status.textContent = 'We couldn’t confirm delivery. Your brief is saved below; copy it or try again.';
      } finally {
        submitting = false;
        submit.disabled = false;
        controls.forEach(control => control.disabled = false);
        form.removeAttribute('aria-busy');
      }
    } else if (runtime.contactEmail) {
      window.location.href = 'mailto:' + encodeURIComponent(runtime.contactEmail)
        + '?subject=' + encodeURIComponent('Website enquiry — ' + fields.business)
        + '&body=' + encodeURIComponent(draft);
      status.textContent = 'Email draft opened. Send it from your email app; nothing has been sent by this website.';
    } else status.textContent = 'Brief ready. Nothing has been sent.';
  });
  form.addEventListener('input', () => {
    if (!draft) return;
    result.hidden = true;
    copy.hidden = true;
    draft = '';
    status.textContent = 'Submit again to include your changes.';
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
