import { useState } from 'react';
import { 
  Search, 
  Eye,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Filter,
  Clock,
  ArrowUp
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

interface QueueItem {
  id: string;
  type: 'post' | 'comment';
  content: string;
  title?: string;
  author: {
    username: string;
    avatarUrl?: string;
    reputation: number;
  };
  reports: number;
  reason: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  createdAt: string;
  reportedAt: string;
}

const mockQueue: QueueItem[] = [
  {
    id: '1',
    type: 'post',
    title: 'Confira minha nova ferramenta gratuita!!!',
    content: 'Baixe agora em www.link-suspeito.com! É grátis e vai mudar sua vida...',
    author: { username: 'spammer123', avatarUrl: 'https://i.pravatar.cc/150?u=spam', reputation: 5 },
    reports: 8,
    reason: 'Spam',
    priority: 'urgent',
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    reportedAt: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: '2',
    type: 'comment',
    content: 'Você não sabe nada sobre programação, seu código é lixo e você deveria desistir.',
    author: { username: 'toxic_user', avatarUrl: 'https://i.pravatar.cc/150?u=toxic', reputation: 120 },
    reports: 5,
    reason: 'Assédio',
    priority: 'high',
    createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
    reportedAt: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: '3',
    type: 'post',
    title: 'Como hackear contas do Instagram',
    content: 'Neste tutorial vou ensinar como invadir contas de outras pessoas...',
    author: { username: 'hacker_kid', avatarUrl: 'https://i.pravatar.cc/150?u=hack', reputation: 15 },
    reports: 12,
    reason: 'Conteúdo Inapropriado',
    priority: 'urgent',
    createdAt: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
    reportedAt: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
  },
  {
    id: '4',
    type: 'comment',
    content: 'Acho que essa informação está incorreta. O método descrito pode causar vazamento de memória.',
    author: { username: 'concerned_dev', avatarUrl: 'https://i.pravatar.cc/150?u=concern', reputation: 850 },
    reports: 1,
    reason: 'Desinformação',
    priority: 'low',
    createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
    reportedAt: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: '5',
    type: 'post',
    title: 'Discussão sobre política de programação',
    content: 'Tabs vs Spaces: qual é a escolha certa? (contém linguagem forte)',
    author: { username: 'passionate_coder', avatarUrl: 'https://i.pravatar.cc/150?u=passion', reputation: 340 },
    reports: 2,
    reason: 'Linguagem Inapropriada',
    priority: 'medium',
    createdAt: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString(),
    reportedAt: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
  },
];

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

export default function ModeratorQueue() {
  const [searchQuery, setSearchQuery] = useState('');
  const [priorityFilter, setPriorityFilter] = useState<string>('all');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [selectedItem, setSelectedItem] = useState<QueueItem | null>(null);
  const [actionType, setActionType] = useState<'approve' | 'reject' | 'warn' | 'escalate' | null>(null);
  const [moderationNote, setModerationNote] = useState('');

  const filteredQueue = mockQueue
    .filter((item) => {
      const matchesSearch = 
        item.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.author.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (item.title && item.title.toLowerCase().includes(searchQuery.toLowerCase()));
      const matchesPriority = priorityFilter === 'all' || item.priority === priorityFilter;
      const matchesType = typeFilter === 'all' || item.type === typeFilter;
      return matchesSearch && matchesPriority && matchesType;
    })
    .sort((a, b) => {
      const priorityOrder = { urgent: 0, high: 1, medium: 2, low: 3 };
      return priorityOrder[a.priority] - priorityOrder[b.priority];
    });

  const handleAction = () => {
    const actionMessages = {
      approve: 'Conteúdo aprovado',
      reject: 'Conteúdo removido',
      warn: 'Aviso enviado ao usuário',
      escalate: 'Caso escalado para administradores',
    };
    toast.success(actionMessages[actionType!]);
    setSelectedItem(null);
    setActionType(null);
    setModerationNote('');
  };

  const openActionDialog = (item: QueueItem, action: typeof actionType) => {
    setSelectedItem(item);
    setActionType(action);
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
                <SelectItem value="post">Posts</SelectItem>
                <SelectItem value="comment">Comentários</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Queue Stats */}
      <div className="grid gap-4 sm:grid-cols-4">
        <div className="rounded-lg border border-red-500/30 bg-red-500/10 p-3 text-center">
          <div className="text-2xl font-bold text-red-500">
            {mockQueue.filter(i => i.priority === 'urgent').length}
          </div>
          <div className="text-sm text-red-400">Urgentes</div>
        </div>
        <div className="rounded-lg border border-orange-500/30 bg-orange-500/10 p-3 text-center">
          <div className="text-2xl font-bold text-orange-500">
            {mockQueue.filter(i => i.priority === 'high').length}
          </div>
          <div className="text-sm text-orange-400">Alta Prioridade</div>
        </div>
        <div className="rounded-lg border border-blue-500/30 bg-blue-500/10 p-3 text-center">
          <div className="text-2xl font-bold text-blue-500">
            {mockQueue.filter(i => i.priority === 'medium').length}
          </div>
          <div className="text-sm text-blue-400">Média</div>
        </div>
        <div className="rounded-lg border border-slate-500/30 bg-slate-500/10 p-3 text-center">
          <div className="text-2xl font-bold text-slate-400">
            {mockQueue.filter(i => i.priority === 'low').length}
          </div>
          <div className="text-sm text-slate-400">Baixa</div>
        </div>
      </div>

      {/* Queue List */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Itens na Fila ({filteredQueue.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredQueue.map((item) => (
              <div 
                key={item.id} 
                className="rounded-lg border border-border p-4 transition-colors hover:bg-accent/30"
              >
                <div className="flex items-start gap-4">
                  <Avatar>
                    <AvatarImage src={item.author.avatarUrl} />
                    <AvatarFallback>{item.author.username.slice(0, 2).toUpperCase()}</AvatarFallback>
                  </Avatar>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <Badge variant={item.type === 'post' ? 'default' : 'secondary'} size="sm">
                        {item.type === 'post' ? 'Post' : 'Comentário'}
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
                    <Button size="sm" variant="outline" onClick={() => openActionDialog(item, 'approve')}>
                      <CheckCircle className="mr-1 h-4 w-4 text-success" />
                      Aprovar
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => openActionDialog(item, 'reject')}>
                      <XCircle className="mr-1 h-4 w-4 text-destructive" />
                      Remover
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => openActionDialog(item, 'warn')}>
                      <AlertTriangle className="mr-1 h-4 w-4 text-warning" />
                      Avisar
                    </Button>
                    {item.priority === 'urgent' && (
                      <Button size="sm" variant="destructive" onClick={() => openActionDialog(item, 'escalate')}>
                        <ArrowUp className="mr-1 h-4 w-4" />
                        Escalar
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Action Dialog */}
      <Dialog open={!!actionType} onOpenChange={() => setActionType(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {actionType === 'approve' && 'Aprovar Conteúdo'}
              {actionType === 'reject' && 'Remover Conteúdo'}
              {actionType === 'warn' && 'Enviar Aviso ao Usuário'}
              {actionType === 'escalate' && 'Escalar para Admin'}
            </DialogTitle>
            <DialogDescription>
              {actionType === 'approve' && 'O conteúdo será marcado como revisado e permanecerá visível.'}
              {actionType === 'reject' && 'O conteúdo será removido e o autor será notificado.'}
              {actionType === 'warn' && 'Um aviso será enviado ao autor sobre as regras da comunidade.'}
              {actionType === 'escalate' && 'O caso será enviado para administradores tomarem ação mais severa.'}
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            {selectedItem && (
              <div className="rounded-lg bg-muted p-3">
                <p className="text-sm text-muted-foreground line-clamp-2">
                  {selectedItem.content}
                </p>
                <p className="mt-1 text-xs text-muted-foreground">
                  por @{selectedItem.author.username}
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
            <Button variant="outline" onClick={() => setActionType(null)}>Cancelar</Button>
            <Button 
              variant={actionType === 'reject' || actionType === 'escalate' ? 'destructive' : 'default'}
              onClick={handleAction}
            >
              Confirmar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
