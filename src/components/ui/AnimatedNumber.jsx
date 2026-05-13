import { useEffect, useState } from 'react';
import { useSpring } from 'framer-motion';

/**
 * AnimatedNumber — Smoothly animates between number values.
 */
export const AnimatedNumber = ({
  value,
  prefix = '',
  suffix = '',
  className = '',
  duration = 0.8,
}) => {
  const spring = useSpring(0, { duration: duration * 1000 });
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    spring.set(value);
  }, [value, spring]);

  useEffect(() => {
    const unsubscribe = spring.on('change', (v) => {
      setDisplay(Math.round(v));
    });
    return unsubscribe;
  }, [spring]);

  return (
    <span className={className}>
      {prefix}
      {display.toLocaleString()}
      {suffix}
    </span>
  );
};

export default AnimatedNumber;
