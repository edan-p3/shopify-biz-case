import React from 'react';
import { AlertCircle, Info } from 'lucide-react';

export const Disclaimer: React.FC = () => {
  return (
    <section className="py-12 px-4 bg-slate-900/50 border-t border-slate-800">
      <div className="max-w-5xl mx-auto">
        {/* Main Disclaimer */}
        <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-8 mb-6">
          <div className="flex items-start gap-4 mb-4">
            <div className="flex-shrink-0 w-10 h-10 bg-amber-500/10 rounded-lg flex items-center justify-center">
              <AlertCircle className="text-amber-400" size={24} />
            </div>
            <div>
              <h3 className="text-xl font-bold text-white mb-2">Important Disclaimer</h3>
              <p className="text-slate-300 text-sm leading-relaxed">
                This business case calculator is provided as an <strong>educational and planning tool only</strong>. 
                The financial projections, ROI calculations, and other metrics presented are based on assumptions, 
                industry benchmarks, and the specific inputs you provide. These projections are <strong>not guarantees 
                of future results</strong> and should not be considered as professional financial, accounting, or 
                investment advice.
              </p>
            </div>
          </div>
        </div>

        {/* Detailed Points */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div className="bg-slate-800/30 border border-slate-700/50 rounded-lg p-6">
            <div className="flex items-center gap-3 mb-3">
              <Info className="text-blue-400" size={20} />
              <h4 className="font-semibold text-white">Not Financial Advice</h4>
            </div>
            <p className="text-slate-400 text-sm leading-relaxed">
              This tool does not constitute professional financial, legal, or business advice. 
              Actual results may vary significantly based on market conditions, implementation quality, 
              team capabilities, competitive landscape, and numerous other factors beyond the scope of this calculator.
            </p>
          </div>

          <div className="bg-slate-800/30 border border-slate-700/50 rounded-lg p-6">
            <div className="flex items-center gap-3 mb-3">
              <Info className="text-blue-400" size={20} />
              <h4 className="font-semibold text-white">Independent Verification Required</h4>
            </div>
            <p className="text-slate-400 text-sm leading-relaxed">
              Before making any business decisions or financial commitments, you should conduct your own 
              due diligence and consult with qualified financial advisors, accountants, and legal counsel 
              familiar with your specific business circumstances.
            </p>
          </div>

          <div className="bg-slate-800/30 border border-slate-700/50 rounded-lg p-6">
            <div className="flex items-center gap-3 mb-3">
              <Info className="text-blue-400" size={20} />
              <h4 className="font-semibold text-white">Assumptions & Variables</h4>
            </div>
            <p className="text-slate-400 text-sm leading-relaxed">
              Calculations are based on standard financial formulas (NPV, IRR, payback period) with a 10% 
              discount rate and assumptions about growth rates, cost structures, and implementation timelines. 
              Your actual costs, timelines, and returns may differ materially.
            </p>
          </div>

          <div className="bg-slate-800/30 border border-slate-700/50 rounded-lg p-6">
            <div className="flex items-center gap-3 mb-3">
              <Info className="text-blue-400" size={20} />
              <h4 className="font-semibold text-white">No Warranty or Guarantee</h4>
            </div>
            <p className="text-slate-400 text-sm leading-relaxed">
              P3 Media makes no representations or warranties regarding the accuracy, completeness, or 
              suitability of the information provided. Use of this tool is at your own risk. P3 Media 
              shall not be liable for any decisions made based on the outputs of this calculator.
            </p>
          </div>
        </div>

        {/* Recommendation */}
        <div className="bg-blue-900/20 border border-blue-700/30 rounded-lg p-6 text-center">
          <p className="text-blue-200 text-sm leading-relaxed">
            <strong className="text-blue-100">Recommendation:</strong> Use this business case as a starting point 
            for discussions with your financial team, implementation partners, and stakeholders. Conduct detailed 
            discovery, competitive analysis, and risk assessment before proceeding with any platform migration. 
            Consider engaging P3 Media or qualified consultants for a comprehensive, customized analysis tailored 
            to your specific business needs.
          </p>
        </div>

        {/* Footer */}
        <div className="mt-8 pt-6 border-t border-slate-800 text-center">
          <p className="text-slate-500 text-xs">
            © {new Date().getFullYear()} P3 Media. All rights reserved. | This document was generated on{' '}
            {new Date().toLocaleDateString('en-US', { 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })} at {new Date().toLocaleTimeString('en-US', {
              hour: '2-digit',
              minute: '2-digit'
            })}.
          </p>
          <p className="text-slate-500 text-xs mt-2">
            For questions or a detailed consultation, contact us at{' '}
            <a href="mailto:contact@pthreemedia.com" className="text-blue-400 hover:text-blue-300 underline">
              contact@pthreemedia.com
            </a>
          </p>
        </div>
      </div>
    </section>
  );
};
