import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import type { SupabaseClient } from "@supabase/supabase-js";
import { useAuth } from "@/context/AuthContext";
import { api } from "@/lib/api";
import { supabase } from "@/lib/supabaseClient";
import {
  checkOrRegisterDeviceTrial,
  evaluateTrialState,
  getStripeCheckoutUrl,
  getSupportWhatsAppUrl,
  saveLocalTrialRecord,
  subscribeTrialUpdates,
  type BillingPlanId,
  type TrialEvaluation,
} from "./trialService";

interface TrialContextValue {
  trial: TrialEvaluation;
  trialLoading: boolean;
  userEmail?: string;
  paywallOpen: boolean;
  openPaywall: () => void;
  closeEarlyPricing: () => void;
  closePaywallToReadOnly: () => void;
  requireActiveTrial: () => boolean;
  forceExpireAndOpenPaywall: () => void;
  refreshTrialStatus: () => Promise<void>;
  selectedPlan: BillingPlanId;
  setSelectedPlan: (plan: BillingPlanId) => void;
  checkoutBusy: boolean;
  checkoutNotice: string | null;
  handleActivateSubscription: () => Promise<void>;
  supportWhatsAppUrl: string;
}

export const LAUNCH_FREE_MODE = true;

const DEFAULT_EVAL = evaluateTrialState({
  created_at: new Date().toISOString(),
  subscription_status: LAUNCH_FREE_MODE ? "active" : "trial",
});

const TrialContext = createContext<TrialContextValue>({
  trial: DEFAULT_EVAL,
  trialLoading: true,
  paywallOpen: false,
  openPaywall: () => {},
  closeEarlyPricing: () => {},
  closePaywallToReadOnly: () => {},
  requireActiveTrial: () => true,
  forceExpireAndOpenPaywall: () => {},
  refreshTrialStatus: async () => {},
  selectedPlan: "annual",
  setSelectedPlan: () => {},
  checkoutBusy: false,
  checkoutNotice: null,
  handleActivateSubscription: async () => {},
  supportWhatsAppUrl: getSupportWhatsAppUrl(),
});

export function useTrialSession(): TrialContextValue {
  return useContext(TrialContext);
}

