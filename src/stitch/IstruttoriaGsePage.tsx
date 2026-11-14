import { useState } from "react";
import { useNavigate } from "react-router-dom";
import StitchShell from "./StitchShell";

interface NoteEntry {
  author: string;
  time: string;
  body: string;
}

const INITIAL_NOTES: NoteEntry[] = [
  {
    author: "Ing. Marco V. • Studio Tecnico",
    time: "Ieri, 16:40",
    body: "Cliente Roberto Colombo ha telefonato per chiedere tempistiche accredito bonifico. Rassicurato sul rispetto dei termini di legge 60-90gg.",
  },
  {
    author: "Ing. Marco V. • Studio Tecnico",
    time: "26 Ott, 11:15",
    body: "Verificata ricevuta bonifico parlante caricata correttamente con indicazione L. 296/2006.",
  },
];

const INITIAL_DRAFT = `OGGETTO: Istanza di sollecito e richiesta stato avanzamento istruttorio - Pratica CT 2.0 GSE-CT2-2025-0814 (Prot. GSE-991204). Beneficiario: Roberto Colombo.\n\nIl sottoscritto tecnico incaricato richiede, ai sensi e per gli effetti dell'art. 2 Legge 241/90 e del D.M. 16 Febbraio 2016, cortese aggiornamento sulla chiusura dell'istruttoria tecnico-amministrativa, decorsi 28 giorni dall'attribuzione del protocollo formale senza alcuna richiesta di integrazione documentale.`;

