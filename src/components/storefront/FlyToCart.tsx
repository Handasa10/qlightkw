import { createPortal } from 'react-dom';
import { motion } from 'framer-motion';
import { useStoreUI } from '@/contexts/StoreUIContext';

// The product photo flies along an arc into the cart icon
const FlyToCart = () => {
  const { flights } = useStoreUI();
  return createPortal(
    <>
      {flights.map((f) => {
        const size = Math.min(f.from.width, f.from.height, 160);
        const startX = f.from.left + f.from.width / 2 - size / 2;
        const startY = f.from.top + f.from.height / 2 - size / 2;
        const endX = f.to.left + f.to.width / 2 - size / 2;
        const endY = f.to.top + f.to.height / 2 - size / 2;
        return (
          <motion.img
            key={f.id}
            src={f.src}
            alt=""
            className="pointer-events-none fixed left-0 top-0 z-[200] rounded-2xl object-cover shadow-2xl"
            style={{ width: size, height: size }}
            initial={{ x: startX, y: startY, scale: 1, opacity: 1, rotate: 0 }}
            animate={{ x: [startX, (startX + endX) / 2, endX], y: [startY, Math.min(startY, endY) - 120, endY], scale: [1, 0.6, 0.12], opacity: [1, 1, 0.3], rotate: [0, -12, 0] }}
            transition={{ duration: 0.75, ease: [0.45, 0, 0.2, 1] }}
          />
        );
      })}
    </>,
    document.body,
  );
};

export default FlyToCart;
