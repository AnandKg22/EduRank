import { motion } from 'framer-motion';

export default function Card({
  children,
  className = '',
  glow = false,
  hoverable = false,
  padding = 'p-6',
  ...props
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      whileHover={hoverable ? { y: -2, scale: 1.01 } : {}}
      className={`
        glass rounded-xl ${padding}
        ${glow ? 'glow-primary' : ''}
        ${hoverable ? 'cursor-pointer transition-shadow hover:shadow-lg' : ''}
        ${className}
      `}
      {...props}
    >
      {children}
    </motion.div>
  );
}
