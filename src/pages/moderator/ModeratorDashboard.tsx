import { useState, useEffect } from 'react';
import { 
  Flag, 
  FileText, 
  MessageSquare, 
  Clock,
  CheckCircle,
  AlertTriangle,
  TrendingUp,
  Eye,
  Loader2
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Link } from 'react-router-dom';
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { moderatorService, ModeratorStats, RecentQueueItem } from '@/services/moderator.service';
import { toast } from 'sonner';

export default function ModeratorDashboard() {
  const [stats, setStats] = useState<ModeratorStats | null>(null);
  const [pendingItems, setPendingItems] = useState<RecentQueueItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [statsData, queueItems] = await Promise.all([
        moderatorService.getDashboardStats(),
        moderatorService.getRecentQueueItems(3),
      ]);
      setStats(statsData);
      setPendingItems(queueItems);
    } catch (error: any) {
      console.error('Error loading dashboard:', error);
      toast.error(error.response?.data?.error?.message || 'Erro ao carregar dashboard');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="h-12 w-12 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">Dashboard de Moderação</h1>
        <p className="text-muted-foreground">Bem-vindo de volta! Aqui está o resumo das atividades.</p>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Pendentes</p>
                <p className="text-3xl font-bold text-foreground">{stats?.pendingReports || 0}</p>
              </div>
              <div className="rounded-lg bg-orange-500/10 p-3">
                <Clock className="h-6 w-6 text-orange-500" />
              </div>
            </div>
            <p className="mt-2 text-sm text-warning">{stats?.urgentReports || 0} urgentes</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Resolvidos Hoje</p>
                <p className="text-3xl font-bold text-foreground">{stats?.resolvedToday || 0}</p>
              </div>
              <div className="rounded-lg bg-green-500/10 p-3">
                <CheckCircle className="h-6 w-6 text-green-500" />
              </div>
            </div>
            <p className={`mt-2 text-sm ${stats?.resolvedPercentageChange && stats.resolvedPercentageChange >= 0 ? 'text-success' : 'text-destructive'}`}>
              {stats?.resolvedPercentageChange && stats.resolvedPercentageChange >= 0 ? '+' : ''}{stats?.resolvedPercentageChange || 0}% vs ontem
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Posts Ocultos</p>
                <p className="text-3xl font-bold text-foreground">{stats?.hiddenPostsThisWeek || 0}</p>
              </div>
              <div className="rounded-lg bg-blue-500/10 p-3">
                <FileText className="h-6 w-6 text-blue-500" />
              </div>
            </div>
            <p className="mt-2 text-sm text-muted-foreground">Esta semana</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Avisos Enviados</p>
                <p className="text-3xl font-bold text-foreground">{stats?.warningsThisMonth || 0}</p>
              </div>
              <div className="rounded-lg bg-amber-500/10 p-3">
                <AlertTriangle className="h-6 w-6 text-amber-500" />
              </div>
            </div>
            <p className="mt-2 text-sm text-muted-foreground">Este mês</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Queue Preview */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Flag className="h-5 w-5 text-orange-500" />
              Fila de Moderação
            </CardTitle>
            <Button variant="outline" size="sm" asChild>
              <Link to="/moderator/queue">Ver todos</Link>
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {pendingItems.map((item) => (
                <div 
                  key={item.id} 
                  className="flex items-start gap-3 rounded-lg border border-border p-3 transition-colors hover:bg-accent/50"
                >
                  <Avatar size="sm">
                    <AvatarImage src={item.author.avatarUrl} />
                    <AvatarFallback>{item.author.username.slice(0, 2).toUpperCase()}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <Badge variant={item.type === 'post' ? 'default' : 'secondary'} size="sm">
                        {item.type === 'post' ? 'Post' : 'Comentário'}
                      </Badge>
                      <Badge variant="destructive" size="sm">
                        {item.reports} denúncias
                      </Badge>
                    </div>
                    <p className="mt-1 font-medium text-foreground truncate">{item.title}</p>
                    <p className="text-sm text-muted-foreground">
                      por @{item.author.username} • {formatDistanceToNow(new Date(item.createdAt), { addSuffix: true, locale: ptBR })}
                    </p>
                  </div>
                  <Button variant="ghost" size="icon">
                    <Eye className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions & Guidelines */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Ações Rápidas</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-3 sm:grid-cols-2">
                <Button variant="outline" className="justify-start h-auto py-3" asChild>
                  <Link to="/moderator/queue">
                    <Flag className="mr-2 h-4 w-4 text-orange-500" />
                    <div className="text-left">
                      <div className="font-medium">Fila de Moderação</div>
                      <div className="text-xs text-muted-foreground">{stats?.pendingReports || 0} itens pendentes</div>
                    </div>
                  </Link>
                </Button>
                <Button variant="outline" className="justify-start h-auto py-3" asChild>
                  <Link to="/moderator/reports">
                    <FileText className="mr-2 h-4 w-4 text-blue-500" />
                    <div className="text-left">
                      <div className="font-medium">Denúncias</div>
                      <div className="text-xs text-muted-foreground">{stats?.reportsThisWeek || 0} esta semana</div>
                    </div>
                  </Link>
                </Button>
                <Button variant="outline" className="justify-start h-auto py-3" asChild>
                  <Link to="/moderator/queue">
                    <MessageSquare className="mr-2 h-4 w-4 text-purple-500" />
                    <div className="text-left">
                      <div className="font-medium">Fila</div>
                      <div className="text-xs text-muted-foreground">{stats?.urgentReports || 0} urgentes</div>
                    </div>
                  </Link>
                </Button>
                <Button variant="outline" className="justify-start h-auto py-3" asChild>
                  <Link to="/moderator/history">
                    <TrendingUp className="mr-2 h-4 w-4 text-green-500" />
                    <div className="text-left">
                      <div className="font-medium">Meu Histórico</div>
                      <div className="text-xs text-muted-foreground">Ver atividades</div>
                    </div>
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Diretrizes de Moderação</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-start gap-3 text-sm">
                <CheckCircle className="h-4 w-4 text-success mt-0.5 flex-shrink-0" />
                <p className="text-muted-foreground">
                  <strong className="text-foreground">Pode:</strong> Aprovar/rejeitar conteúdo, editar posts, ocultar comentários, enviar avisos a usuários
                </p>
              </div>
              <div className="flex items-start gap-3 text-sm">
                <AlertTriangle className="h-4 w-4 text-warning mt-0.5 flex-shrink-0" />
                <p className="text-muted-foreground">
                  <strong className="text-foreground">Não pode:</strong> Banir usuários, deletar contas, alterar configurações do sistema, gerenciar tags
                </p>
              </div>
              <div className="flex items-start gap-3 text-sm">
                <Flag className="h-4 w-4 text-destructive mt-0.5 flex-shrink-0" />
                <p className="text-muted-foreground">
                  <strong className="text-foreground">Escalar:</strong> Casos graves devem ser encaminhados para administradores
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
