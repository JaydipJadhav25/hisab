import { useGroupMembers, useRemoveMember } from "@/api/generated/groups";
import { MemberCard } from "@/components/MemberCard";
import { Skeleton } from "@/components/ui/Skeleton";
import { EmptyState } from "@/components/ui/EmptyState";
import { Users } from "lucide-react";
import type { Group } from "@/types";

export function MembersTab({ group }: { group: Group }) {
  const { data: members, isLoading } = useGroupMembers(group.id);
  const removeMember = useRemoveMember(group.id);
  const isAdmin = group.role === "ADMIN";

  if (isLoading) return <Skeleton className="h-48" />;
  if (!members || members.length === 0) {
    return <EmptyState icon={Users} title="No members yet" />;
  }

  return (
    <div className="flex flex-col gap-3">
      {members.map((m) => (
        <MemberCard
          key={m.id}
          member={m}
          canRemove={isAdmin && m.role !== "ADMIN"}
          onRemove={() => {
            const user = typeof m.userId === "object" ? m.userId : null;
            removeMember.mutate(user?.id ?? "");
          }}
        />
      ))}
    </div>
  );
}
