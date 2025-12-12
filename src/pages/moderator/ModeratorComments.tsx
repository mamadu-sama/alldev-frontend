import { useState } from 'react';
import { 
  Search, 
  Eye,
  EyeOff,
  Trash2,
  AlertTriangle,
  Filter,
  MessageSquare
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
import { mockComments, mockPosts } from '@/lib/mockData';

interface ModeratedComment {
  id: string;
  content: string;
  postTitle: string;
  postId: string;
  author: {
    username: string;
    avatarUrl?: string;
  };
  reports: number;
  status: 'visible' | 'hidden';
  createdAt: string;
}

const allComments = Object.values(mockComments).flat();
const moderatedComments: ModeratedComment[] = allComments.slice(0, 6).map((comment, index) => ({
  id: comment.id,
  content: comment.content.slice(0, 200),
  postTitle: mockPosts.find(p => p.id === comment.postId)?.title || 'Post',
  postId: comment.postId,
  author: comment.author,
  reports: [2, 0, 4, 1, 3, 0][index],
  status: index === 2 ? 'hidden' : 'visible',
  createdAt: comment.createdAt,
}));

export default function ModeratorComments() {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedComment, setSelectedComment] = useState<ModeratedComment | null>(null);
  const [actionType, setActionType] = useState<'hide' | 'delete' | 'warn' | null>(null);
  const [warningMessage, setWarningMessage] = useState('');

  const filteredComments = moderatedComments.filter((comment) => {
    const matchesSearch = comment.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      comment.author.username.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || comment.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleAction = () => {
    const messages = {
      hide: 'Comentário ocultado',
      delete: 'Comentário removido',
      warn: 'Aviso enviado ao usuário',
    };
    toast.success(messages[actionType!]);
    setActionType(null);
    setSelectedComment(null);
    setWarningMessage('');
  };

  const handleToggleVisibility = (comment: ModeratedComment) => {
    const action = comment.status === 'hidden' ? 'visível' : 'oculto';
    toast.success(`Comentário marcado como ${action}`);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">Comentários</h1>
        <p className="text-muted-foreground">Modere comentários reportados ou problemáticos</p>
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
                <SelectItem value="visible">Visíveis</SelectItem>
                <SelectItem value="hidden">Ocultos</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Comments List */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5" />
            Comentários ({filteredComments.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredComments.map((comment) => (
              <div 
                key={comment.id} 
                className="rounded-lg border border-border p-4 transition-colors hover:bg-accent/30"
              >
                <div className="flex items-start gap-4">
                  <Avatar>
                    <AvatarImage src={comment.author.avatarUrl} />
                    <AvatarFallback>{comment.author.username.slice(0, 2).toUpperCase()}</AvatarFallback>
                  </Avatar>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <Badge 
                        variant={comment.status === 'visible' ? 'success' : 'destructive'} 
                        size="sm"
                      >
                        {comment.status === 'visible' ? 'Visível' : 'Oculto'}
                      </Badge>
                      {comment.reports > 0 && (
                        <Badge variant="destructive" size="sm">
                          {comment.reports} denúncias
                        </Badge>
                      )}
                    </div>
                    
                    <p className="mt-2 text-foreground line-clamp-3">{comment.content}...</p>
                    
                    <div className="mt-2 flex items-center gap-4 text-sm text-muted-foreground">
                      <span>@{comment.author.username}</span>
                      <span>em "{comment.postTitle.slice(0, 40)}..."</span>
                      <span>
                        {formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true, locale: ptBR })}
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex flex-col gap-2">
                    <Button 
                      size="sm" 
                      variant="outline" 
                      onClick={() => handleToggleVisibility(comment)}
                    >
                      {comment.status === 'hidden' ? (
                        <><Eye className="mr-1 h-4 w-4" /> Mostrar</>
                      ) : (
                        <><EyeOff className="mr-1 h-4 w-4" /> Ocultar</>
                      )}
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => {
                        setSelectedComment(comment);
                        setActionType('warn');
                      }}
                    >
                      <AlertTriangle className="mr-1 h-4 w-4 text-warning" />
                      Avisar
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline"
                      className="text-destructive hover:text-destructive"
                      onClick={() => {
                        setSelectedComment(comment);
                        setActionType('delete');
                      }}
                    >
                      <Trash2 className="mr-1 h-4 w-4" />
                      Remover
                    </Button>
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
              {actionType === 'delete' && 'Remover Comentário'}
              {actionType === 'warn' && 'Enviar Aviso ao Usuário'}
            </DialogTitle>
            <DialogDescription>
              {actionType === 'delete' && 'O comentário será permanentemente removido.'}
              {actionType === 'warn' && 'Envie um aviso ao autor sobre as regras da comunidade.'}
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            {selectedComment && (
              <div className="rounded-lg bg-muted p-3">
                <p className="text-sm text-muted-foreground line-clamp-3">
                  {selectedComment.content}
                </p>
                <p className="mt-1 text-xs text-muted-foreground">
                  por @{selectedComment.author.username}
                </p>
              </div>
            )}
            
            {actionType === 'warn' && (
              <div className="space-y-2">
                <label className="text-sm font-medium">Mensagem de Aviso</label>
                <Textarea
                  placeholder="Explique o motivo do aviso..."
                  value={warningMessage}
                  onChange={(e) => setWarningMessage(e.target.value)}
                  rows={3}
                />
              </div>
            )}
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setActionType(null)}>Cancelar</Button>
            <Button 
              variant={actionType === 'delete' ? 'destructive' : 'default'}
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
