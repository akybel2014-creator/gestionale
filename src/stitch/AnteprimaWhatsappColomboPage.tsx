import { useState } from "react";
import { useNavigate } from "react-router-dom";
import StitchShell from "./StitchShell";

export default function AnteprimaWhatsappColomboPage() {
  const navigate = useNavigate();
  const [copied, setCopied] = useState(false);
  const [dispatchState, setDispatchState] = useState<"idle" | "sending" | "sent">("idle");

  const handleCopy = () => {
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  };

  const handleDispatch = () => {
    if (dispatchState !== "idle") return;
    setDispatchState("sending");
    setTimeout(() => {
      setDispatchState("sent");
    }, 1200);
  };

  return (
    <StitchShell title="Whatsapp Hub" activeTab="none">
      <div className="flex flex-col w-full pb-6 space-y-4">
        {/* Context & Control Bar */}
        <div className="bg-surface-card rounded-xl p-3.5 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded bg-tertiary-container text-on-tertiary-container font-label-sm text-label-sm uppercase tracking-wide">
                Ecobonus 65% Attivo
              </span>
              <span className="px-2 py-0.5 rounded bg-surface-container text-on-surface-variant font-label-sm text-label-sm font-medium">
                Riqualificazione Energetica
              </span>
            </div>
            <button
              type="button"
              onClick={handleCopy}
              className="flex items-center gap-1 text-on-surface-variant hover:text-primary transition-colors text-xs font-label-md"
              id="copy-btn"
            >
              {copied ? (
                <>
                  <span className="material-symbols-outlined text-base text-status-success">check</span>
                  <span className="text-status-success font-semibold">Copiato!</span>
                </>
              ) : (
                <>
                  <span className="material-symbols-outlined text-base">content_copy</span>
                  <span>Copia testo</span>
                </>
              )}
            </button>
          </div>
          <div className="flex items-center justify-between pt-1">
            <div className="min-w-0">
              <p className="font-label-sm text-label-sm text-text-muted uppercase tracking-wider">
                Destinatario Preventivo
              </p>
              <p className="font-headline-sm text-headline-sm text-primary truncate">Ing. Roberto Colombo</p>
              <p className="font-body-sm text-body-sm text-on-surface-variant truncate">
                Corso Sempione, Milano • Pompa Calore &amp; Infissi
              </p>
            </div>
            <button
              type="button"
              onClick={() => navigate("/confronto-fiscale")}
              className="w-9 h-9 rounded-lg bg-surface-container-low flex items-center justify-center text-primary hover:bg-surface-container transition-colors shrink-0"
            >
              <span className="material-symbols-outlined text-lg">tune</span>
            </button>
          </div>
        </div>

        {/* WhatsApp Simulation Container */}
        <div className="rounded-xl overflow-hidden shadow-md bg-surface-container-high">
          <div className="bg-primary-container text-on-primary px-3 py-2.5 flex items-center justify-between">
            <div className="flex items-center gap-2.5 min-w-0">
              <span
                onClick={() => navigate("/whatsapp")}
                className="material-symbols-outlined text-xl text-on-primary-container cursor-pointer"
              >
                arrow_back
              </span>
              <div className="relative w-8 h-8 rounded-full overflow-hidden shrink-0">
                <img
                  alt="Roberto Colombo"
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuClGeuTXqO0fgMZJm7PnerYnY0nMoPL6EYaUg7fTYR0e9tE-Zbxqr1SQfKw-GyscT7YU3jwFXXyQnC_7rILZg1eALPcn2aB8KI04qfuRGHkZuP1VEoCW09WGCeoAH3cX7bTD6a5gwDSaVtrJ0cqI8-QJ1Y47fpTB2EeZGYcyybNQTGU6vvbuAgbQ0eTh0OWiSl4n-QKfIRwPfUSrkOZ4U5B_4nJDydO2LdZcvHZ-gLG"
                />
              </div>
              <div className="min-w-0 leading-tight">
                <p className="font-label-lg text-label-md font-semibold truncate text-on-primary">
                  Roberto Colombo (Cliente)
                </p>
                <p className="font-label-sm text-[11px] text-tertiary-fixed font-normal flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-status-success" />
                  online
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3 text-on-primary-container">
              <span className="material-symbols-outlined text-xl">videocam</span>
              <span className="material-symbols-outlined text-xl">call</span>
              <span className="material-symbols-outlined text-xl">more_vert</span>
            </div>
          </div>

          <div className="p-3 bg-surface-container-low space-y-3 relative">
            <div className="flex justify-center">
              <span className="px-2.5 py-0.5 rounded-full bg-surface-card/80 text-text-muted font-label-sm text-[10px] uppercase tracking-wider shadow-sm">
                Oggi • 11:42
              </span>
            </div>

            <div className="ml-auto w-full max-w-[340px] bg-surface-card rounded-2xl rounded-tr-xs p-3.5 shadow-sm space-y-3">
              <p className="font-body-md text-body-md text-on-surface leading-snug">
                Gentile Ing. Colombo! 🌿 Le invio la proposta ufficiale certificata per l&apos;intervento di{" "}
                <strong className="font-semibold text-primary">riqualificazione energetica</strong> (Pompa di calore ibrida
                Daikin + Infissi triplo vetro) per l&apos;immobile di Corso Sempione. Abbiamo applicato e asseverato
                l&apos;<span className="text-tertiary-container font-semibold">Ecobonus 65%</span>.
              </p>

              <div className="bg-surface-container rounded-lg p-2.5 flex items-center justify-between gap-2.5">
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="w-10 h-10 rounded-lg bg-secondary-container/10 flex items-center justify-center text-secondary-container shrink-0">
                    <span className="material-symbols-outlined text-2xl">picture_as_pdf</span>
                  </div>
                  <div className="min-w-0">
                    <p className="font-label-md text-label-md font-bold text-primary truncate">
                      Preventivo_ECO-2025-092.pdf
                    </p>
                    <div className="flex items-center gap-1.5 text-text-muted font-body-sm text-[11px]">
                      <span>1.8 MB</span>
                      <span>•</span>
                      <span className="text-status-success font-medium">Asseverazione ENEA &amp; APE inclusi</span>
                    </div>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => navigate("/ecobonus")}
                  className="w-8 h-8 rounded-full bg-surface-card shadow-sm flex items-center justify-center text-primary shrink-0 hover:bg-surface transition-colors"
                >
                  <span className="material-symbols-outlined text-lg">download</span>
                </button>
              </div>

              <div className="bg-surface-container-lowest rounded-xl p-3 shadow-inner space-y-2.5">
                <div className="flex items-center justify-between pb-1">
                  <div className="flex items-center gap-1.5 text-primary">
                    <span className="material-symbols-outlined text-base text-tertiary-container">
                      energy_savings_leaf
                    </span>
                    <span className="font-label-sm text-label-sm font-bold uppercase tracking-wider">
                      Prospetto Ecobonus 65%
                    </span>
                  </div>
                  <span className="px-1.5 py-0.2 rounded bg-tertiary-fixed-dim/30 text-on-tertiary-fixed-variant font-label-sm text-[10px] font-bold">
                    Detrazione IRPEF
                  </span>
                </div>
                <div className="space-y-1.5 text-body-sm">
                  <div className="flex justify-between items-center text-on-surface-variant">
                    <span>Totale Opere (IVA 10% agevolata):</span>
                    <span className="font-numeric-currency-md text-body-md font-semibold text-primary">€ 8.600,00</span>
                  </div>
                  <div className="flex justify-between items-center text-status-success">
                    <span>Detrazione Fiscale Totale (65%):</span>
                    <span className="font-numeric-currency-md text-body-md font-bold">-€ 5.590,00</span>
                  </div>
                  <div className="flex justify-between items-center text-text-muted text-[11px]">
                    <span>Rata annuale in 10 quote IRPEF:</span>
                    <span className="font-medium text-on-surface">€ 559,00 / anno</span>
                  </div>
                </div>
                <div className="bg-primary-container text-on-primary rounded-lg p-2.5 flex items-center justify-between">
                  <div>
                    <p className="font-label-sm text-[10px] text-on-primary-container uppercase tracking-wider font-semibold">
                      Costo Effettivo a Tuo Carico
                    </p>
                    <p className="font-headline-sm text-headline-sm font-bold text-secondary-fixed">€ 3.010,00</p>
                  </div>
                  <div className="text-right">
                    <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-status-success/20 text-tertiary-fixed font-label-sm text-[10px] font-bold">
                      <span className="material-symbols-outlined text-xs">trending_down</span> -45% Bolletta
                    </span>
                    <p className="font-body-sm text-[10px] text-on-primary-container mt-0.5">Da Classe F a A2</p>
                  </div>
                </div>
                <div className="space-y-1 pt-1">
                  <div className="flex items-start gap-1.5 text-[11px] text-on-surface-variant font-body-sm">
                    <span className="material-symbols-outlined text-sm text-status-success shrink-0 mt-0.5">verified</span>
                    <span>Asseverazione congruità prezzi (Prezzario DEI &amp; ENEA)</span>
                  </div>
                  <div className="flex items-start gap-1.5 text-[11px] text-on-surface-variant font-body-sm">
                    <span className="material-symbols-outlined text-sm text-status-success shrink-0 mt-0.5">verified</span>
                    <span>Pratica telematica portale ENEA &amp; APE post-operam inclusi</span>
                  </div>
                  <div className="flex items-start gap-1.5 text-[11px] text-on-surface-variant font-body-sm">
                    <span className="material-symbols-outlined text-sm text-status-success shrink-0 mt-0.5">verified</span>
                    <span>Dati bonifico parlante per detrazione generati nel PDF</span>
                  </div>
                </div>
                <div className="p-2 rounded bg-surface-container flex items-center justify-between text-xs">
                  <div className="flex items-center gap-1.5 min-w-0">
                    <span className="material-symbols-outlined text-sm text-secondary-container">draw</span>
                    <span className="truncate font-label-sm text-[11px] text-primary">
                      casalavoropro.it/sign/ECO-2025-092
                    </span>
                  </div>
                  <span className="font-label-sm text-[10px] text-secondary-container font-bold shrink-0">Firma 1-Click</span>
                </div>
              </div>

              <div className="space-y-1.5 pt-1">
                <button
                  type="button"
                  onClick={() => navigate("/confronto-fiscale")}
                  className="w-full py-2 px-3 rounded-lg bg-status-success/10 text-status-success font-label-md text-label-md flex items-center justify-center gap-1.5 active:bg-status-success/20 transition-colors font-bold"
                >
                  <span className="material-symbols-outlined text-lg">check_circle</span>
                  <span>Accetta Offerta Ecobonus 65%</span>
                </button>
                <div className="grid grid-cols-2 gap-1.5">
                  <button
                    type="button"
                    onClick={() => navigate("/ecobonus")}
                    className="py-2 px-2 rounded-lg bg-surface-container text-on-surface font-label-sm text-label-sm flex items-center justify-center gap-1 text-center truncate"
                  >
                    <span className="material-symbols-outlined text-base">description</span>
                    <span className="truncate">Schede Tecniche</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => navigate("/pratica-gse")}
                    className="py-2 px-2 rounded-lg bg-surface-container text-on-surface font-label-sm text-label-sm flex items-center justify-center gap-1 text-center truncate"
                  >
                    <span className="material-symbols-outlined text-base">support_agent</span>
                    <span className="truncate">Termotecnico</span>
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-end gap-1 text-text-muted font-body-sm text-[10px] pt-1">
                <span>11:42</span>
                <span className="material-symbols-outlined text-sm text-status-success">done_all</span>
              </div>
            </div>
          </div>
        </div>

        {/* Technical Specs Cards Overview */}
        <div className="bg-surface-card rounded-xl p-3.5 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <span className="font-label-sm text-label-sm uppercase tracking-wider text-text-muted">
              Interventi Trattati nel Template
            </span>
            <span className="font-label-sm text-label-sm text-status-success font-semibold">
              2 Componenti Certificati
            </span>
          </div>
          <div className="grid grid-cols-2 gap-2.5">
            <div className="p-2.5 rounded-lg bg-surface-container-low space-y-1.5">
              <div className="w-full h-18 rounded overflow-hidden">
                <img
                  alt="Pompa Ibrida Daikin"
                  className="w-full h-18 object-cover"
                  referrerPolicy="no-referrer"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuBdqN-UbQnqI_m2dEEH2Cnz1uB7JQiIeUbpG7_bI23D1Pbio_6uQ4hm4KoaCqgpwWww-0R6IUtzltAm1GCsEeo5OWRIEZ6H38IFaVS6MUNwSN1eFh2ZECVqbIqPRVy7ZAMGxjaVf5KAbEJRzVuAb9eRyP148XgYwFtLX_pBgmmMvHzmjlfrx5-mUaxHt4c2ZcNHaocxYmVLHbJPVvVBBYHDi80IlOeu1aoqaUt1IEin"
                />
              </div>
              <p className="font-label-md text-label-md font-bold text-primary truncate">Pompa Ibrida Daikin</p>
              <p className="font-body-sm text-[11px] text-on-surface-variant">Caldaia cond. + PdC 8kW</p>
            </div>
            <div className="p-2.5 rounded-lg bg-surface-container-low space-y-1.5">
              <div className="w-full h-18 rounded overflow-hidden">
                <img
                  alt="Infissi Triplo Vetro"
                  className="w-full h-18 object-cover"
                  referrerPolicy="no-referrer"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuC1jtocvpCTl3bLTw-KXx3wLrZKSOPFj-b_-g5L78nnru3rF_tk0j_e0uW3dsscN5WBmsfJFzXsoHzdpBOIHcr7ojWnPd5-XdGUAA68_d0kLJC1v3jSKC57euO3AxYdzuea6UZf8Cjclq50aq8NorS-8KuEk0CksexdakIb3sGEBK_IVP1t-M4WbEk5yGmRf96SkdH-fjqQKtxZOWNPL_YDVMjDrz1DKR3LeDmBHgmz"
                />
              </div>
              <p className="font-label-md text-label-md font-bold text-primary truncate">Infissi Triplo Vetro</p>
              <p className="font-body-sm text-[11px] text-on-surface-variant">Uw 0.85 W/m²K certificati</p>
            </div>
          </div>
        </div>

        {/* Bottom Dispatch Deck & Triggers */}
        <div className="bg-surface-card rounded-xl p-4 shadow-sm space-y-3">
          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-1.5 text-on-surface-variant">
              <span className="w-2 h-2 rounded-full bg-status-success animate-pulse" />
              <span className="font-body-sm text-body-sm">
                Target: <strong className="text-primary font-semibold">+39 335 882 1940</strong>
              </span>
            </div>
            <span className="text-text-muted font-label-sm text-[11px]">Canale WhatsApp API Certificato</span>
          </div>
          <button
            type="button"
            disabled={dispatchState !== "idle"}
            id="send-dispatch-btn"
            onClick={handleDispatch}
            className={`w-full h-[50px] rounded-xl text-on-secondary font-label-lg text-label-lg font-bold flex items-center justify-center gap-2 shadow-md active:scale-[0.99] transition-all ${
              dispatchState === "sent" ? "bg-status-success" : "bg-secondary-container hover:bg-secondary"
            }`}
          >
            {dispatchState === "sending" ? (
              <>
                <span className="material-symbols-outlined animate-spin text-2xl">progress_activity</span>
                <span>Invio in corso...</span>
              </>
            ) : dispatchState === "sent" ? (
              <>
                <span className="material-symbols-outlined text-2xl">check_circle</span>
                <span>Inviato con Successo!</span>
              </>
            ) : (
              <>
                <span className="material-symbols-outlined text-2xl">send</span>
                <span>Invia Adesso su WhatsApp (Ecobonus 65%)</span>
              </>
            )}
          </button>
          <div className="grid grid-cols-2 gap-2 pt-1">
            <button
              type="button"
              onClick={() => navigate("/fuori-orario")}
              className="h-11 rounded-lg bg-surface-container text-primary hover:bg-surface-container-high font-label-md text-label-md font-semibold flex items-center justify-center gap-1.5 transition-colors"
            >
              <span className="material-symbols-outlined text-lg">edit_note</span>
              <span>Modifica Testo</span>
            </button>
            <button
              type="button"
              onClick={() => navigate("/risposte-live")}
              className="h-11 rounded-lg bg-surface-container text-primary hover:bg-surface-container-high font-label-md text-label-md font-semibold flex items-center justify-center gap-1.5 transition-colors"
            >
              <span className="material-symbols-outlined text-lg">open_in_new</span>
              <span>WhatsApp Web</span>
            </button>
          </div>
        </div>
      </div>
    </StitchShell>
  );
}
