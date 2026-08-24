import { Link, Outlet } from "react-router-dom";
import { Logo } from "@/components/Logo";
import { useTranslation } from "react-i18next";

export function PublicLayout() {
  const { i18n } = useTranslation();

  return (
    <div className="min-h-screen bg-surface">
      <header className="border-b border-border bg-white/80 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <Link to="/">
            <Logo withWordmark />
          </Link>
          <nav className="flex items-center gap-3">
            <button
              onClick={() => i18n.changeLanguage(i18n.language === "mr" ? "en" : "mr")}
              className="rounded-lg px-3 py-1.5 text-sm font-medium text-ink-muted hover:bg-cream"
            >
              {i18n.language === "mr" ? "English" : "मराठी"}
            </button>
            <Link to="/login" className="btn-secondary px-4 py-2 text-sm">
              Log in
            </Link>
            <Link to="/register" className="btn-primary px-4 py-2 text-sm">
              Get Started
            </Link>
          </nav>
        </div>
      </header>
      <Outlet />
    </div>
  );
}
