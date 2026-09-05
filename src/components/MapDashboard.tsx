import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import { 
  Play, 
  Pause, 
  RotateCcw, 
  Layers, 
  Eye, 
  EyeOff, 
  Wind, 
  Waves, 
  Satellite, 
  Ship, 
  Clock, 
  AlertCircle,
  Activity,
  Maximize2,
  Info
} from 'lucide-react';
import { Scenario, VesselTrack, DriftStep } from '../types';

interface MapDashboardProps {
  scenario: Scenario;
  selectedVessel: VesselTrack | null;
  onSelectVessel: (vessel: VesselTrack | null) => void;
  onViewAttribution: () => void;
}

export const MapDashboard: React.FC<MapDashboardProps> = ({
  scenario,
  selectedVessel,
  onSelectVessel,
  onViewAttribution,
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const layersGroupRef = useRef<{ [key: string]: L.LayerGroup }>({});

  // Layer Visibility State
  const [showSarSlick, setShowSarSlick] = useState<boolean>(true);
  const [showMetocean, setShowMetocean] = useState<boolean>(true);
  const [showDriftParticles, setShowDriftParticles] = useState<boolean>(true);
  const [showAisTracks, setShowAisTracks] = useState<boolean>(true);
  const [showUncertaintyRadius, setShowUncertaintyRadius] = useState<boolean>(true);

  // Time Scrubbing State
  const [activeStepIndex, setActiveStepIndex] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);

  // Initialize and update Leaflet Map
  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (!mapInstanceRef.current) {
      const map = L.map(mapContainerRef.current, {
        center: [scenario.centerLat, scenario.centerLng],
        zoom: scenario.zoom,
        zoomControl: false,
        attributionControl: false,
      });

      // Dark Matter Base Map
      L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
        maxZoom: 19,
        subdomains: 'abcd',
      }).addTo(map);

      L.control.zoom({ position: 'bottomright' }).addTo(map);

      mapInstanceRef.current = map;
    } else {
      mapInstanceRef.current.setView([scenario.centerLat, scenario.centerLng], scenario.zoom);
    }

    const map = mapInstanceRef.current;

    // Clear old layers
    Object.values(layersGroupRef.current).forEach((lg: L.LayerGroup) => {
      if (lg && typeof lg.clearLayers === 'function') {
        lg.clearLayers();
      }
    });

    // Create / reset layer groups
    const sarGroup = L.layerGroup().addTo(map);
    const metoceanGroup = L.layerGroup().addTo(map);
    const driftGroup = L.layerGroup().addTo(map);
    const aisGroup = L.layerGroup().addTo(map);
    const uncertaintyGroup = L.layerGroup().addTo(map);

    layersGroupRef.current = {
      sar: sarGroup,
      metocean: metoceanGroup,
      drift: driftGroup,
      ais: aisGroup,
      uncertainty: uncertaintyGroup,
    };

    // 1. Render SAR Oil Slick Polygon
    if (showSarSlick) {
      const slickPolygon = L.polygon(scenario.slickPolygon, {
        color: '#06b6d4', // Cyan outline
        weight: 2,
        fillColor: '#083344', // Dark oil sheen fill
        fillOpacity: 0.75,
        dashArray: '4, 4',
      });

      slickPolygon.bindPopup(`
        <div style="font-family: monospace; color: #0f172a; padding: 4px;">
          <h4 style="font-weight: bold; margin-bottom: 4px; color: #0891b2;">🛰️ SENTINEL-1 SAR SLICK</h4>
          <div><b>Area:</b> ${scenario.slickMetrics.areaKm2} km²</div>
          <div><b>Est. Volume:</b> ${scenario.slickMetrics.estimatedVolumeBbl} Barrels</div>
          <div><b>Radar Damping:</b> ${scenario.slickMetrics.dampingDb} dB</div>
          <div><b>Confidence:</b> ${scenario.slickMetrics.confidenceScore}%</div>
          <div><b>State:</b> ${scenario.slickMetrics.weatheringState}</div>
        </div>
      `);
      sarGroup.addLayer(slickPolygon);

      // Spill Release Origin Marker
      const originIcon = L.divIcon({
        className: 'custom-origin-pin',
        html: `<div style="background-color: #ef4444; width: 14px; height: 14px; border-radius: 50%; border: 2px solid #ffffff; box-shadow: 0 0 10px #ef4444;" title="Spill Origin (T-14h)"></div>`,
        iconSize: [14, 14],
        iconAnchor: [7, 7],
      });

      const originMarker = L.marker(scenario.slickOriginPoint, { icon: originIcon });
      originMarker.bindPopup(`
        <div style="font-family: monospace; color: #0f172a; padding: 4px;">
          <h4 style="font-weight: bold; color: #dc2626;">🎯 ESTIMATED RELEASE APEX</h4>
          <div><b>Lat/Lon:</b> ${scenario.slickOriginPoint[0].toFixed(4)}, ${scenario.slickOriginPoint[1].toFixed(4)}</div>
          <div><b>Release Window:</b> ${scenario.driftSteps[0]?.formattedTime}</div>
          <div><b>Status:</b> Lagrangian Hindcast Convergence Center</div>
        </div>
      `);
      sarGroup.addLayer(originMarker);
    }

    // 2. Render MetOcean Vector Glyphs (Currents & Winds)
    if (showMetocean) {
      const { currentDirDeg, currentSpeedMps, windDirDeg, windSpeedMps } = scenario.metOcean;

      // Current Flow Vector Arrow
      const currLength = 0.04;
      const currRad = (currentDirDeg * Math.PI) / 180;
      const currEndLat = scenario.centerLat + currLength * Math.cos(currRad);
      const currEndLng = scenario.centerLng + currLength * Math.sin(currRad);

      const currentLine = L.polyline(
        [
          [scenario.centerLat - 0.02, scenario.centerLng + 0.05],
          [scenario.centerLat - 0.02 + currLength * Math.cos(currRad), scenario.centerLng + 0.05 + currLength * Math.sin(currRad)],
        ],
        { color: '#38bdf8', weight: 3 }
      );
      currentLine.bindTooltip(`Surface Ocean Current: ${currentSpeedMps} m/s @ ${currentDirDeg}°`, { sticky: true });
      metoceanGroup.addLayer(currentLine);

      // Wind Vector Arrow
      const windRad = ((windDirDeg + 180) * Math.PI) / 180; // Wind blows TO opposite
      const windLength = 0.05;
      const windLine = L.polyline(
        [
          [scenario.centerLat + 0.03, scenario.centerLng - 0.04],
          [scenario.centerLat + 0.03 + windLength * Math.cos(windRad), scenario.centerLng - 0.04 + windLength * Math.sin(windRad)],
        ],
        { color: '#fbbf24', weight: 3, dashArray: '5, 5' }
      );
      windLine.bindTooltip(`Surface Wind Stress: ${windSpeedMps} m/s @ ${windDirDeg}°`, { sticky: true });
      metoceanGroup.addLayer(windLine);
    }

    // 3. Render Drift Steps / Hindcast Particles
    if (showDriftParticles && scenario.driftSteps.length > 0) {
      const currentStep = scenario.driftSteps[activeStepIndex] || scenario.driftSteps[0];

      // Connect hindcast center trajectory line
      const stepCenters: [number, number][] = scenario.driftSteps.map((s) => [s.centerLat, s.centerLng]);
      const trajectoryLine = L.polyline(stepCenters, {
        color: '#a855f7',
        weight: 2,
        dashArray: '3, 6',
      });
      driftGroup.addLayer(trajectoryLine);

      // Active step particle cloud
      currentStep.particles.forEach((p) => {
        const particleDot = L.circleMarker([p.lat, p.lng], {
          radius: 4,
          color: currentStep.timeOffsetHours < 0 ? '#06b6d4' : '#c084fc',
          fillColor: currentStep.timeOffsetHours < 0 ? '#22d3ee' : '#e879f9',
          fillOpacity: p.weight,
          weight: 1,
        });
        driftGroup.addLayer(particleDot);
      });

      // Uncertainty Circle for active step
      if (showUncertaintyRadius && currentStep.uncertaintyRadiusKm) {
        const uncertaintyCircle = L.circle([currentStep.centerLat, currentStep.centerLng], {
          radius: currentStep.uncertaintyRadiusKm * 1000,
          color: '#f59e0b',
          weight: 1,
          dashArray: '4, 4',
          fillColor: '#f59e0b',
          fillOpacity: 0.1,
        });
        uncertaintyCircle.bindTooltip(`95% Confidence Radius: ±${currentStep.uncertaintyRadiusKm} km`);
        uncertaintyGroup.addLayer(uncertaintyCircle);
      }
    }

    // 4. Render AIS Vessel Tracks
    if (showAisTracks) {
      scenario.vessels.forEach((v) => {
        const isSuspect = v.score > 75;
        const isSelected = selectedVessel?.mmsi === v.mmsi;
        const trackColor = isSuspect ? '#ef4444' : isSelected ? '#38bdf8' : '#64748b';

        // Polyline Track
        const polyline = L.polyline(v.coords, {
          color: trackColor,
          weight: isSuspect || isSelected ? 3.5 : 2,
          opacity: isSuspect ? 0.95 : 0.7,
        });

        polyline.on('click', () => {
          onSelectVessel(v);
        });

        polyline.bindTooltip(`
          <div style="font-family: monospace; font-size: 11px;">
            <b>${v.name}</b> (${v.vesselType})<br/>
            Score: <span style="color: ${isSuspect ? '#ef4444' : '#22c55e'}; font-weight: bold;">${v.score}%</span> | CPA: ${v.cpaKm} km
          </div>
        `);
        aisGroup.addLayer(polyline);

        // Vessel Head Marker
        const headCoord = v.coords[v.coords.length - 1];
        const vesselIcon = L.divIcon({
          className: 'vessel-head-pin',
          html: `<div style="background-color: ${trackColor}; width: 10px; height: 10px; border-radius: 2px; border: 1.5px solid #ffffff; transform: rotate(45deg); box-shadow: 0 0 6px ${trackColor};"></div>`,
          iconSize: [10, 10],
          iconAnchor: [5, 5],
        });

        const headMarker = L.marker(headCoord, { icon: vesselIcon });
        headMarker.on('click', () => onSelectVessel(v));
        aisGroup.addLayer(headMarker);

        // Suspect Discharge Apex / AIS Gap Warning Pin
        if (v.darkAisGapMinutes && v.darkAisGapMinutes > 0) {
          const gapPing = v.pings.find((p) => p.isGap) || v.pings[Math.floor(v.pings.length / 2)];
          if (gapPing) {
            const gapIcon = L.divIcon({
              className: 'ais-gap-warning',
              html: `<div style="background: #dc2626; color: #fff; font-size: 10px; font-weight: bold; border-radius: 4px; padding: 2px 4px; border: 1px solid #fee2e2; display: flex; align-items: center; gap: 2px; box-shadow: 0 0 8px rgba(220,38,38,0.6);">
                ⚠️ ${v.darkAisGapMinutes}m AIS Gap
              </div>`,
              iconSize: [90, 20],
              iconAnchor: [45, 10],
            });

            const gapMarker = L.marker([gapPing.lat, gapPing.lng], { icon: gapIcon });
            gapMarker.bindPopup(`
              <div style="font-family: monospace; color: #0f172a; padding: 4px;">
                <h4 style="color: #dc2626; font-weight: bold;">⚠️ ANOMALOUS AIS TRANSPONDER BLACKOUT</h4>
                <div><b>Vessel:</b> ${v.name} (IMO ${v.imo})</div>
                <div><b>Gap Duration:</b> ${v.darkAisGapMinutes} Minutes</div>
                <div><b>Speed at Event:</b> ${gapPing.sog} kts (Decelerated)</div>
                <div><b>Corridor Offset:</b> Directly intersects hindcast release point</div>
              </div>
            `);
            aisGroup.addLayer(gapMarker);
          }
        }
      });
    }
  }, [
    scenario,
    showSarSlick,
    showMetocean,
    showDriftParticles,
    showAisTracks,
    showUncertaintyRadius,
    activeStepIndex,
    selectedVessel,
  ]);

  // Auto-play Hindcast / Forecast Timeline
  useEffect(() => {
    let interval: any = null;
    if (isPlaying) {
      interval = setInterval(() => {
        setActiveStepIndex((prev) => {
          if (prev >= scenario.driftSteps.length - 1) {
            setIsPlaying(false);
            return prev;
          }
          return prev + 1;
        });
      }, 1800);
    }
    return () => clearInterval(interval);
  }, [isPlaying, scenario.driftSteps.length]);

  return (
    <div className="relative w-full h-[650px] lg:h-[720px] rounded-xl overflow-hidden border border-slate-800 bg-slate-950 shadow-2xl flex flex-col">
      
      {/* Top Map Floating Control Bar */}
      <div className="absolute top-4 left-4 right-4 z-20 flex flex-wrap items-center justify-between gap-2 pointer-events-none">
        
        {/* Layer Toggles Pill */}
        <div className="bg-slate-900/90 backdrop-blur-md border border-slate-700/80 rounded-xl p-1.5 shadow-xl flex items-center space-x-1 pointer-events-auto text-xs">
          <span className="px-2 font-mono text-[10px] text-slate-400 uppercase tracking-wider">Layers:</span>
          
          <button
            id="toggle-sar-slick"
            onClick={() => setShowSarSlick(!showSarSlick)}
            className={`px-2.5 py-1 rounded-lg flex items-center space-x-1.5 transition-colors ${
              showSarSlick ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40' : 'text-slate-400 hover:text-slate-200'
            }`}
            title="Toggle SAR Satellite Oil Slick Detection"
          >
            <Satellite className="w-3.5 h-3.5 text-cyan-400" />
            <span>SAR Slick</span>
          </button>

          <button
            id="toggle-drift-particles"
            onClick={() => setShowDriftParticles(!showDriftParticles)}
            className={`px-2.5 py-1 rounded-lg flex items-center space-x-1.5 transition-colors ${
              showDriftParticles ? 'bg-purple-500/20 text-purple-300 border border-purple-500/40' : 'text-slate-400 hover:text-slate-200'
            }`}
            title="Toggle OpenDrift Lagrangian Particles"
          >
            <Activity className="w-3.5 h-3.5 text-purple-400" />
            <span>Lagrangian Drift</span>
          </button>

          <button
            id="toggle-ais-tracks"
            onClick={() => setShowAisTracks(!showAisTracks)}
            className={`px-2.5 py-1 rounded-lg flex items-center space-x-1.5 transition-colors ${
              showAisTracks ? 'bg-red-500/20 text-red-300 border border-red-500/40' : 'text-slate-400 hover:text-slate-200'
            }`}
            title="Toggle Marine Cadastre AIS Tracks"
          >
            <Ship className="w-3.5 h-3.5 text-red-400" />
            <span>AIS Traffic</span>
          </button>

          <button
            id="toggle-metocean-vectors"
            onClick={() => setShowMetocean(!showMetocean)}
            className={`px-2.5 py-1 rounded-lg flex items-center space-x-1.5 transition-colors ${
              showMetocean ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40' : 'text-slate-400 hover:text-slate-200'
            }`}
            title="Toggle Current & Wind Vectors"
          >
            <Wind className="w-3.5 h-3.5 text-amber-400" />
            <span>MetOcean</span>
          </button>
        </div>

        {/* Primary Suspect Quick Badge */}
        {scenario.vessels.length > 0 && (
          <div 
            onClick={onViewAttribution}
            className="bg-slate-900/90 backdrop-blur-md border border-red-500/40 hover:border-red-400 rounded-xl px-3.5 py-1.5 shadow-xl flex items-center space-x-2.5 pointer-events-auto cursor-pointer transition-all hover:scale-[1.02]"
          >
            <div className="w-2.5 h-2.5 rounded-full bg-red-500 animate-ping" />
            <div>
              <div className="text-[10px] text-red-400 uppercase font-mono font-semibold">
                🚨 Primary Suspect Vessel ({scenario.vessels[0].score}%)
              </div>
              <div className="text-xs font-bold text-slate-100 flex items-center space-x-1.5">
                <span>{scenario.vessels[0].name}</span>
                <span className="text-[10px] text-slate-400 font-normal">({scenario.vessels[0].vesselType})</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Main Leaflet Map View */}
      <div ref={mapContainerRef} className="w-full flex-1 z-0" />

      {/* Floating Selected Vessel Info Card */}
      {selectedVessel && (
        <div className="absolute top-20 right-4 z-20 w-80 bg-slate-900/95 backdrop-blur-md border border-slate-700 rounded-xl p-4 shadow-2xl text-xs text-slate-200">
          <div className="flex items-start justify-between pb-2 border-b border-slate-800">
            <div>
              <div className="font-bold text-sm text-slate-100 flex items-center space-x-1.5">
                <Ship className="w-4 h-4 text-cyan-400" />
                <span>{selectedVessel.name}</span>
              </div>
              <div className="text-[10px] text-slate-400 font-mono">
                IMO: {selectedVessel.imo} | MMSI: {selectedVessel.mmsi} | Flag: {selectedVessel.flag}
              </div>
            </div>
            <button
              onClick={() => onSelectVessel(null)}
              className="text-slate-400 hover:text-slate-100 p-1 text-sm leading-none"
            >
              ✕
            </button>
          </div>

          <div className="mt-3 space-y-2">
            <div className="flex justify-between items-center bg-slate-950/60 p-2 rounded-lg border border-slate-800">
              <span className="text-slate-400">Attribution Probability:</span>
              <span className={`font-bold font-mono text-sm ${selectedVessel.score > 75 ? 'text-red-400' : 'text-slate-200'}`}>
                {selectedVessel.score}%
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2 text-[11px]">
              <div className="bg-slate-950/60 p-2 rounded-lg border border-slate-800">
                <div className="text-slate-400">Closest Approach:</div>
                <div className="font-semibold text-slate-200">{selectedVessel.cpaKm} km</div>
              </div>
              <div className="bg-slate-950/60 p-2 rounded-lg border border-slate-800">
                <div className="text-slate-400">AIS Gap:</div>
                <div className="font-semibold text-amber-400">{selectedVessel.darkAisGapMinutes || 0} mins</div>
              </div>
            </div>

            {selectedVessel.anomalyFlags.length > 0 && (
              <div className="bg-red-950/30 border border-red-900/60 rounded-lg p-2 text-[10px] text-red-300 space-y-1">
                <div className="font-semibold text-red-400 flex items-center space-x-1">
                  <AlertCircle className="w-3 h-3" />
                  <span>Detected Anomaly Signatures:</span>
                </div>
                {selectedVessel.anomalyFlags.map((flag, idx) => (
                  <div key={idx}>• {flag}</div>
                ))}
              </div>
            )}

            <button
              onClick={onViewAttribution}
              className="w-full mt-2 py-1.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-slate-950 font-semibold text-xs transition-colors"
            >
              View Full Attribution Dossier →
            </button>
          </div>
        </div>
      )}

      {/* Bottom Timeline & Hindcast Time Scrubber */}
      <div className="bg-slate-900/95 backdrop-blur-md border-t border-slate-800 p-3 z-10 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
        
        {/* Playback Controls */}
        <div className="flex items-center space-x-2">
          <button
            id="btn-play-pause-hindcast"
            onClick={() => setIsPlaying(!isPlaying)}
            className="w-8 h-8 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-slate-950 flex items-center justify-center transition-colors shadow-sm"
            title={isPlaying ? 'Pause simulation' : 'Play trajectory simulation'}
          >
            {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 ml-0.5" />}
          </button>

          <button
            id="btn-reset-hindcast"
            onClick={() => {
              setIsPlaying(false);
              setActiveStepIndex(0);
            }}
            className="w-8 h-8 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 flex items-center justify-center transition-colors border border-slate-700"
            title="Reset to Spill Origin Window"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>

          <div className="text-slate-300 font-mono text-xs pl-2">
            <span className="text-cyan-400 font-bold">
              {scenario.driftSteps[activeStepIndex]?.formattedTime || 'Observation Time'}
            </span>
          </div>
        </div>

        {/* Step Range Slider */}
        <div className="flex-1 max-w-xl w-full px-2 flex items-center space-x-3">
          <span className="text-[10px] text-cyan-400 font-mono whitespace-nowrap">T-14h (Hindcast)</span>
          <input
            id="timeline-scrubber"
            type="range"
            min="0"
            max={Math.max(0, scenario.driftSteps.length - 1)}
            value={activeStepIndex}
            onChange={(e) => {
              setIsPlaying(false);
              setActiveStepIndex(parseInt(e.target.value, 10));
            }}
            aria-label="Hindcast and forecast timeline scrubber"
            className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-500"
          />
          <span className="text-[10px] text-purple-400 font-mono whitespace-nowrap">T+12h (Forecast)</span>
        </div>

        {/* Legend Quick Reference */}
        <div className="hidden lg:flex items-center space-x-3 text-[10px] text-slate-400 font-mono">
          <div className="flex items-center space-x-1">
            <span className="w-2 h-2 rounded-full bg-cyan-400"></span>
            <span>SAR Slick</span>
          </div>
          <div className="flex items-center space-x-1">
            <span className="w-2 h-2 rounded-full bg-purple-400"></span>
            <span>Particle Cloud</span>
          </div>
          <div className="flex items-center space-x-1">
            <span className="w-2 h-2 rounded-full bg-red-500"></span>
            <span>Suspect AIS</span>
          </div>
          <div className="flex items-center space-x-1">
            <span className="w-2 h-2 rounded-full bg-amber-400"></span>
            <span>95% CI Radius</span>
          </div>
        </div>

      </div>
    </div>
  );
};
