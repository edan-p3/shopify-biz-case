import React from 'react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
}

export const Card: React.FC<CardProps> = ({ children, className, ...props }) => {
  return (
    <div 
      className={cn(
        "bg-surface border border-slate-700/50 rounded-xl p-6 shadow-lg backdrop-blur-sm",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};
