// pages/api/process.js
import formidable from "formidable";
import fs from "fs";
import pdf from "pdf-parse";
import crypto from "crypto";

export const config = {
  api: {
    bodyParser: false, // required for file uploads with formidable
  },
};

const MAX_FILE_BYTES = 2 * 1024 * 1024; // 2MB server-side
const MAX_CHARS = 10000; // truncate text to 10k chars for demo
const GEMINI_URL =
  "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent";

function parseForm(req) {
  const form = formidable({
    maxFileSize: MAX_FILE_BYTES,
    keepExtensions: true,
  });

  return new Promise((resolve, reject) => {
    form.parse(req, (err, fields, files) => {
      if (err) {
        return reject(err);
      }
      resolve({ fields, files });
    });
  });
}

function findTextInResponse(json) {
  // Try the common path used in examples: candidates[0].content.parts[0].text
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
  } catch (e) {
    // ignore
  }
  // fallback: try to find any string in the JSON recursively
  try {
    const s = JSON.stringify(json);
    return s;
  } catch (e) {
    return "";
  }
}

function extractJSONFromText(text) {
  // Attempt to extract the first JSON object from the model text.
  const start = text.indexOf("{");
  const end = text.lastIndexOf("}");
  if (start !== -1 && end !== -1 && end > start) {
    const candidate = text.slice(start, end + 1);
    try {
      return JSON.parse(candidate);
    } catch (e) {
      // ignore parse errors
    }
  }
  return null;
}

async function callGemini(prompt) {
  const body = {
    contents: [
      {
        parts: [{ text: prompt }],
      },
    ],
    generationConfig: {
      thinkingConfig: { thinkingBudget: 0 }, // disable "thinking"
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
    throw new Error(`Gemini request failed: ${res.status} ${t}`);
  }

  const json = await res.json();
  const text = findTextInResponse(json);
  return { rawJson: json, text };
}

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  try {
    const { files } = await parseForm(req);
    const file = files?.file;
    if (!file) return res.status(400).json({ error: "No file uploaded" });

    // Handle both single file and array of files from formidable
    const uploadedFile = Array.isArray(file) ? file[0] : file;
    
    // Check for filepath property (newer formidable versions use different property names)
    const filePath = uploadedFile.filepath || uploadedFile.path;
    if (!filePath) {
      console.error("File object:", uploadedFile);
      return res.status(400).json({ error: "File path not found in upload" });
    }

    // read buffer
    const buffer = fs.readFileSync(filePath);

    // extract text
    const data = await pdf(buffer).catch((e) => {
      console.error("pdf-parse error:", e);
      return { text: "" };
    });

    let text = (data?.text || "").trim();
    if (!text) {
      return res.status(400).json({
        error:
          "No extractable text found — this looks like a scanned image PDF. For scanned documents you need an OCR-capable processor (Document AI).",
      });
    }

    // truncate and flag if needed
    let truncated = false;
    if (text.length > MAX_CHARS) {
      text = text.slice(0, MAX_CHARS) + "\n\n[TRUNCATED FOR DEMO]";
      truncated = true;
    }

    // compute hash for caching by content
    const hash = crypto.createHash("sha256").update(text).digest("hex");
    const cachePath = `/tmp/analysis_${hash}.json`;

    // if cached -> return cache (avoid calling Gemini again)
    if (fs.existsSync(cachePath)) {
      const cached = JSON.parse(fs.readFileSync(cachePath, "utf8"));
      return res.status(200).json({
        docHash: hash,
        truncated,
        analysis: cached,
        cached: true,
      });
    }

    // Build prompt instructing JSON-only output
    const prompt = `You are a plain-language legal assistant. Use ONLY the DOCUMENT text below.
Return a valid JSON object ONLY (no commentary) with the following keys:
{
  "summary": ["short sentence bullet 1", "short sentence bullet 2", "short sentence bullet 3"],
  "riskLevel": "Safe" | "Moderate Risk" | "High Risk",
  "risks": [
    { "label": "Auto-renewal", "excerpt": "<short quote from doc if present>", "reason": "one-line reason" }
  ],
  "disclaimer": "a short single-line disclaimer"
}

DOCUMENT:
---
${text}
---

Rules:
- If you cannot find evidence in the document, do NOT invent it. Omit that risk or set excerpt to null and reason to "not found in document".
- Keep each summary item to one short sentence.
- If no risks found, set risks to an empty array.
- RETURN ONLY JSON (no surrounding text).`;

    // call Gemini
    const { text: modelText } = await callGemini(prompt);

    // modelText may be plain text or JSON — try to parse JSON from it
    let parsed = extractJSONFromText(modelText);

    if (!parsed) {
      // If not valid JSON, create a fallback structure with rawModelText
      parsed = {
        summary: [modelText.slice(0, 400)],
        riskLevel: "Unknown",
        risks: [],
        disclaimer: "This is an AI-generated summary for demo only.",
        rawModelText: modelText,
      };
    }

    // save cache
    fs.writeFileSync(cachePath, JSON.stringify(parsed, null, 2), "utf8");

    return res.status(200).json({
      docHash: hash,
      truncated,
      analysis: parsed,
      cached: false,
    });
  } catch (err) {
    console.error("process error:", err);
    // handle formidable size errors
    if (err?.message?.includes("maxFileSize") || err?.code === "LIMIT_FILE_SIZE") {
      return res.status(400).json({ error: "File too large. Max 2MB allowed." });
    }
    return res.status(500).json({ error: "Processing failed. " + (err.message || "") });
  }
}
