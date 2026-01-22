import React, { useState } from 'react';
import { Info } from 'lucide-react';

interface InfoTooltipProps {
  term: string;
  definition: string;
  align?: 'left' | 'center' | 'right';
}

export const InfoTooltip: React.FC<InfoTooltipProps> = ({ term, definition, align = 'center' }) => {
  const [isVisible, setIsVisible] = useState(false);

  const alignClasses = {
    left: 'left-0',
    center: 'left-1/2 -translate-x-1/2',
    right: 'right-0'
  };

  const arrowAlignClasses = {
    left: 'left-4',
    center: 'left-1/2 -translate-x-1/2',
    right: 'right-4'
  };

  return (
    <span 
      className="inline-flex items-center gap-1 relative cursor-help"
      onMouseEnter={() => setIsVisible(true)}
      onMouseLeave={() => setIsVisible(false)}
      onClick={() => setIsVisible(!isVisible)}
    >
      <span className="border-b border-dotted border-slate-500 hover:border-primary transition-colors">{term}</span>
      <Info size={12} className="text-slate-500 hover:text-primary transition-colors" />
      
      {isVisible && (
        <div className={`absolute bottom-full mb-2 w-48 p-2 bg-slate-800 border border-slate-700 rounded shadow-xl z-50 text-xs text-slate-200 text-center pointer-events-none ${alignClasses[align]}`}>
          {definition}
          <div className={`absolute top-full border-4 border-transparent border-t-slate-800 ${arrowAlignClasses[align]}`}></div>
        </div>
      )}
    </span>
  );
};
