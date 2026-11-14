import { useState } from "react";
import { useNavigate } from "react-router-dom";
import StitchShell from "./StitchShell";

export default function AnteprimaWhatsappMarcoPage() {
  const navigate = useNavigate();
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 2500);
  };

  const handleCopy = () => {
    const textToCopy =
      "Ciao Marco! Ti invio in allegato il preventivo dettagliato sigillato per la ristrutturazione del bagno di Via Roma 42. Totale: € 4.818,00 con Detrazione 50% applicata (Costo effettivo netto: € 2.409,00).";
    if (navigator.clipboard) {
      navigator.clipboard
        .writeText(textToCopy)
        .then(() => showToast("Messaggio copiato negli appunti"))
        .catch(() => showToast("Copia completata"));
    } else {
      showToast("Copia completata");
    }
  };

  return (
    <StitchShell title="Whatsapp Hub" activeTab="none">
      <div className="flex flex-col w-full pb-10">
        <div className="w-full flex items-center justify-between bg-surface-container p-space-sm rounded-xl mb-space-md shadow-sm">
          <div className="flex items-center gap-space-sm min-w-0">
            <div className="w-8 h-8 rounded-lg bg-primary-container text-on-primary flex items-center justify-center">
              <span className="material-symbols-outlined text-lg">visibility</span>
            </div>
            <div className="min-w-0">
              <p className="font-label-md text-label-md text-on-surface truncate">Anteprima Messaggio WhatsApp</p>
              <p className="font-body-sm text-body-sm text-on-surface-variant truncate">Cliente: Marco Bellini (Bagno)</p>
            </div>
          </div>
          <div className="flex items-center gap-1.5 shrink-0">
            <button
              type="button"
              aria-label="Copia Testo"
              onClick={handleCopy}
              className="w-9 h-9 rounded-lg bg-surface flex items-center justify-center text-on-surface shadow-xs active:scale-95 transition-transform"
              id="copy-btn"
            >
              <span className="material-symbols-outlined text-base">content_copy</span>
            </button>
            <button
              type="button"
              aria-label="Modifica Testo"
              onClick={() => showToast("Editor testo preventivo attivato")}
              className="w-9 h-9 rounded-lg bg-surface flex items-center justify-center text-on-surface shadow-xs active:scale-95 transition-transform"
              id="edit-draft-btn"
            >
              <span className="material-symbols-outlined text-base">edit</span>
            </button>
          </div>
        </div>

        <div className="w-full rounded-2xl overflow-hidden shadow-md bg-[#efeae2] relative mb-space-lg">
          <div className="w-full bg-[#075e54] text-white px-space-md py-2.5 flex items-center justify-between">
            <div className="flex items-center gap-2.5 min-w-0">
              <span
                onClick={() => navigate("/whatsapp")}
                className="material-symbols-outlined text-white text-xl cursor-pointer"
              >
                arrow_back
              </span>
              <div className="relative w-10 h-10 rounded-full overflow-hidden shrink-0 bg-surface-container">
                <img
                  alt="Marco Bellini"
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuBut_xp8pMWyjMbF4X99QIX0hWzS-3pZQ4vRsYQEtyKbi4MmsBIClZyCtkK5sIE7OZPi_RiHTULgo-j26HeKX8RErDrYGXCg1Pkae4Bf1jm7aKkMVmVWap2maoeFQgL5PiDN7MeL-5Tsi6XZ2AxdgYq6zYHSWPH_R06Dw7jxgJZ35ptv_xzJhRItqhN1BGFIMUCzQ5Dd1nUE3hyo0ovCKeyf91DJ8dxYmSooIOwlh67"
                />
              </div>
              <div className="min-w-0 flex flex-col justify-center">
                <div className="flex items-center gap-1">
                  <h2 className="font-headline-sm text-headline-sm text-white truncate text-[15px] font-semibold leading-tight">
                    Marco Bellini
                  </h2>
                  <span
                    className="material-symbols-outlined text-[#25d366] text-xs"
                    style={{ fontVariationSettings: "'FILL' 1" }}
                  >
                    verified
                  </span>
                </div>
                <p className="font-body-sm text-body-sm text-white/80 leading-tight">online</p>
              </div>
            </div>
            <div className="flex items-center gap-3 text-white">
              <span className="material-symbols-outlined text-xl">videocam</span>
              <span className="material-symbols-outlined text-xl">call</span>
              <span className="material-symbols-outlined text-xl">more_vert</span>
            </div>
          </div>

          <div className="p-3.5 space-y-3 relative bg-[radial-gradient(#0000000a_1px,transparent_1px)] [background-size:16px_16px]">
            <div className="flex justify-center my-1">
              <span className="font-label-sm text-label-sm bg-white/90 text-on-surface-variant px-2.5 py-0.5 rounded-full shadow-xs uppercase tracking-wider">
                Oggi
              </span>
            </div>
            <div className="flex justify-end">
              <div className="max-w-[94%] bg-[#dcf8c6] rounded-xl rounded-tr-xs p-3 shadow-sm text-on-surface flex flex-col gap-2.5 relative">
                <div className="font-body-md text-body-md text-on-surface leading-snug">
                  Ciao <strong>Marco</strong>! 👋 Ti invio il preventivo ufficiale e sigillato per la ristrutturazione
                  completa del bagno di <strong>Via Roma 42</strong>. Abbiamo applicato e certificato la detrazione fiscale
                  al <strong>50%</strong>.
                </div>
                <div className="bg-white/90 rounded-lg p-2.5 flex items-center gap-3 shadow-xs">
                  <div className="w-10 h-12 rounded bg-error-container text-error flex flex-col items-center justify-center shrink-0">
                    <span
                      className="material-symbols-outlined text-xl"
                      style={{ fontVariationSettings: "'FILL' 1" }}
                    >
                      picture_as_pdf
                    </span>
                    <span className="font-label-sm text-[9px] uppercase tracking-tighter font-bold">PDF</span>
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="font-label-md text-label-md text-on-surface truncate font-semibold">
                      Preventivo_PRV-2025-084_Bagno_MarcoBellini.pdf
                    </p>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="font-body-sm text-body-sm text-on-surface-variant">1.2 MB</span>
                      <span className="text-on-surface-variant/40">•</span>
                      <span className="font-label-sm text-label-sm text-status-success font-medium flex items-center gap-0.5">
                        <span className="material-symbols-outlined text-xs">verified</span> Congruità Prezziari 2025
                      </span>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => showToast("Download PDF PRV-2025-084 avviato...")}
                    aria-label="Scarica PDF"
                    className="w-8 h-8 rounded-full bg-surface-container flex items-center justify-center text-on-surface-variant shrink-0"
                  >
                    <span className="material-symbols-outlined text-lg">download</span>
                  </button>
                </div>

                <div className="bg-surface-container-lowest/80 rounded-lg p-3 text-on-surface space-y-1.5 text-xs shadow-xs">
                  <div className="flex items-center gap-1.5 font-label-md text-label-md text-primary font-bold mb-1">
                    <span className="material-symbols-outlined text-sm text-secondary-container">receipt_long</span>
                    <span>RIEPILOGO ECONOMICO CERTIFICATO</span>
                  </div>
                  <div className="flex justify-between items-center py-0.5">
                    <span className="font-body-sm text-body-sm text-on-surface-variant">Totale Lavori (IVA 10% incl.):</span>
                    <span className="font-numeric-currency-md text-numeric-currency-md text-on-surface">€ 4.818,00</span>
                  </div>
                  <div className="flex justify-between items-center py-0.5">
                    <span className="font-body-sm text-body-sm text-on-surface-variant">Agevolazione:</span>
                    <span className="font-label-sm text-label-sm bg-secondary/10 text-secondary px-1.5 py-0.5 rounded font-bold">
                      Bonus Casa 50%
                    </span>
                  </div>
                  <div className="flex justify-between items-center py-0.5">
                    <span className="font-body-sm text-body-sm text-status-success">Detrazione IRPEF (10 anni):</span>
                    <span className="font-body-md text-body-md text-status-success font-semibold">-€ 2.409,00</span>
                  </div>
                  <p className="font-body-sm text-body-sm text-on-surface-variant text-[11px] italic pl-1">
                    Quota annuale scaricabile: € 240,90 / anno
                  </p>
                  <div className="my-1.5 h-px bg-on-surface/10" />
                  <div className="flex justify-between items-center bg-primary/5 p-2 rounded">
                    <span className="font-label-md text-label-md text-primary font-bold uppercase tracking-tight">
                      Costo Reale a tuo carico:
                    </span>
                    <span className="font-numeric-currency-md text-numeric-currency-md text-secondary-container font-bold">
                      € 2.409,00
                    </span>
                  </div>
                  <div className="pt-1 space-y-1">
                    <div className="flex items-center gap-1.5 font-body-sm text-body-sm text-on-surface-variant">
                      <span className="material-symbols-outlined text-status-success text-sm">check_circle</span>
                      <span>Causale &quot;Bonifico Parlante&quot; già generata</span>
                    </div>
                    <div className="flex items-center gap-1.5 font-body-sm text-body-sm text-on-surface-variant">
                      <span className="material-symbols-outlined text-status-success text-sm">check_circle</span>
                      <span>Asseverazione e pratica telematica ENEA inclusa</span>
                    </div>
                  </div>
                </div>

                <div className="bg-white/90 rounded-lg p-2.5 flex items-center justify-between shadow-xs">
                  <div className="flex items-center gap-2 min-w-0">
                    <div className="w-7 h-7 rounded bg-secondary-container/10 text-secondary-container flex items-center justify-center shrink-0">
                      <span className="material-symbols-outlined text-base">touch_app</span>
                    </div>
                    <div className="min-w-0">
                      <p className="font-label-sm text-label-sm text-on-surface font-semibold truncate">
                        Firma Digitale &amp; Conferma Rapida
                      </p>
                      <p className="font-body-sm text-body-sm text-on-surface-variant text-[11px] truncate">
                        casalavoropro.it/sign/PRV-2025-084
                      </p>
                    </div>
                  </div>
                  <span className="material-symbols-outlined text-on-surface-variant text-base">arrow_forward</span>
                </div>
                <div className="flex items-center justify-end gap-1 mt-0.5">
                  <span className="font-body-sm text-body-sm text-on-surface-variant text-[11px]">14:23</span>
                  <span className="material-symbols-outlined text-[#34b7f1] text-base leading-none">done_all</span>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-1.5 items-end pl-6">
              <button
                type="button"
                onClick={() => showToast("Simulazione vista cliente: Preventivo accettato!")}
                className="w-full max-w-[94%] bg-white hover:bg-surface-container py-2.5 px-3 rounded-lg shadow-xs flex items-center justify-center gap-2 text-[#00a884] font-label-md text-label-md active:scale-[0.99] transition-transform"
              >
                <span className="material-symbols-outlined text-lg" style={{ fontVariationSettings: "'FILL' 1" }}>
                  task_alt
                </span>
                <span>Accetta Preventivo Online (1-Click)</span>
              </button>
              <button
                type="button"
                onClick={() => navigate("/listini-iva")}
                className="w-full max-w-[94%] bg-white hover:bg-surface-container py-2 px-3 rounded-lg shadow-xs flex items-center justify-center gap-2 text-on-surface-variant font-label-md text-label-md active:scale-[0.99] transition-transform"
              >
                <span className="material-symbols-outlined text-lg">edit_note</span>
                <span>Richiedi Modifica Voci</span>
              </button>
              <button
                type="button"
                onClick={() => showToast("Chiamata diretta verso Tiziano Rossi avviata.")}
                className="w-full max-w-[94%] bg-white hover:bg-surface-container py-2 px-3 rounded-lg shadow-xs flex items-center justify-center gap-2 text-on-surface-variant font-label-md text-label-md active:scale-[0.99] transition-transform"
              >
                <span className="material-symbols-outlined text-lg">call</span>
                <span>Chiama Tiziano Rossi</span>
              </button>
            </div>
          </div>
        </div>

        <div className="w-full bg-surface-card p-space-md rounded-2xl shadow-lg flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-status-success animate-ping" />
              <span className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider">
                Pronto per la consegna
              </span>
            </div>
            <span className="font-body-sm text-body-sm text-on-surface-variant">Target: +39 347 889 1204</span>
          </div>
          <div className="flex flex-col gap-2">
            <button
              type="button"
              id="send-whatsapp-btn"
              onClick={() => showToast("Invio messaggio tramite WhatsApp API...")}
              className="w-full h-12 bg-secondary-container text-on-secondary rounded-xl font-label-lg text-label-lg flex items-center justify-center gap-2 shadow-md active:scale-[0.98] transition-transform"
            >
              <span className="material-symbols-outlined text-xl">send</span>
              <span>Invia Adesso su WhatsApp</span>
            </button>
            <button
              type="button"
              id="open-wa-business-btn"
              onClick={() => showToast("Apertura WhatsApp Business in corso...")}
              className="w-full h-11 bg-[#25d366] text-white rounded-xl font-label-md text-label-md flex items-center justify-center gap-2 shadow-sm active:scale-[0.98] transition-transform"
            >
              <span className="material-symbols-outlined text-xl">chat</span>
              <span>Apri in WhatsApp Business</span>
            </button>
            <button
              type="button"
              id="edit-template-btn"
              onClick={() => navigate("/fuori-orario")}
              className="w-full h-10 bg-surface-container text-on-surface rounded-xl font-label-md text-label-md flex items-center justify-center gap-2 active:scale-[0.98] transition-transform"
            >
              <span className="material-symbols-outlined text-base">tune</span>
              <span>Personalizza Template &amp; Note</span>
            </button>
          </div>
        </div>

        <div
          className={`fixed bottom-24 left-1/2 -translate-x-1/2 bg-primary-container text-on-primary px-4 py-2 rounded-full font-body-sm text-body-sm shadow-xl transition-opacity duration-300 flex items-center gap-2 z-50 ${
            toastMsg ? "opacity-100" : "opacity-0 pointer-events-none"
          }`}
          id="toast"
        >
          <span className="material-symbols-outlined text-sm text-status-success">check_circle</span>
          <span id="toast-message">{toastMsg || "Testo copiato negli appunti!"}</span>
        </div>
      </div>
    </StitchShell>
  );
}
