import { Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  FileText,
  MessageSquare,
  Hash,
  Flag,
  Settings,
  ChevronLeft,
  Shield,
  Bell,
  Music,
  Lightbulb,
  Mail,
  UserCircle,
  X,
  Cookie,
} from "lucide-react";
import { cn } from "@/lib/utils";

const adminNavItems = [
  { icon: LayoutDashboard, label: "Dashboard", href: "/admin" },
  { icon: Users, label: "Usuários", href: "/admin/users" },
  { icon: FileText, label: "Posts", href: "/admin/posts" },
  { icon: MessageSquare, label: "Comentários", href: "/admin/comments" },
  { icon: Hash, label: "Tags", href: "/admin/tags" },
  { icon: Flag, label: "Denúncias", href: "/admin/reports" },
  { icon: Bell, label: "Notificações", href: "/admin/notifications" },
  {
    icon: Music,
    label: "Sons de Notificação",
    href: "/admin/notification-sounds",
  },
  {
    icon: Shield,
    label: "Política de Privacidade",
    href: "/admin/privacy-policy",
  },
  { icon: FileText, label: "Termos de Uso", href: "/admin/terms-of-use" },
  { icon: Cookie, label: "Política de Cookies", href: "/admin/cookie-policy" },
  { icon: Lightbulb, label: "Sugestões", href: "/admin/features" },
  { icon: Mail, label: "Mensagens", href: "/admin/messages" },
  { icon: Settings, label: "Configurações", href: "/admin/settings" },
  { icon: UserCircle, label: "Meu Perfil", href: "/admin/profile" },
];

interface AdminSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AdminSidebar({ isOpen, onClose }: AdminSidebarProps) {
  const location = useLocation();

  return (
    <>
      {/* Overlay para mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed left-0 top-0 z-50 h-screen w-64 border-r border-border bg-card transition-transform duration-300 ease-in-out",
          // Mobile: desliza da esquerda
          "lg:translate-x-0",
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex h-full flex-col">
          {/* Header */}
          <div className="flex h-16 items-center justify-between border-b border-border px-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary">
                <Shield className="h-5 w-5 text-primary-foreground" />
              </div>
              <div>
                <h1 className="font-bold text-foreground">Admin Panel</h1>
                <p className="text-xs text-muted-foreground">Alldev</p>
              </div>
            </div>

            {/* Botão fechar (apenas mobile) */}
            <button
              onClick={onClose}
              className="lg:hidden rounded-lg p-2 hover:bg-accent transition-colors"
              aria-label="Fechar menu"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 space-y-1 overflow-y-auto p-4">
            {adminNavItems.map((item) => {
              const isActive =
                location.pathname === item.href ||
                (item.href !== "/admin" &&
                  location.pathname.startsWith(item.href));

              return (
                <Link
                  key={item.href}
                  to={item.href}
                  onClick={onClose} // Fecha o sidebar ao clicar em um link (mobile)
                  className={cn(
                    "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all",
                    isActive
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:bg-accent hover:text-foreground"
                  )}
                >
                  <item.icon className="h-5 w-5 flex-shrink-0" />
                  <span className="truncate">{item.label}</span>
                </Link>
              );
            })}
          </nav>

          {/* Back to site */}
          <div className="border-t border-border p-4">
            <Link
              to="/"
              onClick={onClose}
              className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
            >
              <ChevronLeft className="h-4 w-4 flex-shrink-0" />
              <span>Voltar ao site</span>
            </Link>
          </div>
        </div>
      </aside>
    </>
  );
}
