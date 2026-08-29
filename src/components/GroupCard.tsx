import { Link } from "react-router-dom";
import { Check, Copy, Users } from "lucide-react";
import type { Group } from "@/types";
import { Badge } from "./ui/Badge";
import { useState } from "react";

const STATUS_TONE: Record<string, "success" | "warning" | "neutral" | "danger"> = {
  ACTIVE: "success",
  UPCOMING: "warning",
  EXPIRED: "neutral",
  CLOSED: "neutral",
};

export function GroupCard({ group, memberCount }: { group: Group; memberCount?: number }) {

  //  console.log("group : " , group);
    const [copied, setCopied] = useState(false);
  

   
  function copyInviteCode() {
    navigator.clipboard.writeText(group!.inviteCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }


  return (
    <Link
      to={`/groups/${group.id}`}
      className="card flex flex-col gap-3 transition-shadow hover:shadow-cardHover"
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="font-display text-lg font-semibold text-ink">{group.name}</p>
          <p className="text-sm text-ink-muted">{group.provider.name}</p>
        </div>
        <Badge tone={STATUS_TONE[group.status]}>{group.status}</Badge>
        <button
            onClick={copyInviteCode}
            className="flex items-center gap-2 rounded-xl border border-border bg-cream px-3 py-2 text-sm font-medium text-ink"
          >
            {group.inviteCode}
            {copied ? <Check className="h-4 w-4 text-success" /> : <Copy className="h-4 w-4" />}
          </button>
      </div>
      <div className="flex items-center justify-between text-sm text-ink-muted">
        <span className="flex items-center gap-1.5">
          <Users className="h-4 w-4" />
          {memberCount ?? "-"} members
        </span>
        <span>
          ₹{group.pricing.full} Full / ₹{group.pricing.half} Half
        </span>
      </div>
    </Link>
  );
}
