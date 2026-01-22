import React from 'react';
import { useScenario } from '../context/ScenarioContext';
import { clsx } from 'clsx';

export const ScenarioToggle: React.FC = () => {
  const { currentScenario, setScenario } = useScenario();
  const scenarios = ['conservative', 'moderate', 'aggressive'];

  return (
    <div className="flex justify-center mb-10">
      <div className="bg-surface p-1 rounded-xl border border-slate-700/50 inline-flex">
        {scenarios.map((s) => (
          <button
            key={s}
            onClick={() => setScenario(s)}
            className={clsx(
              "px-6 py-2 rounded-lg text-sm font-medium transition-all duration-200 capitalize",
              currentScenario.name === s 
                ? "bg-primary text-white shadow-md" 
                : "text-slate-400 hover:text-white hover:bg-slate-700/50"
            )}
          >
            {s}
          </button>
        ))}
      </div>
    </div>
  );
};
