import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Button } from './ui/Button';
import { InfoTooltip } from './ui/InfoTooltip';
import { useScenario } from '../context/ScenarioContext';
import { Settings, X, ArrowRight, ArrowLeft, CheckCircle2, Building2, BarChart3, ShoppingBag, Truck, Target } from 'lucide-react';
import { clsx } from 'clsx';

// Helper to safely get nested values
function getNestedValue(obj: any, path: string) {
  if (!obj || !path) return '';
  return path.split('.').reduce((acc, part) => acc && acc[part], obj);
}

// --- Step 1: Business Profile ---
  const StepBusinessProfile = ({ inputs, updateInput }: any) => (
  <div className="space-y-8">
    <div>
      <label className="block text-sm font-medium text-slate-300 mb-2">Company Name</label>
      <input
        type="text"
        value={inputs.profile.companyName}
        onChange={(e) => updateInput('profile', 'companyName', e.target.value)}
        className="w-full bg-slate-900 border border-slate-700 rounded-lg py-2.5 px-3 text-white focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
        placeholder="Enter your company name"
      />
    </div>

    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div>
        <label className="block text-sm font-medium text-slate-300 mb-2">Business Model</label>
        <select 
          value={inputs.profile.businessModel}
          onChange={(e) => updateInput('profile', 'businessModel', e.target.value)}
          className="w-full bg-slate-900 border border-slate-700 rounded-lg py-2.5 px-3 text-white focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
        >
          <option value="B2C">B2C (Direct to Consumer)</option>
          <option value="B2B">B2B (Wholesale/Distribution)</option>
          <option value="Both">Both B2C + B2B</option>
          <option value="Retail">Retail (Physical Locations)</option>
          <option value="Hybrid">Hybrid (Online + Retail)</option>
        </select>
        <p className="text-xs text-slate-500 mt-1">Determines ROI drivers and pain points.</p>
      </div>
      <div>
        <label className="block text-sm font-medium text-slate-300 mb-2">Industry/Vertical</label>
        <select 
          value={inputs.profile.industry}
          onChange={(e) => updateInput('profile', 'industry', e.target.value)}
          className="w-full bg-slate-900 border border-slate-700 rounded-lg py-2.5 px-3 text-white focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
        >
          <option value="Fashion">Fashion & Apparel</option>
          <option value="Home">Home Goods & Decor</option>
          <option value="Health">Health & Wellness</option>
          <option value="Electronics">Consumer Electronics</option>
          <option value="Industrial">Industrial / B2B</option>
          <option value="Beauty">Beauty & Cosmetics</option>
          <option value="Food">Food & Beverage</option>
          <option value="Other">Other</option>
        </select>
      </div>
    </div>

    <div className="border-t border-slate-800 pt-6">
      <h3 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
        <span className="w-6 h-6 rounded-full bg-blue-500/20 text-blue-400 flex items-center justify-center text-xs">1</span>
        Annual Revenue Breakdown
      </h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        {[
          { key: 'revenueBreakdown.onlineB2C', label: 'Online B2C' },
          { key: 'revenueBreakdown.onlineB2B', label: 'Online B2B' },
          { key: 'revenueBreakdown.retail', label: 'Retail (In-Store)' },
          { key: 'revenueBreakdown.wholesale', label: 'Wholesale/Distribution' },
        ].map(({ key, label }) => (
          <div key={key}>
            <label className="block text-xs text-slate-400 mb-1.5">{label}</label>
            <div className="relative">
              <span className="absolute left-3 top-2.5 text-slate-500">$</span>
              <input
                type="number"
                value={getNestedValue(inputs.profile, key.split('.')[1]) === 0 ? '' : getNestedValue(inputs.profile, key.split('.')[1])}
                onChange={(e) => updateInput('profile', key, Number(e.target.value))}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg py-2 pl-7 pr-3 text-sm text-white focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                placeholder="0"
              />
            </div>
          </div>
        ))}
      </div>
      <div className="mt-4 bg-slate-800/40 p-4 rounded-lg flex justify-between items-center border border-slate-700/50">
        <span className="text-sm font-medium text-slate-300">Total Annual Revenue</span>
        <span className="text-lg font-bold text-white font-mono">
           ${Object.values(inputs.profile.revenueBreakdown).reduce((a: number, b: any) => a + (Number(b) || 0), 0).toLocaleString()}
        </span>
      </div>
    </div>
    
    <div className="border-t border-slate-800 pt-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
         <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Current Growth Rate (%)</label>
            <div className="relative">
              <input
                type="number"
                step="0.1"
                value={(inputs.profile.annualGrowth * 100).toFixed(1)}
                onChange={(e) => updateInput('profile', 'annualGrowth', Number(e.target.value) / 100)}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg py-2.5 px-3 text-white focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
              />
              <span className="absolute right-3 top-2.5 text-slate-500">%</span>
            </div>
         </div>
         <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Total Employees</label>
            <input
              type="number"
              value={inputs.profile.employees.total}
              onChange={(e) => updateInput('profile', 'employees.total', Number(e.target.value))}
              className="w-full bg-slate-900 border border-slate-700 rounded-lg py-2.5 px-3 text-white focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
            />
         </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
         <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Gross Margin (%)</label>
            <div className="relative">
              <input
                type="number"
                step="0.1"
                value={(inputs.business.grossMargin * 100).toFixed(1)}
                onChange={(e) => updateInput('business', 'grossMargin', Number(e.target.value) / 100)}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg py-2.5 px-3 text-white focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
              />
              <span className="absolute right-3 top-2.5 text-slate-500">%</span>
            </div>
            <p className="text-xs text-slate-500 mt-1">Used to calculate Gross Profit impact.</p>
         </div>
      </div>
    </div>
  </div>
);

