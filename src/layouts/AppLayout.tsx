import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
  LayoutGrid,
  Users,
  History,
  Wallet,
  User as UserIcon,
  Bell,
  LogOut,
} from "lucide-react";
import { clsx } from "clsx";
import { Logo } from "@/components/Logo";
import { useAuth } from "@/hooks/useAuth";
import { useLogout } from "@/api/generated/auth";
import { useNotifications } from "@/api/generated/notifications";

const NAV_ITEMS = [
  { to: "/dashboard", icon: LayoutGrid, key: "nav.dashboard" as const },
  { to: "/groups", icon: Users, key: "nav.myGroups" as const },
  { to: "/history", icon: History, key: "nav.history" as const },
  { to: "/hisab", icon: Wallet, key: "nav.hisab" as const },
  { to: "/profile", icon: UserIcon, key: "nav.profile" as const },
];

export function AppLayout() {
  const { t, i18n } = useTranslation();
  const { user } = useAuth();
  const logout = useLogout();
  const navigate = useNavigate();
  const { data: notifications } = useNotifications();
  const unreadCount = notifications?.filter((n) => !n.read).length ?? 0;

  async function handleLogout() {
    await logout.mutateAsync();
    navigate("/login");
  }

  return (
    <div className="min-h-screen bg-surface pb-20 md:pb-0">
      {/* Desktop top nav */}
      <header className="hidden border-b border-border bg-white md:block">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-3">
          <Logo withWordmark />
          <nav className="flex items-center gap-1">
            {NAV_ITEMS.map(({ to, icon: Icon, key }) => (
              <NavLink
                key={to}
                to={to}
                className={({ isActive }) =>
                  clsx(
                    "flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                    isActive ? "bg-primary/10 text-primary-deep" : "text-ink-muted hover:bg-cream"
                  )
                }
              >
                <Icon className="h-4 w-4" />
                {t(key)}
              </NavLink>
            ))}
          </nav>
          <div className="flex items-center gap-3">
            <button
              onClick={() => i18n.changeLanguage(i18n.language === "mr" ? "en" : "mr")}
              className="rounded-lg px-2.5 py-1.5 text-sm font-medium text-ink-muted hover:bg-cream"
            >
              {i18n.language === "mr" ? "EN" : "मर"}
            </button>
            <NavLink to="/notifications" className="relative rounded-lg p-2 hover:bg-cream">
              <Bell className="h-5 w-5 text-ink-muted" />
              {unreadCount > 0 && (
                <span className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] font-medium text-white">
                  {unreadCount}
                </span>
              )}
            </NavLink>
            <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-sm font-medium text-primary-deep">
              {user?.name?.charAt(0).toUpperCase()}
            </div>
            <button
              onClick={handleLogout}
              className="rounded-lg p-2 text-ink-muted hover:bg-cream hover:text-danger"
              title={t("nav.logout")}
            >
              <LogOut className="h-5 w-5" />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile top bar */}
      <header className="flex items-center justify-between border-b border-border bg-white px-4 py-3 md:hidden">
        <Logo withWordmark className="h-7 w-7" />
        <div className="flex items-center gap-2">
          <NavLink to="/notifications" className="relative rounded-lg p-2">
            <Bell className="h-5 w-5 text-ink-muted" />
            {unreadCount > 0 && (
              <span className="absolute right-1 top-1 h-2 w-2 rounded-full bg-primary" />
            )}
          </NavLink>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-6 md:px-6 md:py-8">
        <Outlet />
      </main>

      {/* Mobile bottom nav */}
      <nav className="fixed bottom-0 left-0 right-0 z-10 flex items-center justify-around border-t border-border bg-white py-2 md:hidden">
        {NAV_ITEMS.map(({ to, icon: Icon, key }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              clsx(
                "flex flex-col items-center gap-0.5 rounded-lg px-3 py-1.5 text-xs font-medium",
                isActive ? "text-primary" : "text-ink-muted"
              )
            }
          >
            <Icon className="h-5 w-5" />
            {t(key)}
          </NavLink>
        ))}
      </nav>
    </div>
  );
}
