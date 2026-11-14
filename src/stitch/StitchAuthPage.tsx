import React, { useState } from "react";
import type { SupabaseClient } from "@supabase/supabase-js";
import { Eye, EyeOff, Lock, Mail, Phone, UserCheck, Building2 } from "lucide-react";
import { supabase } from "@/lib/supabaseClient";
import { useAuth } from "@/context/AuthContext";
import { formatItalianWhatsAppPhone } from "./pocketStore";

type AuthMode = "register" | "login";

function mapSupabaseAuthError(err: unknown): string {
  const msg = String((err as { message?: string })?.message || err || "");
  const lower = msg.toLowerCase();
  if (lower.includes("invalid login credentials")) {
    return "Email o password non validi.";
  }
  if (lower.includes("email not confirmed")) {
    return "Email non ancora confermata. Controlla la tua casella di posta.";
  }
  if (lower.includes("already registered") || lower.includes("user already exists")) {
    return "Questa email è già registrata. Passa al tab Accedi.";
  }
  if (lower.includes("password should be at least")) {
    return "La password deve contenere almeno 6 caratteri.";
  }
  if (lower.includes("unable to validate email") || lower.includes("invalid format")) {
    return "Inserisci un indirizzo email valido.";
  }
  if (lower.includes("rate limit") || lower.includes("too many requests")) {
    return "Troppi tentativi ravvicinati. Attendi qualche minuto e riprova.";
  }
  return msg || "Errore durante l'autenticazione. Riprova.";
}

