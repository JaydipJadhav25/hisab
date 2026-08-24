import { useTodayOrder } from "@/api/generated/tiffin";
import { Skeleton } from "@/components/ui/Skeleton";
import { EmptyState } from "@/components/ui/EmptyState";
import { ClipboardList } from "lucide-react";
import type { Group } from "@/types";

export function OrderTab({ group }: { group: Group }) {
  const { data: order, isLoading } = useTodayOrder(group.id);

  if (isLoading) return <Skeleton className="h-48" />;
  if (!order || order.records.length === 0) {
    return (
      <EmptyState
        icon={ClipboardList}
        title="No responses yet"
        description="Today's order will appear here as members confirm their tiffin."
      />
    );
  }

  const byType = {
    FULL: order.records.filter((r) => r.type === "FULL"),
    HALF: order.records.filter((r) => r.type === "HALF"),
    NONE: order.records.filter((r) => r.type === "NONE"),
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="grid grid-cols-3 gap-4">
        <div className="card text-center">
          <p className="text-3xl font-semibold text-ink">{order.summary.FULL}</p>
          <p className="text-sm text-ink-muted">🍱 Full</p>
        </div>
        <div className="card text-center">
          <p className="text-3xl font-semibold text-ink">{order.summary.HALF}</p>
          <p className="text-sm text-ink-muted">🥣 Half</p>
        </div>
        <div className="card text-center">
          <p className="text-3xl font-semibold text-ink">{order.summary.NONE}</p>
          <p className="text-sm text-ink-muted">❌ None</p>
        </div>
      </div>

      {(["FULL", "HALF", "NONE"] as const).map((type) =>
        byType[type].length > 0 ? (
          <div key={type}>
            <p className="mb-2 text-sm font-medium uppercase tracking-wide text-ink-muted">
              {type === "FULL" ? "Full" : type === "HALF" ? "Half" : "None"}
            </p>
            <div className="flex flex-col gap-2">
              {byType[type].map((r) => {
                const user = typeof r.userId === "object" ? r.userId : null;
                return (
                  <div key={r.id} className="card flex items-center justify-between py-3">
                    <span className="text-ink">{user?.name ?? "Member"}</span>
                    <span className="text-ink-muted">✓</span>
                  </div>
                );
              })}
            </div>
          </div>
        ) : null
      )}
    </div>
  );
}
