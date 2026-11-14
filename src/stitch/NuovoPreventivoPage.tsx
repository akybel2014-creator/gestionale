import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Mic } from "lucide-react";
import StitchShell from "./StitchShell";
import { useTrialSession } from "./TrialGuard";
import {
  BONUS_OPTIONS,
  VAT_OPTIONS,
  calculateTotals,
  formatEuro,
  getActiveChat,
  getPocketSettings,
  saveQuoteWithCloudSync,
  type BonusOptionId,
  type VatOptionId,
} from "./pocketStore";
import { downloadQuotePdf } from "./pdfGenerator";

interface NuovoPreventivoPageProps {
  showDetrazioni?: boolean;
}

export default function NuovoPreventivoPage({ showDetrazioni = true }: NuovoPreventivoPageProps) {
  const navigate = useNavigate();
  const { trial, requireActiveTrial, openPaywall, forceExpireAndOpenPaywall } = useTrialSession();
  const isReadOnly = trial.isExpired;
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const settings = getPocketSettings();
  const initialChat = getActiveChat();

  const [clientName, setClientName] = useState(initialChat.clientName);
  const [clientPhone, setClientPhone] = useState(initialChat.clientPhone);
  const [description, setDescription] = useState(initialChat.description);
  const [amountInput, setAmountInput] = useState(String(initialChat.amount));
  const [vatOptionId, setVatOptionId] = useState<VatOptionId>(
    initialChat.vatOptionId || settings.defaultVatId
  );
  const [bonusOptionId, setBonusOptionId] = useState<BonusOptionId>(
    showDetrazioni ? initialChat.bonusOptionId || settings.defaultBonusId : "none"
  );
  const [photoDataUrl, setPhotoDataUrl] = useState<string | undefined>(initialChat.photoDataUrl);
  const [showHoursHelper, setShowHoursHelper] = useState(false);
  const [hoursInput, setHoursInput] = useState("4");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [toastMsg, setToastMsg] = useState<string | null>(null);
  const [isListening, setIsListening] = useState(false);
  const [speechNotice, setSpeechNotice] = useState<string | null>(null);

  const recognitionRef = useRef<any>(null);
  const baseDescriptionRef = useRef<string>("");
  const descriptionRef = useRef<string>(description);
  descriptionRef.current = description;

  const isSpeechSupported =
    typeof window !== "undefined" &&
    Boolean(
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition
    );

  useEffect(() => {
    return () => {
      try {
        recognitionRef.current?.stop?.();
      } catch {
        // Ignora errori in chiusura
      }
    };
  }, []);

  const normalizedAmount = Number(amountInput.replace(",", "."));
  const validAmount = Number.isFinite(normalizedAmount) && normalizedAmount > 0 ? normalizedAmount : 0;
  const totals = calculateTotals(validAmount, vatOptionId, bonusOptionId);

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 2400);
  };

  const stopVoiceDictation = () => {
    try {
      recognitionRef.current?.stop?.();
    } catch {
      // Ignora eventuali errori di stop
    }
    setIsListening(false);
  };

  const toggleVoiceDictation = () => {
    if (!requireActiveTrial()) return;

    if (!isSpeechSupported) {
      setSpeechNotice(
        "Dettatura vocale non supportata su questo browser. Puoi scrivere manualmente o usare Chrome / Safari aggiornati."
      );
      return;
    }

    if (isListening) {
      stopVoiceDictation();
      return;
    }

    setSpeechNotice(null);
    if (errorMsg) setErrorMsg(null);

    const SpeechRecognitionCtor =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognitionCtor) {
      setSpeechNotice(
        "Dettatura vocale non disponibile su questo dispositivo."
      );
      return;
    }

    try {
      const recognition = new SpeechRecognitionCtor();
      recognition.lang = "it-IT";
      recognition.continuous = true;
      recognition.interimResults = true;

      baseDescriptionRef.current = descriptionRef.current;

      recognition.onstart = () => {
        setIsListening(true);
      };

      recognition.onresult = (event: any) => {
        let finalText = "";
        let interimText = "";

        for (let i = 0; i < event.results.length; i += 1) {
          const result = event.results[i];
          const transcript = result?.[0]?.transcript || "";
          if (result.isFinal) {
            finalText += transcript;
          } else {
            interimText += transcript;
          }
        }

        const spoken = `${finalText} ${interimText}`.replace(/\s+/g, " ").trim();
        const base = baseDescriptionRef.current;

        if (!spoken) {
          setDescription(base);
          return;
        }

        const trimmedBase = base.replace(/\s+$/, "");
        const combined = trimmedBase ? `${trimmedBase} ${spoken}` : spoken;
        setDescription(combined);
        if (errorMsg) setErrorMsg(null);
      };

      recognition.onerror = (event: any) => {
        const errCode = event?.error;
        if (errCode === "not-allowed" || errCode === "service-not-allowed") {
          setSpeechNotice(
            "Accesso al microfono negato. Consenti il microfono nelle impostazioni del browser."
          );
        } else if (errCode === "no-speech") {
          setSpeechNotice(
            "Nessuna voce rilevata. Avvicinati al microfono e riprova."
          );
        } else if (errCode !== "aborted") {
          setSpeechNotice(
            "Dettatura interrotta. Il testo trascritto è stato mantenuto."
          );
        }
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
        recognitionRef.current = null;
      };

      recognitionRef.current = recognition;
      recognition.start();
    } catch {
      setIsListening(false);
      setSpeechNotice(
        "Impossibile avviare il microfono su questo browser. Controlla i permessi audio."
      );
    }
  };

  const handleResetFields = () => {
    if (!requireActiveTrial()) return;
    if (isListening) stopVoiceDictation();
    setClientName("");
    setClientPhone("");
    setDescription("");
    setAmountInput("");
    setVatOptionId(settings.defaultVatId);
    setBonusOptionId(showDetrazioni ? settings.defaultBonusId : "none");
    setPhotoDataUrl(undefined);
    setErrorMsg(null);
    setSpeechNotice(null);
  };

  const handleApplyHours = (hoursVal: number) => {
    if (!requireActiveTrial()) return;
    const safeHours = Number.isFinite(hoursVal) && hoursVal > 0 ? hoursVal : 0;
    const computed = Math.round(safeHours * settings.hourlyRate * 100) / 100;
    if (computed > 0) {
      setAmountInput(String(computed));
      setErrorMsg(null);
    }
  };

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!requireActiveTrial()) {
      e.target.value = "";
      return;
    }
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") {
        setPhotoDataUrl(reader.result);
        showToast("Foto allegata al preventivo");
      }
    };
    reader.readAsDataURL(file);
    e.target.value = "";
  };

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!requireActiveTrial()) return;
    if (!description.trim()) {
      setErrorMsg("Inserisci una breve descrizione del lavoro.");
      return;
    }
    if (validAmount <= 0) {
      setErrorMsg("Inserisci un importo valido maggiore di 0.");
      return;
    }

    setErrorMsg(null);
    const result = await saveQuoteWithCloudSync({
      existingId: initialChat.id,
      clientName,
      clientPhone,
      description,
      amount: validAmount,
      vatOptionId,
      bonusOptionId,
      photoDataUrl,
    });
    if (result.rlsDenied) {
      forceExpireAndOpenPaywall();
      return;
    }
    navigate("/whatsapp");
  };

  return (
    <StitchShell title="Nuovo Preventivo" activeTab="preventivo">
      <form onSubmit={handleGenerate} className="w-full max-w-5xl mx-auto pb-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
          {/* Colonna Principale: Dati Essenziali & Gestione Fiscale Separata */}
          <div className="lg:col-span-7 flex flex-col gap-4">
            {/* Blocco 1: Descrizione e Importo */}
            <section className="bg-surface-card rounded-2xl p-4 sm:p-5 shadow-sm flex flex-col gap-4">
              <div className="flex items-center justify-between gap-2">
                <div>
                  <h2 className="font-headline-sm text-headline-sm text-on-surface font-bold">
                    Dati Preventivo Rapido
                  </h2>
                  <p className="font-body-sm text-body-sm text-text-muted">
                    Inserisci descrizione e importo imponibile.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handleResetFields}
                  className="min-h-[44px] px-3 rounded-xl bg-surface-container-low hover:bg-surface-container text-on-surface-variant font-label-md text-label-md flex items-center gap-1.5 transition-colors shrink-0"
                >
                  <span className="material-symbols-outlined text-base">add</span>
                  <span>Nuovo</span>
                </button>
              </div>

              <div className="flex flex-col gap-1.5">
                <label
                  htmlFor="quote-description"
                  className="font-label-md text-label-md text-on-surface font-semibold"
                >
                  Descrizione lavoro *
                </label>
                <textarea
                  id="quote-description"
                  rows={3}
                  disabled={isReadOnly}
                  value={description}
                  onChange={(e) => {
                    setDescription(e.target.value);
                    if (errorMsg) setErrorMsg(null);
                  }}
                  placeholder="Es. Rifacimento bagno, sostituzione caldaia..."
                  className="w-full rounded-xl bg-surface-container-low border border-border-slate px-3.5 py-3 font-body-md text-body-md text-on-surface placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-secondary-container/40 focus:border-secondary-container resize-none disabled:opacity-65"
                />

                <button
                  type="button"
                  id="voice-dictation-btn"
                  disabled={isReadOnly || !isSpeechSupported}
                  onClick={toggleVoiceDictation}
                  aria-pressed={isListening}
                  className={`w-full min-h-[46px] px-3.5 py-2.5 rounded-xl font-label-md text-label-md font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed ${
                    isListening
                      ? "bg-[#DC2626] text-white border border-[#DC2626] shadow-sm animate-pulse"
                      : "bg-surface-container-low hover:bg-surface-container text-on-surface border border-border-slate"
                  }`}
                >
                  <Mic className="w-4 h-4 shrink-0" aria-hidden="true" />
                  <span>
                    {isListening
                      ? "🔴 In ascolto... parla ora (tocca per fermare)"
                      : "🎙️ Tocca per dettare a voce la descrizione"}
                  </span>
                </button>

                {!isSpeechSupported && (
                  <p className="font-body-sm text-[12px] text-text-muted px-0.5">
                    Dettatura vocale non supportata su questo browser: puoi scrivere la descrizione manualmente.
                  </p>
                )}

                {speechNotice && (
                  <p
                    role="status"
                    className="font-body-sm text-[12px] text-status-warning font-medium px-0.5"
                  >
                    {speechNotice}
                  </p>
                )}
              </div>

              <div className="flex flex-col gap-1.5">
                <div className="flex items-center justify-between gap-2">
                  <label
                    htmlFor="quote-amount"
                    className="font-label-md text-label-md text-on-surface font-semibold"
                  >
                    Importo imponibile (€) *
                  </label>
                  <button
                    type="button"
                    onClick={() => setShowHoursHelper((prev) => !prev)}
                    className="min-h-[36px] px-2.5 rounded-lg text-secondary-container hover:bg-secondary-container/10 font-label-sm text-label-sm font-semibold transition-colors"
                  >
                    {showHoursHelper ? "Chiudi calcolo ore" : `Calcola a ore (€${settings.hourlyRate}/h)`}
                  </button>
                </div>

                <div className="relative flex items-center">
                  <span className="absolute left-4 font-headline-md text-headline-md text-text-muted font-bold pointer-events-none">
                    €
                  </span>
                  <input
                    id="quote-amount"
                    type="text"
                    inputMode="decimal"
                    disabled={isReadOnly}
                    value={amountInput}
                    onChange={(e) => {
                      setAmountInput(e.target.value);
                      if (errorMsg) setErrorMsg(null);
                    }}
                    placeholder="0,00"
                    className="w-full h-14 pl-10 pr-4 rounded-xl bg-surface-container-low border border-border-slate font-numeric-currency-lg text-[24px] font-bold tabular-nums text-on-surface placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-secondary-container/40 focus:border-secondary-container disabled:opacity-65"
                  />
                </div>

                {showHoursHelper && (
                  <div className="mt-1 p-3 rounded-xl bg-surface-container-low flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="font-body-sm text-body-sm text-text-muted">Ore stimate:</span>
                      <input
                        type="number"
                        min={1}
                        step={0.5}
                        value={hoursInput}
                        onChange={(e) => setHoursInput(e.target.value)}
                        aria-label="Ore stimate"
                        className="w-20 h-10 px-2.5 rounded-lg bg-surface-card border border-border-slate font-body-md text-body-md tabular-nums text-on-surface text-center"
                      />
                      <span className="font-body-sm text-body-sm text-text-muted">
                        × €{settings.hourlyRate}/h
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleApplyHours(Number(hoursInput))}
                      className="min-h-[40px] px-3.5 rounded-lg bg-primary-container text-on-primary font-label-md text-label-md font-semibold active:scale-95 transition-transform"
                    >
                      Applica
                    </button>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                <div className="flex flex-col gap-1">
                  <label htmlFor="client-name" className="font-label-sm text-label-sm text-text-muted">
                    Cliente (opzionale)
                  </label>
                  <input
                    id="client-name"
                    type="text"
                    disabled={isReadOnly}
                    value={clientName}
                    onChange={(e) => setClientName(e.target.value)}
                    placeholder="Nome cliente"
                    className="w-full h-11 px-3 rounded-xl bg-surface-container-low border border-border-slate font-body-md text-body-md text-on-surface placeholder:text-text-muted focus:outline-none focus:border-secondary-container disabled:opacity-65"
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label htmlFor="client-phone" className="font-label-sm text-label-sm text-text-muted">
                    Telefono WhatsApp (opzionale)
                  </label>
                  <input
                    id="client-phone"
                    type="tel"
                    inputMode="tel"
                    disabled={isReadOnly}
                    value={clientPhone}
                    onChange={(e) => setClientPhone(e.target.value)}
                    placeholder="+39 348 ..."
                    className="w-full h-11 px-3 rounded-xl bg-surface-container-low border border-border-slate font-body-md text-body-md text-on-surface placeholder:text-text-muted focus:outline-none focus:border-secondary-container disabled:opacity-65"
                  />
                </div>
              </div>

              <div className="pt-1 flex flex-wrap items-center justify-between gap-3">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  capture="environment"
                  disabled={isReadOnly}
                  onChange={handlePhotoChange}
                  className="hidden"
                />
                <button
                  type="button"
                  onClick={() => {
                    if (!requireActiveTrial()) return;
                    fileInputRef.current?.click();
                  }}
                  aria-disabled={isReadOnly}
                  className="min-h-[44px] px-3.5 rounded-xl bg-surface-container-low hover:bg-surface-container text-on-surface font-label-md text-label-md flex items-center gap-2 transition-colors disabled:opacity-60"
                >
                  <span className="material-symbols-outlined text-lg text-secondary-container">
                    {isReadOnly ? "lock" : "add_a_photo"}
                  </span>
                  <span>{photoDataUrl ? "Cambia foto cantiere" : "Aggiungi foto (opzionale)"}</span>
                </button>

                {photoDataUrl && (
                  <div className="flex items-center gap-2 bg-surface-container-low px-2.5 py-1.5 rounded-xl">
                    <img
                      src={photoDataUrl}
                      alt="Foto cantiere"
                      className="w-9 h-9 rounded-lg object-cover"
                    />
                    <span className="font-body-sm text-body-sm text-on-surface-variant">Foto allegata</span>
                    <button
                      type="button"
                      aria-label="Rimuovi foto"
                      onClick={() => setPhotoDataUrl(undefined)}
                      className="w-8 h-8 rounded-lg hover:bg-surface-container flex items-center justify-center text-text-muted hover:text-on-surface"
                    >
                      <span className="material-symbols-outlined text-base">close</span>
                    </button>
                  </div>
                )}
              </div>
            </section>

            {/* Blocco 2: Gestione Fiscale Separata (Aliquota IVA + Detrazione Fiscale / Bonus) */}
            <section className="bg-surface-card rounded-2xl p-4 sm:p-5 shadow-sm flex flex-col gap-4">
              <div className="flex items-center justify-between gap-2">
                <h3 className="font-headline-sm text-headline-sm text-on-surface font-bold">
                  Regime IVA &amp; Detrazione Fiscale
                </h3>
                <Link
                  to="/listini-iva"
                  className="font-label-sm text-label-sm text-secondary-container hover:underline whitespace-nowrap"
                >
                  Predefiniti →
                </Link>
              </div>

              {/* 1. SELEZIONE ALIQUOTA IVA */}
              <div className="flex flex-col gap-1.5">
                <label
                  htmlFor="vat-select"
                  className="font-label-md text-label-md text-on-surface font-semibold"
                >
                  1. Aliquota IVA (sommata all&apos;imponibile)
                </label>
                <select
                  id="vat-select"
                  disabled={isReadOnly}
                  value={vatOptionId}
                  onChange={(e) => setVatOptionId(e.target.value as VatOptionId)}
                  className="w-full h-12 px-3.5 rounded-xl bg-surface-container-low border border-border-slate font-body-md text-body-md font-semibold text-on-surface focus:outline-none focus:ring-2 focus:ring-secondary-container/40 focus:border-secondary-container disabled:opacity-65"
                >
                  {VAT_OPTIONS.map((opt) => (
                    <option key={opt.id} value={opt.id}>
                      {opt.label}
                    </option>
                  ))}
                </select>
                <p className="font-body-sm text-body-sm text-text-muted px-0.5">
                  {totals.vatOption.description}
                </p>
              </div>

              {/* 2. SELEZIONE DETRAZIONE FISCALE / BONUS */}
              <div className="flex flex-col gap-1.5 pt-1 border-t border-surface-container">
                <label
                  htmlFor="bonus-select"
                  className="font-label-md text-label-md text-on-surface font-semibold"
                >
                  2. Detrazione Fiscale / Bonus Edilizio (opzionale)
                </label>
                <select
                  id="bonus-select"
                  disabled={isReadOnly}
                  value={bonusOptionId}
                  onChange={(e) => setBonusOptionId(e.target.value as BonusOptionId)}
                  className="w-full h-12 px-3.5 rounded-xl bg-surface-container-low border border-border-slate font-body-md text-body-md font-semibold text-on-surface focus:outline-none focus:ring-2 focus:ring-secondary-container/40 focus:border-secondary-container disabled:opacity-65"
                >
                  {BONUS_OPTIONS.map((opt) => (
                    <option key={opt.id} value={opt.id}>
                      {opt.label}
                    </option>
                  ))}
                </select>
                <p className="font-body-sm text-body-sm text-text-muted px-0.5">
                  {totals.bonusOption.description}
                </p>
              </div>
            </section>
          </div>

          {/* Colonna Destra: Riepilogo Calcolo, Box Informativo Detrazione & Invio */}
          <div className="lg:col-span-5 flex flex-col gap-4 lg:sticky lg:top-28">
            <section className="bg-primary-container text-on-primary rounded-2xl p-5 shadow-md flex flex-col gap-3">
              <div className="flex items-center justify-between text-on-primary-container font-body-md text-body-md">
                <span>Imponibile lavori</span>
                <span className="tabular-nums font-medium text-on-primary">
                  {formatEuro(totals.imponibile)}
                </span>
              </div>
              <div className="flex items-start justify-between gap-2 text-on-primary-container font-body-md text-body-md pb-3 border-b border-white/10">
                <div className="min-w-0">
                  <span className="block">{totals.vatOption.label}</span>
                  {totals.vatOption.pdfNote && (
                    <span className="font-body-sm text-[11px] text-on-primary-container/80 block mt-0.5">
                      {totals.vatOption.pdfNote}
                    </span>
                  )}
                </div>
                <span className="tabular-nums font-medium text-on-primary shrink-0">
                  {formatEuro(totals.vatAmount)}
                </span>
              </div>

              <div className="flex items-end justify-between gap-2 pt-1">
                <div>
                  <span className="font-label-sm text-label-sm uppercase tracking-wider text-on-primary-container block">
                    Totale da pagare
                  </span>
                  <span className="font-body-sm text-body-sm text-on-primary-container">
                    Imponibile + IVA
                  </span>
                </div>
                <span className="font-numeric-currency-lg text-[32px] leading-none font-extrabold tabular-nums text-on-primary">
                  {formatEuro(totals.total)}
                </span>
              </div>
            </section>

            {/* Box informativo Detrazione Fiscale (se selezionata > 0%) */}
            {totals.bonusOption.rate > 0 && (
              <section
                id="fiscal-savings-box"
                className="bg-surface-card rounded-2xl p-4 shadow-sm border border-status-success/25 flex flex-col gap-2"
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="font-label-md text-label-md text-status-success font-bold flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-lg">savings</span>
                    <span>{totals.bonusOption.label}</span>
                  </span>
                </div>
                <p className="font-body-md text-body-md text-on-surface leading-snug">
                  Risparmio fiscale stimato per il committente:{" "}
                  <strong className="font-bold tabular-nums text-status-success">
                    {formatEuro(totals.detrazioneAmount)}
                  </strong>{" "}
                  ({totals.bonusOption.rate}% detraibile in 10 anni tramite bonifico parlante).
                </p>
                <div className="pt-2 border-t border-surface-container flex items-center justify-between text-body-sm">
                  <span className="text-text-muted">Costo netto effettivo per il cliente</span>
                  <span className="font-headline-sm text-headline-sm font-bold tabular-nums text-primary">
                    {formatEuro(totals.netAfterBonus)}
                  </span>
                </div>
              </section>
            )}

            {errorMsg && (
              <div className="p-3 rounded-xl bg-error-container text-on-error-container font-label-md text-label-md flex items-center gap-2">
                <span className="material-symbols-outlined text-lg">error</span>
                <span>{errorMsg}</span>
              </div>
            )}

            {isReadOnly ? (
              <button
                type="button"
                id="generate-quote-btn"
                onClick={openPaywall}
                className="w-full h-14 rounded-2xl bg-secondary-container hover:opacity-95 text-on-secondary font-headline-sm text-headline-sm font-bold flex items-center justify-center gap-2.5 shadow-md cursor-pointer"
              >
                <span className="material-symbols-outlined text-2xl">lock</span>
                <span>Attiva Abbonamento per Inviare</span>
              </button>
            ) : (
              <button
                type="submit"
                id="generate-quote-btn"
                className="w-full h-14 rounded-2xl bg-[#25D366] hover:bg-[#1ebe5d] active:scale-[0.98] transition-all text-white font-headline-sm text-headline-sm font-bold flex items-center justify-center gap-2.5 shadow-md cursor-pointer"
              >
                <span className="material-symbols-outlined text-2xl">send</span>
                <span>Genera e Invia su WhatsApp</span>
              </button>
            )}
            <button
              type="button"
              onClick={async () => {
                if (isReadOnly) {
                  // Sola lettura: esporta il preventivo già salvato senza modificare il DB
                  const file = downloadQuotePdf(initialChat);
                  showToast(`PDF scaricato (sola lettura): ${file}`);
                  return;
                }
                if (!description.trim() || validAmount <= 0) {
                  setErrorMsg("Inserisci descrizione e importo per scaricare il PDF.");
                  return;
                }
                const result = await saveQuoteWithCloudSync({
                  existingId: initialChat.id,
                  clientName,
                  clientPhone,
                  description,
                  amount: validAmount,
                  vatOptionId,
                  bonusOptionId,
                  photoDataUrl,
                });
                if (result.rlsDenied) {
                  forceExpireAndOpenPaywall();
                  return;
                }
                const file = downloadQuotePdf(result.chat);
                showToast(`PDF scaricato: ${file}`);
              }}
              className="w-full h-11 rounded-xl bg-surface-card hover:bg-surface-container text-on-surface font-label-md text-label-md font-semibold flex items-center justify-center gap-2 shadow-xs transition-colors"
            >
              <span className="material-symbols-outlined text-lg text-error">picture_as_pdf</span>
              <span>{isReadOnly ? "Stampa / Scarica PDF (sola lettura)" : "Scarica PDF"}</span>
            </button>
          </div>
        </div>

        {toastMsg && (
          <div className="fixed bottom-24 inset-x-margin max-w-sm mx-auto bg-primary-container text-on-primary px-4 py-3 rounded-xl shadow-2xl flex items-center gap-2.5 z-50">
            <span className="material-symbols-outlined text-status-success text-lg">check_circle</span>
            <span className="font-body-sm text-body-sm">{toastMsg}</span>
          </div>
        )}
      </form>
    </StitchShell>
  );
}
