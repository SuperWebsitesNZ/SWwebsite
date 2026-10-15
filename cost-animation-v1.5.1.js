// Super Websites v1.5.1 | A timeline that advances only while the graph can be seen.
export function chartIsVisible(rect, viewport, headerBottom = 0) {
  const top = Math.max(0, headerBottom) + 12;
  const height = viewport.height - top;
  if (rect.height <= 0 || rect.width <= 0 || height <= 0) return false;
  const visibleHeight = Math.max(0, Math.min(rect.bottom, viewport.height) - Math.max(rect.top, top));
  const visibleWidth = Math.max(0, Math.min(rect.right, viewport.width) - Math.max(rect.left, 0));
  // Cap the reference size at the available viewport, for short screens/zoom.
  return visibleHeight >= Math.min(rect.height, height) * .65
    && visibleWidth >= Math.min(rect.width, viewport.width) * .65;
}

export function createCostAnimation({render, onState, requestFrame, cancelFrame, duration = 5200}) {
  let visible = false, blocked = false, started = false, complete = false;
  let running = false, elapsed = 0, lastTime = null, frame = 0;
  const notify = () => onState({started, complete, running});
  function stop() {
    cancelFrame(frame);
    frame = 0;
    lastTime = null;
    running = false;
  }
  function finish() {
    stop();
    complete = true;
    elapsed = duration;
    render(1);
    notify();
  }
  function tick(time) {
    frame = 0;
    if (!running) return;
    if (lastTime !== null) elapsed += Math.max(0, time - lastTime);
    lastTime = time;
    render(Math.min(1, elapsed / duration));
    if (elapsed >= duration) finish();
    else frame = requestFrame(tick);
  }
  function update() {
    if (!visible || blocked || complete) stop();
    else if (!running) {
      started = true;
      running = true;
      lastTime = null;
      frame = requestFrame(tick);
    }
    notify();
  }
  render(0);
  notify();
  return {
    setVisibility(value, blockedValue) { visible = Boolean(value); blocked = Boolean(blockedValue); update(); },
    setVisible(value) { visible = Boolean(value); update(); },
    setBlocked(value) { blocked = Boolean(value); update(); },
    finish,
    replay() { stop(); started = false; complete = false; elapsed = 0; render(0); update(); }
  };
}
