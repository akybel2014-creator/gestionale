import React, { useRef, useState } from "react";
import { Link } from "react-router-dom";
import StitchShell from "./StitchShell";

type ModeKey = "standard" | "sos" | "ferie";

const TEMPLATES: Record<ModeKey, string> = {
  standard:
    "Gentile {Nome_Cliente}, lo studio tecnico CasaLavoroPRO è attualmente chiuso. Il nostro orario operativo è Lun-Ven 8:30-18:30. Abbiamo registrato la tua richiesta relativa a {Pratica_O_Preventivo}. Per guasti o urgenze bloccanti di cantiere, digita *URGENTE* o visita la linea emergenze {Link_Urgenza}.",
  sos: "⚠️ REPERIBILITÀ CANTIERE CasaLavoroPRO: Gent. {Nome_Cliente}, il nostro ufficio riaprirà alle {Ora_Riapertura}. Per emergenze idrauliche o blocco impianto digita subito *URGENTE*. Reperibilità cantiere: {Link_Urgenza}.",
  ferie:
    "☀️ Chiusura Estiva CasaLavoroPRO: Gent. {Nome_Cliente}, siamo chiusi per pausa ferie fino al 26 Agosto. La tua richiesta per {Pratica_O_Preventivo} è presa in carico. Per urgenze cantiere in corso usa il link: {Link_Urgenza}.",
};

function renderWhatsAppPreview(raw: string): React.ReactNode[] {
  const parts = raw.split(
    /(\{Nome_Cliente\}|\{Ora_Riapertura\}|\{Pratica_O_Preventivo\}|\{Link_Urgenza\}|\*[^*]+\*)/g
  );
  return parts.map((part, idx) => {
    if (part === "{Nome_Cliente}") {
      return (
        <strong key={idx} className="text-on-surface">
          Mario Rossi
        </strong>
      );
    }
    if (part === "{Ora_Riapertura}") {
      return (
        <strong key={idx} className="text-on-surface">
          domani alle 08:30
        </strong>
      );
    }
    if (part === "{Pratica_O_Preventivo}") {
      return (
        <strong key={idx} className="text-on-surface">
          Prev. #2024-88A (Termocamino)
        </strong>
      );
    }
    if (part === "{Link_Urgenza}") {
      return (
        <span key={idx} className="text-[#027EB5] underline">
          sos.casalavoro.pro/c/88a
        </span>
      );
    }
    if (part.startsWith("*") && part.endsWith("*") && part.length > 2) {
      return (
        <span key={idx} className="font-bold">
          {part}
        </span>
      );
    }
    return <span key={idx}>{part}</span>;
  });
}

