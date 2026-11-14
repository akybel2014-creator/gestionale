import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import StitchShell from "./StitchShell";

type CategoryFilter = "all" | "sos" | "gse" | "standard";

export default function StoricoTriageSosPage() {
  const navigate = useNavigate();
  const [activeCategory, setActiveCategory] = useState<CategoryFilter>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [inlineToast, setInlineToast] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setInlineToast(msg);
    setTimeout(() => setInlineToast(null), 2600);
  };

  const q = searchQuery.trim().toLowerCase();

  const matches = (cat: CategoryFilter, text: string) => {
    const matchesCat = activeCategory === "all" || activeCategory === cat;
    const matchesSearch = !q || text.toLowerCase().includes(q);
    return matchesCat && matchesSearch;
  };

  const showMoretti = matches(
    "sos",
    "famiglia moretti villa residenziale monza pdc 12kw #blocco_impianto #urgente errore e-04 pompa di calore"
  );
  const showBellini = matches(
    "sos",
    "condominio bellini amm dr rinaldi termoregolazione 3 piano #perdita_acqua #cantiere_attivo valvola"
  );
  const showColombo = matches(
    "gse",
    "ing roberto colombo fotovoltaico 6kw accumulo pratica portalgse #882 #scadenza_gse #sollecito 60 giorni"
  );
  const showBianchi = matches(
    "standard",
    "dr.ssa giulia bianchi ristrutturazione appartamento c.so garibaldi libretto impianto notaio"
  );

  const pillClass = (key: CategoryFilter) =>
    activeCategory === key
      ? "filter-pill shrink-0 flex items-center gap-1.5 px-3.5 py-1.5 rounded-full font-label-md text-label-md bg-primary text-on-primary transition-colors active:scale-95 shadow-sm"
      : "filter-pill shrink-0 flex items-center gap-1.5 px-3.5 py-1.5 rounded-full font-label-md text-label-md bg-surface-card text-on-surface hover:bg-surface-container-high transition-colors active:scale-95 shadow-sm";

  return (
    <StitchShell title="Whatsapp Hub" activeTab="none">
      <div className="flex flex-col w-full gap-space-md">
        {/* Top Navigation & Status Pill */}
        <div className="flex items-center justify-between gap-space-sm">
          <Link
            to="/whatsapp"
            className="inline-flex items-center gap-1.5 py-1.5 px-3 rounded-lg bg-surface-container-high text-on-surface hover:bg-surface-container-highest transition-colors active:scale-95 duration-150"
          >
            <span className="material-symbols-outlined text-base">arrow_back</span>
            <span className="font-label-md text-label-md">WhatsApp Hub</span>
          </Link>
          <div className="inline-flex items-center gap-1.5 py-1 px-2.5 rounded-full bg-tertiary-container text-on-tertiary-container shadow-sm">
            <span className="w-2 h-2 rounded-full bg-status-success animate-ping" />
            <span className="font-label-sm text-label-sm tracking-wider uppercase font-bold">Reperibilità Attiva</span>
          </div>
        </div>

        {/* Page Introduction Card */}
        <div className="flex flex-col bg-surface-card p-4 rounded-lg shadow-sm">
          <div className="flex items-start justify-between gap-2">
            <div>
              <span className="font-label-sm text-label-sm text-secondary uppercase tracking-wider font-bold">
                Registro Notturno &amp; Weekend
              </span>
              <h2 className="font-headline-md text-headline-md text-primary mt-0.5">Storico Triage SOS</h2>
            </div>
            <div className="w-10 h-10 rounded-full bg-error-container text-on-error-container flex items-center justify-center shrink-0">
              <span className="material-symbols-outlined text-xl">emergency</span>
            </div>
          </div>
          <p className="font-body-md text-body-md text-text-muted mt-2">
            Monitoraggio messaggi pervenuti durante la chiusura, intercettazione AI dei guasti critici e instradamento rapido reperibilità.
          </p>
        </div>

        {/* Guard Duty Live Banner */}
        <div className="flex items-center justify-between p-3.5 rounded-lg bg-primary text-on-primary shadow-sm">
          <div className="flex items-center gap-3 min-w-0">
            <div className="relative shrink-0">
              <img
                alt="Ing. Marco V."
                className="w-10 h-10 rounded-full object-cover"
                referrerPolicy="no-referrer"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuCu6ldHFVBLnHUVG9Lz-Fx1xc56zMiK_q_1MD84nAtdnbzoyIWTp77ahD3fPcx_X0-XyFF1YWAi1aZ_k092pWysjDDY4Xjqve0F0EFhq5G0xWDc9jnWLJ3NT7JXXsCTYgAGQDjgwOepoiAAvazRijzRSBjK0fxHu2VF4oppjCFZGEOOGQdKi6ZKv25EySIpfEGtF4-IJnk3PEA_e2VzosQ5GLBgHjeUuSDQynEMGuD_"
              />
              <span className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-status-success" />
            </div>
            <div className="flex flex-col min-w-0">
              <span className="font-label-sm text-label-sm text-on-primary-container truncate">Tecnico di guardia attivo</span>
              <span className="font-label-lg text-label-lg font-bold text-on-primary truncate">
                Ing. Marco V. • Monza &amp; Brianza
              </span>
            </div>
          </div>
          <a
            className="flex items-center justify-center w-9 h-9 rounded-full bg-secondary-container text-on-secondary shrink-0 active:scale-90 transition-transform"
            href="tel:+393400000881"
            onClick={(e) => {
              e.preventDefault();
              showToast("Chiamata tecnica verso Ing. Marco V. (+39 340 ••••881)");
            }}
          >
            <span className="material-symbols-outlined text-lg">call</span>
          </a>
        </div>

        {/* Operational Metrics Grid */}
        <div className="grid grid-cols-3 gap-2">
          <div className="flex flex-col bg-surface-card p-3 rounded-lg shadow-sm">
            <span className="font-label-sm text-label-sm text-text-muted truncate">Fuori Orario</span>
            <span className="font-numeric-currency-md text-numeric-currency-md text-primary mt-1">18</span>
            <span className="font-body-sm text-body-sm text-text-muted mt-0.5">Ultimi 7 gg</span>
          </div>
          <div className="flex flex-col bg-error-container p-3 rounded-lg shadow-sm">
            <div className="flex items-center justify-between">
              <span className="font-label-sm text-label-sm text-on-error-container truncate font-bold">Allarmi SOS</span>
              <span className="w-2 h-2 rounded-full bg-status-danger" />
            </div>
            <span className="font-numeric-currency-md text-numeric-currency-md text-on-error-container mt-1 font-bold">3</span>
            <span className="font-label-sm text-label-sm text-status-danger font-bold mt-0.5">1 Da Gestire</span>
          </div>
          <div className="flex flex-col bg-surface-card p-3 rounded-lg shadow-sm">
            <span className="font-label-sm text-label-sm text-text-muted truncate">Filtrati Bot</span>
            <span className="font-numeric-currency-md text-numeric-currency-md text-status-success mt-1">83%</span>
            <span className="font-body-sm text-body-sm text-text-muted mt-0.5">15 rassicurati</span>
          </div>
        </div>

        {/* Search & Filter Controls */}
        <div className="flex flex-col gap-2.5">
          <div className="relative flex items-center w-full">
            <span className="material-symbols-outlined absolute left-3.5 text-text-muted text-xl pointer-events-none">search</span>
            <input
              className="w-full h-12 pl-11 pr-4 bg-surface-card rounded-lg font-body-md text-body-md text-on-surface shadow-sm focus:outline-none focus:bg-surface-container-lowest placeholder:text-text-muted transition-all"
              id="triageSearchInput"
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cerca cantiere, committente o parola chiave (#BLOCCO, #PERDITA)..."
              type="text"
              value={searchQuery}
            />
          </div>
          <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar" id="filterPillsContainer">
            <button className={pillClass("all")} onClick={() => setActiveCategory("all")} type="button">
              Tutti (18)
            </button>
            <button className={pillClass("sos")} onClick={() => setActiveCategory("sos")} type="button">
              <span className="w-2 h-2 rounded-full bg-status-danger" />
              Emergenze SOS (3)
            </button>
            <button className={pillClass("gse")} onClick={() => setActiveCategory("gse")} type="button">
              Pratiche GSE (4)
            </button>
            <button className={pillClass("standard")} onClick={() => setActiveCategory("standard")} type="button">
              Ordinari Filtrati (11)
            </button>
          </div>
        </div>

        {/* Intercepted Stream Header */}
        <div className="flex items-center justify-between pt-1">
          <span className="font-label-md text-label-md text-on-surface-variant font-bold uppercase tracking-wider">
            Flusso Eventi Triage
          </span>
          <span className="font-body-sm text-body-sm text-text-muted">Ordinati per urgenza</span>
        </div>

        {/* MESSAGE LIST CONTAINER */}
        <div className="flex flex-col gap-space-md" id="cardsStream">
          {/* Card 1: SOS CRITICO */}
          {showMoretti && (
            <div className="triage-card flex flex-col bg-surface-card rounded-lg shadow-sm overflow-hidden">
              <div className="p-4 flex flex-col gap-3">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex flex-col min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded font-label-sm text-label-sm bg-error-container text-status-danger font-bold animate-pulse">
                        SOS • DA ASSEGNARE
                      </span>
                      <span className="font-body-sm text-body-sm text-text-muted">Stanotte, 02:41</span>
                    </div>
                    <h3 className="font-headline-sm text-headline-sm text-primary mt-1 truncate">Famiglia Moretti</h3>
                    <span className="font-label-sm text-label-sm text-text-muted truncate">
                      Villa Residenziale Monza • PdC 12kW
                    </span>
                  </div>
                  <div className="w-8 h-8 rounded-full bg-secondary-fixed flex items-center justify-center text-on-secondary-fixed shrink-0">
                    <span className="material-symbols-outlined text-base">heat_pump</span>
                  </div>
                </div>
                <div className="flex flex-wrap items-center gap-1.5">
                  <span className="px-2 py-0.5 rounded-full font-label-sm text-label-sm bg-error text-on-error font-bold">
                    #BLOCCO_IMPIANTO
                  </span>
                  <span className="px-2 py-0.5 rounded-full font-label-sm text-label-sm bg-error-container text-on-error-container font-bold">
                    #URGENTE
                  </span>
                  <span className="px-2 py-0.5 rounded-full font-label-sm text-label-sm bg-surface-container text-on-surface-variant">
                    Errore: E-04
                  </span>
                </div>
                <div className="flex flex-col bg-surface-container-low p-3 rounded-lg">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-label-sm text-label-sm text-primary flex items-center gap-1 font-bold">
                      <span className="material-symbols-outlined text-sm text-status-success" style={{ fontVariationSettings: "'FILL' 1" }}>
                        chat
                      </span>
                      WhatsApp committente (+39 335 ••••412)
                    </span>
                  </div>
                  <p className="font-body-md text-body-md text-on-surface italic">
                    &quot;Buonasera studio, si è bloccata la pompa di calore nuova e sul display compare errore E-04 bassa pressione, i termosifoni sono freddi e abbiamo un neonato in casa. C&apos;è qualcuno reperibile subito?&quot;
                  </p>
                </div>
                <div className="flex items-start gap-2.5 p-2.5 rounded-lg bg-surface-container">
                  <span className="material-symbols-outlined text-status-success text-base shrink-0 mt-0.5">smart_toy</span>
                  <div className="flex flex-col text-on-surface-variant">
                    <span className="font-label-sm text-label-sm font-bold text-on-surface">
                      Auto-risposta Triage erogata (02:41):
                    </span>
                    <span className="font-body-sm text-body-sm">
                      Inviata guida sblocco rubinetto carico 1.2 bar + Link prioritario protocollo reperibilità notturna.
                    </span>
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                  <button
                    className="h-[50px] w-full bg-secondary-container text-on-secondary rounded-lg font-label-lg text-label-lg flex items-center justify-center gap-2 hover:bg-secondary active:scale-[0.98] transition-all shadow-sm"
                    onClick={() => showToast("Tecnico di guardia Ing. Marco V. assegnato al guasto Famiglia Moretti.")}
                    type="button"
                  >
                    <span className="material-symbols-outlined text-xl">send_to_mobile</span>
                    <span>Assegna Tecnico Notte</span>
                  </button>
                  <a
                    className="h-[50px] w-full bg-primary text-on-primary rounded-lg font-label-lg text-label-lg flex items-center justify-center gap-2 active:scale-[0.98] transition-all shadow-sm"
                    href="tel:+393350000412"
                    onClick={(e) => {
                      e.preventDefault();
                      showToast("Chiamata prioritaria verso +39 335 ••••412 (Famiglia Moretti)");
                    }}
                  >
                    <span className="material-symbols-outlined text-xl">call</span>
                    <span>Chiama (+39 335...)</span>
                  </a>
                </div>
              </div>
            </div>
          )}

          {/* Card 2: SOS MODERATO */}
          {showBellini && (
            <div className="triage-card flex flex-col bg-surface-card rounded-lg shadow-sm overflow-hidden">
              <div className="p-4 flex flex-col gap-3">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex flex-col min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded font-label-sm text-label-sm bg-secondary-fixed text-on-secondary-fixed-variant font-bold">
                        SOS IN CARICO
                      </span>
                      <span className="font-body-sm text-body-sm text-text-muted">Sabato, 21:15</span>
                    </div>
                    <h3 className="font-headline-sm text-headline-sm text-primary mt-1 truncate">Condominio Bellini</h3>
                    <span className="font-label-sm text-label-sm text-text-muted truncate">
                      Amm. Dr. Rinaldi • Termoregolazione 3° Piano
                    </span>
                  </div>
                  <div className="w-8 h-8 rounded-full bg-surface-container-high flex items-center justify-center text-secondary-container shrink-0">
                    <span className="material-symbols-outlined text-base">water_damage</span>
                  </div>
                </div>
                <div className="flex flex-wrap items-center gap-1.5">
                  <span className="px-2 py-0.5 rounded-full font-label-sm text-label-sm bg-secondary-fixed-dim text-on-secondary-container font-bold">
                    #PERDITA_ACQUA
                  </span>
                  <span className="px-2 py-0.5 rounded-full font-label-sm text-label-sm bg-surface-container text-on-surface-variant font-bold">
                    #CANTIERE_ATTIVO
                  </span>
                </div>
                <div className="flex flex-col bg-surface-container-low p-3 rounded-lg">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-label-sm text-label-sm text-primary flex items-center gap-1 font-bold">
                      <span className="material-symbols-outlined text-sm text-status-success" style={{ fontVariationSettings: "'FILL' 1" }}>
                        chat
                      </span>
                      WhatsApp Amministratore
                    </span>
                  </div>
                  <p className="font-body-md text-body-md text-on-surface italic">
                    &quot;Avviso urgente dal custode: gocciola la valvola di sfiato del collettore al 3° piano dove avete montato le valvole termostatiche giovedì. Abbiamo chiuso la saracinesca per sicurezza.&quot;
                  </p>
                </div>
                <div className="flex items-center justify-between p-2.5 rounded-lg bg-surface-container text-on-surface">
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-status-success text-base">check_circle</span>
                    <span className="font-body-sm text-body-sm">
                      Preso in carico da <strong>Geom. Bellini</strong> (21:30)
                    </span>
                  </div>
                  <span className="font-label-sm text-label-sm text-status-success font-bold">Valvola isolata</span>
                </div>
                <div className="flex items-center gap-2 pt-1">
                  <button
                    className="h-10 flex-1 bg-surface-container-high text-primary rounded-lg font-label-md text-label-md flex items-center justify-center gap-1.5 hover:bg-surface-container-highest active:scale-95 transition-all"
                    onClick={() => navigate("/preventivo")}
                    type="button"
                  >
                    <span className="material-symbols-outlined text-base">folder_open</span>
                    <span>Scheda Cantiere</span>
                  </button>
                  <button
                    className="h-10 flex-1 bg-tertiary-container text-on-tertiary-container rounded-lg font-label-md text-label-md flex items-center justify-center gap-1.5 hover:bg-opacity-90 active:scale-95 transition-all"
                    onClick={() => navigate("/whatsapp")}
                    type="button"
                  >
                    <span className="material-symbols-outlined text-base">chat</span>
                    <span>Rispondi via WhatsApp</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Card 3: GSE PRIORITÀ AMMINISTRATIVA */}
          {showColombo && (
            <div className="triage-card flex flex-col bg-surface-card rounded-lg shadow-sm overflow-hidden">
              <div className="p-4 flex flex-col gap-3">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex flex-col min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded font-label-sm text-label-sm bg-primary-fixed text-on-primary-fixed-variant font-bold">
                        PRATICA GSE • AUTOMATICA
                      </span>
                      <span className="font-body-sm text-body-sm text-text-muted">Ieri, 22:18</span>
                    </div>
                    <h3 className="font-headline-sm text-headline-sm text-primary mt-1 truncate">Ing. Roberto Colombo</h3>
                    <span className="font-label-sm text-label-sm text-text-muted truncate">
                      Fotovoltaico 6kW + Accumulo • Pratica PortalGSE #882
                    </span>
                  </div>
                  <div className="w-8 h-8 rounded-full bg-primary-fixed flex items-center justify-center text-primary shrink-0">
                    <span className="material-symbols-outlined text-base">solar_power</span>
                  </div>
                </div>
                <div className="flex flex-wrap items-center gap-1.5">
                  <span className="px-2 py-0.5 rounded-full font-label-sm text-label-sm bg-primary-container text-on-primary font-bold">
                    #SCADENZA_GSE
                  </span>
                  <span className="px-2 py-0.5 rounded-full font-label-sm text-label-sm bg-surface-container text-on-surface-variant font-bold">
                    #SOLLECITO
                  </span>
                </div>
                <div className="flex flex-col bg-surface-container-low p-3 rounded-lg">
                  <p className="font-body-md text-body-md text-on-surface italic">
                    &quot;Ho letto che il GSE ha 60 giorni. Siamo al giorno 28, lunedì parte il sollecito o devo fare qualcosa io?&quot;
                  </p>
                </div>
                <div className="flex items-start gap-2.5 p-2.5 rounded-lg bg-surface-container text-on-surface-variant">
                  <span className="material-symbols-outlined text-primary text-base shrink-0 mt-0.5">verified</span>
                  <div className="flex flex-col">
                    <span className="font-label-sm text-label-sm font-bold text-on-surface">Bot Documentale GSE (22:18):</span>
                    <span className="font-body-sm text-body-sm">
                      Inviato prospetto iter standard con stato &apos;In Istruttoria&apos;. Nessuna sveglia notturna ai tecnici.
                    </span>
                  </div>
                </div>
                <div className="flex items-center justify-between pt-1">
                  <button
                    className="h-9 px-3 bg-surface-container text-text-muted rounded-lg font-label-md text-label-md flex items-center gap-1 hover:text-on-surface"
                    onClick={() => showToast("Evento archiviato nello storico triage.")}
                    type="button"
                  >
                    <span className="material-symbols-outlined text-base">archive</span>
                    <span>Archivia</span>
                  </button>
                  <button
                    className="h-9 px-3.5 bg-surface-container-high text-primary rounded-lg font-label-md text-label-md flex items-center gap-1 hover:bg-surface-container-highest"
                    onClick={() => navigate("/istruttoria-gse")}
                    type="button"
                  >
                    <span className="material-symbols-outlined text-base">schedule</span>
                    <span>Promemoria Lunedì 09:00</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Card 4: ORDINARIO FILTRATO */}
          {showBianchi && (
            <div className="triage-card flex flex-col bg-surface-card rounded-lg shadow-sm overflow-hidden">
              <div className="p-4 flex flex-col gap-3">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex flex-col min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded font-label-sm text-label-sm bg-surface-container-highest text-on-surface-variant font-bold">
                        ORDINARIO FILTRATO
                      </span>
                      <span className="font-body-sm text-body-sm text-text-muted">Sabato, 17:45</span>
                    </div>
                    <h3 className="font-headline-sm text-headline-sm text-primary mt-1 truncate">Dr.ssa Giulia Bianchi</h3>
                    <span className="font-label-sm text-label-sm text-text-muted truncate">
                      Ristrutturazione Appartamento C.so Garibaldi
                    </span>
                  </div>
                  <div className="w-8 h-8 rounded-full bg-surface-container flex items-center justify-center text-text-muted shrink-0">
                    <span className="material-symbols-outlined text-base">description</span>
                  </div>
                </div>
                <div className="flex flex-col bg-surface-container-low p-3 rounded-lg">
                  <p className="font-body-md text-body-md text-on-surface italic">
                    &quot;Buon weekend, quando potete mi mandate la copia conforme del libretto d&apos;impianto per il notaio?&quot;
                  </p>
                </div>
                <div className="flex items-center gap-2 p-2.5 rounded-lg bg-surface-container text-text-muted">
                  <span className="material-symbols-outlined text-base text-status-success">done_all</span>
                  <span className="font-body-sm text-body-sm">
                    Auto-responder standard: Avvisata apertura uffici lunedì h 08:30.
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Operational Footer Utilities */}
        <div className="flex flex-col gap-2 pt-2">
          <button
            className="h-12 w-full bg-surface-card text-primary rounded-lg font-label-lg text-label-lg flex items-center justify-center gap-2 shadow-sm hover:bg-surface-container-high transition-colors active:scale-[0.98]"
            onClick={() => navigate("/fuori-orario")}
            type="button"
          >
            <span className="material-symbols-outlined text-xl">tune</span>
            <span>Configura Regole Triage &amp; Keyword SOS</span>
          </button>
          <button
            className="h-12 w-full bg-surface-card text-text-muted rounded-lg font-label-md text-label-md flex items-center justify-center gap-2 shadow-sm hover:text-primary transition-colors active:scale-[0.98]"
            onClick={() => showToast("Registro Audit Reperibilità PDF generato.")}
            type="button"
          >
            <span className="material-symbols-outlined text-xl">download</span>
            <span>Scarica Registro Audit Reperibilità (PDF)</span>
          </button>
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
