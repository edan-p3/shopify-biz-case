import React from 'react';
import { motion } from 'framer-motion';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface SectionProps extends React.HTMLAttributes<HTMLElement> {
  id: string;
  title?: string;
  subtitle?: string;
  children: React.ReactNode;
}

export const Section: React.FC<SectionProps> = ({ id, title, subtitle, children, className, ...props }) => {
  return (
    <section 
      id={id}
      className={cn("py-20 md:py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto relative", className)}
      {...props}
    >
      {(title || subtitle) && (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="mb-12 md:mb-16 text-center"
        >
          {title && <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400">{title}</h2>}
          {subtitle && <p className="text-lg text-slate-400 max-w-2xl mx-auto">{subtitle}</p>}
        </motion.div>
      )}
      {children}
    </section>
  );
};
