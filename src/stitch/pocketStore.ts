import type { SupabaseClient } from "@supabase/supabase-js";
import { supabase } from "@/lib/supabaseClient";
import { isRlsPermissionError } from "./trialService";

export type VatOptionId = "22" | "10" | "4" | "forfettario_0" | "reverse_0";
export type BonusOptionId = "none" | "casa_50" | "eco_65" | "barriere_75" | "altri_36";

export interface VatOption {
  id: VatOptionId;
  rate: number;
  label: string;
  shortLabel: string;
  description: string;
  pdfNote?: string;
}

export interface BonusOption {
  id: BonusOptionId;
  rate: number;
  label: string;
  shortLabel: string;
  description: string;
}

export const VAT_OPTIONS: VatOption[] = [
  {
    id: "22",
    rate: 22,
    label: "22% - Aliquota Ordinaria",
    shortLabel: "IVA 22%",
    description: "Predefinita per forniture, beni e manutenzioni su non residenziale",
  },
  {
    id: "10",
    rate: 10,
    label: "10% - IVA Agevolata",
    shortLabel: "IVA 10%",
    description: "Manutenzioni ordinarie/straordinarie residenziali, ristrutturazioni e restauro",
  },
  {
    id: "4",
    rate: 4,
    label: "4% - IVA Agevolata Prima Casa / Barriere",
    shortLabel: "IVA 4%",
    description: "Costruzione prima casa o opere superamento barriere architettoniche",
  },
  {
    id: "forfettario_0",
    rate: 0,
    label: "0% - Regime Forfettario",
    shortLabel: "0% Forfettario",
    description: "Non imponibile art. 1 c. 54-89 L. 190/2014",
    pdfNote: "Operazione non imponibile art. 1 c. 54-89 L. 190/2014",
  },
  {
    id: "reverse_0",
    rate: 0,
    label: "0% - Reverse Charge Edilizia",
    shortLabel: "0% Reverse Charge",
    description: "Inversione contabile art. 17 c. 6 lett. a DPR 633/72",
    pdfNote: "Inversione contabile art. 17 c. 6 lett. a DPR 633/72",
  },
];

export const BONUS_OPTIONS: BonusOption[] = [
  {
    id: "none",
    rate: 0,
    label: "Nessuna detrazione (0%)",
    shortLabel: "Nessuna",
    description: "Nessuna agevolazione fiscale applicata",
  },
  {
    id: "casa_50",
    rate: 50,
    label: "50% - Bonus Ristrutturazioni Casa",
    shortLabel: "Bonus Casa 50%",
    description: "Recupero IRPEF in 10 anni su abitazione principale",
  },
  {
    id: "eco_65",
    rate: 65,
    label: "65% - Ecobonus Risparmio Energetico",
    shortLabel: "Ecobonus 65%",
    description: "Interventi di efficientamento energetico",
  },
  {
    id: "barriere_75",
    rate: 75,
    label: "75% - Bonus Barriere Architettoniche",
    shortLabel: "Barriere 75%",
    description: "Infissi, rampe, montascale e bagni accessibili",
  },
  {
    id: "altri_36",
    rate: 36,
    label: "36% - Bonus Ristrutturazioni / Altri Immobili",
    shortLabel: "Bonus 36%",
    description: "Recupero IRPEF in 10 anni su altri immobili",
  },
];

export type ChatReadStatus = "Letto" | "Inviato" | "Bozza";

export interface PocketSettings {
  hourlyRate: number;
  defaultVatId: VatOptionId;
  defaultBonusId: BonusOptionId;
}

export interface PocketChat {
  id: string;
  clientName: string;
  clientPhone: string;
  description: string;
  amount: number; // Imponibile €
  vatOptionId: VatOptionId;
  bonusOptionId: BonusOptionId;
  photoDataUrl?: string;
  status: ChatReadStatus;
  updatedAt: string;
}

const SETTINGS_KEY = "casalavoro_pocket_settings_v2";
const CHATS_KEY = "casalavoro_pocket_chats_v2";
const ACTIVE_CHAT_KEY = "casalavoro_pocket_active_chat_v1";

export const DEFAULT_SETTINGS: PocketSettings = {
  hourlyRate: 35,
  defaultVatId: "22",
  defaultBonusId: "none",
};

