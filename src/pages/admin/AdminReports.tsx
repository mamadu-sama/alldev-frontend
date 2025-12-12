import { useState } from 'react';
import { 
  Search, 
  MoreHorizontal, 
  Eye,
  CheckCircle,
  XCircle,
  Filter,
  AlertTriangle,
  MessageSquare,
  FileText,
  User
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
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
  reason: 'spam' | 'harassment' | 'inappropriate' | 'misinformation' | 'other';
  description: string;
  reportedBy: {
    username: string;
    avatarUrl?: string;
  };
  reportedItem: {
    id: string;
    title?: string;
    content?: string;
    username?: string;
  };
  status: 'pending' | 'resolved' | 'dismissed';
  createdAt: string;
}

const mockReports: Report[] = [
  {
    id: '1',
    type: 'post',
    reason: 'spam',
    description: 'Este post está promovendo um serviço externo de forma abusiva.',
    reportedBy: { username: 'maria_dev', avatarUrl: 'https://i.pravatar.cc/150?u=maria' },
    reportedItem: { id: 'p1', title: 'Confira esta incrível ferramenta!' },
    status: 'pending',
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: '2',
    type: 'comment',
    reason: 'harassment',
    description: 'Comentário ofensivo e desrespeitoso.',
    reportedBy: { username: 'joao_code', avatarUrl: 'https://i.pravatar.cc/150?u=joao' },
    reportedItem: { id: 'c1', content: 'Você não sabe nada sobre programação...' },
    status: 'pending',
    createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: '3',
    type: 'user',
    reason: 'spam',
    description: 'Usuário criando múltiplos posts spam.',
    reportedBy: { username: 'ana_tech', avatarUrl: 'https://i.pravatar.cc/150?u=ana' },
    reportedItem: { id: 'u1', username: 'spammer123' },
    status: 'resolved',
    createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: '4',
    type: 'post',
    reason: 'misinformation',
    description: 'Informação técnica incorreta que pode prejudicar outros devs.',
    reportedBy: { username: 'pedro_js', avatarUrl: 'https://i.pravatar.cc/150?u=pedro' },
    reportedItem: { id: 'p2', title: 'Como usar eval() de forma segura' },
    status: 'pending',
    createdAt: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: '5',
    type: 'comment',
    reason: 'inappropriate',
    description: 'Linguagem inapropriada.',
    reportedBy: { username: 'lucas_dev', avatarUrl: 'https://i.pravatar.cc/150?u=lucas' },
    reportedItem: { id: 'c2', content: 'Conteúdo removido...' },
    status: 'dismissed',
    createdAt: new Date(Date.now() - 48 * 60 * 60 * 1000).toISOString(),
  },
];

const reasonLabels: Record<string, string> = {
  spam: 'Spam',
  harassment: 'Assédio',
  inappropriate: 'Conteúdo Inapropriado',
  misinformation: 'Desinformação',
  other: 'Outro',
};

const typeIcons = {
  post: FileText,
  comment: MessageSquare,
  user: User,
};

