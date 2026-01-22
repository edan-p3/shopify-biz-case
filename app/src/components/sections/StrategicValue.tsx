import React from 'react';
import { Section } from '../ui/Section';
import { Card } from '../ui/Card';
import { Layers, Globe, Zap, Database } from 'lucide-react';

export const StrategicValue: React.FC = () => {
  const values = [
    {
      icon: Globe,
      title: "Omnichannel Dominance",
      description: "Seamlessly integrate online, offline, and social channels to capture customers wherever they are."
    },
    {
      icon: Zap,
      title: "Operational Agility",
      description: "Launch new markets and campaigns in days instead of months with a flexible, modern stack."
    },
    {
      icon: Database,
      title: "Data-Driven Insights",
      description: "Unify customer data to personalize experiences and optimize marketing spend effectively."
    },
    {
      icon: Layers,
      title: "Ecosystem Integration",
      description: "Leverage thousands of pre-built integrations for ERP, CRM, and marketing tools."
    }
  ];

  return (
    <Section id="strategic-value" title="Strategic Value Beyond ROI" subtitle="The qualitative benefits that position the business for long-term leadership.">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {values.map((item, index) => (
          <Card key={index} className="hover:bg-slate-800/80 transition-colors group">
            <div className="p-3 bg-primary/10 rounded-lg text-primary w-fit mb-4 group-hover:bg-primary group-hover:text-white transition-colors">
              <item.icon size={24} />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">{item.title}</h3>
            <p className="text-sm text-slate-400 leading-relaxed">{item.description}</p>
          </Card>
        ))}
      </div>
    </Section>
  );
};