export default function IstruttoriaGsePage() {
  const navigate = useNavigate();
  const [channel, setChannel] = useState<"pec" | "ticket" | "phone">("pec");
  const [draftText, setDraftText] = useState(INITIAL_DRAFT);
  const [isEditingDraft, setIsEditingDraft] = useState(false);
  const [copied, setCopied] = useState(false);
  const [notes, setNotes] = useState<NoteEntry[]>(INITIAL_NOTES);
  const [noteInput, setNoteInput] = useState("");
  const [reminderEnabled, setReminderEnabled] = useState(true);
  const [inlineToast, setInlineToast] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setInlineToast(msg);
    setTimeout(() => setInlineToast(null), 2600);
  };

  const handleCopy = () => {
    navigator.clipboard?.writeText(draftText).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleAddNote = () => {
    const val = noteInput.trim();
    if (!val) return;
    setNotes((prev) => [{ author: "Tu • Ufficio Tecnico", time: "Adesso", body: val }, ...prev]);
    setNoteInput("");
  };

  return (
    <StitchShell title="Whatsapp Hub" activeTab="none">
      <div className="flex flex-col w-full pb-8">
        {/* Top Contextual Sub-header */}
        <div className="flex flex-col gap-space-sm mb-4">
          <div className="flex items-center justify-between">
            <button
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-surface-container-high text-on-surface hover:bg-surface-variant transition-colors"
              onClick={() => navigate("/pratica-gse")}
              type="button"
            >
              <span className="material-symbols-outlined text-lg">arrow_back</span>
              <span className="font-label-md text-label-md">Pratica GSE</span>
            </button>
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-surface-container-highest">
              <span className="w-2 h-2 rounded-full bg-status-warning animate-pulse" />
              <span className="font-label-sm text-label-sm text-on-surface font-semibold">Giorno 28/60</span>
            </div>
          </div>
          {/* Title & Incentive Meta */}
          <div className="flex flex-col gap-1 mt-1">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-secondary-container text-xl">account_balance</span>
              <h2 className="font-headline-sm text-headline-sm text-primary tracking-tight font-bold">
                Istruttoria &amp; Solleciti GSE
              </h2>
            </div>
            <p className="font-body-sm text-body-sm text-text-muted">
              Istanza Portaltermico: <strong className="text-on-surface font-semibold">GSE-CT2-2025-0814</strong> • Prot.{" "}
              <span className="font-medium text-on-surface">GSE-991204</span>
            </p>
            <div className="flex items-center justify-between pt-1">
              <span className="font-label-sm text-label-sm text-text-muted">Richiedente: Ing. Roberto Colombo</span>
              <span className="font-numeric-currency-md text-numeric-currency-md text-primary">€ 4.250,00</span>
            </div>
          </div>
        </div>

        {/* SLA & Procedural Timeline Card */}
        <div className="bg-surface-card rounded-xl p-4 shadow-sm mb-4">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-primary text-xl">timer</span>
              <span className="font-label-lg text-label-lg text-primary">Termini Ordinari DM 16/02/16</span>
            </div>
            <span className="px-2 py-0.5 rounded text-[11px] font-bold tracking-wide uppercase bg-surface-container-high text-on-surface-variant">
              L. 241/90
            </span>
          </div>
          {/* Progress Tracker */}
          <div className="flex flex-col gap-1.5 mb-3">
            <div className="flex justify-between items-baseline">
              <span className="font-body-sm text-body-sm text-primary font-semibold">28 giorni trascorsi</span>
              <span className="font-body-sm text-body-sm text-text-muted">32 gg al termine max (60 gg)</span>
            </div>
            {/* Progress Bar Container */}
            <div className="w-full h-3 rounded-full bg-surface-container-high overflow-hidden relative">
              <div className="h-full bg-secondary-container rounded-full" style={{ width: "46.6%" }} />
              {/* 30-day benchmark notch */}
              <div className="absolute top-0 bottom-0 left-1/2 w-0.5 bg-primary/40" title="Soglia 30gg" />
            </div>
            <div className="flex justify-between text-[11px] text-text-muted pt-0.5">
              <span>Avvio (24 Ott)</span>
              <span className="font-medium text-secondary">Soglia Sollecito (30 gg)</span>
              <span>Termine (23 Dic)</span>
            </div>
          </div>
          {/* Regulatory Notice Banner */}
          <div className="rounded-lg p-3 bg-surface-container-low flex gap-2.5 items-start">
            <span className="material-symbols-outlined text-secondary-container text-xl shrink-0 mt-0.5">
              notification_important
            </span>
            <p className="font-body-sm text-body-sm text-on-surface-variant leading-snug">
              Superati i 30 giorni lavorativi senza rilievi tecnici, il sistema sblocca l&apos;inoltro del{" "}
              <strong className="text-primary font-semibold">Sollecito Ufficiale a Tutela dell&apos;Incentivo</strong> via PEC o Ticket dedicato.
            </p>
          </div>
        </div>

        {/* Dispatch Solicitation Section */}
        <div className="bg-surface-card rounded-xl p-4 shadow-sm mb-4">
          <div className="flex items-center gap-2 mb-3">
            <span className="material-symbols-outlined text-secondary-container text-2xl">outgoing_mail</span>
            <div>
              <h3 className="font-headline-sm text-headline-sm text-primary">Invia Sollecito GSE</h3>
              <p className="font-body-sm text-body-sm text-text-muted">Canali abilitati per l&apos;accreditamento</p>
            </div>
          </div>
          {/* Channel Selector Tabs */}
          <div className="flex flex-col gap-2 mb-3.5" id="sollecito-tabs">
            <label
              className={`flex items-start gap-3 p-3 rounded-lg cursor-pointer transition-all ${
                channel === "pec" ? "bg-surface-container-low" : "bg-surface-container"
              }`}
            >
              <input
                checked={channel === "pec"}
                className="mt-1 accent-[#ff5722] w-4 h-4"
                name="sollecito-tipo"
                onChange={() => setChannel("pec")}
                type="radio"
                value="pec"
              />
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <span className="font-label-md text-label-md text-primary font-semibold">PEC Formale (D.P.R. 445/2000)</span>
                  <span className="px-1.5 py-0.2 rounded text-[10px] uppercase font-bold tracking-wider bg-secondary-fixed text-secondary">
                    Efficacia Legale
                  </span>
                </div>
                <p className="font-body-sm text-body-sm text-text-muted mt-0.5">
                  Destinatario: gsespa@pec.gse.it • Ufficio Conto Termico
                </p>
              </div>
            </label>
            <label
              className={`flex items-start gap-3 p-3 rounded-lg cursor-pointer transition-all ${
                channel === "ticket" ? "bg-surface-container-low" : "bg-surface-container"
              }`}
            >
              <input
                checked={channel === "ticket"}
                className="mt-1 accent-[#ff5722] w-4 h-4"
                name="sollecito-tipo"
                onChange={() => setChannel("ticket")}
                type="radio"
                value="ticket"
              />
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <span className="font-label-md text-label-md text-primary font-semibold">Ticket Portaltermico GSE</span>
                  <span className="px-1.5 py-0.2 rounded text-[10px] uppercase font-bold tracking-wider bg-surface-variant text-on-surface-variant">
                    Assistenza Web
                  </span>
                </div>
                <p className="font-body-sm text-body-sm text-text-muted mt-0.5">
                  Idoneo per richiesta aggiornamento rapido istruttore
                </p>
              </div>
            </label>
            <label
              className={`flex items-start gap-3 p-3 rounded-lg cursor-pointer transition-all ${
                channel === "phone" ? "bg-surface-container-low" : "bg-surface-container"
              }`}
            >
              <input
                checked={channel === "phone"}
                className="mt-1 accent-[#ff5722] w-4 h-4"
                name="sollecito-tipo"
                onChange={() => setChannel("phone")}
                type="radio"
                value="phone"
              />
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <span className="font-label-md text-label-md text-primary font-semibold">Numero Verde 800.16.16.53</span>
                  <span className="text-[11px] font-bold text-status-success">Lun-Ven 9:00-18:00</span>
                </div>
                <p className="font-body-sm text-body-sm text-text-muted mt-0.5">
                  Codice PIN Operativo Fiscale: <span className="font-mono font-medium text-primary">CT-0814</span>
                </p>
              </div>
            </label>
          </div>
          {/* Pre-compiled Legal Template Preview */}
          <div className="rounded-lg p-3 bg-surface-container-lowest shadow-sm mb-3">
            <div className="flex items-center justify-between mb-2">
              <span className="font-label-sm text-label-sm text-text-muted uppercase font-bold tracking-wider">
                Bozza Asseverata
              </span>
              <div className="flex items-center gap-1.5">
                <button
                  className="flex items-center gap-1 text-[12px] font-semibold text-primary px-2 py-1 rounded bg-surface-container-high hover:bg-surface-variant"
                  id="copy-btn"
                  onClick={handleCopy}
                  type="button"
                >
                  <span className={`material-symbols-outlined text-sm ${copied ? "text-status-success" : ""}`}>
                    {copied ? "check" : "content_copy"}
                  </span>
                  <span>{copied ? "Copiato" : "Copia"}</span>
                </button>
                <button
                  className="flex items-center gap-1 text-[12px] font-semibold text-primary px-2 py-1 rounded bg-surface-container-high hover:bg-surface-variant"
                  id="edit-btn"
                  onClick={() => setIsEditingDraft((prev) => !prev)}
                  type="button"
                >
                  <span className="material-symbols-outlined text-sm">{isEditingDraft ? "check" : "edit"}</span>
                  <span>{isEditingDraft ? "Fine" : "Modifica"}</span>
                </button>
              </div>
            </div>
            {isEditingDraft ? (
              <textarea
                className="w-full font-body-sm text-body-sm text-on-surface bg-surface-container-low p-2.5 rounded min-h-[130px] leading-relaxed font-mono outline-none"
                onChange={(e) => setDraftText(e.target.value)}
                value={draftText}
              />
            ) : (
              <div
                className="font-body-sm text-body-sm text-on-surface bg-surface-container-low p-2.5 rounded max-h-36 overflow-y-auto leading-relaxed font-mono whitespace-pre-line"
                id="text-container"
              >
                {draftText}
              </div>
            )}
          </div>
          {/* Primary Action Button */}
          <button
            className="w-full h-12 rounded-xl bg-secondary-container hover:bg-secondary text-on-secondary flex items-center justify-center gap-2 font-label-lg text-label-lg shadow-sm active:scale-[0.99] transition-all"
            onClick={() => showToast("Sollecito PEC Ufficiale generato ed inviato a gsespa@pec.gse.it")}
            type="button"
          >
            <span className="material-symbols-outlined text-xl">mark_email_read</span>
            <span>Genera ed Invia Sollecito PEC Ufficiale</span>
          </button>
        </div>

        {/* Timeline & Interaction History */}
        <div className="bg-surface-card rounded-xl p-4 shadow-sm mb-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-primary text-xl">history_edu</span>
              <h3 className="font-headline-sm text-headline-sm text-primary">Storico Eventi GSE</h3>
            </div>
            <span className="font-label-sm text-label-sm text-status-success font-semibold flex items-center gap-1">
              <span className="material-symbols-outlined text-sm">check_circle</span> 0 Rilievi
            </span>
          </div>
          <div className="relative pl-6 space-y-4">
            {/* Vertical Connecting Line via background */}
            <div className="absolute left-2.5 top-2 bottom-2 w-0.5 bg-surface-container-highest" />
            {/* Item 1 */}
            <div className="relative">
              <span className="absolute -left-6 top-1 w-3.5 h-3.5 rounded-full bg-status-success ring-4 ring-white" />
              <div className="flex items-center justify-between">
                <span className="font-label-md text-label-md text-primary font-bold">Protocollo telematico generato</span>
                <span className="text-[11px] text-text-muted">24 Ott 2025</span>
              </div>
              <p className="font-body-sm text-body-sm text-text-muted">Identificativo GSE/2025/CT-991204 acquisito a sistema.</p>
            </div>
            {/* Item 2 */}
            <div className="relative">
              <span className="absolute -left-6 top-1 w-3.5 h-3.5 rounded-full bg-status-success ring-4 ring-white" />
              <div className="flex items-center justify-between">
                <span className="font-label-md text-label-md text-primary font-bold">Verifica formale superata</span>
                <span className="text-[11px] text-text-muted">05 Nov 2025</span>
              </div>
              <p className="font-body-sm text-body-sm text-text-muted">
                Congruità schede tecniche e fatture convalidate dall&apos;algoritmo.
              </p>
            </div>
            {/* Item 3 */}
            <div className="relative">
              <span className="absolute -left-6 top-1 w-3.5 h-3.5 rounded-full bg-secondary-container ring-4 ring-white" />
              <div className="flex items-center justify-between">
                <span className="font-label-md text-label-md text-primary font-bold">Assegnazione Ufficio Tecnico</span>
                <span className="text-[11px] text-secondary font-bold">In Corso</span>
              </div>
              <p className="font-body-sm text-body-sm text-text-muted">
                In carico all&apos;Ufficio Tecnico Termico GSE Roma (Istruttoria di merito).
              </p>
            </div>
          </div>
          {/* Empty notice state for integration requests */}
          <div className="mt-4 pt-3 bg-surface-container-low rounded-lg p-2.5 flex items-center gap-2">
            <span className="material-symbols-outlined text-status-success text-base">verified</span>
            <span className="font-body-sm text-body-sm text-on-surface-variant font-medium">
              Nessuna richiesta di integrazione o sospensiva ad oggi pervenuta.
            </span>
          </div>
        </div>

        {/* Internal Notes & Tech Memos */}
        <div className="bg-surface-card rounded-xl p-4 shadow-sm mb-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-primary text-xl">sticky_note_2</span>
              <h3 className="font-headline-sm text-headline-sm text-primary">Note Interne &amp; Cantiere</h3>
            </div>
            <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-primary-container text-on-primary">Ufficio Pratiche</span>
          </div>
          {/* Existing Notes Feed */}
          <div className="flex flex-col gap-2.5 mb-3" id="notes-list">
            {notes.map((n, idx) => (
              <div className="p-3 rounded-lg bg-surface-container-low" key={`${n.time}-${idx}`}>
                <div className="flex justify-between items-center mb-1">
                  <span className="font-label-sm text-label-sm text-primary font-bold">{n.author}</span>
                  <span className="text-[11px] text-text-muted">{n.time}</span>
                </div>
                <p className="font-body-sm text-body-sm text-on-surface-variant">{n.body}</p>
              </div>
            ))}
          </div>
          {/* Fast Note Composer */}
          <div className="flex flex-col gap-2 pt-1">
            <div className="flex gap-2">
              <input
                className="flex-1 h-12 px-3 rounded-lg bg-surface-container text-on-surface font-body-md text-body-md placeholder:text-text-muted outline-none focus:bg-surface-card shadow-inner"
                id="new-note-input"
                onChange={(e) => setNoteInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleAddNote();
                }}
                placeholder="Aggiungi una nuova nota o appunto..."
                type="text"
                value={noteInput}
              />
              <button
                className="w-12 h-12 rounded-lg bg-primary text-on-primary flex items-center justify-center shrink-0 active:scale-95 transition-all"
                id="add-note-btn"
                onClick={handleAddNote}
                type="button"
              >
                <span className="material-symbols-outlined text-2xl">add</span>
              </button>
            </div>
            {/* Reminder checkbox */}
            <label className="flex items-center gap-2 mt-1 px-1 cursor-pointer">
              <input
                checked={reminderEnabled}
                className="w-4 h-4 accent-[#ff5722] rounded"
                onChange={(e) => setReminderEnabled(e.target.checked)}
                type="checkbox"
              />
              <span className="font-body-sm text-body-sm text-on-surface-variant font-medium">
                Imposta promemoria automatico al 45° giorno (15 Dicembre 2025)
              </span>
            </label>
          </div>
        </div>

        {/* WhatsApp Client Sync Card */}
        <div className="bg-surface-card rounded-xl p-4 shadow-sm mb-4">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-status-success text-2xl">chat</span>
              <div>
                <h3 className="font-label-lg text-label-lg text-primary">Informa il Cliente su WhatsApp</h3>
                <p className="font-body-sm text-body-sm text-text-muted">Trasparenza in tempo reale</p>
              </div>
            </div>
            <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-surface-container-high text-on-surface-variant">
              +39 348 ••••819
            </span>
          </div>
          {/* Message Snippet Preview */}
          <div className="p-3 rounded-lg bg-surface-container-low mb-3">
            <p className="font-body-sm text-body-sm text-on-surface-variant italic">
              &quot;Gentile Roberto, la sua pratica GSE per l&apos;incentivo di € 4.250,00 è regolarmente in lavorazione al giorno 28/60 senza rilievi. Ti aggiorniamo tempestivamente al prossimo passaggio!&quot;
            </p>
          </div>
          {/* WhatsApp CTA Button */}
          <button
            className="w-full h-12 rounded-xl bg-[#25D366] hover:bg-[#20ba59] text-white flex items-center justify-center gap-2 font-label-lg text-label-lg shadow-sm active:scale-[0.99] transition-all"
            onClick={() => navigate("/notifica-massiva")}
            type="button"
          >
            <span className="material-symbols-outlined text-xl">send</span>
            <span>Invia Aggiornamento a Roberto Colombo</span>
          </button>
        </div>

        {/* Bottom Global Actions (Field Utility) */}
        <div className="flex flex-col gap-2.5 mt-1">
          <button
            className="w-full h-12 rounded-xl bg-secondary-container hover:bg-secondary text-on-secondary flex items-center justify-center gap-2 font-label-lg text-label-lg shadow-sm active:scale-[0.98] transition-all"
            onClick={() => showToast("Sollecito Ufficiale GSE protocollato in uscita.")}
            type="button"
          >
            <span className="material-symbols-outlined text-xl">bolt</span>
            <span>Invia Sollecito Ufficiale GSE</span>
          </button>
          <button
            className="w-full h-12 rounded-xl bg-primary-container text-on-primary hover:bg-primary flex items-center justify-center gap-2 font-label-lg text-label-lg shadow-sm active:scale-[0.98] transition-all"
            onClick={() => navigate("/registro-gse")}
            type="button"
          >
            <span className="material-symbols-outlined text-xl">picture_as_pdf</span>
            <span>Scarica Riepilogo Istruttoria PDF</span>
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
