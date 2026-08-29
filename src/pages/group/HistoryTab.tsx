import { useState } from "react";
import { useTiffinHistory } from "@/api/generated/tiffin";
import { Skeleton } from "@/components/ui/Skeleton";
import { EmptyState } from "@/components/ui/EmptyState";
import { Badge } from "@/components/ui/Badge";
import { Input } from "@/components/ui/Input";
import { CalendarClock, Sun, Moon } from "lucide-react";
import type { Group, TiffinType } from "@/types";

const TONE: Record<TiffinType | any, "success" | "warning" | "neutral"> = {
  FULL: "success",
  HALF: "warning",
  NONE: "neutral",
};

export function HistoryTab({ group }: { group: Group }) {
  console.log("group is :", group.id);
  const [date, setDate] = useState("");
  const { data: records, isLoading } = useTiffinHistory(group.id, date ? { date } : undefined);

  console.log("records : ", records);

  // 1. Get today's local date string formatted exactly like your DB values (YYYY-MM-DD)
  const todayString = new Date().toISOString().split("T")[0];

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
          {records.map((r : any) => {
            const user = typeof r.userId === "object" ? r.userId : null;
            
            // 2. Check if this record belongs to today
            const isToday = r.date === todayString;

            return (
              <div 
                key={r.id} 
                className={`card flex items-center justify-between py-3 transition-colors ${
                  isToday 
                    ? "border-l-4 border-primary bg-primary/5 dark:bg-primary/10 shadow-sm" 
                    : ""
                }`}
              >
                <div>
                  <div className="flex items-center gap-2">
                    <p className="font-medium text-ink">{user?.name ?? "Member"}</p>
                    
                    {/* 3. Highlight Today badge */}
                    {isToday && (
                      <span className="rounded bg-primary/20 px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-primary-hover animate-pulse">
                        Today
                      </span>
                    )}
                  </div>
                  
                  {/* 4. Show date along with the active Mode (Day / Night) */}
                  <div className="flex items-center gap-2 mt-0.5 text-xs text-ink-muted">
                    <span>{r.date}</span>
                    <span>•</span>
                    <span className="flex items-center gap-1 font-medium capitalize">
                      {r.mode === "day" ? (
                        <Sun className="h-3 w-3 text-amber-500" />
                      ) : (
                        <Moon className="h-3 w-3 text-indigo-400" />
                      )}
                      {r.mode ?? "day"}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span className="text-sm font-semibold text-ink">₹{r.priceAtTime}</span>
                  <Badge tone={TONE[r?.type]}>{r?.type}</Badge>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
