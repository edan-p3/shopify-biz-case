import React from 'react';
import { AlertCircle, CheckCircle2 } from 'lucide-react';
import { useScenario } from '../../context/ScenarioContext';
import { formatCurrency } from '../../utils/formatters';

export const CurrentState: React.FC = () => {
  const { inputs } = useScenario();
  
  // Use inputs for dynamic values
  const costs = inputs.current.platformCosts;
  const totalLoss = costs.license + costs.maintenance + costs.integrations;
  
  // Check if user has entered data
  const hasData = totalLoss > 0;
  
  // Only show actual data when user has entered it
  const displayCosts = {
    license: costs.license,
    maintenance: costs.maintenance,
    integrations: costs.integrations,
    total: totalLoss
  };
  
  // If no data, don't render this section
  if (!hasData) {
    return null;
  }

  return (
    <section id="capabilities" className="py-24 bg-slate-900 relative overflow-hidden border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">From Constraints to Capabilities</h2>
          <p className="text-slate-400 max-w-2xl mx-auto">
            Addressing current limitations to unlock future growth potential.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Current Technical Debt Column */}
          <div>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-8 h-8 rounded-full bg-red-500/10 flex items-center justify-center text-red-500">
                <AlertCircle size={20} />
              </div>
              <h3 className="text-xl font-bold text-white">Current Technical Debt</h3>
            </div>

            <div className="space-y-4">
              <div className="bg-slate-800/30 border border-slate-700/50 rounded-xl p-5 flex justify-between items-center group hover:border-red-500/30 transition-colors">
                <div>
                  <div className="text-white font-medium mb-1">Platform License</div>
                  <div className="text-sm text-slate-500">Annual Impact</div>
                </div>
                <div className="text-red-400 font-mono font-bold">-{formatCurrency(displayCosts.license)}</div>
              </div>

              <div className="bg-slate-800/30 border border-slate-700/50 rounded-xl p-5 flex justify-between items-center group hover:border-red-500/30 transition-colors">
                <div>
                  <div className="text-white font-medium mb-1">Maintenance & Support</div>
                  <div className="text-sm text-slate-500">Annual Impact</div>
                </div>
                <div className="text-red-400 font-mono font-bold">-{formatCurrency(displayCosts.maintenance)}</div>
              </div>

              <div className="bg-slate-800/30 border border-slate-700/50 rounded-xl p-5 flex justify-between items-center group hover:border-red-500/30 transition-colors">
                <div>
                  <div className="text-white font-medium mb-1">3rd Party Integrations</div>
                  <div className="text-sm text-slate-500">Annual Impact</div>
                </div>
                <div className="text-red-400 font-mono font-bold">-{formatCurrency(displayCosts.integrations)}</div>
              </div>

              <div className="bg-red-500/5 border border-red-500/20 rounded-xl p-6 flex justify-between items-center mt-6">
                <div className="text-white font-bold">Total Annual Loss</div>
                <div className="text-red-400 font-mono font-bold text-xl">{formatCurrency(displayCosts.total)}</div>
              </div>
            </div>
          </div>

          {/* Shopify Capabilities Column */}
          <div>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-8 h-8 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-500">
                <CheckCircle2 size={20} />
              </div>
              <h3 className="text-xl font-bold text-white">Shopify Capabilities</h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
              <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-5 hover:bg-slate-800 transition-colors">
                <h4 className="text-white font-bold mb-2">Unified Commerce</h4>
                <p className="text-sm text-slate-400 leading-relaxed">Single view of inventory, orders, and customers across all channels.</p>
              </div>
              <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-5 hover:bg-slate-800 transition-colors">
                <h4 className="text-white font-bold mb-2">Scalable Infrastructure</h4>
                <p className="text-sm text-slate-400 leading-relaxed">99.99% uptime with unlimited bandwidth and flash sale handling.</p>
              </div>
              <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-5 hover:bg-slate-800 transition-colors">
                <h4 className="text-white font-bold mb-2">Lower TCO</h4>
                <p className="text-sm text-slate-400 leading-relaxed">Reduce maintenance costs by eliminating server management.</p>
              </div>
              <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-5 hover:bg-slate-800 transition-colors">
                <h4 className="text-white font-bold mb-2">Faster Time-to-Market</h4>
                <p className="text-sm text-slate-400 leading-relaxed">Launch new campaigns and products in minutes, not days.</p>
              </div>
            </div>

            {/* Value Shift Bar */}
            <div className="bg-gradient-to-br from-[#1e1b4b] to-[#2e1065] border border-indigo-500/30 rounded-xl p-6 relative overflow-hidden">
              <div className="relative z-10">
                <h4 className="text-white font-bold mb-1">The Value Shift</h4>
                <p className="text-sm text-slate-300 mb-6">Moving from <span className="text-red-400">maintenance</span> to <span className="text-emerald-400">innovation</span>.</p>
                
                <div className="relative h-4 bg-slate-900/50 rounded-full overflow-hidden flex mb-2">
                  <div className="w-[70%] h-full bg-red-500/80"></div>
                  <div className="w-[30%] h-full bg-blue-500/50"></div>
                </div>
                <div className="flex justify-between text-xs text-slate-400 mb-4">
                  <span>Current: 70% Maintenance</span>
                </div>

                <div className="relative h-4 bg-slate-900/50 rounded-full overflow-hidden flex">
                  <div className="w-[30%] h-full bg-slate-700/50"></div>
                  <div className="w-[70%] h-full bg-emerald-500"></div>
                </div>
                <div className="flex justify-end text-xs text-slate-400 mt-1">
                  <span>Target: 70% Innovation</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
