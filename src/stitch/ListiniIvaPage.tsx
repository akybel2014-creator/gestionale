import { useState } from "react";
import { Link } from "react-router-dom";
import StitchShell from "./StitchShell";
import { getPocketSettings, savePocketSettings, type VatRate } from "./pocketStore";

export default function ListiniIvaPage() {
  const initial = getPocketSettings();
  const [hourlyRate, setHourlyRate] = useState<string>(String(initial.hourlyRate));
  const [defaultVat, setDefaultVat] = useState<VatRate>(initial.defaultVat);
  const [savedNotice, setSavedNotice] = useState(false);

  const numericRate = Number(hourlyRate.replace(",", "."));
  const safeRate = Number.isFinite(numericRate) && numericRate >= 5 ? numericRate : 35;

  const adjustRate = (delta: number) => {
    const next = Math.max(5, Math.round((safeRate + delta) * 100) / 100);
    setHourlyRate(String(next));
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const saved = savePocketSettings({
      hourlyRate: safeRate,
      defaultVat,
    });
    setHourlyRate(String(saved.hourlyRate));
    setSavedNotice(true);
    setTimeout(() => setSavedNotice(false), 3000);
  };

  return (
    <StitchShell title="Listini & IVA" activeTab="listini" showFourTabs>
      <form onSubmit={handleSave} className="w-full max-w-xl mx-auto pb-8 flex flex-col gap-5">
        <section className="bg-surface-card rounded-2xl p-5 shadow-sm flex flex-col gap-5">
          <div>
            <h2 className="font-headline-sm text-headline-sm text-on-surface font-bold">
              Tariffa Base &amp; IVA
            </h2>
            <p className="font-body-sm text-body-sm text-text-muted mt-0.5">
              Valori predefiniti usati nei nuovi preventivi.
            </p>
          </div>

          {/* Campo essenziale: Costo Orario Base */}
          <div className="flex flex-col gap-2">
            <label
              htmlFor="hourly-rate-input"
              className="font-label-md text-label-md text-on-surface font-semibold"
            >
              Costo orario base (€/ora)
            </label>
            <div className="flex items-center gap-2">
              <button
                type="button"
                aria-label="Diminuisci di 1 euro"
                onClick={() => adjustRate(-1)}
                className="w-12 h-12 rounded-xl bg-surface-container-low hover:bg-surface-container text-on-surface font-headline-md text-xl font-bold flex items-center justify-center active:scale-95 transition-transform shrink-0"
              >
                -
              </button>
              <div className="relative flex-1 flex items-center">
                <span className="absolute left-3.5 font-headline-sm text-headline-sm text-text-muted font-bold pointer-events-none">
                  €
                </span>
                <input
                  id="hourly-rate-input"
                  type="text"
                  inputMode="decimal"
                  value={hourlyRate}
                  onChange={(e) => setHourlyRate(e.target.value)}
                  className="w-full h-12 pl-8 pr-12 rounded-xl bg-surface-container-low border border-border-slate font-numeric-currency-md text-[22px] font-bold tabular-nums text-on-surface text-center focus:outline-none focus:ring-2 focus:ring-secondary-container/40 focus:border-secondary-container"
                />
                <span className="absolute right-3.5 font-label-sm text-label-sm text-text-muted pointer-events-none">
                  /ora
                </span>
              </div>
              <button
                type="button"
                aria-label="Aumenta di 1 euro"
                onClick={() => adjustRate(1)}
                className="w-12 h-12 rounded-xl bg-surface-container-low hover:bg-surface-container text-on-surface font-headline-md text-xl font-bold flex items-center justify-center active:scale-95 transition-transform shrink-0"
              >
                +
              </button>
            </div>
          </div>

          {/* Campo essenziale: Aliquota IVA Predefinita */}
          <div className="flex flex-col gap-2">
            <span className="font-label-md text-label-md text-on-surface font-semibold">
              Aliquota IVA predefinita
            </span>
            <div className="grid grid-cols-2 gap-2 p-1 bg-surface-container-low rounded-xl">
              <button
                type="button"
                onClick={() => setDefaultVat(10)}
                className={`min-h-[48px] rounded-lg px-3 py-2 flex flex-col items-center justify-center transition-all ${
                  defaultVat === 10
                    ? "bg-primary-container text-on-primary shadow-sm"
                    : "text-on-surface-variant hover:text-on-surface"
                }`}
              >
                <span className="font-headline-sm text-headline-sm font-bold tabular-nums">10%</span>
                <span className="font-body-sm text-[11px] opacity-80">Ristrutturazioni</span>
              </button>
              <button
                type="button"
                onClick={() => setDefaultVat(22)}
                className={`min-h-[48px] rounded-lg px-3 py-2 flex flex-col items-center justify-center transition-all ${
                  defaultVat === 22
                    ? "bg-primary-container text-on-primary shadow-sm"
                    : "text-on-surface-variant hover:text-on-surface"
                }`}
              >
                <span className="font-headline-sm text-headline-sm font-bold tabular-nums">22%</span>
                <span className="font-body-sm text-[11px] opacity-80">Ordinaria</span>
              </button>
            </div>
          </div>
        </section>

        <button
          type="submit"
          id="btn-save-rates"
          className="w-full h-14 bg-secondary-container hover:opacity-95 active:scale-[0.98] transition-all text-on-secondary rounded-2xl font-headline-sm text-headline-sm font-bold flex items-center justify-center gap-2 shadow-md cursor-pointer"
        >
          <span className="material-symbols-outlined text-xl">check</span>
          <span>Salva Impostazioni</span>
        </button>

        {savedNotice && (
          <div className="bg-primary-container text-on-primary px-4 py-3 rounded-xl shadow-md flex items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-status-success text-xl">check_circle</span>
              <span className="font-label-md text-label-md">Impostazioni salvate!</span>
            </div>
            <Link
              to="/preventivo"
              className="font-label-md text-label-md text-secondary-fixed font-semibold hover:underline whitespace-nowrap"
            >
              Vai al Preventivo →
            </Link>
          </div>
        )}
      </form>
    </StitchShell>
  );
}
