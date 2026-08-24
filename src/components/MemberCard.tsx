import type { GroupMember } from "@/types";
import { Badge } from "./ui/Badge";

export function MemberCard({
  member,
  canRemove,
  onRemove,
}: {
  member: GroupMember;
  canRemove?: boolean;
  onRemove?: () => void;
}) {
  const user = typeof member.userId === "object" ? member.userId : null;
  return (
    <div className="card flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 font-medium text-primary-deep">
          {user?.name?.charAt(0).toUpperCase() ?? "?"}
        </div>
        <div>
          <p className="font-medium text-ink">{user?.name ?? "Unknown"}</p>
          <p className="text-sm text-ink-muted">{user?.email}</p>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <Badge tone={member.role === "ADMIN" ? "primary" : "neutral"}>{member.role}</Badge>
        {canRemove && (
          <button onClick={onRemove} className="text-sm text-danger hover:underline">
            Remove
          </button>
        )}
      </div>
    </div>
  );
}
