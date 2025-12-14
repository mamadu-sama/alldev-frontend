import { useState, useEffect } from 'react';
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
  User,
  Loader2
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Label } from '@/components/ui/label';
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
import { adminService } from '@/services/admin.service';
import { useToast } from '@/hooks/use-toast';
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Link } from 'react-router-dom';

interface Report {
  id: string;
  reason: string;
  description: string;
  status: string;
  createdAt: string;
  reporter: {
    id: string;
    username: string;
    avatarUrl: string | null;
  };
  post?: {
    id: string;
    title: string;
    slug: string;
  };
  comment?: {
    id: string;
    content: string;
    post: {
      slug: string;
    };
  };
}

const reasonLabels: Record<string, string> = {
  SPAM: 'Spam',
  INAPPROPRIATE: 'Conteúdo Inapropriado',
  OFFENSIVE: 'Ofensivo',
  MISINFORMATION: 'Desinformação',
  OTHER: 'Outro',
};

const typeIcons = {
  post: FileText,
  comment: MessageSquare,
  user: User,
};

export default function AdminReports() {
  const { toast } = useToast();
  const [reports, setReports] = useState<Report[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);
  const [dialogType, setDialogType] = useState<'view' | 'resolve' | 'dismiss' | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    loadReports();
  }, [statusFilter]);

  const loadReports = async () => {
    try {
      setIsLoading(true);
      const response = await adminService.getAllReports(1, 100, statusFilter);
      setReports(response.data);
    } catch (error) {
      toast({
        title: 'Erro ao carregar denúncias',
        description: 'Não foi possível carregar a lista de denúncias.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const filteredReports = reports.filter((report) => {
    const matchesSearch = report.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      report.reporter.username.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSearch;
  });

  const pendingCount = reports.filter(r => r.status === 'PENDING').length;

  const handleResolveReport = async () => {
    if (!selectedReport) return;

    setIsSubmitting(true);
    try {
      await adminService.updateReportStatus(selectedReport.id, 'RESOLVED', 'Ação tomada pelo administrador');
      toast({
        title: 'Denúncia resolvida!',
        description: 'A denúncia foi marcada como resolvida.',
      });
      await loadReports();
      setDialogType(null);
      setSelectedReport(null);
    } catch (error) {
      const errorMessage =
        error instanceof Error && 'response' in error
          ? (error as { response?: { data?: { error?: { message?: string } } } }).response?.data?.error?.message
          : 'Não foi possível resolver a denúncia.';
      toast({
        title: 'Erro ao resolver denúncia',
        description: errorMessage,
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDismissReport = async () => {
    if (!selectedReport) return;

    setIsSubmitting(true);
    try {
      await adminService.updateReportStatus(selectedReport.id, 'DISMISSED', 'Denúncia não válida');
      toast({
        title: 'Denúncia descartada!',
        description: 'A denúncia foi descartada.',
      });
      await loadReports();
      setDialogType(null);
      setSelectedReport(null);
    } catch (error) {
      const errorMessage =
        error instanceof Error && 'response' in error
          ? (error as { response?: { data?: { error?: { message?: string } } } }).response?.data?.error?.message
          : 'Não foi possível descartar a denúncia.';
      toast({
        title: 'Erro ao descartar denúncia',
        description: errorMessage,
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const getReportType = (report: Report): 'post' | 'comment' | 'user' => {
    if (report.post) return 'post';
    if (report.comment) return 'comment';
    return 'user';
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
                <SelectItem value="PENDING">Pendentes</SelectItem>
                <SelectItem value="RESOLVED">Resolvidos</SelectItem>
                <SelectItem value="DISMISSED">Descartados</SelectItem>
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
          {isLoading ? (
            <div className="flex justify-center items-center h-64">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : filteredReports.length > 0 ? (
            <div className="space-y-4">
              {filteredReports.map((report) => {
                const reportType = getReportType(report);
                const TypeIcon = typeIcons[reportType];
                return (
                  <div 
                    key={report.id} 
                    className="rounded-lg border border-border p-4 transition-colors hover:bg-accent/50"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex items-start gap-3 flex-1">
                        <div className={`rounded-lg p-2 ${
                          reportType === 'post' ? 'bg-blue-500/10 text-blue-500' :
                          reportType === 'comment' ? 'bg-purple-500/10 text-purple-500' :
                          'bg-amber-500/10 text-amber-500'
                        }`}>
                          <TypeIcon className="h-5 w-5" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <Badge variant={
                              report.reason === 'SPAM' ? 'warning' :
                              report.reason === 'OFFENSIVE' || report.reason === 'INAPPROPRIATE' ? 'destructive' :
                              'secondary'
                            } size="sm">
                              {reasonLabels[report.reason] || report.reason}
                            </Badge>
                            <Badge variant={
                              report.status === 'PENDING' ? 'warning' :
                              report.status === 'RESOLVED' ? 'success' : 'secondary'
                            } size="sm">
                              {report.status === 'PENDING' ? 'Pendente' :
                               report.status === 'RESOLVED' ? 'Resolvido' : 'Descartado'}
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
                              {report.post && (
                                <Link to={`/posts/${report.post.slug}`} className="hover:underline">
                                  Post: "{report.post.title}"
                                </Link>
                              )}
                              {report.comment && (
                                <Link to={`/posts/${report.comment.post.slug}`} className="hover:underline">
                                  Comentário: "{report.comment.content.slice(0, 50)}..."
                                </Link>
                              )}
                            </p>
                          </div>
                          <div className="mt-2 flex items-center gap-2">
                            <Avatar size="xs">
                              <AvatarImage src={report.reporter.avatarUrl || undefined} />
                              <AvatarFallback>{report.reporter.username.slice(0, 2).toUpperCase()}</AvatarFallback>
                            </Avatar>
                            <span className="text-sm text-muted-foreground">
                              Denunciado por {report.reporter.username}
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
                          {report.status === 'PENDING' && (
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
          ) : (
            <p className="text-center text-muted-foreground py-8">Nenhuma denúncia encontrada</p>
          )}
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
                <p className="font-medium capitalize">{getReportType(selectedReport)}</p>
              </div>
              <div>
                <Label className="text-muted-foreground">Motivo</Label>
                <p className="font-medium">{reasonLabels[selectedReport.reason] || selectedReport.reason}</p>
              </div>
              <div>
                <Label className="text-muted-foreground">Descrição</Label>
                <p>{selectedReport.description}</p>
              </div>
              <div>
                <Label className="text-muted-foreground">Item Denunciado</Label>
                <div className="mt-1 rounded bg-muted p-3">
                  {selectedReport.post && selectedReport.post.title}
                  {selectedReport.comment && selectedReport.comment.content}
                </div>
              </div>
              <div>
                <Label className="text-muted-foreground">Denunciado por</Label>
                <div className="flex items-center gap-2 mt-1">
                  <Avatar size="sm">
                    <AvatarImage src={selectedReport.reporter.avatarUrl || undefined} />
                    <AvatarFallback>{selectedReport.reporter.username.slice(0, 2).toUpperCase()}</AvatarFallback>
                  </Avatar>
                  <span>{selectedReport.reporter.username}</span>
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
              Ao resolver, você confirma que uma ação foi tomada contra o conteúdo denunciado.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogType(null)} disabled={isSubmitting}>
              Cancelar
            </Button>
            <Button onClick={handleResolveReport} disabled={isSubmitting}>
              {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Resolver
            </Button>
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
            <Button variant="outline" onClick={() => setDialogType(null)} disabled={isSubmitting}>
              Cancelar
            </Button>
            <Button variant="secondary" onClick={handleDismissReport} disabled={isSubmitting}>
              {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Descartar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
