import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface SectionHeadingProps {
  eyebrow: string;
  title: string;
  description?: string;
  align?: 'start' | 'center';
  // Use light text on dark section backgrounds
  inverted?: boolean;
  className?: string;
}

// Consistent section header: glowing eyebrow, title that reveals word by word, optional description.
const SectionHeading = ({ eyebrow, title, description, align = 'start', inverted, className }: SectionHeadingProps) => {
  const words = title.split(/\s+/).filter(Boolean);

  return (
    <div className={cn(align === 'center' ? 'mx-auto max-w-3xl text-center' : 'max-w-2xl text-start', className)}>
      <motion.span
        className={cn('eyebrow-light mb-4', align === 'center' && 'justify-center')}
        initial={{ opacity: 0, y: 8 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-60px' }}
        transition={{ duration: 0.5 }}
      >
        {eyebrow}
      </motion.span>
      <h2 className={cn('text-3xl font-extrabold leading-[1.1] tracking-tight md:text-5xl', inverted ? 'text-white' : 'text-foreground')}>
        {words.map((word, i) => (
          <motion.span
            key={`${word}-${i}`}
            className="inline-block whitespace-pre"
            initial={{ opacity: 0, y: '0.5em', filter: 'blur(8px)' }}
            whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.6, delay: 0.05 + i * 0.06, ease: [0.22, 1, 0.36, 1] }}
          >
            {word}
            {i < words.length - 1 ? ' ' : ''}
          </motion.span>
        ))}
      </h2>
      {description && (
        <motion.p
          className={cn('mt-4 text-sm leading-relaxed md:text-base', inverted ? 'text-white/60' : 'text-muted-foreground')}
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          {description}
        </motion.p>
      )}
    </div>
  );
};

export default SectionHeading;
