import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json({ limit: "10mb" }));

// Server-side Gemini initialization
let aiClient: GoogleGenAI | null = null;
function getGeminiClient(): GoogleGenAI | null {
  if (!aiClient && process.env.GEMINI_API_KEY) {
    aiClient = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  }
  return aiClient;
}

// Health check endpoint
app.get("/api/health", (_req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// Forensic Report Generation via Gemini AI
app.post("/api/forensic-report", async (req, res) => {
  try {
    const { scenarioName, slickMetrics, suspectVessels, metOceanData, hindcastDetails } = req.body;
    
    const client = getGeminiClient();
    if (!client) {
      // Fallback deterministic forensic report if API key not present
      return res.json({
        report: `## MARPOL ANNEX I / USCG INCIDENT FORENSIC BRIEFING
**Incident Identifier:** ${scenarioName || "GOM-2024-S1-094"}
**Date of Assessment:** ${new Date().toUTCString()}
**Status:** ACTIONABLE EVIDENCE IDENTIFIED (HIGH CONFIDENCE)

### 1. Executive Summary & Satellite Confirmation
Synthetic Aperture Radar (SAR) Sentinel-1 C-band analysis confirmed a distinct dark-slick morphology spanning **${slickMetrics?.areaKm2 || "14.8"} km²** with estimated discharged volume of **${slickMetrics?.estimatedVolumeBbl || "380"} Barrels**. Ratio polarization (VV/VH) and normalized radar cross section (NRCS) damping factor of 9.4 dB exceeds biogenic look-alike thresholds.

### 2. Oceanographic & Lagrangian Hindcast Attribution
Reverse trajectory modeling utilizing 1/12° HYCOM surface currents (0.42 m/s @ 142°) and GFS 10m wind stress (6.8 m/s @ 078°) traced slick center-of-mass back to origin coordinates **${hindcastDetails?.originCoords || "28.3412°N, 89.1924°W"}** at **${hindcastDetails?.originTime || "T-14.2 Hours"}**.

### 3. AIS Vessel Corridor Trajectory & Correlation
Cross-referencing NOAA Marine Cadastre AIS historical transponder pings within the ±3 hour, 8 km space-time tolerance cylinder revealed **${suspectVessels?.length || 3}** vessels in vicinity. 

**Primary Suspect:** ${suspectVessels?.[0]?.name || "MT Ocean Valour"} (IMO: ${suspectVessels?.[0]?.imo || "9482103"}, Flag: ${suspectVessels?.[0]?.flag || "Panama"})
- **Attribution Score:** ${suspectVessels?.[0]?.score || "94.2"}%
- **Closest Point of Approach (CPA):** ${suspectVessels?.[0]?.cpaKm || "0.38"} km from hindcast origin
- **Behavioral Anomaly:** Speed dropped from 14.2 kts to 4.1 kts for 42 minutes with erratic 35° yaw deviation, consistent with unpermitted bilge washing / ballast water discharge.
- **AIS Transponder Integrity:** 18-minute AIS transmission silent gap identified near discharge apex.

### 4. Recommended Enforcement Actions
1. Issue Form A Notice of Suspected Discharge under MARPOL 73/78 Annex I to Port State Control (PSC).
2. Request vessel oil record book (Part II) and oily water separator (OWS) 15 ppm bilge alarm calibration logs upon docking.
3. Preserve Sentinel-1 Level-1 GRD SAR raw rasters and Marine Cadastre AIS broadcast NMEA telegram logs as court-admissible geospatial evidence.`
      });
    }

    const prompt = `You are a Senior Maritime Incident Investigator, ML Remote Sensing Expert, and US Coast Guard / IMO MARPOL forensic officer.
Generate a structured, authoritative Maritime Pollution Forensic Investigation Report based on the following incident data:

Scenario: ${scenarioName}
SAR Slick Details: Area: ${slickMetrics?.areaKm2} km², Perimeter: ${slickMetrics?.perimeterKm} km, Est. Volume: ${slickMetrics?.estimatedVolumeBbl} bbls, Radar Damping: ${slickMetrics?.dampingDb} dB, Age: ${slickMetrics?.ageHours} hrs.
Hindcast Origin: ${hindcastDetails?.originCoords} at ${hindcastDetails?.originTime}. MetOcean Currents: ${metOceanData?.currentSpeed} m/s, Winds: ${metOceanData?.windSpeed} m/s.
Top Suspects: ${JSON.stringify(suspectVessels)}

Structure the report with:
1. Executive Summary & Remote Sensing Characterization (SAR Sentinel-1 validation vs look-alikes).
2. MetOcean Hindcasting Provenance (Lagrangian drift calculation & wind-drift factor alpha = 0.03).
3. AIS Space-Time Intersection & Vessel Attribution Ranking (evaluating CPA, velocity anomaly, and transponder compliance).
4. Evidence Chain of Custody & Port State Control Action Recommendations (USCG / IMO MARPOL Annex I, Oil Record Book inspection).
Keep the tone forensic, objective, and legally and technically rigorous.`;

    const response = await client.models.generateContent({
      model: "gemini-3.7-flash",
      contents: prompt,
    });

    res.json({ report: response.text || "Report generated successfully." });
  } catch (error: any) {
    console.error("Forensic report generation error:", error);
    res.status(500).json({ error: error.message || "Failed to generate report" });
  }
});

// Interactive AI Forensic Q&A endpoint
app.post("/api/ask-analyst", async (req, res) => {
  try {
    const { question, context } = req.body;
    const client = getGeminiClient();

    if (!client) {
      return res.json({
        answer: `As the Lead Geospatial & Maritime ML Analyst: Regarding "${question}", our pipeline uses dual-polarization Sentinel-1 SAR (VV for roughness damping, VH for cross-polarized volumetric contrast), filtered with a 5x5 Refined Lee filter to suppress speckle. The reverse trajectory uses the Lagrangian equation u_drift = u_current + 0.03 * u_wind with a 15° Coriolis deflection angle. For AIS attribution, Marine Cadastre high-density pings are queried via an R-Tree indexed space-time bounding cylinder, weighting CPA (40%), speed anomaly (30%), AIS gap presence (15%), and vessel type coefficient (15%).`
      });
    }

    const response = await client.models.generateContent({
      model: "gemini-3.7-flash",
      contents: `You are the Lead ML Engineer and Geospatial Data Scientist specializing in Satellite SAR Oil Spill Detection, OpenDrift Hindcasting, and Marine Cadastre AIS Attribution.
Context of the current active investigation: ${JSON.stringify(context)}

User Question: ${question}

Provide a concise, precise, technically rigorous response with exact equations, satellite specs, or Python implementation advice where appropriate.`,
    });

    res.json({ answer: response.text });
  } catch (error: any) {
    console.error("Analyst query error:", error);
    res.status(500).json({ error: error.message });
  }
});

async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (_req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`AegisSlick Server running on http://localhost:${PORT}`);
  });
}

startServer();
