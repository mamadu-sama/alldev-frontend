import { useState } from 'react';
import { 
  Search, 
  MoreHorizontal, 
  Trash2, 
  Eye,
  Flag,
  Filter,
  CheckCircle,
  XCircle
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
  DropdownMenuSeparator,
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
import { mockComments, mockPosts } from '@/lib/mockData';
import { toast } from 'sonner';
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Link } from 'react-router-dom';

interface CommentWithStatus {
  id: string;
  content: string;
  author: {
    username: string;
    avatarUrl?: string;
  };
  postId: string;
  postTitle: string;
  votes: number;
  isAccepted: boolean;
  status: 'approved' | 'pending' | 'flagged';
  createdAt: string;
}

const allComments = Object.values(mockComments).flat();
const commentsWithStatus: CommentWithStatus[] = allComments.map((comment, index) => ({
  ...comment,
  postTitle: mockPosts.find(p => p.id === comment.postId)?.title || 'Post',
  status: index === 2 ? 'flagged' : index === 4 ? 'pending' : 'approved',
}));

export default function AdminComments() {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedComment, setSelectedComment] = useState<CommentWithStatus | null>(null);
  const [dialogType, setDialogType] = useState<'delete' | 'approve' | 'reject' | null>(null);

  const filteredComments = commentsWithStatus.filter((comment) => {
    const matchesSearch = comment.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      comment.author.username.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || comment.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleDeleteComment = () => {
    toast.success('Comentário removido com sucesso');
    setDialogType(null);
    setSelectedComment(null);
  };

  const handleApproveComment = () => {
    toast.success('Comentário aprovado com sucesso');
    setDialogType(null);
    setSelectedComment(null);
  };

  const handleRejectComment = () => {
    toast.success('Comentário rejeitado');
    setDialogType(null);
    setSelectedComment(null);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">Comentários</h1>
        <p className="text-muted-foreground">Modere os comentários da plataforma</p>
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
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <Filter className="mr-2 h-4 w-4" />
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos</SelectItem>
                <SelectItem value="approved">Aprovados</SelectItem>
                <SelectItem value="pending">Pendentes</SelectItem>
                <SelectItem value="flagged">Denunciados</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Comments List */}
      <Card>
        <CardHeader>
          <CardTitle>Lista de Comentários ({filteredComments.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredComments.map((comment) => (
              <div 
                key={comment.id} 
                className="rounded-lg border border-border p-4 transition-colors hover:bg-accent/50"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-3 flex-1 min-w-0">
                    <Avatar>
                      <AvatarImage src={comment.author.avatarUrl} />
                      <AvatarFallback>{comment.author.username.slice(0, 2).toUpperCase()}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-medium text-foreground">{comment.author.username}</span>
                        <span className="text-sm text-muted-foreground">
                          {formatDistanceToNow(new Date(comment.createdAt), { 
                            addSuffix: true,
                            locale: ptBR 
                          })}
                        </span>
                        <Badge variant={
                          comment.status === 'approved' ? 'success' : 
                          comment.status === 'pending' ? 'warning' : 'destructive'
                        } size="sm">
                          {comment.status === 'approved' ? 'Aprovado' : 
                           comment.status === 'pending' ? 'Pendente' : 'Denunciado'}
                        </Badge>
                        {comment.isAccepted && (
                          <Badge variant="success" size="sm">✓ Aceito</Badge>
                        )}
                      </div>
                      <p className="mt-2 text-foreground line-clamp-2">{comment.content}</p>
                      <Link 
                        to={`/posts/${comment.postId}`}
                        className="mt-2 text-sm text-primary hover:underline inline-block"
                      >
                        Em: {comment.postTitle}
                      </Link>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-muted-foreground">{comment.votes} votos</span>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem asChild>
                          <Link to={`/posts/${comment.postId}`}>
                            <Eye className="mr-2 h-4 w-4" />
                            Ver no Post
                          </Link>
                        </DropdownMenuItem>
                        {comment.status !== 'approved' && (
                          <DropdownMenuItem 
                            onClick={() => {
                              setSelectedComment(comment);
                              setDialogType('approve');
                            }}
                            className="text-success"
                          >
                            <CheckCircle className="mr-2 h-4 w-4" />
                            Aprovar
                          </DropdownMenuItem>
                        )}
                        {comment.status !== 'flagged' && (
                          <DropdownMenuItem 
                            onClick={() => {
                              setSelectedComment(comment);
                              setDialogType('reject');
                            }}
                            className="text-warning"
                          >
                            <XCircle className="mr-2 h-4 w-4" />
                            Rejeitar
                          </DropdownMenuItem>
                        )}
                        <DropdownMenuSeparator />
                        <DropdownMenuItem 
                          onClick={() => {
                            setSelectedComment(comment);
                            setDialogType('delete');
                          }}
                          className="text-destructive"
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          Remover
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Delete Dialog */}
      <Dialog open={dialogType === 'delete'} onOpenChange={() => setDialogType(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Remover Comentário</DialogTitle>
            <DialogDescription>
              Tem certeza que deseja remover este comentário? Esta ação não pode ser desfeita.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogType(null)}>Cancelar</Button>
            <Button variant="destructive" onClick={handleDeleteComment}>Remover</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Approve Dialog */}
      <Dialog open={dialogType === 'approve'} onOpenChange={() => setDialogType(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Aprovar Comentário</DialogTitle>
            <DialogDescription>
              O comentário será aprovado e visível para todos os usuários.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogType(null)}>Cancelar</Button>
            <Button onClick={handleApproveComment}>Aprovar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Reject Dialog */}
      <Dialog open={dialogType === 'reject'} onOpenChange={() => setDialogType(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Rejeitar Comentário</DialogTitle>
            <DialogDescription>
              O comentário será rejeitado e não será mais visível.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogType(null)}>Cancelar</Button>
            <Button variant="destructive" onClick={handleRejectComment}>Rejeitar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
