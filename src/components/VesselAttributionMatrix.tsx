import React, { useState } from 'react';
import { 
  Ship, 
  AlertTriangle, 
  ShieldAlert, 
  Clock, 
  MapPin, 
  Gauge, 
  Radio, 
  ChevronRight, 
  CheckCircle, 
  FileText,
  Anchor,
  Filter
} from 'lucide-react';
import { Scenario, VesselTrack } from '../types';

interface VesselAttributionMatrixProps {
  scenario: Scenario;
  selectedVessel: VesselTrack | null;
  onSelectVessel: (vessel: VesselTrack) => void;
  onGenerateReport: () => void;
}

export const VesselAttributionMatrix: React.FC<VesselAttributionMatrixProps> = ({
  scenario,
  selectedVessel,
  onSelectVessel,
  onGenerateReport,
}) => {
  const [filterType, setFilterType] = useState<string>('ALL');

  const filteredVessels = scenario.vessels.filter((v) => {
    if (filterType === 'SUSPECTS_ONLY') return v.score >= 50;
    if (filterType === 'TANKERS_ONLY') return v.vesselType.includes('Tanker');
    return true;
  });

  const activeVessel = selectedVessel || scenario.vessels[0];

  return (
    <div className="space-y-6 text-slate-100 max-w-7xl mx-auto pb-12">
      
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl gap-4">
        <div>
          <div className="flex items-center space-x-2 text-xs font-mono text-red-400 mb-1">
            <ShieldAlert className="w-4 h-4" />
            <span>US MARINE CADASTRE AIS SPACE-TIME CORRIDOR CORRELATION</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-white">
            Vessel Attribution & Behavioral Anomaly Matrix
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Intersection of NOAA Marine Cadastre AIS transponder logs with OpenDrift Lagrangian hindcast origin cylinder (±6 hrs, ±25 km buffer).
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={onGenerateReport}
            className="flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-white font-semibold text-xs transition-colors shadow-lg shadow-red-600/20"
          >
            <FileText className="w-4 h-4" />
            <span>Export Enforcement Dossier</span>
          </button>
        </div>
      </div>

      {/* Main Grid: Vessel List Table + Selected Suspect Dossier Card */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column: Ranked Vessel Cards (2 Cols) */}
        <div className="lg:col-span-2 space-y-4">
          
          {/* Filter Bar */}
          <div className="flex items-center justify-between bg-slate-900/80 border border-slate-800 rounded-xl p-3 text-xs">
            <div className="flex items-center space-x-2">
              <Filter className="w-4 h-4 text-slate-400" />
              <span className="text-slate-400 font-medium">Filter Trajectories:</span>
            </div>
            <div className="flex items-center space-x-1.5">
              {['ALL', 'SUSPECTS_ONLY', 'TANKERS_ONLY'].map((f) => (
                <button
                  key={f}
                  onClick={() => setFilterType(f)}
                  className={`px-3 py-1 rounded-lg text-[11px] font-medium transition-colors ${
                    filterType === f
                      ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                  }`}
                >
                  {f === 'ALL' ? 'All Vessels' : f === 'SUSPECTS_ONLY' ? 'High Risk (Score ≥ 50%)' : 'Tankers Only'}
                </button>
              ))}
            </div>
          </div>

          {/* List of Vessels */}
          <div className="space-y-3">
            {filteredVessels.map((v, index) => {
              const isSelected = activeVessel?.mmsi === v.mmsi;
              const isCritical = v.score >= 80;

              return (
                <div
                  key={v.mmsi}
                  onClick={() => onSelectVessel(v)}
                  className={`p-4 rounded-xl border transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-slate-800/90 border-cyan-500 shadow-lg shadow-cyan-500/10'
                      : isCritical
                      ? 'bg-slate-900/90 border-red-900/80 hover:border-red-500/60'
                      : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    
                    {/* Left: Vessel Identity */}
                    <div className="flex items-start space-x-3.5">
                      <div
                        className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm ${
                          isCritical
                            ? 'bg-red-950 text-red-400 border border-red-800'
                            : 'bg-slate-800 text-slate-300 border border-slate-700'
                        }`}
                      >
                        #{index + 1}
                      </div>

                      <div>
                        <div className="flex items-center space-x-2">
                          <h4 className="font-bold text-sm text-slate-100">{v.name}</h4>
                          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
                            {v.vesselType}
                          </span>
                          <span className="text-[10px] text-slate-400 font-mono">
                            🚩 {v.flag}
                          </span>
                        </div>

                        <div className="flex items-center space-x-3 text-xs text-slate-400 font-mono mt-1">
                          <span>MMSI: {v.mmsi}</span>
                          <span>•</span>
                          <span>IMO: {v.imo}</span>
                          <span>•</span>
                          <span>Length: {v.lengthM}m</span>
                        </div>
                      </div>
                    </div>

                    {/* Right: Scores & CPA */}
                    <div className="flex items-center space-x-4">
                      <div className="text-right">
                        <div className="text-[10px] text-slate-400 font-mono uppercase">Closest Approach</div>
                        <div className="font-bold text-sm text-slate-200">{v.cpaKm} km</div>
                      </div>

                      <div className="text-right">
                        <div className="text-[10px] text-slate-400 font-mono uppercase">Attribution Score</div>
                        <div
                          className={`font-mono font-bold text-base ${
                            isCritical ? 'text-red-400' : v.score > 30 ? 'text-amber-400' : 'text-slate-400'
                          }`}
                        >
                          {v.score}%
                        </div>
                      </div>

                      <ChevronRight className="w-4 h-4 text-slate-500" />
                    </div>

                  </div>

                  {/* Anomaly Badges */}
                  {v.anomalyFlags.length > 0 && (
                    <div className="mt-3 pt-2.5 border-t border-slate-800/80 flex flex-wrap gap-1.5">
                      {v.anomalyFlags.map((flag, idx) => (
                        <span
                          key={idx}
                          className="text-[10px] px-2 py-0.5 rounded-md bg-red-950/40 text-red-300 border border-red-900/60 flex items-center space-x-1"
                        >
                          <AlertTriangle className="w-2.5 h-2.5 text-red-400" />
                          <span>{flag}</span>
                        </span>
                      ))}
                    </div>
                  )}

                </div>
              );
            })}
          </div>

        </div>

        {/* Right Column: Selected Suspect Deep Forensic Dossier */}
        {activeVessel && (
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-5 flex flex-col justify-between">
            <div className="space-y-4">
              
              {/* Dossier Header */}
              <div className="border-b border-slate-800 pb-4">
                <div className="text-[10px] font-mono text-cyan-400 uppercase tracking-wider mb-1">
                  SUSPECT VESSEL DOSSIER
                </div>
                <h3 className="text-lg font-bold text-slate-100 flex items-center space-x-2">
                  <Ship className="w-5 h-5 text-red-400" />
                  <span>{activeVessel.name}</span>
                </h3>
                <div className="text-xs text-slate-400 font-mono mt-0.5">
                  Operated by {activeVessel.operator || 'Unknown Maritime Entity'}
                </div>
              </div>

              {/* Overall Score Meter */}
              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-semibold text-slate-300">Composite Attribution Probability:</span>
                  <span
                    className={`font-mono font-bold text-base ${
                      activeVessel.score >= 80 ? 'text-red-400' : 'text-amber-400'
                    }`}
                  >
                    {activeVessel.score}%
                  </span>
                </div>
                <div className="w-full h-2.5 bg-slate-800 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-700 ${
                      activeVessel.score >= 80
                        ? 'bg-gradient-to-r from-red-600 to-red-400'
                        : 'bg-gradient-to-r from-amber-500 to-amber-400'
                    }`}
                    style={{ width: `${activeVessel.score}%` }}
                  />
                </div>
              </div>

              {/* 4-Factor Weighted Breakdown */}
              <div className="space-y-2.5">
                <div className="text-xs font-semibold text-slate-300">Scoring Factor Breakdown:</div>
                
                <div className="space-y-2 text-xs">
                  {/* Proximity */}
                  <div className="bg-slate-950/70 p-2.5 rounded-lg border border-slate-800/80">
                    <div className="flex justify-between text-[11px] mb-1">
                      <span className="text-slate-400">1. Spatial-Temporal Proximity (40% Weight):</span>
                      <span className="font-mono text-cyan-300">{activeVessel.probabilityBreakdown.proximity}%</span>
                    </div>
                    <div className="text-[10px] text-slate-400 font-mono">
                      CPA: {activeVessel.cpaKm} km at {activeVessel.cpaTime}
                    </div>
                  </div>

                  {/* Speed Anomaly */}
                  <div className="bg-slate-950/70 p-2.5 rounded-lg border border-slate-800/80">
                    <div className="flex justify-between text-[11px] mb-1">
                      <span className="text-slate-400">2. Discharge Velocity Anomaly (25% Weight):</span>
                      <span className="font-mono text-amber-300">{activeVessel.probabilityBreakdown.speedAnomaly}%</span>
                    </div>
                    <div className="text-[10px] text-slate-400 font-mono">
                      Speed Profile: {activeVessel.speedKnots.join(' → ')} kts
                    </div>
                  </div>

                  {/* AIS Integrity */}
                  <div className="bg-slate-950/70 p-2.5 rounded-lg border border-slate-800/80">
                    <div className="flex justify-between text-[11px] mb-1">
                      <span className="text-slate-400">3. AIS Transponder Integrity (20% Weight):</span>
                      <span className="font-mono text-red-300">{activeVessel.probabilityBreakdown.aisIntegrity}%</span>
                    </div>
                    <div className="text-[10px] text-slate-400 font-mono">
                      Silent Gap: {activeVessel.darkAisGapMinutes || 0} Minutes near discharge apex
                    </div>
                  </div>

                  {/* Vessel Type Weight */}
                  <div className="bg-slate-950/70 p-2.5 rounded-lg border border-slate-800/80">
                    <div className="flex justify-between text-[11px] mb-1">
                      <span className="text-slate-400">4. Vessel Class Risk Factor (15% Weight):</span>
                      <span className="font-mono text-emerald-300">{activeVessel.probabilityBreakdown.vesselTypeFactor}%</span>
                    </div>
                    <div className="text-[10px] text-slate-400 font-mono">
                      Classification: {activeVessel.vesselType} (Draught: {activeVessel.draughtM}m)
                    </div>
                  </div>
                </div>
              </div>

              {/* Recommended USCG Action */}
              <div className="p-3 rounded-xl bg-red-950/30 border border-red-900/60 text-xs text-red-300 space-y-1">
                <div className="font-bold text-red-400 flex items-center space-x-1">
                  <ShieldAlert className="w-4 h-4" />
                  <span>Recommended Port State Control Action:</span>
                </div>
                <p className="text-[11px] text-slate-300 leading-relaxed">
                  Flag vessel for immediate USCG / PSC physical inspection upon arrival at <b>{activeVessel.destination || 'Next Port of Call'}</b>. 
                  Inspect Oil Record Book Part II, Oily Water Separator 15ppm logs, and bilge valve lock seals.
                </p>
              </div>

            </div>

            <button
              onClick={onGenerateReport}
              className="w-full mt-4 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs transition-colors shadow-lg shadow-cyan-500/20"
            >
              Generate Formal Legal Briefing for {activeVessel.name} →
            </button>
          </div>
        )}

      </div>

    </div>
  );
};
