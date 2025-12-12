import { 
  Flag, 
  FileText, 
  MessageSquare, 
  Clock,
  CheckCircle,
  AlertTriangle,
  TrendingUp,
  Eye
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Link } from 'react-router-dom';
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';

const pendingItems = [
  {
    id: '1',
    type: 'post',
    title: 'Post com conteúdo ofensivo',
    author: { username: 'user123', avatarUrl: 'https://i.pravatar.cc/150?u=user123' },
    reports: 3,
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: '2',
    type: 'comment',
    title: 'Comentário spam detectado',
    author: { username: 'spammer', avatarUrl: 'https://i.pravatar.cc/150?u=spammer' },
    reports: 5,
    createdAt: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
  },
  {
    id: '3',
    type: 'post',
    title: 'Possível desinformação técnica',
    author: { username: 'newbie', avatarUrl: 'https://i.pravatar.cc/150?u=newbie' },
    reports: 2,
    createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
  },
];

export default function ModeratorDashboard() {
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
                <p className="text-3xl font-bold text-foreground">12</p>
              </div>
              <div className="rounded-lg bg-orange-500/10 p-3">
                <Clock className="h-6 w-6 text-orange-500" />
              </div>
            </div>
            <p className="mt-2 text-sm text-warning">4 urgentes</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Resolvidos Hoje</p>
                <p className="text-3xl font-bold text-foreground">8</p>
              </div>
              <div className="rounded-lg bg-green-500/10 p-3">
                <CheckCircle className="h-6 w-6 text-green-500" />
              </div>
            </div>
            <p className="mt-2 text-sm text-success">+23% vs ontem</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Posts Editados</p>
                <p className="text-3xl font-bold text-foreground">15</p>
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
                <p className="text-3xl font-bold text-foreground">3</p>
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
                      <div className="text-xs text-muted-foreground">12 itens pendentes</div>
                    </div>
                  </Link>
                </Button>
                <Button variant="outline" className="justify-start h-auto py-3" asChild>
                  <Link to="/moderator/posts">
                    <FileText className="mr-2 h-4 w-4 text-blue-500" />
                    <div className="text-left">
                      <div className="font-medium">Posts Reportados</div>
                      <div className="text-xs text-muted-foreground">5 para revisar</div>
                    </div>
                  </Link>
                </Button>
                <Button variant="outline" className="justify-start h-auto py-3" asChild>
                  <Link to="/moderator/comments">
                    <MessageSquare className="mr-2 h-4 w-4 text-purple-500" />
                    <div className="text-left">
                      <div className="font-medium">Comentários</div>
                      <div className="text-xs text-muted-foreground">7 para revisar</div>
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
