export type VatRate = 10 | 22;

export type ChatReadStatus = "Letto" | "Inviato" | "Bozza";

export interface PocketSettings {
  hourlyRate: number;
  defaultVat: VatRate;
}

export interface PocketChat {
  id: string;
  clientName: string;
  clientPhone: string;
  description: string;
  amount: number; // Imponibile €
  vatRate: VatRate;
  bonusCasa50: boolean;
  photoDataUrl?: string;
  status: ChatReadStatus;
  updatedAt: string;
}

const SETTINGS_KEY = "casalavoro_pocket_settings_v1";
const CHATS_KEY = "casalavoro_pocket_chats_v1";
const ACTIVE_CHAT_KEY = "casalavoro_pocket_active_chat_v1";

export const DEFAULT_SETTINGS: PocketSettings = {
  hourlyRate: 35,
  defaultVat: 10,
};

export const DEFAULT_CHATS: PocketChat[] = [
  {
    id: "marco",
    clientName: "Marco Bellini",
    clientPhone: "+39 348 123 4567",
    description: "Ristrutturazione Bagno (9 mq) · Via Roma 42",
    amount: 4380,
    vatRate: 10,
    bonusCasa50: true,
    status: "Letto",
    updatedAt: "Oggi, 14:22",
  },
  {
    id: "elena",
    clientName: "Elena Rossi",
    clientPhone: "+39 349 812 3301",
    description: "Impianto Idraulico & Caldaia · Viale Monza 118",
    amount: 2136,
    vatRate: 10,
    bonusCasa50: false,
    status: "Inviato",
    updatedAt: "Oggi, 11:32",
  },
  {
    id: "colombo",
    clientName: "Ing. Roberto Colombo",
    clientPhone: "+39 335 882 1940",
    description: "Posa Parquet Rovere (85 mq) · Corso Sempione 8",
    amount: 5909,
    vatRate: 10,
    bonusCasa50: true,
    status: "Letto",
    updatedAt: "Ieri, 18:45",
  },
];

export function getPocketSettings(): PocketSettings {
  try {
    const raw = localStorage.getItem(SETTINGS_KEY);
    if (!raw) return DEFAULT_SETTINGS;
    const parsed = JSON.parse(raw);
    const hourlyRate = Number(parsed.hourlyRate);
    const defaultVat: VatRate = parsed.defaultVat === 22 ? 22 : 10;
    return {
      hourlyRate: Number.isFinite(hourlyRate) && hourlyRate > 0 ? hourlyRate : DEFAULT_SETTINGS.hourlyRate,
      defaultVat,
    };
  } catch {
    return DEFAULT_SETTINGS;
  }
}

export function savePocketSettings(settings: PocketSettings): PocketSettings {
  const clean: PocketSettings = {
    hourlyRate: Math.max(5, Math.round(settings.hourlyRate * 100) / 100),
    defaultVat: settings.defaultVat === 22 ? 22 : 10,
  };
  try {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(clean));
  } catch {
    // Ignore storage quota errors
  }
  return clean;
}

export function getPocketChats(): PocketChat[] {
  try {
    const raw = localStorage.getItem(CHATS_KEY);
    if (!raw) return DEFAULT_CHATS;
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed) || parsed.length === 0) return DEFAULT_CHATS;
    return parsed;
  } catch {
    return DEFAULT_CHATS;
  }
}

export function savePocketChats(chats: PocketChat[]): void {
  try {
    localStorage.setItem(CHATS_KEY, JSON.stringify(chats));
  } catch {
    // Ignore storage quota errors
  }
}

export function getActiveChatId(): string {
  try {
    return localStorage.getItem(ACTIVE_CHAT_KEY) || "marco";
  } catch {
    return "marco";
  }
}

export function setActiveChatId(id: string): void {
  try {
    localStorage.setItem(ACTIVE_CHAT_KEY, id);
  } catch {
    // Ignore storage quota errors
  }
}