export function TrialProvider({ children }: { children: React.ReactNode }) {
  const { user, azienda } = useAuth() as {
    user?: {
      id?: string;
      email?: string;
      created_at?: string;
      subscription_status?: string;
    } | null;
    azienda?: {
      created_at?: string;
      subscription_status?: string;
    } | null;
  };

  const [trial, setTrial] = useState<TrialEvaluation>(DEFAULT_EVAL);
  const [trialLoading, setTrialLoading] = useState<boolean>(true);
  const [readOnlyModeAccepted, setReadOnlyModeAccepted] = useState<boolean>(false);
  const [manualOpen, setManualOpen] = useState<boolean>(false);
  const [selectedPlan, setSelectedPlan] = useState<BillingPlanId>("annual");
  const [checkoutBusy, setCheckoutBusy] = useState<boolean>(false);
  const [checkoutNotice, setCheckoutNotice] = useState<string | null>(null);

  const refreshTrialStatus = useCallback(async () => {
    try {
      const evaluated = await checkOrRegisterDeviceTrial({
        created_at: user?.created_at || azienda?.created_at,
        subscription_status: LAUNCH_FREE_MODE
          ? "active"
          : user?.subscription_status || azienda?.subscription_status,
      });
      if (LAUNCH_FREE_MODE) {
        setTrial({
          ...evaluated,
          subscriptionStatus: "active",
          isActive: true,
          isExpired: false,
          isReadOnly: false,
        });
      } else {
        setTrial(evaluated);
      }
    } finally {
      setTrialLoading(false);
    }
  }, [
    user?.created_at,
    user?.subscription_status,
    azienda?.created_at,
    azienda?.subscription_status,
  ]);

  useEffect(() => {
    void refreshTrialStatus();

    const client = supabase as SupabaseClient;
    const authSub =
      typeof client.auth?.onAuthStateChange === "function"
        ? client.auth.onAuthStateChange((_event, session) => {
            if (session?.user || _event === "SIGNED_IN" || _event === "SIGNED_OUT") {
              void refreshTrialStatus();
            }
          })
        : null;

    const unsubStorage = subscribeTrialUpdates(() => {
      void refreshTrialStatus();
    });

    const intervalId = window.setInterval(() => {
      void refreshTrialStatus();
    }, 60_000);

    return () => {
      authSub?.data?.subscription?.unsubscribe();
      unsubStorage();
      window.clearInterval(intervalId);
    };
  }, [refreshTrialStatus]);

  const paywallOpen = LAUNCH_FREE_MODE
    ? false
    : manualOpen || (trial.isExpired && !readOnlyModeAccepted);

  const openPaywall = useCallback(() => {
    if (LAUNCH_FREE_MODE) return;
    setCheckoutNotice(null);
    setManualOpen(true);
  }, []);

  const closeEarlyPricing = useCallback(() => {
    setManualOpen(false);
  }, []);

  const closePaywallToReadOnly = useCallback(() => {
    setReadOnlyModeAccepted(true);
    setManualOpen(false);
  }, []);

  const forceExpireAndOpenPaywall = useCallback(() => {
    if (LAUNCH_FREE_MODE) return;
    saveLocalTrialRecord(
      {
        device_id: trial.deviceId || undefined,
        subscription_status: "expired",
      },
      trial.deviceId
    );
    setTrial((prev) =>
      evaluateTrialState({
        device_id: prev.deviceId,
        created_at: prev.createdAt.toISOString(),
        trial_ends_at: prev.trialEndsAt.toISOString(),
        status: "expired",
        is_expired: true,
        source: prev.source,
      })
    );
    setReadOnlyModeAccepted(false);
    setManualOpen(true);
  }, [trial.deviceId]);

  const requireActiveTrial = useCallback(() => {
    if (LAUNCH_FREE_MODE || !trial.isExpired) return true;
    openPaywall();
    return false;
  }, [trial.isExpired, openPaywall]);

  const supportWhatsAppUrl = useMemo(() => getSupportWhatsAppUrl(), []);

  const handleActivateSubscription = useCallback(async () => {
    setCheckoutNotice(null);
    const stripeLink = getStripeCheckoutUrl(selectedPlan);
    if (stripeLink) {
      const separator = stripeLink.includes("?") ? "&" : "?";
      const target = user?.email
        ? `${stripeLink}${separator}prefilled_email=${encodeURIComponent(user.email)}`
        : stripeLink;
      window.location.assign(target);
      return;
    }

    setCheckoutBusy(true);
    try {
      const lookupKey = selectedPlan === "annual" ? "pro_yearly" : "pro_monthly";
      const { data } = await api.post("/payments/checkout", {
        lookup_key: lookupKey,
        origin_url: window.location.origin,
      });
      if (data?.checkout_url) {
        window.location.assign(data.checkout_url);
        return;
      }
      setCheckoutNotice(
        "Link Stripe pronto per la configurazione: contatta il supporto su WhatsApp qui sotto per l'attivazione immediata."
      );
    } catch {
      setCheckoutNotice(
        "Checkout Stripe predisposto (VITE_STRIPE_CHECKOUT_URL_YEARLY / VITE_STRIPE_CHECKOUT_URL_MONTHLY). Usa il pulsante WhatsApp qui sotto per attivare subito il piano."
      );
    } finally {
      setCheckoutBusy(false);
    }
  }, [selectedPlan, user?.email]);

  const value = useMemo<TrialContextValue>(
    () => ({
      trial,
      trialLoading,
      userEmail: user?.email,
      paywallOpen,
      openPaywall,
      closeEarlyPricing,
      closePaywallToReadOnly,
      requireActiveTrial,
      forceExpireAndOpenPaywall,
      refreshTrialStatus,
      selectedPlan,
      setSelectedPlan,
      checkoutBusy,
      checkoutNotice,
      handleActivateSubscription,
      supportWhatsAppUrl,
    }),
    [
      trial,
      trialLoading,
      user?.email,
      paywallOpen,
      openPaywall,
      closeEarlyPricing,
      closePaywallToReadOnly,
      requireActiveTrial,
      forceExpireAndOpenPaywall,
      refreshTrialStatus,
      selectedPlan,
      checkoutBusy,
      checkoutNotice,
      handleActivateSubscription,
      supportWhatsAppUrl,
    ]
  );

  return (
    <TrialContext.Provider value={value}>
      {children}
      {!LAUNCH_FREE_MODE && paywallOpen && <PaywallModal />}
    </TrialContext.Provider>
  );
}