export default function StitchAuthPage() {
  const { refreshMe } = useAuth() as { refreshMe: () => Promise<boolean> };

  const [mode, setMode] = useState<AuthMode>("register");
  const [companyName, setCompanyName] = useState("");
  const [phoneInput, setPhoneInput] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [infoMsg, setInfoMsg] = useState<string | null>(null);

  const switchMode = (nextMode: AuthMode) => {
    setMode(nextMode);
    setErrorMsg(null);
    setInfoMsg(null);
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setInfoMsg(null);

    const cleanName = companyName.trim();
    const cleanEmail = email.trim().toLowerCase();

    if (!cleanName) {
      setErrorMsg("Inserisci il tuo nome o il nome della tua ditta.");
      return;
    }

    const { isValid, formattedPhone } = formatItalianWhatsAppPhone(phoneInput);
    if (!isValid) {
      setErrorMsg("Inserisci un numero di cellulare WhatsApp italiano valido (es. 348 1234567).");
      return;
    }

    if (!cleanEmail || !cleanEmail.includes("@")) {
      setErrorMsg("Inserisci un indirizzo email valido.");
      return;
    }

    if (password.length < 6) {
      setErrorMsg("La password deve avere almeno 6 caratteri.");
      return;
    }

    setSubmitting(true);
    try {
      const client = supabase as SupabaseClient;
      const { data, error } = await client.auth.signUp({
        email: cleanEmail,
        password,
        options: {
          data: {
            full_name: cleanName,
            telefono: formattedPhone,
          },
        },
      });

      if (error) {
        setErrorMsg(mapSupabaseAuthError(error));
        return;
      }

      if (data?.user?.identities && data.user.identities.length === 0) {
        setErrorMsg("Questa email è già registrata. Passa al tab Accedi.");
        return;
      }

      let activeUser = data?.user ?? null;
      let hasActiveSession = Boolean(data?.session);

      if (!hasActiveSession) {
        const { data: loginData, error: loginError } = await client.auth.signInWithPassword({
          email: cleanEmail,
          password,
        });
        if (!loginError && loginData?.session) {
          hasActiveSession = true;
          activeUser = loginData.user ?? activeUser;
        }
      }

      if (activeUser) {
        try {
          await client.from("profiles").upsert(
            {
              id: activeUser.id,
              email: cleanEmail,
              name: cleanName,
              telefono: formattedPhone,
            },
            { onConflict: "id" }
          );
        } catch {
          // Non bloccare l'accesso se la policy RLS differisce
        }
      }

      if (hasActiveSession) {
        await refreshMe();
        return;
      }

      setInfoMsg(
        "Account creato! Controlla la tua email per confermare l'iscrizione e poi entra con i tuoi dati."
      );
      setMode("login");
    } catch (err) {
      setErrorMsg(mapSupabaseAuthError(err));
    } finally {
      setSubmitting(false);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setInfoMsg(null);

    const cleanEmail = email.trim().toLowerCase();
    if (!cleanEmail || !cleanEmail.includes("@")) {
      setErrorMsg("Inserisci la tua email.");
      return;
    }
    if (!password) {
      setErrorMsg("Inserisci la tua password.");
      return;
    }

    setSubmitting(true);
    try {
      const client = supabase as SupabaseClient;
      const { error } = await client.auth.signInWithPassword({
        email: cleanEmail,
        password,
      });

      if (error) {
        setErrorMsg(mapSupabaseAuthError(error));
        return;
      }

      await refreshMe();
    } catch (err) {
      setErrorMsg(mapSupabaseAuthError(err));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="stitch-app min-h-screen w-full overflow-y-auto overflow-x-hidden bg-surface text-on-surface flex flex-col">
      {/* Header Brand */}
      <header className="w-full bg-primary-container text-on-primary pt-10 sm:pt-12 pb-12 px-4 rounded-b-[2rem] shadow-md shrink-0">
        <div className="w-full max-w-md mx-auto flex flex-col items-center text-center gap-3">
          <img
            src="/assets/aistudio/image_07da2a6d.png"
            alt="CasaLavoroPRO"
            className="h-10 w-auto object-contain"
          />
          <h1 className="font-headline-md text-headline-md sm:text-[24px] font-bold text-on-primary leading-snug">
            Il Gestionale Preventivi per Artigiani e Imprese
          </h1>
          <p className="font-body-sm text-body-sm text-on-primary-container max-w-xs">
            Preventivi rapidi dal cantiere con calcolo IVA, Bonus edilizi, PDF e invio diretto su WhatsApp.
          </p>
        </div>
      </header>

      {/* Card Auth */}
      <main className="flex-1 w-full max-w-md mx-auto px-4 -mt-5 pb-10 flex flex-col items-center">
        <section className="w-full bg-surface-card rounded-3xl p-5 sm:p-6 shadow-lg border border-border-slate flex flex-col gap-5">
          {/* Switch Tab Registrati Gratis / Accedi */}
          <div
            role="tablist"
            aria-label="Modalità accesso"
            className="grid grid-cols-2 gap-1.5 p-1.5 rounded-2xl bg-surface-container-low border border-border-slate/70"
          >
            <button
              type="button"
              role="tab"
              id="auth-tab-register"
              aria-selected={mode === "register"}
              onClick={() => switchMode("register")}
              className={`min-h-[44px] rounded-xl font-label-md text-label-md font-bold transition-all cursor-pointer ${
                mode === "register"
                  ? "bg-primary-container text-on-primary shadow-sm"
                  : "text-on-surface-variant hover:text-on-surface"
              }`}
            >
              Registrati Gratis
            </button>
            <button
              type="button"
              role="tab"
              id="auth-tab-login"
              aria-selected={mode === "login"}
              onClick={() => switchMode("login")}
              className={`min-h-[44px] rounded-xl font-label-md text-label-md font-bold transition-all cursor-pointer ${
                mode === "login"
                  ? "bg-primary-container text-on-primary shadow-sm"
                  : "text-on-surface-variant hover:text-on-surface"
              }`}
            >
              Accedi
            </button>
          </div>

          {errorMsg && (
            <div
              role="alert"
              className="rounded-xl bg-error-container text-on-error-container px-3.5 py-2.5 font-body-sm text-body-sm font-medium flex items-center gap-2"
            >
              <span className="material-symbols-outlined text-lg shrink-0">error</span>
              <span>{errorMsg}</span>
            </div>
          )}

          {infoMsg && (
            <div
              role="status"
              className="rounded-xl bg-status-success/12 border border-status-success/30 text-status-success px-3.5 py-2.5 font-body-sm text-body-sm font-medium flex items-center gap-2"
            >
              <span className="material-symbols-outlined text-lg shrink-0">check_circle</span>
              <span>{infoMsg}</span>
            </div>
          )}

          {mode === "register" ? (
            <form onSubmit={handleRegister} className="flex flex-col gap-3.5" noValidate>
              {/* Nome o Nome Ditta */}
              <div className="flex flex-col gap-1.5">
                <label
                  htmlFor="reg-company-name"
                  className="font-label-md text-label-md text-on-surface font-semibold"
                >
                  Nome o Nome Ditta *
                </label>
                <div className="relative flex items-center">
                  <Building2 className="w-4 h-4 text-text-muted absolute left-3.5 pointer-events-none" />
                  <input
                    id="reg-company-name"
                    type="text"
                    required
                    autoComplete="organization"
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    placeholder="Es. Mario Rossi Termoidraulica"
                    className="w-full h-12 pl-10 pr-3.5 rounded-xl bg-surface-container-low border border-border-slate font-body-md text-body-md text-on-surface placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-secondary-container/40 focus:border-secondary-container"
                  />
                </div>
              </div>

              {/* Cellulare WhatsApp +39 fisso */}
              <div className="flex flex-col gap-1.5">
                <label
                  htmlFor="reg-whatsapp-phone"
                  className="font-label-md text-label-md text-on-surface font-semibold"
                >
                  Numero di Cellulare WhatsApp *
                </label>
                <div className="flex items-stretch rounded-xl bg-surface-container-low border border-border-slate focus-within:ring-2 focus-within:ring-secondary-container/40 focus-within:border-secondary-container overflow-hidden">
                  <span className="px-3.5 flex items-center gap-1.5 bg-surface-container text-on-surface font-label-md text-label-md font-bold border-r border-border-slate shrink-0 select-none">
                    <Phone className="w-3.5 h-3.5 text-[#16A34A]" />
                    <span>+39</span>
                  </span>
                  <input
                    id="reg-whatsapp-phone"
                    type="tel"
                    inputMode="tel"
                    required
                    autoComplete="tel-national"
                    value={phoneInput}
                    onChange={(e) => setPhoneInput(e.target.value)}
                    placeholder="348 1234567"
                    className="w-full h-12 px-3.5 bg-transparent font-body-md text-body-md text-on-surface placeholder:text-text-muted focus:outline-none tabular-nums"
                  />
                </div>
              </div>

              {/* Email */}
              <div className="flex flex-col gap-1.5">
                <label
                  htmlFor="reg-email"
                  className="font-label-md text-label-md text-on-surface font-semibold"
                >
                  Email *
                </label>
                <div className="relative flex items-center">
                  <Mail className="w-4 h-4 text-text-muted absolute left-3.5 pointer-events-none" />
                  <input
                    id="reg-email"
                    type="email"
                    inputMode="email"
                    required
                    autoComplete="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="nome@tuaazienda.it"
                    className="w-full h-12 pl-10 pr-3.5 rounded-xl bg-surface-container-low border border-border-slate font-body-md text-body-md text-on-surface placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-secondary-container/40 focus:border-secondary-container"
                  />
                </div>
              </div>

              {/* Password */}
              <div className="flex flex-col gap-1.5">
                <label
                  htmlFor="reg-password"
                  className="font-label-md text-label-md text-on-surface font-semibold"
                >
                  Password (minimo 6 caratteri) *
                </label>
                <div className="relative flex items-center">
                  <Lock className="w-4 h-4 text-text-muted absolute left-3.5 pointer-events-none" />
                  <input
                    id="reg-password"
                    type={showPassword ? "text" : "password"}
                    required
                    minLength={6}
                    autoComplete="new-password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Almeno 6 caratteri"
                    className="w-full h-12 pl-10 pr-11 rounded-xl bg-surface-container-low border border-border-slate font-body-md text-body-md text-on-surface placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-secondary-container/40 focus:border-secondary-container"
                  />
                  <button
                    type="button"
                    aria-label={showPassword ? "Nascondi password" : "Mostra password"}
                    onClick={() => setShowPassword((prev) => !prev)}
                    className="absolute right-2 w-9 h-9 rounded-lg flex items-center justify-center text-text-muted hover:text-on-surface cursor-pointer"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                id="auth-register-submit-btn"
                disabled={submitting}
                className="mt-2 w-full h-14 rounded-2xl bg-secondary-container hover:opacity-95 active:scale-[0.98] disabled:opacity-60 transition-all text-on-secondary font-headline-sm text-headline-sm font-bold flex items-center justify-center gap-2 shadow-md cursor-pointer"
              >
                <UserCheck className="w-5 h-5 shrink-0" />
                <span>{submitting ? "Creazione account..." : "Crea Account Gratuito"}</span>
              </button>
            </form>
          ) : (
            <form onSubmit={handleLogin} className="flex flex-col gap-3.5" noValidate>
              {/* Email */}
              <div className="flex flex-col gap-1.5">
                <label
                  htmlFor="login-email"
                  className="font-label-md text-label-md text-on-surface font-semibold"
                >
                  Email *
                </label>
                <div className="relative flex items-center">
                  <Mail className="w-4 h-4 text-text-muted absolute left-3.5 pointer-events-none" />
                  <input
                    id="login-email"
                    type="email"
                    inputMode="email"
                    required
                    autoComplete="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="nome@tuaazienda.it"
                    className="w-full h-12 pl-10 pr-3.5 rounded-xl bg-surface-container-low border border-border-slate font-body-md text-body-md text-on-surface placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-secondary-container/40 focus:border-secondary-container"
                  />
                </div>
              </div>

              {/* Password */}
              <div className="flex flex-col gap-1.5">
                <label
                  htmlFor="login-password"
                  className="font-label-md text-label-md text-on-surface font-semibold"
                >
                  Password *
                </label>
                <div className="relative flex items-center">
                  <Lock className="w-4 h-4 text-text-muted absolute left-3.5 pointer-events-none" />
                  <input
                    id="login-password"
                    type={showPassword ? "text" : "password"}
                    required
                    autoComplete="current-password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="La tua password"
                    className="w-full h-12 pl-10 pr-11 rounded-xl bg-surface-container-low border border-border-slate font-body-md text-body-md text-on-surface placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-secondary-container/40 focus:border-secondary-container"
                  />
                  <button
                    type="button"
                    aria-label={showPassword ? "Nascondi password" : "Mostra password"}
                    onClick={() => setShowPassword((prev) => !prev)}
                    className="absolute right-2 w-9 h-9 rounded-lg flex items-center justify-center text-text-muted hover:text-on-surface cursor-pointer"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                id="auth-login-submit-btn"
                disabled={submitting}
                className="mt-2 w-full h-14 rounded-2xl bg-[#16A34A] hover:bg-[#15803D] active:scale-[0.98] disabled:opacity-60 transition-all text-white font-headline-sm text-headline-sm font-bold flex items-center justify-center gap-2 shadow-md cursor-pointer"
              >
                <span>{submitting ? "Accesso in corso..." : "Entra nel Gestionale"}</span>
              </button>
            </form>
          )}
        </section>
      </main>
    </div>
  );
}
