import { Component, useEffect, lazy, Suspense } from "react";
import { BrowserRouter, Routes, Route, Outlet, Navigate, useLocation } from "react-router-dom";
import { toast } from "sonner";
import { Toaster } from "@/components/ui/sonner";
import { AuthProvider, useAuth, dashboardPathFor } from "@/context/AuthContext";
import { TrialProvider } from "@/stitch/TrialGuard";
import Header from "@/components/site/Header";
import Footer from "@/components/site/Footer";
import CookieBanner from "@/components/CookieBanner";
import Home from "@/pages/Home";
import DashboardPage from "@/stitch/DashboardPage";
import { PaymentSuccess, PaymentCancel } from "@/pages/PaymentResult";
import "@/App.css";

// Pagine CasaLavoroPRO caricate on-demand
const StitchAuthPage = lazy(() => import("@/stitch/StitchAuthPage"));
const NuovoPreventivoPage = lazy(() => import("@/stitch/NuovoPreventivoPage"));
const WhatsappHubPage = lazy(() => import("@/stitch/WhatsappHubPage"));
const ListiniIvaPage = lazy(() => import("@/stitch/ListiniIvaPage"));
const AnteprimaWhatsappMarcoPage = lazy(() => import("@/stitch/AnteprimaWhatsappMarcoPage"));
const AnteprimaWhatsappColomboPage = lazy(() => import("@/stitch/AnteprimaWhatsappColomboPage"));
const ComputoEcobonusPage = lazy(() => import("@/stitch/ComputoEcobonusPage"));
const ConfrontoFiscalePage = lazy(() => import("@/stitch/ConfrontoFiscalePage"));
const PraticaGsePage = lazy(() => import("@/stitch/PraticaGsePage"));
const RicevutaGsePage = lazy(() => import("@/stitch/RicevutaGsePage"));
const IstruttoriaGsePage = lazy(() => import("@/stitch/IstruttoriaGsePage"));
const RegistroGsePage = lazy(() => import("@/stitch/RegistroGsePage"));
const NotificaMassivaPage = lazy(() => import("@/stitch/NotificaMassivaPage"));
const SyncLiveRispostePage = lazy(() => import("@/stitch/SyncLiveRispostePage"));
const FuoriOrarioFeriePage = lazy(() => import("@/stitch/FuoriOrarioFeriePage"));
const StoricoTriageSosPage = lazy(() => import("@/stitch/StoricoTriageSosPage"));

// Route in code-splitting: caricate on-demand per alleggerire il bundle iniziale (JS inutilizzato in home).
const Aziende = lazy(() => import("@/pages/Aziende"));
const AziendaDettaglio = lazy(() => import("@/pages/AziendaDettaglio"));
const Annunci = lazy(() => import("@/pages/Annunci"));
const Prezzi = lazy(() => import("@/pages/Prezzi"));
const AnnuncioDettaglio = lazy(() => import("@/pages/AnnuncioDettaglio"));
const Login = lazy(() => import("@/pages/Login"));
const Registrati = lazy(() => import("@/pages/Registrati"));
const NuovaRichiesta = lazy(() => import("@/pages/NuovaRichiesta"));
const DashboardPrivato = lazy(() => import("@/pages/DashboardPrivato"));
const DashboardAzienda = lazy(() => import("@/pages/DashboardAzienda"));
const AnalisiEnergetica = lazy(() => import("@/pages/AnalisiEnergetica"));
const ResetPassword = lazy(() => import("@/pages/ResetPassword"));
const ReportPubblico = lazy(() => import("@/pages/ReportPubblico"));
const PrivacyPolicy = lazy(() => import("@/pages/PrivacyPolicy"));
const TerminiServizio = lazy(() => import("@/pages/TerminiServizio"));
const CookiePolicy = lazy(() => import("@/pages/CookiePolicy"));
const DirittiGdpr = lazy(() => import("@/pages/DirittiGdpr"));
const Blog = lazy(() => import("@/pages/Blog"));
const Ristrutturazioni = lazy(() => import("@/pages/Ristrutturazioni"));

const STITCH_ROUTES = new Set([
    "/",
    "/preventivo",
    "/preventivo-base",
    "/whatsapp",
    "/listini-iva",
    "/anteprima-whatsapp-marco",
    "/anteprima-whatsapp-colombo",
    "/ecobonus",
    "/confronto-fiscale",
    "/pratica-gse",
    "/ricevuta-gse",
    "/istruttoria-gse",
    "/registro-gse",
    "/notifica-massiva",
    "/risposte-live",
    "/fuori-orario",
    "/triage-sos",
]);

function ConditionalCookieBanner() {
    const { pathname } = useLocation();
    if (STITCH_ROUTES.has(pathname)) return null;
    return <CookieBanner />;
}

