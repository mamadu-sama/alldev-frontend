import { useState, useEffect } from 'react';
import { 
  Users, 
  FileText, 
  MessageSquare, 
  TrendingUp,
  Eye,
  Flag,
  CheckCircle,
  Clock,
  Loader2
} from 'lucide-react';
import { StatsCard } from '@/components/admin/StatsCard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { adminService, type AdminStatistics, type RecentPost, type RecentUser } from '@/services/admin.service';
import { useToast } from '@/hooks/use-toast';
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Link } from 'react-router-dom';

export default function AdminDashboard() {
  const { toast } = useToast();
  const [stats, setStats] = useState<AdminStatistics | null>(null);
  const [recentPosts, setRecentPosts] = useState<RecentPost[]>([]);
  const [recentUsers, setRecentUsers] = useState<RecentUser[]>([]);
  const [isLoadingStats, setIsLoadingStats] = useState(true);
  const [isLoadingPosts, setIsLoadingPosts] = useState(true);
  const [isLoadingUsers, setIsLoadingUsers] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoadingStats(true);
        const statistics = await adminService.getStatistics();
        setStats(statistics);
      } catch (error) {
        toast({
          title: 'Erro ao carregar estatísticas',
          description: 'Não foi possível carregar as estatísticas. Tente novamente.',
          variant: 'destructive',
        });
      } finally {
        setIsLoadingStats(false);
      }
    };

    const loadRecentPosts = async () => {
      try {
        setIsLoadingPosts(true);
        const posts = await adminService.getRecentPosts(5);
        setRecentPosts(posts);
      } catch (error) {
        toast({
          title: 'Erro ao carregar posts',
          description: 'Não foi possível carregar os posts recentes.',
          variant: 'destructive',
        });
      } finally {
        setIsLoadingPosts(false);
      }
    };

    const loadRecentUsers = async () => {
      try {
        setIsLoadingUsers(true);
        const users = await adminService.getRecentUsers(5);
        setRecentUsers(users);
      } catch (error) {
        toast({
          title: 'Erro ao carregar usuários',
          description: 'Não foi possível carregar os usuários recentes.',
          variant: 'destructive',
        });
      } finally {
        setIsLoadingUsers(false);
      }
    };

    loadData();
    loadRecentPosts();
    loadRecentUsers();
  }, [toast]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
        <p className="text-muted-foreground">Visão geral da plataforma Alldev</p>
      </div>

      {/* Stats Grid */}
      {isLoadingStats ? (
        <div className="flex justify-center items-center h-32">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : stats ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <StatsCard
            title="Total de Usuários"
            value={stats.users.total.toLocaleString()}
            change={`+${stats.users.recentWeek} esta semana`}
            changeType="positive"
            icon={Users}
            iconColor="bg-blue-500/10 text-blue-500"
          />
          <StatsCard
            title="Total de Posts"
            value={stats.posts.total.toLocaleString()}
            change={`+${stats.posts.recentWeek} esta semana`}
            changeType="positive"
            icon={FileText}
            iconColor="bg-green-500/10 text-green-500"
          />
          <StatsCard
            title="Comentários"
            value={stats.comments.total.toLocaleString()}
            icon={MessageSquare}
            iconColor="bg-purple-500/10 text-purple-500"
          />
          <StatsCard
            title="Denúncias Pendentes"
            value={stats.reports.pending.toString()}
            changeType={stats.reports.pending > 0 ? "negative" : "positive"}
            icon={Flag}
            iconColor="bg-red-500/10 text-red-500"
          />
        </div>
      ) : null}

      {/* Secondary Stats */}
      {stats && (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <StatsCard
            title="Total de Visualizações"
            value={stats.views.total.toLocaleString()}
            icon={Eye}
            iconColor="bg-cyan-500/10 text-cyan-500"
          />
          <StatsCard
            title="Usuários Ativos"
            value={stats.users.active.toString()}
            change={`${Math.round((stats.users.active / stats.users.total) * 100)}% do total`}
            changeType="positive"
            icon={CheckCircle}
            iconColor="bg-emerald-500/10 text-emerald-500"
          />
          <StatsCard
            title="Total de Tags"
            value={stats.tags.total.toString()}
            icon={TrendingUp}
            iconColor="bg-amber-500/10 text-amber-500"
          />
          <StatsCard
            title="Média por Post"
            value={stats.posts.total > 0 ? Math.round(stats.comments.total / stats.posts.total).toString() : '0'}
            change="comentários"
            icon={MessageSquare}
            iconColor="bg-pink-500/10 text-pink-500"
          />
        </div>
      )}

      {/* Recent Activity */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Recent Posts */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Posts Recentes
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isLoadingPosts ? (
              <div className="flex justify-center items-center h-32">
                <Loader2 className="h-6 w-6 animate-spin text-primary" />
              </div>
            ) : recentPosts.length > 0 ? (
              <div className="space-y-4">
                {recentPosts.map((post) => (
                  <Link 
                    key={post.id} 
                    to={`/posts/${post.slug}`}
                    className="flex items-start gap-3 rounded-lg p-3 transition-colors hover:bg-accent block"
                  >
                    <Avatar size="sm">
                      <AvatarImage src={post.author.avatarUrl || undefined} />
                      <AvatarFallback>{post.author.username.slice(0, 2).toUpperCase()}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-foreground truncate">{post.title}</p>
                      <p className="text-sm text-muted-foreground">
                        por {post.author.username} • {post._count.comments} comentários • {formatDistanceToNow(new Date(post.createdAt), { addSuffix: true, locale: ptBR })}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <p className="text-center text-muted-foreground py-8">Nenhum post recente</p>
            )}
          </CardContent>
        </Card>

        {/* Recent Users */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Novos Usuários
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isLoadingUsers ? (
              <div className="flex justify-center items-center h-32">
                <Loader2 className="h-6 w-6 animate-spin text-primary" />
              </div>
            ) : recentUsers.length > 0 ? (
              <div className="space-y-4">
                {recentUsers.map((user) => (
                  <Link
                    key={user.id}
                    to={`/users/${user.username}`}
                    className="flex items-center gap-3 rounded-lg p-3 transition-colors hover:bg-accent block"
                  >
                    <Avatar>
                      <AvatarImage src={user.avatarUrl || undefined} />
                      <AvatarFallback>{user.username.slice(0, 2).toUpperCase()}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <p className="font-medium text-foreground">{user.username}</p>
                      <p className="text-sm text-muted-foreground">
                        {user.email} • {formatDistanceToNow(new Date(user.createdAt), { addSuffix: true, locale: ptBR })}
                      </p>
                    </div>
                    <Badge variant="level" size="sm">{user.level}</Badge>
                  </Link>
                ))}
              </div>
            ) : (
              <p className="text-center text-muted-foreground py-8">Nenhum usuário recente</p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Ações Rápidas</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <button className="flex flex-col items-center gap-2 rounded-lg border border-border p-4 transition-colors hover:bg-accent">
              <Users className="h-8 w-8 text-blue-500" />
              <span className="text-sm font-medium">Gerenciar Usuários</span>
            </button>
            <button className="flex flex-col items-center gap-2 rounded-lg border border-border p-4 transition-colors hover:bg-accent">
              <Flag className="h-8 w-8 text-red-500" />
              <span className="text-sm font-medium">Ver Denúncias</span>
            </button>
            <button className="flex flex-col items-center gap-2 rounded-lg border border-border p-4 transition-colors hover:bg-accent">
              <FileText className="h-8 w-8 text-green-500" />
              <span className="text-sm font-medium">Moderar Posts</span>
            </button>
            <button className="flex flex-col items-center gap-2 rounded-lg border border-border p-4 transition-colors hover:bg-accent">
              <MessageSquare className="h-8 w-8 text-purple-500" />
              <span className="text-sm font-medium">Ver Comentários</span>
            </button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
