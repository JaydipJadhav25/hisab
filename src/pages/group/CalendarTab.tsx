import { useMemo, useState } from "react";
import { clsx } from "clsx";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import type { Group } from "@/types";
import { useTiffinCalendar, useTodayOrder } from "@/api/generated/tiffin";
import { Skeleton } from "@/components/ui/Skeleton";
import {
  buildMonthGrid,
  monthLabel,
  shiftMonth,
  toMonthKey,
  todayISODate,
} from "@/utils/calendar";

const WEEKDAY_LABELS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export function CalendarTab({ group }: { group: Group }) {
  const groupStartMonth = toMonthKey(group.startDate.slice(0, 10));
  const groupEndMonth = toMonthKey(group.endDate.slice(0, 10));
  const today = todayISODate();

  const [month, setMonth] = useState(() => {
    const current = toMonthKey(today);
    if (current >= groupStartMonth && current <= groupEndMonth) return current;
    return groupStartMonth;
  });
  const [selectedDate, setSelectedDate] = useState<string | null>(null);

  const { data: days, isLoading } = useTiffinCalendar(group.id, month);
  const { data: dayOrder, isLoading: isLoadingDay } = useTodayOrder(
    selectedDate ? group.id : undefined,
    selectedDate ?? undefined
  );

  const summaryByDate = useMemo(() => {
    const map = new Map<string, { full: number; half: number; none: number; responded: number }>();
    (days ?? []).forEach((d) => map.set(d.date, d));
    return map;
  }, [days]);

  const weeks = useMemo(() => buildMonthGrid(month), [month]);
  const canGoPrev = shiftMonth(month, -1) >= groupStartMonth;
  const canGoNext = shiftMonth(month, 1) <= groupEndMonth;

  function isWithinGroupRange(date: string) {
    return date >= group.startDate.slice(0, 10) && date <= group.endDate.slice(0, 10);
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="card">
        <div className="mb-4 flex items-center justify-between">
          <button
            onClick={() => canGoPrev && setMonth((m) => shiftMonth(m, -1))}
            disabled={!canGoPrev}
            className="rounded-lg p-2 text-ink-muted hover:bg-cream disabled:opacity-30 disabled:hover:bg-transparent"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <p className="font-display text-lg font-semibold text-ink">{monthLabel(month)}</p>
          <button
            onClick={() => canGoNext && setMonth((m) => shiftMonth(m, 1))}
            disabled={!canGoNext}
            className="rounded-lg p-2 text-ink-muted hover:bg-cream disabled:opacity-30 disabled:hover:bg-transparent"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>

        {isLoading ? (
          <Skeleton className="h-72" />
        ) : (
          <div className="flex flex-col gap-1">
            <div className="grid grid-cols-7 gap-1 text-center text-xs font-medium text-ink-muted">
              {WEEKDAY_LABELS.map((w) => (
                <div key={w} className="py-1">
                  {w}
                </div>
              ))}
            </div>
            {weeks.map((week, wi) => (
              <div key={wi} className="grid grid-cols-7 gap-1">
                {week.map((date, di) => {
                  if (!date) return <div key={di} className="aspect-square" />;
                  const inRange = isWithinGroupRange(date);
                  const summary = summaryByDate.get(date);
                  const isToday = date === today;
                  const isSelected = date === selectedDate;
                  return (
                    <button
                      key={date}
                      disabled={!inRange}
                      onClick={() => setSelectedDate(date)}
                      className={clsx(
                        "flex aspect-square flex-col items-center justify-center gap-0.5 rounded-xl border text-xs transition-colors",
                        !inRange && "cursor-not-allowed border-transparent text-ink-muted/30",
                        inRange && !isSelected && "border-border bg-white hover:border-primary/40",
                        isSelected && "border-primary bg-primary/10",
                        isToday && !isSelected && "border-primary/50"
                      )}
                    >
                      <span className={clsx("font-medium", inRange ? "text-ink" : "text-ink-muted/40")}>
                        {Number(date.slice(8, 10))}
                      </span>
                      {summary && (
                        <span className="flex gap-0.5">
                          {summary.full > 0 && <span className="h-1.5 w-1.5 rounded-full bg-primary" />}
                          {summary.half > 0 && <span className="h-1.5 w-1.5 rounded-full bg-warning" />}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            ))}
          </div>
        )}

        <div className="mt-4 flex items-center gap-4 text-xs text-ink-muted">
          <span className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-primary" /> Full orders that day
          </span>
          <span className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-warning" /> Half orders that day
          </span>
        </div>
      </div>

      {selectedDate && (
        <div className="card">
          <div className="mb-4 flex items-center justify-between">
            <p className="font-display text-lg font-semibold text-ink">
              {new Date(selectedDate).toLocaleDateString("en-IN", {
                weekday: "long",
                day: "numeric",
                month: "long",
              })}
            </p>
            <button
              onClick={() => setSelectedDate(null)}
              className="rounded-lg p-1.5 text-ink-muted hover:bg-cream"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          {isLoadingDay ? (
            <Skeleton className="h-32" />
          ) : !dayOrder || dayOrder.records.length === 0 ? (
            <p className="text-sm text-ink-muted">No one had responded by this date.</p>
          ) : (
            <div className="flex flex-col gap-4">
              <div className="grid grid-cols-3 gap-3">
                <div className="rounded-xl bg-cream p-3 text-center">
                  <p className="text-xl font-semibold text-ink">{dayOrder.summary.FULL}</p>
                  <p className="text-xs text-ink-muted">🍱 Full</p>
                </div>
                <div className="rounded-xl bg-cream p-3 text-center">
                  <p className="text-xl font-semibold text-ink">{dayOrder.summary.HALF}</p>
                  <p className="text-xs text-ink-muted">🥣 Half</p>
                </div>
                <div className="rounded-xl bg-cream p-3 text-center">
                  <p className="text-xl font-semibold text-ink">{dayOrder.summary.NONE}</p>
                  <p className="text-xs text-ink-muted">❌ None</p>
                </div>
              </div>
              <div className="flex flex-col gap-2">
                {dayOrder.records.map((r) => {
                  const user = typeof r.userId === "object" ? r.userId : null;
                  return (
                    <div
                      key={r.id}
                      className="flex items-center justify-between rounded-xl border border-border px-4 py-2.5"
                    >
                      <span className="text-ink">{user?.name ?? "Member"}</span>
                      <span className="text-sm text-ink-muted">
                        {r.type} · ₹{r.priceAtTime}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}