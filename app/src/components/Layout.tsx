import React, { useState, useEffect } from 'react';
import { Link as ScrollLink } from 'react-scroll';
import { Menu, X } from 'lucide-react';
import { InputModal } from './InputModal';
import { generatePDF } from '../utils/pdfExport';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { name: 'Summary', to: 'snapshot' },
    { name: 'Growth', to: 'growth' },
    { name: 'TCO', to: 'tco' },
    { name: 'Cash Flow', to: 'cash-flow' },
    { name: 'Roadmap', to: 'roadmap' },
  ];

  return (
    <div className="min-h-screen bg-slate-900 text-slate-50 font-sans selection:bg-blue-500/30">
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 border-b border-white/5 ${scrolled ? 'bg-slate-900/95 backdrop-blur-xl border-slate-800 py-2 shadow-lg shadow-black/20' : 'bg-slate-900/50 backdrop-blur-sm py-4'}`}>
        <div className="max-w-[90rem] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
              <div className="flex-shrink-0 flex flex-col justify-center">
                <span className="text-blue-500 font-bold text-xl tracking-tighter leading-tight">Shopify Migration Business Case</span>
                <span className="text-slate-400 text-xs font-normal">powered by P3 Media</span>
              </div>
            
            <div className="hidden xl:flex items-center justify-center flex-1 mx-8">
              <div className="flex items-center space-x-1 bg-white/5 p-1 rounded-full border border-white/5 backdrop-blur-md">
                {navItems.map((item) => (
                  <ScrollLink
                    key={item.name}
                    to={item.to}
                    spy={true}
                    smooth={true}
                    offset={-100}
                    duration={500}
                    className="px-4 py-1.5 rounded-full text-sm font-medium cursor-pointer transition-all duration-200 text-slate-400 hover:text-white hover:bg-white/10"
                    activeClass="!text-white bg-blue-600 shadow-lg shadow-blue-600/25"
                  >
                    {item.name}
                  </ScrollLink>
                ))}
              </div>
            </div>

            <div className="hidden md:flex items-center gap-4">
              <button 
                onClick={() => generatePDF()}
                className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors mr-2"
              >
                Download PDF
              </button>
              <div className="relative group">
                <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg blur opacity-30 group-hover:opacity-75 transition duration-500"></div>
                <div className="relative">
                  <InputModal />
                </div>
              </div>
            </div>

            <div className="-mr-2 flex xl:hidden">
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="inline-flex items-center justify-center p-2 rounded-md text-slate-400 hover:text-white hover:bg-slate-700 focus:outline-none"
              >
                {isOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        {isOpen && (
          <div className="xl:hidden bg-slate-900/95 backdrop-blur-xl border-b border-slate-800 shadow-2xl">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
              {navItems.map((item) => (
                <ScrollLink
                  key={item.name}
                  to={item.to}
                  smooth={true}
                  offset={-80}
                  duration={500}
                  onClick={() => setIsOpen(false)}
                  className="text-slate-300 hover:text-white block px-3 py-2 rounded-md text-base font-medium"
                >
                  {item.name}
                </ScrollLink>
              ))}
              <div className="px-2 mt-3 pb-4">
                 <InputModal />
              </div>
            </div>
          </div>
        )}
      </nav>

      <main>
        {children}
      </main>

      <footer className="bg-slate-950 py-12 border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-slate-500 text-sm">
            © 2026 Shopify Business Case. Confidential & Proprietary. Powered by P3 Media.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
