import React, { useState } from 'react';
import { 
  Code2, 
  Copy, 
  Check, 
  Download, 
  Terminal, 
  FileCode, 
  Play, 
  Layers, 
  ExternalLink,
  Cpu,
  Sparkles
} from 'lucide-react';
import { PYTHON_SNIPPETS } from '../data/pythonSnippets';
import { PythonModuleCode } from '../types';

export const CodeStudio: React.FC = () => {
  const [selectedSnippet, setSelectedSnippet] = useState<PythonModuleCode>(PYTHON_SNIPPETS[0]);
  const [copied, setCopied] = useState<boolean>(false);
  const [executionOutput, setExecutionOutput] = useState<string | null>(null);
  const [isExecuting, setIsExecuting] = useState<boolean>(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(selectedSnippet.code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const blob = new Blob([selectedSnippet.code], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = selectedSnippet.filename;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleRunSimulation = () => {
    setIsExecuting(true);
    setExecutionOutput(null);

    setTimeout(() => {
      setIsExecuting(false);
      if (selectedSnippet.id === 'sar-detection') {
        setExecutionOutput(`[+] Initializing Sentinel-1 SAR Dual-Pol Inversion...
[+] Loaded VV & VH Bands (GeoTIFF) -> Computing Calibrated Sigma0 (dB)
[+] Applied 5x5 Refined Lee Filter -> Multiplicative Speckle Variance Damping: 0.18
[+] Input Tensor shape: (1, 3, 512, 512) -> Forward Pass through U-Net ResNet-34
[+] Sigmoid Activation Threshold (0.50) -> Detected 1 candidate oil slick
    - Area: 15.42 km² (154,200 pixels @ 10m GSD)
    - Damping Index: 9.8 dB relative to background ocean
    - Perimeter / Area Compactness Index: 3.42 (Natural Elongated S-Shape)
[+] Morphological False Alarm Check: PASS (Wind speed 6.8 m/s within valid 3-12 m/s window)
[✓] Status: HIGH-CONFIDENCE HYDROCARBON SLICK SEGMENTED`);
      } else if (selectedSnippet.id === 'opendrift-hindcasting') {
        setExecutionOutput(`[+] Initializing OpenDrift (OpenOil) Reverse Lagrangian Simulation...
[+] Ingested HYCOM 1/12° Ocean Surface Velocity: (u=0.35 m/s, v=-0.28 m/s)
[+] Ingested NOAA GFS 10m Wind Stress: (u=6.2 m/s, v=1.8 m/s)
[+] Wind Drift Factor: 3.2% | Coriolis Deflection: +15° (Right of Wind)
[+] Seeded 1,500 particles at Slick Center (28.3800°N, -89.2400°W)
[+] Running Backward Simulation: Time Step = -900s, Lookback = 14.0 Hours
    - T-00h: (28.3800°N, -89.2400°W) | 1,500 active particles
    - T-05h: (28.4350°N, -89.2880°W) | 1,500 active particles
    - T-10h: (28.4850°N, -89.3400°W) | 1,500 active particles
    - T-14h: (28.5240°N, -89.3820°W) | Origin Convergence Point
[✓] Estimated Spill Origin: 28.5240°N, -89.3820°W at T-14.2 Hours (95% CI Radius: ±1.84 km)`);
      } else if (selectedSnippet.id === 'marine-cadastre-attribution') {
        setExecutionOutput(`[+] Ingesting US Marine Cadastre AIS Parquet Dataset via DuckDB...
[+] Applied Spatial Bounding Box: [LON: -89.65 -> -89.10, LAT: 28.30 -> 28.75]
[+] Temporal Window: [2024-05-17 09:00:00 -> 2024-05-17 21:00:00 UTC]
[+] Evaluated 42 vessel trajectories inside space-time corridor
[+] Top Attribution Result:
    - Vessel Name: MT Ocean Valour (MMSI: 354891000, IMO: 9482103)
    - Closest Point of Approach (CPA): 0.28 km (Within 95% Confidence Radius)
    - CPA Time Offset: +8 minutes from estimated Lagrangian origin apex
    - Speed Anomaly: Decelerated from 14.4 kts to 4.1 kts for 45 minutes
    - Transponder Blackout: 18-minute AIS silence detected during discharge window
    - Composite Forensic Attribution Score: 96.4% (CRITICAL SUSPECT)
[✓] Generated Marine Cadastre Evidence Track`);
      } else {
        setExecutionOutput(`[+] FastAPI AegisSlick Production Service Initialized.
[+] Mounting PyTorch U-Net Inference Engine & OpenDrift Readers...
[+] Connected to DuckDB In-Memory Parquet Engine.
[✓] Service listening at http://0.0.0.0:8000 (Ready for automated webhooks & satellite triggers)`);
      }
    }, 1200);
  };

  return (
    <div className="space-y-6 text-slate-100 max-w-7xl mx-auto pb-12">
      
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl gap-4">
        <div>
          <div className="flex items-center space-x-2 text-xs font-mono text-emerald-400 mb-1">
            <Terminal className="w-4 h-4" />
            <span>FOUNDATIONAL PYTHON CODEBASE & SATELLITE PIPELINE SCRIPTS</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-white">
            Lead ML Engineer Python Implementation Blueprint
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Production-ready scripts for Sentinel-1 SAR U-Net detection, OpenDrift reverse drift hindcasting, and Marine Cadastre DuckDB AIS spatial correlation.
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={handleDownload}
            className="flex items-center space-x-1.5 px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-semibold transition-colors"
          >
            <Download className="w-4 h-4 text-cyan-400" />
            <span>Download Script ({selectedSnippet.filename})</span>
          </button>
        </div>
      </div>

      {/* Code Editor Container */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        
        {/* Left Snippet Navigation Sidebar */}
        <div className="lg:col-span-1 space-y-2">
          <div className="text-xs font-mono text-slate-400 uppercase px-1 mb-2 font-semibold">
            Pipeline Modules:
          </div>

          {PYTHON_SNIPPETS.map((snippet) => {
            const isSelected = selectedSnippet.id === snippet.id;

            return (
              <button
                key={snippet.id}
                onClick={() => {
                  setSelectedSnippet(snippet);
                  setExecutionOutput(null);
                }}
                className={`w-full text-left p-3 rounded-xl border transition-all ${
                  isSelected
                    ? 'bg-slate-800 border-cyan-500 shadow-md shadow-cyan-500/10'
                    : 'bg-slate-900/80 border-slate-800 hover:border-slate-700 hover:bg-slate-850'
                }`}
              >
                <div className="flex items-center space-x-2 mb-1">
                  <FileCode className={`w-4 h-4 ${isSelected ? 'text-cyan-400' : 'text-slate-400'}`} />
                  <span className="font-mono text-xs font-semibold text-slate-200 truncate">
                    {snippet.filename}
                  </span>
                </div>
                <div className="text-[11px] text-slate-400 line-clamp-2">
                  {snippet.title}
                </div>
              </button>
            );
          })}

          <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800 text-xs text-slate-400 mt-4 space-y-2">
            <div className="font-semibold text-slate-300 flex items-center space-x-1.5">
              <Cpu className="w-3.5 h-3.5 text-cyan-400" />
              <span>Recommended Hardware:</span>
            </div>
            <p className="text-[11px] leading-relaxed">
              • NVIDIA RTX 3080/4090 or A100 GPU for Sentinel-1 U-Net SAR inference.<br/>
              • 32GB RAM & NVMe SSD for fast DuckDB AIS Parquet partitions.
            </p>
          </div>
        </div>

        {/* Right Code View & Interactive Sandbox */}
        <div className="lg:col-span-3 space-y-4">
          
          {/* Code Header Bar */}
          <div className="bg-slate-900 border border-slate-800 rounded-t-2xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div>
              <div className="font-bold text-sm text-slate-100 flex items-center space-x-2">
                <span className="font-mono text-cyan-400">{selectedSnippet.filename}</span>
                <span className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-slate-400 border border-slate-700">
                  {selectedSnippet.module}
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-1 max-w-2xl">
                {selectedSnippet.description}
              </p>
            </div>

            <div className="flex items-center space-x-2">
              <button
                onClick={handleRunSimulation}
                disabled={isExecuting}
                className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-bold text-xs transition-colors shadow-sm disabled:opacity-50"
              >
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>{isExecuting ? 'Simulating...' : 'Run Dry-Run'}</span>
              </button>

              <button
                onClick={handleCopy}
                className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs transition-colors"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-slate-400" />}
                <span>{copied ? 'Copied' : 'Copy'}</span>
              </button>
            </div>
          </div>

          {/* Interactive Simulation Output Terminal */}
          {executionOutput && (
            <div className="bg-slate-950 border border-emerald-900/80 rounded-xl p-4 font-mono text-xs text-emerald-400 shadow-inner overflow-x-auto space-y-1">
              <div className="flex items-center justify-between pb-2 border-b border-emerald-950 text-emerald-300 font-bold">
                <span>TERMINAL EXECUTION LOG: {selectedSnippet.filename}</span>
                <span className="text-[10px] bg-emerald-950 px-2 py-0.5 rounded border border-emerald-800">EXECUTION OK</span>
              </div>
              <pre className="whitespace-pre-wrap leading-relaxed">{executionOutput}</pre>
            </div>
          )}

          {/* Code Viewer */}
          <div className="bg-slate-950 border border-slate-800 rounded-b-2xl p-4 overflow-x-auto font-mono text-xs text-slate-200 leading-relaxed max-h-[580px] scrollbar-thin">
            <pre>
              <code>{selectedSnippet.code}</code>
            </pre>
          </div>

        </div>

      </div>

    </div>
  );
};