export function getActiveChat(): PocketChat {
  const chats = getPocketChats();
  const activeId = getActiveChatId();
  return chats.find((c) => c.id === activeId) || chats[0];
}

export function saveQuoteAsActiveChat(input: {
  clientName: string;
  clientPhone: string;
  description: string;
  amount: number;
  vatRate: VatRate;
  bonusCasa50: boolean;
  photoDataUrl?: string;
}): PocketChat {
  const chats = getPocketChats();
  const cleanName = input.clientName.trim() || "Cliente Cantiere";
  const cleanPhone = input.clientPhone.trim() || "+39 348 123 4567";
  const cleanDesc = input.description.trim();

  const existingIndex = chats.findIndex(
    (c) => c.clientName.toLowerCase() === cleanName.toLowerCase()
  );

  const nowTime = new Date().toLocaleTimeString("it-IT", {
    hour: "2-digit",
    minute: "2-digit",
  });

  const nextChat: PocketChat = {
    id: existingIndex >= 0 ? chats[existingIndex].id : `quote-${Date.now()}`,
    clientName: cleanName,
    clientPhone: cleanPhone,
    description: cleanDesc,
    amount: input.amount,
    vatRate: input.vatRate,
    bonusCasa50: input.bonusCasa50,
    photoDataUrl: input.photoDataUrl,
    status: "Bozza",
    updatedAt: `Oggi, ${nowTime}`,
  };

  const updated =
    existingIndex >= 0
      ? chats.map((c, idx) => (idx === existingIndex ? nextChat : c))
      : [nextChat, ...chats];

  savePocketChats(updated);
  setActiveChatId(nextChat.id);
  return nextChat;
}

export function markChatAsSent(chatId: string): PocketChat[] {
  const chats = getPocketChats();
  const nowTime = new Date().toLocaleTimeString("it-IT", {
    hour: "2-digit",
    minute: "2-digit",
  });
  const updated = chats.map((c) =>
    c.id === chatId ? { ...c, status: "Inviato" as const, updatedAt: `Oggi, ${nowTime}` } : c
  );
  savePocketChats(updated);
  return updated;
}

export function calculateTotals(amount: number, vatRate: VatRate, bonusCasa50: boolean) {
  const safeAmount = Number.isFinite(amount) && amount > 0 ? amount : 0;
  const vatAmount = safeAmount * (vatRate / 100);
  const total = safeAmount + vatAmount;
  const netAfterBonus = bonusCasa50 ? total * 0.5 : total;
  return {
    imponibile: safeAmount,
    vatAmount,
    total,
    netAfterBonus,
  };
}

export function formatEuro(value: number): string {
  return new Intl.NumberFormat("it-IT", {
    style: "currency",
    currency: "EUR",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
}

export function getInitials(name: string): string {
  const parts = name
    .trim()
    .split(/\s+/)
    .filter((p) => p.length > 0 && !p.endsWith("."));
  if (parts.length === 0) return "CL";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
}

export function buildWhatsAppMessage(chat: PocketChat): string {
  const { total, netAfterBonus } = calculateTotals(chat.amount, chat.vatRate, chat.bonusCasa50);
  const firstName = chat.clientName.split(" ")[0] || "Cliente";
  const lines = [
    `Ciao ${firstName}, ecco il preventivo per: ${chat.description}.`,
    `Totale (IVA ${chat.vatRate}% incl.): ${formatEuro(total)}`,
  ];
  if (chat.bonusCasa50) {
    lines.push(`Con Bonus Casa 50%: costo netto stimato ${formatEuro(netAfterBonus)}.`);
  }
  lines.push("Resto a disposizione per confermare l'intervento.");
  return lines.join("\n");
}

export function buildWhatsAppUrl(phone: string, message: string): string {
  const digits = phone.replace(/[^\d]/g, "");
  const cleanPhone = digits.length >= 8 ? digits : "393481234567";
  return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`;
}
