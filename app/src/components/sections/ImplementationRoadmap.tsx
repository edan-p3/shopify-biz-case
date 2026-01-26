import React from 'react';
import { CheckCircle2, Clock } from 'lucide-react';
import { generatePDF } from '../../utils/pdfExport';
import { useScenario } from '../../context/ScenarioContext';

const ImplementationRoadmap: React.FC = () => {
  const { inputs, totalRevenue } = useScenario();
  
  // Check if user has entered data
  const hasData = totalRevenue > 0 || inputs.migration.implementationCost > 0;
  
  // If no data, don't render this section
  if (!hasData) {
    return null;
  }
  
  const phases = [
    {
      id: 1,
      title: "Discovery & Architecture",
      duration: "Weeks 1-4",
      status: "completed",
      deliverables: [
        "Technical Requirements Document",
        "Data Migration Strategy",
        "Solution Architecture",
        "Project Plan Approval"
      ]
    },
    {
      id: 2,
      title: "Design & UX",
      duration: "Weeks 3-8",
      status: "active",
      deliverables: [
        "Wireframes & Prototypes",
        "UI Design System",
        "Mobile-First Layouts",
        "Design Sign-off"
      ]
    },
    {
      id: 3,
      title: "Development & Integration",
      duration: "Weeks 6-14",
      status: "pending",
      deliverables: [
        "Theme Development",
        "ERP/CRM Integration",
        "Custom App Development",
        "Payment Gateway Setup"
      ]
    },
    {
      id: 4,
      title: "Migration & QA",
      duration: "Weeks 12-16",
      status: "pending",
      deliverables: [
        "Full Data Migration",
        "UAT (User Acceptance Testing)",
        "Performance Testing",
        "Staff Training"
      ]
    },
    {
      id: 5,
      title: "Launch & Hypercare",
      duration: "Week 17+",
      status: "pending",
      deliverables: [
        "Go-Live Execution",
        "DNS Propagation",
        "Post-Launch Monitoring",
        "Handover to Operations"
      ]
    }
  ];

  return (
    <section id="roadmap" className="py-24 bg-slate-900 relative overflow-hidden border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Implementation Roadmap</h2>
          <p className="text-slate-400 max-w-2xl mx-auto">
            A structured, low-risk path to launch in under 5 months.
          </p>
        </div>

        <div className="relative">
          {/* Vertical Line for Desktop */}
          <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-px bg-slate-800 -translate-x-1/2"></div>

          <div className="space-y-12 md:space-y-0">
            {phases.map((phase, index) => {
              const isEven = index % 2 === 0;
              return (
                <div key={phase.id} className={`md:flex items-center justify-between ${isEven ? 'flex-row-reverse' : ''} relative`}>
                  
                  {/* Timeline Dot */}
                  <div className="hidden md:flex absolute left-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-slate-900 border-2 border-blue-500 items-center justify-center z-10">
                    <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                  </div>

                  {/* Content Side */}
                  <div className="md:w-[45%] mb-8 md:mb-0">
                    <div className={`bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-6 hover:border-blue-500/30 transition-colors relative ${isEven ? 'md:text-left' : 'md:text-right'}`}>
                      
                      {/* Mobile Line Connector */}
                      <div className="md:hidden absolute left-6 top-full h-12 w-px bg-slate-800"></div>

                      <div className={`flex items-center gap-3 mb-4 ${isEven ? 'md:flex-row' : 'md:flex-row-reverse'}`}>
                        <span className="inline-flex items-center justify-center px-3 py-1 rounded-full bg-blue-500/10 text-blue-400 text-xs font-bold border border-blue-500/20">
                          Phase {phase.id}
                        </span>
                        <span className="flex items-center gap-1 text-slate-400 text-sm">
                          <Clock size={14} />
                          {phase.duration}
                        </span>
                      </div>

                      <h3 className="text-xl font-bold text-white mb-4">{phase.title}</h3>

                      <ul className={`space-y-2 ${isEven ? '' : 'md:items-end md:flex md:flex-col'}`}>
                        {phase.deliverables.map((item, i) => (
                          <li key={i} className="flex items-start gap-2 text-sm text-slate-300">
                            <CheckCircle2 size={16} className="text-emerald-500 mt-0.5 shrink-0" />
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {/* Empty Side for Spacing */}
                  <div className="md:w-[45%]"></div>
                </div>
              );
            })}
          </div>
        </div>

        {/* CTA */}
        <div className="mt-20 text-center">
          <button 
            onClick={() => generatePDF()}
            className="bg-blue-600 hover:bg-blue-500 text-white px-8 py-4 rounded-xl font-semibold text-lg transition-all shadow-lg shadow-blue-600/25"
          >
            Download Detailed Project Plan
          </button>
        </div>
      </div>
    </section>
  );
};

export default ImplementationRoadmap;