export default function AdminReports() {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);
  const [dialogType, setDialogType] = useState<'view' | 'resolve' | 'dismiss' | null>(null);

  const filteredReports = mockReports.filter((report) => {
    const matchesSearch = report.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      report.reportedBy.username.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || report.status === statusFilter;
    const matchesType = typeFilter === 'all' || report.type === typeFilter;
    return matchesSearch && matchesStatus && matchesType;
  });

  const pendingCount = mockReports.filter(r => r.status === 'pending').length;

  const handleResolveReport = () => {
    toast.success('Denúncia resolvida e ação tomada');
    setDialogType(null);
    setSelectedReport(null);
  };

  const handleDismissReport = () => {
    toast.success('Denúncia descartada');
    setDialogType(null);
    setSelectedReport(null);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Denúncias</h1>
          <p className="text-muted-foreground">Gerencie as denúncias da comunidade</p>
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
                placeholder="Buscar denúncias..."
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
                <SelectItem value="dismissed">Descartados</SelectItem>
              </SelectContent>
            </Select>
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-full sm:w-[150px]">
                <AlertTriangle className="mr-2 h-4 w-4" />
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
          <CardTitle>Lista de Denúncias ({filteredReports.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredReports.map((report) => {
              const TypeIcon = typeIcons[report.type];
              return (
                <div 
                  key={report.id} 
                  className="rounded-lg border border-border p-4 transition-colors hover:bg-accent/50"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-3 flex-1">
                      <div className={`rounded-lg p-2 ${
                        report.type === 'post' ? 'bg-blue-500/10 text-blue-500' :
                        report.type === 'comment' ? 'bg-purple-500/10 text-purple-500' :
                        'bg-amber-500/10 text-amber-500'
                      }`}>
                        <TypeIcon className="h-5 w-5" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <Badge variant={
                            report.reason === 'spam' ? 'warning' :
                            report.reason === 'harassment' ? 'destructive' :
                            report.reason === 'inappropriate' ? 'destructive' :
                            'secondary'
                          } size="sm">
                            {reasonLabels[report.reason]}
                          </Badge>
                          <Badge variant={
                            report.status === 'pending' ? 'warning' :
                            report.status === 'resolved' ? 'success' : 'secondary'
                          } size="sm">
                            {report.status === 'pending' ? 'Pendente' :
                             report.status === 'resolved' ? 'Resolvido' : 'Descartado'}
                          </Badge>
                          <span className="text-sm text-muted-foreground">
                            {formatDistanceToNow(new Date(report.createdAt), { 
                              addSuffix: true,
                              locale: ptBR 
                            })}
                          </span>
                        </div>
                        <p className="mt-2 text-foreground">{report.description}</p>
                        <div className="mt-2 rounded bg-muted/50 p-2">
                          <p className="text-sm text-muted-foreground">
                            {report.type === 'post' && `Post: "${report.reportedItem.title}"`}
                            {report.type === 'comment' && `Comentário: "${report.reportedItem.content?.slice(0, 50)}..."`}
                            {report.type === 'user' && `Usuário: @${report.reportedItem.username}`}
                          </p>
                        </div>
                        <div className="mt-2 flex items-center gap-2">
                          <Avatar size="xs">
                            <AvatarImage src={report.reportedBy.avatarUrl} />
                            <AvatarFallback>{report.reportedBy.username.slice(0, 2).toUpperCase()}</AvatarFallback>
                          </Avatar>
                          <span className="text-sm text-muted-foreground">
                            Denunciado por {report.reportedBy.username}
                          </span>
                        </div>
                      </div>
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => {
                          setSelectedReport(report);
                          setDialogType('view');
                        }}>
                          <Eye className="mr-2 h-4 w-4" />
                          Ver Detalhes
                        </DropdownMenuItem>
                        {report.status === 'pending' && (
                          <>
                            <DropdownMenuItem 
                              onClick={() => {
                                setSelectedReport(report);
                                setDialogType('resolve');
                              }}
                              className="text-success"
                            >
                              <CheckCircle className="mr-2 h-4 w-4" />
                              Resolver
                            </DropdownMenuItem>
                            <DropdownMenuItem 
                              onClick={() => {
                                setSelectedReport(report);
                                setDialogType('dismiss');
                              }}
                              className="text-muted-foreground"
                            >
                              <XCircle className="mr-2 h-4 w-4" />
                              Descartar
                            </DropdownMenuItem>
                          </>
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* View Details Dialog */}
      <Dialog open={dialogType === 'view'} onOpenChange={() => setDialogType(null)}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Detalhes da Denúncia</DialogTitle>
          </DialogHeader>
          {selectedReport && (
            <div className="space-y-4">
              <div>
                <Label className="text-muted-foreground">Tipo</Label>
                <p className="font-medium capitalize">{selectedReport.type}</p>
              </div>
              <div>
                <Label className="text-muted-foreground">Motivo</Label>
                <p className="font-medium">{reasonLabels[selectedReport.reason]}</p>
              </div>
              <div>
                <Label className="text-muted-foreground">Descrição</Label>
                <p>{selectedReport.description}</p>
              </div>
              <div>
                <Label className="text-muted-foreground">Item Denunciado</Label>
                <div className="mt-1 rounded bg-muted p-3">
                  {selectedReport.type === 'post' && selectedReport.reportedItem.title}
                  {selectedReport.type === 'comment' && selectedReport.reportedItem.content}
                  {selectedReport.type === 'user' && `@${selectedReport.reportedItem.username}`}
                </div>
              </div>
              <div>
                <Label className="text-muted-foreground">Denunciado por</Label>
                <div className="flex items-center gap-2 mt-1">
                  <Avatar size="sm">
                    <AvatarImage src={selectedReport.reportedBy.avatarUrl} />
                    <AvatarFallback>{selectedReport.reportedBy.username.slice(0, 2).toUpperCase()}</AvatarFallback>
                  </Avatar>
                  <span>{selectedReport.reportedBy.username}</span>
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogType(null)}>Fechar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Resolve Dialog */}
      <Dialog open={dialogType === 'resolve'} onOpenChange={() => setDialogType(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Resolver Denúncia</DialogTitle>
            <DialogDescription>
              Ao resolver, você confirma que uma ação foi tomada contra o conteúdo/usuário denunciado.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogType(null)}>Cancelar</Button>
            <Button onClick={handleResolveReport}>Resolver</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dismiss Dialog */}
      <Dialog open={dialogType === 'dismiss'} onOpenChange={() => setDialogType(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Descartar Denúncia</DialogTitle>
            <DialogDescription>
              Ao descartar, você indica que a denúncia não é válida ou não requer ação.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogType(null)}>Cancelar</Button>
            <Button variant="secondary" onClick={handleDismissReport}>Descartar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function Label({ className, children, ...props }: React.LabelHTMLAttributes<HTMLLabelElement>) {
  return (
    <label className={`text-sm font-medium ${className}`} {...props}>
      {children}
    </label>
  );
}
