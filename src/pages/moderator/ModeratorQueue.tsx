import { useState, useEffect } from 'react';
import { 
  Search, 
  Eye,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Filter,
  Clock,
  ArrowUp,
  Loader2,
  EyeOff
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { toast } from 'sonner';
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { moderatorService, QueueItem, QueueStats } from '@/services/moderator.service';
import { useNavigate } from 'react-router-dom';

const priorityColors = {
  low: 'bg-slate-500/10 text-slate-500',
  medium: 'bg-blue-500/10 text-blue-500',
  high: 'bg-orange-500/10 text-orange-500',
  urgent: 'bg-red-500/10 text-red-500',
};

const priorityLabels = {
  low: 'Baixa',
  medium: 'Média',
  high: 'Alta',
  urgent: 'Urgente',
};

type ActionType = 'approve' | 'hide' | 'delete' | 'escalate';

export default function ModeratorQueue() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [priorityFilter, setPriorityFilter] = useState<string>('all');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [selectedItem, setSelectedItem] = useState<QueueItem | null>(null);
  const [actionType, setActionType] = useState<ActionType | null>(null);
  const [moderationNote, setModerationNote] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [queue, setQueue] = useState<QueueItem[]>([]);
  const [stats, setStats] = useState<QueueStats | null>(null);

  useEffect(() => {
    loadData();
  }, [priorityFilter, typeFilter]);

  const loadData = async () => {
    try {
      setLoading(true);
      const [queueData, statsData] = await Promise.all([
        moderatorService.getQueue(1, 50, priorityFilter, typeFilter),
        moderatorService.getQueueStats(),
      ]);
      setQueue(queueData.data);
      setStats(statsData);
    } catch (error: any) {
      console.error('Error loading queue:', error);
      toast.error(error.response?.data?.error?.message || 'Erro ao carregar fila');
    } finally {
      setLoading(false);
    }
  };

  const filteredQueue = queue.filter((item) => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    return (
      item.content.toLowerCase().includes(query) ||
      item.author.username.toLowerCase().includes(query) ||
      (item.title && item.title.toLowerCase().includes(query))
    );
  });

  const handleAction = async () => {
    if (!selectedItem || !actionType) return;

    const actionTypeMap: Record<ActionType, string> = {
      approve: 'APPROVE_CONTENT',
      hide: 'HIDE_POST',
      delete: selectedItem.type === 'POST' ? 'DELETE_POST' : 'DELETE_COMMENT',
      escalate: 'ESCALATE',
    };

    try {
      setSubmitting(true);
      await moderatorService.takeAction({
        targetId: selectedItem.id,
        targetType: selectedItem.type,
        actionType: actionTypeMap[actionType],
        notes: moderationNote,
      });

      const actionMessages: Record<ActionType, string> = {
        approve: 'Conteúdo aprovado',
        hide: 'Conteúdo ocultado',
        delete: 'Conteúdo removido',
        escalate: 'Caso escalado para administradores',
      };

      toast.success(actionMessages[actionType]);
      
      // Remove item from queue
      setQueue(queue.filter(item => item.id !== selectedItem.id));
      
      setSelectedItem(null);
      setActionType(null);
      setModerationNote('');
      
      // Reload stats
      const statsData = await moderatorService.getQueueStats();
      setStats(statsData);
    } catch (error: any) {
      console.error('Error taking action:', error);
      toast.error(error.response?.data?.error?.message || 'Erro ao executar ação');
    } finally {
      setSubmitting(false);
    }
  };

  const openActionDialog = (item: QueueItem, action: ActionType) => {
    setSelectedItem(item);
    setActionType(action);
  };

  const handleViewContent = (item: QueueItem) => {
    if (item.type === 'POST' && item.slug) {
      navigate(`/posts/${item.slug}`);
    } else if (item.type === 'COMMENT' && item.slug) {
      navigate(`/posts/${item.slug}`);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">Fila de Moderação</h1>
        <p className="text-muted-foreground">Revise e tome ações sobre conteúdo reportado</p>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col gap-4 sm:flex-row">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Buscar por conteúdo ou autor..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={priorityFilter} onValueChange={setPriorityFilter}>
              <SelectTrigger className="w-full sm:w-[150px]">
                <Filter className="mr-2 h-4 w-4" />
                <SelectValue placeholder="Prioridade" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas</SelectItem>
                <SelectItem value="urgent">Urgente</SelectItem>
                <SelectItem value="high">Alta</SelectItem>
                <SelectItem value="medium">Média</SelectItem>
                <SelectItem value="low">Baixa</SelectItem>
              </SelectContent>
            </Select>
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-full sm:w-[150px]">
                <SelectValue placeholder="Tipo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos</SelectItem>
                <SelectItem value="POST">Posts</SelectItem>
                <SelectItem value="COMMENT">Comentários</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Queue Stats */}
      {stats && (
        <div className="grid gap-4 sm:grid-cols-4">
          <div className="rounded-lg border border-red-500/30 bg-red-500/10 p-3 text-center">
            <div className="text-2xl font-bold text-red-500">{stats.urgent}</div>
            <div className="text-sm text-red-400">Urgentes</div>
          </div>
          <div className="rounded-lg border border-orange-500/30 bg-orange-500/10 p-3 text-center">
            <div className="text-2xl font-bold text-orange-500">{stats.high}</div>
            <div className="text-sm text-orange-400">Alta Prioridade</div>
          </div>
          <div className="rounded-lg border border-blue-500/30 bg-blue-500/10 p-3 text-center">
            <div className="text-2xl font-bold text-blue-500">{stats.medium}</div>
            <div className="text-sm text-blue-400">Média</div>
          </div>
          <div className="rounded-lg border border-slate-500/30 bg-slate-500/10 p-3 text-center">
            <div className="text-2xl font-bold text-slate-400">{stats.low}</div>
            <div className="text-sm text-slate-400">Baixa</div>
          </div>
        </div>
      )}

      {/* Queue List */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Itens na Fila ({filteredQueue.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-12 w-12 animate-spin text-muted-foreground" />
            </div>
          ) : (
            <div className="space-y-4">
              {filteredQueue.length === 0 ? (
                <div className="text-center py-12">
                  <CheckCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">Nenhum item na fila! Bom trabalho.</p>
                </div>
              ) : (
                filteredQueue.map((item) => (
                  <div 
                    key={item.id} 
                    className="rounded-lg border border-border p-4 transition-colors hover:bg-accent/30"
                  >
                    <div className="flex items-start gap-4">
                      <Avatar>
                        <AvatarImage src={item.author.avatarUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${item.author.username}`} />
                        <AvatarFallback>{item.author.username.slice(0, 2).toUpperCase()}</AvatarFallback>
                      </Avatar>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <Badge variant={item.type === 'POST' ? 'default' : 'secondary'} size="sm">
                            {item.type === 'POST' ? 'Post' : 'Comentário'}
                          </Badge>
                          <span className={`px-2 py-0.5 rounded text-xs font-medium ${priorityColors[item.priority]}`}>
                            {priorityLabels[item.priority]}
                          </span>
                          <Badge variant="destructive" size="sm">
                            {item.reports} denúncias
                          </Badge>
                          <Badge variant="outline" size="sm">
                            {item.reason}
                          </Badge>
                        </div>
                        
                        {item.title && (
                          <h4 className="mt-2 font-medium text-foreground">{item.title}</h4>
                        )}
                        
                        <p className="mt-1 text-muted-foreground line-clamp-2">{item.content}</p>
                        
                        <div className="mt-2 flex items-center gap-4 text-sm text-muted-foreground">
                          <span>@{item.author.username}</span>
                          <span>Rep: {item.author.reputation}</span>
                          <span>
                            Reportado {formatDistanceToNow(new Date(item.reportedAt), { addSuffix: true, locale: ptBR })}
                          </span>
                        </div>
                      </div>
                      
                      <div className="flex flex-col gap-2">
                        <Button size="sm" variant="outline" onClick={() => handleViewContent(item)}>
                          <Eye className="mr-1 h-4 w-4" />
                          Ver
                        </Button>
                        <Button size="sm" variant="outline" onClick={() => openActionDialog(item, 'approve')}>
                          <CheckCircle className="mr-1 h-4 w-4 text-success" />
                          Aprovar
                        </Button>
                        {item.type === 'POST' ? (
                          <Button size="sm" variant="outline" onClick={() => openActionDialog(item, 'hide')}>
                            <EyeOff className="mr-1 h-4 w-4 text-warning" />
                            Ocultar
                          </Button>
                        ) : (
                          <Button size="sm" variant="outline" onClick={() => openActionDialog(item, 'delete')}>
                            <XCircle className="mr-1 h-4 w-4 text-destructive" />
                            Remover
                          </Button>
                        )}
                        {item.priority === 'urgent' && (
                          <Button size="sm" variant="destructive" onClick={() => openActionDialog(item, 'escalate')}>
                            <ArrowUp className="mr-1 h-4 w-4" />
                            Escalar
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Action Dialog */}
      <Dialog open={!!actionType} onOpenChange={() => setActionType(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {actionType === 'approve' && 'Aprovar Conteúdo'}
              {actionType === 'hide' && 'Ocultar Post'}
              {actionType === 'delete' && 'Remover Conteúdo'}
              {actionType === 'escalate' && 'Escalar para Admin'}
            </DialogTitle>
            <DialogDescription>
              {actionType === 'approve' && 'O conteúdo será marcado como revisado e permanecerá visível.'}
              {actionType === 'hide' && 'O post será ocultado mas não deletado. Pode ser restaurado por admins.'}
              {actionType === 'delete' && 'O conteúdo será removido permanentemente.'}
              {actionType === 'escalate' && 'O caso será enviado para administradores tomarem ação mais severa.'}
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            {selectedItem && (
              <div className="rounded-lg bg-muted p-3">
                <p className="text-sm font-medium mb-1">
                  {selectedItem.type === 'POST' ? 'Post' : 'Comentário'} de @{selectedItem.author.username}
                </p>
                <p className="text-sm text-muted-foreground line-clamp-2">
                  {selectedItem.content}
                </p>
              </div>
            )}
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Nota de Moderação (opcional)</label>
              <Textarea
                placeholder="Adicione uma nota sobre sua decisão..."
                value={moderationNote}
                onChange={(e) => setModerationNote(e.target.value)}
                rows={3}
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setActionType(null)} disabled={submitting}>
              Cancelar
            </Button>
            <Button 
              variant={actionType === 'delete' || actionType === 'escalate' ? 'destructive' : 'default'}
              onClick={handleAction}
              disabled={submitting}
            >
              {submitting ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Processando...
                </>
              ) : (
                'Confirmar'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
