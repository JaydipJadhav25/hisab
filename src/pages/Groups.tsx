import { useState } from "react";
import { Link } from "react-router-dom";
import { Plus, Users, KeyRound } from "lucide-react";
import { useMyGroups, useJoinGroup } from "@/api/generated/groups";
import { GroupCard } from "@/components/GroupCard";
import { Skeleton } from "@/components/ui/Skeleton";
import { EmptyState } from "@/components/ui/EmptyState";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";

export function Groups() {
  const { data: groups, isLoading } = useMyGroups();
  const [inviteCode, setInviteCode] = useState("");
  const joinGroup = useJoinGroup();

  async function handleJoin() {
    if (!inviteCode.trim()) return;
    try {
      await joinGroup.mutateAsync(inviteCode.trim().toUpperCase());
      setInviteCode("");
    } catch {
      // error shown below
    }
  }

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="font-display text-2xl font-semibold text-ink">My Groups</h1>
        <Link to="/groups/create" className="btn-primary px-4 py-2 text-sm">
          <Plus className="h-4 w-4" /> Create Group
        </Link>
      </div>

      <div className="card flex flex-col gap-3 sm:flex-row sm:items-end">
        <div className="flex-1">
          <Input
            label="Have a group code?"
            placeholder="KAKU-7F29"
            value={inviteCode}
            onChange={(e) => setInviteCode(e.target.value)}
          />
        </div>
        <Button
          variant="secondary"
          onClick={handleJoin}
          isLoading={joinGroup.isPending}
          className="sm:mb-0"
        >
          <KeyRound className="h-4 w-4" /> Join Group
        </Button>
      </div>
      {joinGroup.isError && (
        <p className="-mt-4 text-sm text-danger">
          {(joinGroup.error as any)?.friendlyMessage ?? "Could not join that group."}
        </p>
      )}

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
          description="Create a group, or join one using an invite code from a friend."
        />
      )}
    </div>
  );
}
