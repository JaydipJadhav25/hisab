import { useState } from "react";
import { useParams } from "react-router-dom";
import { clsx } from "clsx";
import { Copy, Check } from "lucide-react";
import { useGroup, useGroupMembers } from "@/api/generated/groups";
import { Skeleton } from "@/components/ui/Skeleton";
import { Badge } from "@/components/ui/Badge";
import { TodayTab } from "./group/TodayTab";
import { OrderTab } from "./group/OrderTab";
import { HistoryTab } from "./group/HistoryTab";
import { MembersTab } from "./group/MembersTab";
import { HisabTab } from "./group/HisabTab";
import { SettingsTab } from "./group/SettingsTab";

const STATUS_TONE: Record<string, "success" | "warning" | "neutral"> = {
  ACTIVE: "success",
  UPCOMING: "warning",
  EXPIRED: "neutral",
  CLOSED: "neutral",
};

type TabKey = "today" | "order" | "history" | "members" | "hisab" | "settings";

export function GroupDetail() {
  const { groupId } = useParams<{ groupId: string }>();
  const { data: group, isLoading } = useGroup(groupId);
  const { data: members } = useGroupMembers(groupId);
  const [tab, setTab] = useState<TabKey>("today");
  const [copied, setCopied] = useState(false);

  if (isLoading || !group) {
    return (
      <div className="flex flex-col gap-4">
        <Skeleton className="h-24" />
        <Skeleton className="h-64" />
      </div>
    );
  }

  const isAdmin = group.role === "ADMIN";
  const tabs: { key: TabKey; label: string; adminOnly?: boolean }[] = [
    { key: "today", label: "Today" },
    { key: "order", label: "Today's Order", adminOnly: true },
    { key: "history", label: "History" },
    { key: "members", label: "Members" },
    { key: "hisab", label: "Hisab" },
    { key: "settings", label: "Settings", adminOnly: true },
  ];

  function copyInviteCode() {
    navigator.clipboard.writeText(group!.inviteCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="card flex flex-wrap items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="font-display text-2xl font-semibold text-ink">{group.name}</h1>
            <Badge tone={STATUS_TONE[group.status]}>{group.status}</Badge>
          </div>
          <p className="mt-1 text-sm text-ink-muted">
            🍱 {group.provider.name} · 👥 {members?.length ?? "-"} Members · 💰 ₹{group.pricing.full}{" "}
            Full / ₹{group.pricing.half} Half
          </p>
          <p className="text-xs text-ink-muted">
            {new Date(group.startDate).toLocaleDateString()} →{" "}
            {new Date(group.endDate).toLocaleDateString()}
          </p>
        </div>
        {isAdmin && (
          <button
            onClick={copyInviteCode}
            className="flex items-center gap-2 rounded-xl border border-border bg-cream px-3 py-2 text-sm font-medium text-ink"
          >
            {group.inviteCode}
            {copied ? <Check className="h-4 w-4 text-success" /> : <Copy className="h-4 w-4" />}
          </button>
        )}
      </div>

      <div className="flex gap-1 overflow-x-auto border-b border-border">
        {tabs
          .filter((t) => !t.adminOnly || isAdmin)
          .map((t) => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={clsx(
                "whitespace-nowrap border-b-2 px-4 py-2.5 text-sm font-medium transition-colors",
                tab === t.key
                  ? "border-primary text-primary-deep"
                  : "border-transparent text-ink-muted hover:text-ink"
              )}
            >
              {t.label}
            </button>
          ))}
      </div>

      <div>
        {tab === "today" && <TodayTab group={group} />}
        {tab === "order" && isAdmin && <OrderTab group={group} />}
        {tab === "history" && <HistoryTab group={group} />}
        {tab === "members" && <MembersTab group={group} />}
        {tab === "hisab" && <HisabTab group={group} />}
        {tab === "settings" && isAdmin && <SettingsTab group={group} />}
      </div>
    </div>
  );
}
