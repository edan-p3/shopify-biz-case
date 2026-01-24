import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, PieChart, Pie } from 'recharts';
import { useScenario } from '../../context/ScenarioContext';
import { formatCurrency } from '../../utils/formatters';
import { InfoTooltip } from '../ui/InfoTooltip';

const FinancialSnapshot: React.FC = () => {
  const { currentScenario, selectedScenario, setScenario, inputs } = useScenario();
  
  // Check if user has entered data
  const hasData = inputs.business.annualRevenue > 0 || inputs.migration.implementationCost > 0;
  
  // If no data, don't render this section  
  if (!hasData) {
    return null;
  }

  // Prepare data for the Revenue Chart
  const revenueData = [
    { name: 'Year 0', value: currentScenario.revenueProjection.year0 * 1000000 },
    { name: 'Year 1', value: currentScenario.revenueProjection.year1 * 1000000 },
    { name: 'Year 2', value: currentScenario.revenueProjection.year2 * 1000000 },
    { name: 'Year 3', value: currentScenario.revenueProjection.year3 * 1000000 },
  ];

  // Investment Data for Pie Chart
  const investmentData = [
    { name: 'Implementation', value: currentScenario.investmentBreakdown.implementation, color: '#3b82f6' }, // Blue-500
    { name: 'Platform Fees (3Y)', value: currentScenario.investmentBreakdown.platformFees, color: '#8b5cf6' }, // Violet-500
  ];

  return (
    <section id="snapshot" className="py-24 bg-slate-900 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Financial Snapshot</h2>
          <p className="text-slate-400 max-w-2xl mx-auto">
            Comprehensive analysis of returns, costs, and growth potential across different scenarios.
          </p>
        </div>

        {/* Scenario Toggle */}
        <div className="flex justify-center mb-12">
          <div className="bg-slate-800 p-1 rounded-xl inline-flex">
            {(['conservative', 'moderate', 'aggressive'] as const).map((s) => (
              <button
                key={s}
                onClick={() => setScenario(s)}
                className={`px-6 py-2 rounded-lg text-sm font-medium transition-all ${
                  selectedScenario === s
                    ? 'bg-blue-600 text-white shadow-lg'
                    : 'text-slate-400 hover:text-white hover:bg-slate-700/50'
                }`}
              >
                {s.charAt(0).toUpperCase() + s.slice(1)}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Revenue Chart */}
          <div className="lg:col-span-7 bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-8">
            <h3 className="text-xl font-bold text-white mb-6">Revenue Projection (3 Years)</h3>
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={revenueData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                  <XAxis 
                    dataKey="name" 
                    stroke="#94a3b8" 
                    tick={{ fill: '#94a3b8', fontSize: 12 }} 
                    axisLine={false}
                    tickLine={false}
                    dy={10}
                  />
                  <YAxis 
                    stroke="#94a3b8" 
                    tick={{ fill: '#94a3b8', fontSize: 12 }} 
                    axisLine={false}
                    tickLine={false}
                    tickFormatter={(value) => `$${value / 1000000}M`}
                  />
                  <Tooltip 
                    cursor={{ fill: '#334155', opacity: 0.2 }}
                    contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', color: '#f8fafc' }}
                    formatter={(value: number | undefined) => [formatCurrency(value || 0, true), 'Revenue']}
                  />
                  <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                    {revenueData.map((_entry, index) => (
                      <Cell 
                        key={`cell-${index}`} 
                        fill={index === 0 ? '#475569' : '#3b82f6'} // Year 0 is grey, others blue
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Metrics Column */}
          <div className="lg:col-span-5 space-y-6">
            <div className="grid grid-cols-2 gap-6">
              {/* NPV Card */}
              <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-6 flex flex-col justify-center items-center text-center">
                <div className="flex items-center gap-1 text-slate-400 text-sm mb-2">
                  <InfoTooltip term="NPV" definition="Net Present Value: The difference between the present value of cash inflows and the present value of cash outflows over a period of time." />
                </div>
                <div className="text-3xl font-bold text-emerald-400 mb-1">
                  {currentScenario.npv}
                </div>
                <div className="text-xs text-slate-500">3-Year Horizon</div>
              </div>

              {/* ROI Card */}
              <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-6 flex flex-col justify-center items-center text-center">
                <div className="flex items-center gap-1 text-slate-400 text-sm mb-2">
                  <InfoTooltip term="ROI" definition="Return on Investment: A performance measure used to evaluate the efficiency or profitability of an investment." /> (3-Year)
                </div>
                <div className="text-3xl font-bold text-purple-400 mb-1">
                  {currentScenario.roi3Year}
                </div>
                <div className="text-xs text-slate-500">Return on Investment</div>
              </div>
            </div>

            {/* Investment Breakdown */}
            <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-8 flex-1">
              <h3 className="text-lg font-bold text-white mb-6">Investment Breakdown</h3>
              <div className="flex items-center">
                <div className="w-1/2 h-[160px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={investmentData}
                        cx="50%"
                        cy="50%"
                        innerRadius={50}
                        outerRadius={70}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {investmentData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} stroke="none" />
                        ))}
                      </Pie>
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="w-1/2 space-y-4">
                  {investmentData.map((item) => (
                    <div key={item.name} className="flex flex-col">
                      <div className="flex items-center gap-2 mb-1">
                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                        <span className="text-sm text-slate-300">{item.name}</span>
                      </div>
                      <span className="text-lg font-mono font-medium text-white pl-5">
                        {formatCurrency(item.value)}
                      </span>
                    </div>
                  ))}
                  <div className="pt-4 border-t border-slate-700 mt-2">
                    <div className="text-sm text-slate-400 mb-1">Total 3-Year Investment</div>
                    <div className="text-xl font-bold text-white">{formatCurrency(currentScenario.investmentBreakdown.total)}</div>
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

export default FinancialSnapshot;
