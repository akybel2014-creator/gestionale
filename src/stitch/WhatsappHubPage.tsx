import { useEffect, useState } from "react";
import StitchShell from "./StitchShell";
import { useTrialSession } from "./TrialGuard";
import {
  buildWhatsAppMessage,
  buildWhatsAppUrl,
  calculateTotals,
  fetchCloudQuotes,
  formatEuro,
  getActiveChatId,
  getInitials,
  getPocketChats,
  markChatAsSentWithCloudSync,
  setActiveChatId,
  type PocketChat,
} from "./pocketStore";
import {
  buildPdfFilename,
  downloadQuotePdf,
  sendQuotePdfDirectlyToWhatsApp,
} from "./pdfGenerator";

export default function WhatsappHubPage() {
  const { trial, requireActiveTrial, openPaywall, forceExpireAndOpenPaywall } = useTrialSession();
  const [chats, setChats] = useState<PocketChat[]>(() => getPocketChats());
  const [selectedId, setSelectedId] = useState<string>(() => getActiveChatId());
  const [toastMsg, setToastMsg] = useState<string | null>(null);
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

  const activeChat = chats.find((c) => c.id === selectedId) || chats[0];
  const totals = calculateTotals(activeChat.amount, activeChat.vatOptionId, activeChat.bonusOptionId);
  const messageText = buildWhatsAppMessage(activeChat);
  const pdfFilename = buildPdfFilename(activeChat.clientName);
  const waUrl = buildWhatsAppUrl(activeChat.clientPhone, messageText);

  const handleSelectChat = (id: string) => {
    setSelectedId(id);
    setActiveChatId(id);
  };

  const showToast = (msg: string, tone: "success" | "warning" = "success", duration = 4500) => {
    setToastTone(tone);
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), duration);
  };

  const handleSendPdfWhatsApp = async () => {
    if (!requireActiveTrial()) return;

    const result = sendQuotePdfDirectlyToWhatsApp(activeChat);
    if (result.ok === false) {
      showToast(result.errorMessage, "warning", 4000);
      return;
    }

    const { chats: updated, rlsDenied } = await markChatAsSentWithCloudSync(activeChat.id);
    if (rlsDenied) {
      forceExpireAndOpenPaywall();
      return;
    }
    setChats(updated);
    showToast(
      `PDF ${result.filename} scaricato. Allegalo nella chat WhatsApp appena aperta.`
    );
  };

  const isRead = activeChat.status === "Letto";
  const isSent = activeChat.status === "Inviato";

  return (
    <StitchShell title="Whatsapp Hub" activeTab="whatsapp">
      <div className="w-full max-w-3xl mx-auto pb-8 flex flex-col gap-4">
        {/* Lista essenziale delle chat recenti */}
        <section className="bg-surface-card rounded-2xl p-3 shadow-sm flex flex-col gap-1.5">
          <span className="px-2 pt-1 font-label-sm text-label-sm uppercase tracking-wider text-text-muted">
            Chat Recenti
          </span>
          <div className="flex flex-col divide-y divide-surface-container">
            {chats.map((chat) => {
              const selected = chat.id === activeChat.id;
              const chatTotal = calculateTotals(
                chat.amount,
                chat.vatOptionId,
                chat.bonusOptionId
              ).total;
              return (
                <button
                  key={chat.id}
                  type="button"
                  onClick={() => handleSelectChat(chat.id)}
                  className={`w-full min-h-[56px] px-2.5 py-2.5 rounded-xl flex items-center justify-between gap-3 text-left transition-colors ${
                    selected ? "bg-surface-container-low" : "hover:bg-surface-container-low/60"
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center font-headline-sm text-sm font-bold shrink-0 ${
                        selected
                          ? "bg-primary-container text-on-primary"
                          : "bg-surface-container text-on-surface"
                      }`}
                    >
                      {getInitials(chat.clientName)}
                    </div>
                    <div className="min-w-0">
                      <p className="font-label-lg text-label-lg text-on-surface font-semibold truncate">
                        {chat.clientName}
                      </p>
                      <p className="font-body-sm text-body-sm text-text-muted truncate">
                        {chat.description}
                      </p>
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <span className="font-label-md text-label-md font-bold tabular-nums text-primary block">
                      {formatEuro(chatTotal)}
                    </span>
                    <span
                      className={`font-label-sm text-[11px] font-semibold ${
                        chat.status === "Letto"
                          ? "text-[#0284C7]"
                          : chat.status === "Inviato"
                            ? "text-status-success"
                            : "text-text-muted"
                      }`}
                    >
                      {chat.status === "Bozza" ? "Pronto" : chat.status}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </section>

        {/* Dettaglio Chat Attiva + Allegato PDF + Unico Grande Pulsante Verde */}
        <article className="w-full bg-surface-card rounded-2xl p-4 sm:p-5 shadow-sm flex flex-col gap-4">
          <div className="flex items-center justify-between gap-3">
            <div className="min-w-0">
              <h2 className="font-headline-sm text-headline-sm text-on-surface font-bold truncate">
                {activeChat.clientName}
              </h2>
              <p className="font-body-sm text-body-sm text-text-muted truncate">
                {activeChat.clientPhone} · {activeChat.updatedAt}
              </p>
            </div>
            <span
              className={`font-label-md text-label-md font-semibold shrink-0 ${
                isRead
                  ? "text-[#0284C7]"
                  : isSent
                    ? "text-status-success"
                    : "text-on-surface-variant"
              }`}
            >
              {isRead ? "✓✓ Letto" : isSent ? "✓✓ Inviato" : "Pronto"}
            </span>
          </div>

          {/* Allegato PDF pronto (consultabile/esportabile anche in sola lettura) */}
          <button
            type="button"
            onClick={() => {
              const name = downloadQuotePdf(activeChat);
              showToast(`PDF scaricato: ${name}`, "success", 2500);
            }}
            className="w-full min-h-[56px] rounded-xl bg-surface-container-low hover:bg-surface-container p-3 flex items-center justify-between gap-3 text-left transition-colors"
          >
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-10 h-10 rounded-lg bg-error-container text-error flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined text-xl">picture_as_pdf</span>
              </div>
              <div className="min-w-0">
                <p className="font-label-md text-label-md text-on-surface font-semibold truncate">
                  {pdfFilename}
                </p>
                <p className="font-body-sm text-body-sm text-text-muted">
                  Totale {formatEuro(totals.total)} ({totals.vatOption.shortLabel}) · Tocca per scaricare PDF
                </p>
              </div>
            </div>
            <span className="material-symbols-outlined text-text-muted text-xl shrink-0">
              download
            </span>
          </button>

          {/* Anteprima messaggio */}
          <div className="w-full bg-[#E7FCE8] text-[#111B21] rounded-2xl rounded-tr-xs p-4 shadow-xs">
            <p className="font-body-md text-body-md leading-relaxed whitespace-pre-line text-[#111B21]">
              {messageText}
            </p>
          </div>

          {/* Unico grande pulsante verde ben visibile */}
          {trial.isExpired ? (
            <button
              type="button"
              id="send-whatsapp-fast-btn"
              onClick={openPaywall}
              className="w-full h-14 rounded-2xl bg-secondary-container hover:opacity-95 text-on-secondary font-headline-sm text-headline-sm font-bold flex items-center justify-center gap-2.5 shadow-md cursor-pointer"
            >
              <span className="material-symbols-outlined text-xl">lock</span>
              <span>Attiva Abbonamento per Inviare</span>
            </button>
          ) : (
            <button
              type="button"
              id="send-whatsapp-fast-btn"
              onClick={handleSendPdfWhatsApp}
              className="w-full h-14 rounded-2xl bg-[#25D366] hover:bg-[#1ebe5d] active:scale-[0.98] transition-all text-white font-headline-sm text-headline-sm font-bold flex items-center justify-center gap-2.5 shadow-md cursor-pointer"
            >
              <svg className="w-6 h-6 fill-current shrink-0" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21 5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.816 9.816 0 0 0 12.04 2zm0 18.15c-1.48 0-2.93-.4-4.2-1.15l-.3-.18-3.12.82.83-3.04-.2-.31a8.13 8.13 0 0 1-1.25-4.38c0-4.5 3.66-8.15 8.16-8.15 2.18 0 4.23.85 5.77 2.39 1.54 1.54 2.39 3.59 2.39 5.77 0 4.5-3.66 8.15-8.16 8.15zm4.47-6.1c-.24-.12-1.45-.72-1.68-.8-.23-.08-.39-.12-.56.12-.17.24-.64.8-.79.96-.14.16-.29.18-.53.06-.24-.12-1.03-.38-1.96-1.21-.72-.65-1.21-1.45-1.36-1.69-.14-.24-.02-.37.1-.49.11-.11.24-.29.36-.43.12-.14.16-.24.24-.4.08-.16.04-.3-.02-.42-.06-.12-.56-1.35-.77-1.85-.2-.49-.41-.42-.56-.43h-.48c-.16 0-.43.06-.66.31-.23.24-.87.85-.87 2.07 0 1.22.89 2.4 1.01 2.56.12.16 1.75 2.67 4.23 3.74.59.25 1.05.41 1.41.52.59.19 1.13.16 1.56.1.47-.07 1.45-.59 1.65-1.16.2-.57.2-1.06.14-1.16-.06-.1-.23-.16-.47-.28z" />
              </svg>
              <span>Invia PDF su WhatsApp</span>
            </button>
          )}

          {!trial.isExpired && (
            <div className="flex justify-end">
              <a
                href={waUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="min-h-[40px] flex items-center gap-1 text-[#008069] hover:underline font-label-md text-label-md"
              >
                <span>Apri chat su WhatsApp</span>
                <span className="material-symbols-outlined text-base">open_in_new</span>
              </a>
            </div>
          )}
        </article>

        {toastMsg && (
          <div
            role="status"
            className="fixed bottom-24 inset-x-margin max-w-sm mx-auto bg-primary-container text-on-primary px-4 py-3 rounded-xl shadow-2xl flex items-center gap-2.5 z-50"
          >
            <span
              className={`material-symbols-outlined text-lg ${
                toastTone === "warning" ? "text-status-warning" : "text-status-success"
              }`}
            >
              {toastTone === "warning" ? "warning" : "check_circle"}
            </span>
            <span className="font-body-sm text-body-sm">{toastMsg}</span>
          </div>
        )}
      </div>
    </StitchShell>
  );
}
