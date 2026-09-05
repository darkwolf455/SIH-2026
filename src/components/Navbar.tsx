import React from 'react';
import { 
  Waves, 
  Satellite, 
  Compass, 
  Ship, 
  Code2, 
  FileText, 
  Sparkles, 
  Radio, 
  Layers, 
  AlertTriangle,
  ChevronDown
} from 'lucide-react';
import { Scenario } from '../types';

interface NavbarProps {
  scenarios: Scenario[];
  currentScenario: Scenario;
  onSelectScenario: (scenario: Scenario) => void;
  activeTab: 'map' | 'architecture' | 'module1' | 'module2' | 'module3' | 'code' | 'attribution';
  setActiveTab: (tab: 'map' | 'architecture' | 'module1' | 'module2' | 'module3' | 'code' | 'attribution') => void;
  onOpenReport: () => void;
  onToggleAiAnalyst: () => void;
  isAiDrawerOpen: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({
  scenarios,
  currentScenario,
  onSelectScenario,
  activeTab,
  setActiveTab,
  onOpenReport,
  onToggleAiAnalyst,
  isAiDrawerOpen,
}) => {
  return (
    <header id="app-header" className="bg-slate-900 border-b border-slate-800 sticky top-0 z-50 text-slate-100 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo & Title */}
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center shadow-lg shadow-cyan-500/20 border border-cyan-400/30">
              <Waves className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-bold text-lg tracking-tight text-white font-mono">
                  AEGIS<span className="text-cyan-400">SLICK</span>
                </span>
                <span className="text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full bg-cyan-950 text-cyan-400 border border-cyan-800/80">
                  SAR + AIS Pipeline
                </span>
              </div>
              <p className="text-xs text-slate-400 hidden sm:block">
                Automated Remote Sensing & Marine Cadastre Attribution
              </p>
            </div>
          </div>

          {/* Scenario Selector Dropdown */}
          <div className="hidden md:flex items-center space-x-3">
            <div className="relative">
              <label htmlFor="scenario-select" className="sr-only">Select Incident Scenario</label>
              <select
                id="scenario-select"
                value={currentScenario.id}
                onChange={(e) => {
                  const s = scenarios.find((item) => item.id === e.target.value);
                  if (s) onSelectScenario(s);
                }}
                aria-label="Select Incident Scenario"
                className="bg-slate-800 border border-slate-700 hover:border-slate-600 text-xs text-slate-200 rounded-lg px-3 py-2 pr-8 focus:outline-none focus:ring-2 focus:ring-cyan-500 transition-colors cursor-pointer appearance-none"
              >
                {scenarios.map((s) => (
                  <option key={s.id} value={s.id}>
                    📍 {s.name}
                  </option>
                ))}
              </select>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>

            {/* Satellite Live Sensor Badge */}
            <div className="flex items-center space-x-2 bg-slate-950/80 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-slate-300">
              <Satellite className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
              <span>{currentScenario.sarSensor.satellite}</span>
              <span className="text-slate-500">|</span>
              <span className="font-mono text-cyan-400">{currentScenario.sarSensor.polarization}</span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center space-x-2">
            {/* Generate USCG / MARPOL Report */}
            <button
              id="btn-open-report"
              onClick={onOpenReport}
              className="flex items-center space-x-1.5 px-3 py-2 rounded-lg text-xs font-medium bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-colors shadow-sm"
              title="Generate Official MARPOL Annex I Forensic Report"
            >
              <FileText className="w-4 h-4 text-amber-400" />
              <span className="hidden sm:inline">Forensic Report</span>
            </button>

            {/* AI Forensic Analyst Drawer Toggle */}
            <button
              id="btn-toggle-ai-analyst"
              onClick={onToggleAiAnalyst}
              className={`flex items-center space-x-1.5 px-3 py-2 rounded-lg text-xs font-medium border transition-all shadow-sm ${
                isAiDrawerOpen
                  ? 'bg-cyan-500 text-slate-950 border-cyan-400 shadow-cyan-500/20'
                  : 'bg-cyan-950/80 text-cyan-300 border-cyan-800 hover:bg-cyan-900/80'
              }`}
            >
              <Sparkles className="w-4 h-4 text-cyan-400" />
              <span className="hidden sm:inline">AI Incident Analyst</span>
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center space-x-1 overflow-x-auto py-2 border-t border-slate-800/80 scrollbar-none text-xs">
          <button
            id="tab-map"
            onClick={() => setActiveTab('map')}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-md font-medium transition-colors whitespace-nowrap ${
              activeTab === 'map'
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
            }`}
          >
            <Layers className="w-3.5 h-3.5 text-cyan-400" />
            <span>Interactive Map & SAR Slicks</span>
          </button>

          <button
            id="tab-attribution"
            onClick={() => setActiveTab('attribution')}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-md font-medium transition-colors whitespace-nowrap ${
              activeTab === 'attribution'
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
            }`}
          >
            <Ship className="w-3.5 h-3.5 text-red-400" />
            <span>AIS Suspect Attribution Matrix</span>
            <span className="px-1.5 py-0.2 rounded-full bg-red-950 text-red-400 border border-red-800 text-[10px]">
              {currentScenario.vessels.length}
            </span>
          </button>

          <button
            id="tab-architecture"
            onClick={() => setActiveTab('architecture')}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-md font-medium transition-colors whitespace-nowrap ${
              activeTab === 'architecture'
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
            }`}
          >
            <Compass className="w-3.5 h-3.5 text-amber-400" />
            <span>Architecture & Physics Blueprint</span>
          </button>

          <button
            id="tab-code"
            onClick={() => setActiveTab('code')}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-md font-medium transition-colors whitespace-nowrap ${
              activeTab === 'code'
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
            }`}
          >
            <Code2 className="w-3.5 h-3.5 text-emerald-400" />
            <span>Python Pipeline Codebase</span>
          </button>
        </div>

      </div>
    </header>
  );
};
