import React from "react";
import { Link } from "react-router-dom";
import { LogOut } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import Logo from "@/components/Logo";


type ActiveTab = "dashboard" | "preventivo" | "whatsapp" | "listini" | "none";

interface StitchShellProps {
  title?: string;
  activeTab: ActiveTab;
  showFourTabs?: boolean;
  children: React.ReactNode;
}

function WhatsAppIcon({ className = "w-6 h-6" }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21 5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.816 9.816 0 0 0 12.04 2zm0 18.15c-1.48 0-2.93-.4-4.2-1.15l-.3-.18-3.12.82.83-3.04-.2-.31a8.13 8.13 0 0 1-1.25-4.38c0-4.5 3.66-8.15 8.16-8.15 2.18 0 4.23.85 5.77 2.39 1.54 1.54 2.39 3.59 2.39 5.77 0 4.5-3.66 8.15-8.16 8.15zm4.47-6.1c-.24-.12-1.45-.72-1.68-.8-.23-.08-.39-.12-.56.12-.17.24-.64.8-.79.96-.14.16-.29.18-.53.06-.24-.12-1.03-.38-1.96-1.21-.72-.65-1.21-1.45-1.36-1.69-.14-.24-.02-.37.1-.49.11-.11.24-.29.36-.43.12-.14.16-.24.24-.4.08-.16.04-.3-.02-.42-.06-.12-.56-1.35-.77-1.85-.2-.49-.41-.42-.56-.43h-.48c-.16 0-.43.06-.66.31-.23.24-.87.85-.87 2.07 0 1.22.89 2.4 1.01 2.56.12.16 1.75 2.67 4.23 3.74.59.25 1.05.41 1.41.52.59.19 1.13.16 1.56.1.47-.07 1.45-.59 1.65-1.16.2-.57.2-1.06.14-1.16-.06-.1-.23-.16-.47-.28z" />
    </svg>
  );
}

