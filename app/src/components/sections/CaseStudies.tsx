import React from 'react';
import { Section } from '../ui/Section';
import { Card } from '../ui/Card';
import { ArrowUpRight } from 'lucide-react';
import { InfoTooltip } from '../ui/InfoTooltip';
import { useScenario } from '../../context/ScenarioContext';

export const CaseStudies: React.FC = () => {
  const { inputs, totalRevenue } = useScenario();
  
  // Check if user has entered data
  const hasData = totalRevenue > 0 || inputs.migration.implementationCost > 0;
  
  // If no data, don't render this section
  if (!hasData) {
    return null;
  }
  
  const cases = [
    {
      company: "TechGear Pro",
      industry: "B2B Electronics",
      metrics: {
        revenue: "+125%",
        efficiency: "40% Less Admin",
        conversion: "2.5x Higher"
      },
      desc: "Migrated from legacy custom stack to Shopify Plus. Unified B2B and DTC channels."
    },
    {
      company: "StyleHome",
      industry: "Home & Decor",
      metrics: {
        revenue: "+85%",
        efficiency: "$120k Savings",
        conversion: "+45% Mobile"
      },
      desc: "Replaced Magento 2. Reduced TCO by 60% and launched 3 new international markets."
    },
    {
      company: "PureBeauty",
      industry: "Health & Beauty",
      metrics: {
        revenue: "+210%",
        efficiency: "2x Speed",
        conversion: "+32% AOV"
      },
      desc: "Leveraged Shopify Markets to expand globally. Automated 80% of manual order processing."
    },
    {
      company: "UrbanThreads",
      industry: "Apparel & Fashion",
      metrics: {
        revenue: "+95%",
        efficiency: "30% Faster",
        conversion: "+15% CR"
      },
      desc: "Moved from Salesforce Commerce Cloud. Improved site speed by 4x and streamlined returns."
    },
    {
      company: "GreenLife CPG",
      industry: "CPG / Food & Bev",
      metrics: {
        revenue: "+150%",
        efficiency: "Zero Downtime",
        conversion: "+60% Subs"
      },
      desc: "Launched subscription model with 99.99% uptime during Super Bowl campaign."
    },
    {
      company: "LuxeRetail",
      industry: "Retail / POS",
      metrics: {
        revenue: "+40% In-Store",
        efficiency: "Unified Inv",
        conversion: "+20% Omnichannel"
      },
      desc: "Connected 50+ physical stores with online inventory using Shopify POS."
    },
    {
      company: "AutoParts Direct",
      industry: "Automotive B2B",
      metrics: {
        revenue: "+300% B2B",
        efficiency: "Auto-Invoicing",
        conversion: "5x Reorder"
      },
      desc: "Automated complex B2B pricing tiers and bulk ordering workflows."
    },
    {
      company: "PetPals",
      industry: "Pet Supplies",
      metrics: {
        revenue: "+75%",
        efficiency: "15h Saved/Wk",
        conversion: "+25% LTV"
      },
      desc: "Consolidated 3 separate regional sites into one global Shopify Plus store."
    }
  ];

  return (
    <Section id="casestudies" title="Success Stories" subtitle="Proven results from similar migration initiatives.">
      <div className="relative -mx-4 px-4 md:-mx-0 md:px-0">
        <div className="flex overflow-x-auto pb-8 gap-6 snap-x snap-mandatory scrollbar-hide">
          {cases.map((study, index) => (
            <div key={index} className="min-w-[300px] md:min-w-[350px] snap-center">
              <Card className="flex flex-col h-full group hover:border-primary/50 transition-colors">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="font-bold text-lg text-white group-hover:text-primary transition-colors">{study.company}</h3>
                    <div className="flex items-center gap-1">
                      <span className="text-xs text-slate-500 uppercase tracking-wider">{study.industry}</span>
                      {study.industry.includes('B2B') && <InfoTooltip term="B2B" definition="Business-to-Business sales" />}
                      {study.industry.includes('CPG') && <InfoTooltip term="CPG" definition="Consumer Packaged Goods" />}
                      {study.industry.includes('POS') && <InfoTooltip term="POS" definition="Point of Sale (In-Store)" />}
                    </div>
                  </div>
                  <ArrowUpRight size={20} className="text-slate-600 group-hover:text-primary transition-colors" />
                </div>
                
                <p className="text-sm text-slate-400 mb-6 flex-grow">
                  {study.desc.split(' ').map((word, i) => {
                    if (word.includes('TCO')) return <span key={i} className="inline-flex items-center gap-1"><InfoTooltip term="TCO" definition="Total Cost of Ownership" /> </span>;
                    if (word.includes('B2B')) return <span key={i} className="inline-flex items-center gap-1"><InfoTooltip term="B2B" definition="Business-to-Business" /> </span>;
                    if (word.includes('DTC')) return <span key={i} className="inline-flex items-center gap-1"><InfoTooltip term="DTC" definition="Direct-to-Consumer" /> </span>;
                    if (word.includes('POS')) return <span key={i} className="inline-flex items-center gap-1"><InfoTooltip term="POS" definition="Point of Sale" /> </span>;
                    return word + ' ';
                  })}
                </p>
                
                <div className="grid grid-cols-3 gap-2 pt-4 border-t border-slate-700/50">
                  <div className="text-center">
                    <div className="text-sm font-bold text-success">{study.metrics.revenue}</div>
                    <div className="text-[10px] text-slate-500">Growth</div>
                  </div>
                  <div className="text-center border-l border-slate-700/50">
                    <div className="text-sm font-bold text-white">{study.metrics.efficiency}</div>
                    <div className="text-[10px] text-slate-500">Ops</div>
                  </div>
                  <div className="text-center border-l border-slate-700/50">
                     <div className="text-sm font-bold text-accent">{study.metrics.conversion}</div>
                     <div className="text-[10px] text-slate-500 flex justify-center items-center gap-1">
                       Conv/
                       {study.metrics.conversion.includes('AOV') ? <InfoTooltip term="AOV" definition="Average Order Value" /> : 
                        study.metrics.conversion.includes('LTV') ? <InfoTooltip term="LTV" definition="Lifetime Value" /> : 'Metric'}
                     </div>
                  </div>
                </div>
              </Card>
            </div>
          ))}
        </div>
        
        {/* Scroll Indicators */}
        <div className="absolute right-0 top-0 h-full w-24 bg-gradient-to-l from-background to-transparent pointer-events-none md:hidden"></div>
      </div>
    </Section>
  );
};
