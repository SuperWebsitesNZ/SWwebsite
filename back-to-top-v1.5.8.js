// Super Websites v1.5.8 | Small shared back-to-top control.
const button = document.querySelector('.back-to-top');
if (button) {
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const update = () => {
    const shouldHide = window.scrollY < 500;
    if (shouldHide && document.activeElement === button) {
      // Keep keyboard focus in a useful place when the button disappears.
      const top = document.querySelector('.brand');
      top?.focus({preventScroll: true});
    }
    button.hidden = shouldHide;
  };
  window.addEventListener('scroll', update, {passive: true});
  window.addEventListener('pageshow', update);
  button.addEventListener('click', () => {
    window.scrollTo({
      top: 0,
      behavior: reducedMotion.matches || document.documentElement.classList.contains('motion-paused') ? 'instant' : 'smooth'
    });
  });
  update();
}
