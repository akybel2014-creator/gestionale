import { useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import StitchShell from "./StitchShell";
import {
  calculateTotals,
  formatEuro,
  getActiveChat,
  getPocketSettings,
  saveQuoteAsActiveChat,
  type VatRate,
} from "./pocketStore";
import { downloadQuotePdf } from "./pdfGenerator";

interface NuovoPreventivoPageProps {
  showDetrazioni?: boolean;
}

export default function NuovoPreventivoPage({ showDetrazioni = true }: NuovoPreventivoPageProps) {
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const settings = getPocketSettings();
  const initialChat = getActiveChat();

  const [clientName, setClientName] = useState(initialChat.clientName);
  const [clientPhone, setClientPhone] = useState(initialChat.clientPhone);
  const [description, setDescription] = useState(initialChat.description);
  const [amountInput, setAmountInput] = useState(String(initialChat.amount));
  const [vatRate, setVatRate] = useState<VatRate>(settings.defaultVat);
  const [bonusCasa50, setBonusCasa50] = useState<boolean>(showDetrazioni);
  const [photoDataUrl, setPhotoDataUrl] = useState<string | undefined>(initialChat.photoDataUrl);
  const [showHoursHelper, setShowHoursHelper] = useState(false);
  const [hoursInput, setHoursInput] = useState("4");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const normalizedAmount = Number(amountInput.replace(",", "."));
  const validAmount = Number.isFinite(normalizedAmount) && normalizedAmount > 0 ? normalizedAmount : 0;
  const totals = calculateTotals(validAmount, vatRate, bonusCasa50);

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 2400);
  };

  const handleResetFields = () => {
    setClientName("");
    setClientPhone("");
    setDescription("");
    setAmountInput("");
    setPhotoDataUrl(undefined);
    setErrorMsg(null);
  };

  const handleApplyHours = (hoursVal: number) => {
    const safeHours = Number.isFinite(hoursVal) && hoursVal > 0 ? hoursVal : 0;
    const computed = Math.round(safeHours * settings.hourlyRate * 100) / 100;
    if (computed > 0) {
      setAmountInput(String(computed));
      setErrorMsg(null);
    }
  };

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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

  const handleGenerate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!description.trim()) {
      setErrorMsg("Inserisci una breve descrizione del lavoro.");
      return;
    }
    if (validAmount <= 0) {
      setErrorMsg("Inserisci un importo valido maggiore di 0.");
      return;
    }

    setErrorMsg(null);
    saveQuoteAsActiveChat({
      clientName,
      clientPhone,
      description,
      amount: validAmount,
      vatRate,
      bonusCasa50,
      photoDataUrl,
    });
    navigate("/whatsapp");
  };

  return (
    <StitchShell title="Nuovo Preventivo" activeTab="preventivo">
      <form onSubmit={handleGenerate} className="w-full max-w-5xl mx-auto pb-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
          {/* Colonna Principale: Dati Essenziali & Opzioni Fiscali */}
          <div className="lg:col-span-7 flex flex-col gap-4">
            {/* Blocco 1: Descrizione e Importo (Zero attrito) */}
            <section className="bg-surface-card rounded-2xl p-4 sm:p-5 shadow-sm flex flex-col gap-4">
              <div className="flex items-center justify-between gap-2">
                <div>
                  <h2 className="font-headline-sm text-headline-sm text-on-surface font-bold">
                    Dati Preventivo Rapido
                  </h2>
                  <p className="font-body-sm text-body-sm text-text-muted">
                    Inserisci descrizione e importo per generare subito.
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

              {/* Descrizione lavoro */}
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
                  value={description}
                  onChange={(e) => {
                    setDescription(e.target.value);
                    if (errorMsg) setErrorMsg(null);
                  }}
                  placeholder="Es. Rifacimento bagno, sostituzione caldaia..."
                  className="w-full rounded-xl bg-surface-container-low border border-border-slate px-3.5 py-3 font-body-md text-body-md text-on-surface placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-secondary-container/40 focus:border-secondary-container resize-none"
                />
              </div>

              {/* Importo lavori */}
              <div className="flex flex-col gap-1.5">
                <div className="flex items-center justify-between gap-2">
                  <label
                    htmlFor="quote-amount"
                    className="font-label-md text-label-md text-on-surface font-semibold"
                  >
                    Importo lavori (€ imponibile) *
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
                    value={amountInput}
                    onChange={(e) => {
                      setAmountInput(e.target.value);
                      if (errorMsg) setErrorMsg(null);
                    }}
                    placeholder="0,00"
                    className="w-full h-14 pl-10 pr-4 rounded-xl bg-surface-container-low border border-border-slate font-numeric-currency-lg text-[24px] font-bold tabular-nums text-on-surface placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-secondary-container/40 focus:border-secondary-container"
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

              {/* Cliente opzionale compatto */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                <div className="flex flex-col gap-1">
                  <label htmlFor="client-name" className="font-label-sm text-label-sm text-text-muted">
                    Cliente (opzionale)
                  </label>
                  <input
                    id="client-name"
                    type="text"
                    value={clientName}
                    onChange={(e) => setClientName(e.target.value)}
                    placeholder="Nome cliente"
                    className="w-full h-11 px-3 rounded-xl bg-surface-container-low border border-border-slate font-body-md text-body-md text-on-surface placeholder:text-text-muted focus:outline-none focus:border-secondary-container"
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
                    value={clientPhone}
                    onChange={(e) => setClientPhone(e.target.value)}
                    placeholder="+39 348 ..."
                    className="w-full h-11 px-3 rounded-xl bg-surface-container-low border border-border-slate font-body-md text-body-md text-on-surface placeholder:text-text-muted focus:outline-none focus:border-secondary-container"
                  />
                </div>
              </div>

              {/* Pulsante opzionale e compatto per aggiungere 1 foto al volo */}
              <div className="pt-1 flex flex-wrap items-center justify-between gap-3">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  capture="environment"
                  onChange={handlePhotoChange}
                  className="hidden"
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="min-h-[44px] px-3.5 rounded-xl bg-surface-container-low hover:bg-surface-container text-on-surface font-label-md text-label-md flex items-center gap-2 transition-colors"
                >
                  <span className="material-symbols-outlined text-lg text-secondary-container">
                    add_a_photo
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

            {/* Blocco 2: Calcoli Fiscali Semplificati (Solo IVA + Bonus Casa 50%) */}
            <section className="bg-surface-card rounded-2xl p-4 sm:p-5 shadow-sm flex flex-col gap-4">
              <div className="flex items-center justify-between gap-2">
                <h3 className="font-headline-sm text-headline-sm text-on-surface font-bold">
                  IVA &amp; Agevolazione
                </h3>
                <Link
                  to="/listini-iva"
                  className="font-label-sm text-label-sm text-secondary-container hover:underline whitespace-nowrap"
                >
                  Impostazioni base →
                </Link>
              </div>

              {/* Selettore rapido IVA 10% o 22% */}
              <div className="flex flex-col gap-1.5">
                <span className="font-label-sm text-label-sm text-text-muted">Aliquota IVA</span>
                <div className="grid grid-cols-2 gap-2 p-1 bg-surface-container-low rounded-xl">
                  <button
                    type="button"
                    onClick={() => setVatRate(10)}
                    className={`min-h-[44px] rounded-lg font-label-md text-label-md font-bold transition-all ${
                      vatRate === 10
                        ? "bg-primary-container text-on-primary shadow-sm"
                        : "text-on-surface-variant hover:text-on-surface"
                    }`}
                  >
                    IVA 10% (Casa)
                  </button>
                  <button
                    type="button"
                    onClick={() => setVatRate(22)}
                    className={`min-h-[44px] rounded-lg font-label-md text-label-md font-bold transition-all ${
                      vatRate === 22
                        ? "bg-primary-container text-on-primary shadow-sm"
                        : "text-on-surface-variant hover:text-on-surface"
                    }`}
                  >
                    IVA 22% (Ordinaria)
                  </button>
                </div>
              </div>

              {/* Toggle pulito Bonus Casa 50% */}
              <label
                htmlFor="toggle-bonus-50"
                className="min-h-[52px] flex items-center justify-between gap-3 p-3 rounded-xl bg-surface-container-low cursor-pointer"
              >
                <div className="min-w-0">
                  <span className="font-label-lg text-label-lg text-on-surface font-semibold block">
                    Bonus Casa 50%
                  </span>
                  <span className="font-body-sm text-body-sm text-text-muted block">
                    Mostra il costo netto stimato per il cliente
                  </span>
                </div>
                <div className="relative inline-flex items-center shrink-0">
                  <input
                    id="toggle-bonus-50"
                    type="checkbox"
                    checked={bonusCasa50}
                    onChange={(e) => setBonusCasa50(e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-12 h-7 bg-surface-dim rounded-full peer peer-checked:bg-status-success after:content-[''] after:absolute after:top-[3px] after:left-[3px] after:bg-white after:rounded-full after:h-[22px] after:w-[22px] after:transition-all peer-checked:after:translate-x-5" />
                </div>
              </label>
            </section>
          </div>

          {/* Colonna Destra (su desktop) / Sotto (su mobile): Totale & Invio Immediato */}
          <div className="lg:col-span-5 flex flex-col gap-4 lg:sticky lg:top-28">
            <section className="bg-primary-container text-on-primary rounded-2xl p-5 shadow-md flex flex-col gap-3">
              <div className="flex items-center justify-between text-on-primary-container font-body-md text-body-md">
                <span>Imponibile lavori</span>
                <span className="tabular-nums font-medium text-on-primary">{formatEuro(totals.imponibile)}</span>
              </div>
              <div className="flex items-center justify-between text-on-primary-container font-body-md text-body-md pb-3 border-b border-white/10">
                <span>IVA ({vatRate}%)</span>
                <span className="tabular-nums font-medium text-on-primary">{formatEuro(totals.vatAmount)}</span>
              </div>

              <div className="flex items-end justify-between gap-2 pt-1">
                <div>
                  <span className="font-label-sm text-label-sm uppercase tracking-wider text-on-primary-container block">
                    Totale Preventivo
                  </span>
                  <span className="font-body-sm text-body-sm text-on-primary-container">IVA inclusa</span>
                </div>
                <span className="font-numeric-currency-lg text-[32px] leading-none font-extrabold tabular-nums text-on-primary">
                  {formatEuro(totals.total)}
                </span>
              </div>

              {bonusCasa50 && (
                <div className="mt-2 p-3 rounded-xl bg-white/10 flex items-center justify-between gap-2">
                  <span className="font-label-md text-label-md text-tertiary-fixed font-semibold">
                    Netto con Bonus Casa 50%
                  </span>
                  <span className="font-numeric-currency-md text-numeric-currency-md font-bold tabular-nums text-white">
                    {formatEuro(totals.netAfterBonus)}
                  </span>
                </div>
              )}
            </section>

            {errorMsg && (
              <div className="p-3 rounded-xl bg-error-container text-on-error-container font-label-md text-label-md flex items-center gap-2">
                <span className="material-symbols-outlined text-lg">error</span>
                <span>{errorMsg}</span>
              </div>
            )}

            <button
              type="submit"
              id="generate-quote-btn"
              className="w-full h-14 rounded-2xl bg-[#25D366] hover:bg-[#1ebe5d] active:scale-[0.98] transition-all text-white font-headline-sm text-headline-sm font-bold flex items-center justify-center gap-2.5 shadow-md cursor-pointer"
            >
              <span className="material-symbols-outlined text-2xl">send</span>
              <span>Genera e Invia su WhatsApp</span>
            </button>
            <button
              type="button"
              onClick={() => {
                if (!description.trim() || validAmount <= 0) {
                  setErrorMsg("Inserisci descrizione e importo per scaricare il PDF.");
                  return;
                }
                const saved = saveQuoteAsActiveChat({
                  clientName,
                  clientPhone,
                  description,
                  amount: validAmount,
                  vatRate,
                  bonusCasa50,
                  photoDataUrl,
                });
                const file = downloadQuotePdf(saved);
                showToast(`PDF scaricato: ${file}`);
              }}
              className="w-full h-11 rounded-xl bg-surface-card hover:bg-surface-container text-on-surface font-label-md text-label-md font-semibold flex items-center justify-center gap-2 shadow-xs transition-colors"
            >
              <span className="material-symbols-outlined text-lg text-error">picture_as_pdf</span>
              <span>Scarica PDF</span>
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
