import { useState } from "react";
import { useNavigate } from "react-router-dom";
import StitchShell from "./StitchShell";

type FeedFilter = "all" | "unread" | "gse" | "quotes";

export default function SyncLiveRispostePage() {
  const navigate = useNavigate();
  const [filter, setFilter] = useState<FeedFilter>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [colomboReplied, setColomboReplied] = useState(false);
  const [inlineToast, setInlineToast] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setInlineToast(msg);
    setTimeout(() => setInlineToast(null), 2600);
  };

  const q = searchQuery.trim().toLowerCase();

  const matches = (categories: FeedFilter[], text: string) => {
    const matchesCat = filter === "all" || categories.includes(filter);
    const matchesText = !q || text.toLowerCase().includes(q);
    return matchesCat && matchesText;
  };

  const showColombo = matches(
    ["unread", "gse"],
    "ing roberto colombo gse-ct2-2025-0814 bonifico gse iban conto termico"
  );
  const showBellini = matches(
    ["unread", "gse"],
    "condominio bellini dr rinaldi ricevuta bonifico parlante ocr conforme l. 296/2006"
  );
  const showMoretti = matches(
    ["unread", "quotes"],
    "arch elena moretti conferma ricevuta prev #408 conto termico sopralluogo tecnico"
  );
  const showFerri = matches(
    ["gse"],
    "geom valerio ferri sollecito pec gse riscontro funzionario territoriale"
  );

  const pillClass = (key: FeedFilter) =>
    filter === key
      ? "whitespace-nowrap px-3.5 py-1.5 rounded-full bg-primary text-on-primary font-label-md text-label-md shadow-sm transition-transform active:scale-95"
      : "whitespace-nowrap px-3.5 py-1.5 rounded-full bg-surface-container text-on-surface font-label-md text-label-md active:scale-95";

  return (
    <StitchShell title="Whatsapp Hub" activeTab="none">
      <div className="flex flex-col w-full pb-8 space-y-4">
        {/* Sub-header & Navigation Context */}
        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <button
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-surface-container hover:bg-surface-container-high transition-colors text-on-surface"
              onClick={() => navigate("/whatsapp")}
              type="button"
            >
              <span className="material-symbols-outlined text-lg">arrow_back</span>
              <span className="font-label-md text-label-md">Torna a WhatsApp Hub</span>
            </button>
            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-surface-container-highest shadow-sm">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-status-success opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-status-success" />
              </span>
              <span className="font-label-sm text-label-sm text-on-surface font-semibold tracking-wide">
                Sync Live • 5 Nuove Risposte
              </span>
            </div>
          </div>
          {/* Quick Pill Category Filters */}
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-0.5">
            <button className={pillClass("all")} onClick={() => setFilter("all")} type="button">
              Tutti i messaggi (12)
            </button>
            <button
              className={
                filter === "unread"
                  ? "whitespace-nowrap inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-primary text-on-primary font-label-md text-label-md shadow-sm active:scale-95"
                  : "whitespace-nowrap inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-surface-container-lowest text-secondary-container font-label-md text-label-md shadow-sm active:scale-95"
              }
              onClick={() => setFilter("unread")}
              type="button"
            >
              <span className="w-2 h-2 rounded-full bg-secondary-container" />
              Non Letti (5)
            </button>
            <button className={pillClass("gse")} onClick={() => setFilter("gse")} type="button">
              Pratiche GSE (4)
            </button>
            <button className={pillClass("quotes")} onClick={() => setFilter("quotes")} type="button">
              Preventivi (3)
            </button>
          </div>
        </div>

        {/* Operational KPI Metrics */}
        <div className="grid grid-cols-3 gap-2">
          <div className="bg-surface-container-lowest rounded-xl p-2.5 shadow-sm flex flex-col justify-between">
            <div className="flex items-center gap-1 text-on-surface-variant">
              <span className="material-symbols-outlined text-base">timer</span>
              <span className="font-label-sm text-label-sm">Tempo medio</span>
            </div>
            <div className="mt-1">
              <span className="font-headline-sm text-headline-sm text-on-surface">14</span>
              <span className="font-label-sm text-label-sm text-text-muted"> min</span>
            </div>
            <span className="font-label-sm text-[10px] text-status-success font-medium">Top 5% su cantiere</span>
          </div>
          <div className="bg-surface-container-lowest rounded-xl p-2.5 shadow-sm flex flex-col justify-between">
            <div className="flex items-center gap-1 text-secondary-container">
              <span className="material-symbols-outlined text-base">notifications_active</span>
              <span className="font-label-sm text-label-sm font-semibold">Da Gestire</span>
            </div>
            <div className="mt-1 flex items-baseline gap-1">
              <span className="font-headline-sm text-headline-sm text-secondary-container">5</span>
              <span className="font-label-sm text-label-sm text-text-muted">in coda</span>
            </div>
            <span className="font-label-sm text-[10px] text-secondary font-semibold">Priorità alta GSE</span>
          </div>
          <div className="bg-surface-container-lowest rounded-xl p-2.5 shadow-sm flex flex-col justify-between">
            <div className="flex items-center gap-1 text-on-tertiary-container">
              <span className="material-symbols-outlined text-base">smart_toy</span>
              <span className="font-label-sm text-label-sm">Bozze AI</span>
            </div>
            <div className="mt-1">
              <span className="font-headline-sm text-headline-sm text-on-tertiary-container">100%</span>
            </div>
            <span className="font-label-sm text-[10px] text-text-muted">Suggerimenti attivi</span>
          </div>
        </div>

        {/* Search & Fast Action Control Strip */}
        <div className="flex items-center gap-2">
          <div className="relative flex-1">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-lg">
              search
            </span>
            <input
              className="w-full h-11 pl-9 pr-3 rounded-xl bg-surface-container-lowest font-body-md text-body-md text-on-surface placeholder:text-outline focus:outline-none shadow-sm"
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cerca cliente, protocollo GSE o testo..."
              type="search"
              value={searchQuery}
            />
          </div>
          <button
            aria-label="Filtri avanzati"
            className="w-11 h-11 flex items-center justify-center rounded-xl bg-surface-container-lowest text-on-surface shadow-sm active:scale-95"
            onClick={() => navigate("/fuori-orario")}
            type="button"
          >
            <span className="material-symbols-outlined text-xl">tune</span>
          </button>
        </div>

        {/* Interactive Feed of Received WhatsApp Messages */}
        <div className="flex flex-col space-y-3.5">
          {/* Card 1: Critical GSE Request with Auto Draft */}
          {showColombo && (
            <article
              className={`bg-surface-container-lowest rounded-2xl p-4 shadow-sm flex flex-col gap-3 transition-opacity ${
                colomboReplied ? "opacity-60" : ""
              }`}
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="relative">
                    <img
                      alt="Ing. Roberto Colombo"
                      className="w-10 h-10 rounded-full object-cover"
                      referrerPolicy="no-referrer"
                      src="https://lh3.googleusercontent.com/aida-public/AB6AXuDaiHLjJUmAat9_ig3Vii8s898b4dy6-UPO6xN7Pez4yByR2CrH9Zd8xT8owa7_m4YpC7nBmOQ0p0EbOadW2fV0bgaa-ohNtC9NfpgPPeUkIuKpEen8heZ_0vmXs4oP6DSVUEyXqqn1J01hf7r5zdGd99UdH4WLHhUejBOvdYkFcFeEdr87W5Ns1iQ5RuIS5mOx2f-l2GHjJKZVKaWGfDijg54ZTSyCblGMgHVOHjyK"
                    />
                    <span className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full bg-status-success flex items-center justify-center text-on-primary">
                      <span className="material-symbols-outlined text-[9px]">chat</span>
                    </span>
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5">
                      <h2 className="font-headline-sm text-headline-sm text-on-surface truncate">Ing. Roberto Colombo</h2>
                      <span className="font-label-sm text-label-sm text-text-muted">(MI)</span>
                    </div>
                    <div className="flex items-center gap-1.5 mt-0.5">
                      <span className="px-2 py-0.5 rounded bg-surface-container-high text-on-primary-fixed-variant font-label-sm text-label-sm truncate">
                        GSE-CT2-2025-0814
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-1 flex-shrink-0">
                  <span className="font-label-sm text-label-sm text-text-muted">10:42</span>
                  <span className="px-2 py-0.5 rounded-full bg-secondary-container text-on-secondary font-label-sm text-label-sm font-bold uppercase tracking-wider">
                    Nuovo
                  </span>
                </div>
              </div>
              <div className="rounded-xl bg-surface-container-low p-3">
                <p className="font-body-md text-body-md text-on-surface">
                  “Buongiorno geom. Bellini, ho visto il vostro aggiornamento. Posso chiedervi se il bonifico GSE arriva direttamente sul mio IBAN o tramite voi?”
                </p>
              </div>
              <div className="rounded-xl bg-tertiary-container/10 p-3 flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1 text-on-tertiary-container">
                    <span className="material-symbols-outlined text-base">auto_fix_high</span>
                    <span className="font-label-sm text-label-sm font-bold">Bozza Studio Pronta (AI Assist)</span>
                  </div>
                  <span className="font-label-sm text-label-sm text-on-tertiary-container font-semibold">99% match</span>
                </div>
                <p className="font-body-sm text-body-sm text-on-surface line-clamp-3">
                  “Gentile Ing. Colombo, l’accredito del Conto Termico GSE di <strong>€ 4.250</strong> avverrà con bonifico diretto dal GSE sulle Sue coordinate bancarie indicate nella domanda...”
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-2 pt-1">
                <button
                  className={`flex-1 min-w-[150px] h-10 px-3 rounded-xl text-on-primary flex items-center justify-center gap-1.5 shadow-sm active:scale-95 transition-transform ${
                    colomboReplied ? "bg-primary" : "bg-status-success"
                  }`}
                  onClick={() => {
                    setColomboReplied(true);
                    showToast("Risposta rapida inviata a Ing. Roberto Colombo!");
                  }}
                  type="button"
                >
                  <span className="material-symbols-outlined text-lg">{colomboReplied ? "check" : "send"}</span>
                  <span className="font-label-md text-label-md">
                    {colomboReplied ? "Inviato al Cliente!" : "Invia Risposta Rapida"}
                  </span>
                </button>
                <button
                  className="h-10 px-3 rounded-xl bg-surface-container text-on-surface flex items-center justify-center gap-1 active:scale-95"
                  onClick={() => navigate("/anteprima-whatsapp-colombo")}
                  type="button"
                >
                  <span className="material-symbols-outlined text-lg">open_in_new</span>
                  <span className="font-label-md text-label-md">Chat</span>
                </button>
                <button
                  aria-label="Assegna a Pratica"
                  className="h-10 w-10 rounded-xl bg-surface-container text-on-surface flex items-center justify-center active:scale-95"
                  onClick={() => navigate("/pratica-gse")}
                  type="button"
                >
                  <span className="material-symbols-outlined text-lg">folder_shared</span>
                </button>
              </div>
            </article>
          )}

          {/* Card 2: Document Receipt & OCR Audit Badge */}
          {showBellini && (
            <article className="bg-surface-container-lowest rounded-2xl p-4 shadow-sm flex flex-col gap-3">
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="relative">
                    <img
                      alt="Condominio Bellini"
                      className="w-10 h-10 rounded-full object-cover"
                      referrerPolicy="no-referrer"
                      src="https://lh3.googleusercontent.com/aida-public/AB6AXuAY48Se94cNcMpSeSb7qt46F5H4dwoEdqP0qbZi-wDBGXBJuSrTQkVQDgOcJwqLMBKOStAsnAsPVwriCvAh4fiTW35IYTKPYN37SKTBay6iAsCm4Y1POsu5bQVTCO67LCBkPI3d_K58YYGoqR46fZL41n0Xqzu4dAs4hWxh3bWfFj0KhU69fJG4q2ZbJ5TDvlhwR7rX8Mkqv2ql7pvmSLrPY0kq_FkiKjH_Fk-edZId"
                    />
                    <span className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full bg-status-success flex items-center justify-center text-on-primary">
                      <span className="material-symbols-outlined text-[9px]">attach_file</span>
                    </span>
                  </div>
                  <div className="min-w-0">
                    <h2 className="font-headline-sm text-headline-sm text-on-surface truncate">
                      Condominio Bellini (Dr. Rinaldi)
                    </h2>
                    <span className="font-label-sm text-label-sm text-status-success font-semibold flex items-center gap-1 mt-0.5">
                      <span className="material-symbols-outlined text-xs">verified</span> Doc Ricevuto
                    </span>
                  </div>
                </div>
                <span className="font-label-sm text-label-sm text-text-muted flex-shrink-0">09:15</span>
              </div>
              <div className="rounded-xl bg-surface-container-low p-3">
                <p className="font-body-md text-body-md text-on-surface">
                  “Vi ho appena inviato la ricevuta del bonifico parlante e l’allegato del timbro termotecnico via foto. Ditemi se va bene!”
                </p>
              </div>
              <div className="flex items-center gap-3 p-2.5 rounded-xl bg-surface-container">
                <img
                  alt="Ricevuta bonifico parlante"
                  className="w-14 h-14 rounded-lg object-cover flex-shrink-0"
                  referrerPolicy="no-referrer"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuDK3XSdiygo7Y0ZmAulhrI8QWk-1Yh7sVLNLD2z6MHSMbQXRSnLbDbkrfy0BxH7-CPpZn8tP7vFnDEACmzpS6gI7x4knjx5SeOtUEaoolMt5iepnsVGdmUfhae7XGZNQKRbd3GmdYgnOzLzU53bGpCOUnyCb4kmv_p1BUqrTu6pzf6qWzCXUMzhP3Iuk3lKuGjkcz9SKiDIvIvuUFYq0XfclQCbueDD6ZyAgeEFdIIp"
                />
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-1 text-status-success">
                    <span className="material-symbols-outlined text-sm">check_circle</span>
                    <span className="font-label-sm text-label-sm font-bold">OCR Conforme L. 296/2006</span>
                  </div>
                  <p className="font-body-sm text-body-sm text-on-surface-variant truncate mt-0.5">
                    bonifico_bancario_parlante_detrazione.jpg
                  </p>
                  <span className="font-label-sm text-label-sm text-text-muted">Causale GSE rilevata: OK</span>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2 pt-1">
                <button
                  className="h-10 px-3 rounded-xl bg-primary text-on-primary flex items-center justify-center gap-1.5 shadow-sm active:scale-95"
                  onClick={() => navigate("/pratica-gse")}
                  type="button"
                >
                  <span className="material-symbols-outlined text-lg">drive_file_move</span>
                  <span className="font-label-md text-label-md truncate">Salva nel Fascicolo GSE</span>
                </button>
                <button
                  className="h-10 px-3 rounded-xl bg-surface-container text-on-surface flex items-center justify-center gap-1.5 active:scale-95"
                  onClick={() => showToast("Messaggio di conferma inviato su WhatsApp a Dr. Rinaldi.")}
                  type="button"
                >
                  <span className="material-symbols-outlined text-lg text-status-success">thumb_up</span>
                  <span className="font-label-md text-label-md truncate">Ringrazia su WA</span>
                </button>
              </div>
            </article>
          )}

          {/* Card 3: Quote Approval & Site Visit Scheduling */}
          {showMoretti && (
            <article className="bg-surface-container-lowest rounded-2xl p-4 shadow-sm flex flex-col gap-3">
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="relative">
                    <img
                      alt="Arch. Elena Moretti"
                      className="w-10 h-10 rounded-full object-cover"
                      referrerPolicy="no-referrer"
                      src="https://lh3.googleusercontent.com/aida-public/AB6AXuBHaJO5z8rO8Bw28E51S1VY_Z93Jv6BRrtya-KVfBibTIDeUUHBEcJj1PfLftEfZwlddgn4MV7YrtCApnBJUqu-SEsob2iqGkEQbZP4LG3GoDeZneVAoLjoL2qp6UJO7LZq7cW7ll5gXXCS93NB-noXXEHZQpHzZuVN4yW02Z4q7CFgOlpssoDPRHXXe2IpDLIVeU9q4Cc-sUD8VKkqxELPOA8NXeNqtVnxdvwPlMo8"
                    />
                    <span className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full bg-status-success flex items-center justify-center text-on-primary">
                      <span className="material-symbols-outlined text-[9px]">handshake</span>
                    </span>
                  </div>
                  <div className="min-w-0">
                    <h2 className="font-headline-sm text-headline-sm text-on-surface truncate">Arch. Elena Moretti</h2>
                    <span className="font-label-sm text-label-sm text-on-secondary-container font-semibold flex items-center gap-1 mt-0.5">
                      <span className="material-symbols-outlined text-xs">task_alt</span> Conferma Ricevuta (Prev. #408)
                    </span>
                  </div>
                </div>
                <span className="font-label-sm text-label-sm text-text-muted flex-shrink-0">Ieri 18:30</span>
              </div>
              <div className="rounded-xl bg-surface-container-low p-3">
                <p className="font-body-md text-body-md text-on-surface">
                  “Perfetto per la detrazione Conto Termico! Quando possiamo fissare il sopralluogo tecnico per la firma del modulo d’incarico?”
                </p>
              </div>
              <div className="grid grid-cols-2 gap-2 pt-1">
                <button
                  className="h-10 px-3 rounded-xl bg-secondary-container text-on-secondary flex items-center justify-center gap-1.5 shadow-sm active:scale-95"
                  onClick={() => navigate("/preventivo")}
                  type="button"
                >
                  <span className="material-symbols-outlined text-lg">event_available</span>
                  <span className="font-label-md text-label-md truncate">Pianifica Sopralluogo</span>
                </button>
                <button
                  className="h-10 px-3 rounded-xl bg-surface-container text-on-surface flex items-center justify-center gap-1.5 active:scale-95"
                  onClick={() => showToast("Link calendario appuntamenti inviato ad Arch. Moretti.")}
                  type="button"
                >
                  <span className="material-symbols-outlined text-lg">link</span>
                  <span className="font-label-md text-label-md truncate">Invia Calendario</span>
                </button>
              </div>
            </article>
          )}

          {/* Card 4: Historical / Sollecito Status */}
          {showFerri && (
            <article className="bg-surface-container-lowest rounded-2xl p-4 shadow-sm flex flex-col gap-2.5 opacity-90">
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="w-10 h-10 rounded-full bg-surface-container-high flex items-center justify-center font-headline-sm text-on-surface-variant flex-shrink-0">
                    VF
                  </div>
                  <div className="min-w-0">
                    <h2 className="font-headline-sm text-headline-sm text-on-surface truncate">Geom. Valerio Ferri</h2>
                    <span className="px-2 py-0.5 rounded bg-surface-container-high text-on-surface-variant font-label-sm text-label-sm">
                      Sollecito PEC GSE
                    </span>
                  </div>
                </div>
                <span className="font-label-sm text-label-sm text-text-muted flex-shrink-0">Ieri 16:10</span>
              </div>
              <div className="rounded-xl bg-surface-container-low p-3">
                <p className="font-body-md text-body-md text-on-surface-variant">
                  “Novità per la PEC inoltrata al GSE? Avete ricevuto riscontro dal funzionario territoriale?”
                </p>
              </div>
              <div className="flex items-center justify-between pt-1">
                <div className="flex items-center gap-1.5 text-text-muted">
                  <span className="material-symbols-outlined text-base text-status-success">done_all</span>
                  <span className="font-label-sm text-label-sm">Risposto da Ing. Marco V. (Studio)</span>
                </div>
                <button
                  className="font-label-md text-label-md text-primary hover:underline"
                  onClick={() => navigate("/istruttoria-gse")}
                  type="button"
                >
                  Vedi thread
                </button>
              </div>
            </article>
          )}
        </div>

        {/* Field Productivity Floating Command Trigger */}
        <div className="pt-2">
          <div className="bg-primary text-on-primary rounded-2xl p-3.5 shadow-md flex items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-primary-container flex items-center justify-center text-status-success">
                <span className="material-symbols-outlined text-xl">bolt</span>
              </div>
              <div>
                <p className="font-headline-sm text-headline-sm leading-tight">Batch Smart Triage</p>
                <p className="font-label-sm text-label-sm text-on-primary-container">5 clienti attendono una risposta</p>
              </div>
            </div>
            <button
              className="h-10 px-3.5 rounded-xl bg-secondary-container text-on-secondary font-label-md text-label-md shadow-sm active:scale-95 transition-transform whitespace-nowrap"
              onClick={() => navigate("/triage-sos")}
              type="button"
            >
              Revisiona Bozze AI
            </button>
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
