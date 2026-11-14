import FingerprintJS from "@fingerprintjs/fingerprintjs";
import type { SupabaseClient } from "@supabase/supabase-js";
import { supabase } from "@/lib/supabaseClient";

export type SubscriptionStatus = "trial" | "active" | "expired";
export type BillingPlanId = "annual" | "monthly";

export const TRIAL_DURATION_DAYS = 14;
const DAY_MS = 24 * 60 * 60 * 1000;
const LOCAL_TRIAL_KEY_PREFIX = "casalavoro_trial_device_v2_";
const FALLBACK_DEVICE_ID_KEY = "casalavoro_fallback_device_id_v1";
const TRIAL_UPDATED_EVENT = "casalavoro-trial-updated";

export interface TrialUserRecord {
  device_id?: string;
  created_at: string;
  trial_ends_at?: string;
  subscription_status: SubscriptionStatus;
  email?: string;
  name?: string;
}

export interface TrialEvaluation {
  deviceId: string | null;
  createdAt: Date;
  trialEndsAt: Date;
  subscriptionStatus: SubscriptionStatus;
  daysRemaining: number;
  isExpired: boolean;
  isActive: boolean;
  isTrial: boolean;
  isReadOnly: boolean;
  badgeText: string;
  source: "supabase_rpc" | "local_fallback";
}

let cachedVisitorId: string | null = null;
let pendingVisitorPromise: Promise<string> | null = null;

export async function getDeviceFingerprint(): Promise<string> {
  if (cachedVisitorId) return cachedVisitorId;
  if (pendingVisitorPromise) return pendingVisitorPromise;

  pendingVisitorPromise = (async () => {
    try {
      const fp = await FingerprintJS.load();
      const result = await fp.get();
      if (result?.visitorId) {
        cachedVisitorId = result.visitorId;
        try {
          localStorage.setItem(FALLBACK_DEVICE_ID_KEY, result.visitorId);
        } catch {
          // Ignore storage errors
        }
        return result.visitorId;
      }
    } catch {
      // Fallback if FingerprintJS is blocked in an unusual browser environment
    }

    try {
      const stored = localStorage.getItem(FALLBACK_DEVICE_ID_KEY);
      if (stored) {
        cachedVisitorId = stored;
        return stored;
      }
      const generated = `dev_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 10)}`;
      localStorage.setItem(FALLBACK_DEVICE_ID_KEY, generated);
      cachedVisitorId = generated;
      return generated;
    } catch {
      return "dev_default_device";
    }
  })();

  try {
    return await pendingVisitorPromise;
  } finally {
    pendingVisitorPromise = null;
  }
}

export function normalizeSubscriptionStatus(raw?: unknown): SubscriptionStatus {
  const val = String(raw || "").trim().toLowerCase();
  if (val === "active") return "active";
  if (val === "expired") return "expired";
  return "trial";
}

export function evaluateTrialState(
  input?: {
    device_id?: string | null;
    created_at?: string | null;
    trial_ends_at?: string | null;
    subscription_status?: string | null;
    status?: string | null;
    is_expired?: boolean | null;
    source?: "supabase_rpc" | "local_fallback";
  } | null,
  now: Date = new Date()
): TrialEvaluation {
  const rawCreated = input?.created_at ? new Date(input.created_at) : null;
  const createdAt =
    rawCreated && !Number.isNaN(rawCreated.getTime()) ? rawCreated : now;

  const rawEnds = input?.trial_ends_at ? new Date(input.trial_ends_at) : null;
  const trialEndsAt =
    rawEnds && !Number.isNaN(rawEnds.getTime())
      ? rawEnds
      : new Date(createdAt.getTime() + TRIAL_DURATION_DAYS * DAY_MS);

  const rawStatus = normalizeSubscriptionStatus(
    input?.status ?? input?.subscription_status
  );

  const isActive = rawStatus === "active";
  const remainingMs = trialEndsAt.getTime() - now.getTime();
  const isExpired =
    !isActive &&
    (input?.is_expired === true ||
      rawStatus === "expired" ||
      remainingMs <= 0);

  const subscriptionStatus: SubscriptionStatus = isActive
    ? "active"
    : isExpired
      ? "expired"
      : "trial";

  const daysRemaining =
    isActive || isExpired
      ? 0
      : Math.max(
          1,
          Math.min(TRIAL_DURATION_DAYS, Math.ceil(remainingMs / DAY_MS))
        );

  const badgeText = isActive
    ? "Abbonamento attivo"
    : isExpired
      ? "Periodo di prova terminato"
      : daysRemaining === 1
        ? "⏱ Prova Gratuita: rimane 1 giorno"
        : `⏱ Prova Gratuita: rimangono ${daysRemaining} giorni`;

  return {
    deviceId: input?.device_id ?? null,
    createdAt,
    trialEndsAt,
    subscriptionStatus,
    daysRemaining,
    isExpired,
    isActive,
    isTrial: subscriptionStatus === "trial",
    isReadOnly: isExpired,
    badgeText,
    source: input?.source || "local_fallback",
  };
}

