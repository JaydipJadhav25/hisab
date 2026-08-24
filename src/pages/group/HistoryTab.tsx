import { useState } from "react";
import { useTiffinHistory } from "@/api/generated/tiffin";
import { Skeleton } from "@/components/ui/Skeleton";
import { EmptyState } from "@/components/ui/EmptyState";
import { Badge } from "@/components/ui/Badge";
import { Input } from "@/components/ui/Input";
import { CalendarClock } from "lucide-react";
import type { Group, TiffinType } from "@/types";

const TONE: Record<TiffinType, "success" | "warning" | "neutral"> = {
  FULL: "success",
  HALF: "warning",
  NONE: "neutral",
};

export function HistoryTab({ group }: { group: Group }) {
  const [date, setDate] = useState("");
  const { data: records, isLoading } = useTiffinHistory(group.id, date ? { date } : undefined);

  return (
    <div className="flex flex-col gap-5">
      <div className="max-w-xs">
        <Input label="Filter by date" type="date" value={date} onChange={(e) => setDate(e.target.value)} />
      </div>

      {isLoading ? (
        <Skeleton className="h-48" />
      ) : !records || records.length === 0 ? (
        <EmptyState
          icon={CalendarClock}
          title="No tiffin record yet"
          description="Your daily tiffin history will appear here."
        />
      ) : (
        <div className="flex flex-col gap-2">
          {records.map((r) => {
            const user = typeof r.userId === "object" ? r.userId : null;
            return (
              <div key={r.id} className="card flex items-center justify-between py-3">
                <div>
                  <p className="text-ink">{user?.name ?? "Member"}</p>
                  <p className="text-xs text-ink-muted">{r.date}</p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-sm text-ink-muted">₹{r.priceAtTime}</span>
                  <Badge tone={TONE[r.type]}>{r.type}</Badge>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
