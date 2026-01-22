import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, TrendingUp, Clock, DollarSign } from 'lucide-react';
import { Link } from 'react-scroll';
import { useScenario } from '../../context/ScenarioContext';
import { formatCurrency } from '../../utils/formatters';

const Hero: React.FC = () => {
  const { currentScenario, inputs } = useScenario();
  
  const companyName = inputs.profile.companyName || "Your";

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.5 }
    }
  };

  return (
    <section id="hero" className="relative min-h-screen flex items-center justify-center pt-20 overflow-hidden">
      {/* Background Grid */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-20 pointer-events-none" />
      
      {/* Gradient Blob */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-blue-600/20 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="text-center max-w-4xl mx-auto mb-16"
        >
          <div className="inline-flex items-center justify-center px-4 py-1.5 mb-8 rounded-full bg-blue-500/10 border border-blue-500/20 backdrop-blur-sm">
            <span className="text-blue-400 font-medium text-sm tracking-wide">Strategic Business Case</span>
          </div>
          
          <motion.h1 variants={itemVariants} className="text-5xl md:text-7xl font-bold tracking-tight text-white mb-8 leading-tight">
            Transform {companyName}'s <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">
              Commerce Platform
            </span>
          </motion.h1>
          
          <motion.p variants={itemVariants} className="text-xl text-slate-300 mb-10 leading-relaxed max-w-2xl mx-auto">
            A strategic investment delivering <span className="font-bold text-white">{currentScenario.roi3Year} ROI</span> in 3 years with a payback period of <span className="font-bold text-white">{currentScenario.paybackPeriod}</span>. Unlock growth, efficiency, and scalability with Shopify.
          </motion.p>

          <motion.div variants={itemVariants} className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link to="snapshot" smooth={true} offset={-100} className="w-full sm:w-auto">
              <button className="w-full sm:w-auto bg-blue-600 hover:bg-blue-500 text-white px-8 py-4 rounded-xl font-semibold text-lg transition-all flex items-center justify-center gap-2 shadow-lg shadow-blue-600/25">
                Explore Business Case
                <ArrowRight size={20} />
              </button>
            </Link>
            <Link to="roadmap" smooth={true} offset={-100} className="w-full sm:w-auto">
              <button className="w-full sm:w-auto bg-slate-800 hover:bg-slate-700 text-white px-8 py-4 rounded-xl font-semibold text-lg transition-all border border-slate-700">
                View Roadmap
              </button>
            </Link>
          </motion.div>
        </motion.div>

        {/* Key Metrics Cards */}
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 md:grid-cols-3 gap-6"
        >
          {/* NPV Card */}
          <motion.div variants={itemVariants} className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 p-8 rounded-2xl hover:border-blue-500/50 transition-colors group">
            <div className="flex justify-between items-start mb-4">
              <div className="w-12 h-12 bg-blue-500/10 rounded-lg flex items-center justify-center text-blue-400 group-hover:bg-blue-500 group-hover:text-white transition-colors">
                <DollarSign size={24} />
              </div>
              <span className="text-green-400 text-sm font-medium flex items-center gap-1">
                <TrendingUp size={14} /> Positive
              </span>
            </div>
            <div className="text-4xl font-bold text-white mb-1 tracking-tight">
              {currentScenario.npv}
            </div>
            <div className="text-slate-400 text-sm font-medium">3-Year NPV</div>
          </motion.div>

          {/* ROI Card */}
          <motion.div variants={itemVariants} className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 p-8 rounded-2xl hover:border-purple-500/50 transition-colors group">
            <div className="flex justify-between items-start mb-4">
              <div className="w-12 h-12 bg-purple-500/10 rounded-lg flex items-center justify-center text-purple-400 group-hover:bg-purple-500 group-hover:text-white transition-colors">
                <TrendingUp size={24} />
              </div>
              <span className="text-green-400 text-sm font-medium flex items-center gap-1">
                <TrendingUp size={14} /> Exceptional
              </span>
            </div>
            <div className="text-4xl font-bold text-purple-400 mb-1 tracking-tight">
              {currentScenario.roi3Year}
            </div>
            <div className="text-slate-400 text-sm font-medium">ROI (3-Year)</div>
          </motion.div>

          {/* Payback Card */}
          <motion.div variants={itemVariants} className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 p-8 rounded-2xl hover:border-emerald-500/50 transition-colors group">
            <div className="flex justify-between items-start mb-4">
              <div className="w-12 h-12 bg-emerald-500/10 rounded-lg flex items-center justify-center text-emerald-400 group-hover:bg-emerald-500 group-hover:text-white transition-colors">
                <Clock size={24} />
              </div>
              <span className="text-green-400 text-sm font-medium flex items-center gap-1">
                <TrendingUp size={14} /> Fast Return
              </span>
            </div>
            <div className="text-4xl font-bold text-white mb-1 tracking-tight">
              {currentScenario.paybackPeriod}
            </div>
            <div className="text-slate-400 text-sm font-medium">Payback Period</div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;
