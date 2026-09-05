export type LayerType = 'sar' | 'metocean' | 'drift' | 'ais' | 'all';

export interface ProbabilityBreakdown {
  proximity: number;      // 0-100 score
  speedAnomaly: number;   // 0-100 score
  aisIntegrity: number;   // 0-100 score (dark gaps / spoofing)
  vesselTypeFactor: number; // 0-100 score (tanker vs cargo vs fishing)
}

export interface AISPing {
  lat: number;
  lng: number;
  timestamp: string;
  sog: number; // Speed over ground (knots)
  cog: number; // Course over ground (degrees)
  heading: number;
  navStatus: string;
  isGap?: boolean;
}

export interface VesselTrack {
  mmsi: string;
  imo: string;
  name: string;
  vesselType: 'Crude Oil Tanker' | 'Chemical Tanker' | 'Bulk Carrier' | 'Container Ship' | 'Tug / Supply' | 'Fishing Vessel' | 'Cargo';
  flag: string;
  flagCode: string;
  lengthM: number;
  draughtM: number;
  score: number; // Overall attribution score 0-100%
  cpaKm: number; // Closest Point of Approach to hindcast release point
  cpaTime: string;
  speedKnots: number[];
  pings: AISPing[];
  coords: [number, number][]; // [lat, lng]
  anomalyFlags: string[];
  darkAisGapMinutes?: number;
  probabilityBreakdown: ProbabilityBreakdown;
  operator: string;
  destination: string;
}

export interface DriftParticle {
  lat: number;
  lng: number;
  weight: number;
  ageHours: number;
}

export interface DriftStep {
  timeOffsetHours: number; // negative for hindcast, positive for forecast, 0 for observation
  formattedTime: string;
  centerLat: number;
  centerLng: number;
  particles: DriftParticle[];
  uncertaintyRadiusKm: number;
}

export interface SlickMetrics {
  areaKm2: number;
  perimeterKm: number;
  estimatedVolumeBbl: number;
  estimatedVolumeM3: number;
  dampingDb: number;
  ageHours: number;
  weatheringState: 'Fresh Emulsion' | 'Moderate Sheen' | 'Heavily Weathered Tar';
  confidenceScore: number;
  pixelResolutionM: number;
}

export interface MetOceanConditions {
  windSpeedMps: number;
  windDirDeg: number; // 0-360 where wind is blowing FROM
  currentSpeedMps: number;
  currentDirDeg: number; // 0-360 where current is flowing TO
  seaSurfaceTempC: number;
  significantWaveHeightM: number;
  stokesDriftMps: number;
}

export interface Scenario {
  id: string;
  name: string;
  region: string;
  description: string;
  satellitePassTime: string;
  centerLat: number;
  centerLng: number;
  zoom: number;
  slickPolygon: [number, number][];
  slickOriginPoint: [number, number]; // [lat, lng] estimated release point
  slickMetrics: SlickMetrics;
  metOcean: MetOceanConditions;
  driftSteps: DriftStep[];
  vessels: VesselTrack[];
  sarSensor: {
    satellite: string;
    mode: string;
    polarization: string;
    incidenceAngle: string;
    passDirection: 'Ascending' | 'Descending';
  };
}

export interface PythonModuleCode {
  id: string;
  title: string;
  module: string;
  filename: string;
  description: string;
  code: string;
}