class ErrorBoundary extends Component {
    constructor(props) {
        super(props);
        this.state = { error: null };
    }

    static getDerivedStateFromError(error) {
        return { error };
    }

    render() {
        if (this.state.error) {
            return (
                <div className="min-h-screen bg-navy flex items-center justify-center p-8 text-center">
                    <div>
                        <h1 className="font-display font-black text-2xl text-white">Qualcosa è andato storto</h1>
                        <p className="mt-2 text-slate-400 text-sm">Ricarica la pagina per continuare.</p>
                    </div>
                </div>
            );
        }
        return this.props.children;
    }
}

function ScrollToTop() {
    const { pathname } = useLocation();
    useEffect(() => {
        if (window.__lenis) window.__lenis.scrollTo(0, { immediate: true });
        else window.scrollTo(0, 0);
    }, [pathname]);
    return null;
}

function SmoothScroll() {
    const { pathname } = useLocation();
    useEffect(() => {
        if (STITCH_ROUTES.has(pathname)) {
            if (window.__lenis) {
                window.__lenis.destroy();
                window.__lenis = null;
            }
            return;
        }
        let lenis;
        let raf;
        let cancelled = false;
        import("lenis").then(({ default: Lenis }) => {
            if (cancelled) return;
            lenis = new Lenis({ duration: 1.15, smoothWheel: true });
            window.__lenis = lenis;
            const loop = (t) => {
                lenis.raf(t);
                raf = requestAnimationFrame(loop);
            };
            raf = requestAnimationFrame(loop);
        });
        return () => {
            cancelled = true;
            if (raf) cancelAnimationFrame(raf);
            if (lenis) lenis.destroy();
            window.__lenis = null;
        };
    }, [pathname]);
    return null;
}

function PublicLayout() {
    return (
        <div className="min-h-screen bg-navy">
            <Header />
            <main>
                <Outlet />
            </main>
            <Footer />
        </div>
    );
}

function RedirectWithMessage({ to, message }) {
    useEffect(() => {
        if (message) toast.error(message);
    }, [message]);
    return <Navigate to={to} replace />;
}

function ProtectedRoute({ roles, children }) {
    const { user, loading } = useAuth();
    const location = useLocation();

    if (loading) {
        return (
            <div className="min-h-screen bg-navy flex items-center justify-center">
                <p className="text-slate-400 text-sm">Caricamento…</p>
            </div>
        );
    }
    if (!user) {
        return <Navigate to="/login" state={{ from: location.pathname }} replace />;
    }
    if (roles && !roles.includes(user.role)) {
        return <Navigate to={dashboardPathFor(user.role)} replace />;
    }
    return children;
}

function NotFound() {
    return (
        <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4">
            <p className="font-display font-black text-7xl text-stroke">404</p>
            <h1 className="mt-4 font-display font-bold text-2xl text-white">Pagina non trovata</h1>
            <p className="mt-2 text-sm text-slate-400">Il link che hai seguito non esiste o è stato spostato.</p>
            <a href="/" className="mt-6 text-brand font-semibold hover:underline">Torna alla home</a>
        </div>
    );
}

function DashLayout({ children }) {
    return (
        <div className="min-h-screen bg-navy">
            <Header />
            {children}
        </div>
    );
}

function PageLoader() {
    return (
        <div className="min-h-screen bg-surface flex items-center justify-center">
            <p className="text-text-muted text-sm">Caricamento…</p>
        </div>
    );
}

function StitchAuthGate({ children }) {
    const { user, loading } = useAuth();
    if (loading) {
        return <PageLoader />;
    }
    if (!user) {
        return <StitchAuthPage />;
    }
    return children;
}

