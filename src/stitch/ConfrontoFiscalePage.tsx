import { useState } from "react";
import { useNavigate } from "react-router-dom";
import StitchShell from "./StitchShell";

export default function ConfrontoFiscalePage() {
  const navigate = useNavigate();
  const [viewMode, setViewMode] = useState<"side-by-side" | "matrix">("side-by-side");
  const [hasIrpef, setHasIrpef] = useState(true);
  const [wantsLiquidity, setWantsLiquidity] = useState(false);
  const [inlineToast, setInlineToast] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setInlineToast(msg);
    setTimeout(() => setInlineToast(null), 3000);
  };

  const recommendContoTermico = wantsLiquidity || !hasIrpef;

  return (
    <StitchShell title="Whatsapp Hub" activeTab="none">
      <div className="flex flex-col w-full pb-28 space-y-4">
        {/* Top Context & Navigation Header */}
        <div className="flex flex-col space-y-2">
          <div className="flex items-center justify-between">
            <button
              className="inline-flex items-center gap-1.5 py-1 px-2.5 rounded-lg bg-surface-container text-on-surface hover:bg-surface-container-high transition-colors"
              type="button"
              onClick={() => navigate("/ecobonus")}
            >
              <span className="material-symbols-outlined text-lg">arrow_back</span>
              <span className="font-label-md text-label-md">Computo Voci</span>
            </button>
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-primary text-on-primary">
              <span className="material-symbols-outlined text-sm text-secondary-container">verified_user</span>
              <span className="font-label-sm text-label-sm uppercase tracking-wider">Consulenza Fiscale</span>
            </div>
          </div>
          {/* Target Client Meta Card */}
          <div className="p-3.5 rounded-xl bg-surface-card shadow-sm flex flex-col space-y-2">
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-headline-sm text-headline-sm text-primary font-bold">Ing. Roberto Colombo</span>
                  <span className="px-2 py-0.5 rounded-full bg-surface-container-high text-on-surface-variant font-label-sm text-label-sm">
                    PRV-2025-092
                  </span>
                </div>
                <p className="font-body-sm text-body-sm text-text-muted mt-0.5">
                  Pompa di calore ibrida Daikin Multi-Energy + Infissi PVC
                </p>
              </div>
              <div className="text-right">
                <span className="font-label-sm text-label-sm text-text-muted block uppercase">Totale Opere</span>
                <span className="font-numeric-currency-md text-numeric-currency-md text-primary font-bold">
                  € 11.957<span className="text-xs font-normal">,00</span>
                </span>
              </div>
            </div>
            <div className="flex items-center gap-2 pt-2 bg-surface-container-lowest rounded-lg p-2">
              <span className="material-symbols-outlined text-status-warning text-base">info</span>
              <p className="font-body-sm text-body-sm text-on-surface-variant">
                Confronto mirato per guidare la delibera del cliente prima dell&apos;invio finale.
              </p>
            </div>
          </div>
        </div>

        {/* Smart Advisor Suggestion Banner */}
        <div className="p-4 rounded-xl bg-primary-container text-on-primary shadow-sm relative overflow-hidden">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-secondary-container text-on-secondary flex items-center justify-center shrink-0 shadow-sm">
              <span className="material-symbols-outlined text-2xl">tips_and_updates</span>
            </div>
            <div className="flex flex-col space-y-1">
              <div className="flex items-center gap-2">
                <span className="font-label-lg text-label-lg font-bold text-on-primary">Consiglio del Professionista</span>
                <span className="px-1.5 py-0.5 rounded bg-surface-container-highest text-primary font-label-sm text-[10px] uppercase font-bold">
                  Decision Matrix
                </span>
              </div>
              <p className="font-body-sm text-body-sm text-on-primary-container leading-relaxed">
                Se il cliente cerca <strong className="text-on-primary">liquidità rapida</strong> in c/c (60-90 gg) senza
                rischi fiscali, scegli <strong className="text-secondary-fixed">Conto Termico</strong>. Se ha{" "}
                <strong className="text-on-primary">capienza IRPEF &gt; €800/anno</strong>, l&apos;
                <strong className="text-tertiary-fixed">Ecobonus 65%</strong> massimizza il guadagno (+€ 3.522 totali).
              </p>
            </div>
          </div>
        </div>

        {/* Interactive Dual-Switch Tab Selector */}
        <div className="grid grid-cols-2 p-1 rounded-xl bg-surface-container text-center" id="tab-switcher">
          <button
            className={
              viewMode === "side-by-side"
                ? "py-2 rounded-lg font-label-md text-label-md font-semibold transition-all bg-surface-card text-primary shadow-sm"
                : "py-2 rounded-lg font-label-md text-label-md font-semibold text-text-muted hover:text-on-surface transition-all"
            }
            id="btn-side"
            onClick={() => setViewMode("side-by-side")}
            type="button"
          >
            Schede Dettagliate
          </button>
          <button
            className={
              viewMode === "matrix"
                ? "py-2 rounded-lg font-label-md text-label-md font-semibold transition-all bg-surface-card text-primary shadow-sm"
                : "py-2 rounded-lg font-label-md text-label-md font-semibold text-text-muted hover:text-on-surface transition-all"
            }
            id="btn-matrix"
            onClick={() => setViewMode("matrix")}
            type="button"
          >
            Matrice a Confronto
          </button>
        </div>

        {/* SECTION 1: DETAILED DUAL CARDS */}
        <div className={viewMode === "side-by-side" ? "flex flex-col space-y-3.5" : "hidden flex-col space-y-3.5"} id="view-cards">
          {/* Card A: Ecobonus 65% */}
          <div className="rounded-xl bg-surface-card shadow-sm p-4 relative overflow-hidden">
            <div className="flex items-start justify-between pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-lg bg-surface-container flex items-center justify-center text-status-success">
                  <span className="material-symbols-outlined text-xl">account_balance</span>
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="font-headline-sm text-headline-sm text-primary font-bold">Ecobonus 65%</h2>
                    <span className="px-2 py-0.5 rounded-full bg-status-success/10 text-status-success font-label-sm text-label-sm font-bold">
                      Detrazione IRPEF
                    </span>
                  </div>
                  <p className="font-body-sm text-body-sm text-text-muted">Rientro fiscale in 10 rate uguali (Mod. 730/Redditi)</p>
                </div>
              </div>
            </div>
            {/* Financial Metrics Grid */}
            <div className="grid grid-cols-2 gap-2 p-3 rounded-lg bg-surface-container-low mb-3">
              <div>
                <span className="font-label-sm text-label-sm text-text-muted block">Incentivo Totale (65%)</span>
                <span className="font-numeric-currency-md text-numeric-currency-md text-status-success font-bold">-€ 7.772,05</span>
              </div>
              <div>
                <span className="font-label-sm text-label-sm text-text-muted block">Rata Annuale (10 rate)</span>
                <span className="font-numeric-currency-md text-numeric-currency-md text-primary font-bold">
                  € 777,20 <span className="text-xs text-text-muted font-normal">/anno</span>
                </span>
              </div>
              <div className="col-span-2 pt-2 bg-surface-card p-2 rounded flex items-center justify-between">
                <span className="font-label-md text-label-md text-on-surface">Costo netto finale per il cliente:</span>
                <span className="font-numeric-currency-md text-numeric-currency-md text-primary font-bold">€ 4.184,95</span>
              </div>
            </div>
            {/* Operational Highlights & Checklist */}
            <div className="space-y-2 mb-3">
              <div className="flex items-start gap-2">
                <span className="material-symbols-outlined text-status-success text-base shrink-0 mt-0.5">check_circle</span>
                <p className="font-body-sm text-body-sm text-on-surface">
                  <strong className="font-semibold">Vantaggio Primario:</strong> Massimo valore monetario recuperato (+€ 3.522 rispetto a Conto Termico).
                </p>
              </div>
              <div className="flex items-start gap-2">
                <span className="material-symbols-outlined text-error text-base shrink-0 mt-0.5">error</span>
                <p className="font-body-sm text-body-sm text-on-surface">
                  <strong className="font-semibold">Vincolo IRPEF:</strong> Il cliente perde la quota se la sua imposta lorda è inferiore a € 777 nell&apos;anno fiscale.
                </p>
              </div>
              <div className="flex items-start gap-2">
                <span className="material-symbols-outlined text-text-muted text-base shrink-0 mt-0.5">schedule</span>
                <p className="font-body-sm text-body-sm text-text-muted">Tempistica rientro: 10 anni continuativi (rimborso a Luglio).</p>
              </div>
            </div>
            {/* Compliance tags */}
            <div className="p-2.5 rounded-lg bg-surface-container text-on-surface-variant text-xs flex flex-wrap gap-1.5 items-center">
              <span className="font-label-sm text-label-sm uppercase font-bold text-text-muted">Adempimenti:</span>
              <span className="px-2 py-0.5 rounded bg-surface-card text-on-surface font-label-sm text-label-sm">Pratica ENEA</span>
              <span className="px-2 py-0.5 rounded bg-surface-card text-on-surface font-label-sm text-label-sm">Asseverazione DEI</span>
              <span className="px-2 py-0.5 rounded bg-surface-card text-on-surface font-label-sm text-label-sm">Bonifico Parlante</span>
            </div>
          </div>

          {/* Card B: Conto Termico 2.0 */}
          <div className="rounded-xl bg-surface-card shadow-sm p-4 relative overflow-hidden">
            <div className="flex items-start justify-between pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-lg bg-surface-container flex items-center justify-center text-secondary-container">
                  <span className="material-symbols-outlined text-xl">payments</span>
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="font-headline-sm text-headline-sm text-primary font-bold">Conto Termico 2.0</h2>
                    <span className="px-2 py-0.5 rounded-full bg-secondary-container/10 text-secondary font-label-sm text-label-sm font-bold">
                      Bonifico Diretto GSE
                    </span>
                  </div>
                  <p className="font-body-sm text-body-sm text-text-muted">Accredito bancario unico/diretto sul conto corrente</p>
                </div>
              </div>
            </div>
            {/* Financial Metrics Grid */}
            <div className="grid grid-cols-2 gap-2 p-3 rounded-lg bg-surface-container-low mb-3">
              <div>
                <span className="font-label-sm text-label-sm text-text-muted block">Incentivo Diretto GSE</span>
                <span className="font-numeric-currency-md text-numeric-currency-md text-secondary font-bold">-€ 4.250,00</span>
              </div>
              <div>
                <span className="font-label-sm text-label-sm text-text-muted block">Tempistica Accredito</span>
                <span className="font-headline-sm text-headline-sm text-primary font-bold">
                  60-90 gg <span className="text-xs text-text-muted font-normal">in c/c</span>
                </span>
              </div>
              <div className="col-span-2 pt-2 bg-surface-card p-2 rounded flex items-center justify-between">
                <span className="font-label-md text-label-md text-on-surface">Costo effettivo immediato:</span>
                <span className="font-numeric-currency-md text-numeric-currency-md text-primary font-bold">€ 7.707,00</span>
              </div>
            </div>
            {/* Operational Highlights & Checklist */}
            <div className="space-y-2 mb-3">
              <div className="flex items-start gap-2">
                <span className="material-symbols-outlined text-status-success text-base shrink-0 mt-0.5">check_circle</span>
                <p className="font-body-sm text-body-sm text-on-surface">
                  <strong className="font-semibold">Vantaggio Primario:</strong> Liquidità garantita subito sul conto. Accessibile anche a forfettari o pensionati senza IRPEF.
                </p>
              </div>
              <div className="flex items-start gap-2">
                <span className="material-symbols-outlined text-error text-base shrink-0 mt-0.5">remove_circle_outline</span>
                <p className="font-body-sm text-body-sm text-on-surface">
                  <strong className="font-semibold">Svantaggio:</strong> Contributo totale inferiore (-€ 3.522 rispetto alla detrazione decennale).
                </p>
              </div>
              <div className="flex items-start gap-2">
                <span className="material-symbols-outlined text-text-muted text-base shrink-0 mt-0.5">thermostat</span>
                <p className="font-body-sm text-body-sm text-text-muted">Calcolo su Pompa di Calore Daikin 8kW (Zona E, COP &gt; 4.1).</p>
              </div>
            </div>
            {/* Compliance tags */}
            <div className="p-2.5 rounded-lg bg-surface-container text-on-surface-variant text-xs flex flex-wrap gap-1.5 items-center">
              <span className="font-label-sm text-label-sm uppercase font-bold text-text-muted">Adempimenti:</span>
              <span className="px-2 py-0.5 rounded bg-surface-card text-on-surface font-label-sm text-label-sm">Portaltermico GSE</span>
              <span className="px-2 py-0.5 rounded bg-surface-card text-on-surface font-label-sm text-label-sm">Smaltimento Certificato</span>
              <span className="px-2 py-0.5 rounded bg-surface-card text-on-surface font-label-sm text-label-sm">Nessuna Capienza Richiesta</span>
            </div>
          </div>
        </div>

        {/* SECTION 2: SYNTHETIC COMPARISON MATRIX */}
        <div className={viewMode === "matrix" ? "flex flex-col space-y-3" : "hidden flex-col space-y-3"} id="view-matrix">
          <div className="rounded-xl bg-surface-card shadow-sm p-4 overflow-hidden">
            <div className="flex items-center justify-between pb-3">
              <span className="font-headline-sm text-headline-sm text-primary font-bold">Matrice di Confronto Tecnico</span>
              <span className="font-label-sm text-label-sm text-text-muted">Dati simulati al centesimo</span>
            </div>
            <div className="overflow-x-auto -mx-4 px-4">
              <table className="w-full text-left font-body-sm text-body-sm">
                <thead>
                  <tr className="bg-surface-container text-on-surface font-label-md text-label-md">
                    <th className="p-2.5 rounded-l-lg">Parametro</th>
                    <th className="p-2.5 text-status-success">Ecobonus 65%</th>
                    <th className="p-2.5 rounded-r-lg text-secondary">Conto Termico</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-surface-container-high">
                  <tr>
                    <td className="p-2.5 font-semibold text-primary">Erogazione</td>
                    <td className="p-2.5 text-on-surface-variant">10 rate IRPEF annuali</td>
                    <td className="p-2.5 text-on-surface-variant">Bonifico Diretto GSE</td>
                  </tr>
                  <tr className="bg-surface-container-low/50">
                    <td className="p-2.5 font-semibold text-primary">Tempi Rientro</td>
                    <td className="p-2.5 font-semibold text-on-surface">10 Anni (Luglio)</td>
                    <td className="p-2.5 font-semibold text-secondary">60 - 90 Giorni</td>
                  </tr>
                  <tr>
                    <td className="p-2.5 font-semibold text-primary">Importo Riconosciuto</td>
                    <td className="p-2.5 font-bold text-status-success">€ 7.772,05</td>
                    <td className="p-2.5 font-bold text-secondary">€ 4.250,00</td>
                  </tr>
                  <tr className="bg-surface-container-low/50">
                    <td className="p-2.5 font-semibold text-primary">Vincolo Capienza IRPEF</td>
                    <td className="p-2.5 text-status-danger font-semibold">Sì (Obbligatoria)</td>
                    <td className="p-2.5 text-status-success font-semibold">No (Per Tutti)</td>
                  </tr>
                  <tr>
                    <td className="p-2.5 font-semibold text-primary">Piattaforma Invio</td>
                    <td className="p-2.5 text-text-muted">ENEA Ecobonus</td>
                    <td className="p-2.5 text-text-muted">Portaltermico GSE</td>
                  </tr>
                  <tr className="bg-surface-container-high/40">
                    <td className="p-2.5 font-bold text-primary">Esborso Finale Netto</td>
                    <td className="p-2.5 font-headline-sm text-headline-sm text-status-success font-bold">€ 4.184,95</td>
                    <td className="p-2.5 font-headline-sm text-headline-sm text-primary font-bold">€ 7.707,00</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* SECTION 3: INTERACTIVE CLIENT PROFILE CHECKLIST */}
        <div className="rounded-xl bg-surface-card shadow-sm p-4 space-y-3">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-secondary-container">psychology_alt</span>
            <h3 className="font-headline-sm text-headline-sm text-primary font-bold">Checklist Decisionale per Roberto Colombo</h3>
          </div>
          <p className="font-body-sm text-body-sm text-text-muted">
            Rispondi a questi due quesiti per generare l&apos;argomentazione ideale di vendita:
          </p>
          <div className="space-y-2.5">
            {/* Question 1 */}
            <label className="flex items-start gap-3 p-3 rounded-lg bg-surface-container-low cursor-pointer hover:bg-surface-container transition-colors">
              <input
                checked={hasIrpef}
                className="mt-1 h-5 w-5 rounded text-secondary-container focus:ring-secondary-container accent-secondary-container cursor-pointer"
                id="check-irpef"
                onChange={(e) => setHasIrpef(e.target.checked)}
                type="checkbox"
              />
              <div className="flex flex-col">
                <span className="font-label-lg text-label-lg text-primary font-semibold">
                  Ha capienza fiscale IRPEF ≥ € 800/anno?
                </span>
                <span className="font-body-sm text-body-sm text-text-muted">
                  Dipendente a tempo indeterminato, libero professionista in regime ordinario o pensionato con redditi medio-alti.
                </span>
              </div>
            </label>
            {/* Question 2 */}
            <label className="flex items-start gap-3 p-3 rounded-lg bg-surface-container-low cursor-pointer hover:bg-surface-container transition-colors">
              <input
                checked={wantsLiquidity}
                className="mt-1 h-5 w-5 rounded text-secondary-container focus:ring-secondary-container accent-secondary-container cursor-pointer"
                id="check-liquidity"
                onChange={(e) => setWantsLiquidity(e.target.checked)}
                type="checkbox"
              />
              <div className="flex flex-col">
                <span className="font-label-lg text-label-lg text-primary font-semibold">
                  Preferisce liquidità immediata rispetto al massimo risparmio decennale?
                </span>
                <span className="font-body-sm text-body-sm text-text-muted">
                  Priorità alla disponibilità di cassa a breve termine per ammortizzare i lavori senza debiti fiscali.
                </span>
              </div>
            </label>
          </div>
          {/* Dynamic Result Tag */}
          {recommendContoTermico ? (
            <div
              className="p-3 rounded-lg bg-secondary-container/10 text-on-surface flex items-center justify-between transition-colors"
              id="advice-result"
            >
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-secondary font-bold">payments</span>
                <span className="font-label-md text-label-md font-bold text-secondary">Consiglio: Proponi CONTO TERMICO 2.0</span>
              </div>
              <span className="font-label-sm text-label-sm text-text-muted">Bonifico rapido in 60-90 gg</span>
            </div>
          ) : (
            <div
              className="p-3 rounded-lg bg-status-success/10 text-on-surface flex items-center justify-between transition-colors"
              id="advice-result"
            >
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-status-success font-bold">recommend</span>
                <span className="font-label-md text-label-md font-bold text-status-success">Consiglio: Proponi ECOBONUS 65%</span>
              </div>
              <span className="font-label-sm text-label-sm text-text-muted">+€ 3.522 di risparmio totale</span>
            </div>
          )}
        </div>

        {/* Informative Field Note */}
        <div className="p-3 rounded-xl bg-surface-container flex items-center gap-2.5 text-on-surface-variant">
          <span className="material-symbols-outlined text-primary text-xl shrink-0">engineering</span>
          <p className="font-body-sm text-body-sm leading-tight">
            Il preventivo include già l&apos;asseverazione tecnica della Daikin Multi-Energy con COP 4.3 conforme ai requisiti tecnici di entrambi i canali.
          </p>
        </div>

        {/* FIXED STICKY BOTTOM ACTION DECK */}
        <div className="fixed bottom-16 inset-x-0 z-40 p-margin bg-surface-card/95 backdrop-blur-md shadow-[0_-4px_16px_rgba(0,0,0,0.08)] flex flex-col space-y-2">
          {/* Main Orange WhatsApp Dispatch Button */}
          <button
            className="w-full h-12 rounded-xl bg-secondary-container hover:bg-secondary text-on-secondary font-label-lg text-label-lg font-bold flex items-center justify-center gap-2 shadow-md active:scale-[0.98] transition-all"
            onClick={() => navigate("/anteprima-whatsapp-colombo")}
            type="button"
          >
            <span className="material-symbols-outlined text-xl">send_to_mobile</span>
            <span>Invia Confronto PDF su WhatsApp</span>
          </button>
          {/* Quick Apply Dual Buttons */}
          <div className="grid grid-cols-2 gap-2">
            <button
              className="h-10 rounded-lg bg-surface-container hover:bg-surface-container-high text-on-surface font-label-md text-label-md font-semibold flex items-center justify-center gap-1.5 transition-colors"
              onClick={() => {
                showToast("Ecobonus 65% applicato con successo al preventivo!");
                setTimeout(() => navigate("/ecobonus"), 900);
              }}
              type="button"
            >
              <span className="material-symbols-outlined text-status-success text-base">check</span>
              <span>Applica Ecobonus 65%</span>
            </button>
            <button
              className="h-10 rounded-lg bg-surface-container hover:bg-surface-container-high text-on-surface font-label-md text-label-md font-semibold flex items-center justify-center gap-1.5 transition-colors"
              onClick={() => {
                showToast("Conto Termico 2.0 applicato! Apertura pratica GSE...");
                setTimeout(() => navigate("/pratica-gse"), 900);
              }}
              type="button"
            >
              <span className="material-symbols-outlined text-secondary-container text-base">check</span>
              <span>Applica Conto Termico</span>
            </button>
          </div>
        </div>

        {inlineToast && (
          <div className="fixed bottom-44 left-4 right-4 max-w-md mx-auto bg-primary text-on-primary p-3 rounded-xl shadow-2xl flex items-center justify-between gap-3 z-50">
            <div className="flex items-center gap-2.5">
              <span className="material-symbols-outlined text-status-success">check_circle</span>
              <span className="font-body-sm text-body-sm font-medium">{inlineToast}</span>
            </div>
          </div>
        )}
      </div>
    </StitchShell>
  );
}
