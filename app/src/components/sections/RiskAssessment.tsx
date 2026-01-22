import React from 'react';
import { Section } from '../ui/Section';
import { Card } from '../ui/Card';
import { risks } from '../../data/businessCase';
import { clsx } from 'clsx';
import { AlertTriangle, ShieldCheck } from 'lucide-react';

export const RiskAssessment: React.FC = () => {
  return (
    <Section id="risks" title="Risk Mitigation Strategy" subtitle="Proactive identification and management of potential migration risks.">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
         <div className="space-y-4">
           {risks.map((risk) => (
             <Card key={risk.id} className="group hover:border-slate-500/50 transition-all duration-300">
               <div className="flex items-start justify-between mb-3">
                 <div className="flex items-center gap-3">
                   <div className={clsx("p-2 rounded-lg", 
                     risk.impact === 'High' ? "bg-red-500/10 text-red-500" : "bg-amber-500/10 text-amber-500"
                   )}>
                     <AlertTriangle size={20} />
                   </div>
                   <div>
                     <h4 className="font-bold text-white">{risk.title}</h4>
                     <span className="text-xs text-slate-500 uppercase tracking-wider">{risk.category}</span>
                   </div>
                 </div>
                 <div className="flex gap-2">
                   <span className={clsx("text-xs px-2 py-1 rounded border", 
                     risk.probability === 'High' ? "border-red-500/30 text-red-400" : 
                     risk.probability === 'Medium' ? "border-amber-500/30 text-amber-400" : 
                     "border-blue-500/30 text-blue-400"
                   )}>Prob: {risk.probability}</span>
                 </div>
               </div>
               
               <div className="pl-[52px]">
                 <div className="flex items-start gap-2 text-sm text-slate-300 bg-slate-800/50 p-3 rounded-lg">
                   <ShieldCheck size={16} className="text-success mt-0.5 flex-shrink-0" />
                   <p>{risk.mitigation}</p>
                 </div>
               </div>
             </Card>
           ))}
         </div>

         <div className="relative">
           <Card className="h-full bg-gradient-to-br from-surface to-slate-900 border-slate-700/50">
             <h3 className="text-xl font-bold text-white mb-6">Risk Matrix</h3>
             
             <div className="grid grid-cols-3 gap-2 mb-2 text-center text-xs text-slate-400 font-medium">
                <div>Low Impact</div>
                <div>Med Impact</div>
                <div>High Impact</div>
             </div>
             
             <div className="grid grid-rows-3 gap-2 h-[300px] relative">
               <div className="absolute -left-8 top-0 bottom-0 flex flex-col justify-around text-xs text-slate-400 font-medium h-full w-6">
                 <div className="-rotate-90">High</div>
                 <div className="-rotate-90">Med</div>
                 <div className="-rotate-90">Low</div>
               </div>
               
               {/* Grid Cells */}
               <div className="grid grid-cols-3 gap-2 h-full">
                 {/* Row 1: High Prob */}
                 <div className="bg-amber-500/20 rounded border border-amber-500/10 flex items-center justify-center"></div>
                 <div className="bg-orange-500/20 rounded border border-orange-500/10 flex items-center justify-center"></div>
                 <div className="bg-red-500/20 rounded border border-red-500/10 flex items-center justify-center relative">
                    <span className="absolute inset-0 flex items-center justify-center text-xs font-bold text-red-400">Critical Zone</span>
                 </div>
                 
                 {/* Row 2: Med Prob */}
                 <div className="bg-blue-500/10 rounded border border-blue-500/5 flex items-center justify-center"></div>
                 <div className="bg-amber-500/20 rounded border border-amber-500/10 flex items-center justify-center p-2">
                    <div className="w-3 h-3 rounded-full bg-white shadow-lg shadow-white/50 animate-pulse"></div>
                    <span className="text-xs ml-2 text-white">SEO</span>
                 </div>
                 <div className="bg-orange-500/20 rounded border border-orange-500/10 flex items-center justify-center p-2">
                    <div className="w-3 h-3 rounded-full bg-white shadow-lg shadow-white/50 animate-pulse"></div>
                    <span className="text-xs ml-2 text-white">Data</span>
                 </div>

                 {/* Row 3: Low Prob */}
                 <div className="bg-slate-700/20 rounded border border-slate-700/10 flex items-center justify-center"></div>
                 <div className="bg-blue-500/10 rounded border border-blue-500/5 flex items-center justify-center"></div>
                 <div className="bg-amber-500/20 rounded border border-amber-500/10 flex items-center justify-center p-2">
                    <div className="w-3 h-3 rounded-full bg-white shadow-lg shadow-white/50 animate-pulse"></div>
                    <span className="text-xs ml-2 text-white">Integ</span>
                 </div>
               </div>
             </div>
             
             <div className="mt-4 text-center">
               <span className="text-xs text-slate-500 uppercase tracking-widest">Probability (Vertical) vs Impact (Horizontal)</span>
             </div>
           </Card>
         </div>
      </div>
    </Section>
  );
};