export const DEFAULT_CHATS: PocketChat[] = [
  {
    id: "marco",
    clientName: "Marco Bellini",
    clientPhone: "+39 348 123 4567",
    description: "Ristrutturazione Bagno (9 mq) · Via Roma 42",
    amount: 4380,
    vatOptionId: "10",
    bonusOptionId: "casa_50",
    status: "Letto",
    updatedAt: "Oggi, 14:22",
  },
  {
    id: "elena",
    clientName: "Elena Rossi",
    clientPhone: "+39 349 812 3301",
    description: "Impianto Idraulico & Caldaia · Viale Monza 118",
    amount: 2136,
    vatOptionId: "10",
    bonusOptionId: "eco_65",
    status: "Inviato",
    updatedAt: "Oggi, 11:32",
  },
  {
    id: "colombo",
    clientName: "Ing. Roberto Colombo",
    clientPhone: "+39 335 882 1940",
    description: "Posa Parquet Rovere (85 mq) · Corso Sempione 8",
    amount: 5909,
    vatOptionId: "22",
    bonusOptionId: "none",
    status: "Letto",
    updatedAt: "Ieri, 18:45",
  },
];

export function isUuid(value?: string | null): boolean {
  return Boolean(
    value &&
      /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
        value
      )
  );
}

export function getVatOption(id?: unknown): VatOption {
  const str = String(id ?? "");
  const found = VAT_OPTIONS.find((v) => v.id === str);
  if (found) return found;
  if (str === "10") return VAT_OPTIONS[1];
  if (str === "4") return VAT_OPTIONS[2];
  return VAT_OPTIONS[0]; // 22% Ordinaria
}

export function getBonusOption(id?: unknown, legacyBool?: boolean): BonusOption {
  const str = String(id ?? "");
  const found = BONUS_OPTIONS.find((b) => b.id === str);
  if (found) return found;
  if (legacyBool === true) return BONUS_OPTIONS[1]; // 50%
  return BONUS_OPTIONS[0]; // 0% Nessuna
}

export function getPocketSettings(): PocketSettings {
  try {
    const raw = localStorage.getItem(SETTINGS_KEY);
    if (!raw) return DEFAULT_SETTINGS;
    const parsed = JSON.parse(raw);
    const hourlyRate = Number(parsed.hourlyRate);
    return {
      hourlyRate:
        Number.isFinite(hourlyRate) && hourlyRate >= 5
          ? hourlyRate
          : DEFAULT_SETTINGS.hourlyRate,
      defaultVatId: getVatOption(parsed.defaultVatId).id,
      defaultBonusId: getBonusOption(parsed.defaultBonusId).id,
    };
  } catch {
    return DEFAULT_SETTINGS;
  }
}

