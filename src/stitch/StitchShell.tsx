import React from "react";
import { Link } from "react-router-dom";


export const STITCH_PROFILE_URL =
  "https://lh3.googleusercontent.com/aida-public/AB6AXuBzkxWSjK4FxyAN3fvcXuQ0qWFy2DR0RCllygccN7WB6S3iBZpSxXpYdqlBnApYTDlygIt7luwGLrldCwOaNub2XJaNMM6-mXk9ULKnVSSBYo2c1dpLQvdmgfKNrzaEMlC-sviwZ7II7NCHUL6zlSqhiutybQuomDUgQj50L6T7ITPrpP4OD5GTmuTWeXr4ClOTv_0aCvWcYsD5lxDQh9cTp99xtPos97afzjhAnDdF";

type ActiveTab = "dashboard" | "preventivo" | "whatsapp" | "listini" | "none";

interface StitchShellProps {
  title: string;
  activeTab: ActiveTab;
  showFourTabs?: boolean;
  children: React.ReactNode;
}

export default function StitchShell({
  title,
  activeTab,
  showFourTabs = false,
  children,
}: StitchShellProps) {
  return (
    <div className="stitch-app bg-surface font-body-md text-on-surface flex flex-col min-h-[max(884px,100dvh)]">
      <header className="fixed top-0 inset-x-0 z-50 bg-primary-container/95 backdrop-blur-xl pt-safe shadow-[0_1px_8px_rgba(0,0,0,0.08)]">
        <div className="h-16 px-margin flex items-center justify-between">
          <Link to="/" className="flex items-center">
            <img
              alt="CasaLavoroPRO"
              className="h-8 w-auto object-contain"
              src="/assets/aistudio/image_07da2a6d.png"
            />
          </Link>
          <div className="flex items-center gap-space-sm">
            <Link
              to="/whatsapp"
              aria-label="Notifiche WhatsApp"
              className="w-11 h-11 flex items-center justify-center rounded-full text-on-primary-container hover:text-on-primary relative transition-colors"
            >
              <span className="material-symbols-outlined text-xl">notifications</span>
              <span className="absolute top-2.5 right-2.5 w-2 h-2 rounded-full bg-secondary-container" />
            </Link>
            <Link
              to="/listini-iva"
              aria-label="Profilo e Listini"
              className="relative flex items-center justify-center"
            >
              <img
                alt="Profile"
                className="w-8 h-8 rounded-full object-cover"
                referrerPolicy="no-referrer"
                src={STITCH_PROFILE_URL}
              />
              <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-status-success" />
            </Link>
          </div>
        </div>
        <div className="px-margin pb-2 flex items-center justify-between">
          <h1 className="font-headline-md text-headline-md text-on-primary truncate">{title}</h1>
          <span className="flex items-center gap-1 font-label-sm text-label-sm text-on-primary-container">
            <span className="w-1.5 h-1.5 rounded-full bg-status-success animate-pulse" />
            Sync attivo
          </span>
        </div>
      </header>

      <main className="flex flex-col relative w-full pt-28 pb-28 px-margin bg-surface flex-1">
        {children}
      </main>

      <nav
        className="fixed bottom-0 inset-x-0 z-50 pb-safe bg-primary-container/95 backdrop-blur-xl shadow-[0_-2px_12px_rgba(0,0,0,0.12)]"
        data-active-classes="text-on-primary bg-primary"
      >
        {showFourTabs ? (
          <div className="flex items-center justify-around h-16 px-space-xs">
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
              className={`flex flex-col items-center justify-center gap-0.5 min-w-[64px] h-12 rounded-xl transition-all duration-150 relative ${
                activeTab === "whatsapp"
                  ? "text-on-primary bg-primary"
                  : "text-on-primary-container hover:text-on-primary"
              }`}
              data-path="whatsapp-messaging-hub"
            >
              <div className="relative">
                <span className="material-symbols-outlined text-2xl">chat</span>
                <span className="absolute -top-1 -right-1.5 px-1 py-0.2 rounded-full bg-secondary-container text-on-secondary font-label-sm text-[10px] leading-tight font-bold">
                  3
                </span>
              </div>
              <span className="font-label-sm text-label-sm">WhatsApp</span>
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
          <div className="flex items-center justify-around h-16 px-space-xs">
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
              aria-current={activeTab === "whatsapp" ? "page" : undefined}
              className={`flex flex-col items-center justify-center gap-0.5 min-w-[72px] h-12 rounded-xl transition-all duration-150 relative ${
                activeTab === "whatsapp"
                  ? "text-on-primary bg-primary"
                  : "text-on-primary-container hover:text-on-primary"
              }`}
              data-path="whatsapp-hub"
            >
              <div className="relative">
                <span className="material-symbols-outlined text-2xl">chat</span>
                <span className="absolute -top-1 -right-1.5 px-1 py-0.2 rounded-full bg-secondary-container text-on-secondary font-label-sm text-[10px] leading-tight font-bold">
                  3
                </span>
              </div>
              <span className="font-label-sm text-label-sm">WhatsApp</span>
            </Link>
          </div>
        )}
      </nav>
    </div>
  );
}
