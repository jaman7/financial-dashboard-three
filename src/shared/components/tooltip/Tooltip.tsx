import React, { ReactNode } from 'react';
import { motion } from 'framer-motion';
import classNames from 'classnames';
import './Tooltip.scss';

export type TooltipSize = 'marker' | 'normal';

interface TooltipProps {
  content: string | ReactNode | null;
  children?: ReactNode | null;
  position?: 'top' | 'bottom' | 'left' | 'right';
  size?: TooltipSize;
}

const Tooltip: React.FC<TooltipProps> = ({ content = null, children = null, position = 'top', size = 'normal' }) => (
  <div className="tooltip-wrapper">
    <motion.span
      className={classNames(`tooltip-content tooltip-${position} tooltip-size-${size}`, { 'tooltip-visible': !!content })}
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
    >
      {content} {children}
    </motion.span>
  </div>
);

export default Tooltip;
