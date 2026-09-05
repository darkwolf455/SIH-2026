import React from 'react';
import { 
  Cpu, 
  Satellite, 
  Wind, 
  Waves, 
  Ship, 
  Layers, 
  Database, 
  ShieldCheck, 
  CheckCircle2, 
  ArrowRight, 
  Compass, 
  Terminal, 
  BarChart3,
  ExternalLink,
  Code2
} from 'lucide-react';

interface ArchitectureViewProps {
  onOpenCode: () => void;
}

export const ArchitectureView: React.FC<ArchitectureViewProps> = ({ onOpenCode }) => {
  return (
    <div className="space-y-8 text-slate-100 max-w-7xl mx-auto pb-12">
      
      {/* Hero / Header Card */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-900 to-cyan-950/40 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-xl">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-cyan-950 text-cyan-400 border border-cyan-800 text-xs font-mono mb-3">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>MARPOL 73/78 & USCG Forensic ML Architecture</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
              End-to-End Automated Pipeline Blueprint
            </h1>
            <p className="text-sm text-slate-400 mt-2 max-w-3xl leading-relaxed">
              Autonomous satellite remote sensing (Sentinel-1 SAR), oceanographic Lagrangian drift modeling (OpenDrift), 
              and space-time Marine Cadastre AIS vessel traffic correlation to attribute illegal oil discharges at sea.
            </p>
          </div>
          <button
            onClick={onOpenCode}
            className="flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-semibold text-xs transition-colors shadow-lg shadow-cyan-500/20 whitespace-nowrap"
          >
            <Code2 className="w-4 h-4" />
            <span>Explore Python Pipeline Scripts →</span>
          </button>
        </div>
      </div>

      {/* System Architecture Flow Diagram */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl">
        <h3 className="text-lg font-bold text-slate-100 flex items-center space-x-2 mb-6">
          <Layers className="w-5 h-5 text-cyan-400" />
          <span>Automated Data Flow & Pipeline Stages</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 relative">
          
          {/* Stage 1 */}
          <div className="bg-slate-950 border border-cyan-900/60 hover:border-cyan-500/60 rounded-xl p-4 transition-all flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-[10px] font-mono font-bold text-cyan-400 px-2 py-0.5 rounded bg-cyan-950 border border-cyan-800">
                  STAGE 01
                </span>
                <Satellite className="w-5 h-5 text-cyan-400" />
              </div>
              <h4 className="font-bold text-sm text-slate-100 mb-1">SAR Ingestion & Segmentation</h4>
              <p className="text-xs text-slate-400 leading-relaxed mb-3">
                Sentinel-1 IW GRD C-band dual-pol (VV/VH) calibration, Refined Lee speckle filtering, and U-Net ResNet-34 segmentation with false-alarm rejection.
              </p>
            </div>
            <div className="text-[10px] font-mono text-cyan-400/90 pt-2 border-t border-slate-800">
              Output: Slick Geometry & Area ($km^2$)
            </div>
          </div>

          {/* Stage 2 */}
          <div className="bg-slate-950 border border-purple-900/60 hover:border-purple-500/60 rounded-xl p-4 transition-all flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-[10px] font-mono font-bold text-purple-400 px-2 py-0.5 rounded bg-purple-950 border border-purple-800">
                  STAGE 02
                </span>
                <Wind className="w-5 h-5 text-purple-400" />
              </div>
              <h4 className="font-bold text-sm text-slate-100 mb-1">Lagrangian Drift Hindcasting</h4>
              <p className="text-xs text-slate-400 leading-relaxed mb-3">
                Reverse time integration via OpenDrift with HYCOM/CMEMS surface currents, NOAA GFS wind stress, and Stokes wave drift back to origin window.
              </p>
            </div>
            <div className="text-[10px] font-mono text-purple-400/90 pt-2 border-t border-slate-800">
              Output: Space-Time Cylinder ($Lat, Lon, T_0 \pm \sigma$)
            </div>
          </div>

          {/* Stage 3 */}
          <div className="bg-slate-950 border border-red-900/60 hover:border-red-500/60 rounded-xl p-4 transition-all flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-[10px] font-mono font-bold text-red-400 px-2 py-0.5 rounded bg-red-950 border border-red-800">
                  STAGE 03
                </span>
                <Ship className="w-5 h-5 text-red-400" />
              </div>
              <h4 className="font-bold text-sm text-slate-100 mb-1">Marine Cadastre AIS Ingestion</h4>
              <p className="text-xs text-slate-400 leading-relaxed mb-3">
                DuckDB spatial R-Tree query over Marine Cadastre historical AIS records to extract vessel corridors within spatial-temporal search tolerance.
              </p>
            </div>
            <div className="text-[10px] font-mono text-red-400/90 pt-2 border-t border-slate-800">
              Output: Candidate Vessel Trajectories
            </div>
          </div>

          {/* Stage 4 */}
          <div className="bg-slate-950 border border-emerald-900/60 hover:border-emerald-500/60 rounded-xl p-4 transition-all flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-[10px] font-mono font-bold text-emerald-400 px-2 py-0.5 rounded bg-emerald-950 border border-emerald-800">
                  STAGE 04
                </span>
                <BarChart3 className="w-5 h-5 text-emerald-400" />
              </div>
              <h4 className="font-bold text-sm text-slate-100 mb-1">Attribution Scoring & Dossier</h4>
              <p className="text-xs text-slate-400 leading-relaxed mb-3">
                Multi-criteria scoring weighting CPA, speed anomalies, AIS blackout periods, and vessel class risk to produce court-admissible MARPOL evidence.
              </p>
            </div>
            <div className="text-[10px] font-mono text-emerald-400/90 pt-2 border-t border-slate-800">
              Output: Ranked Suspects & Legal Briefing
            </div>
          </div>

        </div>
      </div>

      {/* Recommended Tech Stack & Data Sources Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Recommended Open Source Tech Stack */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
          <div className="flex items-center space-x-2 text-slate-100 font-bold text-base">
            <Cpu className="w-5 h-5 text-cyan-400" />
            <span>Recommended Open-Source Python & Web Stack</span>
          </div>

          <div className="space-y-3 text-xs">
            <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
              <div className="font-semibold text-cyan-300 mb-1">1. SAR & Remote Sensing Processing</div>
              <p className="text-slate-400">
                <span className="font-mono text-slate-200">Rasterio</span> (GeoTIFF I/O), <span className="font-mono text-slate-200">PyTorch</span> + <span className="font-mono text-slate-200">segmentation-models-pytorch</span> (U-Net / DeepLabV3+), <span className="font-mono text-slate-200">Albumentations</span>, <span className="font-mono text-slate-200">OpenCV</span>.
              </p>
            </div>

            <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
              <div className="font-semibold text-purple-300 mb-1">2. Oceanographic & Trajectory Modeling</div>
              <p className="text-slate-400">
                <span className="font-mono text-slate-200">OpenDrift</span> (<code className="text-purple-400">opendrift.models.openoil</code> for oil weathering & Lagrangian back-tracking), <span className="font-mono text-slate-200">xarray</span> & <span className="font-mono text-slate-200">netCDF4</span>.
              </p>
            </div>

            <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
              <div className="font-semibold text-red-300 mb-1">3. AIS Massive Data Ingestion & Spatial Querying</div>
              <p className="text-slate-400">
                <span className="font-mono text-slate-200">DuckDB</span> (sub-second SQL execution across gigabytes of Parquet/CSV), <span className="font-mono text-slate-200">GeoPandas</span>, <span className="font-mono text-slate-200">Shapely</span>, <span className="font-mono text-slate-200">PyProj</span>.
              </p>
            </div>

            <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
              <div className="font-semibold text-emerald-300 mb-1">4. Backend Microservice & Frontend UI</div>
              <p className="text-slate-400">
                <span className="font-mono text-slate-200">FastAPI</span> + <span className="font-mono text-slate-200">Uvicorn</span> (asynchronous REST & WebSocket stream), <span className="font-mono text-slate-200">React 19</span> + <span className="font-mono text-slate-200">Tailwind CSS</span> + <span className="font-mono text-slate-200">Leaflet</span>.
              </p>
            </div>
          </div>
        </div>

        {/* Open-Source Satellite & MetOcean Data Sources */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
          <div className="flex items-center space-x-2 text-slate-100 font-bold text-base">
            <Database className="w-5 h-5 text-amber-400" />
            <span>Open Data Sources to Complement Marine Cadastre AIS</span>
          </div>

          <div className="space-y-3 text-xs">
            <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
              <div className="flex items-center justify-between font-semibold text-amber-300 mb-1">
                <span>🛰️ Sentinel-1 C-Band SAR (GRD & SLC)</span>
                <span className="text-[10px] text-slate-400 font-mono">Copernicus / ESA</span>
              </div>
              <p className="text-slate-400">
                Free open-access C-band SAR through <b>Copernicus Data Space Ecosystem</b> or <b>Alaska Satellite Facility (ASF DAAC)</b>. Provides all-weather day/night capillary damping detection.
              </p>
            </div>

            <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
              <div className="flex items-center justify-between font-semibold text-cyan-300 mb-1">
                <span>🌊 Ocean Surface Currents (CMEMS & HYCOM)</span>
                <span className="text-[10px] text-slate-400 font-mono">1/12° Resolution</span>
              </div>
              <p className="text-slate-400">
                <b>Copernicus Marine Environment Monitoring Service (CMEMS)</b> global physics analysis and <b>NOAA HYCOM</b> providing global U/V current vectors at 3-hour intervals in NetCDF.
              </p>
            </div>

            <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
              <div className="flex items-center justify-between font-semibold text-emerald-300 mb-1">
                <span>💨 High-Resolution Wind Fields (GFS / ERA5)</span>
                <span className="text-[10px] text-slate-400 font-mono">NOAA / ECMWF</span>
              </div>
              <p className="text-slate-400">
                <b>NOAA Global Forecast System (GFS) 0.25°</b> or <b>ECMWF ERA5 Reanalysis</b> 10-meter wind vectors (U10, V10) needed for the 3.0–3.5% surface windage drift component.
              </p>
            </div>

            <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
              <div className="flex items-center justify-between font-semibold text-red-300 mb-1">
                <span>🚢 US Marine Cadastre Historical AIS</span>
                <span className="text-[10px] text-slate-400 font-mono">BOEM / NOAA</span>
              </div>
              <p className="text-slate-400">
                Direct access from <a href="https://marinecadastre.gov/accessais/" target="_blank" rel="noreferrer" className="text-cyan-400 underline inline-flex items-center gap-0.5">marinecadastre.gov/accessais <ExternalLink className="w-3 h-3" /></a> containing 1-minute filtered national vessel telemetry in monthly Parquet/CSV.
              </p>
            </div>
          </div>
        </div>

      </div>

      {/* Physics & Scoring Formulations Card */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6">
        <h3 className="text-lg font-bold text-slate-100 flex items-center space-x-2">
          <Compass className="w-5 h-5 text-cyan-400" />
          <span>Core Formulations: Lagrangian Drift & Attribution Scoring Matrix</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
          
          {/* Drift Physics Formula */}
          <div className="bg-slate-950 p-5 rounded-xl border border-slate-800 space-y-3 font-mono">
            <div className="text-cyan-400 font-bold text-sm">
              Lagrangian Particle Drift Vector Equation:
            </div>
            <div className="p-3 bg-slate-900 rounded-lg text-cyan-300 text-center text-sm font-bold border border-slate-800">
              u_drift = u_current + α · R(θ) · u_wind + u_Stokes
            </div>
            <div className="text-slate-400 space-y-1 font-sans">
              <div>• <span className="font-mono text-cyan-300">u_current</span>: Ocean surface velocity (HYCOM/CMEMS 1/12° resolution).</div>
              <div>• <span className="font-mono text-cyan-300">α (alpha)</span>: Wind drift factor (approx. 0.030 - 0.035, or 3.2% windage).</div>
              <div>• <span className="font-mono text-cyan-300">R(θ)</span>: Coriolis deflection rotation (+15° to right of wind in Northern Hemisphere).</div>
              <div>• <span className="font-mono text-cyan-300">u_Stokes</span>: Wave Stokes drift (computed from wave height &amp; peak period).</div>
            </div>
          </div>

          {/* Attribution Score Formula */}
          <div className="bg-slate-950 p-5 rounded-xl border border-slate-800 space-y-3 font-mono">
            <div className="text-red-400 font-bold text-sm">
              Multi-Factor Suspect Attribution Scoring (S_total):
            </div>
            <div className="p-3 bg-slate-900 rounded-lg text-red-300 text-center text-sm font-bold border border-slate-800">
              S = 0.40·S_dist + 0.25·S_speed + 0.20·S_AIS_gap + 0.15·S_type
            </div>
            <div className="text-slate-400 space-y-1 font-sans">
              <div>• <span className="font-mono text-red-300">S_dist (40%)</span>: Exponential Gaussian decay exp(-0.5·(CPA/σ)²) relative to hindcast uncertainty σ.</div>
              <div>• <span className="font-mono text-red-300">S_speed (25%)</span>: Discharge velocity anomaly (deceleration to 3-6 knots or tank wash maneuver).</div>
              <div>• <span className="font-mono text-red-300">S_AIS_gap (20%)</span>: Transponder blackout score (disabling AIS transmitter near release window).</div>
              <div>• <span className="font-mono text-red-300">S_type (15%)</span>: Vessel risk weighting (Tanker = 1.0, Cargo = 0.7, Tug = 0.4, Fishing = 0.25).</div>
            </div>
          </div>

        </div>
      </div>

    </div>
  );
};
