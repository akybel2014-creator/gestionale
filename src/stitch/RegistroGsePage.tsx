import { useState } from "react";
import { useNavigate } from "react-router-dom";
import StitchShell from "./StitchShell";

type FilterKey = "all" | "istruttoria" | "solleciti" | "integrazione" | "liquidate";

export default function RegistroGsePage() {
  const navigate = useNavigate();
  const [activeFilter, setActiveFilter] = useState<FilterKey>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const triggerToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => {
      setToastMsg((curr) => (curr === msg ? null : curr));
    }, 2200);
  };

  const q = searchQuery.trim().toLowerCase();

  const matchesCard = (statuses: string[], searchableText: string) => {
    const matchesChip = activeFilter === "all" || statuses.includes(activeFilter);
    const matchesSearch = !q || searchableText.toLowerCase().includes(q);
    return matchesChip && matchesSearch;
  };

  const c1 = matchesCard(
    ["istruttoria", "solleciti"],
    "gse-ct2-2025-0814 int 2.a ing roberto colombo milano 4.250 sostituzione pompa di calore ibrida 8kw prot gse/2025/ct-991204 giorno 28/60"
  );
  const c2 = matchesCard(
    ["liquidate"],
    "gse-ct2-2025-0792 int 2.a arch elena moretti monza 4.980 pompa di calore aria-acqua 12kw giorno 56/60 ammessa agli incentivi gse"
  );
  const c3 = matchesCard(
    ["integrazione", "solleciti"],
    "gse-ct2-2025-0801 int 2.c condominio bellini dr rinaldi sesto san giovanni 8.450 richiesta integrazione documentale gse schema unifilare ape"
  );
  const c4 = matchesCard(
    ["solleciti"],
    "gse-ct2-2025-0765 int 2.b geom valerio ferri bergamo 3.820 biomassa pellet 25kw termini decorsi sollecito pec inviato giorno 42/60"
  );
  const c5 = matchesCard(
    ["liquidate"],
    "gse-ct2-2025-0710 int 2.a dr.ssa giulia bianchi como 3.650 pompa di calore 6kw bonifico gse ricevuto pratica chiusa"
  );

  const handleSelectChip = (filter: FilterKey, countShown: number) => {
    setActiveFilter(filter);
    triggerToast(`Mostrate ${countShown} pratiche per il filtro selezionato`);
  };

  return (
    <StitchShell title="Whatsapp Hub" activeTab="none">
      <div className="flex flex-col w-full">
        {/* Navigazione Superiore Locale & Quick Actions */}
        <div className="flex flex-col gap-space-sm mb-space-md">
          <div className="flex items-center justify-between">
            <button
              className="inline-flex items-center gap-1 text-on-surface-variant hover:text-primary transition-colors py-1"
              onClick={() => navigate("/pratica-gse")}
              type="button"
            >
              <span className="material-symbols-outlined text-lg">arrow_back</span>
              <span className="font-label-md text-label-md">Torna a Pratiche</span>
            </button>
            <div className="flex items-center gap-1.5 bg-surface-container px-2.5 py-1 rounded-full">
              <span className="w-2 h-2 rounded-full bg-status-success animate-pulse" />
              <span className="font-label-sm text-label-sm text-on-surface-variant">Portale GSE Sincronizzato</span>
            </div>
          </div>
          {/* Overview Bar con Totale e Tasto Primario */}
          <div className="bg-surface-card p-4 rounded-xl shadow-sm flex flex-col gap-3">
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-headline-sm text-headline-sm text-primary">Registro GSE Conto Termico 2.0</span>
                  <span className="px-2 py-0.5 rounded-full bg-surface-container-highest text-on-primary-fixed-variant font-label-sm text-label-sm font-bold">
                    14 Attive
                  </span>
                </div>
                <p className="font-body-sm text-body-sm text-text-muted mt-0.5">
                  Gestione istruttorie, scadenziari 30-60gg e liquidazioni
                </p>
              </div>
            </div>
            <div className="flex items-center justify-between bg-surface-container-low p-3 rounded-lg">
              <div className="flex flex-col">
                <span className="font-label-sm text-label-sm text-text-muted uppercase">Incentivi Totali in Gestione</span>
                <span className="font-numeric-currency-lg text-numeric-currency-lg text-primary tracking-tight">€ 58.420,00</span>
              </div>
              <button
                className="h-10 px-3.5 bg-secondary-container text-on-secondary rounded-lg font-label-md text-label-md flex items-center gap-1.5 shadow-sm active:scale-95 transition-transform"
                onClick={() => navigate("/pratica-gse")}
                type="button"
              >
                <span className="material-symbols-outlined text-lg">add_circle</span>
                <span>+ Nuova Pratica</span>
              </button>
            </div>
          </div>
        </div>

        {/* KPI Metriche Operative a Scorrimento Orizzontale */}
        <div className="flex gap-2.5 overflow-x-auto pb-1.5 -mx-margin px-margin scrollbar-none mb-space-md">
          {/* Card KPI 1 */}
          <div className="min-w-[155px] flex-shrink-0 bg-surface-card p-3 rounded-xl shadow-sm flex flex-col justify-between">
            <div className="flex items-center justify-between mb-1.5">
              <span className="font-label-sm text-label-sm text-text-muted font-medium">In Istruttoria</span>
              <span className="material-symbols-outlined text-base text-primary-container">pending_actions</span>
            </div>
            <div className="flex items-baseline gap-1.5">
              <span className="font-numeric-currency-md text-numeric-currency-md text-primary font-bold">6</span>
              <span className="font-label-sm text-label-sm text-text-muted">pratiche</span>
            </div>
            <span className="font-body-sm text-body-sm text-on-surface-variant font-medium mt-1">€ 24.800,00</span>
            <div className="w-full bg-surface-container rounded-full h-1 mt-2 overflow-hidden">
              <div className="bg-primary-container h-full w-[43%]" />
            </div>
          </div>
          {/* Card KPI 2: Alert Scadenze */}
          <div className="min-w-[155px] flex-shrink-0 bg-surface-card p-3 rounded-xl shadow-sm flex flex-col justify-between relative overflow-hidden">
            <div className="flex items-center justify-between mb-1.5">
              <span className="font-label-sm text-label-sm text-secondary font-bold">Soglia Sollecito</span>
              <span className="material-symbols-outlined text-base text-secondary">warning</span>
            </div>
            <div className="flex items-baseline gap-1.5">
              <span className="font-numeric-currency-md text-numeric-currency-md text-secondary font-bold">3</span>
              <span className="font-label-sm text-label-sm text-secondary">critiche</span>
            </div>
            <span className="font-body-sm text-body-sm text-secondary font-medium mt-1">€ 12.750,00</span>
            <div className="w-full bg-secondary-fixed rounded-full h-1 mt-2 overflow-hidden">
              <div className="bg-secondary-container h-full w-[70%]" />
            </div>
          </div>
          {/* Card KPI 3 */}
          <div className="min-w-[155px] flex-shrink-0 bg-surface-card p-3 rounded-xl shadow-sm flex flex-col justify-between">
            <div className="flex items-center justify-between mb-1.5">
              <span className="font-label-sm text-label-sm text-status-success font-semibold">In Liquidazione</span>
              <span className="material-symbols-outlined text-base text-status-success">payments</span>
            </div>
            <div className="flex items-baseline gap-1.5">
              <span className="font-numeric-currency-md text-numeric-currency-md text-primary font-bold">4</span>
              <span className="font-label-sm text-label-sm text-text-muted">approvate</span>
            </div>
            <span className="font-body-sm text-body-sm text-on-surface-variant font-medium mt-1">€ 16.620,00</span>
            <div className="w-full bg-surface-container rounded-full h-1 mt-2 overflow-hidden">
              <div className="bg-status-success h-full w-[80%]" />
            </div>
          </div>
          {/* Card KPI 4 */}
          <div className="min-w-[155px] flex-shrink-0 bg-surface-card p-3 rounded-xl shadow-sm flex flex-col justify-between">
            <div className="flex items-center justify-between mb-1.5">
              <span className="font-label-sm text-label-sm text-text-muted font-medium">Liquidate Mese</span>
              <span className="material-symbols-outlined text-base text-on-tertiary-container">verified</span>
            </div>
            <div className="flex items-baseline gap-1.5">
              <span className="font-numeric-currency-md text-numeric-currency-md text-primary font-bold">1</span>
              <span className="font-label-sm text-label-sm text-text-muted">accreditata</span>
            </div>
            <span className="font-body-sm text-body-sm text-on-tertiary-container font-medium mt-1">€ 4.250,00</span>
            <div className="w-full bg-surface-container rounded-full h-1 mt-2 overflow-hidden">
              <div className="bg-on-tertiary-container h-full w-full" />
            </div>
          </div>
        </div>

        {/* Box Performance & Benchmark GSE */}
        <div className="bg-surface-container-high p-3 rounded-xl mb-space-md flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-surface-card flex items-center justify-center text-primary">
              <span className="material-symbols-outlined text-lg">speed</span>
            </div>
            <div>
              <div className="font-label-md text-label-md text-primary">
                Tempo medio erogazione GSE: <strong className="font-bold">48 gg</strong>
              </div>
              <div className="font-body-sm text-body-sm text-text-muted">
                Tasso di approvazione al primo invio: <span className="text-status-success font-semibold">98.2%</span>
              </div>
            </div>
          </div>
          <span className="material-symbols-outlined text-text-muted text-base">insights</span>
        </div>

        {/* Ricerca e Filtri a Schede */}
        <div className="flex flex-col gap-2.5 mb-space-md">
          {/* Barra di Ricerca */}
          <div className="relative w-full">
            <input
              className="w-full h-11 pl-10 pr-9 bg-surface-card rounded-xl font-body-md text-body-md text-primary placeholder:text-text-muted shadow-sm focus:outline-none focus:bg-surface-bright"
              id="searchPractices"
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cerca per cliente, protocollo GSE o intervento..."
              type="text"
              value={searchQuery}
            />
            <span className="material-symbols-outlined absolute left-3 top-2.5 text-text-muted text-xl pointer-events-none">search</span>
            <button
              className="absolute right-2.5 top-2.5 text-text-muted hover:text-primary transition-colors"
              onClick={() => setSearchQuery("")}
              type="button"
            >
              <span className="material-symbols-outlined text-lg">cancel</span>
            </button>
          </div>
          {/* Chips Filtro Rapido */}
          <div className="flex gap-2 overflow-x-auto pb-1 -mx-margin px-margin scrollbar-none">
            <button
              className={`filter-chip h-8 px-3 rounded-full font-label-sm text-label-sm whitespace-nowrap shadow-sm active:scale-95 transition-transform ${
                activeFilter === "all"
                  ? "bg-primary text-on-primary"
                  : "bg-surface-card text-on-surface-variant hover:bg-surface-container"
              }`}
              onClick={() => handleSelectChip("all", 5)}
              type="button"
            >
              Tutte (14)
            </button>
            <button
              className={`filter-chip h-8 px-3 rounded-full font-label-sm text-label-sm whitespace-nowrap shadow-sm active:scale-95 transition-transform ${
                activeFilter === "istruttoria"
                  ? "bg-primary text-on-primary"
                  : "bg-surface-card text-on-surface-variant hover:bg-surface-container"
              }`}
              onClick={() => handleSelectChip("istruttoria", 1)}
              type="button"
            >
              In Istruttoria (6)
            </button>
            <button
              className={`filter-chip h-8 px-3 rounded-full font-label-sm text-label-sm whitespace-nowrap shadow-sm active:scale-95 transition-transform flex items-center gap-1 ${
                activeFilter === "solleciti"
                  ? "bg-primary text-on-primary"
                  : "bg-surface-card text-secondary hover:bg-surface-container"
              }`}
              onClick={() => handleSelectChip("solleciti", 3)}
              type="button"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-secondary" />
              Attesa / Solleciti (3)
            </button>
            <button
              className={`filter-chip h-8 px-3 rounded-full font-label-sm text-label-sm whitespace-nowrap shadow-sm active:scale-95 transition-transform flex items-center gap-1 ${
                activeFilter === "integrazione"
                  ? "bg-primary text-on-primary"
                  : "bg-surface-card text-status-warning hover:bg-surface-container"
              }`}
              onClick={() => handleSelectChip("integrazione", 1)}
              type="button"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-status-warning" />
              Integrazioni (1)
            </button>
            <button
              className={`filter-chip h-8 px-3 rounded-full font-label-sm text-label-sm whitespace-nowrap shadow-sm active:scale-95 transition-transform ${
                activeFilter === "liquidate"
                  ? "bg-primary text-on-primary"
                  : "bg-surface-card text-status-success hover:bg-surface-container"
              }`}
              onClick={() => handleSelectChip("liquidate", 2)}
              type="button"
            >
              Liquidate (4)
            </button>
          </div>
        </div>

        {/* Sezione Elenco Pratiche */}
        <div className="flex flex-col gap-3.5 mb-space-lg">
          {/* Card 1: Istruttoria di Merito con Timer Sollecito */}
          {c1 && (
            <article className="bg-surface-card rounded-xl p-4 shadow-sm flex flex-col gap-3 relative transition-all active:scale-[0.99]">
              <div className="flex items-start justify-between gap-2">
                <div className="flex flex-col">
                  <div className="flex items-center gap-1.5">
                    <span className="font-label-sm text-label-sm font-bold text-primary">GSE-CT2-2025-0814</span>
                    <span className="text-text-muted text-xs">•</span>
                    <span className="font-body-sm text-body-sm text-text-muted">Int. 2.A</span>
                  </div>
                  <h2 className="font-headline-sm text-headline-sm text-primary mt-0.5">Ing. Roberto Colombo</h2>
                  <span className="font-body-sm text-body-sm text-text-muted flex items-center gap-1">
                    <span className="material-symbols-outlined text-sm">location_on</span> Milano (MI)
                  </span>
                </div>
                <div className="text-right">
                  <div className="font-numeric-currency-md text-numeric-currency-md text-primary font-bold">€ 4.250,00</div>
                  <span className="font-label-sm text-label-sm text-text-muted">Rata Unica</span>
                </div>
              </div>
              <div className="bg-surface-container-low p-2.5 rounded-lg flex flex-col gap-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-body-sm text-body-sm text-on-surface-variant font-medium">
                    Sostituzione Pompa di Calore Ibrida 8kW
                  </span>
                  <span className="font-label-sm text-label-sm text-text-muted">Invio: 24 Ott 2025</span>
                </div>
                <div className="flex items-center justify-between text-xs pt-1">
                  <span className="font-label-sm text-label-sm text-text-muted">Prot: GSE/2025/CT-991204</span>
                  <span className="font-label-sm text-label-sm text-secondary font-bold">Giorno 28/60 (Sollecito tra 2 gg)</span>
                </div>
                <div className="w-full bg-surface-container-highest rounded-full h-1.5 overflow-hidden mt-0.5">
                  <div className="bg-secondary-container h-full w-[47%] rounded-full" />
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-secondary-fixed text-on-secondary-fixed-variant font-label-sm text-label-sm font-semibold">
                  <span className="material-symbols-outlined text-sm">hourglass_top</span>
                  <span>Istruttoria di Merito • 28/60 gg</span>
                </div>
                <div className="flex items-center gap-1">
                  <button
                    className="w-9 h-9 rounded-lg bg-surface-container-low text-primary flex items-center justify-center hover:bg-surface-container active:scale-95 transition-transform"
                    onClick={() => navigate("/istruttoria-gse")}
                    title="Note & Solleciti"
                    type="button"
                  >
                    <span className="material-symbols-outlined text-lg">edit_note</span>
                  </button>
                  <button
                    className="w-9 h-9 rounded-lg bg-status-success/15 text-status-success flex items-center justify-center hover:bg-status-success/25 active:scale-95 transition-transform"
                    onClick={() => navigate("/notifica-massiva")}
                    title="Avvisa su WhatsApp"
                    type="button"
                  >
                    <span className="material-symbols-outlined text-lg">chat</span>
                  </button>
                  <button
                    className="h-9 px-3 rounded-lg bg-primary-container text-on-primary font-label-sm text-label-sm flex items-center gap-1 active:scale-95 transition-transform"
                    onClick={() => navigate("/pratica-gse")}
                    type="button"
                  >
                    <span>Fascicolo</span>
                    <span className="material-symbols-outlined text-sm">chevron_right</span>
                  </button>
                </div>
              </div>
            </article>
          )}

          {/* Card 2: Approvata / In Attesa Mandato di Pagamento */}
          {c2 && (
            <article className="bg-surface-card rounded-xl p-4 shadow-sm flex flex-col gap-3 relative transition-all active:scale-[0.99]">
              <div className="flex items-start justify-between gap-2">
                <div className="flex flex-col">
                  <div className="flex items-center gap-1.5">
                    <span className="font-label-sm text-label-sm font-bold text-primary">GSE-CT2-2025-0792</span>
                    <span className="text-text-muted text-xs">•</span>
                    <span className="font-body-sm text-body-sm text-text-muted">Int. 2.A</span>
                  </div>
                  <h2 className="font-headline-sm text-headline-sm text-primary mt-0.5">Arch. Elena Moretti</h2>
                  <span className="font-body-sm text-body-sm text-text-muted flex items-center gap-1">
                    <span className="material-symbols-outlined text-sm">location_on</span> Monza (MB)
                  </span>
                </div>
                <div className="text-right">
                  <div className="font-numeric-currency-md text-numeric-currency-md text-status-success font-bold">€ 4.980,00</div>
                  <span className="font-label-sm text-label-sm text-status-success font-semibold">Liquidazione Prevista</span>
                </div>
              </div>
              <div className="bg-surface-container-low p-2.5 rounded-lg flex flex-col gap-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-body-sm text-body-sm text-on-surface-variant font-medium">
                    Pompa di Calore Aria-Acqua 12kW
                  </span>
                  <span className="font-label-sm text-label-sm text-text-muted">Invio: 12 Set 2025</span>
                </div>
                <div className="flex items-center justify-between text-xs pt-0.5">
                  <span className="font-label-sm text-label-sm text-status-success font-semibold">
                    Accredito stimato: entro 15 Dic 2025
                  </span>
                  <span className="font-label-sm text-label-sm text-text-muted">Giorno 56/60</span>
                </div>
                <div className="w-full bg-surface-container-highest rounded-full h-1.5 overflow-hidden">
                  <div className="bg-status-success h-full w-[94%] rounded-full" />
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-status-success/15 text-status-success font-label-sm text-label-sm font-semibold">
                  <span className="material-symbols-outlined text-sm">task_alt</span>
                  <span>Ammessa agli Incentivi GSE</span>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    className="h-9 px-3 rounded-lg bg-surface-container-low text-primary font-label-sm text-label-sm flex items-center gap-1 active:scale-95 transition-transform"
                    onClick={() => navigate("/ricevuta-gse")}
                    type="button"
                  >
                    <span className="material-symbols-outlined text-base">receipt_long</span>
                    <span>Ricevuta GSE</span>
                  </button>
                  <button
                    className="w-9 h-9 rounded-lg bg-status-success/15 text-status-success flex items-center justify-center hover:bg-status-success/25 active:scale-95 transition-transform"
                    onClick={() => navigate("/notifica-massiva")}
                    title="Invia conferma Elena"
                    type="button"
                  >
                    <span className="material-symbols-outlined text-lg">share</span>
                  </button>
                </div>
              </div>
            </article>
          )}

          {/* Card 3: Alert Integrazione Documentale (Priorità Urgente) */}
          {c3 && (
            <article className="bg-surface-card rounded-xl p-4 shadow-sm flex flex-col gap-3 relative transition-all active:scale-[0.99]">
              <div className="flex items-start justify-between gap-2">
                <div className="flex flex-col">
                  <div className="flex items-center gap-1.5">
                    <span className="font-label-sm text-label-sm font-bold text-status-warning">GSE-CT2-2025-0801</span>
                    <span className="text-text-muted text-xs">•</span>
                    <span className="font-body-sm text-body-sm text-text-muted">Int. 2.C</span>
                  </div>
                  <h2 className="font-headline-sm text-headline-sm text-primary mt-0.5">Condominio Bellini (Dr. Rinaldi)</h2>
                  <span className="font-body-sm text-body-sm text-text-muted flex items-center gap-1">
                    <span className="material-symbols-outlined text-sm">location_on</span> Sesto San Giovanni (MI)
                  </span>
                </div>
                <div className="text-right">
                  <div className="font-numeric-currency-md text-numeric-currency-md text-primary font-bold">€ 8.450,00</div>
                  <span className="font-label-sm text-label-sm text-text-muted">2 Rate x € 4.225</span>
                </div>
              </div>
              <div className="bg-status-warning/10 p-3 rounded-lg flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <span className="font-label-sm text-label-sm text-status-warning font-bold flex items-center gap-1">
                    <span className="material-symbols-outlined text-base">priority_high</span>
                    Richiesta Integrazione Documentale GSE
                  </span>
                  <span className="font-label-sm text-label-sm bg-status-warning/20 text-status-warning px-2 py-0.5 rounded-full font-bold">
                    Mancano 11 gg
                  </span>
                </div>
                <p className="font-body-sm text-body-sm text-on-surface-variant">
                  Richiesto: <strong className="text-primary font-semibold">Schema unifilare integrativo</strong> e{" "}
                  <strong className="text-primary font-semibold">APE asseverato post-operam</strong> con timbro termotecnico.
                </p>
              </div>
              <div className="flex items-center justify-between pt-0.5">
                <span className="font-body-sm text-body-sm text-text-muted">Termine perentorio: 30 gg</span>
                <button
                  className="h-9 px-4 rounded-lg bg-secondary-container text-on-secondary font-label-md text-label-md font-semibold flex items-center gap-1.5 shadow-sm active:scale-95 transition-transform"
                  onClick={() => navigate("/pratica-gse")}
                  type="button"
                >
                  <span className="material-symbols-outlined text-base">cloud_upload</span>
                  <span>Carica Integrazione</span>
                </button>
              </div>
            </article>
          )}

          {/* Card 4: Termini Decorsi & Sollecito Formale PEC Inviato */}
          {c4 && (
            <article className="bg-surface-card rounded-xl p-4 shadow-sm flex flex-col gap-3 relative transition-all active:scale-[0.99]">
              <div className="flex items-start justify-between gap-2">
                <div className="flex flex-col">
                  <div className="flex items-center gap-1.5">
                    <span className="font-label-sm text-label-sm font-bold text-status-danger">GSE-CT2-2025-0765</span>
                    <span className="text-text-muted text-xs">•</span>
                    <span className="font-body-sm text-body-sm text-text-muted">Int. 2.B</span>
                  </div>
                  <h2 className="font-headline-sm text-headline-sm text-primary mt-0.5">Geom. Valerio Ferri</h2>
                  <span className="font-body-sm text-body-sm text-text-muted flex items-center gap-1">
                    <span className="material-symbols-outlined text-sm">location_on</span> Bergamo (BG)
                  </span>
                </div>
                <div className="text-right">
                  <div className="font-numeric-currency-md text-numeric-currency-md text-primary font-bold">€ 3.820,00</div>
                  <span className="font-label-sm text-label-sm text-text-muted">Biomassa Pellet 25kW</span>
                </div>
              </div>
              <div className="bg-error-container/40 p-2.5 rounded-lg flex flex-col gap-1">
                <div className="flex items-center justify-between">
                  <span className="font-label-sm text-label-sm text-status-danger font-bold flex items-center gap-1">
                    <span className="material-symbols-outlined text-base">notification_important</span>
                    Termini Decorsi • Sollecito PEC inviato
                  </span>
                  <span className="font-label-sm text-label-sm text-status-danger font-bold">Giorno 42/60</span>
                </div>
                <span className="font-body-sm text-body-sm text-on-error-container">
                  Sollecito inoltrato 5 giorni fa via PEC aziendale. Nessun esito dal responsabile del procedimento GSE.
                </span>
              </div>
              <div className="flex items-center justify-between">
                <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-surface-container text-text-muted font-label-sm text-label-sm">
                  <span>Ticket GSE #91204</span>
                </div>
                <button
                  className="h-9 px-3 rounded-lg bg-surface-container-low text-secondary font-label-sm text-label-sm flex items-center gap-1 hover:bg-secondary-fixed/50 active:scale-95 transition-transform"
                  onClick={() => navigate("/istruttoria-gse")}
                  type="button"
                >
                  <span className="material-symbols-outlined text-base">forward_to_inbox</span>
                  <span>Sollecita via Ticket</span>
                </button>
              </div>
            </article>
          )}

          {/* Card 5: Liquidata e Accreditata con Successo */}
          {c5 && (
            <article className="bg-surface-card rounded-xl p-4 shadow-sm flex flex-col gap-3 relative transition-all active:scale-[0.99]">
              <div className="flex items-start justify-between gap-2">
                <div className="flex flex-col">
                  <div className="flex items-center gap-1.5">
                    <span className="font-label-sm text-label-sm font-bold text-on-tertiary-container">GSE-CT2-2025-0710</span>
                    <span className="text-text-muted text-xs">•</span>
                    <span className="font-body-sm text-body-sm text-text-muted">Int. 2.A</span>
                  </div>
                  <h2 className="font-headline-sm text-headline-sm text-primary mt-0.5">Dr.ssa Giulia Bianchi</h2>
                  <span className="font-body-sm text-body-sm text-text-muted flex items-center gap-1">
                    <span className="material-symbols-outlined text-sm">location_on</span> Como (CO)
                  </span>
                </div>
                <div className="text-right">
                  <div className="font-numeric-currency-md text-numeric-currency-md text-on-tertiary-container font-bold">
                    € 3.650,00
                  </div>
                  <span className="font-label-sm text-label-sm text-status-success font-semibold">Accreditato su c/c</span>
                </div>
              </div>
              <div className="bg-surface-container-low p-2.5 rounded-lg flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-on-tertiary-container text-lg">check_circle</span>
                  <span className="font-body-sm text-body-sm text-on-surface">Pompa di Calore 6kW • Bonifico GSE ricevuto</span>
                </div>
                <span className="font-label-sm text-label-sm text-text-muted">18 Ott 2025</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-status-success/15 text-status-success font-label-sm text-label-sm font-semibold">
                  <span className="material-symbols-outlined text-sm">verified</span>
                  <span>Pratica Chiusa con Successo</span>
                </div>
                <button
                  className="h-9 px-3 rounded-lg bg-surface-container-low text-primary font-label-sm text-label-sm flex items-center gap-1 active:scale-95 transition-transform"
                  onClick={() => triggerToast("Pratica GSE-CT2-2025-0710 archiviata nel registro storico.")}
                  type="button"
                >
                  <span className="material-symbols-outlined text-base">archive</span>
                  <span>Archivia</span>
                </button>
              </div>
            </article>
          )}
        </div>

        {/* Barra Azioni di Chiusura / Export & Reporting */}
        <div className="bg-surface-card p-4 rounded-xl shadow-sm flex flex-col gap-3 mb-space-md">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-primary text-xl">download_for_offline</span>
              <span className="font-headline-sm text-headline-sm text-primary">Esportazioni &amp; Reportistica</span>
            </div>
            <span className="font-label-sm text-label-sm text-text-muted">Filtri applicati</span>
          </div>
          <div className="grid grid-cols-2 gap-2.5">
            <button
              className="h-11 px-3 bg-surface-container-low hover:bg-surface-container text-primary rounded-lg font-label-md text-label-md flex items-center justify-center gap-2 active:scale-95 transition-transform"
              onClick={() => triggerToast("Export CSV registro GSE generato!")}
              type="button"
            >
              <span className="material-symbols-outlined text-lg text-status-success">table_view</span>
              <span>Export Excel / CSV</span>
            </button>
            <button
              className="h-11 px-3 bg-surface-container-low hover:bg-surface-container text-primary rounded-lg font-label-md text-label-md flex items-center justify-center gap-2 active:scale-95 transition-transform"
              onClick={() => triggerToast("Report Istruttorie PDF generato!")}
              type="button"
            >
              <span className="material-symbols-outlined text-lg text-secondary">picture_as_pdf</span>
              <span>Report Istruttorie PDF</span>
            </button>
          </div>
        </div>

        {/* Toast Feed di Sincronizzazione Notifica Micro-Interazione */}
        <div
          className={`fixed bottom-20 left-4 right-4 bg-primary text-on-primary py-2.5 px-4 rounded-xl shadow-lg flex items-center justify-between transition-opacity duration-300 z-40 ${
            toastMsg ? "opacity-100" : "opacity-0 pointer-events-none"
          }`}
          id="syncToast"
        >
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-status-success text-base">cloud_sync</span>
            <span className="font-body-sm text-body-sm" id="syncToastText">
              {toastMsg ?? "Filtro aggiornato"}
            </span>
          </div>
          <span className="font-label-sm text-label-sm text-on-primary-container">Adesso</span>
        </div>
      </div>
    </StitchShell>
  );
}
