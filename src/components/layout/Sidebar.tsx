import { Link, useLocation } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import {
  Home,
  Hash,
  Users,
  TrendingUp,
  HelpCircle,
  Loader2,
  Star,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { tagService } from "@/services/tag.service";
import { statsService } from "@/services/stats.service";
import { formatNumber } from "@/lib/formatNumber";
import { useAuthStore } from "@/stores/authStore";

interface SidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
}

const navItems = [
  { icon: Home, label: "Home", href: "/" },
  { icon: Hash, label: "Tags", href: "/tags" },
  { icon: Users, label: "Usuários", href: "/users" },
  { icon: TrendingUp, label: "Trending", href: "/?filter=votes" },
  { icon: HelpCircle, label: "Sem Resposta", href: "/?filter=unanswered" },
];

const authNavItems = [
  { icon: Star, label: "Minhas Tags", href: "/tags/followed/my-tags" },
];

export function Sidebar({ isOpen, onClose }: SidebarProps) {
  const location = useLocation();
  const { isAuthenticated } = useAuthStore();

  // Fetch popular tags from API
  const { data: tags, isLoading: isLoadingTags } = useQuery({
    queryKey: ["tags", "popular"],
    queryFn: () => tagService.getTags("popular"),
    staleTime: 5 * 60 * 1000, // Cache for 5 minutes
  });

  // Fetch community stats from API
  const { data: stats, isLoading: isLoadingStats } = useQuery({
    queryKey: ["stats", "community"],
    queryFn: () => statsService.getCommunityStats(),
    staleTime: 2 * 60 * 1000, // Cache for 2 minutes
  });

  const topTags = tags?.slice(0, 5) || [];

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
          "fixed left-0 top-16 z-40 h-[calc(100vh-4rem)] w-64 border-r border-border bg-sidebar transition-transform duration-300 lg:translate-x-0",
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex h-full flex-col gap-6 overflow-y-auto p-4 scrollbar-thin">
          {/* Navigation */}
          <nav className="space-y-1">
            {navItems.map((item) => {
              const isActive =
                location.pathname === item.href ||
                (item.href !== "/" && location.pathname.startsWith(item.href));

              return (
                <Link
                  key={item.href}
                  to={item.href}
                  onClick={onClose}
                  className={cn(
                    "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                    isActive
                      ? "bg-primary/10 text-primary"
                      : "text-muted-foreground hover:bg-accent hover:text-foreground"
                  )}
                >
                  <item.icon className="h-5 w-5" />
                  {item.label}
                </Link>
              );
            })}

            {/* Authenticated-only nav items */}
            {isAuthenticated && (
              <>
                <div className="my-2 border-t border-border" />
                {authNavItems.map((item) => {
                  const isActive = location.pathname === item.href;

                  return (
                    <Link
                      key={item.href}
                      to={item.href}
                      onClick={onClose}
                      className={cn(
                        "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                        isActive
                          ? "bg-primary/10 text-primary"
                          : "text-muted-foreground hover:bg-accent hover:text-foreground"
                      )}
                    >
                      <item.icon className="h-5 w-5" />
                      {item.label}
                    </Link>
                  );
                })}
              </>
            )}
          </nav>

          {/* Popular Tags */}
          <div className="space-y-3" data-tour="sidebar">
            <h3 className="px-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Tags Populares
            </h3>
            <div className="space-y-1">
              {isLoadingTags ? (
                <div className="flex justify-center py-4">
                  <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
                </div>
              ) : topTags.length > 0 ? (
                topTags.map((tag) => (
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
                ))
              ) : (
                <p className="px-3 py-2 text-xs text-muted-foreground">
                  Nenhuma tag disponível
                </p>
              )}
            </div>
          </div>

          {/* Stats */}
          <div className="mt-auto rounded-lg border border-border bg-card/50 p-4">
            <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Comunidade
            </h3>
            {isLoadingStats ? (
              <div className="flex justify-center py-4">
                <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
              </div>
            ) : stats ? (
              <div className="grid grid-cols-2 gap-3 text-center">
                <div>
                  <div className="text-2xl font-bold text-primary">
                    {formatNumber(stats.totalPosts)}
                  </div>
                  <div className="text-xs text-muted-foreground">Posts</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-secondary">
                    {formatNumber(stats.totalUsers)}
                  </div>
                  <div className="text-xs text-muted-foreground">Usuários</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-success">
                    {formatNumber(stats.resolvedPosts)}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    Resolvidos
                  </div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-warning">
                    {formatNumber(stats.todayPosts)}
                  </div>
                  <div className="text-xs text-muted-foreground">Hoje</div>
                </div>
              </div>
            ) : (
              <div className="text-center py-4 text-xs text-muted-foreground">
                Estatísticas indisponíveis
              </div>
            )}
          </div>
        </div>
      </aside>
    </>
  );
}
