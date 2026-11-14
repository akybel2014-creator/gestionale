import { useState } from "react";
import { useNavigate } from "react-router-dom";
import StitchShell from "./StitchShell";

export default function PraticaGsePage() {
  const navigate = useNavigate();
  const [bonificoUploaded, setBonificoUploaded] = useState(false);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const showNotification = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => {
      setToastMsg((curr) => (curr === msg ? null : curr));
    }, 3500);
  };

  return (
    <StitchShell title="Whatsapp Hub" activeTab="none">
      <div className="flex flex-col w-full pb-10">
        {/* Top Action & Navigation Context */}
        <div className="flex flex-col gap-space-sm mb-4">
          <div className="flex items-center justify-between">
            <button
              className="inline-flex items-center gap-1.5 py-2 px-3 rounded-lg bg-surface-container hover:bg-surface-container-high transition-transform active:scale-95 text-on-surface"
              onClick={() => navigate("/confronto-fiscale")}
              type="button"
            >
              <span className="material-symbols-outlined text-lg">arrow_back</span>
              <span className="font-label-md text-label-md">Torna al Confronto</span>
            </button>
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-secondary-container/15 text-secondary font-label-sm text-label-sm">
              <span className="w-1.5 h-1.5 rounded-full bg-secondary-container animate-pulse" />
              {bonificoUploaded ? "Pratica Pronta • 100%" : "Bozza in Compilazione • 75%"}
            </div>
          </div>
          <div className="flex items-baseline justify-between mt-1">
            <div>
              <span className="font-label-sm text-label-sm text-text-muted uppercase tracking-wider block">
                Procedura Agevolata DM 16/02/16
              </span>
              <h2 className="font-headline-md text-headline-md text-primary font-bold">Pratica Portaltermico GSE</h2>
            </div>
            <div className="text-right">
              <span className="font-label-sm text-label-sm text-text-muted block">Codice Pratica</span>
              <span className="font-label-md text-label-md text-on-surface bg-surface-container px-2 py-0.5 rounded">
                GSE-CT2-2025-0814
              </span>
            </div>
          </div>
          {/* Progress Meter */}
          <div className="w-full bg-surface-container-high h-2 rounded-full overflow-hidden mt-1 shadow-inner">
            <div
              className="bg-secondary-container h-full rounded-full transition-all duration-500"
              style={{ width: bonificoUploaded ? "100%" : "75%" }}
            />
          </div>
        </div>

        {/* Hero Calcolo Incentivo GSE */}
        <div className="w-full bg-primary-container text-on-primary rounded-xl p-space-md shadow-md mb-4 relative overflow-hidden">
          <div className="absolute -right-6 -bottom-6 opacity-10 pointer-events-none">
            <span className="material-symbols-outlined text-[130px]">energy_savings_leaf</span>
          </div>
          <div className="flex items-center justify-between gap-2 mb-2">
            <div className="flex items-center gap-2">
              <span
                className="material-symbols-outlined text-status-success text-xl"
                style={{ fontVariationSettings: "'FILL' 1" }}
              >
                verified
              </span>
              <span className="font-label-sm text-label-sm tracking-wide uppercase text-on-primary-container">
                Conto Termico 2.0 • Intervento 2.A
              </span>
            </div>
            <span className="px-2 py-0.5 rounded bg-status-success/20 text-on-tertiary-container font-label-sm text-label-sm font-bold">
              Rata Unica ≤ €5.000
            </span>
          </div>
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 my-2">
            <div>
              <p className="font-body-sm text-body-sm text-on-primary-container">
                Contributo Diretto Stimato (Accredito GSE)
              </p>
              <div className="flex items-baseline gap-1 mt-0.5">
                <span className="font-numeric-currency-lg text-numeric-currency-lg font-bold text-on-primary">€ 4.250,00</span>
                <span className="font-label-sm text-label-sm text-on-primary-container">bonifico 60-90 gg</span>
              </div>
            </div>
            <div className="bg-primary/50 backdrop-blur-sm px-3 py-2 rounded-lg self-start sm:self-auto">
              <span className="block font-label-sm text-label-sm text-on-primary-container">IBAN Beneficiario Certificato:</span>
              <span className="font-body-sm text-body-sm text-on-primary font-mono font-medium">
                IT60 X 05428 01601 000000129841
              </span>
            </div>
          </div>
          {/* Parametri Algoritmo GSE */}
          <div className="grid grid-cols-3 gap-2 mt-3 pt-3 bg-primary/40 rounded-lg p-2.5">
            <div>
              <span className="font-label-sm text-label-sm text-on-primary-container block">Formula GSE</span>
              <span className="font-label-md text-label-md text-on-primary">I_tot = Ci × Q_u</span>
            </div>
            <div>
              <span className="font-label-sm text-label-sm text-on-primary-container block">Zona Climatica</span>
              <span className="font-label-md text-label-md text-on-primary font-semibold">Zona E (Milano)</span>
            </div>
            <div>
              <span className="font-label-sm text-label-sm text-on-primary-container block">Potenza / COP</span>
              <span className="font-label-md text-label-md text-on-primary font-semibold">8.2 kW • 4.85</span>
            </div>
          </div>
        </div>

        {/* Card Anagrafica e Cantiere */}
        <div className="bg-surface-card rounded-xl p-space-md shadow-sm mb-4">
          <div className="flex items-center justify-between pb-3 mb-3 bg-surface-container-low p-3 rounded-lg">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-secondary-container">home_repair_service</span>
              <h3 className="font-headline-sm text-headline-sm text-on-surface">Anagrafica &amp; Cantiere</h3>
            </div>
            <span className="px-2 py-0.5 rounded-full bg-status-success/15 text-status-success font-label-sm text-label-sm font-semibold flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-status-success" /> Conformità 100%
            </span>
          </div>
          <div className="flex flex-col gap-3">
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-2.5">
                <span className="material-symbols-outlined text-text-muted mt-0.5 text-xl">person</span>
                <div>
                  <span className="font-label-sm text-label-sm text-text-muted block">Beneficiario Richiedente</span>
                  <span className="font-label-lg text-label-lg text-on-surface font-semibold">Ing. Roberto Colombo</span>
                  <span className="font-body-sm text-body-sm text-text-muted block font-mono">C.F. CLMRRT68A15F205K</span>
                </div>
              </div>
              <button
                className="text-secondary hover:text-secondary/80 p-1"
                onClick={() => showNotification("Anagrafica già sincronizzata con fascicolo PRV-2025-092.")}
                title="Modifica Anagrafica"
                type="button"
              >
                <span className="material-symbols-outlined text-lg">edit</span>
              </button>
            </div>
            <div className="flex items-start gap-2.5 pt-2">
              <span className="material-symbols-outlined text-text-muted mt-0.5 text-xl">pin_drop</span>
              <div className="w-full">
                <span className="font-label-sm text-label-sm text-text-muted block">
                  Ubicazione Impianto &amp; Coordinate Catasto
                </span>
                <span className="font-body-md text-body-md text-on-surface font-medium">
                  Corso Sempione 48, 20154 Milano (MI)
                </span>
                <span className="font-body-sm text-body-sm text-text-muted block">FG 142 • P.LLA 892 • SUB 12 (Cat. A/2)</span>
              </div>
            </div>
            <div className="flex items-start gap-2.5 pt-2">
              <span className="material-symbols-outlined text-secondary-container mt-0.5 text-xl">heat_pump</span>
              <div>
                <span className="font-label-sm text-label-sm text-text-muted block">Inquadramento Tecnico</span>
                <span className="font-body-md text-body-md text-on-surface font-medium">
                  Sostituzione Generatore con Pompa di Calore Ibrida Daikin 8kW
                </span>
                <span className="font-label-sm text-label-sm text-status-success font-semibold inline-block mt-0.5">
                  Classificazione: Intervento 2.A Conto Termico
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Dati Tecnici Generatore (Accreditamento GSE) */}
        <div className="bg-surface-card rounded-xl p-space-md shadow-sm mb-4">
          <div className="flex items-center justify-between pb-3 mb-3 bg-surface-container-low p-3 rounded-lg">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-secondary-container">tune</span>
              <h3 className="font-headline-sm text-headline-sm text-on-surface">Scheda Tecnica Generatore</h3>
            </div>
            <span className="font-label-sm text-label-sm text-text-muted">Database GSE Attivo</span>
          </div>
          <div className="grid grid-cols-2 gap-3 mb-3">
            <div className="bg-surface-container-lowest p-2.5 rounded-lg shadow-sm">
              <span className="font-label-sm text-label-sm text-text-muted block">Modello Asseverato</span>
              <span className="font-label-md text-label-md text-on-surface font-bold">Daikin Altherma R Hybrid 8kW</span>
              <span className="font-body-sm text-body-sm text-status-success block">Catalogo GSE N° 441098</span>
            </div>
            <div className="bg-surface-container-lowest p-2.5 rounded-lg shadow-sm">
              <span className="font-label-sm text-label-sm text-text-muted block">Numero di Matricola</span>
              <span className="font-label-md text-label-md text-on-surface font-mono font-bold">DK-2024-998124-E</span>
              <span className="font-body-sm text-body-sm text-text-muted block">Verifica O.E. Superata</span>
            </div>
            <div className="bg-surface-container-lowest p-2.5 rounded-lg shadow-sm">
              <span className="font-label-sm text-label-sm text-text-muted block">PDR / Codice POD</span>
              <span className="font-label-md text-label-md text-on-surface font-mono font-bold">IT001E12345678</span>
              <span className="font-body-sm text-body-sm text-text-muted block">Utenza Residenziale</span>
            </div>
            <div className="bg-surface-container-lowest p-2.5 rounded-lg shadow-sm">
              <span className="font-label-sm text-label-sm text-text-muted block">Impianto Sostituito</span>
              <span className="font-label-md text-label-md text-on-surface font-bold">Caldaia Standard 24kW</span>
              <span className="font-body-sm text-body-sm text-secondary block font-medium">Dismesso con FIR</span>
            </div>
          </div>
          {/* Visual Proof Showcase */}
          <div className="grid grid-cols-2 gap-2 mt-2">
            <div className="relative rounded-lg overflow-hidden h-24 bg-surface-container-high group">
              <img
                alt="Targhetta Nuovo Daikin"
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuAV_T3BnDHd9ZIsy-8adFTm0iJcBz2_qBOBu-wSU9pqfCyMo0tP4o2TMqX1LqbZ9ovadFuiR3fhc8Dwrlsv_9jl56mAldJG43ArYR-jQUrFXcFaTRNFHciuWZV9ulPLk-dtzFMVEehV_HiRRbbysulIM1lZVJdw6FmlTnhce5LUQOTNsj5AtZwn2P86Tl1HQG-zQvnc6UBha2ML6s0-FeVF2ZqdsYleDs1fEk7p5-QL"
              />
              <div className="absolute inset-0 bg-primary/40 flex flex-col justify-end p-1.5">
                <span className="font-label-sm text-label-sm text-on-primary flex items-center gap-1 font-semibold">
                  <span
                    className="material-symbols-outlined text-xs text-status-success"
                    style={{ fontVariationSettings: "'FILL' 1" }}
                  >
                    check_circle
                  </span>
                  Targhetta Nuovo Daikin
                </span>
                <span className="text-[10px] text-on-primary-container leading-none">GEO: 45.4782N, 9.1678E</span>
              </div>
            </div>
            <div className="relative rounded-lg overflow-hidden h-24 bg-surface-container-high group">
              <img
                alt="Generatore Dismesso"
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuAjBcY2cDWumaDq1LRCCcw0G5N5MUlozPUrtqYp1SeIi7hXex2puuQlBoTkPX3w3xvAVO0qXK3ukjcJh-4-5BPzIOehHtn5_qbFBfyC_8HAh1OT-2y4b1a9ws9buJ_xUHr92uy51q68AYjH4128x5BZer_VVLNE4NsDI5mUkGJlaxx4dduFOxV70hpCsez9IXYa3eTOHzxjcUOsc2E6_jzSZV_2CE1hlKRVrjw3TZhj"
              />
              <div className="absolute inset-0 bg-primary/40 flex flex-col justify-end p-1.5">
                <span className="font-label-sm text-label-sm text-on-primary flex items-center gap-1 font-semibold">
                  <span
                    className="material-symbols-outlined text-xs text-status-success"
                    style={{ fontVariationSettings: "'FILL' 1" }}
                  >
                    check_circle
                  </span>
                  Generatore Dismesso
                </span>
                <span className="text-[10px] text-on-primary-container leading-none">Rottamazione certificata</span>
              </div>
            </div>
          </div>
        </div>

        {/* Checklist Documentale GSE (Upload & Verifica) */}
        <div className="bg-surface-card rounded-xl p-space-md shadow-sm mb-4">
          <div className="flex items-center justify-between pb-3 mb-2 bg-surface-container-low p-3 rounded-lg">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-secondary-container">folder_check</span>
              <h3 className="font-headline-sm text-headline-sm text-on-surface">Documenti Obbligatori GSE</h3>
            </div>
            <span
              className={`font-label-sm text-label-sm font-bold px-2 py-0.5 rounded-full ${
                bonificoUploaded
                  ? "text-status-success bg-status-success/15"
                  : "text-status-warning bg-status-warning/15"
              }`}
            >
              {bonificoUploaded ? "5 su 5 Approvati" : "4 su 5 Approvati"}
            </span>
          </div>
          <div className="flex flex-col gap-2.5">
            {/* Item 1: FIR Generatore */}
            <div className="flex items-center justify-between p-3 rounded-lg bg-surface-container-lowest shadow-sm">
              <div className="flex items-center gap-3 min-w-0 pr-2">
                <div className="w-8 h-8 rounded-full bg-status-success/15 flex items-center justify-center shrink-0">
                  <span
                    className="material-symbols-outlined text-status-success text-lg"
                    style={{ fontVariationSettings: "'FILL' 1" }}
                  >
                    check_circle
                  </span>
                </div>
                <div className="truncate">
                  <span className="font-label-md text-label-md text-on-surface block truncate">
                    Formulario Rifiuti (FIR) Smaltimento
                  </span>
                  <span className="font-body-sm text-body-sm text-text-muted">FIR_smaltimento_caldaia_sig.pdf (1.4 MB)</span>
                </div>
              </div>
              <button
                className="shrink-0 p-2 text-primary hover:bg-surface-container rounded-lg"
                onClick={() => showNotification("Anteprima FIR_smaltimento_caldaia_sig.pdf verificata.")}
                title="Visualizza Documento"
                type="button"
              >
                <span className="material-symbols-outlined text-lg">visibility</span>
              </button>
            </div>
            {/* Item 2: Scheda Tecnica */}
            <div className="flex items-center justify-between p-3 rounded-lg bg-surface-container-lowest shadow-sm">
              <div className="flex items-center gap-3 min-w-0 pr-2">
                <div className="w-8 h-8 rounded-full bg-status-success/15 flex items-center justify-center shrink-0">
                  <span
                    className="material-symbols-outlined text-status-success text-lg"
                    style={{ fontVariationSettings: "'FILL' 1" }}
                  >
                    check_circle
                  </span>
                </div>
                <div className="truncate">
                  <span className="font-label-md text-label-md text-on-surface block truncate">
                    Scheda Asseverata Produttore Daikin
                  </span>
                  <span className="font-body-sm text-body-sm text-text-muted">Conforme D.M. 16/02/16 • COP 4.85</span>
                </div>
              </div>
              <button
                className="shrink-0 p-2 text-primary hover:bg-surface-container rounded-lg"
                onClick={() => showNotification("Scheda Asseverata Produttore Daikin valida per GSE.")}
                title="Visualizza Documento"
                type="button"
              >
                <span className="material-symbols-outlined text-lg">visibility</span>
              </button>
            </div>
            {/* Item 3: Fattura Elettronica */}
            <div className="flex items-center justify-between p-3 rounded-lg bg-surface-container-lowest shadow-sm">
              <div className="flex items-center gap-3 min-w-0 pr-2">
                <div className="w-8 h-8 rounded-full bg-status-success/15 flex items-center justify-center shrink-0">
                  <span
                    className="material-symbols-outlined text-status-success text-lg"
                    style={{ fontVariationSettings: "'FILL' 1" }}
                  >
                    check_circle
                  </span>
                </div>
                <div className="truncate">
                  <span className="font-label-md text-label-md text-on-surface block truncate">
                    Fattura Elettronica Fornitura e Posa
                  </span>
                  <span className="font-body-sm text-body-sm text-text-muted">Fatt. 2025/089 • Tot. € 11.957,00 iva inc.</span>
                </div>
              </div>
              <button
                className="shrink-0 p-2 text-primary hover:bg-surface-container rounded-lg"
                onClick={() => showNotification("Fattura elettronica SDI 2025/089 verificata.")}
                title="Visualizza Documento"
                type="button"
              >
                <span className="material-symbols-outlined text-lg">visibility</span>
              </button>
            </div>
            {/* Item 4: Bonifico (Action Needed) */}
            <div
              className={`flex items-center justify-between p-3 rounded-lg shadow-sm ${
                bonificoUploaded ? "bg-surface-container-lowest" : "bg-status-warning/10"
              }`}
            >
              <div className="flex items-center gap-3 min-w-0 pr-2">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                    bonificoUploaded ? "bg-status-success/15" : "bg-status-warning/20"
                  }`}
                >
                  <span
                    className={`material-symbols-outlined text-lg ${
                      bonificoUploaded ? "text-status-success" : "text-status-warning"
                    }`}
                    style={bonificoUploaded ? { fontVariationSettings: "'FILL' 1" } : undefined}
                  >
                    {bonificoUploaded ? "check_circle" : "warning"}
                  </span>
                </div>
                <div className="truncate">
                  <span className="font-label-md text-label-md text-on-surface block font-bold truncate">
                    Distinta Bonifico GSE / Bancario con CRO
                  </span>
                  <span
                    className={`font-body-sm text-body-sm font-medium ${
                      bonificoUploaded ? "text-status-success" : "text-status-danger"
                    }`}
                  >
                    {bonificoUploaded ? "CRO 88920144510 verificato • OK" : "Manca ricevuta contabile pagata"}
                  </span>
                </div>
              </div>
              {bonificoUploaded ? (
                <button
                  className="shrink-0 p-2 text-primary hover:bg-surface-container rounded-lg"
                  onClick={() => showNotification("Distinta Bonifico con CRO acquisita.")}
                  title="Visualizza Documento"
                  type="button"
                >
                  <span className="material-symbols-outlined text-lg">visibility</span>
                </button>
              ) : (
                <button
                  className="shrink-0 px-3 py-1.5 rounded-lg bg-secondary-container text-on-secondary font-label-sm text-label-sm font-semibold flex items-center gap-1 active:scale-95 transition-transform shadow-sm"
                  id="uploadTriggerBtn"
                  onClick={() => {
                    setBonificoUploaded(true);
                    showNotification("Distinta bonifico CRO acquisita! Pratica pronta per l'invio GSE.");
                  }}
                  type="button"
                >
                  <span className="material-symbols-outlined text-base">upload_file</span>
                  Carica
                </button>
              )}
            </div>
            {/* Item 5: Rilievo Fotografico GEO-tag */}
            <div className="flex items-center justify-between p-3 rounded-lg bg-surface-container-lowest shadow-sm">
              <div className="flex items-center gap-3 min-w-0 pr-2">
                <div className="w-8 h-8 rounded-full bg-status-success/15 flex items-center justify-center shrink-0">
                  <span
                    className="material-symbols-outlined text-status-success text-lg"
                    style={{ fontVariationSettings: "'FILL' 1" }}
                  >
                    check_circle
                  </span>
                </div>
                <div className="truncate">
                  <span className="font-label-md text-label-md text-on-surface block truncate">
                    Documentazione Fotografica GEO-Tag
                  </span>
                  <span className="font-body-sm text-body-sm text-text-muted">4 Scatti certificati (Milano, Sempione)</span>
                </div>
              </div>
              <button
                className="shrink-0 p-2 text-primary hover:bg-surface-container rounded-lg"
                onClick={() => showNotification("4 foto geolocalizzate verificate (45.4782N, 9.1678E).")}
                title="Visualizza Galleria"
                type="button"
              >
                <span className="material-symbols-outlined text-lg">photo_library</span>
              </button>
            </div>
          </div>
        </div>

        {/* Operational Dispatch & Transmission Buttons */}
        <div className="flex flex-col gap-3 mt-2">
          {/* Primary CTA: Submit to GSE */}
          <button
            className="w-full h-[52px] rounded-xl bg-secondary-container hover:bg-secondary text-on-secondary flex items-center justify-center gap-2 font-label-lg text-label-lg font-bold shadow-md transition-all active:scale-[0.98]"
            id="submitGseBtn"
            onClick={() => {
              if (!bonificoUploaded) {
                showNotification("Verifica parametri GSE: completa prima il caricamento del bonifico!");
              } else {
                showNotification("Trasmissione al Portaltermico GSE completata!");
                setTimeout(() => navigate("/ricevuta-gse"), 800);
              }
            }}
            type="button"
          >
            <span className="material-symbols-outlined text-2xl">send_and_archive</span>
            <span>Convalida e Invia su Portaltermico GSE</span>
          </button>
          {/* Secondary: PDF Package Export */}
          <button
            className="w-full h-12 rounded-xl bg-surface-container hover:bg-surface-container-high text-primary flex items-center justify-center gap-2 font-label-md text-label-md font-semibold transition-all active:scale-[0.98]"
            onClick={() => navigate("/ricevuta-gse")}
            type="button"
          >
            <span className="material-symbols-outlined text-xl">picture_as_pdf</span>
            <span>Scarica Fascicolo PDF Certificato GSE</span>
          </button>
          {/* Shortcut: Direct Client Update on WhatsApp */}
          <button
            className="w-full h-12 rounded-xl bg-[#25D366] hover:bg-[#20ba5a] text-surface-card flex items-center justify-center gap-2 font-label-md text-label-md font-bold transition-all shadow-sm active:scale-[0.98]"
            id="whatsappShortcutBtn"
            onClick={() => {
              showNotification("Apertura istruttoria & notifica WhatsApp a Ing. Colombo...");
              setTimeout(() => navigate("/istruttoria-gse"), 800);
            }}
            type="button"
          >
            <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
              <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.582 2.128 2.182-.573c.978.58 1.911.928 3.149.929 3.182 0 5.767-2.587 5.768-5.766 0-3.18-2.586-5.771-5.768-5.771zm3.392 8.244c-.144.405-.837.774-1.17.824-.312.045-.634.055-1.92-.477-1.528-.632-2.511-2.18-2.587-2.282-.075-.101-.622-.828-.622-1.58 0-.753.394-1.123.534-1.272.14-.149.307-.186.409-.186.103 0 .205.002.296.006.096.005.225-.037.352.269.13.313.444 1.082.483 1.161.039.079.065.172.013.275-.052.102-.078.166-.155.257-.078.092-.163.205-.233.276-.078.077-.16.161-.069.317.091.156.404.667.868 1.079.597.531 1.101.696 1.257.773.156.078.247.065.338-.039.091-.104.39-.455.494-.61.104-.156.208-.13.351-.078.143.052.91.429 1.066.507.156.078.26.117.299.182.039.065.039.378-.105.783z" />
            </svg>
            <span>Invia Stato Pratica al Cliente su WhatsApp</span>
          </button>
        </div>

        {/* Micro Interaction Notification Toast */}
        <div
          className={`fixed bottom-20 left-4 right-4 bg-primary text-on-primary p-3 rounded-xl shadow-2xl flex items-center justify-between gap-3 transform transition-all duration-300 z-50 ${
            toastMsg ? "translate-y-0 opacity-100" : "translate-y-32 opacity-0 pointer-events-none"
          }`}
          id="liveFeedbackToast"
        >
          <div className="flex items-center gap-2.5">
            <span className="material-symbols-outlined text-secondary-container">cloud_sync</span>
            <span className="font-body-sm text-body-sm font-medium" id="liveFeedbackText">
              {toastMsg ?? "Aggiornamento in corso..."}
            </span>
          </div>
          <button
            className="material-symbols-outlined text-sm opacity-60 hover:opacity-100"
            onClick={() => setToastMsg(null)}
            type="button"
          >
            close
          </button>
        </div>
      </div>
    </StitchShell>
  );
}
