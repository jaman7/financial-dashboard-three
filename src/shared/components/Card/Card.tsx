import { ReactNode, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import useResizeObserver from '@/hooks/useResizeObserver';
import './Card.scss';

interface CardProps {
  header?: ReactNode;
  footer?: ReactNode;
  children: ReactNode;
  hoverable?: boolean;
  className?: string;
  onResize?: (width: number, height: number) => void;
}

const Card = ({ header, footer, children, hoverable = false, className = '', onResize }: CardProps) => {
  const { ref, size } = useResizeObserver();
  const [prevSize, setPrevSize] = useState(size);

  useEffect(() => {
    if (size.width !== prevSize.width || size.height !== prevSize.height) {
      setPrevSize(size);
      onResize?.(size.width, size.height);
    }
  }, [size.width, onResize]);

  return (
    <motion.div
      ref={ref}
      className={`card ${hoverable ? 'hoverable' : ''} ${className}`}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      {header && <div className="card-header">{header}</div>}
      <div className="card-content">{children}</div>
      {footer && <div className="card-footer">{footer}</div>}
    </motion.div>
  );
};

export default Card;
