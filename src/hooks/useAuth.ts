import { useMe } from "@/api/generated/auth";

/**
 * Thin convenience wrapper around the /auth/me query.
 * Kept as a hook (rather than a stored context value) so components
 * always read live cache state from TanStack Query.
 */
export function useAuth() {
  const { data: user, isLoading, isError } = useMe();
  return {
    user: user ?? null,
    isLoading,
    isAuthenticated: !!user && !isError,
  };
}
