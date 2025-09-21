// src/app/api/analyze/route.js
import { NextResponse } from "next/server";
import pdfParse from "pdf-parse";
import fs from "fs/promises";

export async function POST(req) {
  try {
    const formData = await req.formData();
    const file = formData.get("file");

    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    // Convert file to buffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Parse PDF
    const data = await pdfParse(buffer);
    const text = data.text.slice(0, 5000); // limit for demo

    if (!text.trim()) {
      return NextResponse.json(
        { error: "No text extracted from PDF" },
        { status: 400 }
      );
    }

    // --- Call Gemini API ---
    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [
            {
              role: "user",
              parts: [
                {
                  text: `Analyze this legal document and respond in JSON:
{
  "riskLevel": "Safe | Moderate Risk | High Risk",
  "summary": "2-3 sentences summary",
  "riskyClauses": ["clause 1...", "clause 2..."]
}
Document Text: ${text}`,
                },
              ],
            },
          ],
        }),
      }
    );

    const json = await res.json();

    if (!res.ok) {
      console.error("Gemini error:", json);
      return NextResponse.json({ error: "AI analysis failed" }, { status: 500 });
    }

    let aiResponse;
    try {
      aiResponse = JSON.parse(
        json.candidates?.[0]?.content?.parts?.[0]?.text || "{}"
      );
    } catch (err) {
      console.error("Failed to parse AI JSON:", err);
      aiResponse = { summary: json.candidates?.[0]?.content?.parts?.[0]?.text };
    }

    // Save results in memory (for demo only — production needs DB)
    global.analysisResult = aiResponse;

    return NextResponse.json({ success: true, ...aiResponse });
  } catch (err) {
    console.error("Analyze API error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
