/**
 * Browser-side file text extraction utility.
 *
 * pdfjs-dist and mammoth are imported dynamically (not at module level)
 * to avoid SSR crashes — they use browser-only APIs (DOMMatrix, etc.).
 *
 * Supports:
 *   - .txt  → FileReader.readAsText
 *   - .pdf  → pdfjs-dist (getDocument → getTextContent per page)
 *   - .docx → mammoth (extractRawText)
 *   - .doc  → attempt raw text extraction, falls back with conversion hint
 */

// ---------------------------------------------------------------------------
// Supported file type helpers
// ---------------------------------------------------------------------------

export const ACCEPTED_MIME_TYPES = [
  "application/pdf",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document", // .docx
  "application/msword", // .doc
  "text/plain",
] as const;

export const ACCEPTED_EXTENSIONS = ".pdf,.docx,.doc,.txt";

export function isAcceptedFile(file: File): boolean {
  // Some browsers report .doc/.docx with generic application/octet-stream;
  // also check the extension as a fallback.
  if (ACCEPTED_MIME_TYPES.includes(file.type as any)) return true;
  const ext = file.name.split(".").pop()?.toLowerCase();
  return ext === "pdf" || ext === "docx" || ext === "doc" || ext === "txt";
}

// ---------------------------------------------------------------------------
// Core parsers
// ---------------------------------------------------------------------------

/** Read a small plain-text file via readAsText. */
async function readAsTextFallback(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => resolve(e.target?.result as string);
    reader.onerror = () => reject(new Error("文件读取失败 / Failed to read file"));
    reader.readAsText(file);
  });
}

/** Extract text from a PDF via pdfjs-dist (dynamically imported to avoid SSR crash). */
async function parsePdf(file: File): Promise<string> {
  const pdfjs = await import("pdfjs-dist");

  // Register worker once
  if (!(pdfjs as any).__workerInited) {
    pdfjs.GlobalWorkerOptions.workerSrc = new URL(
      "pdfjs-dist/build/pdf.worker.min.mjs",
      import.meta.url,
    ).toString();
    (pdfjs as any).__workerInited = true;
  }

  const arrayBuffer = await file.arrayBuffer();
  const data = new Uint8Array(arrayBuffer);
  const pdf = await pdfjs.getDocument({ data }).promise;
  const pageTexts: string[] = [];

  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i);
    const textContent = await page.getTextContent();
    const text = textContent.items.map((item: any) => item.str).join(" ");
    pageTexts.push(text);
  }

  return pageTexts.join("\n\n").trim();
}

/** Extract text from a .docx file via mammoth (dynamically imported). */
async function parseDocx(file: File): Promise<string> {
  const mammoth = await import("mammoth");
  const arrayBuffer = await file.arrayBuffer();
  const result = await mammoth.extractRawText({ arrayBuffer });
  return result.value.trim();
}

/** Best-effort for legacy .doc (binary Word). */
async function parseDoc(file: File): Promise<string> {
  // Some .doc files are actually RTF or plain text inside; try readAsText first.
  const raw = await readAsTextFallback(file);
  const cleaned = raw.replace(/[\x00-\x08\x0b\x0c\x0e-\x1f]/g, "").trim();
  if (cleaned.length > 100) return cleaned;

  // If we got nothing meaningful, throw a descriptive error.
  throw new Error("__DOC_CONVERSION__");
}

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

export interface FileParseResult {
  text: string;
  format: "pdf" | "docx" | "doc" | "txt";
}

/**
 * Extract readable text from a resume file.
 *
 * @throws Error with a user-facing message if parsing fails.
 */
export async function extractTextFromFile(file: File): Promise<FileParseResult> {
  const ext = file.name.split(".").pop()?.toLowerCase();

  if (ext === "pdf" || file.type === "application/pdf") {
    const text = await parsePdf(file);
    if (!text) throw new Error("PDF 文件内容为空或无法提取文字 / PDF is empty or contains no extractable text");
    return { text, format: "pdf" };
  }

  if (
    ext === "docx" ||
    file.type === "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
  ) {
    const text = await parseDocx(file);
    if (!text) throw new Error("DOCX 文件内容为空 / DOCX file is empty");
    return { text, format: "docx" };
  }

  if (ext === "doc" || file.type === "application/msword") {
    const text = await parseDoc(file);
    return { text, format: "doc" };
  }

  // Fallback: try as plain text
  const text = await readAsTextFallback(file);
  const cleaned = text.replace(/[\x00-\x08\x0b\x0c\x0e-\x1f]/g, "").trim();
  if (!cleaned) throw new Error("文件内容为空 / File is empty");
  return { text, format: "txt" };
}
