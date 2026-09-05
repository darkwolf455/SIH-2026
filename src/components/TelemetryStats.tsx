import React from 'react';
import { 
  Satellite, 
  Droplets, 
  Compass, 
  Ship, 
  Wind, 
  Activity, 
  ShieldAlert,
  ArrowUpRight
} from 'lucide-react';
import { Scenario } from '../types';

interface TelemetryStatsProps {
  scenario: Scenario;
  onViewAttribution: () => void;
}

export const TelemetryStats: React.FC<TelemetryStatsProps> = ({
  scenario,
  onViewAttribution,
}) => {
  const topSuspect = scenario.vessels[0];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 text-slate-100">
      
      {/* Stat 1: SAR Slick Area & Damping */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-3.5 shadow-md flex flex-col justify-between">
        <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
          <span className="font-medium">Detected Slick Area</span>
          <Satellite className="w-4 h-4 text-cyan-400" />
        </div>
        <div>
          <div className="text-xl font-bold font-mono text-cyan-400">
            {scenario.slickMetrics.areaKm2} <span className="text-xs text-slate-400 font-sans">km²</span>
          </div>
          <div className="text-[10px] text-slate-400 mt-0.5">
            Damping: <span className="text-slate-200 font-mono font-semibold">{scenario.slickMetrics.dampingDb} dB</span> | Conf: <span className="text-emerald-400 font-mono font-semibold">{scenario.slickMetrics.confidenceScore}%</span>
          </div>
        </div>
      </div>

      {/* Stat 2: Estimated Volume & Weathering */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-3.5 shadow-md flex flex-col justify-between">
        <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
          <span className="font-medium">Estimated Discharged Oil</span>
          <Droplets className="w-4 h-4 text-amber-400" />
        </div>
        <div>
          <div className="text-xl font-bold font-mono text-amber-400">
            {scenario.slickMetrics.estimatedVolumeBbl} <span className="text-xs text-slate-400 font-sans">Barrels</span>
          </div>
          <div className="text-[10px] text-slate-400 mt-0.5">
            Vol: <span className="text-slate-200 font-mono font-semibold">{scenario.slickMetrics.estimatedVolumeM3} m³</span> | <span className="text-amber-300 font-semibold">{scenario.slickMetrics.weatheringState}</span>
          </div>
        </div>
      </div>

      {/* Stat 3: Lagrangian Hindcast Origin */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-3.5 shadow-md flex flex-col justify-between">
        <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
          <span className="font-medium">Drift Origin (Hindcast)</span>
          <Compass className="w-4 h-4 text-purple-400" />
        </div>
        <div>
          <div className="text-sm font-bold font-mono text-purple-300 truncate">
            {scenario.slickOriginPoint[0].toFixed(3)}°N, {Math.abs(scenario.slickOriginPoint[1]).toFixed(3)}°W
          </div>
          <div className="text-[10px] text-slate-400 mt-0.5">
            Release Window: <span className="text-purple-300 font-mono font-semibold">{scenario.driftSteps[0]?.formattedTime}</span>
          </div>
        </div>
      </div>

      {/* Stat 4: Primary Suspect Vessel & Score */}
      <div 
        onClick={onViewAttribution}
        className="bg-slate-900 border border-red-900/60 hover:border-red-500 rounded-xl p-3.5 shadow-md flex flex-col justify-between cursor-pointer transition-all hover:bg-slate-850 group"
      >
        <div className="flex items-center justify-between text-red-400 text-xs mb-1">
          <span className="font-bold flex items-center space-x-1">
            <ShieldAlert className="w-3.5 h-3.5" />
            <span>Top Suspect Vessel</span>
          </span>
          <ArrowUpRight className="w-4 h-4 text-red-400 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
        </div>
        <div>
          <div className="text-sm font-bold text-slate-100 flex items-center justify-between">
            <span className="truncate">{topSuspect?.name || 'N/A'}</span>
            <span className="font-mono text-red-400 font-bold ml-2">{topSuspect?.score || 0}%</span>
          </div>
          <div className="text-[10px] text-slate-400 mt-0.5 truncate">
            CPA: <span className="text-slate-200 font-mono font-semibold">{topSuspect?.cpaKm} km</span> | Gap: <span className="text-amber-400 font-mono font-semibold">{topSuspect?.darkAisGapMinutes || 0}m</span>
          </div>
        </div>
      </div>

    </div>
  );
};
