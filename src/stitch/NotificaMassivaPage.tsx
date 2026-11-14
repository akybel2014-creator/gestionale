import { useState } from "react";
import { Link } from "react-router-dom";
import StitchShell from "./StitchShell";

type ClusterKey = "all" | "ordinaria" | "sollecito" | "custom";

interface Recipient {
  id: string;
  name: string;
  city: string;
  code: string;
  contact: string;
  badgeText: string;
  badgeClass: string;
  progressWidth: string;
  progressBarClass: string;
  days: string;
  amount: string;
  cluster: "ordinaria" | "sollecito";
  extra?: boolean;
}

const RECIPIENTS: Recipient[] = [
  {
    id: "colombo",
    name: "Ing. Roberto Colombo",
    city: "Milano",
    code: "GSE-CT2-2025-0814",
    contact: "+39 348 ••••819",
    badgeText: "Soglia Sollecito",
    badgeClass: "bg-error-container text-on-error-container",
    progressWidth: "46%",
    progressBarClass: "bg-secondary-container",
    days: "28 / 60 gg",
    amount: "€ 4.250,00",
    cluster: "sollecito",
  },
  {
    id: "moretti",
    name: "Arch. Elena Moretti",
    city: "Monza",
    code: "GSE-CT2-2025-0792",
    contact: "+39 335 ••••412",
    badgeText: "Ammesso Incentivi",
    badgeClass: "bg-tertiary-fixed text-on-tertiary-fixed-variant",
    progressWidth: "93%",
    progressBarClass: "bg-status-success",
    days: "56 / 60 gg",
    amount: "€ 4.980,00",
    cluster: "ordinaria",
  },
  {
    id: "ferri",
    name: "Geom. Valerio Ferri",
    city: "Bergamo",
    code: "GSE-CT2-2025-0765",
    contact: "+39 347 ••••993",
    badgeText: "Sollecito PEC Inviato",
    badgeClass: "bg-secondary-fixed text-on-secondary-fixed-variant",
    progressWidth: "70%",
    progressBarClass: "bg-secondary-container",
    days: "42 / 60 gg",
    amount: "€ 3.820,00",
    cluster: "sollecito",
  },
  {
    id: "bellini",
    name: "Ing. Marco Bellini",
    city: "Sesto S.G.",
    code: "GSE-CT2-2025-0801",
    contact: "Condominio Bellini",
    badgeText: "Attesa Integrazione",
    badgeClass: "bg-surface-container-highest text-on-surface-variant",
    progressWidth: "30%",
    progressBarClass: "bg-outline",
    days: "18 / 60 gg",
    amount: "€ 8.450,00",
    cluster: "sollecito",
  },
  {
    id: "pavan",
    name: "Dott.ssa Laura Pavan",
    city: "Legnano",
    code: "GSE-CT2-2025-0822 • Legnano",
    contact: "",
    badgeText: "",
    badgeClass: "",
    progressWidth: "",
    progressBarClass: "",
    days: "",
    amount: "€ 3.200,00",
    cluster: "ordinaria",
    extra: true,
  },
  {
    id: "rinaldi",
    name: "Daniele Rinaldi",
    city: "Rho",
    code: "GSE-CT2-2025-0830 • Rho",
    contact: "",
    badgeText: "",
    badgeClass: "",
    progressWidth: "",
    progressBarClass: "",
    days: "",
    amount: "€ 5.100,00",
    cluster: "ordinaria",
    extra: true,
  },
];

