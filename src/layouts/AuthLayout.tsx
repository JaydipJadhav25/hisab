import { Link, Outlet } from "react-router-dom";
import { Logo } from "@/components/Logo";

export function AuthLayout() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-surface px-4 py-12">
      <div className="w-full max-w-md">
        <div className="mb-8 flex justify-center">
          <Link to="/">
            <Logo className="h-10 w-10" withWordmark />
          </Link>
        </div>
        <div className="card">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
