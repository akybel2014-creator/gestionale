import { calculateTotals, formatEuro, type PocketChat } from "./pocketStore";

function sanitizePdfText(input: string): string {
  return input
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/€/g, "EUR ")
    .replace(/[^\x20-\x7E]/g, " ")
    .replace(/\\/g, "\\\\")
    .replace(/\(/g, "\\(")
    .replace(/\)/g, "\\)");
}

function wrapText(text: string, maxChars: number): string[] {
  const words = text.trim().split(/\s+/);
  const lines: string[] = [];
  let current = "";
  for (const word of words) {
    if (!current) {
      current = word;
    } else if (current.length + 1 + word.length <= maxChars) {
      current += " " + word;
    } else {
      lines.push(current);
      current = word;
    }
  }
  if (current) lines.push(current);
  return lines.length > 0 ? lines : ["-"];
}

export function buildPdfFilename(clientName: string): string {
  const slug = (clientName || "Cliente")
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "");
  return `Preventivo_${slug || "cliente"}.pdf`;
}

export function generateQuotePdfBlob(chat: PocketChat): Blob {
  const totals = calculateTotals(chat.amount, chat.vatRate, chat.bonusCasa50);
  const dateStr = new Date().toLocaleDateString("it-IT");

  const ops: string[] = [];
  const addText = (x: number, y: number, font: "F1" | "F2", size: number, text: string) => {
    ops.push(`BT /${font} ${size} Tf ${x} ${y} Td (${sanitizePdfText(text)}) Tj ET`);
  };
  const addLine = (x1: number, y1: number, x2: number, y2: number) => {
    ops.push(`0.8 w 0.85 0.88 0.91 RG ${x1} ${y1} m ${x2} ${y2} l S`);
  };

  // Header band
  ops.push("0.12 0.16 0.22 rg 40 735 515 65 re f");
  ops.push("1 1 1 rg");
  addText(58, 774, "F2", 20, "CasaLavoroPRO");
  addText(58, 752, "F1", 10, `PREVENTIVO RAPIDO  -  Data: ${dateStr}`);

  // Client section
  ops.push("0.10 0.12 0.15 rg");
  addText(48, 700, "F2", 12, "CLIENTE");
  addText(48, 682, "F1", 11, `${chat.clientName} (${chat.clientPhone})`);
  addLine(48, 666, 547, 666);

  // Description section
  addText(48, 642, "F2", 12, "DESCRIZIONE LAVORO");
  const descLines = wrapText(chat.description || "Intervento artigianale", 76);
  let cursorY = 622;
  for (const line of descLines.slice(0, 8)) {
    addText(48, cursorY, "F1", 11, line);
    cursorY -= 17;
  }

  cursorY -= 12;
  addLine(48, cursorY, 547, cursorY);
  cursorY -= 26;

  // Totals section
  addText(48, cursorY, "F2", 12, "RIEPILOGO ECONOMICO");
  cursorY -= 22;
  addText(48, cursorY, "F1", 11, "Imponibile lavori:");
  addText(410, cursorY, "F2", 11, formatEuro(totals.imponibile));
  cursorY -= 18;
  addText(48, cursorY, "F1", 11, `IVA (${chat.vatRate}%):`);
  addText(410, cursorY, "F2", 11, formatEuro(totals.vatAmount));
  cursorY -= 14;
  addLine(48, cursorY, 547, cursorY);
  cursorY -= 24;

  // Total highlight box
  ops.push(`0.95 0.97 0.99 rg 48 ${cursorY - 8} 499 30 re f`);
  ops.push("0.10 0.12 0.15 rg");
  addText(58, cursorY + 2, "F2", 13, "TOTALE PREVENTIVO (IVA incl.):");
  addText(410, cursorY + 2, "F2", 14, formatEuro(totals.total));
  cursorY -= 32;

  if (chat.bonusCasa50) {
    ops.push("0.09 0.55 0.25 rg");
    addText(48, cursorY, "F2", 11, `Bonus Casa 50% applicato - Costo netto stimato: ${formatEuro(totals.netAfterBonus)}`);
    cursorY -= 22;
  }

  // Footer
  ops.push("0.40 0.45 0.52 rg");
  addText(48, 60, "F1", 9, "Documento generato con CasaLavoroPRO - Valido 30 giorni.");

  const contentStream = ops.join("\n");

  const objects: string[] = [
    "1 0 obj\n<< /Type /Catalog /Pages 2 0 R >>\nendobj\n",
    "2 0 obj\n<< /Type /Pages /Kids [3 0 R] /Count 1 >>\nendobj\n",
    "3 0 obj\n<< /Type /Page /Parent 2 0 R /MediaBox [0 0 595 842] /Contents 4 0 R /Resources << /Font << /F1 5 0 R /F2 6 0 R >> >> >>\nendobj\n",
    `4 0 obj\n<< /Length ${contentStream.length} >>\nstream\n${contentStream}\nendstream\nendobj\n`,
    "5 0 obj\n<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>\nendobj\n",
    "6 0 obj\n<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold >>\nendobj\n",
  ];

  let pdf = "%PDF-1.4\n";
  const offsets: number[] = [0];
  for (const obj of objects) {
    offsets.push(pdf.length);
    pdf += obj;
  }
  const xrefStart = pdf.length;
  pdf += `xref\n0 ${objects.length + 1}\n`;
  pdf += "0000000000 65535 f \n";
  for (let i = 1; i < offsets.length; i++) {
    pdf += `${String(offsets[i]).padStart(10, "0")} 00000 n \n`;
  }
  pdf += `trailer\n<< /Size ${objects.length + 1} /Root 1 0 R >>\nstartxref\n${xrefStart}\n%%EOF`;

  return new Blob([pdf], { type: "application/pdf" });
}

export function downloadQuotePdf(chat: PocketChat): string {
  const filename = buildPdfFilename(chat.clientName);
  const blob = generateQuotePdfBlob(chat);
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  setTimeout(() => URL.revokeObjectURL(url), 1500);
  return filename;
}

export async function shareOrDownloadQuotePdf(
  chat: PocketChat,
  messageText: string
): Promise<{ method: "share" | "download"; filename: string }> {
  const filename = buildPdfFilename(chat.clientName);
  const blob = generateQuotePdfBlob(chat);
  const file = new File([blob], filename, { type: "application/pdf" });

  if (
    typeof navigator !== "undefined" &&
    typeof navigator.share === "function" &&
    typeof navigator.canShare === "function" &&
    navigator.canShare({ files: [file] })
  ) {
    try {
      await navigator.share({
        title: `Preventivo ${chat.clientName}`,
        text: messageText,
        files: [file],
      });
      return { method: "share", filename };
    } catch {
      // Fall back to direct download if user dismisses or share fails
    }
  }

  downloadQuotePdf(chat);
  return { method: "download", filename };
}
