import { Link, useLocation } from 'react-router-dom';
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
  Lightbulb,
  Mail
} from 'lucide-react';
import { cn } from '@/lib/utils';

const adminNavItems = [
  { icon: LayoutDashboard, label: 'Dashboard', href: '/admin' },
  { icon: Users, label: 'Usuários', href: '/admin/users' },
  { icon: FileText, label: 'Posts', href: '/admin/posts' },
  { icon: MessageSquare, label: 'Comentários', href: '/admin/comments' },
  { icon: Hash, label: 'Tags', href: '/admin/tags' },
  { icon: Flag, label: 'Denúncias', href: '/admin/reports' },
  { icon: Bell, label: 'Notificações', href: '/admin/notifications' },
  { icon: Lightbulb, label: 'Sugestões', href: '/admin/features' },
  { icon: Mail, label: 'Mensagens', href: '/admin/messages' },
  { icon: Settings, label: 'Configurações', href: '/admin/settings' },
];

export function AdminSidebar() {
  const location = useLocation();

  return (
    <aside className="fixed left-0 top-0 z-40 h-screen w-64 border-r border-border bg-card">
      <div className="flex h-full flex-col">
        {/* Header */}
        <div className="flex h-16 items-center gap-3 border-b border-border px-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary">
            <Shield className="h-5 w-5 text-primary-foreground" />
          </div>
          <div>
            <h1 className="font-bold text-foreground">Admin Panel</h1>
            <p className="text-xs text-muted-foreground">Alldev</p>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-1 overflow-y-auto p-4">
          {adminNavItems.map((item) => {
            const isActive = location.pathname === item.href || 
              (item.href !== '/admin' && location.pathname.startsWith(item.href));
            
            return (
              <Link
                key={item.href}
                to={item.href}
                className={cn(
                  'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all',
                  isActive
                    ? 'bg-primary text-primary-foreground'
                    : 'text-muted-foreground hover:bg-accent hover:text-foreground'
                )}
              >
                <item.icon className="h-5 w-5" />
                {item.label}
              </Link>
            );
          })}
        </nav>

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
