import { 
  Users, 
  FileText, 
  MessageSquare, 
  TrendingUp,
  Eye,
  Flag,
  CheckCircle,
  Clock
} from 'lucide-react';
import { StatsCard } from '@/components/admin/StatsCard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { mockPosts, mockUsers } from '@/lib/mockData';

export default function AdminDashboard() {
  const recentPosts = mockPosts.slice(0, 5);
  const recentUsers = mockUsers.slice(0, 5);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
        <p className="text-muted-foreground">Visão geral da plataforma Alldev</p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title="Total de Usuários"
          value="1,842"
          change="+12% este mês"
          changeType="positive"
          icon={Users}
          iconColor="bg-blue-500/10 text-blue-500"
        />
        <StatsCard
          title="Total de Posts"
          value="5,234"
          change="+8% este mês"
          changeType="positive"
          icon={FileText}
          iconColor="bg-green-500/10 text-green-500"
        />
        <StatsCard
          title="Comentários"
          value="12,847"
          change="+15% este mês"
          changeType="positive"
          icon={MessageSquare}
          iconColor="bg-purple-500/10 text-purple-500"
        />
        <StatsCard
          title="Denúncias Pendentes"
          value="23"
          change="5 novas hoje"
          changeType="negative"
          icon={Flag}
          iconColor="bg-red-500/10 text-red-500"
        />
      </div>

      {/* Secondary Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title="Visualizações Hoje"
          value="8,429"
          icon={Eye}
          iconColor="bg-cyan-500/10 text-cyan-500"
        />
        <StatsCard
          title="Taxa de Resolução"
          value="67%"
          change="+3% vs semana passada"
          changeType="positive"
          icon={CheckCircle}
          iconColor="bg-emerald-500/10 text-emerald-500"
        />
        <StatsCard
          title="Tempo Médio Resposta"
          value="2.4h"
          change="-15min vs semana passada"
          changeType="positive"
          icon={Clock}
          iconColor="bg-amber-500/10 text-amber-500"
        />
        <StatsCard
          title="Engajamento"
          value="34%"
          change="+5% este mês"
          changeType="positive"
          icon={TrendingUp}
          iconColor="bg-pink-500/10 text-pink-500"
        />
      </div>

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
            <div className="space-y-4">
              {recentPosts.map((post) => (
                <div key={post.id} className="flex items-start gap-3 rounded-lg p-3 transition-colors hover:bg-accent">
                  <Avatar size="sm">
                    <AvatarImage src={post.author.avatarUrl} />
                    <AvatarFallback>{post.author.username.slice(0, 2).toUpperCase()}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-foreground truncate">{post.title}</p>
                    <p className="text-sm text-muted-foreground">
                      por {post.author.username} • {post.commentCount} comentários
                    </p>
                  </div>
                  {post.hasAcceptedAnswer ? (
                    <Badge variant="success" size="sm">Resolvido</Badge>
                  ) : (
                    <Badge variant="warning" size="sm">Aberto</Badge>
                  )}
                </div>
              ))}
            </div>
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
            <div className="space-y-4">
              {recentUsers.map((user) => (
                <div key={user.id} className="flex items-center gap-3 rounded-lg p-3 transition-colors hover:bg-accent">
                  <Avatar>
                    <AvatarImage src={user.avatarUrl} />
                    <AvatarFallback>{user.username.slice(0, 2).toUpperCase()}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <p className="font-medium text-foreground">{user.username}</p>
                    <p className="text-sm text-muted-foreground">{user.email}</p>
                  </div>
                  <Badge variant="level" size="sm">{user.level}</Badge>
                </div>
              ))}
            </div>
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
