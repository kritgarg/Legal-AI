// src/lib/pdfReader.js
export async function extractTextFromPDF(file) {
  if (typeof window === "undefined") {
    throw new Error("PDF parsing only works in the browser");
  }

  // Use webpack build (safe for Next.js, no "canvas")
  const pdfjsLib = await import("pdfjs-dist/webpack");

  // Load PDF worker dynamically
  const workerSrc = await import("pdfjs-dist/build/pdf.worker.min.mjs");
  pdfjsLib.GlobalWorkerOptions.workerSrc = workerSrc;

  // Read file as ArrayBuffer
  const arrayBuffer = await file.arrayBuffer();
  const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;

  let textContent = "";

  for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
    const page = await pdf.getPage(pageNum);
    const text = await page.getTextContent();
    text.items.forEach((item) => {
      textContent += item.str + " ";
    });
  }

  return textContent.trim();
}
