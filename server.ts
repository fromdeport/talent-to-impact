import "dotenv/config";
import express from "express";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { GoogleGenAI, ThinkingLevel, Type } from "@google/genai";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = Number(process.env.PORT) || 3000;
const IS_PROD = process.env.NODE_ENV === "production";

function getAiClient(): GoogleGenAI {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey === "MY_GEMINI_API_KEY") {
    throw new Error("GEMINI_API_KEY is not configured in server environment.");
  }
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        "User-Agent": "aistudio-build",
      },
    },
  });
}

function getLanguageName(lang: unknown): string {
  if (lang === "ru") return "Russian";
  if (lang === "en") return "English";
  return "Uzbek (Latin script, natural modern Uzbek)";
}

async function createServer() {
  const app = express();
  app.use(express.json({ limit: "1mb" }));

  app.get("/api/health", (_req, res) => {
    res.json({ ok: true, service: "talent-to-impact" });
  });

  // Server-side Gemini 4 Talent Map Personalized Analysis
  app.post("/api/ai/talent-analysis", async (req, res) => {
    try {
      const { scores, primaryDomain, secondaryDomain, grade, region, interests, language } = req.body ?? {};
      if (!scores || typeof scores !== "object" || !primaryDomain || !secondaryDomain) {
        return res.status(400).json({ error: "Missing required diagnostic scores or primary domains." });
      }

      const ai = getAiClient();
      const targetLang = getLanguageName(language);

      const prompt = [
        `You are an expert educational architect and STEM mentor for TALENT TO IMPACT, a national digital educational ecosystem launching in Navoi region and scaling across Uzbekistan for grades 7-11.`,
        `Analyze this student's REAL diagnostic test scores (0 to 100 scale, calculated strictly from their submitted responses):`,
        `- Scores JSON: ${JSON.stringify(scores)}`,
        `- Primary Strength Domain: ${String(primaryDomain)}`,
        `- Secondary Strength Domain: ${String(secondaryDomain)}`,
        `- Student Grade: ${String(grade || "Not specified")}`,
        `- Student Region: ${String(region || "Navoi, Uzbekistan")}`,
        `- Declared Interests: ${Array.isArray(interests) ? interests.slice(0, 10).join(", ") : "None specified"}`,
        ``,
        `STRICT RULES:`,
        `1. Write the ENTIRE response strictly in ${targetLang}.`,
        `2. NEVER invent fake achievements, fake rankings, fake test scores, or claim unverified partnerships.`,
        `3. Base every recommendation directly on the student's actual domain scores above.`,
        `4. Make recommendations practical for a high school student in Uzbekistan (especially Navoi / regional schools).`,
      ].join("\n");

      const response = await ai.models.generateContent({
        model: "gemini-4-hydrogen",
        contents: prompt,
        config: {
          thinkingConfig: { thinkingLevel: ThinkingLevel.HIGH },
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              summary: {
                type: Type.STRING,
                description: "A concise 3-4 sentence analytical profile explaining how the student's top two domains reinforce each other.",
              },
              roadmap: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
                description: "5 concrete, sequential learning and skill-building steps the student can start immediately.",
              },
              projectIdeas: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
                description: "3 realistic SCHOOL HACK 72 student project ideas solving real local or educational problems.",
              },
            },
            required: ["summary", "roadmap", "projectIdeas"],
          },
        },
      });

      const rawText = (response.text ?? "{}").trim();
      const parsed = JSON.parse(rawText);
      return res.json({
        summary: String(parsed.summary || "").slice(0, 2900),
        roadmap: Array.isArray(parsed.roadmap) ? parsed.roadmap.slice(0, 8).map((s: unknown) => String(s).slice(0, 300)) : [],
        projectIdeas: Array.isArray(parsed.projectIdeas) ? parsed.projectIdeas.slice(0, 5).map((s: unknown) => String(s).slice(0, 300)) : [],
      });
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to generate talent analysis.";
      console.error("[/api/ai/talent-analysis]", message);
      return res.status(502).json({ error: message });
    }
  });

  // Server-side Gemini 4 School Hack 72 Project Architecture Review
  app.post("/api/ai/project-review", async (req, res) => {
    try {
      const { title, track, summary, problem, solution, tasksCount, teamSize, language } = req.body ?? {};
      if (!title || !problem || !solution) {
        return res.status(400).json({ error: "Project title, problem statement, and solution are required." });
      }

      const ai = getAiClient();
      const targetLang = getLanguageName(language);

      const prompt = [
        `You are a senior startup & STEM mentor reviewing a student team's project inside SCHOOL HACK 72 (part of TALENT TO IMPACT, Uzbekistan).`,
        `Project Details:`,
        `- Title: ${String(title).slice(0, 140)}`,
        `- Track: ${String(track || "General")}`,
        `- Summary: ${String(summary || "").slice(0, 500)}`,
        `- Problem Statement: ${String(problem).slice(0, 1500)}`,
        `- Proposed Solution: ${String(solution).slice(0, 1500)}`,
        `- Team Size: ${Number(teamSize) || 1}`,
        `- Defined Tasks: ${Number(tasksCount) || 0}`,
        ``,
        `STRICT RULES:`,
        `1. Respond entirely in ${targetLang}.`,
        `2. Provide honest, constructive, concrete engineering and product feedback. Do NOT generate arbitrary numeric scores like "92/100".`,
        `3. Focus on practical execution within a 72-hour student hackathon sprint and real-world feasibility in Uzbekistan schools.`,
      ].join("\n");

      const response = await ai.models.generateContent({
        model: "gemini-4-hydrogen",
        contents: prompt,
        config: {
          thinkingConfig: { thinkingLevel: ThinkingLevel.HIGH },
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              assessment: {
                type: Type.STRING,
                description: "Concise 2-3 sentence constructive synthesis of the project's core merit and clarity.",
              },
              strengths: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
                description: "2-3 specific strengths observed in the problem/solution definition.",
              },
              criticalQuestions: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
                description: "3 hard questions the team must answer to validate their solution.",
              },
              sprintPlan: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
                description: "3 concrete 72-hour sprint milestones (24h, 48h, 72h).",
              },
            },
            required: ["assessment", "strengths", "criticalQuestions", "sprintPlan"],
          },
        },
      });

      const rawText = (response.text ?? "{}").trim();
      const parsed = JSON.parse(rawText);
      const formattedReview = [
        parsed.assessment || "",
        "",
        Array.isArray(parsed.strengths) ? parsed.strengths.map((s: unknown) => `+ ${String(s)}`).join("\n") : "",
        "",
        Array.isArray(parsed.criticalQuestions) ? parsed.criticalQuestions.map((q: unknown) => `? ${String(q)}`).join("\n") : "",
        "",
        Array.isArray(parsed.sprintPlan) ? parsed.sprintPlan.map((m: unknown, i: number) => `${(i + 1) * 24}h: ${String(m)}`).join("\n") : "",
      ]
        .filter(Boolean)
        .join("\n")
        .slice(0, 3400);

      return res.json({
        structured: parsed,
        formattedReview,
      });
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to review project.";
      console.error("[/api/ai/project-review]", message);
      return res.status(502).json({ error: message });
    }
  });

  if (!IS_PROD) {
    const { createServer: createViteServer } = await import("vite");
    const vite = await createViteServer({
      server: {
        middlewareMode: true,
        hmr: process.env.DISABLE_HMR !== "true",
      },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(__dirname, "dist");
    app.use(express.static(distPath));
    app.get("*", (_req, res) => {
      const indexFile = path.join(distPath, "index.html");
      if (fs.existsSync(indexFile)) {
        res.sendFile(indexFile);
      } else {
        res.status(404).send("Build output not found. Run npm run build first.");
      }
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`TALENT TO IMPACT server listening on http://0.0.0.0:${PORT}`);
  });
}

createServer().catch((err) => {
  console.error("Failed to start server:", err);
  process.exit(1);
});
