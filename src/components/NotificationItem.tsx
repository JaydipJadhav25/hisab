import { clsx } from "clsx";
import type { AppNotification } from "@/types";

export function NotificationItem({
  notification,
  onRead,
}: {
  notification: AppNotification;
  onRead?: () => void;
}) {
  return (
    <button
      onClick={onRead}
      className={clsx(
        "flex w-full flex-col gap-1 rounded-xl border px-4 py-3 text-left transition-colors",
        notification.read ? "border-border bg-white" : "border-primary/30 bg-primary/5"
      )}
    >
      <p className="text-sm font-medium text-ink">{notification.title}</p>
      <p className="text-sm text-ink-muted">{notification.body}</p>
    </button>
  );
}
