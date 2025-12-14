import { Outlet, Link } from "react-router-dom";
import { Code2 } from "lucide-react";

export function AuthLayout() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-hero p-4">
      <Link to="/" className="flex items-center gap-2 font-bold text-2xl mb-8">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-secondary">
          <img src="/logo.png" alt="Logo" className="h-9 w-9 object-contain" />
        </div>
        <span>
          <span className="text-primary">All</span>
          <span className="text-foreground">dev</span>
        </span>
      </Link>

      <Outlet />

      <p className="mt-8 text-sm text-muted-foreground text-center">
        © {new Date().getFullYear()} Alldev - Comunidade de Desenvolvedores
      </p>
    </div>
  );
}