export default function FuoriOrarioFeriePage() {
  const [masterActive, setMasterActive] = useState(true);
  const [mode, setMode] = useState<ModeKey>("standard");
  const [templateText, setTemplateText] = useState(TEMPLATES.standard);
  const [foremanRep, setForemanRep] = useState(true);
  const [ruleFreq, setRuleFreq] = useState(true);
  const [ruleGse, setRuleGse] = useState(true);
  const [ruleSuppliers, setRuleSuppliers] = useState(true);
  const [rulePushSos, setRulePushSos] = useState(true);
  const [toastMsg, setToastMsg] = useState<string | null>(null);
  const editorRef = useRef<HTMLTextAreaElement | null>(null);

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => {
      setToastMsg((curr) => (curr === msg ? null : curr));
    }, 3500);
  };

  const insertTag = (tag: string) => {
    const el = editorRef.current;
    if (!el) {
      setTemplateText((prev) => prev + tag);
      return;
    }
    const start = el.selectionStart ?? templateText.length;
    const end = el.selectionEnd ?? templateText.length;
    const next = templateText.substring(0, start) + tag + templateText.substring(end);
    setTemplateText(next);
    setTimeout(() => {
      el.focus();
      el.selectionStart = el.selectionEnd = start + tag.length;
    }, 0);
  };

  const selectMode = (nextMode: ModeKey) => {
    setMode(nextMode);
    setTemplateText(TEMPLATES[nextMode]);
  };

  return (
    <StitchShell title="Whatsapp Hub" activeTab="none">
      <div className="flex flex-col w-full pb-8">
        {/* Top Navigation & Action Context */}
        <div className="flex items-center justify-between py-2 mb-3">
          <Link
            to="/whatsapp"
            className="inline-flex items-center gap-1.5 text-on-surface-variant hover:text-on-surface transition-colors py-1.5 px-2 rounded-lg bg-surface-container-low"
          >
            <span className="material-symbols-outlined text-lg">arrow_back</span>
            <span className="font-label-md text-label-md">WhatsApp Hub</span>
          </Link>
          <div className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-surface-container-high text-on-surface-variant font-label-sm text-label-sm">
            <span className="material-symbols-outlined text-sm">schedule</span>
            <span>CET Rome (+01:00)</span>
          </div>
        </div>

        {/* Title & Context Description */}
        <div className="mb-4">
          <h2 className="font-headline-md text-headline-md text-on-surface tracking-tight">
            Risposte Fuori Orario &amp; Ferie
          </h2>
          <p className="font-body-sm text-body-sm text-text-muted mt-0.5">
            Automazione WhatsApp Business per orari di chiusura cantiere, festivi e reperibilità d&apos;urgenza.
          </p>
        </div>

        {/* Master Switch Card */}
        <div className="relative overflow-hidden rounded-xl bg-surface-card p-4 shadow-sm mb-4">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-tertiary-container/10 flex items-center justify-center text-on-tertiary-container shrink-0">
                <span className="material-symbols-outlined text-2xl" style={{ fontVariationSettings: "'FILL' 1" }}>
                  forward_to_inbox
                </span>
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-headline-sm text-headline-sm text-on-surface">Risponditore Fuori Orario</span>
                  <span
                    className={
                      masterActive
                        ? "px-2 py-0.5 rounded-full bg-status-success/15 text-status-success font-label-sm text-label-sm font-bold uppercase tracking-wider"
                        : "px-2 py-0.5 rounded-full bg-surface-container-highest text-on-surface-variant font-label-sm text-label-sm font-bold uppercase tracking-wider"
                    }
                    id="masterBadge"
                  >
                    {masterActive ? "Attivo" : "In Pausa"}
                  </span>
                </div>
                <p className="font-body-sm text-body-sm text-text-muted mt-0.5">
                  Prossima attivazione: <strong className="text-on-surface font-label-md">Oggi alle 18:30</strong> (Fine turno)
                </p>
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer shrink-0 mt-1">
              <input
                checked={masterActive}
                className="sr-only peer"
                id="masterToggle"
                onChange={(e) => {
                  const checked = e.target.checked;
                  setMasterActive(checked);
                  showToast(
                    checked ? "Automazione WhatsApp Fuori Orario abilitata." : "Automazione WhatsApp messa in pausa."
                  );
                }}
                type="checkbox"
              />
              <div className="w-12 h-7 bg-surface-container-highest peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-status-success" />
            </label>
          </div>
          {/* Live Status strip */}
          <div className="mt-3.5 pt-3 flex items-center justify-between bg-surface-container-low rounded-lg p-2.5">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-status-success animate-ping" />
              <span className="font-label-sm text-label-sm text-on-surface">Canale WhatsApp Business Cloud API</span>
            </div>
            <span className="font-label-sm text-label-sm text-text-muted">Quota invii: 94/1000 msg</span>
          </div>
        </div>

        {/* Weekly Timetable Card */}
        <div className="rounded-xl bg-surface-card p-4 shadow-sm mb-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-secondary-container">calendar_clock</span>
              <h3 className="font-headline-sm text-headline-sm text-on-surface">Orari Operativi &amp; Reperibilità</h3>
            </div>
            <button
              className="font-label-sm text-label-sm text-secondary-container font-semibold hover:underline"
              onClick={() => showToast("Orari settimanali studio sincronizzati.")}
              type="button"
            >
              Modifica Orari
            </button>
          </div>
          <div className="space-y-2">
            {/* Lun-Ven */}
            <div className="flex items-center justify-between p-2.5 rounded-lg bg-surface-container-low">
              <div className="flex items-center gap-2.5">
                <span className="w-7 h-7 rounded-md bg-surface-container flex items-center justify-center font-label-sm text-label-sm text-on-surface font-bold">
                  L-V
                </span>
                <div>
                  <span className="font-label-md text-label-md text-on-surface block">Lunedì – Venerdì</span>
                  <span className="font-body-sm text-body-sm text-text-muted">Presidio telefonico &amp; preventivazione</span>
                </div>
              </div>
              <div className="text-right">
                <span className="font-label-md text-label-md text-on-surface font-semibold">08:30 – 18:30</span>
                <span className="block font-label-sm text-label-sm text-text-muted">Auto-reply: 18:30–08:30</span>
              </div>
            </div>
            {/* Sabato */}
            <div className="flex items-center justify-between p-2.5 rounded-lg bg-surface-container-low">
              <div className="flex items-center gap-2.5">
                <span className="w-7 h-7 rounded-md bg-surface-container flex items-center justify-center font-label-sm text-label-sm text-on-surface font-bold">
                  SAB
                </span>
                <div>
                  <span className="font-label-md text-label-md text-on-surface block">Sabato</span>
                  <span className="font-body-sm text-body-sm text-status-warning font-semibold">Solo Urgenze Cantiere</span>
                </div>
              </div>
              <div className="text-right">
                <span className="font-label-md text-label-md text-on-surface font-semibold">08:30 – 12:30</span>
                <span className="block font-label-sm text-label-sm text-text-muted">Pomeriggio: Fuori Orario</span>
              </div>
            </div>
            {/* Domenica & Festivi */}
            <div className="flex items-center justify-between p-2.5 rounded-lg bg-surface-container-low">
              <div className="flex items-center gap-2.5">
                <span className="w-7 h-7 rounded-md bg-surface-container-high flex items-center justify-center font-label-sm text-label-sm text-on-surface-variant font-bold">
                  DOM
                </span>
                <div>
                  <span className="font-label-md text-label-md text-on-surface block">Domenica &amp; Festivi Nazionali</span>
                  <span className="font-body-sm text-body-sm text-text-muted">Studio interamente chiuso</span>
                </div>
              </div>
              <div className="text-right">
                <span className="px-2 py-0.5 rounded bg-surface-variant text-on-surface-variant font-label-sm text-label-sm font-bold uppercase">
                  24h Chiuso
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Automation Strategy Pill Selector */}
        <div className="rounded-xl bg-surface-card p-4 shadow-sm mb-4">
          <div className="flex items-center gap-2 mb-2">
            <span className="material-symbols-outlined text-secondary-container">tune</span>
            <h3 className="font-headline-sm text-headline-sm text-on-surface">Modalità di Risposta</h3>
          </div>
          <p className="font-body-sm text-body-sm text-text-muted mb-3">
            Seleziona come il bot deve accogliere i clienti fuori orario lavorativo.
          </p>
          <div className="grid grid-cols-1 gap-2" id="modeSelector">
            {/* Mode 1 */}
            <button
              className={
                mode === "standard"
                  ? "mode-btn text-left p-3 rounded-xl bg-primary-container text-on-primary flex items-start gap-3 transition-transform active:scale-[0.99]"
                  : "mode-btn text-left p-3 rounded-xl bg-surface-container-low text-on-surface hover:bg-surface-container flex items-start gap-3 transition-transform active:scale-[0.99]"
              }
              onClick={() => selectMode("standard")}
              type="button"
            >
              <span
                className={
                  mode === "standard"
                    ? "material-symbols-outlined text-secondary-container shrink-0 mt-0.5"
                    : "material-symbols-outlined text-text-muted shrink-0 mt-0.5"
                }
                style={mode === "standard" ? { fontVariationSettings: "'FILL' 1" } : undefined}
              >
                {mode === "standard" ? "check_circle" : "radio_button_unchecked"}
              </span>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <span className="font-label-lg text-label-lg font-bold">Standard Gentile (Studio Chiuso)</span>
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-secondary-container text-on-secondary">
                    Default
                  </span>
                </div>
                <p
                  className={`font-body-sm text-body-sm mt-1 ${
                    mode === "standard" ? "text-on-primary-container" : "text-text-muted"
                  }`}
                >
                  Conferma ricezione messaggio, orari di riapertura ed esclude spam reiterato.
                </p>
              </div>
            </button>
            {/* Mode 2 */}
            <button
              className={
                mode === "sos"
                  ? "mode-btn text-left p-3 rounded-xl bg-primary-container text-on-primary flex items-start gap-3 transition-transform active:scale-[0.99]"
                  : "mode-btn text-left p-3 rounded-xl bg-surface-container-low text-on-surface hover:bg-surface-container flex items-start gap-3 transition-transform active:scale-[0.99]"
              }
              onClick={() => selectMode("sos")}
              type="button"
            >
              <span
                className={
                  mode === "sos"
                    ? "material-symbols-outlined text-secondary-container shrink-0 mt-0.5"
                    : "material-symbols-outlined text-text-muted shrink-0 mt-0.5"
                }
                style={mode === "sos" ? { fontVariationSettings: "'FILL' 1" } : undefined}
              >
                {mode === "sos" ? "check_circle" : "radio_button_unchecked"}
              </span>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <span className="font-label-lg text-label-lg font-bold">Triage Urgenze Cantiere (Filtro SOS)</span>
                  <span className="text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded bg-error-container text-on-error-container">
                    Guasti
                  </span>
                </div>
                <p
                  className={`font-body-sm text-body-sm mt-1 ${
                    mode === "sos" ? "text-on-primary-container" : "text-text-muted"
                  }`}
                >
                  Richiede parola chiave *URGENTE* per allagamenti o blocchi caldaia/pompa di calore.
                </p>
              </div>
            </button>
            {/* Mode 3 */}
            <button
              className={
                mode === "ferie"
                  ? "mode-btn text-left p-3 rounded-xl bg-primary-container text-on-primary flex items-start gap-3 transition-transform active:scale-[0.99]"
                  : "mode-btn text-left p-3 rounded-xl bg-surface-container-low text-on-surface hover:bg-surface-container flex items-start gap-3 transition-transform active:scale-[0.99]"
              }
              onClick={() => selectMode("ferie")}
              type="button"
            >
              <span
                className={
                  mode === "ferie"
                    ? "material-symbols-outlined text-secondary-container shrink-0 mt-0.5"
                    : "material-symbols-outlined text-text-muted shrink-0 mt-0.5"
                }
                style={mode === "ferie" ? { fontVariationSettings: "'FILL' 1" } : undefined}
              >
                {mode === "ferie" ? "check_circle" : "radio_button_unchecked"}
              </span>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <span className="font-label-lg text-label-lg font-bold">Ferie &amp; Ponti / Chiusura Estiva</span>
                  <span className="text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded bg-surface-variant text-on-surface-variant">
                    Pianificato
                  </span>
                </div>
                <p
                  className={`font-body-sm text-body-sm mt-1 ${
                    mode === "ferie" ? "text-on-primary-container" : "text-text-muted"
                  }`}
                >
                  Imposta data di rientro cantiere e reindirizza alle emergenze solo per clienti contrattualizzati.
                </p>
              </div>
            </button>
          </div>
        </div>

        {/* Template Editor & Live Preview */}
        <div className="rounded-xl bg-surface-card p-4 shadow-sm mb-4">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-status-success">chat</span>
              <h3 className="font-headline-sm text-headline-sm text-on-surface">Template Messaggio WhatsApp</h3>
            </div>
            <span className="font-label-sm text-label-sm text-status-success font-semibold flex items-center gap-1">
              <span className="material-symbols-outlined text-sm">verified</span> Formato Ufficiale
            </span>
          </div>
          <p className="font-body-sm text-body-sm text-text-muted mb-2">
            Tocca le variabili intelligenti per inserirle direttamente nel corpo della risposta:
          </p>
          {/* Dynamic Variables Tag Pills */}
          <div className="flex flex-wrap gap-1.5 mb-3">
            <button
              className="insert-tag px-2.5 py-1 rounded-md bg-surface-container hover:bg-surface-container-high text-on-surface font-label-sm text-label-sm transition-colors active:scale-95"
              onClick={() => insertTag("{Nome_Cliente}")}
              type="button"
            >
              + {"{Nome_Cliente}"}
            </button>
            <button
              className="insert-tag px-2.5 py-1 rounded-md bg-surface-container hover:bg-surface-container-high text-on-surface font-label-sm text-label-sm transition-colors active:scale-95"
              onClick={() => insertTag("{Ora_Riapertura}")}
              type="button"
            >
              + {"{Ora_Riapertura}"}
            </button>
            <button
              className="insert-tag px-2.5 py-1 rounded-md bg-surface-container hover:bg-surface-container-high text-on-surface font-label-sm text-label-sm transition-colors active:scale-95"
              onClick={() => insertTag("{Pratica_O_Preventivo}")}
              type="button"
            >
              + {"{Pratica_O_Preventivo}"}
            </button>
            <button
              className="insert-tag px-2.5 py-1 rounded-md bg-secondary/10 hover:bg-secondary/20 text-secondary font-label-sm text-label-sm transition-colors active:scale-95 font-bold"
              onClick={() => insertTag("{Link_Urgenza}")}
              type="button"
            >
              + {"{Link_Urgenza}"}
            </button>
          </div>
          {/* Textarea Input Area */}
          <div className="relative mb-3">
            <textarea
              ref={editorRef}
              className="w-full rounded-lg bg-surface-container-low p-3 font-body-md text-body-md text-on-surface focus:outline-none focus:bg-surface-card transition-colors resize-none"
              id="templateEditor"
              onChange={(e) => setTemplateText(e.target.value)}
              rows={5}
              value={templateText}
            />
            <div className="flex items-center justify-between text-text-muted font-label-sm text-label-sm mt-1 px-1">
              <span>Variabili rilevate: 4/4 valide</span>
              <span id="charCount">{templateText.length} caratteri</span>
            </div>
          </div>
          {/* Live Preview Balloon Card */}
          <div className="rounded-xl bg-[#EFEAE2] p-3.5 mb-3 shadow-inner">
            <div className="flex items-center justify-between mb-2">
              <span className="font-label-sm text-label-sm text-[#54656F] uppercase tracking-wider font-bold flex items-center gap-1">
                <span className="material-symbols-outlined text-sm">visibility</span> Anteprima Utente WhatsApp
              </span>
              <span className="text-[11px] font-body-sm text-[#667781]">Oggi, 19:42</span>
            </div>
            {/* Bubble Message */}
            <div className="max-w-[92%] rounded-xl rounded-tl-none bg-[#DCF8C6] text-[#111B21] p-3 shadow-sm relative">
              <span className="block text-[11px] font-bold text-on-tertiary-container mb-0.5">
                CasaLavoroPRO • Assistenza Clienti
              </span>
              <p className="font-body-md text-body-md leading-relaxed whitespace-pre-wrap" id="livePreviewText">
                {renderWhatsAppPreview(templateText)}
              </p>
              <div className="flex items-center justify-end gap-1 mt-1 text-[10px] text-[#667781]">
                <span>19:42</span>
                <span className="material-symbols-outlined text-[13px] text-[#53BDEB]">done_all</span>
              </div>
            </div>
          </div>
          {/* Foreman Reperibility toggle option */}
          <div className="p-3 rounded-lg bg-surface-container-low flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-surface-container-high flex items-center justify-center text-on-surface-variant">
                <span className="material-symbols-outlined text-lg">engineering</span>
              </div>
              <div>
                <span className="font-label-md text-label-md text-on-surface block">Reperibilità Capocantiere</span>
                <span className="font-body-sm text-body-sm text-text-muted">Includi contatto rapido: +39 340 ••••881</span>
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                checked={foremanRep}
                className="sr-only peer"
                onChange={(e) => setForemanRep(e.target.checked)}
                type="checkbox"
              />
              <div className="w-10 h-6 bg-surface-container-highest peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-secondary-container" />
            </label>
          </div>
        </div>

        {/* Anti-Disturb Rules & Smart Filters */}
        <div className="rounded-xl bg-surface-card p-4 shadow-sm mb-5">
          <div className="flex items-center gap-2 mb-1">
            <span className="material-symbols-outlined text-secondary">security</span>
            <h3 className="font-headline-sm text-headline-sm text-on-surface">Regole Anti-Disturbo &amp; Filtri Avanzati</h3>
          </div>
          <p className="font-body-sm text-body-sm text-text-muted mb-3">
            Evita loop infiniti di risposta, rispetta i contratti e proteggi il riposo del team.
          </p>
          <div className="space-y-3">
            {/* Rule 1 */}
            <div className="p-3 rounded-lg bg-surface-container-low flex items-start justify-between gap-3">
              <div className="flex-1">
                <div className="flex items-center gap-1.5">
                  <span className="font-label-md text-label-md text-on-surface">Frequenza di invio (Anti-Spam)</span>
                  <span className="px-1.5 py-0.2 rounded bg-surface-container text-on-surface-variant text-[10px] font-bold">
                    24 ORE
                  </span>
                </div>
                <p className="font-body-sm text-body-sm text-text-muted mt-0.5">
                  Invia massimo 1 volta ogni 24 ore allo stesso interlocutore, anche se scrive più messaggi ravvicinati.
                </p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer shrink-0 mt-0.5">
                <input checked={ruleFreq} className="sr-only peer" onChange={(e) => setRuleFreq(e.target.checked)} type="checkbox" />
                <div className="w-10 h-6 bg-surface-container-highest peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-status-success" />
              </label>
            </div>
            {/* Rule 2 */}
            <div className="p-3 rounded-lg bg-surface-container-low flex items-start justify-between gap-3">
              <div className="flex-1">
                <div className="flex items-center gap-1.5">
                  <span className="font-label-md text-label-md text-on-surface">Eccezione Pratiche GSE Critiche</span>
                  <span className="px-1.5 py-0.2 rounded bg-error-container text-on-error-container text-[10px] font-bold uppercase">
                    Priorità
                  </span>
                </div>
                <p className="font-body-sm text-body-sm text-text-muted mt-0.5">
                  Se il cliente ha una pratica a &quot;Soglia Sollecito GSE&quot;, rispondi con messaggio rassicurante dedicato allo stato dell&apos;istruttoria.
                </p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer shrink-0 mt-0.5">
                <input checked={ruleGse} className="sr-only peer" onChange={(e) => setRuleGse(e.target.checked)} type="checkbox" />
                <div className="w-10 h-6 bg-surface-container-highest peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-status-success" />
              </label>
            </div>
            {/* Rule 3 */}
            <div className="p-3 rounded-lg bg-surface-container-low flex items-start justify-between gap-3">
              <div className="flex-1">
                <div className="flex items-center gap-1.5">
                  <span className="font-label-md text-label-md text-on-surface">Escludi Fornitori &amp; Subappaltatori</span>
                  <span className="px-1.5 py-0.2 rounded bg-surface-container-high text-on-surface-variant text-[10px] font-bold">
                    48 CONTATTI
                  </span>
                </div>
                <p className="font-body-sm text-body-sm text-text-muted mt-0.5">
                  Nessuna risposta automatica a magazzini idraulici, rivenditori edili e artigiani partner.
                </p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer shrink-0 mt-0.5">
                <input
                  checked={ruleSuppliers}
                  className="sr-only peer"
                  onChange={(e) => setRuleSuppliers(e.target.checked)}
                  type="checkbox"
                />
                <div className="w-10 h-6 bg-surface-container-highest peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-status-success" />
              </label>
            </div>
            {/* Rule 4 */}
            <div className="p-3 rounded-lg bg-surface-container-low flex items-start justify-between gap-3">
              <div className="flex-1">
                <div className="flex items-center gap-1.5">
                  <span className="font-label-md text-label-md text-on-surface">Notifica Push Silenziosa al Tecnico</span>
                  <span className="px-1.5 py-0.2 rounded bg-secondary-fixed text-on-secondary-fixed text-[10px] font-bold uppercase">
                    SOS Keyword
                  </span>
                </div>
                <p className="font-body-sm text-body-sm text-text-muted mt-0.5">
                  Avviso prioritario se il cliente scrive <span className="font-semibold text-on-surface">&quot;Allagamento&quot;</span>,{" "}
                  <span className="font-semibold text-on-surface">&quot;Pompa Bloccata&quot;</span> o{" "}
                  <span className="font-semibold text-on-surface">&quot;Scadenza GSE&quot;</span>.
                </p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer shrink-0 mt-0.5">
                <input
                  checked={rulePushSos}
                  className="sr-only peer"
                  onChange={(e) => setRulePushSos(e.target.checked)}
                  type="checkbox"
                />
                <div className="w-10 h-6 bg-surface-container-highest peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-status-success" />
              </label>
            </div>
          </div>
        </div>

        {/* Operational Action Controls */}
        <div className="flex flex-col gap-2.5 mt-1">
          <button
            className="w-full h-12 rounded-xl bg-surface-container-high hover:bg-surface-container-highest text-on-surface font-label-lg text-label-lg flex items-center justify-center gap-2 transition-all active:scale-[0.98]"
            id="testBtn"
            onClick={() => showToast("Messaggio simulato inviato al numero aziendale di test.")}
            type="button"
          >
            <span className="material-symbols-outlined text-xl text-on-surface-variant">send_and_archive</span>
            <span>Simula Risposta di Test su WhatsApp</span>
          </button>
          <button
            className="w-full h-12 rounded-xl bg-status-success hover:bg-green-700 text-on-tertiary font-label-lg text-label-lg flex items-center justify-center gap-2 shadow-md transition-all active:scale-[0.98]"
            id="saveRulesBtn"
            onClick={() => showToast("Regole e orari WhatsApp sincronizzati sul Cloud Business!")}
            type="button"
          >
            <span className="material-symbols-outlined text-xl">cloud_sync</span>
            <span>Salva e Applica Regole</span>
          </button>
        </div>

        {/* Micro Interaction Toast Confirmation */}
        <div
          className={`fixed bottom-20 left-4 right-4 bg-primary text-on-primary p-3 rounded-xl shadow-xl flex items-center justify-between transition-all duration-300 z-50 ${
            toastMsg ? "opacity-100 translate-y-0" : "opacity-0 pointer-events-none translate-y-3"
          }`}
          id="toastNotification"
        >
          <div className="flex items-center gap-2.5">
            <span className="material-symbols-outlined text-status-success" style={{ fontVariationSettings: "'FILL' 1" }}>
              check_circle
            </span>
            <span className="font-body-sm text-body-sm font-semibold" id="toastText">
              {toastMsg ?? "Regole WhatsApp Fuori Orario aggiornate con successo!"}
            </span>
          </div>
          <button
            className="text-on-primary-container hover:text-on-primary p-1"
            onClick={() => setToastMsg(null)}
            type="button"
          >
            <span className="material-symbols-outlined text-sm">close</span>
          </button>
        </div>
      </div>
    </StitchShell>
  );
}
