import Layout from './components/Layout';
import Hero from './components/sections/Hero';
import FinancialSnapshot from './components/sections/FinancialSnapshot';
import { CurrentState } from './components/sections/CurrentState';
import GrowthProjections from './components/sections/GrowthProjections';

import TCOAnalysis from './components/sections/TCOAnalysis';
import CashFlowAnalysis from './components/sections/CashFlowAnalysis';

import ImplementationRoadmap from './components/sections/ImplementationRoadmap';
import { CaseStudies } from './components/sections/CaseStudies';

function App() {
  return (
    <Layout>
      <Hero />
      <FinancialSnapshot />
      <CurrentState />
      <GrowthProjections />
      <TCOAnalysis />
      <CashFlowAnalysis />
      <ImplementationRoadmap />
      <CaseStudies />
    </Layout>
  );
}

export default App;
