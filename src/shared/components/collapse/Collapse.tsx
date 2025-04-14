import { ReactNode, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import './Collapse.scss';

interface CollapseProps {
  title: string;
  children: ReactNode;
  defaultOpen?: boolean;
  className?: string;
}

const Collapse = ({ title, children, defaultOpen = false, className = '' }: CollapseProps) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className={`collapse-container ${className}`}>
      <button className="collapse-header" onClick={() => setIsOpen(!isOpen)}>
        {title}
        <motion.span className="arrow" animate={{ rotate: isOpen ? 180 : 0 }} transition={{ duration: 0.2 }}>
          ▼
        </motion.span>
      </button>
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            className="collapse-content"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            {children}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Collapse;
