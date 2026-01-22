import React from 'react';
import { Card } from './Card';
import CountUp from 'react-countup';
import type { LucideIcon } from 'lucide-react';
import { TrendingUp, TrendingDown } from 'lucide-react';

interface MetricCardProps {
  label: string;
  value: string | number;
  subValue?: string;
  icon?: LucideIcon;
  trend?: 'up' | 'down' | 'neutral';
  trendValue?: string;
  prefix?: string;
  suffix?: string;
  delay?: number;
  highlight?: boolean;
}

export const MetricCard: React.FC<MetricCardProps> = ({ 
  label, 
  value, 
  subValue, 
  icon: Icon, 
  trend, 
  trendValue,
  prefix = '',
  suffix = '',
  delay = 0,
  highlight = false
}) => {
  const isNumber = typeof value === 'number';

  return (
    <Card className={`relative overflow-hidden transition-all duration-300 hover:transform hover:-translate-y-1 hover:shadow-xl ${highlight ? 'border-primary/50 bg-primary/5' : ''}`}>
      <div className="flex items-start justify-between mb-4">
        {Icon && (
          <div className={`p-3 rounded-lg ${highlight ? 'bg-primary/20 text-primary' : 'bg-slate-700/50 text-slate-400'}`}>
            <Icon size={24} />
          </div>
        )}
        {trend && (
          <div className={`flex items-center gap-1 text-sm font-medium ${trend === 'up' ? 'text-success' : trend === 'down' ? 'text-error' : 'text-slate-400'}`}>
            {trend === 'up' ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
            {trendValue}
          </div>
        )}
      </div>
      
      <div className="space-y-1">
        <h3 className="text-3xl font-bold text-white tracking-tight">
          {prefix}
          {isNumber ? (
             <CountUp end={value as number} duration={2.5} delay={delay} separator="," decimals={(value as number) % 1 !== 0 ? 1 : 0} />
          ) : (
            value
          )}
          {suffix}
        </h3>
        <p className="text-sm text-slate-400 font-medium uppercase tracking-wider">{label}</p>
        {subValue && <p className="text-xs text-slate-500 mt-2">{subValue}</p>}
      </div>
    </Card>
  );
};
