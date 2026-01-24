import React from 'react';
import { 
  ComposedChart, Bar, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, ReferenceLine
} from 'recharts';
import { useScenario } from '../../context/ScenarioContext';
import { formatCurrency } from '../../utils/formatters';

const CashFlowAnalysis: React.FC = () => {
  const { currentScenario, inputs } = useScenario();
  
  // Check if user has entered data
  const hasData = inputs.business.annualRevenue > 0 || inputs.migration.implementationCost > 0;
  
  // If no data, don't render this section
  if (!hasData) {
    return null;
  }
  
  const monthlyData = currentScenario.cashFlow.map(d => ({
    month: d.month,
    net: d.netCashFlow,
    cumulative: d.cumulative
  }));

  // Calculate dynamic metrics from the cash flow data
  const maxInvestment = Math.min(...monthlyData.map(d => d.cumulative));
  const breakevenMonth = monthlyData.find(d => d.cumulative > 0)?.month || '12+';
  const year1EndingPosition = monthlyData[monthlyData.length - 1].cumulative;

  return (
    <section id="cash-flow" className="py-24 bg-slate-900 relative overflow-hidden border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Year 1 Cash Flow</h2>
          <p className="text-slate-400 max-w-2xl mx-auto">
            Visualizing capital outlay and the turning point to profitability.
          </p>
        </div>

        <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-8 mb-8">
          <div className="h-[400px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={monthlyData} margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.5} vertical={false} />
                <XAxis 
                  dataKey="month" 
                  stroke="#94a3b8" 
                  fontSize={12} 
                  tickLine={false} 
                  axisLine={false}
                  tickFormatter={(value) => `M${value}`}
                  dy={10}
                />
                <YAxis 
                  yAxisId="left"
                  stroke="#94a3b8" 
                  fontSize={12} 
                  tickFormatter={(value) => `$${value / 1000}k`}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis 
                  yAxisId="right"
                  orientation="right"
                  stroke="#94a3b8" 
                  fontSize={12} 
                  tickFormatter={(value) => `$${value / 1000000}M`}
                  tickLine={false}
                  axisLine={false}
                />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', color: '#f8fafc' }}
                  itemStyle={{ color: '#f8fafc' }}
                  formatter={(value: number | undefined, name: string | undefined) => [
                    formatCurrency(value || 0), 
                    name === 'net' ? 'Net Monthly Flow' : 'Cumulative Position'
                  ]}
                  labelFormatter={(label) => `Month ${label}`}
                />
                <ReferenceLine y={0} stroke="#475569" />
                <Bar yAxisId="left" dataKey="net" barSize={20} radius={[4, 4, 0, 0]}>
                  {monthlyData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.net >= 0 ? '#10b981' : '#ef4444'} />
                  ))}
                </Bar>
                <Line 
                  yAxisId="right"
                  type="monotone" 
                  dataKey="cumulative" 
                  stroke="#3b82f6" 
                  strokeWidth={3} 
                  dot={{ r: 4, fill: '#1e293b', stroke: '#3b82f6', strokeWidth: 2 }}
                  activeDot={{ r: 6, fill: '#3b82f6' }}
                />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Max Investment Card */}
          <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-6 text-center">
            <div className="text-slate-400 text-sm mb-2">Max Investment</div>
            <div className="text-3xl font-bold text-red-400 mb-1">
              {formatCurrency(Math.abs(maxInvestment))}
            </div>
            <div className="text-xs text-slate-500">Peak Capital Outlay</div>
          </div>

          {/* Breakeven Point Card */}
          <div className="bg-blue-900/20 backdrop-blur-sm border border-blue-500/30 rounded-2xl p-6 text-center relative overflow-hidden">
            <div className="absolute inset-0 bg-blue-500/5 z-0"></div>
            <div className="relative z-10">
              <div className="text-blue-300 text-sm mb-2">Breakeven Point</div>
              <div className="text-3xl font-bold text-white mb-1">
                Month {breakevenMonth}
              </div>
              <div className="text-xs text-blue-300/70">Positive Cumulative Cash Flow</div>
            </div>
          </div>

          {/* Year 1 Ending Position Card */}
          <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-6 text-center">
            <div className="text-slate-400 text-sm mb-2">Year 1 Ending Position</div>
            <div className="text-3xl font-bold text-emerald-400 mb-1">
              {formatCurrency(year1EndingPosition)}
            </div>
            <div className="text-xs text-slate-500">Net Cash Positive</div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CashFlowAnalysis;
