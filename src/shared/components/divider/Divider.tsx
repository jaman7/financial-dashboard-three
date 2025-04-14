import { motion } from 'framer-motion';
import './Divider.scss';
import { memo } from 'react';

interface DividerProps {
  orientation?: 'horizontal' | 'vertical';
  dashed?: boolean;
  className?: string;
}

const Divider = ({ orientation = 'horizontal', dashed = false, className = '' }: DividerProps) => {
  return (
    <motion.div
      className={`divider ${orientation} ${dashed ? 'dashed' : ''} ${className}`}
      initial={{ width: 0 }}
      animate={{ width: orientation === 'horizontal' ? '100%' : undefined, height: orientation === 'vertical' ? '100%' : undefined }}
      transition={{ duration: 0.3 }}
    />
  );
};

export default memo(Divider);
