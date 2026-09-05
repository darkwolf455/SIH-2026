import React, { useState } from 'react';
import { SCENARIOS } from './data/scenarios';
import { Scenario, VesselTrack } from './types';
import { Navbar } from './components/Navbar';
import { MapDashboard } from './components/MapDashboard';
import { TelemetryStats } from './components/TelemetryStats';
import { ArchitectureView } from './components/ArchitectureView';
import { VesselAttributionMatrix } from './components/VesselAttributionMatrix';
import { CodeStudio } from './components/CodeStudio';
import { ForensicReportModal } from './components/ForensicReportModal';
import { AiAnalystDrawer } from './components/AiAnalystDrawer';
import { 
  Satellite, 
  Wind, 
  Waves, 
  Ship, 
  ShieldAlert, 
  Compass, 
  Code2, 
  FileText,
  AlertTriangle,
  Info,
  ExternalLink
} from 'lucide-react';

export default function App() {
  const [scenarios] = useState<Scenario[]>(SCENARIOS);
  const [currentScenario, setCurrentScenario] = useState<Scenario>(SCENARIOS[0]);
  const [selectedVessel, setSelectedVessel] = useState<VesselTrack | null>(null);
  
  const [activeTab, setActiveTab] = useState<'map' | 'architecture' | 'module1' | 'module2' | 'module3' | 'code' | 'attribution'>('map');
  const [isReportModalOpen, setIsReportModalOpen] = useState<boolean>(false);
  const [isAiDrawerOpen, setIsAiDrawerOpen] = useState<boolean>(false);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans antialiased flex flex-col selection:bg-cyan-500 selection:text-slate-950">
      
      {/* Top Navigation */}
      <Navbar
        scenarios={scenarios}
        currentScenario={currentScenario}
        onSelectScenario={(s) => {
          setCurrentScenario(s);
          setSelectedVessel(null);
        }}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenReport={() => setIsReportModalOpen(true)}
        onToggleAiAnalyst={() => setIsAiDrawerOpen(!isAiDrawerOpen)}
        isAiDrawerOpen={isAiDrawerOpen}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        
        {/* Telemetry Stats Bar */}
        <TelemetryStats
          scenario={currentScenario}
          onViewAttribution={() => setActiveTab('attribution')}
        />

        {/* Tab 1: Interactive Geospatial Map View */}
        {activeTab === 'map' && (
          <div className="space-y-6">
            <MapDashboard
              scenario={currentScenario}
              selectedVessel={selectedVessel}
              onSelectVessel={(v) => setSelectedVessel(v)}
              onViewAttribution={() => setActiveTab('attribution')}
            />

            {/* Bottom Geospatial & Sensor Metadata Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              
              {/* Sensor & SAR Inversion Specs */}
              <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-lg space-y-3">
                <div className="flex items-center space-x-2 text-cyan-400 font-bold text-xs uppercase tracking-wider font-mono">
                  <Satellite className="w-4 h-4" />
                  <span>Sentinel-1 SAR Acquisition Profile</span>
                </div>
                <div className="space-y-2 text-xs">
                  <div className="flex justify-between py-1 border-b border-slate-800">
                    <span className="text-slate-400">Sensor / Constellation:</span>
                    <span className="font-mono text-slate-200">{currentScenario.sarSensor.satellite}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-800">
                    <span className="text-slate-400">Acquisition Mode:</span>
                    <span className="font-mono text-slate-200">{currentScenario.sarSensor.mode}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-800">
                    <span className="text-slate-400">Polarization Scheme:</span>
                    <span className="font-mono text-cyan-300">{currentScenario.sarSensor.polarization}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-800">
                    <span className="text-slate-400">Incidence Angle:</span>
                    <span className="font-mono text-slate-200">{currentScenario.sarSensor.incidenceAngle}</span>
                  </div>
                  <div className="flex justify-between py-1">
                    <span className="text-slate-400">Orbit Pass:</span>
                    <span className="font-mono text-slate-200">{currentScenario.sarSensor.passDirection}</span>
                  </div>
                </div>
              </div>

              {/* MetOcean & Drift Drag Parameters */}
              <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-lg space-y-3">
                <div className="flex items-center space-x-2 text-purple-400 font-bold text-xs uppercase tracking-wider font-mono">
                  <Wind className="w-4 h-4" />
                  <span>Ocean Current & Wind Stress (MetOcean)</span>
                </div>
                <div className="space-y-2 text-xs">
                  <div className="flex justify-between py-1 border-b border-slate-800">
                    <span className="text-slate-400">HYCOM Surface Current:</span>
                    <span className="font-mono text-slate-200">
                      {currentScenario.metOcean.currentSpeedMps} m/s @ {currentScenario.metOcean.currentDirDeg}°
                    </span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-800">
                    <span className="text-slate-400">GFS 10m Wind Velocity:</span>
                    <span className="font-mono text-slate-200">
                      {currentScenario.metOcean.windSpeedMps} m/s @ {currentScenario.metOcean.windDirDeg}°
                    </span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-800">
                    <span className="text-slate-400">Wave Stokes Drift:</span>
                    <span className="font-mono text-slate-200">{currentScenario.metOcean.stokesDriftMps} m/s</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-800">
                    <span className="text-slate-400">Sea Surface Temperature:</span>
                    <span className="font-mono text-slate-200">{currentScenario.metOcean.seaSurfaceTempC} °C</span>
                  </div>
                  <div className="flex justify-between py-1">
                    <span className="text-slate-400">Windage Factor (\alpha):</span>
                    <span className="font-mono text-purple-300">0.032 (3.2%)</span>
                  </div>
                </div>
              </div>

              {/* Quick Suspect Card */}
              <div className="bg-slate-900 border border-red-900/60 rounded-xl p-5 shadow-lg space-y-3 flex flex-col justify-between">
                <div>
                  <div className="flex items-center space-x-2 text-red-400 font-bold text-xs uppercase tracking-wider font-mono">
                    <ShieldAlert className="w-4 h-4" />
                    <span>Top Attributed Suspect</span>
                  </div>
                  <div className="mt-3">
                    <h4 className="font-bold text-sm text-slate-100">{currentScenario.vessels[0]?.name}</h4>
                    <div className="text-xs text-slate-400 font-mono">
                      IMO: {currentScenario.vessels[0]?.imo} | Flag: {currentScenario.vessels[0]?.flag}
                    </div>
                  </div>
                  <div className="mt-3 p-2.5 rounded-lg bg-slate-950 border border-slate-800 text-xs text-slate-300 space-y-1 font-mono">
                    <div className="flex justify-between">
                      <span className="text-slate-400">Attribution Score:</span>
                      <span className="text-red-400 font-bold">{currentScenario.vessels[0]?.score}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">CPA to Origin:</span>
                      <span className="text-slate-200">{currentScenario.vessels[0]?.cpaKm} km</span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => setActiveTab('attribution')}
                  className="w-full py-2 rounded-lg bg-red-600 hover:bg-red-500 text-white font-bold text-xs transition-colors shadow-md shadow-red-600/20"
                >
                  View All {currentScenario.vessels.length} Candidate Vessels →
                </button>
              </div>

            </div>
          </div>
        )}

        {/* Tab 2: Attribution Matrix */}
        {activeTab === 'attribution' && (
          <VesselAttributionMatrix
            scenario={currentScenario}
            selectedVessel={selectedVessel}
            onSelectVessel={(v) => setSelectedVessel(v)}
            onGenerateReport={() => setIsReportModalOpen(true)}
          />
        )}

        {/* Tab 3: System Architecture & Physics Blueprint */}
        {activeTab === 'architecture' && (
          <ArchitectureView onOpenCode={() => setActiveTab('code')} />
        )}

        {/* Tab 4: Python Code Studio & Pipeline Scripts */}
        {activeTab === 'code' && <CodeStudio />}

      </main>

      {/* Official Forensic Report Modal */}
      <ForensicReportModal
        isOpen={isReportModalOpen}
        onClose={() => setIsReportModalOpen(false)}
        scenario={currentScenario}
      />

      {/* AI Incident Analyst Drawer */}
      <AiAnalystDrawer
        isOpen={isAiDrawerOpen}
        onClose={() => setIsAiDrawerOpen(false)}
        scenario={currentScenario}
      />

      {/* Footer */}
      <footer className="border-t border-slate-800/80 bg-slate-950/80 py-6 text-center text-xs text-slate-500 font-mono">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <div>
            AegisSlick ML Engine • Dual-Pol Sentinel-1 SAR & OpenDrift & US Marine Cadastre AIS
          </div>
          <div className="flex items-center space-x-3 text-slate-400">
            <a href="https://marinecadastre.gov/accessais/" target="_blank" rel="noreferrer" className="hover:text-cyan-400 flex items-center gap-1">
              <span>Marine Cadastre</span> <ExternalLink className="w-3 h-3" />
            </a>
            <span>•</span>
            <span>MARPOL Annex I Forensic Compliance</span>
          </div>
        </div>
      </footer>

    </div>
  );
}
