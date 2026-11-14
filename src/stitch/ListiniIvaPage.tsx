import { useState } from "react";
import { Link } from "react-router-dom";
import StitchShell from "./StitchShell";
import { useTrialSession } from "./TrialGuard";
import {
  BONUS_OPTIONS,
  VAT_OPTIONS,
  getBonusOption,
  getPocketSettings,
  getVatOption,
  savePocketSettings,
  type BonusOptionId,
  type VatOptionId,
} from "./pocketStore";

export default function ListiniIvaPage() {
  const { trial, requireActiveTrial, openPaywall } = useTrialSession();
  const isReadOnly = trial.isExpired;
  const initial = getPocketSettings();
  const [hourlyRate, setHourlyRate] = useState<string>(String(initial.hourlyRate));
  const [defaultVatId, setDefaultVatId] = useState<VatOptionId>(initial.defaultVatId);
  const [defaultBonusId, setDefaultBonusId] = useState<BonusOptionId>(initial.defaultBonusId);
  const [savedNotice, setSavedNotice] = useState(false);

  const numericRate = Number(hourlyRate.replace(",", "."));
  const safeRate = Number.isFinite(numericRate) && numericRate >= 5 ? numericRate : 35;
  const selectedVat = getVatOption(defaultVatId);
  const selectedBonus = getBonusOption(defaultBonusId);

  const adjustRate = (delta: number) => {
    if (!requireActiveTrial()) return;
    const next = Math.max(5, Math.round((safeRate + delta) * 100) / 100);
    setHourlyRate(String(next));
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!requireActiveTrial()) return;
    const saved = savePocketSettings({
      hourlyRate: safeRate,
      defaultVatId,
      defaultBonusId,
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
              Tariffa Base &amp; Impostazioni Fiscali
            </h2>
            <p className="font-body-sm text-body-sm text-text-muted mt-0.5">
              Valori predefiniti usati nei nuovi preventivi.
            </p>
          </div>

          {/* Costo Orario Base */}
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
                disabled={isReadOnly}
                aria-label="Diminuisci di 1 euro"
                onClick={() => adjustRate(-1)}
                className="w-12 h-12 rounded-xl bg-surface-container-low hover:bg-surface-container text-on-surface font-headline-md text-xl font-bold flex items-center justify-center active:scale-95 transition-transform shrink-0 disabled:opacity-60"
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
                  disabled={isReadOnly}
                  value={hourlyRate}
                  onChange={(e) => setHourlyRate(e.target.value)}
                  className="w-full h-12 pl-8 pr-12 rounded-xl bg-surface-container-low border border-border-slate font-numeric-currency-md text-[22px] font-bold tabular-nums text-on-surface text-center focus:outline-none focus:ring-2 focus:ring-secondary-container/40 focus:border-secondary-container disabled:opacity-65"
                />
                <span className="absolute right-3.5 font-label-sm text-label-sm text-text-muted pointer-events-none">
                  /ora
                </span>
              </div>
              <button
                type="button"
                disabled={isReadOnly}
                aria-label="Aumenta di 1 euro"
                onClick={() => adjustRate(1)}
                className="w-12 h-12 rounded-xl bg-surface-container-low hover:bg-surface-container text-on-surface font-headline-md text-xl font-bold flex items-center justify-center active:scale-95 transition-transform shrink-0 disabled:opacity-60"
              >
                +
              </button>
            </div>
          </div>

          {/* Aliquota IVA predefinita */}
          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="default-vat-select"
              className="font-label-md text-label-md text-on-surface font-semibold"
            >
              Aliquota IVA predefinita
            </label>
            <select
              id="default-vat-select"
              disabled={isReadOnly}
              value={defaultVatId}
              onChange={(e) => setDefaultVatId(e.target.value as VatOptionId)}
              className="w-full h-12 px-3.5 rounded-xl bg-surface-container-low border border-border-slate font-body-md text-body-md font-semibold text-on-surface focus:outline-none focus:ring-2 focus:ring-secondary-container/40 focus:border-secondary-container disabled:opacity-65"
            >
              {VAT_OPTIONS.map((opt) => (
                <option key={opt.id} value={opt.id}>
                  {opt.label}
                </option>
              ))}
            </select>
            <p className="font-body-sm text-body-sm text-text-muted px-0.5">
              {selectedVat.description}
            </p>
          </div>

          {/* Detrazione Fiscale predefinita (opzionale) */}
          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="default-bonus-select"
              className="font-label-md text-label-md text-on-surface font-semibold"
            >
              Detrazione Fiscale / Bonus predefinito
            </label>
            <select
              id="default-bonus-select"
              disabled={isReadOnly}
              value={defaultBonusId}
              onChange={(e) => setDefaultBonusId(e.target.value as BonusOptionId)}
              className="w-full h-12 px-3.5 rounded-xl bg-surface-container-low border border-border-slate font-body-md text-body-md font-semibold text-on-surface focus:outline-none focus:ring-2 focus:ring-secondary-container/40 focus:border-secondary-container disabled:opacity-65"
            >
              {BONUS_OPTIONS.map((opt) => (
                <option key={opt.id} value={opt.id}>
                  {opt.label}
                </option>
              ))}
            </select>
            <p className="font-body-sm text-body-sm text-text-muted px-0.5">
              {selectedBonus.description}
            </p>
          </div>
        </section>

        {isReadOnly ? (
          <button
            type="button"
            id="btn-save-rates"
            onClick={openPaywall}
            className="w-full h-14 bg-secondary-container hover:opacity-95 text-on-secondary rounded-2xl font-headline-sm text-headline-sm font-bold flex items-center justify-center gap-2 shadow-md cursor-pointer"
          >
            <span className="material-symbols-outlined text-xl">lock</span>
            <span>Attiva Abbonamento per Modificare</span>
          </button>
        ) : (
          <button
            type="submit"
            id="btn-save-rates"
            className="w-full h-14 bg-secondary-container hover:opacity-95 active:scale-[0.98] transition-all text-on-secondary rounded-2xl font-headline-sm text-headline-sm font-bold flex items-center justify-center gap-2 shadow-md cursor-pointer"
          >
            <span className="material-symbols-outlined text-xl">check</span>
            <span>Salva Impostazioni</span>
          </button>
        )}

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