function localKeyForDevice(deviceId?: string | null): string {
  return `${LOCAL_TRIAL_KEY_PREFIX}${deviceId || "default"}`;
}

export function getOrInitLocalTrialRecord(deviceId?: string | null): TrialUserRecord {
  const now = new Date();
  const fallback: TrialUserRecord = {
    device_id: deviceId || undefined,
    created_at: now.toISOString(),
    trial_ends_at: new Date(now.getTime() + TRIAL_DURATION_DAYS * DAY_MS).toISOString(),
    subscription_status: "trial",
  };
  if (typeof window === "undefined") return fallback;

  try {
    const key = localKeyForDevice(deviceId);
    const raw =
      localStorage.getItem(key) ||
      localStorage.getItem("casalavoro_trial_account_v1");

    if (!raw) {
      localStorage.setItem(key, JSON.stringify(fallback));
      return fallback;
    }

    const parsed = JSON.parse(raw);
    const createdDate = parsed?.created_at ? new Date(parsed.created_at) : null;
    const validCreatedAt =
      createdDate && !Number.isNaN(createdDate.getTime())
        ? createdDate.toISOString()
        : fallback.created_at;

    const endsDate = parsed?.trial_ends_at ? new Date(parsed.trial_ends_at) : null;
    const validTrialEndsAt =
      endsDate && !Number.isNaN(endsDate.getTime())
        ? endsDate.toISOString()
        : new Date(new Date(validCreatedAt).getTime() + TRIAL_DURATION_DAYS * DAY_MS).toISOString();

    const record: TrialUserRecord = {
      device_id: deviceId || parsed?.device_id,
      created_at: validCreatedAt,
      trial_ends_at: validTrialEndsAt,
      subscription_status: normalizeSubscriptionStatus(parsed?.subscription_status),
      email: typeof parsed?.email === "string" ? parsed.email : undefined,
      name: typeof parsed?.name === "string" ? parsed.name : undefined,
    };

    const evaluated = evaluateTrialState({
      ...record,
      device_id: record.device_id,
    });
    if (record.subscription_status !== evaluated.subscriptionStatus) {
      record.subscription_status = evaluated.subscriptionStatus;
    }
    localStorage.setItem(key, JSON.stringify(record));
    return record;
  } catch {
    return fallback;
  }
}

export function saveLocalTrialRecord(
  patch: Partial<TrialUserRecord>,
  deviceId?: string | null
): TrialUserRecord {
  const targetDevice = patch.device_id ?? deviceId ?? cachedVisitorId;
  const current = getOrInitLocalTrialRecord(targetDevice);
  const next: TrialUserRecord = {
    ...current,
    ...patch,
    device_id: targetDevice || current.device_id,
    subscription_status: normalizeSubscriptionStatus(
      patch.subscription_status ?? current.subscription_status
    ),
  };
  try {
    localStorage.setItem(localKeyForDevice(next.device_id), JSON.stringify(next));
    window.dispatchEvent(new CustomEvent(TRIAL_UPDATED_EVENT, { detail: next }));
  } catch {
    // Ignore storage errors
  }
  return next;
}

export function subscribeTrialUpdates(cb: () => void): () => void {
  if (typeof window === "undefined") return () => {};
  const handler = () => cb();
  window.addEventListener(TRIAL_UPDATED_EVENT, handler);
  window.addEventListener("storage", handler);
  return () => {
    window.removeEventListener(TRIAL_UPDATED_EVENT, handler);
    window.removeEventListener("storage", handler);
  };
}

