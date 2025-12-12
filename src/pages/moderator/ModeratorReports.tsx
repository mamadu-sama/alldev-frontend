import { useState } from 'react';
import { 
  Search, 
  Eye,
  CheckCircle,
  XCircle,
  ArrowUp,
  Filter,
  AlertTriangle,
  FileText,
  MessageSquare,
  User
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

interface Report {
  id: string;
  type: 'post' | 'comment' | 'user';
  reason: string;
  description: string;
  reportedBy: {
    username: string;
    avatarUrl?: string;
  };
  target: {
    title?: string;
    content?: string;
    username?: string;
  };
  status: 'pending' | 'resolved' | 'escalated';
  createdAt: string;
}

const mockReports: Report[] = [
  {
    id: '1',
    type: 'post',
    reason: 'Spam',
    description: 'Post promovendo produto sem relevância técnica.',
    reportedBy: { username: 'vigilant_dev', avatarUrl: 'https://i.pravatar.cc/150?u=vig' },
    target: { title: 'Compre agora!!' },
    status: 'pending',
    createdAt: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: '2',
    type: 'comment',
    reason: 'Assédio',
    description: 'Comentário hostil e ofensivo.',
    reportedBy: { username: 'concerned_user', avatarUrl: 'https://i.pravatar.cc/150?u=con' },
    target: { content: 'Você não deveria estar programando...' },
    status: 'pending',
    createdAt: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: '3',
    type: 'user',
    reason: 'Comportamento Tóxico',
    description: 'Usuário com padrão de comentários negativos.',
    reportedBy: { username: 'mod_helper', avatarUrl: 'https://i.pravatar.cc/150?u=mod' },
    target: { username: 'toxic_troll' },
    status: 'escalated',
    createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: '4',
    type: 'post',
    reason: 'Desinformação',
    description: 'Informação técnica incorreta que pode causar problemas.',
    reportedBy: { username: 'expert_dev', avatarUrl: 'https://i.pravatar.cc/150?u=exp' },
    target: { title: 'Como usar eval() com segurança' },
    status: 'resolved',
    createdAt: new Date(Date.now() - 48 * 60 * 60 * 1000).toISOString(),
  },
];

const typeIcons = {
  post: FileText,
  comment: MessageSquare,
  user: User,
};

export default function ModeratorReports() {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);
  const [actionType, setActionType] = useState<'resolve' | 'dismiss' | 'escalate' | null>(null);
  const [actionNote, setActionNote] = useState('');

  const filteredReports = mockReports.filter((report) => {
    const matchesSearch = report.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      report.reportedBy.username.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || report.status === statusFilter;
    const matchesType = typeFilter === 'all' || report.type === typeFilter;
    return matchesSearch && matchesStatus && matchesType;
  });

  const pendingCount = mockReports.filter(r => r.status === 'pending').length;

  const handleAction = () => {
    const messages = {
      resolve: 'Denúncia resolvida',
      dismiss: 'Denúncia descartada',
      escalate: 'Denúncia escalada para administrador',
    };
    toast.success(messages[actionType!]);
    setActionType(null);
    setSelectedReport(null);
    setActionNote('');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Denúncias</h1>
          <p className="text-muted-foreground">Analise e tome ações sobre denúncias da comunidade</p>
        </div>
        {pendingCount > 0 && (
          <Badge variant="destructive" className="text-lg px-4 py-2">
            {pendingCount} pendentes
          </Badge>
        )}
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col gap-4 sm:flex-row">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Buscar..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full sm:w-[150px]">
                <Filter className="mr-2 h-4 w-4" />
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos</SelectItem>
                <SelectItem value="pending">Pendentes</SelectItem>
                <SelectItem value="resolved">Resolvidos</SelectItem>
                <SelectItem value="escalated">Escalados</SelectItem>
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
                <SelectItem value="user">Usuários</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Reports List */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5" />
            Denúncias ({filteredReports.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredReports.map((report) => {
              const TypeIcon = typeIcons[report.type];
              return (
                <div 
                  key={report.id} 
                  className="rounded-lg border border-border p-4 transition-colors hover:bg-accent/30"
                >
                  <div className="flex items-start gap-4">
                    <div className={`rounded-lg p-2 ${
                      report.type === 'post' ? 'bg-blue-500/10 text-blue-500' :
                      report.type === 'comment' ? 'bg-purple-500/10 text-purple-500' :
                      'bg-orange-500/10 text-orange-500'
                    }`}>
                      <TypeIcon className="h-5 w-5" />
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <Badge variant="outline" size="sm">{report.reason}</Badge>
                        <Badge 
                          variant={
                            report.status === 'pending' ? 'warning' :
                            report.status === 'resolved' ? 'success' : 'destructive'
                          } 
                          size="sm"
                        >
                          {report.status === 'pending' ? 'Pendente' :
                           report.status === 'resolved' ? 'Resolvido' : 'Escalado'}
                        </Badge>
                      </div>
                      
                      <p className="mt-2 text-foreground">{report.description}</p>
                      
                      <div className="mt-2 rounded bg-muted/50 p-2">
                        <p className="text-sm text-muted-foreground">
                          {report.type === 'post' && `Post: "${report.target.title}"`}
                          {report.type === 'comment' && `Comentário: "${report.target.content?.slice(0, 50)}..."`}
                          {report.type === 'user' && `Usuário: @${report.target.username}`}
                        </p>
                      </div>
                      
                      <div className="mt-2 flex items-center gap-2">
                        <Avatar size="xs">
                          <AvatarImage src={report.reportedBy.avatarUrl} />
                          <AvatarFallback>{report.reportedBy.username.slice(0, 2).toUpperCase()}</AvatarFallback>
                        </Avatar>
                        <span className="text-sm text-muted-foreground">
                          Reportado por @{report.reportedBy.username} •{' '}
                          {formatDistanceToNow(new Date(report.createdAt), { addSuffix: true, locale: ptBR })}
                        </span>
                      </div>
                    </div>
                    
                    {report.status === 'pending' && (
                      <div className="flex flex-col gap-2">
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => {
                            setSelectedReport(report);
                            setActionType('resolve');
                          }}
                        >
                          <CheckCircle className="mr-1 h-4 w-4 text-success" />
                          Resolver
                        </Button>
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => {
                            setSelectedReport(report);
                            setActionType('dismiss');
                          }}
                        >
                          <XCircle className="mr-1 h-4 w-4" />
                          Descartar
                        </Button>
                        <Button 
                          size="sm" 
                          variant="outline"
                          className="text-warning"
                          onClick={() => {
                            setSelectedReport(report);
                            setActionType('escalate');
                          }}
                        >
                          <ArrowUp className="mr-1 h-4 w-4" />
                          Escalar
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Action Dialog */}
      <Dialog open={!!actionType} onOpenChange={() => setActionType(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {actionType === 'resolve' && 'Resolver Denúncia'}
              {actionType === 'dismiss' && 'Descartar Denúncia'}
              {actionType === 'escalate' && 'Escalar para Administrador'}
            </DialogTitle>
            <DialogDescription>
              {actionType === 'resolve' && 'Confirme que tomou as ações necessárias.'}
              {actionType === 'dismiss' && 'A denúncia será marcada como inválida.'}
              {actionType === 'escalate' && 'O caso será encaminhado para um administrador tomar ação.'}
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Nota (opcional)</label>
              <Textarea
                placeholder="Adicione uma nota sobre sua decisão..."
                value={actionNote}
                onChange={(e) => setActionNote(e.target.value)}
                rows={3}
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setActionType(null)}>Cancelar</Button>
            <Button 
              variant={actionType === 'escalate' ? 'destructive' : 'default'}
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
