import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { 
  Search, 
  Filter,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Edit,
  Eye,
  Clock,
  ArrowUp
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { moderatorService } from '@/services/moderator.service';
import { Loader2 } from 'lucide-react';

interface HistoryItem {
  id: string;
  action: 'approve' | 'reject' | 'edit' | 'hide' | 'warn' | 'escalate';
  targetType: 'post' | 'comment';
  targetTitle: string;
  targetAuthor: string;
  note?: string;
  createdAt: string;
}

const mockHistory: HistoryItem[] = [
  {
    id: '1',
    action: 'reject',
    targetType: 'post',
    targetTitle: 'Confira minha nova ferramenta!!!',
    targetAuthor: 'spammer123',
    note: 'Spam promocional sem conteúdo técnico',
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: '2',
    action: 'warn',
    targetType: 'comment',
    targetTitle: 'Comentário ofensivo',
    targetAuthor: 'toxic_user',
    note: 'Primeiro aviso por linguagem inadequada',
    createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: '3',
    action: 'approve',
    targetType: 'post',
    targetTitle: 'Discussão técnica sobre React',
    targetAuthor: 'dev_senior',
    createdAt: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: '4',
    action: 'edit',
    targetType: 'post',
    targetTitle: 'Tutorial de Node.js',
    targetAuthor: 'newbie_dev',
    note: 'Removido link quebrado e corrigido formatação',
    createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: '5',
    action: 'escalate',
    targetType: 'post',
    targetTitle: 'Conteúdo ilegal',
    targetAuthor: 'bad_actor',
    note: 'Encaminhado para admin - possível violação de termos',
    createdAt: new Date(Date.now() - 48 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: '6',
    action: 'hide',
    targetType: 'comment',
    targetTitle: 'Resposta duplicada',
    targetAuthor: 'helpful_user',
    note: 'Comentário duplicado acidentalmente',
    createdAt: new Date(Date.now() - 72 * 60 * 60 * 1000).toISOString(),
  },
];

const actionConfig: Record<string, { icon: any; label: string; color: string }> = {
  APPROVE_CONTENT: { icon: CheckCircle, label: 'Aprovado', color: 'text-success' },
  HIDE_POST: { icon: Eye, label: 'Ocultado', color: 'text-orange-500' },
  UNHIDE_POST: { icon: Eye, label: 'Publicado', color: 'text-blue-500' },
  DELETE_POST: { icon: XCircle, label: 'Post Deletado', color: 'text-destructive' },
  DELETE_COMMENT: { icon: XCircle, label: 'Comentário Deletado', color: 'text-destructive' },
  WARN_USER: { icon: AlertTriangle, label: 'Aviso Enviado', color: 'text-warning' },
  BAN_USER: { icon: XCircle, label: 'Usuário Banido', color: 'text-destructive' },
  UNBAN_USER: { icon: CheckCircle, label: 'Usuário Desbanido', color: 'text-success' },
  ESCALATE: { icon: ArrowUp, label: 'Escalado', color: 'text-purple-500' },
};

export default function ModeratorHistory() {
  const [searchQuery, setSearchQuery] = useState('');
  const [actionFilter, setActionFilter] = useState<string>('all');
  const [page, setPage] = useState(1);

  // Fetch history
  const { data, isLoading, error } = useQuery({
    queryKey: ['moderator-history', page, searchQuery, actionFilter],
    queryFn: () => moderatorService.getHistory(page, 20, searchQuery, actionFilter),
    placeholderData: (previousData) => previousData,
  });

  const history = data?.data || [];
  const meta = data?.meta;
  const stats = data?.stats || {
    total: 0,
    approved: 0,
    hidden: 0,
    deleted: 0,
    warnings: 0,
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">Meu Histórico</h1>
        <p className="text-muted-foreground">Veja todas as suas ações de moderação</p>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-4">
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-foreground">{stats.total}</div>
            <div className="text-sm text-muted-foreground">Total de Ações</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-success">{stats.approved}</div>
            <div className="text-sm text-muted-foreground">Aprovados</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-orange-500">{isLoading ? '...' : stats.hidden}</div>
            <div className="text-sm text-muted-foreground">Ocultados</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-warning">{isLoading ? '...' : stats.warnings}</div>
            <div className="text-sm text-muted-foreground">Avisos</div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col gap-4 sm:flex-row">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Buscar por título, autor ou nota..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={actionFilter} onValueChange={setActionFilter}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <Filter className="mr-2 h-4 w-4" />
                <SelectValue placeholder="Tipo de Ação" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas</SelectItem>
                <SelectItem value="APPROVE_CONTENT">Aprovados</SelectItem>
                <SelectItem value="HIDE_POST">Posts Ocultados</SelectItem>
                <SelectItem value="UNHIDE_POST">Posts Publicados</SelectItem>
                <SelectItem value="DELETE_POST">Posts Deletados</SelectItem>
                <SelectItem value="DELETE_COMMENT">Comentários Deletados</SelectItem>
                <SelectItem value="WARN_USER">Avisos</SelectItem>
                <SelectItem value="BAN_USER">Banimentos</SelectItem>
                <SelectItem value="ESCALATE">Escalados</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* History List */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Histórico ({isLoading ? '...' : history.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-12">
              <Loader2 className="h-12 w-12 animate-spin mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground">Carregando histórico...</p>
            </div>
          ) : error ? (
            <div className="text-center py-12 text-destructive">
              Erro ao carregar histórico
            </div>
          ) : history.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              Nenhuma ação encontrada
            </div>
          ) : (
          <div className="space-y-4">
            {history.map((item: any) => {
              const config = actionConfig[item.actionType] || actionConfig['APPROVE_CONTENT'];
              const Icon = config.icon;
              
              return (
                <div 
                  key={item.id} 
                  className="flex items-start gap-4 rounded-lg border border-border p-4"
                >
                  <div className={`rounded-lg bg-muted p-2 ${config.color}`}>
                    <Icon className="h-5 w-5" />
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <Badge variant="outline" size="sm">{config.label}</Badge>
                      <Badge variant="secondary" size="sm">
                        {item.targetType === 'POST' ? 'Post' : item.targetType === 'COMMENT' ? 'Comentário' : 'Usuário'}
                      </Badge>
                    </div>
                    
                    <p className="mt-1 font-medium text-foreground">{item.targetTitle}</p>
                    <p className="text-sm text-muted-foreground">por @{item.targetAuthor}</p>
                    
                    {item.reason && (
                      <p className="mt-2 text-sm text-muted-foreground">
                        <strong>Motivo:</strong> {item.reason}
                      </p>
                    )}
                    
                    {item.notes && (
                      <p className="mt-1 text-sm text-muted-foreground italic">
                        <strong>Notas:</strong> "{item.notes}"
                      </p>
                    )}
                  </div>
                  
                  <div className="text-sm text-muted-foreground">
                    {formatDistanceToNow(new Date(item.createdAt), { addSuffix: true, locale: ptBR })}
                  </div>
                </div>
              );
            })}
          </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