export async function checkOrRegisterDeviceTrial(fallbackUser?: {
  created_at?: string | null;
  subscription_status?: string | null;
} | null): Promise<TrialEvaluation> {
  const visitorId = await getDeviceFingerprint();

  try {
    const client = supabase as SupabaseClient;
    if (typeof client.rpc !== "function") {
      throw new Error("Supabase RPC unavailable");
    }
    const { data, error } = await client.rpc("check_or_register_trial", {
      p_device_id: visitorId,
    });

    const row = Array.isArray(data) ? data[0] : data;

    if (!error && row && typeof row === "object") {
      const rpcStatus = normalizeSubscriptionStatus(
        (row as { status?: string; subscription_status?: string }).status ??
          (row as { subscription_status?: string }).subscription_status
      );
      const rpcTrialEndsAt =
        typeof (row as { trial_ends_at?: string }).trial_ends_at === "string"
          ? (row as { trial_ends_at: string }).trial_ends_at
          : null;
      const rpcIsExpired = Boolean(
        (row as { is_expired?: boolean }).is_expired
      );

      saveLocalTrialRecord(
        {
          device_id: visitorId,
          trial_ends_at: rpcTrialEndsAt || undefined,
          subscription_status: rpcIsExpired ? "expired" : rpcStatus,
        },
        visitorId
      );

      return evaluateTrialState({
        device_id: visitorId,
        trial_ends_at: rpcTrialEndsAt,
        status: rpcStatus,
        is_expired: rpcIsExpired,
        source: "supabase_rpc",
      });
    }
  } catch {
    // Fall back to local fingerprint + Auth user evaluation when RPC is unavailable
  }

  const localRecord = getOrInitLocalTrialRecord(visitorId);
  const effectiveCreatedAt = fallbackUser?.created_at || localRecord.created_at;
  const effectiveStatus =
    fallbackUser?.subscription_status === "active"
      ? "active"
      : localRecord.subscription_status === "expired" ||
          fallbackUser?.subscription_status === "expired"
        ? "expired"
        : fallbackUser?.subscription_status || localRecord.subscription_status;

  return evaluateTrialState({
    device_id: visitorId,
    created_at: effectiveCreatedAt,
    trial_ends_at: localRecord.trial_ends_at,
    subscription_status: effectiveStatus,
    source: "local_fallback",
  });
}

export function isRlsPermissionError(err: unknown): boolean {
  if (!err || typeof err !== "object") return false;
  const e = err as { code?: unknown; status?: unknown; message?: unknown; details?: unknown };
  const code = String(e.code || "");
  const status = Number(e.status);
  const msg = `${String(e.message || "")} ${String(e.details || "")}`.toLowerCase();
  return (
    code === "42501" ||
    status === 401 ||
    status === 403 ||
    msg.includes("row-level security") ||
    msg.includes("permission denied") ||
    msg.includes("new row violates") ||
    msg.includes("violates row-level security policy")
  );
}

function readViteEnv(key: string): string {
  try {
    const env = (import.meta as unknown as { env?: Record<string, unknown> }).env;
    const val = env?.[key];
    return typeof val === "string" ? val.trim() : "";
  } catch {
    return "";
  }
}

export function getStripeCheckoutUrl(plan: BillingPlanId = "annual"): string {
  if (plan === "annual") {
    return (
      readViteEnv("VITE_STRIPE_CHECKOUT_URL_YEARLY") ||
      readViteEnv("VITE_STRIPE_CHECKOUT_URL")
    );
  }
  return (
    readViteEnv("VITE_STRIPE_CHECKOUT_URL_MONTHLY") ||
    readViteEnv("VITE_STRIPE_CHECKOUT_URL")
  );
}

export function getSupportWhatsAppUrl(): string {
  let rawPhone = "393423255008";
  const envPhone = readViteEnv("VITE_SUPPORT_WHATSAPP");
  if (envPhone.replace(/[^\d]/g, "").length >= 8) {
    rawPhone = envPhone.replace(/[^\d]/g, "");
  }
  const message = "Ciao! Vorrei attivare l'abbonamento al gestionale";
  return `https://wa.me/${rawPhone}?text=${encodeURIComponent(message)}`;
}
