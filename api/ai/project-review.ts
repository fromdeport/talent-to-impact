import { GoogleGenAI, Type } from "@google/genai";

interface ApiRequest {
  method?: string;
  body?: unknown;
}

interface ApiResponse {
  status: (code: number) => ApiResponse;
  json: (body: unknown) => void;
}

function getLanguageName(lang: unknown): string {
  if (lang === "ru") return "Russian";
  if (lang === "en") return "English";
  return "Uzbek (Latin script, natural modern Uzbek)";
}

function parseBody(body: unknown): Record<string, unknown> {
  if (!body) return {};
  if (typeof body === "string") {
    try {
      return JSON.parse(body) as Record<string, unknown>;
    } catch {
      return {};
    }
  }
  if (typeof body === "object") return body as Record<string, unknown>;
  return {};
}

export default async function handler(req: ApiRequest, res: ApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed." });
  }

  try {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey || apiKey === "MY_GEMINI_API_KEY") {
      return res.status(500).json({ error: "GEMINI_API_KEY is not configured in Vercel Environment Variables." });
    }

    const { title, track, summary, problem, solution, tasksCount, teamSize, language } = parseBody(req.body);
    if (!title || !problem || !solution) {
      return res.status(400).json({ error: "Project title, problem statement, and solution are required." });
    }

    const ai = new GoogleGenAI({ apiKey });
    const targetLang = getLanguageName(language);
    const model = process.env.GEMINI_MODEL || "gemini-2.5-flash";

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
      model,
      contents: prompt,
      config: {
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
      Array.isArray(parsed.criticalQuestions)
        ? parsed.criticalQuestions.map((q: unknown) => `? ${String(q)}`).join("\n")
        : "",
      "",
      Array.isArray(parsed.sprintPlan)
        ? parsed.sprintPlan.map((m: unknown, i: number) => `${(i + 1) * 24}h: ${String(m)}`).join("\n")
        : "",
    ]
      .filter(Boolean)
      .join("\n")
      .slice(0, 3400);

    return res.status(200).json({
      structured: parsed,
      formattedReview,
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Failed to review project.";
    console.error("[/api/ai/project-review]", message);
    return res.status(502).json({ error: message });
  }
}
