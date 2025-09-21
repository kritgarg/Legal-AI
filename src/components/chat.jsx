// src/components/Chat.jsx
"use client";
import { useState, useRef } from "react";
import { motion } from "framer-motion";

/**
 * Chat component: uploads a PDF/TXT to /api/extract, receives summary & risk,
 * and allows follow-up questions via /api/chat.
 *
 * - Avoids duplicate analyze calls by hashing file client-side (SHA-256).
 * - Accepts many server response shapes (legacy vs simple).
 * - Falls back gracefully on errors.
 *
 * Requirements:
 * - /api/extract : accepts FormData { file, optional docHash } -> returns JSON (see parsing below)
 * - /api/chat    : accepts JSON { docHash?, question, context? } -> returns { answer }
 *
 * Install framer-motion if not installed:
 *   npm i framer-motion
 */

export default function Chat() {
  const [fileMeta, setFileMeta] = useState(null); // { name, size, type }
  const [docHash, setDocHash] = useState(null); // server or client hash
  const [loading, setLoading] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [error, setError] = useState("");

  // Document analysis state
  const [text, setText] = useState(""); // full extracted text (if returned)
  const [summaryArr, setSummaryArr] = useState([]); // array of short bullets
  const [riskLevel, setRiskLevel] = useState(null); // e.g., "Safe", "Moderate Risk", "High"
  const [risks, setRisks] = useState([]); // array of {label, reason, excerpt}

  // Chat state
  const [messages, setMessages] = useState([
    { role: "ai", text: "📄 Upload a document to start the analysis." },
  ]);
  const [input, setInput] = useState("");
  const lastUploadedHashRef = useRef(null);

  // Helpers
  const toHex = (buffer) =>
    Array.from(new Uint8Array(buffer))
      .map((b) => b.toString(16).padStart(2, "0"))
      .join("");

  async function hashFile(file) {
    try {
      const ab = await file.arrayBuffer();
      const digest = await crypto.subtle.digest("SHA-256", ab);
      return toHex(digest);
    } catch (e) {
      // fallback: use name+size+lastModified string hash
      return `${file.name}-${file.size}-${file.lastModified}`;
    }
  }

  function normalizeSummary(raw) {
    if (!raw) return [];
    if (Array.isArray(raw)) return raw;
    if (typeof raw === "string") {
      // split on newlines or sentence boundaries; keep short bullets
      const lines = raw
        .split(/\r?\n/)
        .map((s) => s.trim())
        .filter(Boolean);
      if (lines.length >= 3) return lines.slice(0, 5);
      // fallback split by sentences
      const sentences = raw
        .split(/(?<=\.)\s+/)
        .map((s) => s.trim())
        .filter(Boolean);
      return sentences.slice(0, 5);
    }
    return [];
  }

  // Robust parser for various server response shapes
  function parseExtractResponse(json) {
    // Several possible shapes from earlier examples:
    // 1) { text, summary, risk } (simple)
    // 2) { docHash, truncated, analysis: { summary: [...], riskLevel, risks: [...] } }
    // 3) { analysis: {...} } etc.
    const out = {
      docHash: json.docHash || json.hash || null,
      truncated: !!json.truncated,
      text: json.text || (json.analysis && json.analysis.rawModelText) || "",
      summaryRaw:
        json.summary ||
        (json.analysis && json.analysis.summary) ||
        (json.analysis && json.analysis.summaryText) ||
        "",
      riskLevel:
        json.risk ||
        json.riskLevel ||
        (json.analysis && json.analysis.riskLevel) ||
        (json.analysis && json.analysis.risk) ||
        null,
      risks:
        json.risks ||
        json.riskyLines ||
        (json.analysis && json.analysis.risks) ||
        [],
    };

    // Normalize risks array items to {label, reason, excerpt}
    if (Array.isArray(out.risks)) {
      out.risks = out.risks.map((r) => {
        if (typeof r === "string") return { label: r, reason: "", excerpt: "" };
        return {
          label: r.label || r.name || r.type || "Risk",
          reason: r.reason || r.summary || "",
          excerpt: r.excerpt || r.text || "",
        };
      });
    } else {
      out.risks = [];
    }

    return out;
  }

  // Upload & analyze the file
  async function handleFileSelect(e) {
    setError("");
    const file = e.target.files?.[0];
    if (!file) return;

    // Basic client-side size/type checks
    const MAX_BYTES = 2 * 1024 * 1024; // 2MB
    if (file.size > MAX_BYTES) {
      setError("File too large (max 2MB). Please upload a smaller file.");
      return;
    }

    setFileMeta({ name: file.name, size: file.size, type: file.type });

    // Compute a client hash and skip if identical to last uploaded
    setLoading(true);
    let clientHash;
    try {
      clientHash = await hashFile(file);
    } catch (e) {
      clientHash = `${file.name}-${file.size}-${file.lastModified}`;
    }

    // If same as last uploaded and we have analysis, reuse it
    if (lastUploadedHashRef.current === clientHash && summaryArr.length > 0) {
      setMessages((m) => [
        ...m,
        { role: "ai", text: "Using cached analysis for the same document." },
      ]);
      setLoading(false);
      return;
    }

    // Build form data
    const fd = new FormData();
    fd.append("file", file);
    // attach clientHash for server if desired (server may ignore)
    fd.append("docHash", clientHash);

    // kick off analyze
    setAnalyzing(true);
    setMessages([{ role: "ai", text: "🔍 Analyzing your document..." }]);
    try {
      const res = await fetch("/api/extract", {
        method: "POST",
        body: fd,
      });
      const json = await res.json();

      if (!res.ok) {
        const msg = json?.error || "Extraction failed";
        throw new Error(msg);
      }

      const parsed = parseExtractResponse(json);
      // store docHash: prefer server docHash but fall back to clientHash
      const finalHash = parsed.docHash || clientHash || null;
      setDocHash(finalHash);
      lastUploadedHashRef.current = finalHash;

      setText(parsed.text || "");
      const normalizedSummary = normalizeSummary(parsed.summaryRaw);
      setSummaryArr(normalizedSummary.length ? normalizedSummary : ["No summary available."]);
      setRiskLevel(parsed.riskLevel || "Unknown");
      setRisks(parsed.risks || []);

      // message: analysis complete
      setMessages([{ role: "ai", text: "✅ Document analyzed. Ask me anything!" }]);
    } catch (err) {
      console.error("Upload/analysis error:", err);
      setError(err.message || "Failed to analyze document.");
      setMessages([{ role: "ai", text: "⚠️ Analysis failed. Try another file." }]);
    } finally {
      setAnalyzing(false);
      setLoading(false);
    }
  }

  // Send chat question to /api/chat
  async function handleSend() {
    setError("");
    const question = input.trim();
    if (!question) return;

    // Add user message
    setMessages((m) => [...m, { role: "user", text: question }]);
    setInput("");
    // optimistic placeholder for the AI response
    setMessages((m) => [...m, { role: "ai", text: "Thinking..." }]);

    // Build payload
    let payload = { question };
    if (docHash) {
      payload.docHash = docHash;
    } else {
      // attach context (summary or text) to keep prompt small
      const ctx = summaryArr && summaryArr.length ? summaryArr.join("\n") : text.slice(0, 8000);
      payload.context = ctx;
    }

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const json = await res.json();
      if (!res.ok) {
        const msg = json?.error || "Chat failed";
        throw new Error(msg);
      }

      // The server may return { answer }, or { text } or raw model text
      const answer = json.answer || json.text || json.response || json.result || "No answer returned.";
      // replace last 'Thinking...' message with actual answer
      setMessages((m) => {
        // replace last occurrence of "Thinking..." produced by us
        const idx = [...m].reverse().findIndex((x) => x.role === "ai" && x.text === "Thinking...");
        if (idx === -1) {
          return [...m, { role: "ai", text: answer }];
        } else {
          const realIdx = m.length - 1 - idx;
          const copy = m.slice();
          copy[realIdx] = { role: "ai", text: answer };
          return copy;
        }
      });
    } catch (err) {
      console.error("Chat error:", err);
      setError(err.message || "Chat failed.");
      // replace thinking bubble with error text
      setMessages((m) => {
        const idx = [...m].reverse().findIndex((x) => x.role === "ai" && x.text === "Thinking...");
        if (idx === -1) return [...m, { role: "ai", text: "AI unavailable." }];
        const realIdx = m.length - 1 - idx;
        const copy = m.slice();
        copy[realIdx] = { role: "ai", text: "⚠️ AI unavailable. Try again." };
        return copy;
      });
    }
  }

  // small UI helpers
  const summaryPreview = summaryArr.length ? summaryArr.slice(0, 5) : [];
  const riskColor =
    riskLevel && /high/i.test(riskLevel)
      ? "text-red-400"
      : riskLevel && /mod/i.test(riskLevel)
      ? "text-yellow-400"
      : "text-green-400";

  return (
    <div className="h-screen w-screen bg-black flex">
      {/* LEFT: upload + analysis */}
      <div className="w-2/3 p-8 flex flex-col gap-6">
        {/* Upload area */}
        <div className="flex-1 flex items-center justify-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full max-w-2xl p-10 rounded-3xl bg-gradient-to-br from-white/6 to-white/4 backdrop-blur-2xl border border-white/20 shadow-[0_8px_40px_rgba(255,255,255,0.04)]"
          >
            <div className="flex items-center justify-between mb-6">
              <div>
                <h1 className="text-2xl font-semibold text-white">Upload document</h1>
                <p className="text-sm text-white/70 mt-1">PDF or TXT — max 2MB. We extract & summarize.</p>
              </div>

              <div className="flex items-center gap-3">
                <input
                  id="file-input"
                  type="file"
                  accept=".pdf,.txt"
                  onChange={handleFileSelect}
                  className="hidden"
                />
                <label htmlFor="file-input" className="inline-block">
                  <button
                    className="px-5 py-3 rounded-2xl bg-white/10 text-white border border-white/20 hover:bg-white/20 transition"
                    aria-label="Choose file"
                  >
                    Choose file
                  </button>
                </label>

                <button
                  onClick={() => {
                    // if we've already uploaded same file, re-analyze anyway
                    const el = document.getElementById("file-input");
                    el?.click();
                  }}
                  className="px-4 py-3 rounded-2xl bg-white/6 text-white border border-white/10 hover:bg-white/12 transition"
                >
                  Upload
                </button>
              </div>
            </div>

            {error && <div className="text-red-400 mb-3">{error}</div>}

            <div className="mt-4 space-y-4">
              {/* If analyzing show status */}
              {analyzing && <div className="text-white/80">Analyzing document…</div>}

              {/* Show analysis */}
              {!analyzing && summaryArr.length > 0 && (
                <>
                  <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="text-white font-semibold">🔎 Risk Level</h3>
                        <div className={`mt-2 text-lg font-semibold ${riskColor}`}>{riskLevel}</div>
                      </div>
                      <div className="text-xs text-white/60">doc: {docHash ? docHash.slice(0, 8) : "—"}</div>
                    </div>
                  </div>

                  <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
                    <h3 className="text-white font-semibold mb-2">📝 Summary</h3>
                    <ul className="list-disc list-inside text-white/85 space-y-1">
                      {summaryPreview.map((s, i) => (
                        <li key={i}>{s}</li>
                      ))}
                    </ul>
                  </div>

                  {risks.length > 0 && (
                    <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
                      <h3 className="text-red-300 font-semibold mb-2">⚠️ Flagged risks</h3>
                      <div className="space-y-2 text-sm text-white/80">
                        {risks.map((r, i) => (
                          <div key={i} className="p-2 bg-white/3 rounded-md">
                            <div className="font-semibold">{r.label}</div>
                            {r.reason && <div className="text-xs text-white/70">{r.reason}</div>}
                            {r.excerpt && <div className="mt-1 text-xs italic text-white/60">"{r.excerpt}"</div>}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </>
              )}

              {/* When no analysis yet, show hint */}
              {!analyzing && summaryArr.length === 0 && (
                <div className="text-white/70">
                  Upload a PDF or paste text to get a plain-English summary and risk highlights.
                </div>
              )}
            </div>
          </motion.div>
        </div>
      </div>

      {/* RIGHT: Chat */}
      <div className="w-1/3 p-6 flex flex-col">
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex-1 p-4 rounded-3xl bg-gradient-to-br from-white/6 to-white/4 backdrop-blur-2xl border border-white/20 shadow-[0_10px_50px_rgba(0,0,0,0.6)] overflow-y-auto"
        >
          <div className="mb-4">
            <h3 className="text-white font-semibold">Chat — ask about the document</h3>
            <p className="text-xs text-white/70">The assistant will answer using the analyzed document context.</p>
          </div>

          <div className="flex flex-col gap-3">
            {messages.map((m, i) => (
              <div
                key={i}
                className={`max-w-full p-3 rounded-2xl ${
                  m.role === "user" ? "ml-auto bg-blue-500/90 text-white" : "mr-auto bg-white/10 text-white"
                }`}
              >
                {m.text}
              </div>
            ))}
          </div>
        </motion.div>

        <div className="mt-4 flex items-center gap-3">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
            placeholder={summaryArr.length ? "Ask something about the document..." : "Upload a document first..."}
            className="flex-1 px-4 py-3 rounded-2xl bg-white/6 text-white border border-white/10 focus:outline-none focus:ring-2 focus:ring-blue-500/30"
            disabled={analyzing || summaryArr.length === 0}
          />
          <button
            onClick={handleSend}
            disabled={!input.trim() || analyzing || summaryArr.length === 0}
            className="px-4 py-3 rounded-2xl bg-blue-500 text-white font-semibold hover:bg-blue-600 disabled:opacity-50"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
}
