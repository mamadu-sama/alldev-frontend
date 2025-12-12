import { useState } from 'react';
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

const actionConfig = {
  approve: { icon: CheckCircle, label: 'Aprovado', color: 'text-success' },
  reject: { icon: XCircle, label: 'Rejeitado', color: 'text-destructive' },
  edit: { icon: Edit, label: 'Editado', color: 'text-blue-500' },
  hide: { icon: Eye, label: 'Ocultado', color: 'text-orange-500' },
  warn: { icon: AlertTriangle, label: 'Aviso Enviado', color: 'text-warning' },
  escalate: { icon: ArrowUp, label: 'Escalado', color: 'text-purple-500' },
};

export default function ModeratorHistory() {
  const [searchQuery, setSearchQuery] = useState('');
  const [actionFilter, setActionFilter] = useState<string>('all');

  const filteredHistory = mockHistory.filter((item) => {
    const matchesSearch = 
      item.targetTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.targetAuthor.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.note && item.note.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesAction = actionFilter === 'all' || item.action === actionFilter;
    return matchesSearch && matchesAction;
  });

  // Stats
  const stats = {
    total: mockHistory.length,
    approved: mockHistory.filter(i => i.action === 'approve').length,
    rejected: mockHistory.filter(i => i.action === 'reject').length,
    warnings: mockHistory.filter(i => i.action === 'warn').length,
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
            <div className="text-2xl font-bold text-destructive">{stats.rejected}</div>
            <div className="text-sm text-muted-foreground">Rejeitados</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-warning">{stats.warnings}</div>
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
                <SelectItem value="approve">Aprovados</SelectItem>
                <SelectItem value="reject">Rejeitados</SelectItem>
                <SelectItem value="edit">Editados</SelectItem>
                <SelectItem value="hide">Ocultados</SelectItem>
                <SelectItem value="warn">Avisos</SelectItem>
                <SelectItem value="escalate">Escalados</SelectItem>
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
            Histórico ({filteredHistory.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredHistory.map((item) => {
              const config = actionConfig[item.action];
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
                        {item.targetType === 'post' ? 'Post' : 'Comentário'}
                      </Badge>
                    </div>
                    
                    <p className="mt-1 font-medium text-foreground">{item.targetTitle}</p>
                    <p className="text-sm text-muted-foreground">por @{item.targetAuthor}</p>
                    
                    {item.note && (
                      <p className="mt-2 text-sm text-muted-foreground italic">
                        "{item.note}"
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
        </CardContent>
      </Card>
    </div>
  );
}
