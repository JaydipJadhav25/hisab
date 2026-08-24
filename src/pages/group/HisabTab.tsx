import { useGroupHisab, useMemberHisab } from "@/api/generated/hisab";
import { useRecordPayment } from "@/api/generated/payments";
import { HisabSummary } from "@/components/HisabSummary";
import { Skeleton } from "@/components/ui/Skeleton";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { PaymentStatusBadge } from "@/components/PaymentStatus";
import type { Group } from "@/types";
import { useState } from "react";

export function HisabTab({ group }: { group: Group }) {
  const isAdmin = group.role === "ADMIN";
  const groupHisab = useGroupHisab(isAdmin ? group.id : undefined);
  const myHisab = useMemberHisab(!isAdmin ? group.id : undefined);
  const recordPayment = useRecordPayment(group.id);
  const [amounts, setAmounts] = useState<Record<string, string>>({});

  if (!isAdmin) {
    if (myHisab.isLoading) return <Skeleton className="h-64" />;
    if (!myHisab.data) return <p className="text-ink-muted">No hisab yet for this group.</p>;
    return <HisabSummary hisab={myHisab.data} />;
  }

  if (groupHisab.isLoading) return <Skeleton className="h-64" />;
  if (!groupHisab.data || groupHisab.data.length === 0) {
    return <p className="text-ink-muted">No hisab yet for this group.</p>;
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[640px] border-separate border-spacing-y-2">
        <thead>
          <tr className="text-left text-xs uppercase tracking-wide text-ink-muted">
            <th className="px-3">Member</th>
            <th className="px-3">Full</th>
            <th className="px-3">Half</th>
            <th className="px-3">None</th>
            <th className="px-3">Amount</th>
            <th className="px-3">Paid</th>
            <th className="px-3">Pending</th>
            <th className="px-3">Status</th>
            <th className="px-3">Record Payment</th>
          </tr>
        </thead>
        <tbody>
          {groupHisab.data.map((h) => (
            <tr key={h.userId} className="rounded-xl bg-white shadow-card">
              <td className="rounded-l-xl px-3 py-3 font-medium text-ink">{h.name}</td>
              <td className="px-3 py-3 text-ink-muted">{h.full}</td>
              <td className="px-3 py-3 text-ink-muted">{h.half}</td>
              <td className="px-3 py-3 text-ink-muted">{h.none}</td>
              <td className="px-3 py-3 text-ink">₹{h.amount}</td>
              <td className="px-3 py-3 text-success">₹{h.paid}</td>
              <td className="px-3 py-3 text-danger">₹{h.pending}</td>
              <td className="px-3 py-3">
                <PaymentStatusBadge status={h.status} />
              </td>
              <td className="rounded-r-xl px-3 py-3">
                <div className="flex items-center gap-2">
                  <Input
                    className="w-24 py-2"
                    placeholder="₹"
                    type="number"
                    value={amounts[h.userId] ?? ""}
                    onChange={(e) => setAmounts((prev) => ({ ...prev, [h.userId]: e.target.value }))}
                  />
                  <Button
                    variant="secondary"
                    className="px-3 py-2 text-sm"
                    isLoading={recordPayment.isPending}
                    onClick={() => {
                      const amount = Number(amounts[h.userId]);
                      if (!amount || amount <= 0) return;
                      recordPayment.mutate(
                        { userId: h.userId, amount },
                        { onSuccess: () => setAmounts((prev) => ({ ...prev, [h.userId]: "" })) }
                      );
                    }}
                  >
                    Save
                  </Button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
