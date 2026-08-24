import { useTranslation } from "react-i18next";
import { useAuth } from "@/hooks/useAuth";
import { useMyGroups } from "@/api/generated/groups";
import { Badge } from "@/components/ui/Badge";

export function Profile() {
  const { user } = useAuth();
  const { data: groups } = useMyGroups();
  const { i18n } = useTranslation();

  if (!user) return null;

  return (
    <div className="mx-auto flex max-w-xl flex-col gap-6">
      <div className="card flex items-center gap-4">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-2xl font-semibold text-primary-deep">
          {user.name.charAt(0).toUpperCase()}
        </div>
        <div>
          <p className="font-display text-xl font-semibold text-ink">{user.name}</p>
          <p className="text-sm text-ink-muted">{user.email}</p>
        </div>
      </div>

      <div className="card grid grid-cols-2 gap-4 text-sm">
        <div>
          <p className="text-ink-muted">Phone</p>
          <p className="text-ink">{user.phone}</p>
        </div>
        <div>
          <p className="text-ink-muted">Language</p>
          <p className="text-ink">{i18n.language === "mr" ? "मराठी" : "English"}</p>
        </div>
        <div>
          <p className="text-ink-muted">Total Groups</p>
          <p className="text-ink">{groups?.length ?? 0}</p>
        </div>
        <div>
          <p className="text-ink-muted">Active Groups</p>
          <p className="text-ink">{groups?.filter((g) => g.status === "ACTIVE").length ?? 0}</p>
        </div>
      </div>

      <div className="card flex flex-col gap-3">
        <p className="font-medium text-ink">My Groups</p>
        {groups?.map((g) => (
          <div key={g.id} className="flex items-center justify-between border-b border-border py-2 last:border-0">
            <span className="text-ink">{g.name}</span>
            <div className="flex items-center gap-2">
              <Badge tone="neutral">{g.role}</Badge>
              <Badge tone={g.status === "ACTIVE" ? "success" : "neutral"}>{g.status}</Badge>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
