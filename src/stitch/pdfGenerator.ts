import {
  buildWhatsAppMessage,
  calculateTotals,
  formatEuro,
  formatItalianWhatsAppPhone,
  type PocketChat,
} from "./pocketStore";

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
  const totals = calculateTotals(chat.amount, chat.vatOptionId, chat.bonusOptionId);
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
  addText(58, 752, "F1", 10, `PREVENTIVO  -  Data: ${dateStr}`);

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
  addText(48, cursorY, "F2", 12, "RIEPILOGO ECONOMICO E FISCALE");
  cursorY -= 22;
  addText(48, cursorY, "F1", 11, "Imponibile lavori:");
  addText(410, cursorY, "F2", 11, formatEuro(totals.imponibile));
  cursorY -= 18;
  addText(48, cursorY, "F1", 11, `${totals.vatOption.label}:`);
  addText(410, cursorY, "F2", 11, formatEuro(totals.vatAmount));
  cursorY -= 16;

  if (totals.vatOption.pdfNote) {
    ops.push("0.35 0.40 0.48 rg");
    addText(48, cursorY, "F1", 9, totals.vatOption.pdfNote);
    ops.push("0.10 0.12 0.15 rg");
    cursorY -= 14;
  }

  addLine(48, cursorY, 547, cursorY);
  cursorY -= 24;

  // Total highlight box
  ops.push(`0.95 0.97 0.99 rg 48 ${cursorY - 8} 499 30 re f`);
  ops.push("0.10 0.12 0.15 rg");
  addText(58, cursorY + 2, "F2", 13, "TOTALE DA PAGARE:");
  addText(410, cursorY + 2, "F2", 14, formatEuro(totals.total));
  cursorY -= 36;

  if (totals.bonusOption.rate > 0) {
    ops.push(`0.93 0.98 0.95 rg 48 ${cursorY - 26} 499 44 re f`);
    ops.push("0.07 0.48 0.22 rg");
    addText(58, cursorY + 2, "F2", 10, totals.bonusOption.label);
    const noteLines = wrapText(
      `Risparmio fiscale stimato per il committente: ${formatEuro(totals.detrazioneAmount)} (${totals.bonusOption.rate}% detraibile in 10 anni tramite bonifico parlante). Costo netto stimato: ${formatEuro(totals.netAfterBonus)}.`,
      82
    );
    let boxY = cursorY - 11;
    for (const line of noteLines.slice(0, 2)) {
      addText(58, boxY, "F1", 9, line);
      boxY -= 12;
    }
    cursorY -= 44;
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
  a.rel = "noopener";
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  setTimeout(() => URL.revokeObjectURL(url), 30000);
  return filename;
}

export type DirectWhatsAppPdfResult =
  | { ok: true; filename: string; waUrl: string }
  | { ok: false; errorMessage: string };

export function sendQuotePdfDirectlyToWhatsApp(chat: PocketChat): DirectWhatsAppPdfResult {
  const { isValid, formattedPhone } = formatItalianWhatsAppPhone(chat.clientPhone);
  if (!isValid) {
    return {
      ok: false,
      errorMessage: "Inserisci un numero di cellulare italiano valido prima di inviare",
    };
  }

  const filename = downloadQuotePdf(chat);
  const message = buildWhatsAppMessage(chat);
  const waUrl = `https://wa.me/${formattedPhone}?text=${encodeURIComponent(message)}`;

  const a = document.createElement("a");
  a.href = waUrl;
  a.target = "_blank";
  a.rel = "noopener noreferrer";
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);

  return { ok: true, filename, waUrl };
}
