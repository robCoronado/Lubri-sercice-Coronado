import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface ExpandableCardProps {
  isExpanded: boolean;
  onClick: () => void;
  children: React.ReactNode;
  expandedContent: React.ReactNode;
}

export function ExpandableCard({ 
  isExpanded, 
  onClick, 
  children, 
  expandedContent 
}: ExpandableCardProps) {
  return (
    <div 
      className={`bg-white rounded-lg shadow-sm overflow-hidden transition-all duration-200 ${
        isExpanded ? 'ring-2 ring-blue-500' : 'hover:shadow-md'
      }`}
    >
      <div 
        className="p-6 cursor-pointer"
        onClick={onClick}
      >
        {children}

        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="mt-6 space-y-6"
            >
              {expandedContent}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}