const StepCurrentState = ({ inputs, updateInput }: any) => {
  const painPointsList = [
    "Poor mobile experience / low conversion",
    "Slow page load times (>3s)",
    "No abandoned cart recovery",
    "Limited marketing automation",
    "Poor search/discovery",
    "Cannot do subscriptions",
    "Manual B2B processing",
    "Inventory sync issues",
    "Platform downtime/stability",
    "High developer dependency",
    "Expensive customization"
  ];

  const togglePainPoint = (point: string) => {
    const current = inputs.current.painPoints || [];
    if (current.includes(point)) {
      updateInput('current', 'painPoints', current.filter((p: string) => p !== point));
    } else {
      updateInput('current', 'painPoints', [...current, point]);
    }
  };

  return (
    <div className="space-y-8">
      
      {/* Platform Costs */}
      <div>
        <h3 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
          <span className="w-6 h-6 rounded-full bg-blue-500/20 text-blue-400 flex items-center justify-center text-xs">1</span>
          Current Platform Costs (Annual)
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {[
            { key: 'platformCosts.license', label: 'License Fees' },
            { key: 'platformCosts.hosting', label: 'Hosting/Infrastructure' },
            { key: 'platformCosts.maintenance', label: 'Maintenance/Dev' },
            { key: 'platformCosts.integrations', label: '3rd Party Apps/Integrations' },
          ].map(({ key, label }) => (
            <div key={key}>
              <label className="block text-xs text-slate-400 mb-1.5">{label}</label>
              <div className="relative">
                <span className="absolute left-3 top-2 text-slate-500">$</span>
                <input
                  type="number"
                  value={getNestedValue(inputs.current, key) === 0 ? '' : getNestedValue(inputs.current, key)}
                  onChange={(e) => updateInput('current', key, Number(e.target.value))}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg py-1.5 pl-6 pr-3 text-sm text-white focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                  placeholder="0"
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="border-t border-slate-800 pt-6">
        <h3 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
          <span className="w-6 h-6 rounded-full bg-blue-500/20 text-blue-400 flex items-center justify-center text-xs">2</span>
          Key Performance Metrics
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
             { key: 'metrics.monthlyVisitors', label: 'Monthly Visitors', icon: '' },
             { key: 'metrics.conversionRate', label: 'Conv. Rate', icon: '%' },
             { key: 'metrics.aov', label: 'AOV', icon: '$' },
             { key: 'metrics.cartAbandonmentRate', label: 'Cart Abandon', icon: '%' },
             { key: 'metrics.cac', label: 'CAC', icon: '$', description: 'Customer Acquisition Cost: Total sales & marketing spend / New customers acquired', align: 'left' },
             { key: 'metrics.cltv', label: 'LTV', icon: '$', description: 'Customer Lifetime Value: Average revenue per customer over their entire relationship' },
             { key: 'metrics.purchasesPerCustomer', label: 'Purchases/Cust', icon: '', description: 'Average number of purchases a customer makes per year' },
             { key: 'metrics.ordersPerMonth', label: 'Orders/Month', icon: '' },
          ].map(({ key, label, icon, description, align }) => (
             <div key={key}>
              <div className="mb-1.5">
                {description ? (
                  <div className="text-xs text-slate-400">
                    <InfoTooltip term={label} definition={description} align={align as any} />
                  </div>
                ) : (
                  <label className="block text-xs text-slate-400">{label}</label>
                )}
              </div>
              <div className="relative">
                {icon === '$' && <span className="absolute left-2 top-2 text-slate-500 text-xs">$</span>}
                <input
                  type="number"
                  step={key.includes('Rate') || key.includes('PerCustomer') ? '0.01' : '1'}
                  value={getNestedValue(inputs.current, key) === 0 ? '' : getNestedValue(inputs.current, key)}
                  onChange={(e) => updateInput('current', key, Number(e.target.value))}
                  className={clsx(
                    "w-full bg-slate-900 border border-slate-700 rounded-lg py-1.5 px-3 text-sm text-white focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary",
                    icon === '$' ? 'pl-5' : ''
                  )}
                  placeholder="0"
                />
                {icon === '%' && <span className="absolute right-3 top-2 text-slate-500 text-xs">%</span>}
              </div>
             </div>
          ))}
        </div>
      </div>

      <div className="border-t border-slate-800 pt-6">
        <h3 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
          <span className="w-6 h-6 rounded-full bg-blue-500/20 text-blue-400 flex items-center justify-center text-xs">3</span>
          Operational Inefficiencies (Hours/Week)
        </h3>
        <p className="text-xs text-slate-400 mb-4">Time spent on manual tasks that could be automated.</p>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {[
            { key: 'operationalCosts.manualOrderEntry', label: 'Manual Order Entry' },
            { key: 'operationalCosts.customerQuoteRequests', label: 'Quote Requests/Pricing' },
            { key: 'operationalCosts.inventorySync', label: 'Inventory Sync/Reconciliation' },
            { key: 'operationalCosts.platformWorkarounds', label: 'Platform Workarounds/Fixes' },
          ].map(({ key, label }) => (
            <div key={key} className="flex justify-between items-center bg-slate-800/30 p-2 rounded border border-slate-700/30">
               <label className="text-xs text-slate-300">{label}</label>
               <input
                  type="number"
                  value={getNestedValue(inputs.current, key) === 0 ? '' : getNestedValue(inputs.current, key)}
                  onChange={(e) => updateInput('current', key, Number(e.target.value))}
                  className="w-16 bg-slate-900 border border-slate-700 rounded py-1 px-2 text-right text-xs text-white focus:outline-none focus:border-primary"
                  placeholder="0"
               />
            </div>
          ))}
        </div>
        <div className="mt-4 flex justify-end items-center gap-3">
           <label className="text-xs text-slate-400">Avg Hourly Staff Rate ($)</label>
           <input
              type="number"
              value={inputs.current.operationalCosts.hourlyRate === 0 ? '' : inputs.current.operationalCosts.hourlyRate}
              onChange={(e) => updateInput('current', 'operationalCosts.hourlyRate', Number(e.target.value))}
              className="w-20 bg-slate-900 border border-slate-700 rounded py-1 px-2 text-right text-sm text-white focus:outline-none focus:border-primary"
              placeholder="0"
            />
        </div>
      </div>

      <div className="border-t border-slate-800 pt-6">
        <h3 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
          <span className="w-6 h-6 rounded-full bg-blue-500/20 text-blue-400 flex items-center justify-center text-xs">4</span>
          Current Pain Points
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {painPointsList.map((point) => (
            <label key={point} className="flex items-center gap-2 p-2 rounded cursor-pointer hover:bg-slate-800/50 transition-colors">
              <input 
                type="checkbox"
                checked={(inputs.current.painPoints || []).includes(point)}
                onChange={() => togglePainPoint(point)}
                className="rounded border-slate-600 bg-slate-900 text-primary focus:ring-offset-slate-900"
              />
              <span className="text-sm text-slate-300">{point}</span>
            </label>
          ))}
        </div>
      </div>
    </div>
  );
};

// --- Step 3: Business Specifics (Conditional) ---
const StepBusinessSpecifics = ({ inputs, updateInput }: any) => {
  const isB2B = ['B2B', 'Both', 'Hybrid'].includes(inputs.profile.businessModel);
  const isRetail = ['Retail', 'Hybrid', 'Both'].includes(inputs.profile.businessModel);

  const toggleB2BPainPoint = (point: string) => {
    const current = inputs.current.b2b.painPoints || [];
    if (current.includes(point)) {
      updateInput('current', 'b2b.painPoints', current.filter((p: string) => p !== point));
    } else {
      updateInput('current', 'b2b.painPoints', [...current, point]);
    }
  };

  const toggleRetailCapability = (point: string) => {
    const current = inputs.current.retail.desiredCapabilities || [];
    if (current.includes(point)) {
      updateInput('current', 'retail.desiredCapabilities', current.filter((p: string) => p !== point));
    } else {
      updateInput('current', 'retail.desiredCapabilities', [...current, point]);
    }
  };

  if (!isB2B && !isRetail) {
    return (
      <div className="flex flex-col items-center justify-center h-full py-12 text-center">
        <Target size={48} className="text-slate-600 mb-4" />
        <h3 className="text-xl font-bold text-white mb-2">No Specifics Required</h3>
        <p className="text-slate-400">Based on your Direct-to-Consumer model, we can proceed to the next step.</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      
      {isB2B && (
        <div>
          <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2 border-b border-slate-800 pb-2">
            <Building2 size={20} className="text-primary" />
            B2B / Wholesale Operations
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
             <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Wholesale Customer Count</label>
                <input
                  type="number"
                  value={inputs.current.b2b.wholesaleCustomers}
                  onChange={(e) => updateInput('current', 'b2b.wholesaleCustomers', Number(e.target.value))}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg py-2.5 px-3 text-white focus:outline-none focus:border-primary"
                />
             </div>
             <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Manual Processing (Hrs/Week)</label>
                <input
                  type="number"
                  value={inputs.current.b2b.manualProcessingHours}
                  onChange={(e) => updateInput('current', 'b2b.manualProcessingHours', Number(e.target.value))}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg py-2.5 px-3 text-white focus:outline-none focus:border-primary"
                />
                <p className="text-xs text-slate-500 mt-1">Time spent on manual entry, pricing, etc.</p>
             </div>
          </div>
          <div className="mt-4">
             <label className="block text-sm font-medium text-slate-300 mb-2">B2B Pain Points</label>
             <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
               {['No self-service portal', 'No custom pricing', 'Manual approvals', 'No quick reorder', 'Limited history visibility'].map(pt => (
                 <label key={pt} className="flex items-center gap-2 p-2 rounded cursor-pointer hover:bg-slate-800/50">
                    <input 
                      type="checkbox" 
                      className="rounded border-slate-600 bg-slate-900 text-primary focus:ring-offset-slate-900" 
                      checked={(inputs.current.b2b.painPoints || []).includes(pt)}
                      onChange={() => toggleB2BPainPoint(pt)}
                    />
                    <span className="text-sm text-slate-300">{pt}</span>
                 </label>
               ))}
             </div>
          </div>
        </div>
      )}

      {isRetail && (
        <div className={isB2B ? "pt-6 border-t border-slate-800" : ""}>
          <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2 border-b border-slate-800 pb-2">
            <ShoppingBag size={20} className="text-accent" />
            Retail / POS Operations
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
             <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Number of Locations</label>
                <input
                  type="number"
                  value={inputs.current.retail.locationCount}
                  onChange={(e) => updateInput('current', 'retail.locationCount', Number(e.target.value))}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg py-2.5 px-3 text-white focus:outline-none focus:border-primary"
                />
             </div>
             <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Current POS System</label>
                <input
                  type="text"
                  value={inputs.current.retail.posSystem}
                  onChange={(e) => updateInput('current', 'retail.posSystem', e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg py-2.5 px-3 text-white focus:outline-none focus:border-primary"
                  placeholder="e.g., Lightspeed, Square"
                />
             </div>
          </div>
          <div className="mt-4">
             <label className="block text-sm font-medium text-slate-300 mb-2">Omnichannel Needs</label>
             <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
               {['Buy Online Pickup In Store (BOPIS)', 'Ship from Store', 'Endless Aisle', 'Unified Inventory', 'Unified Customer Profiles'].map(pt => (
                 <label key={pt} className="flex items-center gap-2 p-2 rounded cursor-pointer hover:bg-slate-800/50">
                    <input 
                      type="checkbox" 
                      className="rounded border-slate-600 bg-slate-900 text-primary focus:ring-offset-slate-900" 
                      checked={(inputs.current.retail.desiredCapabilities || []).includes(pt)}
                      onChange={() => toggleRetailCapability(pt)}
                    />
                    <span className="text-sm text-slate-300">{pt}</span>
                 </label>
               ))}
             </div>
          </div>
        </div>
      )}
    </div>
  );
};

// --- Step 4: Migration & Future State ---
const StepMigrationFuture = ({ inputs, updateInput }: any) => (
  <div className="space-y-6">
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div>
        <label className="block text-sm font-medium text-slate-300 mb-2">Est. Implementation Cost</label>
        <div className="relative">
          <span className="absolute left-3 top-2.5 text-slate-500">$</span>
          <input
            type="number"
            value={inputs.migration.implementationCost}
            onChange={(e) => updateInput('migration', 'implementationCost', Number(e.target.value))}
            className="w-full bg-slate-900 border border-slate-700 rounded-lg py-2.5 pl-7 pr-3 text-white focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
          />
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium text-slate-300 mb-2">Training Budget</label>
        <div className="relative">
          <span className="absolute left-3 top-2.5 text-slate-500">$</span>
          <input
            type="number"
            value={inputs.migration.training}
            onChange={(e) => updateInput('migration', 'training', Number(e.target.value))}
            className={clsx(
              "w-full bg-slate-900 border border-slate-700 rounded-lg py-2.5 pl-7 pr-3 text-white focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary",
              inputs.migration.isTrainingIncluded && "opacity-50 cursor-not-allowed"
            )}
            disabled={inputs.migration.isTrainingIncluded}
          />
        </div>
        <label className="flex items-center gap-2 mt-2 cursor-pointer select-none">
          <input
            type="checkbox"
            checked={inputs.migration.isTrainingIncluded}
            onChange={(e) => updateInput('migration', 'isTrainingIncluded', e.target.checked)}
            className="rounded border-slate-600 bg-slate-900 text-primary focus:ring-offset-slate-900"
          />
          <span className="text-xs text-slate-400">Included in Implementation Cost</span>
        </label>
      </div>
    </div>
    
    <div className="border-t border-slate-800 pt-6">
       <h3 className="text-sm font-semibold text-white mb-4">Projected Annual Shopify Costs</h3>
       <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Shopify Plus Plan (Annual)</label>
            <div className="relative">
              <span className="absolute left-3 top-2.5 text-slate-500">$</span>
              <input
                type="number"
                value={inputs.migration.shopifyPlan}
                onChange={(e) => updateInput('migration', 'shopifyPlan', Number(e.target.value))}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg py-2.5 pl-7 pr-3 text-white focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Apps & Integrations (Annual)</label>
            <div className="relative">
              <span className="absolute left-3 top-2.5 text-slate-500">$</span>
              <input
                type="number"
                value={inputs.migration.apps}
                onChange={(e) => updateInput('migration', 'apps', Number(e.target.value))}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg py-2.5 pl-7 pr-3 text-white focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
              />
            </div>
          </div>
       </div>
    </div>

    <div className="border-t border-slate-800 pt-6">
      <label className="block text-sm font-medium text-slate-300 mb-2">Target Launch Timeline</label>
      <select 
        value={inputs.migration.launchTimeline}
        onChange={(e) => updateInput('migration', 'launchTimeline', e.target.value)}
        className="w-full bg-slate-900 border border-slate-700 rounded-lg py-2.5 px-3 text-white focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
      >
        <option value="12 weeks">12 Weeks (Aggressive)</option>
        <option value="16 weeks">16 Weeks (Standard)</option>
        <option value="24 weeks">24 Weeks (Complex)</option>
        <option value="36+ weeks">36+ Weeks (Enterprise)</option>
      </select>
    </div>
  </div>
);

// --- Step 5: Strategic Priorities ---
const StepStrategicPriorities = () => {
  const priorities = [
    "Launch B2B Portal", "International Expansion", "Omnichannel/POS", "Subscription Program", "Headless Commerce", "Marketplace Expansion"
  ];

  return (
    <div className="space-y-8">
      <div>
        <h3 className="text-sm font-semibold text-white mb-4">Strategic Goals (Next 12-24 Months)</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
           {priorities.map(p => (
             <label key={p} className="flex items-center gap-2 p-3 rounded border border-slate-700/50 bg-slate-800/30 hover:bg-slate-800 cursor-pointer transition-colors">
                <input type="checkbox" className="rounded border-slate-600 bg-slate-900 text-primary" />
                <span className="text-sm text-slate-200 font-medium">{p}</span>
             </label>
           ))}
        </div>
      </div>
      
      <div className="border-t border-slate-800 pt-6">
        <h3 className="text-sm font-semibold text-white mb-4">Integrations & Systems</h3>
        <div className="space-y-4">
           <div>
             <label className="block text-sm text-slate-400 mb-1">ERP / Accounting</label>
             <input type="text" placeholder="e.g. NetSuite, SAP, QuickBooks" className="w-full bg-slate-900 border border-slate-700 rounded-lg py-2 px-3 text-white text-sm" />
           </div>
           <div>
             <label className="block text-sm text-slate-400 mb-1">Marketing / CRM</label>
             <input type="text" placeholder="e.g. Klaviyo, Salesforce, HubSpot" className="w-full bg-slate-900 border border-slate-700 rounded-lg py-2 px-3 text-white text-sm" />
           </div>
           <div>
             <label className="block text-sm text-slate-400 mb-1">WMS / Fulfillment</label>
             <input type="text" placeholder="e.g. ShipStation, Celigo, 3PL" className="w-full bg-slate-900 border border-slate-700 rounded-lg py-2 px-3 text-white text-sm" />
           </div>
        </div>
      </div>
    </div>
  );
};


const steps = [
  { id: 'profile', title: 'Business Profile', component: StepBusinessProfile, icon: Building2 },
  { id: 'current', title: 'Current Assessment', component: StepCurrentState, icon: BarChart3 },
  { id: 'specifics', title: 'Business Specifics', component: StepBusinessSpecifics, icon: Truck },
  { id: 'migration', title: 'Migration Plan', component: StepMigrationFuture, icon: Settings },
  { id: 'strategy', title: 'Strategic Goals', component: StepStrategicPriorities, icon: Target },
];

export const InputModal: React.FC = () => {
  const { inputs, updateInput } = useScenario();
  const [isOpen, setIsOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);

  // Lock body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.classList.add('modal-open');
    } else {
      document.body.classList.remove('modal-open');
    }
    return () => document.body.classList.remove('modal-open');
  }, [isOpen]);

  const StepComponent = steps[currentStep].component;

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(prev => prev + 1);
    } else {
      setIsOpen(false);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  };

  return (
    <>
      <Button 
        variant="primary" 
        size="sm" 
        onClick={() => setIsOpen(true)}
        className="gap-2 w-full md:w-auto bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 shadow-[0_0_20px_rgba(37,99,235,0.3)] border border-blue-400/30 text-white font-semibold tracking-wide transition-all duration-300 transform hover:scale-[1.02] hover:shadow-[0_0_25px_rgba(37,99,235,0.5)]"
      >
        <Settings size={16} className="group-hover:rotate-90 transition-transform duration-500" />
        Get Started
      </Button>

      {isOpen && createPortal(
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 overflow-hidden">
          {/* Full Screen Backdrop with heavily blurred background */}
          <div 
            className="absolute inset-0 bg-slate-950/80 backdrop-blur-xl transition-all duration-300" 
            onClick={() => setIsOpen(false)} 
          />
          
      <div className="relative w-full max-w-5xl max-h-[85vh] flex flex-col bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl overflow-hidden ring-1 ring-white/10 m-auto">
        
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-slate-800 bg-slate-900 flex-shrink-0">
              <div className="flex items-center gap-4">
                 <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                   {React.createElement(steps[currentStep].icon, { size: 20 })}
                 </div>
                 <div>
                    <h2 className="text-xl font-bold text-white">{steps[currentStep].title}</h2>
                    <p className="text-sm text-slate-400">Step {currentStep + 1} of {steps.length}</p>
                 </div>
              </div>
              <button onClick={() => setIsOpen(false)} className="text-slate-400 hover:text-white p-2 hover:bg-slate-800 rounded-full transition-colors">
                <X size={24} />
              </button>
            </div>

            {/* Main Content (Split Layout) */}
            <div className="flex flex-1 overflow-hidden">
               {/* Sidebar Progress (Desktop) */}
               <div className="hidden md:block w-64 bg-slate-900/30 border-r border-slate-800 p-6 overflow-y-auto">
                  <div className="space-y-1">
                    {steps.map((step, idx) => (
                      <button
                        key={step.id}
                        onClick={() => setCurrentStep(idx)}
                        disabled={idx > currentStep + 1} // Can only jump to next available or previous
                        className={clsx(
                          "w-full text-left px-3 py-3 rounded-lg text-sm font-medium transition-all flex items-center gap-3",
                          currentStep === idx ? "bg-primary/10 text-primary" : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/50",
                          idx > currentStep && "opacity-50 cursor-not-allowed"
                        )}
                      >
                        <div className={clsx(
                          "w-6 h-6 rounded-full flex items-center justify-center text-xs border",
                          currentStep === idx ? "border-primary bg-primary text-white" : 
                          idx < currentStep ? "border-success bg-success text-white" : "border-slate-600"
                        )}>
                          {idx < currentStep ? <CheckCircle2 size={14} /> : idx + 1}
                        </div>
                        {step.title}
                      </button>
                    ))}
                  </div>
               </div>

               {/* Form Content */}
               <div className="flex-1 overflow-y-auto p-6 md:p-10 bg-gradient-to-br from-slate-900/50 to-slate-900/10">
                  <div className="max-w-2xl mx-auto">
                    <StepComponent inputs={inputs} updateInput={updateInput} />
                  </div>
               </div>
            </div>

            {/* Footer */}
            <div className="p-6 border-t border-slate-800 bg-slate-900/80 backdrop-blur flex justify-between items-center flex-shrink-0">
              <div className="flex gap-3">
                 <Button 
                    variant="ghost" 
                    onClick={() => setIsOpen(false)} 
                    className="text-slate-400 hover:text-white hover:bg-slate-800"
                  >
                    Cancel
                  </Button>
                  
                  <Button 
                    variant="ghost" 
                    onClick={handleBack} 
                    disabled={currentStep === 0}
                    className={clsx(
                      "text-slate-400 hover:text-white hover:bg-slate-800",
                      currentStep === 0 ? 'opacity-0 pointer-events-none' : ''
                    )}
                  >
                    <ArrowLeft size={16} className="mr-2" /> Back
                  </Button>
              </div>
              
              <div className="flex gap-2">
                 {/* Optional: Add a "Save for Later" or "Skip" button here if needed */}
                 <Button onClick={handleNext} className="min-w-[140px] bg-primary hover:bg-blue-600 text-white shadow-lg shadow-blue-900/20">
                  {currentStep === steps.length - 1 ? (
                    <>Complete Analysis <CheckCircle2 size={16} className="ml-2" /></>
                  ) : (
                    <>Next Step <ArrowRight size={16} className="ml-2" /></>
                  )}
                </Button>
              </div>
            </div>
            
          </div>
        </div>,
        document.body
      )}
    </>
  );
};
