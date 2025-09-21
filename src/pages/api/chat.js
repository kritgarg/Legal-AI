// pages/api/chat.js
import fs from "fs";

const GEMINI_URL =
  "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent";

function findTextInResponse(json) {
  try {
    if (json?.candidates?.length) {
      const candidate = json.candidates[0];
      if (candidate.content?.parts?.length) {
        return candidate.content.parts.map((p) => p.text || "").join("");
      }
      if (candidate.content?.length && candidate.content[0].parts?.length) {
        return candidate.content[0].parts.map((p) => p.text || "").join("");
      }
    }
  } catch (e) {}
  try {
    return JSON.stringify(json);
  } catch (e) {
    return "";
  }
}

async function callGemini(prompt) {
  const body = {
    contents: [
      {
        parts: [{ text: prompt }],
      },
    ],
    generationConfig: {
      thinkingConfig: { thinkingBudget: 0 },
      temperature: 0.0,
    },
  };

  const res = await fetch(GEMINI_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-goog-api-key": process.env.GEMINI_API_KEY,
    },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const t = await res.text().catch(() => "");
    throw new Error(`Gemini failed: ${res.status} ${t}`);
  }

  const json = await res.json();
  const text = findTextInResponse(json);
  return { rawJson: json, text };
}

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  try {
    const { docHash, question } = req.body || {};
    if (!docHash || !question) return res.status(400).json({ error: "Missing docHash or question" });

    const cachePath = `/tmp/analysis_${docHash}.json`;
    if (!fs.existsSync(cachePath)) {
      return res.status(400).json({ error: "No analysis found for that document. Please re-upload." });
    }

    const analysis = JSON.parse(fs.readFileSync(cachePath, "utf8"));
    // Use summary array or fallback to rawModelText
    const context =
      Array.isArray(analysis.summary) ? analysis.summary.join("\n") : analysis.summary || analysis.rawModelText || "";

    const prompt = `You are a plain-language legal assistant. Use ONLY the CONTEXT below (do not assume facts beyond it).
Context:
${context}

User question:
${question}

Answer in simple, short sentences (2-4 sentences). If the information isn't present in the context, say "I can't find that in the document."`;

    const { text: answer } = await callGemini(prompt);

    // sometimes the model returns JSON or extra text, but we keep the whole answer as plain text
    return res.status(200).json({ answer: answer || "No answer from model." });
  } catch (err) {
    console.error("chat error:", err);
    return res.status(500).json({ error: "Chat failed. " + (err.message || "") });
  }
}
