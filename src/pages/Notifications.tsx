import { Bell } from "lucide-react";
import { useNotifications, useMarkNotificationRead } from "@/api/generated/notifications";
import { NotificationItem } from "@/components/NotificationItem";
import { Skeleton } from "@/components/ui/Skeleton";
import { EmptyState } from "@/components/ui/EmptyState";

export function Notifications() {
  const { data: notifications, isLoading } = useNotifications();
  const markRead = useMarkNotificationRead();

  return (
    <div className="mx-auto flex max-w-xl flex-col gap-4">
      <h1 className="font-display text-2xl font-semibold text-ink">Notifications</h1>
      {isLoading ? (
        <Skeleton className="h-40" />
      ) : !notifications || notifications.length === 0 ? (
        <EmptyState icon={Bell} title="No notifications yet" />
      ) : (
        <div className="flex flex-col gap-2">
          {notifications.map((n) => (
            <NotificationItem
              key={n.id}
              notification={n}
              onRead={() => !n.read && markRead.mutate(n.id)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
