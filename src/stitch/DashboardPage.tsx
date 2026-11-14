import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import StitchShell from "./StitchShell";
import { useTrialSession } from "./TrialGuard";
import {
  calculateTotals,
  fetchCloudQuotes,
  formatEuro,
  getInitials,
  getPocketChats,
  markChatAsSentWithCloudSync,
  setActiveChatId,
  type PocketChat,
} from "./pocketStore";
import { downloadQuotePdf, sendQuotePdfDirectlyToWhatsApp } from "./pdfGenerator";

type FilterType = "tutti" | "bozze" | "inviati";

export default function DashboardPage() {
  const navigate = useNavigate();
  const { trial, requireActiveTrial, forceExpireAndOpenPaywall } = useTrialSession();
  const [chats, setChats] = useState<PocketChat[]>(() => getPocketChats());
  const [activeFilter, setActiveFilter] = useState<FilterType>("tutti");
  const [searchQuery, setSearchQuery] = useState("");
  const [inlineToast, setInlineToast] = useState<string | null>(null);
  const [toastTone, setToastTone] = useState<"success" | "warning">("success");

  useEffect(() => {
    let active = true;
    void fetchCloudQuotes().then((cloudChats) => {
      if (active && cloudChats && cloudChats.length > 0) {
        setChats(cloudChats);
      }
    });
    return () => {
      active = false;
    };
  }, []);

  const triggerToast = (
    msg: string,
    tone: "success" | "warning" = "success",
    duration = 3200
  ) => {
    setToastTone(tone);
    setInlineToast(msg);
    setTimeout(() => setInlineToast(null), duration);
  };

  const q = searchQuery.trim().toLowerCase();

  const filteredChats = chats.filter((chat) => {
    const matchesFilter =
      activeFilter === "tutti" ||
      (activeFilter === "bozze" && chat.status === "Bozza") ||
      (activeFilter === "inviati" && (chat.status === "Inviato" || chat.status === "Letto"));

    const matchesSearch =
      !q ||
      `${chat.clientName} ${chat.description} ${chat.clientPhone}`.toLowerCase().includes(q);

    return matchesFilter && matchesSearch;
  });

  const totalPipeline = chats.reduce((acc, c) => {
    return acc + calculateTotals(c.amount, c.vatOptionId, c.bonusOptionId).total;
  }, 0);
  const sentCount = chats.filter((c) => c.status === "Inviato" || c.status === "Letto").length;
  const draftCount = chats.filter((c) => c.status === "Bozza").length;

  const chipClass = (key: FilterType) =>
    activeFilter === key
      ? "whitespace-nowrap px-4 py-2 rounded-full bg-primary text-on-primary font-label-md text-label-md shadow-sm active:scale-95 transition-transform flex items-center gap-1.5"
      : "whitespace-nowrap px-4 py-2 rounded-full bg-surface-card text-on-surface font-label-md text-label-md shadow-sm active:scale-95 transition-transform flex items-center gap-1.5";

  return (
    <StitchShell title="Dashboard" activeTab="dashboard">
      <div className="flex flex-col w-full pb-8">
        {/* Riepilogo rapido */}
        <div className="w-full bg-surface-container-low rounded-2xl p-space-md shadow-sm mb-space-md">
          <div className="flex items-center justify-between mb-space-sm">
            <div className="flex items-center gap-1.5">
              <span className="material-symbols-outlined text-secondary-container text-lg">insights</span>
              <span className="font-label-sm text-label-sm uppercase tracking-wider text-on-surface-variant font-bold">
                Riepilogo Preventivi
              </span>
            </div>
            <button
              type="button"
              onClick={() => {
                if (!requireActiveTrial()) return;
                navigate("/preventivo");
              }}
              aria-disabled={trial.isExpired}
              className={`font-label-sm text-label-sm px-2.5 py-1 rounded-full font-semibold ${
                trial.isExpired
                  ? "bg-surface-container text-text-muted cursor-not-allowed"
                  : "bg-secondary-container text-on-secondary"
              }`}
            >
              {trial.isExpired ? "Sola lettura" : "+ Nuovo"}
            </button>
          </div>
          <div className="grid grid-cols-3 gap-2">
            <div className="bg-surface-card rounded-xl p-2.5 flex flex-col items-start shadow-sm">
              <span className="text-on-surface-variant font-label-sm text-label-sm">Totale</span>
              <span className="font-numeric-currency-md text-numeric-currency-md text-primary font-bold tabular-nums mt-0.5">
                {chats.length}
              </span>
              <span className="font-body-sm text-body-sm text-on-surface-variant line-clamp-1 mt-0.5">
                Preventivi
              </span>
            </div>
            <div className="bg-surface-card rounded-xl p-2.5 flex flex-col items-start shadow-sm">
              <span className="text-on-surface-variant font-label-sm text-label-sm">Valore</span>
              <span className="font-numeric-currency-md text-numeric-currency-md text-primary font-bold tabular-nums mt-0.5 truncate w-full">
                {formatEuro(totalPipeline).replace(",00", "")}
              </span>
              <span className="font-body-sm text-body-sm text-secondary-container line-clamp-1 mt-0.5 font-semibold">
                IVA inclusa
              </span>
            </div>
            <div className="bg-surface-card rounded-xl p-2.5 flex flex-col items-start shadow-sm">
              <span className="text-on-surface-variant font-label-sm text-label-sm">Inviati</span>
              <span className="font-numeric-currency-md text-numeric-currency-md text-status-success font-bold tabular-nums mt-0.5">
                {sentCount}
              </span>
              <span className="font-body-sm text-body-sm text-status-success line-clamp-1 mt-0.5 font-semibold">
                Su WhatsApp
              </span>
            </div>
          </div>
        </div>

        {/* Barra ricerca */}
        <div className="relative w-full mb-space-sm">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-text-muted">
            <span className="material-symbols-outlined text-xl">search</span>
          </div>
          <input
            className="w-full h-12 pl-11 pr-10 bg-surface-card rounded-xl shadow-sm text-on-surface placeholder:text-text-muted font-body-md text-body-md outline-none transition-all duration-200 focus:shadow-md"
            placeholder="Cerca cliente o lavoro..."
            type="search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <button
            type="button"
            aria-label="Impostazioni tariffa e IVA"
            onClick={() => navigate("/listini-iva")}
            className="absolute inset-y-0 right-0 pr-3 flex items-center text-text-muted hover:text-primary transition-colors"
          >
            <span className="material-symbols-outlined text-xl">tune</span>
          </button>
        </div>

        {/* Filtri essenziali */}
        <div className="flex items-center gap-2 overflow-x-auto py-1.5 mb-space-md no-scrollbar -mx-4 px-4 sm:mx-0 sm:px-0">
          <button type="button" onClick={() => setActiveFilter("tutti")} className={chipClass("tutti")}>
            <span>Tutti</span>
            <span className="text-[11px] opacity-80 tabular-nums">({chats.length})</span>
          </button>
          <button type="button" onClick={() => setActiveFilter("bozze")} className={chipClass("bozze")}>
            <span>Bozze</span>
            <span className="text-[11px] opacity-80 tabular-nums">({draftCount})</span>
          </button>
          <button type="button" onClick={() => setActiveFilter("inviati")} className={chipClass("inviati")}>
            <span>Inviati</span>
            <span className="text-[11px] opacity-80 tabular-nums">({sentCount})</span>
          </button>
        </div>

        {/* Lista Preventivi / Clienti */}
        <div className="flex flex-col gap-space-md w-full">
          {filteredChats.length === 0 ? (
            <div className="w-full bg-surface-card rounded-2xl p-6 text-center shadow-sm flex flex-col items-center gap-3">
              <p className="font-body-md text-body-md text-text-muted">
                Nessun preventivo trovato.
              </p>
              <button
                type="button"
                onClick={() => {
                  if (!requireActiveTrial()) return;
                  navigate("/preventivo");
                }}
                aria-disabled={trial.isExpired}
                className={`min-h-[44px] px-5 rounded-xl font-label-md text-label-md font-bold ${
                  trial.isExpired
                    ? "bg-surface-container text-text-muted cursor-not-allowed"
                    : "bg-secondary-container text-on-secondary"
                }`}
              >
                {trial.isExpired ? "Attiva Abbonamento per Creare" : "Crea Nuovo Preventivo"}
              </button>
            </div>
          ) : (
            filteredChats.map((chat) => {
              const totals = calculateTotals(chat.amount, chat.vatOptionId, chat.bonusOptionId);
              const isRead = chat.status === "Letto";
              const isSent = chat.status === "Inviato";

              return (
                <div
                  key={chat.id}
                  className="w-full bg-surface-card rounded-2xl p-space-md shadow-sm flex flex-col gap-3 relative transition-all duration-200"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className="w-10 h-10 rounded-full bg-primary-fixed text-primary flex items-center justify-center font-headline-sm text-headline-sm font-bold flex-shrink-0">
                        {getInitials(chat.clientName)}
                      </div>
                      <div className="min-w-0">
                        <h2 className="font-headline-sm text-headline-sm text-on-surface truncate">
                          {chat.clientName}
                        </h2>
                        <p className="font-body-sm text-body-sm text-text-muted truncate">
                          {chat.clientPhone} · {chat.updatedAt}
                        </p>
                      </div>
                    </div>
                    <span
                      className={`font-label-sm text-label-sm font-semibold shrink-0 ${
                        isRead
                          ? "text-[#0284C7]"
                          : isSent
                            ? "text-status-success"
                            : "text-status-warning"
                      }`}
                    >
                      {chat.status}
                    </span>
                  </div>

                  <div className="bg-surface-container-low rounded-xl p-3 flex items-center justify-between gap-3">
                    <div className="flex flex-col min-w-0">
                      <span className="font-label-sm text-label-sm text-text-muted">Lavoro</span>
                      <span className="font-label-lg text-label-lg text-primary font-semibold truncate">
                        {chat.description}
                      </span>
                      {totals.bonusOption.rate > 0 && (
                        <span className="font-body-sm text-body-sm text-status-success mt-0.5">
                          {totals.bonusOption.shortLabel} (risparmio {formatEuro(totals.detrazioneAmount)})
                        </span>
                      )}
                    </div>
                    <div className="text-right flex-shrink-0">
                      <span className="font-label-sm text-label-sm text-text-muted block">
                        {totals.vatOption.shortLabel}
                      </span>
                      <span className="font-numeric-currency-md text-numeric-currency-md text-primary font-bold tabular-nums">
                        {formatEuro(totals.total)}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 pt-1">
                    <button
                      type="button"
                      onClick={async () => {
                        if (!requireActiveTrial()) return;
                        setActiveChatId(chat.id);
                        const result = sendQuotePdfDirectlyToWhatsApp(chat);
                        if (result.ok === false) {
                          triggerToast(result.errorMessage, "warning", 4000);
                          return;
                        }
                        const { chats: updated, rlsDenied } = await markChatAsSentWithCloudSync(
                          chat.id
                        );
                        if (rlsDenied) {
                          forceExpireAndOpenPaywall();
                          return;
                        }
                        setChats(updated);
                        triggerToast(
                          `PDF ${result.filename} scaricato. Allegalo nella chat WhatsApp appena aperta.`,
                          "success",
                          4500
                        );
                      }}
                      aria-disabled={trial.isExpired}
                      className={`flex-1 h-[48px] rounded-xl font-label-md text-label-md font-bold flex items-center justify-center gap-2 shadow-sm transition-all ${
                        trial.isExpired
                          ? "bg-surface-container text-text-muted cursor-not-allowed"
                          : "bg-[#25D366] hover:bg-[#1ebe5d] text-white active:scale-[0.98] cursor-pointer"
                      }`}
                    >
                      <span className="material-symbols-outlined text-lg">
                        {trial.isExpired ? "lock" : "chat"}
                      </span>
                      <span>{trial.isExpired ? "Invio bloccato (scaduto)" : "Invia PDF su WhatsApp"}</span>
                    </button>
                    <button
                      type="button"
                      aria-label={trial.isExpired ? "Visualizza preventivo in sola lettura" : "Modifica preventivo"}
                      onClick={() => {
                        setActiveChatId(chat.id);
                        navigate("/preventivo");
                      }}
                      className="w-12 h-[48px] rounded-xl bg-surface-container flex items-center justify-center text-on-surface-variant hover:text-primary transition-colors flex-shrink-0"
                    >
                      <span className="material-symbols-outlined text-xl">
                        {trial.isExpired ? "visibility" : "edit"}
                      </span>
                    </button>
                    <button
                      type="button"
                      aria-label="Scarica PDF"
                      onClick={() => {
                        const filename = downloadQuotePdf(chat);
                        triggerToast(`PDF scaricato: ${filename}`);
                      }}
                      className="w-12 h-[48px] rounded-xl bg-surface-container flex items-center justify-center text-on-surface-variant hover:text-primary transition-colors flex-shrink-0"
                    >
                      <span className="material-symbols-outlined text-xl">picture_as_pdf</span>
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Recensioni e Riprova Sociale */}
        <section
          id="artisan-reviews-section"
          aria-labelledby="artisan-reviews-heading"
          className="mt-6 flex flex-col gap-3 w-full"
        >
          <div className="flex items-center justify-between px-0.5">
            <div className="flex items-center gap-1.5">
              <span className="material-symbols-outlined text-secondary-container text-lg">verified</span>
              <h2
                id="artisan-reviews-heading"
                className="font-label-sm text-label-sm uppercase tracking-wider text-on-surface-variant font-bold"
              >
                Cosa dicono gli artigiani
              </h2>
            </div>
            <span className="font-label-sm text-[11px] text-on-surface-variant font-semibold">
              4,9/5 · Verificati
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {[
              {
                name: "Marco T.",
                role: "Termoidraulico - Vicenza",
                quote:
                  "Finalmente un preventivo fatto al volo in cantiere con il calcolo del Bonus Casa al 50%. I clienti lo firmano subito.",
              },
              {
                name: "Andrea B.",
                role: "Impresa Edile - Padova",
                quote:
                  "Velocissimo da telefono. Invio il PDF su WhatsApp prima ancora di salire sul furgone.",
              },
              {
                name: "Roberto M.",
                role: "Elettricista - Verona",
                quote:
                  "Semplice, zero complicazioni da commercialista. Fa esattamente quello che serve a noi.",
              },
            ].map((review) => (
              <article
                key={review.name}
                className="bg-surface-card rounded-2xl p-space-md shadow-sm border border-border-slate/50 flex flex-col justify-between gap-2.5"
              >
                <div className="flex items-center justify-between gap-2">
                  <div className="min-w-0">
                    <h3 className="font-headline-sm text-headline-sm text-on-surface font-bold truncate">
                      {review.name}
                    </h3>
                    <p className="font-body-sm text-[12px] text-text-muted truncate">
                      {review.role}
                    </p>
                  </div>
                  <span
                    className="text-xs tracking-tight shrink-0"
                    aria-label="Valutazione 5 stelle su 5"
                  >
                    ⭐⭐⭐⭐⭐
                  </span>
                </div>
                <p className="font-body-sm text-body-sm text-on-surface-variant leading-relaxed">
                  &ldquo;{review.quote}&rdquo;
                </p>
              </article>
            ))}
          </div>

          {/* Pulsante Feedback Artigiano */}
          <a
            id="developer-feedback-whatsapp-btn"
            href={`https://wa.me/393423255008?text=${encodeURIComponent(
              "Ciao! Sto provando il gestionale e vorrei darti un suggerimento:"
            )}`}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full rounded-2xl bg-surface-container-low hover:bg-surface-container border border-border-slate/70 px-4 py-3.5 flex items-center justify-between gap-3 transition-colors shadow-sm"
          >
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-10 h-10 rounded-xl bg-[#25D366]/15 text-[#16a34a] flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined text-xl">forum</span>
              </div>
              <div className="min-w-0">
                <p className="font-body-sm text-body-sm text-on-surface font-semibold leading-snug">
                  Hai un suggerimento o ti serve una funzione specifica?
                </p>
                <p className="font-label-sm text-label-sm text-[#16a34a] font-bold mt-0.5">
                  Parla con lo sviluppatore su WhatsApp
                </p>
              </div>
            </div>
            <span className="material-symbols-outlined text-on-surface-variant shrink-0">
              chevron_right
            </span>
          </a>
        </section>

        {inlineToast && (
          <div
            role="status"
            className="fixed bottom-24 inset-x-margin max-w-sm mx-auto bg-primary text-on-primary px-4 py-3 rounded-xl shadow-2xl flex items-center justify-between gap-3 z-50"
          >
            <div className="flex items-center gap-2.5">
              <div
                className={`w-7 h-7 rounded-full text-on-primary flex items-center justify-center shrink-0 ${
                  toastTone === "warning" ? "bg-status-warning" : "bg-status-success"
                }`}
              >
                <span className="material-symbols-outlined text-sm font-bold">
                  {toastTone === "warning" ? "warning" : "check"}
                </span>
              </div>
              <p className="font-label-md text-label-md font-semibold">{inlineToast}</p>
            </div>
          </div>
        )}
      </div>
    </StitchShell>
  );
}