export default function StitchShell({
  activeTab,
  showFourTabs = false,
  children,
}: StitchShellProps) {
  const { user, azienda, logout } = useAuth() as {
    user?: { name?: string; email?: string } | null;
    azienda?: { nome?: string } | null;
    logout?: () => Promise<void>;
  };

  const displayName = azienda?.nome || user?.name || user?.email?.split("@")[0] || "Artigiano";

  const handleLogout = async () => {
    if (typeof logout === "function") {
      await logout();
    }
  };

  return (
    <div className="stitch-app bg-surface font-body-md text-on-surface flex flex-col min-h-screen w-full overflow-x-clip">
      <header className="fixed top-0 inset-x-0 z-50 bg-primary-container/95 backdrop-blur-xl pt-safe shadow-[0_1px_8px_rgba(0,0,0,0.08)]">
        <div className="w-full max-w-5xl mx-auto h-16 px-4 sm:px-6 flex items-center justify-between gap-2">
          <Link to="/" className="flex items-center shrink-0">
            <Logo size={32} className="[&>span]:text-lg sm:[&>span]:text-xl" />
          </Link>
          <div className="flex items-center gap-2 min-w-0">
            <Link
              to="/whatsapp"
              aria-label="Notifiche WhatsApp"
              className="w-10 h-10 flex items-center justify-center rounded-full text-on-primary-container hover:text-on-primary relative transition-colors shrink-0"
            >
              <span className="material-symbols-outlined text-xl">notifications</span>
              <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-secondary-container" />
            </Link>
            <Link
              to="/listini-iva"
              aria-label="Profilo e Listini"
              className="flex items-center gap-1.5 min-w-0 px-2.5 py-1.5 rounded-lg hover:bg-white/10 transition-colors"
            >
              <span className="font-label-sm text-xs font-semibold text-on-primary truncate max-w-[130px] sm:max-w-[200px]">
                {displayName}
              </span>
            </Link>
            <button
              type="button"
              id="header-logout-btn"
              onClick={handleLogout}
              title="Esci dall'account"
              className="shrink-0 h-8 px-2.5 rounded-lg bg-white/10 hover:bg-white/20 text-on-primary font-label-sm text-[11px] font-semibold flex items-center gap-1 transition-colors cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" aria-hidden="true" />
              <span>Esci</span>
            </button>
          </div>
        </div>
        <div className="w-full max-w-5xl mx-auto px-4 sm:px-6 pb-2 flex items-center justify-end gap-2">
          <span
            id="launch-pro-header-badge"
            className="shrink-0 flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/12 text-on-primary font-label-sm text-[11px] font-semibold border border-white/15"
          >
            <span>🚀 Versione Pro Attiva · Accesso Gratuito di Lancio</span>
          </span>
        </div>
      </header>

      <main className="flex flex-col relative w-full max-w-5xl mx-auto pt-28 pb-28 px-4 sm:px-6 bg-surface flex-1">
        {children}
      </main>

      <nav
        className="fixed bottom-0 inset-x-0 z-50 pb-safe bg-primary-container/95 backdrop-blur-xl shadow-[0_-2px_12px_rgba(0,0,0,0.12)]"
        data-active-classes="text-on-primary bg-primary"
      >
        {showFourTabs ? (
          <div className="w-full max-w-5xl mx-auto flex items-center justify-around h-16 px-2 sm:px-4">
            <Link
              to="/"
              className={`flex flex-col items-center justify-center gap-0.5 min-w-[64px] h-12 rounded-xl transition-all duration-150 relative ${
                activeTab === "dashboard"
                  ? "text-on-primary bg-primary"
                  : "text-on-primary-container hover:text-on-primary"
              }`}
              data-path="dashboard-preventivi"
            >
              <span className="material-symbols-outlined text-2xl">dashboard</span>
              <span className="font-label-sm text-label-sm">Dashboard</span>
            </Link>
            <Link
              to="/preventivo"
              className={`flex flex-col items-center justify-center gap-0.5 min-w-[64px] h-12 rounded-xl transition-all duration-150 relative ${
                activeTab === "preventivo"
                  ? "text-on-primary bg-primary"
                  : "text-on-primary-container hover:text-on-primary"
              }`}
              data-path="preventivatore-dettagliato"
            >
              <span className="material-symbols-outlined text-2xl">post_add</span>
              <span className="font-label-sm text-label-sm">Preventivo</span>
            </Link>
            <Link
              to="/whatsapp"
              aria-label="WhatsApp"
              className={`flex items-center justify-center min-w-[64px] h-12 rounded-xl transition-all duration-150 relative ${
                activeTab === "whatsapp"
                  ? "text-[#25D366] bg-primary"
                  : "text-[#25D366] hover:opacity-90"
              }`}
              data-path="whatsapp-messaging-hub"
            >
              <div className="relative flex items-center justify-center">
                <WhatsAppIcon className="w-7 h-7" />
                <span className="absolute -top-1.5 -right-2 px-1 py-0.2 rounded-full bg-secondary-container text-on-secondary font-label-sm text-[10px] leading-tight font-bold">
                  3
                </span>
              </div>
            </Link>
            <Link
              to="/listini-iva"
              className={`flex flex-col items-center justify-center gap-0.5 min-w-[64px] h-12 rounded-xl transition-all duration-150 relative ${
                activeTab === "listini"
                  ? "text-on-primary bg-primary"
                  : "text-on-primary-container hover:text-on-primary"
              }`}
              data-path="listini-iva"
            >
              <span className="material-symbols-outlined text-2xl">tune</span>
              <span className="font-label-sm text-label-sm">Listini &amp; IVA</span>
            </Link>
          </div>
        ) : (
          <div className="w-full max-w-5xl mx-auto flex items-center justify-around h-16 px-2 sm:px-4">
            <Link
              to="/"
              aria-current={activeTab === "dashboard" ? "page" : undefined}
              className={`flex flex-col items-center justify-center gap-0.5 min-w-[72px] h-12 rounded-xl transition-all duration-150 ${
                activeTab === "dashboard"
                  ? "text-on-primary bg-primary"
                  : "text-on-primary-container hover:text-on-primary"
              }`}
              data-path="dashboard"
            >
              <span className="material-symbols-outlined text-2xl">dashboard</span>
              <span className="font-label-sm text-label-sm">Dashboard</span>
            </Link>
            <Link
              to="/preventivo"
              aria-current={activeTab === "preventivo" ? "page" : undefined}
              className={`flex flex-col items-center justify-center gap-0.5 min-w-[72px] h-12 rounded-xl transition-all duration-150 relative ${
                activeTab === "preventivo"
                  ? "text-on-primary bg-primary"
                  : "text-on-primary-container hover:text-on-primary"
              }`}
              data-path="nuovo-preventivo"
            >
              <span className="material-symbols-outlined text-2xl">post_add</span>
              <span className="font-label-sm text-label-sm">Preventivo</span>
            </Link>
            <Link
              to="/whatsapp"
              aria-label="WhatsApp"
              aria-current={activeTab === "whatsapp" ? "page" : undefined}
              className={`flex items-center justify-center min-w-[72px] h-12 rounded-xl transition-all duration-150 relative ${
                activeTab === "whatsapp"
                  ? "text-[#25D366] bg-primary"
                  : "text-[#25D366] hover:opacity-90"
              }`}
              data-path="whatsapp-hub"
            >
              <div className="relative flex items-center justify-center">
                <WhatsAppIcon className="w-7 h-7" />
                <span className="absolute -top-1.5 -right-2 px-1 py-0.2 rounded-full bg-secondary-container text-on-secondary font-label-sm text-[10px] leading-tight font-bold">
                  3
                </span>
              </div>
            </Link>
          </div>
        )}
      </nav>
    </div>
  );
}
