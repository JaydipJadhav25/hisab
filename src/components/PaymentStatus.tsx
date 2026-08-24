import type { PaymentStatus } from "@/types";
import { Badge } from "./ui/Badge";

const LABEL: Record<PaymentStatus, string> = {
  PAID: "Paid",
  PARTIALLY_PAID: "Partially Paid",
  PENDING: "Pending",
};

const TONE: Record<PaymentStatus, "success" | "warning" | "danger"> = {
  PAID: "success",
  PARTIALLY_PAID: "warning",
  PENDING: "danger",
};

export function PaymentStatusBadge({ status }: { status: PaymentStatus }) {
  return <Badge tone={TONE[status]}>{LABEL[status]}</Badge>;
}
