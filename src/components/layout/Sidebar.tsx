import { Link, useLocation } from 'react-router-dom';
import { Home, Hash, Users, TrendingUp, Bookmark, HelpCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { mockTags } from '@/lib/mockData';

interface SidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
}

const navItems = [
  { icon: Home, label: 'Home', href: '/' },
  { icon: Hash, label: 'Tags', href: '/tags' },
  { icon: Users, label: 'Usuários', href: '/users' },
  { icon: TrendingUp, label: 'Trending', href: '/?filter=votes' },
  { icon: HelpCircle, label: 'Sem Resposta', href: '/?filter=unanswered' },
];

export function Sidebar({ isOpen, onClose }: SidebarProps) {
  const location = useLocation();
  const topTags = mockTags.slice(0, 5);

  return (
    <>
      {/* Overlay for mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-background/80 backdrop-blur-sm lg:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={cn(
          'fixed left-0 top-16 z-40 h-[calc(100vh-4rem)] w-64 border-r border-border bg-sidebar transition-transform duration-300 lg:translate-x-0',
          isOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        <div className="flex h-full flex-col gap-6 overflow-y-auto p-4 scrollbar-thin">
          {/* Navigation */}
          <nav className="space-y-1">
            {navItems.map((item) => {
              const isActive = location.pathname === item.href || 
                (item.href !== '/' && location.pathname.startsWith(item.href));
              
              return (
                <Link
                  key={item.href}
                  to={item.href}
                  onClick={onClose}
                  className={cn(
                    'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors',
                    isActive
                      ? 'bg-primary/10 text-primary'
                      : 'text-muted-foreground hover:bg-accent hover:text-foreground'
                  )}
                >
                  <item.icon className="h-5 w-5" />
                  {item.label}
                </Link>
              );
            })}
          </nav>

          {/* Popular Tags */}
          <div className="space-y-3">
            <h3 className="px-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Tags Populares
            </h3>
            <div className="space-y-1">
              {topTags.map((tag) => (
                <Link
                  key={tag.id}
                  to={`/tags/${tag.slug}`}
                  onClick={onClose}
                  className="flex items-center justify-between rounded-lg px-3 py-2 text-sm transition-colors hover:bg-accent"
                >
                  <span className="text-muted-foreground hover:text-foreground">
                    #{tag.name}
                  </span>
                  <Badge variant="outline" className="text-xs">
                    {tag.postCount}
                  </Badge>
                </Link>
              ))}
            </div>
          </div>

          {/* Stats */}
          <div className="mt-auto rounded-lg border border-border bg-card/50 p-4">
            <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Comunidade
            </h3>
            <div className="grid grid-cols-2 gap-3 text-center">
              <div>
                <div className="text-2xl font-bold text-primary">5.2K</div>
                <div className="text-xs text-muted-foreground">Posts</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-secondary">1.8K</div>
                <div className="text-xs text-muted-foreground">Usuários</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-success">3.1K</div>
                <div className="text-xs text-muted-foreground">Resolvidos</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-warning">892</div>
                <div className="text-xs text-muted-foreground">Hoje</div>
              </div>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
