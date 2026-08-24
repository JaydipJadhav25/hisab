import { useMyGroups } from "@/api/generated/groups";
import { Link } from "react-router-dom";
import { EmptyState } from "@/components/ui/EmptyState";
import { CalendarClock } from "lucide-react";

export function AllHistory() {
  const { data: groups } = useMyGroups();

  return (
    <div className="flex flex-col gap-4">
      <h1 className="font-display text-2xl font-semibold text-ink">History</h1>
      <p className="text-ink-muted">Pick a group to see its day-by-day tiffin history.</p>
      {!groups || groups.length === 0 ? (
        <EmptyState icon={CalendarClock} title="No groups yet" />
      ) : (
        <div className="flex flex-col gap-2">
          {groups.map((g) => (
            <Link
              key={g.id}
              to={`/groups/${g.id}`}
              className="card flex items-center justify-between py-3 hover:shadow-cardHover"
            >
              <span className="text-ink">{g.name}</span>
              <span className="text-sm text-primary">View history →</span>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