export function savePocketSettings(settings: PocketSettings): PocketSettings {
  const clean: PocketSettings = {
    hourlyRate: Math.max(5, Math.round(settings.hourlyRate * 100) / 100),
    defaultVatId: getVatOption(settings.defaultVatId).id,
    defaultBonusId: getBonusOption(settings.defaultBonusId).id,
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
    if (raw === null) return DEFAULT_CHATS;
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return DEFAULT_CHATS;
    return parsed.map((item) => ({
      ...item,
      vatOptionId: getVatOption(item.vatOptionId ?? item.vatRate).id,
      bonusOptionId: getBonusOption(item.bonusOptionId, item.bonusCasa50).id,
    }));
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
  const found = chats.find((c) => c.id === activeId) || chats[0];
  if (found) return found;
  const settings = getPocketSettings();
  return {
    id: "",
    clientName: "",
    clientPhone: "+39 ",
    description: "",
    amount: 0,
    vatOptionId: settings.defaultVatId,
    bonusOptionId: settings.defaultBonusId,
    status: "Bozza",
    updatedAt: "",
  };
}

function formatRowUpdatedAt(iso?: string | null): string {
  if (!iso) {
    return `Oggi, ${new Date().toLocaleTimeString("it-IT", {
      hour: "2-digit",
      minute: "2-digit",
    })}`;
  }
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return String(iso);
  const now = new Date();
  const sameDay =
    d.getDate() === now.getDate() &&
    d.getMonth() === now.getMonth() &&
    d.getFullYear() === now.getFullYear();
  const timeStr = d.toLocaleTimeString("it-IT", {
    hour: "2-digit",
    minute: "2-digit",
  });
  return sameDay
    ? `Oggi, ${timeStr}`
    : `${d.toLocaleDateString("it-IT")} ${timeStr}`;
}

function mapSupabaseRowToChat(row: Record<string, unknown>): PocketChat {
  const rawStatus = String(row.status || "Bozza");
  const status: ChatReadStatus =
    rawStatus === "Letto" || rawStatus === "Inviato" ? rawStatus : "Bozza";
  return {
    id: String(row.id || `quote-${Date.now()}`),
    clientName: String(row.client_name || "Cliente Cantiere"),
    clientPhone: String(row.client_phone || "+39 348 123 4567"),
    description: String(row.description || ""),
    amount: Number(row.amount) || 0,
    vatOptionId: getVatOption(row.vat_option_id).id,
    bonusOptionId: getBonusOption(row.bonus_option_id).id,
    photoDataUrl:
      typeof row.photo_url === "string" && row.photo_url.length > 0
        ? row.photo_url
        : undefined,
    status,
    updatedAt: formatRowUpdatedAt(
      typeof row.updated_at === "string"
        ? row.updated_at
        : typeof row.created_at === "string"
          ? row.created_at
          : null
    ),
  };
}

export async function fetchCloudQuotes(): Promise<PocketChat[] | null> {
  try {
    const client = supabase as SupabaseClient;
    const {
      data: { session },
    } = await client.auth.getSession();
    if (!session?.user?.id) return null;

    const { data, error } = await client
      .from("preventivi")
      .select("*")
      .eq("user_id", session.user.id)
      .order("updated_at", { ascending: false });

    if (error || !Array.isArray(data) || data.length === 0) return null;

    const cloudChats = data.map((row) =>
      mapSupabaseRowToChat(row as Record<string, unknown>)
    );
    savePocketChats(cloudChats);
    return cloudChats;
  } catch {
    return null;
  }
}

export interface CloudSaveResult {
  chat: PocketChat;
  syncedToCloud: boolean;
  rlsDenied: boolean;
  errorMessage?: string;
}

export async function saveQuoteWithCloudSync(input: {
  existingId?: string;
  clientName: string;
  clientPhone: string;
  description: string;
  amount: number;
  vatOptionId: VatOptionId;
  bonusOptionId: BonusOptionId;
  photoDataUrl?: string;
  status?: ChatReadStatus;
}): Promise<CloudSaveResult> {
  const localSaved = saveQuoteAsActiveChat(input);

  try {
    const client = supabase as SupabaseClient;
    const {
      data: { session },
    } = await client.auth.getSession();
    if (!session?.user?.id) {
      return { chat: localSaved, syncedToCloud: false, rlsDenied: false };
    }

    const payload = {
      user_id: session.user.id,
      client_name: localSaved.clientName,
      client_phone: localSaved.clientPhone,
      description: localSaved.description,
      amount: localSaved.amount,
      vat_option_id: localSaved.vatOptionId,
      bonus_option_id: localSaved.bonusOptionId,
      photo_url: localSaved.photoDataUrl || null,
      status: input.status || localSaved.status,
    };

    const targetId = input.existingId || localSaved.id;
    const response = isUuid(targetId)
      ? await client
          .from("preventivi")
          .update(payload)
          .eq("id", targetId)
          .eq("user_id", session.user.id)
          .select()
          .single()
      : await client.from("preventivi").insert(payload).select().single();

    if (response.error) {
      if (isRlsPermissionError(response.error)) {
        return {
          chat: localSaved,
          syncedToCloud: false,
          rlsDenied: true,
          errorMessage: response.error.message,
        };
      }
      return {
        chat: localSaved,
        syncedToCloud: false,
        rlsDenied: false,
        errorMessage: response.error.message,
      };
    }

    if (response.data) {
      const cloudChat = mapSupabaseRowToChat(
        response.data as Record<string, unknown>
      );
      const chats = getPocketChats().map((c) =>
        c.id === localSaved.id || c.id === cloudChat.id ? cloudChat : c
      );
      savePocketChats(chats);
      setActiveChatId(cloudChat.id);
      return { chat: cloudChat, syncedToCloud: true, rlsDenied: false };
    }

    return { chat: localSaved, syncedToCloud: true, rlsDenied: false };
  } catch (err) {
    if (isRlsPermissionError(err)) {
      return {
        chat: localSaved,
        syncedToCloud: false,
        rlsDenied: true,
      };
    }
    return { chat: localSaved, syncedToCloud: false, rlsDenied: false };
  }
}

export function saveQuoteAsActiveChat(input: {
  existingId?: string;
  clientName: string;
  clientPhone: string;
  description: string;
  amount: number;
  vatOptionId: VatOptionId;
  bonusOptionId: BonusOptionId;
  photoDataUrl?: string;
  status?: ChatReadStatus;
}): PocketChat {
  const chats = getPocketChats();
  const cleanName = input.clientName.trim() || "Cliente Cantiere";
  const cleanPhone = input.clientPhone.trim() || "+39 348 123 4567";
  const cleanDesc = input.description.trim();

  const existingIndex = input.existingId
    ? chats.findIndex((c) => c.id === input.existingId)
    : chats.findIndex(
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
    vatOptionId: getVatOption(input.vatOptionId).id,
    bonusOptionId: getBonusOption(input.bonusOptionId).id,
    photoDataUrl: input.photoDataUrl,
    status: input.status || "Bozza",
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

export async function markChatAsSentWithCloudSync(chatId: string): Promise<{
  chats: PocketChat[];
  rlsDenied: boolean;
}> {
  const updated = markChatAsSent(chatId);
  try {
    const client = supabase as SupabaseClient;
    const {
      data: { session },
    } = await client.auth.getSession();
    if (session?.user?.id && isUuid(chatId)) {
      const { error } = await client
        .from("preventivi")
        .update({ status: "Inviato" })
        .eq("id", chatId)
        .eq("user_id", session.user.id);
      if (error && isRlsPermissionError(error)) {
        return { chats: updated, rlsDenied: true };
      }
    }
  } catch (err) {
    if (isRlsPermissionError(err)) {
      return { chats: updated, rlsDenied: true };
    }
  }
  return { chats: updated, rlsDenied: false };
}

export async function deleteQuoteWithCloudSync(chatId: string): Promise<{
  chats: PocketChat[];
  rlsDenied: boolean;
}> {
  const chats = getPocketChats();
  const updated = chats.filter((c) => c.id !== chatId);
  savePocketChats(updated);
  if (getActiveChatId() === chatId) {
    setActiveChatId(updated[0]?.id || "");
  }
  try {
    const client = supabase as SupabaseClient;
    const {
      data: { session },
    } = await client.auth.getSession();
    if (session?.user?.id && isUuid(chatId)) {
      const { error } = await client
        .from("preventivi")
        .delete()
        .eq("id", chatId)
        .eq("user_id", session.user.id);
      if (error && isRlsPermissionError(error)) {
        savePocketChats(chats);
        return { chats, rlsDenied: true };
      }
    }
  } catch (err) {
    if (isRlsPermissionError(err)) {
      savePocketChats(chats);
      return { chats, rlsDenied: true };
    }
  }
  return { chats, rlsDenied: false };
}

export function calculateTotals(
  amount: number,
  vatOptionId: VatOptionId,
  bonusOptionId: BonusOptionId
) {
  const vatOption = getVatOption(vatOptionId);
  const bonusOption = getBonusOption(bonusOptionId);
  const safeAmount = Number.isFinite(amount) && amount > 0 ? amount : 0;
  const vatAmount = safeAmount * (vatOption.rate / 100);
  const total = safeAmount + vatAmount;
  const detrazioneAmount = bonusOption.rate > 0 ? total * (bonusOption.rate / 100) : 0;
  const netAfterBonus = total - detrazioneAmount;
  const annualQuota = detrazioneAmount / 10;

  return {
    imponibile: safeAmount,
    vatOption,
    bonusOption,
    vatAmount,
    total,
    detrazioneAmount,
    netAfterBonus,
    annualQuota,
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
  const { vatOption, bonusOption, vatAmount, total, detrazioneAmount, netAfterBonus } =
    calculateTotals(chat.amount, chat.vatOptionId, chat.bonusOptionId);
  const clientLabel = (chat.clientName || "").trim() || "Cliente";

  const lines = [
    `Ciao ${clientLabel}, ecco il preventivo per: ${chat.description}.`,
    `Imponibile: ${formatEuro(chat.amount)} · ${vatOption.label}: ${formatEuro(vatAmount)}`,
  ];

  if (vatOption.pdfNote) {
    lines.push(`Nota IVA: ${vatOption.pdfNote}.`);
  }

  if (bonusOption.rate > 0) {
    lines.push(
      `Detrazione applicabile (${bonusOption.label}): risparmio fiscale stimato ${formatEuro(detrazioneAmount)} (${bonusOption.rate}% in 10 anni tramite bonifico parlante, costo netto ${formatEuro(netAfterBonus)}).`
    );
  }

  lines.push(`Totale: ${formatEuro(total)}`);
  lines.push(
    "Ti allego qui sotto il documento PDF completo. Resto a disposizione per confermare l'intervento."
  );
  return lines.join("\n");
}

export interface ItalianPhoneValidation {
  isValid: boolean;
  formattedPhone: string;
  nationalDigits: string;
}

export function formatItalianWhatsAppPhone(phone: string): ItalianPhoneValidation {
  let digits = (phone || "").replace(/\D/g, "");
  if (digits.startsWith("0039")) {
    digits = digits.slice(4);
  } else if (digits.startsWith("39") && digits.length > 11) {
    digits = digits.slice(2);
  }

  if (!digits || digits.length < 9) {
    return {
      isValid: false,
      formattedPhone: "",
      nationalDigits: digits,
    };
  }

  return {
    isValid: true,
    formattedPhone: `39${digits}`,
    nationalDigits: digits,
  };
}

export function buildWhatsAppUrl(phone: string, message: string): string {
  const { isValid, formattedPhone } = formatItalianWhatsAppPhone(phone);
  if (isValid) {
    return `https://wa.me/${formattedPhone}?text=${encodeURIComponent(message)}`;
  }
  return `https://wa.me/?text=${encodeURIComponent(message)}`;
}
