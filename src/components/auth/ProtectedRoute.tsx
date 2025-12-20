import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuthStore } from "@/stores/authStore";
import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";

interface ProtectedRouteProps {
  allowedRoles?: string[];
  requireAuth?: boolean;
}

export function ProtectedRoute({
  allowedRoles = [],
  requireAuth = true,
}: ProtectedRouteProps) {
  const { user, isAuthenticated } = useAuthStore();
  const location = useLocation();
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    // Small delay to ensure auth state is loaded from localStorage
    const timer = setTimeout(() => {
      setIsChecking(false);
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  // Loading state
  if (isChecking) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  // Check authentication
  if (requireAuth && !isAuthenticated) {
    // Redirect to login and save the attempted location
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Check if user has required roles
  if (allowedRoles.length > 0 && user) {
    const userRoles = user.roles || [];
    const hasRequiredRole = allowedRoles.some((role) =>
      userRoles.includes(role)
    );

    if (!hasRequiredRole) {
      // User is authenticated but doesn't have permission
      return (
        <div className="min-h-screen flex items-center justify-center bg-background">
          <div className="text-center space-y-4 p-8">
            <div className="text-6xl">🔒</div>
            <h1 className="text-2xl font-bold">Acesso Negado</h1>
            <p className="text-muted-foreground max-w-md">
              Você não tem permissão para acessar esta área. Esta página é
              restrita para administradores e moderadores.
            </p>
            <div className="pt-4">
              <a href="/" className="text-primary hover:underline font-medium">
                Voltar para a página inicial
              </a>
            </div>
          </div>
        </div>
      );
    }
  }

  // User is authenticated and has required permissions
  return <Outlet />;
}
