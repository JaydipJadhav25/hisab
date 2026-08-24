import { Link } from "react-router-dom";
import { Plus, Users } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useMyGroups } from "@/api/generated/groups";
import { GroupCard } from "@/components/GroupCard";
import { Skeleton } from "@/components/ui/Skeleton";
import { EmptyState } from "@/components/ui/EmptyState";

export function Dashboard() {
  const { user } = useAuth();
  const { data: groups, isLoading } = useMyGroups();

  const activeGroups = groups?.filter((g) => g.status === "ACTIVE").length ?? 0;
  const firstName = user?.name?.split(" ")[0] ?? "";

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="font-display text-2xl font-semibold text-ink">
          Good Morning, {firstName} 👋
        </h1>
        <p className="mt-1 text-ink-muted">
          {groups?.length ?? 0} groups · {activeGroups} active
        </p>
      </div>

      <div className="flex items-center justify-between">
        <h2 className="font-display text-lg font-semibold text-ink">Your Groups</h2>
        <div className="flex gap-2">
          <Link to="/groups/create" className="btn-secondary px-3 py-2 text-sm">
            <Plus className="h-4 w-4" /> New Group
          </Link>
        </div>
      </div>

      {isLoading ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-32" />
          ))}
        </div>
      ) : groups && groups.length > 0 ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {groups.map((group) => (
            <GroupCard key={group.id} group={group} />
          ))}
        </div>
      ) : (
        <EmptyState
          icon={Users}
          title="No groups yet"
          description="Create a group for your tiffin circle, or join one with an invite code."
          action={
            <Link to="/groups/create" className="btn-primary px-4 py-2 text-sm">
              Create your first group
            </Link>
          }
        />
      )}
    </div>
  );
}
