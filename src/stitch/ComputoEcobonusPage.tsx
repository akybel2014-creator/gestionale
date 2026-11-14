import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import StitchShell from "./StitchShell";

export default function ComputoEcobonusPage() {
  const navigate = useNavigate();
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 2500);
  };

  return (
    <StitchShell title="Whatsapp Hub" activeTab="none">
      <div className="flex flex-col w-full gap-space-md">
        {/* Status & Quick Navigation Breadcrumb Bar */}
        <div className="flex items-center justify-between px-space-xs">
          <Link
            to="/"
            className="flex items-center gap-1.5 text-on-surface-variant hover:text-on-surface transition-colors py-1"
          >
            <span className="material-symbols-outlined text-lg">arrow_back</span>
            <span className="font-label-md text-label-md">Tutti i preventivi</span>
          </Link>
          <div className="flex items-center gap-1.5">
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-status-success/10 text-status-success font-label-sm text-label-sm">
              <span className="w-1.5 h-1.5 rounded-full bg-status-success" />
              Pronto per invio
            </span>
            <button
              type="button"
              onClick={() => navigate("/confronto-fiscale")}
              className="w-8 h-8 rounded-full bg-surface-container flex items-center justify-center text-on-surface hover:bg-surface-variant transition-colors"
              title="Condividi opzioni"
            >
              <span className="material-symbols-outlined text-base">more_vert</span>
            </button>
          </div>
        </div>

        {/* Hero Header Commessa Card */}
        <div className="bg-surface-card rounded-xl p-space-md shadow-sm relative overflow-hidden flex flex-col gap-space-sm">
          <div className="absolute -right-6 -top-6 w-24 h-24 rounded-full bg-secondary-container/5 pointer-events-none" />
          <div className="flex items-start justify-between gap-space-sm">
            <div className="flex flex-col gap-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="px-2 py-0.5 rounded bg-primary text-on-primary font-label-sm text-label-sm tracking-wide">
                  PRV-2025-092
                </span>
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-tertiary-fixed text-on-tertiary-fixed-variant font-label-sm text-label-sm font-bold">
                  <span className="material-symbols-outlined text-xs">eco</span>
                  Ecobonus 65% Attivo
                </span>
              </div>
              <h2 className="font-headline-sm text-headline-sm text-on-surface mt-1 truncate">
                Ing. Roberto Colombo
              </h2>
              <p className="font-body-sm text-body-sm text-text-muted flex items-center gap-1 truncate">
                <span className="material-symbols-outlined text-xs">location_on</span>
                Corso Sempione, Milano (MI)
              </p>
            </div>
            <div className="flex flex-col items-end shrink-0 text-right">
              <span className="font-label-sm text-label-sm text-text-muted uppercase">Tipologia</span>
              <span className="font-label-md text-label-md text-on-surface text-right font-medium">Ibrido + Infissi</span>
              <span className="font-body-sm text-body-sm text-status-success font-medium flex items-center gap-0.5 mt-0.5">
                <span className="material-symbols-outlined text-xs">verified</span> Asseverabile
              </span>
            </div>
          </div>

          <div className="mt-1 pt-2.5 flex items-center justify-between bg-surface-container-low rounded-lg p-2.5">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-surface-card flex items-center justify-center text-status-success shadow-sm">
                <span className="material-symbols-outlined text-lg">trending_up</span>
              </div>
              <div>
                <p className="font-label-sm text-label-sm text-text-muted">Diagnosi Energetica Attesa</p>
                <p className="font-label-md text-label-md text-on-surface font-bold">
                  Classe F <span className="text-text-muted font-normal">→</span> Classe A2{" "}
                  <span className="text-status-success font-bold">(-45% kWh/anno)</span>
                </p>
              </div>
            </div>
            <span className="font-label-sm text-label-sm px-2 py-0.5 rounded bg-surface-card text-on-surface font-semibold shadow-xs">
              DEI 2025
            </span>
          </div>
        </div>

        {/* Rilievi Cantiere & Diagnosi Energetica Visual Grid */}
        <div className="flex flex-col gap-space-xs">
          <div className="flex items-center justify-between px-space-xs">
            <span className="font-label-sm text-label-sm text-text-muted uppercase tracking-wider font-bold flex items-center gap-1.5">
              <span className="material-symbols-outlined text-sm text-secondary-container">photo_camera</span>
              Rilievi Cantiere &amp; Documentazione
            </span>
            <span className="font-label-sm text-label-sm text-secondary-container font-semibold">3 Foto GEO-Tag</span>
          </div>
          <div className="grid grid-cols-3 gap-2">
            <div className="flex flex-col bg-surface-card rounded-lg overflow-hidden shadow-sm group">
              <div className="relative aspect-4/3 w-full overflow-hidden bg-surface-container">
                <img
                  alt="Centrale Termica"
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuBo4W03JmaP6Yio6-XFFhcVKBcxOLAx314JE8I_-g33M_lG6MYK_qJKYnq7dwSFE_atv95KwTkcmg2mO4EBYV9kvT_GIDebclyx4QtfsegOBH_uvUw9rnxKr2xoBZHOADdIyEe09iHOp-kZ7N7G2mmRkwuixuZ_tlo-W66FnKDR6-mgkWueQqIOPW3k5K2jI9a86hezd10wBmV2rqZDYNVe7aIrhz4W84yDkhMVjcv0"
                />
                <span className="absolute bottom-1 left-1 px-1.5 py-0.5 rounded bg-primary-container/85 text-on-primary font-label-sm text-[10px] backdrop-blur-sm">
                  Centrale T.
                </span>
              </div>
              <p className="font-body-sm text-[11px] leading-tight text-on-surface p-1.5 truncate">Caldaia esistente</p>
            </div>
            <div className="flex flex-col bg-surface-card rounded-lg overflow-hidden shadow-sm group">
              <div className="relative aspect-4/3 w-full overflow-hidden bg-surface-container">
                <img
                  alt="Infissi (5 vani)"
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuD4Lv6n_f-Wv0nVQXRC-G1dRRLQc-TwgCKgTABBYSkUahPnqIpARgT7zXuLHPUEy_ZRIXcnzpNU1WwuTvr1D5jMwOIQCK-wX1XbzicZZq9YbCyE-I8rDTCaBLSvT1-K0O_wm1yue___VV8fpunV7J72qcbf6Ealykak0LhJsbJPCOQoqkBMFUr7jZw_FXq1qQ_V9ufx2uEo66k_G5hpJerCM402dyov9_xkyLZhBXnW"
                />
                <span className="absolute bottom-1 left-1 px-1.5 py-0.5 rounded bg-primary-container/85 text-on-primary font-label-sm text-[10px] backdrop-blur-sm">
                  Infissi (5 vani)
                </span>
              </div>
              <p className="font-body-sm text-[11px] leading-tight text-on-surface p-1.5 truncate">
                Legno singolo/doppio
              </p>
            </div>
            <div className="flex flex-col bg-surface-card rounded-lg overflow-hidden shadow-sm group">
              <div className="relative aspect-4/3 w-full overflow-hidden bg-surface-container">
                <img
                  alt="Termografia"
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuDHJnMS5z4QoUNV1Zk7iTo1asxOiWnmGLbqTLbj-c7TZvmE9jPnG7cHwZv8X_65iGVaVRK6UrdufwEkM4CnCrV10vhGGReNrYHImOrE7_4eMk7p31KcUFeapycvKqC7MNGoO1wjOxKm161Ev90HGZFR2y4rffayARnOTYRKqY825tYAk-9bEzNxBM77aVtDcK8v4DethcmVzUBj3EvpRIe0pfPES9X74FrVTPc7o-HV"
                />
                <span className="absolute bottom-1 left-1 px-1.5 py-0.5 rounded bg-primary-container/85 text-on-primary font-label-sm text-[10px] backdrop-blur-sm">
                  Termografia
                </span>
              </div>
              <p className="font-body-sm text-[11px] leading-tight text-on-surface p-1.5 truncate">Ponte termico 3.2°C</p>
            </div>
          </div>
        </div>

        {/* SEZIONE PRINCIPALE: Materiali & Forniture Ecobonus */}
        <div className="bg-surface-card rounded-xl shadow-sm p-space-md flex flex-col gap-3">
          <div className="flex items-center justify-between pb-1.5">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-md bg-secondary-container/10 flex items-center justify-center text-secondary-container">
                <span className="material-symbols-outlined text-lg">inventory_2</span>
              </div>
              <div>
                <h3 className="font-headline-sm text-headline-sm text-on-surface">Materiali &amp; Forniture</h3>
                <p className="font-body-sm text-body-sm text-text-muted">4 voci con conformità ENEA</p>
              </div>
            </div>
            <span className="px-2 py-0.5 rounded bg-surface-container text-on-surface-variant font-label-sm text-label-sm font-semibold">
              Capitolo 01
            </span>
          </div>

          <div className="flex flex-col gap-2.5">
            <div className="bg-surface-container-low rounded-lg p-space-sm flex flex-col gap-1.5 transition-all">
              <div className="flex items-start justify-between gap-2">
                <div className="flex flex-col">
                  <span className="font-label-md text-label-md text-on-surface font-bold">
                    Pompa di calore ibrida Daikin Multi-Energy 8kW
                  </span>
                  <span className="font-body-sm text-body-sm text-text-muted line-clamp-2 mt-0.5">
                    Caldaia a condensazione integrata + Unità esterna inverter, COP 4.85, Gas R32 certificato ENEA.
                  </span>
                </div>
                <span className="font-numeric-currency-md text-numeric-currency-md text-primary shrink-0">
                  € 4.450,00
                </span>
              </div>
              <div className="flex items-center gap-2 mt-0.5">
                <span className="inline-flex items-center gap-0.5 font-label-sm text-[10px] px-1.5 py-0.5 rounded bg-tertiary-fixed text-on-tertiary-fixed-variant">
                  <span className="material-symbols-outlined text-[12px]">check_circle</span> ENEA Cod. 12B
                </span>
                <span className="font-label-sm text-[10px] text-text-muted">Q.tà: 1 impianto completo</span>
              </div>
            </div>

            <div className="bg-surface-container-low rounded-lg p-space-sm flex flex-col gap-1.5 transition-all">
              <div className="flex items-start justify-between gap-2">
                <div className="flex flex-col">
                  <span className="font-label-md text-label-md text-on-surface font-bold">
                    Infissi in PVC Schüco Triplo Vetro 82mm
                  </span>
                  <span className="font-body-sm text-body-sm text-text-muted line-clamp-2 mt-0.5">
                    5 vani luce, Uw 0.82 W/m²K, canalina warm edge, microventilazione perimetrale inclusa.
                  </span>
                </div>
                <span className="font-numeric-currency-md text-numeric-currency-md text-primary shrink-0">
                  € 2.850,00
                </span>
              </div>
              <div className="flex items-center gap-2 mt-0.5">
                <span className="inline-flex items-center gap-0.5 font-label-sm text-[10px] px-1.5 py-0.5 rounded bg-tertiary-fixed text-on-tertiary-fixed-variant">
                  <span className="material-symbols-outlined text-[12px]">check_circle</span> Uw ≤ 1.30 Norm.
                </span>
                <span className="font-label-sm text-[10px] text-text-muted">Q.tà: 5 elementi (~10.4 m²)</span>
              </div>
            </div>

            <div className="bg-surface-container-low rounded-lg p-space-sm flex flex-col gap-1.5 transition-all">
              <div className="flex items-start justify-between gap-2">
                <div className="flex flex-col">
                  <span className="font-label-md text-label-md text-on-surface font-bold">
                    Kit Termoregolazione Evoluta &amp; Valvole Smart
                  </span>
                  <span className="font-body-sm text-body-sm text-text-muted line-clamp-2 mt-0.5">
                    Cronotermostato modulante Wi-Fi classe V + 6 teste termostatiche elettroniche Zigbee.
                  </span>
                </div>
                <span className="font-numeric-currency-md text-numeric-currency-md text-primary shrink-0">
                  € 520,00
                </span>
              </div>
              <div className="flex items-center gap-2 mt-0.5">
                <span className="inline-flex items-center gap-0.5 font-label-sm text-[10px] px-1.5 py-0.5 rounded bg-tertiary-fixed text-on-tertiary-fixed-variant">
                  <span className="material-symbols-outlined text-[12px]">check_circle</span> Classe V ENEA
                </span>
                <span className="font-label-sm text-[10px] text-text-muted">Q.tà: 1 centralina + 6 attuatori</span>
              </div>
            </div>

            <div className="bg-surface-container-low rounded-lg p-space-sm flex flex-col gap-1.5 transition-all">
              <div className="flex items-start justify-between gap-2">
                <div className="flex flex-col">
                  <span className="font-label-md text-label-md text-on-surface font-bold">
                    Defangatore magnetico, disaeratore &amp; dosatore
                  </span>
                  <span className="font-body-sm text-body-sm text-text-muted line-clamp-2 mt-0.5">
                    Trattamento acque impianto termico a norma UNI 8065:2019 e condizionamento chimico protettivo.
                  </span>
                </div>
                <span className="font-numeric-currency-md text-numeric-currency-md text-primary shrink-0">
                  € 380,00
                </span>
              </div>
              <div className="flex items-center gap-2 mt-0.5">
                <span className="inline-flex items-center gap-0.5 font-label-sm text-[10px] px-1.5 py-0.5 rounded bg-tertiary-fixed text-on-tertiary-fixed-variant">
                  <span className="material-symbols-outlined text-[12px]">check_circle</span> UNI 8065
                </span>
                <span className="font-label-sm text-[10px] text-text-muted">Q.tà: 1 kit idraulico</span>
              </div>
            </div>
          </div>

          <div className="mt-1 pt-2 flex items-center justify-between bg-surface-container p-2.5 rounded-lg">
            <span className="font-label-md text-label-md text-on-surface-variant font-medium">
              Subtotale Forniture Ecobonus
            </span>
            <span className="font-headline-sm text-headline-sm text-primary font-bold">€ 8.200,00</span>
          </div>
        </div>

        {/* SEZIONE: Manodopera Specializzata */}
        <div className="bg-surface-card rounded-xl shadow-sm p-space-md flex flex-col gap-3">
          <div className="flex items-center justify-between pb-1">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-md bg-primary-container/10 flex items-center justify-center text-primary-container">
                <span className="material-symbols-outlined text-lg">engineering</span>
              </div>
              <div>
                <h3 className="font-headline-sm text-headline-sm text-on-surface">Manodopera &amp; Certificazioni</h3>
                <p className="font-body-sm text-body-sm text-text-muted">Posa qualificata F-GAS &amp; UNI 11673</p>
              </div>
            </div>
            <span className="px-2 py-0.5 rounded bg-surface-container text-on-surface-variant font-label-sm text-label-sm font-semibold">
              Capitolo 02
            </span>
          </div>
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between py-1.5 px-2 rounded-lg bg-surface-container-low">
              <div className="flex items-center gap-2 min-w-0 pr-2">
                <span className="material-symbols-outlined text-base text-text-muted shrink-0">delete_sweep</span>
                <span className="font-body-md text-body-md text-on-surface truncate">
                  Smontaggio e smaltimento vecchia caldaia e vecchi serramenti
                </span>
              </div>
              <span className="font-label-md text-label-md text-primary font-semibold shrink-0">€ 650,00</span>
            </div>
            <div className="flex items-center justify-between py-1.5 px-2 rounded-lg bg-surface-container-low">
              <div className="flex items-center gap-2 min-w-0 pr-2">
                <span className="material-symbols-outlined text-base text-text-muted shrink-0">build_circle</span>
                <span className="font-body-md text-body-md text-on-surface truncate">
                  Installazione qualificata F-GAS pompa di calore e lavaggio impianto
                </span>
              </div>
              <span className="font-label-md text-label-md text-primary font-semibold shrink-0">€ 950,00</span>
            </div>
            <div className="flex items-center justify-between py-1.5 px-2 rounded-lg bg-surface-container-low">
              <div className="flex items-center gap-2 min-w-0 pr-2">
                <span className="material-symbols-outlined text-base text-text-muted shrink-0">window</span>
                <span className="font-body-md text-body-md text-on-surface truncate">
                  Posa certificata serramenti con nastro termoespandente UNI 11673
                </span>
              </div>
              <span className="font-label-md text-label-md text-primary font-semibold shrink-0">€ 620,00</span>
            </div>
          </div>
          <div className="mt-1 pt-2 flex items-center justify-between bg-surface-container p-2.5 rounded-lg">
            <span className="font-label-md text-label-md text-on-surface-variant font-medium">Subtotale Manodopera</span>
            <span className="font-headline-sm text-headline-sm text-primary font-bold">€ 2.220,00</span>
          </div>
        </div>

        {/* SEZIONE: Oneri di Sicurezza & Gestione Pratiche */}
        <div className="bg-surface-card rounded-xl shadow-sm p-space-md flex flex-col gap-2.5">
          <div className="flex items-center justify-between pb-1">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-md bg-surface-container flex items-center justify-center text-text-muted">
                <span className="material-symbols-outlined text-lg">assignment</span>
              </div>
              <div>
                <h3 className="font-headline-sm text-headline-sm text-on-surface">Pratiche ENEA &amp; Asseverazione</h3>
                <p className="font-body-sm text-body-sm text-text-muted">Conformità tecnica e congruità prezzi</p>
              </div>
            </div>
            <span className="px-2 py-0.5 rounded bg-surface-container text-on-surface-variant font-label-sm text-label-sm font-semibold">
              Capitolo 03
            </span>
          </div>
          <div className="flex items-center justify-between py-2 px-2.5 rounded-lg bg-surface-container-low">
            <div className="flex flex-col min-w-0 pr-2">
              <span className="font-body-md text-body-md text-on-surface font-medium truncate">
                Pratica telematica ENEA, APE post-operam &amp; Asseverazione DEI
              </span>
              <span className="font-body-sm text-[11px] text-text-muted">
                Gestita internamente dal nostro ufficio tecnico abilitato
              </span>
            </div>
            <span className="font-label-md text-label-md text-primary font-semibold shrink-0">€ 450,00</span>
          </div>
        </div>

        {/* Box di Calcolo Detrazione Ecobonus 65% */}
        <div className="bg-primary text-on-primary rounded-xl p-space-md shadow-md flex flex-col gap-3 relative overflow-hidden">
          <div className="absolute -right-8 -bottom-8 w-32 h-32 rounded-full bg-status-success/10 blur-xl pointer-events-none" />
          <div className="flex items-center justify-between">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-tertiary-fixed text-on-tertiary-fixed font-label-sm text-label-sm font-bold uppercase tracking-wider">
              <span className="material-symbols-outlined text-sm">savings</span>
              Simulazione Detrazione Fiscale 65%
            </span>
            <span className="font-label-sm text-label-sm text-on-primary-container">10 Rate Annuali</span>
          </div>
          <div className="grid grid-cols-2 gap-2 mt-1">
            <div className="bg-primary-container/80 rounded-lg p-2.5 flex flex-col">
              <span className="font-label-sm text-label-sm text-on-primary-container">Importo Totale (IVA 10%)</span>
              <span className="font-numeric-currency-md text-numeric-currency-md text-on-primary mt-0.5">
                € 11.957,00
              </span>
            </div>
            <div className="bg-primary-container/80 rounded-lg p-2.5 flex flex-col">
              <span className="font-label-sm text-label-sm text-tertiary-fixed">Detrazione Totale IRPEF</span>
              <span className="font-numeric-currency-md text-numeric-currency-md text-tertiary-fixed font-bold mt-0.5">
                -€ 7.772,05
              </span>
            </div>
          </div>
          <div className="bg-tertiary-container/80 rounded-xl p-3 flex items-center justify-between">
            <div className="flex flex-col">
              <span className="font-label-sm text-label-sm text-on-tertiary-container font-semibold uppercase tracking-wider">
                Costo Effettivo a Carico Cliente
              </span>
              <span className="font-body-sm text-[11px] text-surface-variant">
                Recupero di € 777,20 ogni anno in busta paga
              </span>
            </div>
            <div className="text-right">
              <span className="font-numeric-currency-lg text-numeric-currency-lg text-on-tertiary font-bold tracking-tight">
                € 4.184,95
              </span>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-2 pt-1">
            <div className="flex items-center gap-1.5 text-on-primary-container font-body-sm text-[12px]">
              <span className="material-symbols-outlined text-sm text-status-success">bolt</span>
              <span>
                Risparmio netto stimato: <strong>65%</strong>
              </span>
            </div>
            <div className="flex items-center gap-1.5 text-on-primary-container font-body-sm text-[12px] justify-end">
              <span className="material-symbols-outlined text-sm text-status-success">home</span>
              <span>
                Aumento valore immobile: <strong>+8%</strong>
              </span>
            </div>
          </div>
        </div>

        {/* Riepilogo Finanziario */}
        <div className="bg-surface-card rounded-xl shadow-sm p-space-md flex flex-col gap-2">
          <span className="font-label-sm text-label-sm text-text-muted uppercase font-bold tracking-wider">
            Quadro Economico Complessivo
          </span>
          <div className="flex flex-col gap-1.5 pt-1">
            <div className="flex items-center justify-between text-body-md font-body-md text-on-surface">
              <span className="text-text-muted">Totale Imponibile Lavori</span>
              <span className="font-semibold text-primary">€ 10.870,00</span>
            </div>
            <div className="flex items-center justify-between text-body-md font-body-md text-on-surface">
              <span className="text-text-muted">IVA Agevolata 10% (Edilizia &amp; Riqualificazione)</span>
              <span className="font-semibold text-primary">€ 1.087,00</span>
            </div>
            <div className="h-px bg-surface-container my-1" />
            <div className="flex items-center justify-between">
              <div className="flex flex-col">
                <span className="font-label-lg text-label-lg text-on-surface font-bold">
                  Importo Complessivo a Preventivo
                </span>
                <span className="font-body-sm text-[11px] text-text-muted">
                  Sotto i massimali di spesa Ecobonus 2025
                </span>
              </div>
              <span className="font-numeric-currency-lg text-numeric-currency-lg text-secondary-container font-bold">
                € 11.957,00
              </span>
            </div>
          </div>
        </div>

        {/* Garanzie e Note Tecniche */}
        <div className="bg-surface-container-low rounded-xl p-space-md flex flex-col gap-2.5">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-status-success text-lg">verified_user</span>
            <h4 className="font-label-md text-label-md text-on-surface font-bold">
              Garanzie di Conformità CasaLavoroPRO
            </h4>
          </div>
          <div className="space-y-1.5">
            <div className="flex items-start gap-2">
              <span className="material-symbols-outlined text-sm text-text-muted mt-0.5">check</span>
              <p className="font-body-sm text-body-sm text-on-surface-variant">
                <strong>Asseverazione congruità prezzi allegata:</strong> Voci verificate su Prezzario Regionale Lombardia
                e DEI 2025.
              </p>
            </div>
            <div className="flex items-start gap-2">
              <span className="material-symbols-outlined text-sm text-text-muted mt-0.5">check</span>
              <p className="font-body-sm text-body-sm text-on-surface-variant">
                <strong>Bonifico Parlante automatico:</strong> Causale L. 296/06 generata con QR code all&apos;interno del
                PDF di conferma.
              </p>
            </div>
            <div className="flex items-start gap-2">
              <span className="material-symbols-outlined text-sm text-text-muted mt-0.5">check</span>
              <p className="font-body-sm text-body-sm text-on-surface-variant">
                <strong>Pratica ENEA completa:</strong> Compilazione e asseverazione a cura del nostro Ingegnere
                certificatore.
              </p>
            </div>
          </div>
        </div>

        {/* Action Stack */}
        <div className="flex flex-col gap-2.5 pt-1">
          <Link
            to="/anteprima-whatsapp-colombo"
            className="w-full h-12 bg-secondary-container active:bg-secondary text-on-secondary rounded-xl flex items-center justify-center gap-2 font-label-lg text-label-lg shadow-sm hover:shadow transition-all transform active:scale-[0.99]"
          >
            <span className="material-symbols-outlined text-xl">send</span>
            <span>Invia su WhatsApp (Ecobonus 65% • € 4.184 netti)</span>
          </Link>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => navigate("/listini-iva")}
              className="h-11 bg-surface-card hover:bg-surface-container text-on-surface rounded-xl flex items-center justify-center gap-1.5 font-label-md text-label-md shadow-xs transition-colors"
            >
              <span className="material-symbols-outlined text-lg text-text-muted">edit_note</span>
              <span>Modifica Voci</span>
            </button>
            <button
              type="button"
              onClick={() => showToast("Computo metrico PRV-2025-092.pdf pronto!")}
              className="h-11 bg-surface-card hover:bg-surface-container text-on-surface rounded-xl flex items-center justify-center gap-1.5 font-label-md text-label-md shadow-xs transition-colors"
            >
              <span className="material-symbols-outlined text-lg text-primary">picture_as_pdf</span>
              <span>Scarica Computo PDF</span>
            </button>
          </div>
        </div>

        {/* Micro Footer Stamp */}
        <div className="flex items-center justify-center gap-1 text-text-muted font-body-sm text-[11px] pt-1">
          <span className="material-symbols-outlined text-xs text-status-success">lock</span>
          <span>Documento con firma digitale avanzata conforme Art. 119 D.L. Rilancio</span>
        </div>

        {toastMsg && (
          <div className="fixed bottom-24 inset-x-margin max-w-sm mx-auto bg-primary-container text-on-primary px-4 py-3 rounded-xl shadow-2xl flex items-center gap-2.5 z-50">
            <span className="material-symbols-outlined text-status-success text-lg">check_circle</span>
            <span className="font-body-sm text-body-sm">{toastMsg}</span>
          </div>
        )}
      </div>
    </StitchShell>
  );
}
