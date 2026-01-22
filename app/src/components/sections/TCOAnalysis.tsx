import React from 'react';
import { useScenario } from '../../context/ScenarioContext';
import { formatCurrency } from '../../utils/formatters';

const TCOAnalysis: React.FC = () => {
  const { currentScenario } = useScenario();
  
  // Hardcoded structure for TCO display based on currentScenario totals
  // In a real dynamic version, we'd calculate these breakdowns in the context
  const investment = currentScenario.investmentBreakdown;
  const totalInvestment = investment.total;
  
  const schedule = [
    { category: "Implementation (One-time)", year1: investment.implementation, year2: 0, year3: 0, total: investment.implementation },
    { category: "Platform & Apps", year1: investment.platformFees / 3, year2: investment.platformFees / 3, year3: investment.platformFees / 3, total: investment.platformFees },
  ];

  // Using savings from context for display
  const savingsValue = parseFloat(currentScenario.tcoSavings.replace(/[^0-9.-]+/g,""));
  const projectedCost = 150000; // Placeholder or calculate
  const legacyCost = projectedCost + savingsValue;

  return (
    <section id="tco" className="py-24 bg-slate-900 relative overflow-hidden border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Total Cost of Ownership</h2>
          <p className="text-slate-400 max-w-2xl mx-auto">
            Transparent investment structure with clear operational savings.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Investment Schedule Table */}
          <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-8">
            <h3 className="text-xl font-bold text-white mb-6">Investment Schedule</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-slate-700">
                    <th className="pb-4 text-sm font-medium text-slate-400">Category</th>
                    <th className="pb-4 text-sm font-medium text-slate-400 text-right">Year 1</th>
                    <th className="pb-4 text-sm font-medium text-slate-400 text-right">Year 2</th>
                    <th className="pb-4 text-sm font-medium text-slate-400 text-right">Year 3</th>
                    <th className="pb-4 text-sm font-medium text-slate-400 text-right">Total</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-700/50">
                  {schedule.map((item, index) => (
                    <tr key={index} className="group">
                      <td className="py-4 text-sm text-slate-300">{item.category}</td>
                      <td className="py-4 text-sm text-white font-mono text-right">{formatCurrency(item.year1)}</td>
                      <td className="py-4 text-sm text-white font-mono text-right">{formatCurrency(item.year2)}</td>
                      <td className="py-4 text-sm text-white font-mono text-right">{formatCurrency(item.year3)}</td>
                      <td className="py-4 text-sm text-white font-bold font-mono text-right">{formatCurrency(item.total)}</td>
                    </tr>
                  ))}
                  <tr className="bg-slate-700/20">
                    <td className="py-4 pl-4 text-sm font-bold text-white">Total Investment</td>
                    <td className="py-4 text-sm font-bold text-white font-mono text-right">{formatCurrency(schedule.reduce((acc, item) => acc + item.year1, 0))}</td>
                    <td className="py-4 text-sm font-bold text-white font-mono text-right">{formatCurrency(schedule.reduce((acc, item) => acc + item.year2, 0))}</td>
                    <td className="py-4 text-sm font-bold text-white font-mono text-right">{formatCurrency(schedule.reduce((acc, item) => acc + item.year3, 0))}</td>
                    <td className="py-4 pr-4 text-sm font-bold text-blue-400 font-mono text-right">{formatCurrency(totalInvestment)}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <div className="space-y-8">
            {/* Operational Savings */}
            <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-8">
              <h3 className="text-xl font-bold text-white mb-6">Operational Savings</h3>
              <div className="grid grid-cols-2 gap-6 mb-8">
                <div className="bg-slate-900/50 p-4 rounded-xl border border-slate-700/50">
                  <div className="text-sm text-slate-400 mb-1">Legacy Cost</div>
                  <div className="text-xl font-bold text-red-400 line-through decoration-red-400/50">
                    {formatCurrency(legacyCost)}
                  </div>
                  <div className="text-xs text-slate-500 mt-1">Annually</div>
                </div>
                <div className="bg-blue-900/20 p-4 rounded-xl border border-blue-500/30">
                  <div className="text-sm text-blue-300 mb-1">Projected Cost</div>
                  <div className="text-xl font-bold text-white">
                    {formatCurrency(projectedCost)}
                  </div>
                  <div className="text-xs text-blue-300/70 mt-1">Annual (Recurring)</div>
                </div>
              </div>
              
              <div className="flex justify-between items-end mb-2">
                <span className="text-sm text-slate-300">Annual Efficiency Gain</span>
                <span className="text-lg font-bold text-emerald-400">+{currentScenario.tcoSavings}</span>
              </div>
              <div className="w-full bg-slate-700/30 h-3 rounded-full overflow-hidden">
                <div className="bg-emerald-500 h-full rounded-full" style={{ width: '71%' }}></div>
              </div>
            </div>

            {/* Cost Structure Shift */}
            <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-8">
              <h3 className="text-xl font-bold text-white mb-6">Cost Structure Shift</h3>
              <div className="space-y-6">
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-slate-300 flex items-center gap-2">
                      CapEx <span className="text-xs text-slate-500">(One-time)</span>
                    </span>
                    <span className="text-white font-mono">34%</span>
                  </div>
                  <div className="w-full bg-slate-700/30 h-2 rounded-full overflow-hidden">
                    <div className="bg-blue-500 h-full rounded-full" style={{ width: `34%` }}></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-slate-300 flex items-center gap-2">
                      OpEx <span className="text-xs text-slate-500">(Ongoing)</span>
                    </span>
                    <span className="text-white font-mono">66%</span>
                  </div>
                  <div className="w-full bg-slate-700/30 h-2 rounded-full overflow-hidden">
                    <div className="bg-purple-500 h-full rounded-full" style={{ width: `66%` }}></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TCOAnalysis;