export default function NotificaMassivaPage() {
  const [activeCluster, setActiveCluster] = useState<ClusterKey>("all");
  const [selectedIds, setSelectedIds] = useState<Record<string, boolean>>({
    colombo: true,
    moretti: true,
    ferri: true,
    bellini: true,
    pavan: true,
    rinaldi: true,
  });
  const [showMore, setShowMore] = useState(false);
  const [templateChoice, setTemplateChoice] = useState("Stato Avanzamento Trasparente (Consigliato)");
  const [antiBan, setAntiBan] = useState(true);
  const [auditCopy, setAuditCopy] = useState(true);
  const [attachPdf, setAttachPdf] = useState(false);
  const [inlineToast, setInlineToast] = useState<string | null>(null);

  const triggerToast = (msg: string) => {
    setInlineToast(msg);
    setTimeout(() => setInlineToast(null), 2800);
  };

  const mainRecipients = RECIPIENTS.filter((r) => !r.extra);
  const extraRecipients = RECIPIENTS.filter((r) => r.extra);

  const selectedCount = Object.values(selectedIds).filter(Boolean).length;
  // Match original 9 count when all 6 visible checkboxes are checked, otherwise reflects delta cleanly
  const displayCount = selectedCount === RECIPIENTS.length ? 9 : selectedCount;
  const allChecked = RECIPIENTS.every((r) => selectedIds[r.id]);

  const toggleAll = (checked: boolean) => {
    const next: Record<string, boolean> = {};
    RECIPIENTS.forEach((r) => {
      next[r.id] = checked;
    });
    setSelectedIds(next);
  };

  const toggleOne = (id: string) => {
    setSelectedIds((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const pillClass = (key: ClusterKey) =>
    activeCluster === key
      ? "cluster-pill px-3 py-1.5 rounded-full bg-primary-container text-on-primary font-label-md text-label-md whitespace-nowrap shadow-sm"
      : "cluster-pill px-3 py-1.5 rounded-full bg-surface-container text-on-surface-variant hover:text-on-surface font-label-md text-label-md whitespace-nowrap";

  return (
    <StitchShell title="Whatsapp Hub" activeTab="none">
      <div className="flex flex-col w-full gap-space-md">
        {/* 1. Header di Contesto & Stato API */}
        <div className="flex items-center justify-between gap-space-sm">
          <Link
            to="/registro-gse"
            className="inline-flex items-center gap-1.5 py-1.5 px-3 rounded-lg bg-surface-container hover:bg-surface-container-high transition-colors text-on-surface"
          >
            <span className="material-symbols-outlined text-base">arrow_back</span>
            <span className="font-label-md text-label-md">Registro GSE</span>
          </Link>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-surface-container-high">
            <span className="w-2 h-2 rounded-full bg-[#25D366] animate-pulse" />
            <span className="font-label-sm text-label-sm text-on-surface-variant font-medium">Meta API Ufficiale Attiva</span>
          </div>
        </div>

        {/* 2. Titolo & Schede KPI compatte */}
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-primary-container text-[#25D366] flex items-center justify-center shadow-sm">
              <span className="material-symbols-outlined text-lg" style={{ fontVariationSettings: "'FILL' 1" }}>
                forward_to_inbox
              </span>
            </div>
            <h2 className="font-headline-md text-headline-md text-on-surface font-bold tracking-tight">
              Notifica Massiva WhatsApp
            </h2>
          </div>
          <p className="font-body-sm text-body-sm text-on-surface-variant leading-relaxed">
            Aggiornamento trasparenza e rassicurazione clienti con pratiche GSE in istruttoria.
          </p>
        </div>

        {/* KPI Bento Cards */}
        <div className="grid grid-cols-3 gap-2">
          <div className="flex flex-col p-2.5 rounded-xl bg-surface-container-lowest shadow-sm">
            <div className="flex items-center gap-1 text-on-surface-variant mb-1">
              <span className="material-symbols-outlined text-sm">groups</span>
              <span className="font-label-sm text-label-sm">Selezionati</span>
            </div>
            <div className="flex items-baseline gap-1">
              <span className="font-headline-sm text-headline-sm text-on-surface font-bold" id="kpi-count">
                {displayCount}
              </span>
              <span className="font-body-sm text-body-sm text-on-surface-variant">/ 14</span>
            </div>
            <span className="font-label-sm text-[10px] text-status-success font-semibold mt-0.5">64% idonei</span>
          </div>
          <div className="flex flex-col p-2.5 rounded-xl bg-surface-container-lowest shadow-sm">
            <div className="flex items-center gap-1 text-on-surface-variant mb-1">
              <span className="material-symbols-outlined text-sm">payments</span>
              <span className="font-label-sm text-label-sm">Incentivi</span>
            </div>
            <div className="font-headline-sm text-headline-sm text-on-surface font-bold truncate">€ 38,6k</div>
            <span className="font-label-sm text-[10px] text-on-surface-variant mt-0.5">Conto Termico</span>
          </div>
          <div className="flex flex-col p-2.5 rounded-xl bg-surface-container-lowest shadow-sm">
            <div className="flex items-center gap-1 text-on-surface-variant mb-1">
              <span className="material-symbols-outlined text-sm">timer</span>
              <span className="font-label-sm text-label-sm">Invio Stimato</span>
            </div>
            <div className="font-headline-sm text-headline-sm text-on-surface font-bold">~35s</div>
            <span className="font-label-sm text-[10px] text-secondary font-semibold mt-0.5">Anti-ban safe</span>
          </div>
        </div>

        {/* 3. Segmentazione e Filtri a pillola */}
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <span className="font-label-md text-label-md text-on-surface font-semibold">Segmento Destinatari</span>
            <span className="font-label-sm text-label-sm text-on-surface-variant">4 cluster</span>
          </div>
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
            <button className={pillClass("all")} onClick={() => setActiveCluster("all")} type="button">
              Tutti in Attesa (9)
            </button>
            <button className={pillClass("ordinaria")} onClick={() => setActiveCluster("ordinaria")} type="button">
              Ordinaria (6)
            </button>
            <button className={pillClass("sollecito")} onClick={() => setActiveCluster("sollecito")} type="button">
              Sollecito &gt;30gg (3)
            </button>
            <button className={pillClass("custom")} onClick={() => setActiveCluster("custom")} type="button">
              Personalizzati
            </button>
          </div>
          {/* Toggle Seleziona Tutti & Disclaimer Esclusi */}
          <div className="p-3 rounded-xl bg-surface-container-low flex flex-col gap-2 shadow-sm">
            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  checked={allChecked}
                  className="w-5 h-5 rounded accent-secondary-container cursor-pointer"
                  id="select-all-toggle"
                  onChange={(e) => toggleAll(e.target.checked)}
                  type="checkbox"
                />
                <span className="font-label-md text-label-md text-on-surface font-bold">
                  Seleziona tutti i clienti idonei (9)
                </span>
              </label>
              <span className="px-2 py-0.5 rounded text-on-surface-variant font-label-sm text-label-sm bg-surface-container font-semibold">
                Auto-check
              </span>
            </div>
            <div className="flex items-start gap-1.5 text-on-surface-variant">
              <span className="material-symbols-outlined text-sm text-secondary-container mt-0.5">info</span>
              <p className="font-body-sm text-body-sm leading-tight">
                5 clienti esclusi automaticamente: notifica già recapitata &lt;48h fa o istruttoria conclusa.
              </p>
            </div>
          </div>
        </div>

        {/* 4. Elenco Destinatari Interattivo */}
        <div className="flex flex-col gap-2.5">
          <div className="flex items-center justify-between">
            <span className="font-label-md text-label-md text-on-surface font-semibold">Elenco Pratiche Prorogate</span>
            <span className="font-label-sm text-label-sm text-on-surface-variant font-mono">GSE 2025/CT2</span>
          </div>

          {mainRecipients
            .filter((r) => activeCluster === "all" || activeCluster === "custom" || r.cluster === activeCluster)
            .map((r) => (
              <div
                key={r.id}
                className="recipient-card p-3 rounded-xl bg-surface-container-lowest shadow-sm flex flex-col gap-2 transition-all"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-start gap-2.5">
                    <input
                      checked={Boolean(selectedIds[r.id])}
                      className="client-check mt-1 w-5 h-5 rounded accent-secondary-container cursor-pointer"
                      onChange={() => toggleOne(r.id)}
                      type="checkbox"
                    />
                    <div className="flex flex-col">
                      <div className="flex items-center gap-1.5">
                        <span className="font-label-lg text-label-lg text-on-surface font-bold">{r.name}</span>
                        <span className="px-1.5 py-0.2 rounded font-label-sm text-[10px] bg-surface-container text-on-surface-variant">
                          {r.city}
                        </span>
                      </div>
                      <div className="font-body-sm text-body-sm text-on-surface-variant flex items-center gap-2">
                        <span className="font-mono">{r.code}</span>
                        <span>•</span>
                        <span className="font-mono text-on-surface font-medium">{r.contact}</span>
                      </div>
                    </div>
                  </div>
                  <span className={`px-2 py-0.5 rounded-full font-label-sm text-label-sm font-semibold whitespace-nowrap ${r.badgeClass}`}>
                    {r.badgeText}
                  </span>
                </div>
                <div className="flex items-center justify-between pt-2 bg-surface-container-low px-2.5 py-1.5 rounded-lg">
                  <div className="flex items-center gap-2">
                    <span className="font-label-sm text-label-sm text-on-surface-variant">Timeline:</span>
                    <div className="w-16 bg-surface-container h-1.5 rounded-full overflow-hidden">
                      <div className={`${r.progressBarClass} h-full rounded-full`} style={{ width: r.progressWidth }} />
                    </div>
                    <span className="font-label-sm text-label-sm font-bold text-on-surface">{r.days}</span>
                  </div>
                  <div className="font-label-md text-label-md font-bold text-on-surface">{r.amount}</div>
                </div>
              </div>
            ))}

          {/* Collapsible trigger per altri clienti */}
          <button
            className="w-full py-2.5 px-3 rounded-xl bg-surface-container hover:bg-surface-container-high transition-colors flex items-center justify-between text-on-surface-variant"
            id="toggle-more-clients"
            onClick={() => setShowMore((prev) => !prev)}
            type="button"
          >
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-status-success" />
              <span className="font-label-md text-label-md font-semibold text-on-surface">+ Altri 5 clienti idonei inclusi</span>
            </div>
            <span
              className="material-symbols-outlined text-lg transition-transform"
              id="chevron-more"
              style={{ transform: showMore ? "rotate(180deg)" : "rotate(0deg)" }}
            >
              expand_more
            </span>
          </button>

          {/* Clienti extra nascosti */}
          <div className={showMore ? "flex flex-col gap-2.5" : "hidden flex-col gap-2.5"} id="hidden-clients-panel">
            {extraRecipients.map((r) => (
              <div key={r.id} className="recipient-card p-3 rounded-xl bg-surface-container-lowest shadow-sm flex flex-col gap-2">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-2.5">
                    <input
                      checked={Boolean(selectedIds[r.id])}
                      className="client-check mt-1 w-5 h-5 rounded accent-secondary-container"
                      onChange={() => toggleOne(r.id)}
                      type="checkbox"
                    />
                    <div>
                      <div className="font-label-lg text-label-lg font-bold text-on-surface">{r.name}</div>
                      <div className="font-body-sm text-body-sm text-on-surface-variant font-mono">{r.code}</div>
                    </div>
                  </div>
                  <span className="font-label-md text-label-md font-bold text-on-surface">{r.amount}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 5. Modello e Template WhatsApp Meta-Approved */}
        <div className="flex flex-col gap-2.5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <span className="material-symbols-outlined text-[#25D366] text-lg" style={{ fontVariationSettings: "'FILL' 1" }}>
                verified
              </span>
              <span className="font-label-md text-label-md text-on-surface font-semibold">Template Certificato Meta</span>
            </div>
            <span className="px-2 py-0.5 rounded font-label-sm text-label-sm bg-tertiary-fixed text-on-tertiary-fixed-variant font-bold">
              HSM Valido
            </span>
          </div>
          {/* Selettore Template Dropdown-Style */}
          <div className="flex flex-col gap-1.5">
            <select
              className="w-full h-12 px-3 rounded-xl bg-surface-container-lowest text-on-surface font-label-md text-label-md shadow-sm outline-none focus:bg-surface-bright cursor-pointer"
              onChange={(e) => setTemplateChoice(e.target.value)}
              value={templateChoice}
            >
              <option>Stato Avanzamento Trasparente (Consigliato)</option>
              <option>Promemoria Tempi GSE &amp; Normativa (D.M. 16/02/16)</option>
              <option>Sollecito Effettuato &amp; Monitoraggio Attivo</option>
            </select>
          </div>
          {/* Bubble Anteprima WhatsApp */}
          <div className="p-3.5 rounded-2xl bg-surface-container-high relative shadow-inner flex flex-col gap-2">
            <div className="flex items-center justify-between text-on-surface-variant">
              <span className="font-label-sm text-label-sm uppercase tracking-wider font-semibold">
                Anteprima WhatsApp Ricevente
              </span>
              <span className="font-label-sm text-label-sm flex items-center gap-1">
                <span className="material-symbols-outlined text-xs">visibility</span> Live Preview
              </span>
            </div>
            {/* Fumetto WhatsApp */}
            <div className="p-3.5 rounded-xl rounded-tl-sm bg-[#FFFFFF] shadow-sm text-on-surface flex flex-col gap-2 relative">
              <div className="flex items-center justify-between pb-1.5 bg-surface-container-low px-2 py-1 rounded">
                <span className="font-label-sm text-[11px] text-on-surface-variant font-medium">
                  Da: Studio CasaLavoroPRO Ufficiale
                </span>
                <span className="font-label-sm text-[10px] text-status-success font-bold flex items-center gap-0.5">
                  <span className="material-symbols-outlined text-[12px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                    check_circle
                  </span>
                  Verificato
                </span>
              </div>
              <p className="font-body-md text-body-md leading-relaxed text-on-surface">
                Gentile{" "}
                <span className="bg-secondary-fixed text-on-secondary-fixed-variant px-1 rounded font-semibold font-mono text-[13px]">
                  Ing. Roberto Colombo
                </span>
                ,<br />
                il nostro studio tecnico ti informa che la tua pratica GSE Conto Termico (Prot.{" "}
                <span className="bg-primary-fixed text-on-primary-fixed px-1 rounded font-semibold font-mono text-[13px]">
                  GSE-CT2-2025-0814
                </span>
                ) per l&apos;importo di{" "}
                <span className="bg-tertiary-fixed text-on-tertiary-fixed-variant px-1 rounded font-semibold font-mono text-[13px]">
                  € 4.250,00
                </span>{" "}
                è regolarmente monitorata al giorno <span className="font-semibold text-secondary-container">28/60</span>.
                <br />
                <br />
                {templateChoice === "Sollecito Effettuato & Monitoraggio Attivo"
                  ? "Il nostro studio ha protocollato sollecito formale al GSE per garantire il rispetto dei termini."
                  : "L'iter prosegue nel pieno rispetto dei tempi del D.M. 16/02/16. Restiamo a disposizione per qualsiasi chiarimento."}
                <br />
                <br />
                <span className="text-on-surface-variant italic font-body-sm text-body-sm">
                  Saluti, Studio Tecnico CasaLavoroPRO
                </span>
              </p>
              <div className="flex items-center justify-end gap-1 text-on-surface-variant pt-1">
                <span className="font-label-sm text-[10px]">11:42</span>
                <span className="material-symbols-outlined text-sm text-[#25D366]">done_all</span>
              </div>
            </div>
            {/* Quick Actions Template */}
            <div className="flex items-center justify-between pt-1">
              <Link
                to="/fuori-orario"
                className="inline-flex items-center gap-1 font-label-md text-label-md text-secondary-container hover:underline"
              >
                <span className="material-symbols-outlined text-base">edit</span> Personalizza Testo
              </Link>
              <span className="font-label-sm text-label-sm text-on-surface-variant">4 variabili mappate</span>
            </div>
          </div>
        </div>

        {/* 6. Opzioni di Invio Sicuro */}
        <div className="flex flex-col gap-2 p-3.5 rounded-xl bg-surface-container-lowest shadow-sm">
          <div className="flex items-center gap-1.5 mb-1">
            <span className="material-symbols-outlined text-secondary-container text-lg">shield</span>
            <span className="font-label-lg text-label-lg text-on-surface font-bold">Policy di Sicurezza Invio</span>
          </div>
          {/* Switch 1 */}
          <div className="flex items-center justify-between py-1.5">
            <div className="flex flex-col pr-3">
              <span className="font-label-md text-label-md text-on-surface font-semibold">Intervallo Dinamico Anti-Ban</span>
              <span className="font-body-sm text-body-sm text-on-surface-variant">
                Pausa randomica di 3-6s tra ogni messaggio
              </span>
            </div>
            <label className="relative inline-flex items-center cursor-pointer flex-shrink-0">
              <input checked={antiBan} className="sr-only peer" onChange={(e) => setAntiBan(e.target.checked)} type="checkbox" />
              <div className="w-11 h-6 bg-surface-container peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-surface-card after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-surface-card after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#25D366]" />
            </label>
          </div>
          {/* Switch 2 */}
          <div className="flex items-center justify-between py-1.5">
            <div className="flex flex-col pr-3">
              <span className="font-label-md text-label-md text-on-surface font-semibold">Copia Audit a Registro Ufficio</span>
              <span className="font-body-sm text-body-sm text-on-surface-variant">
                Archivia ricevuta PEC e log orario nei fascicoli
              </span>
            </div>
            <label className="relative inline-flex items-center cursor-pointer flex-shrink-0">
              <input
                checked={auditCopy}
                className="sr-only peer"
                onChange={(e) => setAuditCopy(e.target.checked)}
                type="checkbox"
              />
              <div className="w-11 h-6 bg-surface-container peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-surface-card after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-surface-card after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#25D366]" />
            </label>
          </div>
          {/* Switch 3 */}
          <div className="flex items-center justify-between py-1.5">
            <div className="flex flex-col pr-3">
              <span className="font-label-md text-label-md text-on-surface font-semibold">Allega Scheda PDF GSE</span>
              <span className="font-body-sm text-body-sm text-on-surface-variant">
                Sintesi asseverata con codice protocollo a barre
              </span>
            </div>
            <label className="relative inline-flex items-center cursor-pointer flex-shrink-0">
              <input
                checked={attachPdf}
                className="sr-only peer"
                onChange={(e) => setAttachPdf(e.target.checked)}
                type="checkbox"
              />
              <div className="w-11 h-6 bg-surface-container peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-surface-card after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-surface-card after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#25D366]" />
            </label>
          </div>
        </div>

        {/* 7. Call To Action Principali */}
        <div className="flex flex-col gap-2.5 pt-1">
          <button
            className="w-full h-13 py-3.5 px-4 rounded-xl bg-[#25D366] hover:bg-[#20bd5a] text-[#FFFFFF] font-headline-sm text-headline-sm font-bold flex items-center justify-center gap-2 shadow-md active:scale-[0.98] transition-all"
            id="btn-send-mass"
            onClick={() =>
              displayCount > 0
                ? triggerToast(`Invio massivo avviato verso ${displayCount} clienti via Meta Cloud API!`)
                : triggerToast("Seleziona almeno un cliente per procedere con l'invio.")
            }
            type="button"
          >
            <span className="material-symbols-outlined text-2xl" style={{ fontVariationSettings: "'FILL' 1" }}>
              send
            </span>
            <span>{displayCount > 0 ? `Invia Notifiche a ${displayCount} Clienti` : "Nessun cliente selezionato"}</span>
          </button>
          <button
            className="w-full h-11 py-2.5 px-4 rounded-xl bg-surface-container text-primary-container hover:bg-surface-container-high font-label-lg text-label-lg font-semibold flex items-center justify-center gap-2 transition-colors"
            id="btn-test-send"
            onClick={() => triggerToast("Notifica di prova recapitata al numero +39 338 ••••120.")}
            type="button"
          >
            <span className="material-symbols-outlined text-xl">phone_iphone</span>
            <span>Invia Notifica di Prova (+39 338 ••••120)</span>
          </button>
          <div className="flex items-center justify-center gap-1.5 text-center px-4 py-1 text-on-surface-variant">
            <span className="material-symbols-outlined text-xs">history_edu</span>
            <p className="font-body-sm text-[11px] leading-tight">
              Tutti i messaggi inviati saranno sincronizzati in tempo reale nel fascicolo cliente GSE.
            </p>
          </div>
        </div>

        {inlineToast && (
          <div className="fixed bottom-24 inset-x-margin max-w-sm mx-auto bg-primary text-on-primary px-4 py-3 rounded-xl shadow-2xl flex items-center gap-2.5 z-50">
            <span className="material-symbols-outlined text-status-success text-lg">check_circle</span>
            <p className="font-label-md text-label-md font-semibold">{inlineToast}</p>
          </div>
        )}
      </div>
    </StitchShell>
  );
}
