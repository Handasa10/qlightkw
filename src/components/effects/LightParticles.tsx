import { useEffect, useRef } from 'react';

interface LightParticlesProps {
  // Particle color as "r, g, b"
  color: string;
  density?: number;
  className?: string;
}

interface Mote {
  x: number;
  y: number;
  r: number;
  vx: number;
  vy: number;
  phase: number;
}

// Slow drifting dust motes, like particles caught in a beam of light.
// Pauses when off-screen or when the tab is hidden.
const LightParticles = ({ color, density = 60, className }: LightParticlesProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const colorRef = useRef(color);
  colorRef.current = color;

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return;

    let width = 0;
    let height = 0;
    let motes: Mote[] = [];
    let frame = 0;
    let visible = true;

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = canvas.clientWidth;
      height = canvas.clientHeight;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const count = Math.round((density * width * height) / (1440 * 900));
      motes = Array.from({ length: Math.max(12, count) }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        r: Math.random() * 1.8 + 0.4,
        vx: (Math.random() - 0.5) * 0.15,
        vy: -Math.random() * 0.25 - 0.05,
        phase: Math.random() * Math.PI * 2,
      }));
    };

    const tick = (time: number) => {
      ctx.clearRect(0, 0, width, height);
      for (const m of motes) {
        m.x += m.vx + Math.sin(time / 2000 + m.phase) * 0.08;
        m.y += m.vy;
        if (m.y < -5) { m.y = height + 5; m.x = Math.random() * width; }
        if (m.x < -5) m.x = width + 5;
        if (m.x > width + 5) m.x = -5;
        const twinkle = 0.35 + 0.65 * Math.abs(Math.sin(time / 1500 + m.phase));
        ctx.beginPath();
        ctx.fillStyle = `rgba(${colorRef.current}, ${0.55 * twinkle})`;
        ctx.shadowColor = `rgba(${colorRef.current}, 0.9)`;
        ctx.shadowBlur = 6;
        ctx.arc(m.x, m.y, m.r, 0, Math.PI * 2);
        ctx.fill();
      }
      if (visible) frame = requestAnimationFrame(tick);
    };

    const start = () => {
      cancelAnimationFrame(frame);
      if (visible && !document.hidden) frame = requestAnimationFrame(tick);
    };

    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      start();
    });
    observer.observe(canvas);

    const onVisibility = () => start();
    document.addEventListener('visibilitychange', onVisibility);
    window.addEventListener('resize', resize);
    resize();
    start();

    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
      document.removeEventListener('visibilitychange', onVisibility);
      window.removeEventListener('resize', resize);
    };
  }, [density]);

  return <canvas ref={canvasRef} className={className} aria-hidden="true" />;
};

export default LightParticles;
