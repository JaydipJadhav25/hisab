import type { MemberHisab } from "@/types";
import { PaymentStatusBadge } from "./PaymentStatus";

export function HisabSummary({ hisab }: { hisab: MemberHisab }) {
  return (
    <div className="card flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <p className="font-display text-lg font-semibold">{hisab.name}</p>
        <PaymentStatusBadge status={hisab.status} />
      </div>
      <div className="grid grid-cols-3 gap-3 text-center">
        <div>
          <p className="text-2xl font-semibold text-ink">{hisab.full}</p>
          <p className="text-xs text-ink-muted">Full</p>
        </div>
        <div>
          <p className="text-2xl font-semibold text-ink">{hisab.half}</p>
          <p className="text-xs text-ink-muted">Half</p>
        </div>
        <div>
          <p className="text-2xl font-semibold text-ink">{hisab.none}</p>
          <p className="text-xs text-ink-muted">None</p>
        </div>
      </div>
      <div className="grid grid-cols-3 gap-3 border-t border-border pt-4 text-center">
        <div>
          <p className="text-lg font-semibold text-ink">₹{hisab.amount}</p>
          <p className="text-xs text-ink-muted">Total</p>
        </div>
        <div>
          <p className="text-lg font-semibold text-success">₹{hisab.paid}</p>
          <p className="text-xs text-ink-muted">Paid</p>
        </div>
        <div>
          <p className="text-lg font-semibold text-danger">₹{hisab.pending}</p>
          <p className="text-xs text-ink-muted">Pending</p>
        </div>
      </div>
    </div>
  );
}
