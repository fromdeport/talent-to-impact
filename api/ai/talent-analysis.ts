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

    const { scores, primaryDomain, secondaryDomain, grade, region, interests, language } = parseBody(req.body);
    if (!scores || typeof scores !== "object" || !primaryDomain || !secondaryDomain) {
      return res.status(400).json({ error: "Missing required diagnostic scores or primary domains." });
    }

    const ai = new GoogleGenAI({ apiKey });
    const targetLang = getLanguageName(language);
    const model = process.env.GEMINI_MODEL || "gemini-2.5-flash";

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
      model,
      contents: prompt,
      config: {
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
    return res.status(200).json({
      summary: String(parsed.summary || "").slice(0, 2900),
      roadmap: Array.isArray(parsed.roadmap)
        ? parsed.roadmap.slice(0, 8).map((s: unknown) => String(s).slice(0, 300))
        : [],
      projectIdeas: Array.isArray(parsed.projectIdeas)
        ? parsed.projectIdeas.slice(0, 5).map((s: unknown) => String(s).slice(0, 300))
        : [],
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Failed to generate talent analysis.";
    console.error("[/api/ai/talent-analysis]", message);
    return res.status(502).json({ error: message });
  }
}
