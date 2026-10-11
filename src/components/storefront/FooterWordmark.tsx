import { useRef } from 'react';

// A huge "QUALITY LIGHT" wordmark: dim outlined letters that light up under the cursor.
const FooterWordmark = () => {
  const ref = useRef<HTMLDivElement>(null);

  const move = (e: React.PointerEvent<HTMLDivElement>) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    el.style.setProperty('--wm-x', `${e.clientX - rect.left}px`);
    el.style.setProperty('--wm-y', `${e.clientY - rect.top}px`);
    el.style.setProperty('--wm-on', '1');
  };

  return (
    <div
      ref={ref}
      onPointerMove={move}
      onPointerLeave={() => ref.current?.style.setProperty('--wm-on', '0')}
      className="wordmark relative select-none overflow-hidden px-4 pb-4 pt-10"
      dir="ltr"
      aria-hidden="true"
    >
      <div className="wordmark-text wordmark-dim">QUALITY LIGHT</div>
      <div className="wordmark-text wordmark-lit absolute inset-x-4 bottom-4">QUALITY LIGHT</div>
    </div>
  );
};

export default FooterWordmark;