export function PaywallModal() {
  const {
    trial,
    closeEarlyPricing,
    closePaywallToReadOnly,
    selectedPlan,
    setSelectedPlan,
    checkoutBusy,
    checkoutNotice,
    handleActivateSubscription,
    supportWhatsAppUrl,
  } = useTrialSession();

  const isEarlyPricing = !trial.isExpired;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="trial-paywall-title"
      onClick={isEarlyPricing ? closeEarlyPricing : undefined}
      className="fixed inset-0 z-[100] bg-primary/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-md bg-surface-card rounded-3xl p-5 sm:p-6 shadow-2xl border border-border-slate flex flex-col gap-4 my-auto relative"
      >
        <div className="flex items-start justify-between gap-3">
          <div className="w-11 h-11 rounded-2xl bg-secondary-container/15 text-secondary-container flex items-center justify-center shrink-0">
            <span className="material-symbols-outlined text-2xl">
              {isEarlyPricing ? "workspace_premium" : "lock"}
            </span>
          </div>

          {isEarlyPricing ? (
            <button
              type="button"
              id="pricing-modal-close-btn"
              aria-label="Chiudi"
              onClick={closeEarlyPricing}
              className="w-9 h-9 rounded-full bg-surface-container-low hover:bg-surface-container text-on-surface-variant hover:text-on-surface flex items-center justify-center transition-colors cursor-pointer"
            >
              <span className="material-symbols-outlined text-xl">close</span>
            </button>
          ) : (
            <span className="px-2.5 py-1 rounded-full bg-error-container text-on-error-container font-label-sm text-label-sm font-bold">
              Scaduto il {trial.trialEndsAt.toLocaleDateString("it-IT")}
            </span>
          )}
        </div>

        <div>
          <h2
            id="trial-paywall-title"
            className="font-headline-md text-headline-md text-on-surface font-bold"
          >
            {isEarlyPricing
              ? "Attiva il Gestionale Completo"
              : "Periodo di Prova Gratuito Terminato"}
          </h2>
          <p className="mt-2 font-body-sm text-body-sm sm:text-body-md text-on-surface-variant leading-relaxed">
            {isEarlyPricing
              ? trial.daysRemaining === 1
                ? "Hai ancora 1 giorno di prova gratuito, ma puoi bloccare il prezzo promozionale adesso."
                : `Hai ancora ${trial.daysRemaining} giorni di prova gratuiti, ma puoi bloccare il prezzo promozionale adesso.`
              : "I 14 giorni di prova per questo dispositivo sono terminati. I tuoi preventivi salvati restano al sicuro e consultabili in sola lettura. Per continuare a creare preventivi e gestire i tuoi cantieri, scegli il tuo piano:"}
          </p>
        </div>

        {/* Scelta Piani */}
        <div className="flex flex-col gap-2.5">
          {/* 1. PIANO ANNUALE */}
          <button
            type="button"
            id="plan-annual-option"
            onClick={() => setSelectedPlan("annual")}
            className={`w-full text-left rounded-2xl p-3.5 border-2 transition-all relative cursor-pointer ${
              selectedPlan === "annual"
                ? "border-secondary-container bg-secondary-container/10 shadow-sm"
                : "border-border-slate bg-surface-container-low hover:bg-surface-container"
            }`}
          >
            <span className="inline-block mb-1 px-2 py-0.5 rounded-full bg-secondary-container text-on-secondary font-label-sm text-[10px] font-bold uppercase tracking-wider">
              {isEarlyPricing ? "Consigliato" : "Più venduto · In evidenza"}
            </span>
            <div className="flex items-baseline justify-between gap-2">
              <span className="font-headline-sm text-headline-sm text-on-surface font-bold">
                PIANO ANNUALE
              </span>
              <span className="font-numeric-currency-md text-lg font-extrabold text-primary tabular-nums">
                149 € / anno
              </span>
            </div>
            <p className="font-body-sm text-body-sm text-status-success font-semibold mt-0.5">
              12,40 €/mese - 2 mesi gratis
            </p>
          </button>

          {/* 2. PIANO MENSILE */}
          <button
            type="button"
            id="plan-monthly-option"
            onClick={() => setSelectedPlan("monthly")}
            className={`w-full text-left rounded-2xl p-3.5 border-2 transition-all cursor-pointer ${
              selectedPlan === "monthly"
                ? "border-secondary-container bg-secondary-container/10 shadow-sm"
                : "border-border-slate bg-surface-container-low hover:bg-surface-container"
            }`}
          >
            <div className="flex items-baseline justify-between gap-2">
              <span className="font-headline-sm text-headline-sm text-on-surface font-bold">
                PIANO MENSILE
              </span>
              <span className="font-numeric-currency-md text-lg font-extrabold text-primary tabular-nums">
                19,90 € / mese
              </span>
            </div>
            <p className="font-body-sm text-body-sm text-text-muted mt-0.5">
              Senza vincoli, disdici quando vuoi
            </p>
          </button>
        </div>

        {checkoutNotice && (
          <div className="rounded-xl bg-surface-container-low border border-secondary-container/30 px-3.5 py-2.5 font-body-sm text-body-sm text-on-surface">
            {checkoutNotice}
          </div>
        )}

        <div className="flex flex-col gap-2.5 pt-1">
          <button
            type="button"
            id="paywall-activate-btn"
            disabled={checkoutBusy}
            onClick={handleActivateSubscription}
            className="w-full h-13 rounded-2xl bg-secondary-container hover:opacity-95 active:scale-[0.98] disabled:opacity-60 transition-all text-on-secondary font-headline-sm text-headline-sm font-bold flex items-center justify-center gap-2 shadow-md cursor-pointer"
          >
            <span className="material-symbols-outlined text-xl">workspace_premium</span>
            <span>
              {checkoutBusy
                ? "Apertura checkout..."
                : isEarlyPricing
                  ? `Attiva Ora (${selectedPlan === "annual" ? "149 €/anno" : "19,90 €/mese"})`
                  : `Attiva Abbonamento (${selectedPlan === "annual" ? "149 €/anno" : "19,90 €/mese"})`}
            </span>
          </button>

          <a
            id="paywall-support-whatsapp-btn"
            href={supportWhatsAppUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full h-12 rounded-2xl bg-[#25D366] hover:bg-[#1ebe5d] active:scale-[0.98] transition-all text-white font-label-md text-label-md font-bold flex items-center justify-center gap-2 shadow-sm"
          >
            <span className="material-symbols-outlined text-xl">chat</span>
            <span>
              {isEarlyPricing
                ? "Assistenza WhatsApp"
                : "Attiva o chiedi info via WhatsApp"}
            </span>
          </a>

          {!isEarlyPricing && (
            <button
              type="button"
              id="paywall-readonly-btn"
              onClick={closePaywallToReadOnly}
              className="w-full min-h-[40px] rounded-xl text-on-surface-variant hover:text-on-surface hover:bg-surface-container-low font-label-sm text-label-sm font-semibold transition-colors cursor-pointer"
            >
              Consulta i preventivi salvati / Stampa PDF (sola lettura)
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
