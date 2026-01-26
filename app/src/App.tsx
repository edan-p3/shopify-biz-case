import { useEffect, useState } from 'react';
import Layout from './components/Layout';
import Hero from './components/sections/Hero';
import FinancialSnapshot from './components/sections/FinancialSnapshot';
import { CurrentState } from './components/sections/CurrentState';
import GrowthProjections from './components/sections/GrowthProjections';
import TCOAnalysis from './components/sections/TCOAnalysis';
import CashFlowAnalysis from './components/sections/CashFlowAnalysis';
import ImplementationRoadmap from './components/sections/ImplementationRoadmap';
import { CaseStudies } from './components/sections/CaseStudies';
import { NextSteps } from './components/sections/NextSteps';
import { Disclaimer } from './components/sections/Disclaimer';
import { useScenario } from './context/ScenarioContext';

function App() {
  const { inputs, totalRevenue } = useScenario();
  const [showWelcome, setShowWelcome] = useState(false);

  useEffect(() => {
    // Check if user has entered any data
    const hasData = 
      totalRevenue > 0 ||
      inputs.profile.companyName.length > 0;
    
    // If no data and haven't dismissed welcome, show it
    const hasSeenWelcome = localStorage.getItem('hasSeenWelcome');
    if (!hasData && !hasSeenWelcome) {
      setShowWelcome(true);
    }
  }, [inputs]);

  const handleDismissWelcome = () => {
    localStorage.setItem('hasSeenWelcome', 'true');
    setShowWelcome(false);
  };

  return (
    <Layout>
      {showWelcome && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
          <div className="bg-slate-800 border border-slate-700 rounded-2xl p-8 max-w-md mx-4 text-center">
            <h2 className="text-2xl font-bold text-white mb-4">Welcome to Your Business Case Calculator</h2>
            <p className="text-slate-300 mb-6">
              To see your personalized ROI projections, please click <strong className="text-blue-400">"Customize Inputs"</strong> in the navigation above to enter your business data.
            </p>
            <button
              onClick={handleDismissWelcome}
              className="bg-blue-600 hover:bg-blue-500 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
            >
              Got it, I'll enter my data
            </button>
          </div>
        </div>
      )}
      
      <Hero />
      <FinancialSnapshot />
      <CurrentState />
      <GrowthProjections />
      <TCOAnalysis />
      <CashFlowAnalysis />
      <ImplementationRoadmap />
      <CaseStudies />
      <NextSteps />
      <Disclaimer />
    </Layout>
  );
}

export default App;
