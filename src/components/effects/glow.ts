import type React from 'react';

// Pointer handlers for elements with the `glow-card` class: the border and surface
// light up where the cursor is. Writes CSS variables directly, so no re-renders.
export const glowHandlers = {
  onPointerMove(e: React.PointerEvent<HTMLElement>) {
    if (e.pointerType !== 'mouse') return;
    const el = e.currentTarget;
    const rect = el.getBoundingClientRect();
    el.style.setProperty('--glow-x', `${e.clientX - rect.left}px`);
    el.style.setProperty('--glow-y', `${e.clientY - rect.top}px`);
    el.style.setProperty('--glow-opacity', '1');
  },
  onPointerLeave(e: React.PointerEvent<HTMLElement>) {
    e.currentTarget.style.setProperty('--glow-opacity', '0');
  },
};
