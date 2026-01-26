import React from 'react';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';
import { useScenario } from '../../context/ScenarioContext';
import { formatCurrency } from '../../utils/formatters';

const GrowthProjections: React.FC = () => {
  const { currentScenario, inputs, totalRevenue } = useScenario();
  
  // Check if user has entered data
  const hasData = totalRevenue > 0;
  
  // If no data, don't render this section
  if (!hasData) {
    return null;
  }
  
  const data = [
    { year: 'Year 0', value: currentScenario.revenueProjection.year0 * 1000000, baseline: currentScenario.revenueProjection.year0 * 1000000 }, // Baseline Y0 same as Shopify
    { year: 'Year 1', value: currentScenario.revenueProjection.year1 * 1000000, baseline: (currentScenario.revenueProjection.year0 * 1000000) * 1.05 }, // Approx baseline
    { year: 'Year 2', value: currentScenario.revenueProjection.year2 * 1000000, baseline: (currentScenario.revenueProjection.year0 * 1000000) * 1.1025 },
    { year: 'Year 3', value: currentScenario.revenueProjection.year3 * 1000000, baseline: (currentScenario.revenueProjection.year0 * 1000000) * 1.1576 },
  ];

  return (
    <section id="growth" className="py-24 bg-slate-900 relative overflow-hidden border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Growth Trajectory</h2>
          <p className="text-slate-400 max-w-2xl mx-auto">
            Projected revenue impact based on platform capabilities and market capture.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Chart Column */}
          <div className="lg:col-span-2 bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-8">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-white">Revenue Projection</h3>
              <div className="flex items-center gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-slate-500"></div>
                  <span className="text-slate-400">Baseline</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-blue-600"></div>
                  <span className="text-white font-medium">Shopify</span>
                </div>
              </div>
            </div>
            
            <div className="h-[350px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#2563EB" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#2563EB" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.5} vertical={false} />
                  <XAxis 
                    dataKey="year" 
                    stroke="#94a3b8" 
                    fontSize={12} 
                    tickLine={false} 
                    axisLine={false}
                    dy={10}
                  />
                  <YAxis 
                    stroke="#94a3b8" 
                    fontSize={12} 
                    tickFormatter={(value) => `$${value / 1000000}M`}
                    tickLine={false}
                    axisLine={false}
                  />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', color: '#f8fafc' }}
                    itemStyle={{ color: '#f8fafc' }}
                    formatter={(value: number | undefined) => [formatCurrency(value || 0, true), 'Revenue']}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="baseline" 
                    stroke="#64748b" 
                    fill="transparent" 
                    strokeDasharray="5 5" 
                    strokeWidth={2} 
                    name="Baseline" 
                  />
                  <Area 
                    type="monotone" 
                    dataKey="value" 
                    stroke="#2563eb" 
                    fill="url(#colorValue)" 
                    strokeWidth={3} 
                    name="Projected" 
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Metrics Column */}
          <div className="space-y-6">
            {/* Revenue Uplift Card */}
            <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-8">
              <h4 className="text-slate-400 text-sm font-medium mb-1">Year 1 Revenue Uplift</h4>
              <div className="text-4xl font-bold text-white mb-3">
                {currentScenario.year1Revenue}
              </div>
              <div className="inline-flex items-center px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-sm font-medium border border-emerald-500/20">
                {currentScenario.year1RevenuePercent} vs Baseline
              </div>
            </div>

            {/* Gross Profit Impact Card */}
            <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-8 flex-1">
              <h4 className="text-slate-400 text-sm font-medium mb-6">Gross Profit Impact (3Y)</h4>
              <div className="space-y-6">
                {[
                  { label: 'Year 1', value: currentScenario.grossProfitImpact.year1 },
                  { label: 'Year 2', value: currentScenario.grossProfitImpact.year2 },
                  { label: 'Year 3', value: currentScenario.grossProfitImpact.year3 },
                ].map((item, i) => (
                  <div key={i}>
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-slate-300">{item.label}</span>
                      <span className="font-mono text-white font-medium">{formatCurrency(item.value)}</span>
                    </div>
                    <div className="w-full bg-slate-700/30 h-2 rounded-full overflow-hidden">
                      <div 
                        className="bg-purple-500 h-full rounded-full" 
                        style={{ width: `${(item.value / currentScenario.grossProfitImpact.year3) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
                <div className="pt-6 mt-2 border-t border-slate-700/50 flex justify-between items-center">
                  <span className="text-white font-bold">Total Additional GP</span>
                  <span className="text-purple-400 font-bold font-mono text-lg">{formatCurrency(currentScenario.grossProfitImpact.total)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default GrowthProjections;
