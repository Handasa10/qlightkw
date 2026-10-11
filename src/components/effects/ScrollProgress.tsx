import { motion, useScroll, useSpring } from 'framer-motion';

// A thin glowing line at the very top of the page that fills as you scroll.
const ScrollProgress = () => {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 140, damping: 30, mass: 0.3 });

  return (
    <motion.div
      className="scroll-light pointer-events-none fixed inset-x-0 top-0 z-[60] h-[2px] origin-left rtl:origin-right"
      style={{ scaleX }}
      aria-hidden="true"
    />
  );
};

export default ScrollProgress;