function App() {
    return (
        <ErrorBoundary>
            <BrowserRouter>
                <AuthProvider>
                    <TrialProvider>
                    <SmoothScroll />
                    <ScrollToTop />
                    <Toaster theme="dark" position="top-center" richColors />
                    <Suspense fallback={<PageLoader />}>
                    <Routes>
                        {/* Stitch CasaLavoroPRO App Routes */}
                        <Route path="/" element={<StitchAuthGate><DashboardPage /></StitchAuthGate>} />
                        <Route path="/preventivo" element={<StitchAuthGate><NuovoPreventivoPage /></StitchAuthGate>} />
                        <Route path="/preventivo-base" element={<StitchAuthGate><NuovoPreventivoPage showDetrazioni={false} /></StitchAuthGate>} />
                        <Route path="/whatsapp" element={<StitchAuthGate><WhatsappHubPage /></StitchAuthGate>} />
                        <Route path="/listini-iva" element={<StitchAuthGate><ListiniIvaPage /></StitchAuthGate>} />
                        <Route path="/anteprima-whatsapp-marco" element={<StitchAuthGate><AnteprimaWhatsappMarcoPage /></StitchAuthGate>} />
                        <Route path="/anteprima-whatsapp-colombo" element={<StitchAuthGate><AnteprimaWhatsappColomboPage /></StitchAuthGate>} />
                        <Route path="/ecobonus" element={<StitchAuthGate><ComputoEcobonusPage /></StitchAuthGate>} />
                        <Route path="/confronto-fiscale" element={<StitchAuthGate><ConfrontoFiscalePage /></StitchAuthGate>} />
                        <Route path="/pratica-gse" element={<StitchAuthGate><PraticaGsePage /></StitchAuthGate>} />
                        <Route path="/ricevuta-gse" element={<StitchAuthGate><RicevutaGsePage /></StitchAuthGate>} />
                        <Route path="/istruttoria-gse" element={<StitchAuthGate><IstruttoriaGsePage /></StitchAuthGate>} />
                        <Route path="/registro-gse" element={<StitchAuthGate><RegistroGsePage /></StitchAuthGate>} />
                        <Route path="/notifica-massiva" element={<StitchAuthGate><NotificaMassivaPage /></StitchAuthGate>} />
                        <Route path="/risposte-live" element={<StitchAuthGate><SyncLiveRispostePage /></StitchAuthGate>} />
                        <Route path="/fuori-orario" element={<StitchAuthGate><FuoriOrarioFeriePage /></StitchAuthGate>} />
                        <Route path="/triage-sos" element={<StitchAuthGate><StoricoTriageSosPage /></StitchAuthGate>} />

                        {/* Legacy Marketplace Routes */}
                        <Route element={<PublicLayout />}>
                            <Route path="/marketplace" element={<Home />} />
                            <Route path="/aziende" element={<Aziende />} />
                            <Route path="/aziende/:id" element={<AziendaDettaglio />} />
                            <Route path="/noleggio" element={<Annunci tipo="noleggio" />} />
                            <Route path="/mercatino" element={<Annunci tipo="usato" />} />
                            <Route path="/prezzi" element={<Prezzi />} />
                            <Route path="/annunci/:id" element={<AnnuncioDettaglio />} />
                            <Route path="/r/:token" element={<ReportPubblico />} />
                            <Route path="/privacy-policy" element={<PrivacyPolicy />} />
                            <Route path="/privacy" element={<Navigate to="/privacy-policy" replace />} />
                            <Route path="/termini" element={<TerminiServizio />} />
                            <Route path="/termini-di-servizio" element={<Navigate to="/termini" replace />} />
                            <Route path="/cookie-policy" element={<CookiePolicy />} />
                            <Route path="/cookie" element={<Navigate to="/cookie-policy" replace />} />
                            <Route path="/gdpr" element={<DirittiGdpr />} />
                            <Route path="/blog" element={<Blog />} />
                            <Route path="/blog/:slug" element={<Blog />} />
                            <Route path="/ristrutturazioni" element={<Ristrutturazioni />} />
                            <Route path="*" element={<NotFound />} />
                        </Route>
                        <Route path="/login" element={<Login />} />
                        <Route path="/registrati" element={<Registrati />} />
                        <Route path="/reset-password" element={<ResetPassword />} />
                        <Route path="/nuova-richiesta" element={<ProtectedRoute roles={["privato"]}><DashLayout><NuovaRichiesta /></DashLayout></ProtectedRoute>} />
                        <Route path="/area-privato" element={<ProtectedRoute roles={["privato"]}><DashLayout><DashboardPrivato /></DashLayout></ProtectedRoute>} />
                        <Route path="/dashboard" element={<ProtectedRoute roles={["azienda"]}><DashLayout><DashboardAzienda /></DashLayout></ProtectedRoute>} />
                        <Route path="/dashboard/azienda" element={<Navigate to="/dashboard" replace />} />
                        <Route path="/dashboard/:section" element={<ProtectedRoute roles={["azienda"]}><DashLayout><DashboardAzienda /></DashLayout></ProtectedRoute>} />
                        <Route path="/analisi-energetica" element={<ProtectedRoute roles={["privato", "azienda"]}><DashLayout><AnalisiEnergetica /></DashLayout></ProtectedRoute>} />
                        <Route path="/payment/success" element={<PaymentSuccess />} />
                        <Route path="/payment/cancel" element={<PaymentCancel />} />
                    </Routes>
                    </Suspense>
                    <ConditionalCookieBanner />
                    </TrialProvider>
                </AuthProvider>
            </BrowserRouter>
        </ErrorBoundary>
    );
}

export default App;
