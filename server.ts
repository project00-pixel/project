import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Initialize GoogleGenAI lazily with telemetry header
const getGeminiClient = () => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) return null;
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
};

// API Route: Health Check
app.get("/api/health", (req, res) => {
  res.json({
    status: "ok",
    hasApiKey: Boolean(process.env.GEMINI_API_KEY),
    timestamp: new Date().toISOString()
  });
});

// API Route: One Health Dual-Character Dialogue & Inquiry Co-Pilot
app.post("/api/dialogue-chat", async (req, res) => {
  try {
    const { question, currentChapter, scenarioFocus } = req.body;

    if (!question || typeof question !== 'string') {
      return res.status(400).json({ error: "Missing or invalid question" });
    }

    const ai = getGeminiClient();

    if (!ai) {
      // High-quality deterministic fallback response grounded in the FAO 2026 Assessment
      return res.json({
        amiraResponse: `From a macroeconomic and public health perspective, ${question.toLowerCase().includes('cost') ? 'the financial calculation must balance immediate farmer transition subsidies against long-term antimicrobial efficacy' : 'curbing unnecessary prophylactic use creates a critical protective buffer for first-line human antibiotics'}. In the FAO model, every $1 invested in livestock biosecurity yields over $3.20 in avoided animal mortality and preserved trade access. We cannot afford the projected $1.2 trillion in compounding global macroeconomic drag by 2040.`,
        mohamedResponse: `From my farm gate, I understand Dr. Amira's numbers, but a sudden blanket ban without financial support would wipe out operating margins for small and medium producers. When a bacterial respiratory outbreak strikes a 500-head herd, waiting 72 hours for lab culture confirmation means losing 15% of our stock. We need affordable penside diagnostics, subsidized ventilation retrofits, and fair market price premiums before we can safely phase out routine metaphylaxis.`,
        consensusInsight: "Action requires matching regulatory stringency with tangible farm-gate capital assistance, rapid pen-side diagnostics, and certified consumer price premiums.",
        impactMetrics: {
          amuReduction: "38%",
          farmMarginImpact: "+4.2%",
          healthSecurityROI: "18.2:1"
        }
      });
    }

    const systemInstruction = `You are powering "The Handshake", an interactive educational experience based on the UN FAO 2026 report "The future of antimicrobial use in livestock — the economic cost of action or inaction".
You must generate a dual-perspective dialogue between two realistic characters:
1. Dr. Amira (One Health Economist): Represents macroeconomic foresight, public health preservation, epidemiological risk, global trade policy, and the 18:1 long-term return on biosecurity.
2. Mohamed (Innovative Livestock Producer): Represents the frontline livestock farmer, cashflow realities, working capital, veterinary costs, herd mortality threats, and the need for transition subsidies.

Respond in JSON format matching the schema:
{
  "amiraResponse": string (2-3 punchy, realistic sentences citing policy or economic data),
  "mohamedResponse": string (2-3 authentic, practical sentences about herd welfare, cashflow, or biosecurity),
  "consensusInsight": string (1-2 sentences identifying the practical common ground / policy handshake),
  "impactMetrics": {
    "amuReduction": string (e.g. "-35%"),
    "farmMarginImpact": string (e.g. "+3.8%"),
    "healthSecurityROI": string (e.g. "14.5:1")
  }
}`;

    const prompt = `Context: Chapter "${currentChapter || 'General'}", Focus "${scenarioFocus || 'Livestock AMU Policy'}".
User Question / Scenario: "${question}"

Generate the authentic response from both Dr. Amira and Mohamed with balanced economic and agricultural grounding.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.7-flash",
      contents: prompt,
      config: {
        systemInstruction,
        responseMimeType: "application/json"
      }
    });

    const text = response.text || "{}";
    const data = JSON.parse(text);
    res.json(data);
  } catch (error) {
    console.error("Error in /api/dialogue-chat:", error);
    res.status(500).json({
      error: "Failed to generate character response",
      details: error instanceof Error ? error.message : String(error)
    });
  }
});

// API Route: Custom Policy Scenario Evaluator
app.post("/api/policy-simulate", async (req, res) => {
  try {
    const { biosecuritySubsidy, prescriptionMandate, diagnosticSpeed, pricePremium, globalAccordTier } = req.body;

    const ai = getGeminiClient();

    if (!ai) {
      // Deterministic calculation
      const subsidy = Number(biosecuritySubsidy) || 25;
      const mandate = Number(prescriptionMandate) || 60;
      const speed = Number(diagnosticSpeed) || 2;
      const premium = Number(pricePremium) || 5;

      const amuReduction = Math.min(65, Math.max(10, Math.round(subsidy * 0.5 + mandate * 0.4 + (4 - speed) * 5)));
      const farmSurvival = Math.min(98, Math.max(60, Math.round(75 + subsidy * 0.4 + premium * 2.5 - mandate * 0.2)));
      const roiRatio = (10 + (subsidy * 0.2) + (mandate * 0.1)).toFixed(1);

      return res.json({
        evaluationTitle: "One Health Transition Trajectory",
        summary: `Under this policy mix, global livestock AMU intensity decreases by ${amuReduction}%, while farm survival index holds at ${farmSurvival}%. Proactive biosecurity subsidies offset compliance friction, preventing herd health shocks.`,
        amuReduction: `-${amuReduction}%`,
        farmSurvivalScore: `${farmSurvival}/100`,
        humanHealthcareSavings: `$${(amuReduction * 24).toLocaleString()} Billion`,
        overallScore: Math.round((amuReduction + farmSurvival) / 2),
        recommendations: [
          "Deploy pen-side rapid diagnostic testing kits to reduce prescription delay below 24 hours.",
          "Target initial capital grants toward ventilation and herd isolation pens for high-density herds.",
          "Establish national veterinary prescription registries to track antimicrobials of highest priority."
        ]
      });
    }

    const systemInstruction = `You are a One Health Veterinary & Macroeconomic Policy Evaluation Engine based on UN FAO and WOAH methodologies.
Analyze the user's livestock policy parameters:
- Biosecurity Subsidy ($/head): ${biosecuritySubsidy}
- Prescription Mandate Strictness (%): ${prescriptionMandate}
- Diagnostic Turnaround Time (Days): ${diagnosticSpeed}
- Consumer Price Premium for Certified Stewardship (%): ${pricePremium}
- International Accord Tier: ${globalAccordTier}

Return a structured JSON object:
{
  "evaluationTitle": string,
  "summary": string,
  "amuReduction": string,
  "farmSurvivalScore": string,
  "humanHealthcareSavings": string,
  "overallScore": number (0 to 100),
  "recommendations": string[] (3 actionable policy recommendations)
}`;

    const response = await ai.models.generateContent({
      model: "gemini-3.7-flash",
      contents: "Evaluate this specific livestock antimicrobial stewardship policy mix.",
      config: {
        systemInstruction,
        responseMimeType: "application/json"
      }
    });

    const data = JSON.parse(response.text || "{}");
    res.json(data);
  } catch (error) {
    console.error("Error in /api/policy-simulate:", error);
    res.status(500).json({
      error: "Failed to evaluate policy scenario",
      details: error instanceof Error ? error.message : String(error)
    });
  }
});

// Vite middleware / static asset serving
async function startServer() {
  // Explicitly serve static assets from src/assets and public
  app.use('/src/assets', express.static(path.join(process.cwd(), 'src/assets')));
  app.use('/assets', express.static(path.join(process.cwd(), 'src/assets')));
  app.use(express.static(path.join(process.cwd(), 'public')));

  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`The Handshake server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
