import { Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  FileText,
  MessageSquare,
  Flag,
  ChevronLeft,
  ShieldCheck,
  AlertCircle,
  Clock,
  UserCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

const modNavItems = [
  { icon: LayoutDashboard, label: "Dashboard", href: "/moderator" },
  {
    icon: Flag,
    label: "Fila de Moderação",
    href: "/moderator/queue",
    badge: 12,
  },
  { icon: FileText, label: "Posts Reportados", href: "/moderator/posts" },
  { icon: MessageSquare, label: "Comentários", href: "/moderator/comments" },
  { icon: AlertCircle, label: "Denúncias", href: "/moderator/reports" },
  { icon: Clock, label: "Histórico", href: "/moderator/history" },
  { icon: UserCircle, label: "Meu Perfil", href: "/moderator/profile" },
];

export function ModeratorSidebar() {
  const location = useLocation();

  return (
    <aside className="fixed left-0 top-0 z-40 h-screen w-64 border-r border-border bg-card">
      <div className="flex h-full flex-col">
        {/* Header */}
        <div className="flex h-16 items-center gap-3 border-b border-border px-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-500/20">
            <ShieldCheck className="h-5 w-5 text-emerald-500" />
          </div>
          <div>
            <h1 className="font-bold text-foreground">Moderação</h1>
            <p className="text-xs text-muted-foreground">Alldev</p>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-1 overflow-y-auto p-4">
          {modNavItems.map((item) => {
            const isActive =
              location.pathname === item.href ||
              (item.href !== "/moderator" &&
                location.pathname.startsWith(item.href));

            return (
              <Link
                key={item.href}
                to={item.href}
                className={cn(
                  "flex items-center justify-between rounded-lg px-3 py-2.5 text-sm font-medium transition-all",
                  isActive
                    ? "bg-emerald-500 text-white"
                    : "text-muted-foreground hover:bg-accent hover:text-foreground"
                )}
              >
                <div className="flex items-center gap-3">
                  <item.icon className="h-5 w-5" />
                  {item.label}
                </div>
                {item.badge && (
                  <Badge
                    variant={isActive ? "secondary" : "destructive"}
                    size="sm"
                  >
                    {item.badge}
                  </Badge>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Info Card */}
        <div className="mx-4 mb-4 rounded-lg border border-border bg-muted/50 p-3">
          <p className="text-xs text-muted-foreground">
            <strong className="text-foreground">Dica:</strong> Priorize
            denúncias com mais de 24h sem resposta.
          </p>
        </div>

        {/* Back to site */}
        <div className="border-t border-border p-4">
          <Link
            to="/"
            className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
          >
            <ChevronLeft className="h-4 w-4" />
            Voltar ao site
          </Link>
        </div>
      </div>
    </aside>
  );
}
