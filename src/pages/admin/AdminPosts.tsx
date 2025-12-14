import { useState, useEffect } from 'react';
import { 
  Search, 
  MoreHorizontal, 
  Eye, 
  Trash2, 
  Flag,
  Filter,
  MessageSquare,
  Loader2,
  EyeOff
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
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { adminService } from '@/services/admin.service';
import { useToast } from '@/hooks/use-toast';
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Link } from 'react-router-dom';

interface AdminPost {
  id: string;
  title: string;
  slug: string;
  votes: number;
  views: number;
  commentCount: number;
  hasAcceptedAnswer: boolean;
  isHidden: boolean;
  isLocked: boolean;
  createdAt: string;
  author: {
    id: string;
    username: string;
    avatarUrl: string | null;
  };
  tags: Array<{
    tag: {
      id: string;
      name: string;
      slug: string;
    };
  }>;
}

export default function AdminPosts() {
  const { toast } = useToast();
  const [posts, setPosts] = useState<AdminPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedPost, setSelectedPost] = useState<AdminPost | null>(null);
  const [dialogType, setDialogType] = useState<'delete' | 'hide' | 'unhide' | null>(null);
  const [hideReason, setHideReason] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    loadPosts();
  }, []);

  const loadPosts = async () => {
    try {
      setIsLoading(true);
      const response = await adminService.getAllPosts(1, 100);
      setPosts(response.data);
    } catch (error) {
      toast({
        title: 'Erro ao carregar posts',
        description: 'Não foi possível carregar a lista de posts.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const filteredPosts = posts.filter((post) => {
    const matchesSearch = post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.author.username.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || 
      (statusFilter === 'published' && !post.isHidden) ||
      (statusFilter === 'hidden' && post.isHidden);
    return matchesSearch && matchesStatus;
  });

  const handleDeletePost = async () => {
    if (!selectedPost) return;

    setIsSubmitting(true);
    try {
      await adminService.deletePost(selectedPost.id);
      toast({
        title: 'Post removido!',
        description: `"${selectedPost.title}" foi removido com sucesso.`,
      });
      await loadPosts();
      setDialogType(null);
      setSelectedPost(null);
    } catch (error) {
      const errorMessage =
        error instanceof Error && 'response' in error
          ? (error as { response?: { data?: { error?: { message?: string } } } }).response?.data?.error?.message
          : 'Não foi possível remover o post.';
      toast({
        title: 'Erro ao remover post',
        description: errorMessage,
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleHidePost = async () => {
    if (!selectedPost || !hideReason.trim()) {
      toast({
        title: 'Motivo obrigatório',
        description: 'Por favor, informe o motivo para ocultar o post.',
        variant: 'destructive',
      });
      return;
    }

    setIsSubmitting(true);
    try {
      await adminService.hidePost(selectedPost.id, hideReason);
      toast({
        title: 'Post ocultado!',
        description: `"${selectedPost.title}" foi ocultado com sucesso.`,
      });
      await loadPosts();
      setDialogType(null);
      setSelectedPost(null);
      setHideReason('');
    } catch (error) {
      const errorMessage =
        error instanceof Error && 'response' in error
          ? (error as { response?: { data?: { error?: { message?: string } } } }).response?.data?.error?.message
          : 'Não foi possível ocultar o post.';
      toast({
        title: 'Erro ao ocultar post',
        description: errorMessage,
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUnhidePost = async () => {
    if (!selectedPost) return;

    setIsSubmitting(true);
    try {
      await adminService.unhidePost(selectedPost.id);
      toast({
        title: 'Post publicado!',
        description: `"${selectedPost.title}" está visível novamente.`,
      });
      await loadPosts();
      setDialogType(null);
      setSelectedPost(null);
    } catch (error) {
      const errorMessage =
        error instanceof Error && 'response' in error
          ? (error as { response?: { data?: { error?: { message?: string } } } }).response?.data?.error?.message
          : 'Não foi possível publicar o post.';
      toast({
        title: 'Erro ao publicar post',
        description: errorMessage,
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">Posts</h1>
        <p className="text-muted-foreground">Gerencie os posts da plataforma</p>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col gap-4 sm:flex-row">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Buscar por título ou autor..."
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
                <SelectItem value="published">Publicados</SelectItem>
                <SelectItem value="hidden">Ocultos</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Posts Table */}
      <Card>
        <CardHeader>
          <CardTitle>Lista de Posts ({filteredPosts.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center items-center h-64">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : filteredPosts.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border text-left">
                    <th className="pb-3 font-medium text-muted-foreground">Post</th>
                    <th className="pb-3 font-medium text-muted-foreground">Status</th>
                    <th className="pb-3 font-medium text-muted-foreground">Votos</th>
                    <th className="pb-3 font-medium text-muted-foreground">Comentários</th>
                    <th className="pb-3 font-medium text-muted-foreground">Views</th>
                    <th className="pb-3 font-medium text-muted-foreground">Data</th>
                    <th className="pb-3 font-medium text-muted-foreground">Ações</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {filteredPosts.map((post) => (
                    <tr key={post.id} className="group">
                      <td className="py-4">
                        <div className="flex items-start gap-3 max-w-md">
                          <Avatar size="sm">
                            <AvatarImage src={post.author.avatarUrl || undefined} />
                            <AvatarFallback>{post.author.username.slice(0, 2).toUpperCase()}</AvatarFallback>
                          </Avatar>
                          <div className="min-w-0">
                            <Link 
                              to={`/posts/${post.slug}`}
                              className="font-medium text-foreground hover:text-primary truncate block"
                            >
                              {post.title}
                            </Link>
                            <p className="text-sm text-muted-foreground">
                              por {post.author.username}
                            </p>
                            <div className="flex gap-1 mt-1 flex-wrap">
                              {post.tags.slice(0, 3).map((tagRelation) => (
                                <Badge key={tagRelation.tag.id} variant="tag" size="sm">
                                  {tagRelation.tag.name}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="py-4">
                        <div className="flex flex-col gap-1">
                          <Badge variant={post.isHidden ? 'secondary' : 'success'}>
                            {post.isHidden ? 'Oculto' : 'Publicado'}
                          </Badge>
                          {post.hasAcceptedAnswer && (
                            <Badge variant="success" size="sm">✓ Resolvido</Badge>
                          )}
                          {post.isLocked && (
                            <Badge variant="warning" size="sm">🔒 Travado</Badge>
                          )}
                        </div>
                      </td>
                      <td className="py-4">
                        <span className="font-medium text-primary">{post.votes}</span>
                      </td>
                      <td className="py-4">
                        <div className="flex items-center gap-1 text-muted-foreground">
                          <MessageSquare className="h-4 w-4" />
                          {post.commentCount}
                        </div>
                      </td>
                      <td className="py-4">
                        <div className="flex items-center gap-1 text-muted-foreground">
                          <Eye className="h-4 w-4" />
                          {post.views}
                        </div>
                      </td>
                      <td className="py-4 text-sm text-muted-foreground">
                        {formatDistanceToNow(new Date(post.createdAt), { 
                          addSuffix: true,
                          locale: ptBR 
                        })}
                      </td>
                      <td className="py-4">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem asChild>
                              <Link to={`/posts/${post.slug}`}>
                                <Eye className="mr-2 h-4 w-4" />
                                Visualizar
                              </Link>
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem 
                              onClick={() => {
                                setSelectedPost(post);
                                setDialogType(post.isHidden ? 'unhide' : 'hide');
                              }}
                            >
                              {post.isHidden ? (
                                <>
                                  <Eye className="mr-2 h-4 w-4" />
                                  Publicar
                                </>
                              ) : (
                                <>
                                  <EyeOff className="mr-2 h-4 w-4" />
                                  Ocultar
                                </>
                              )}
                            </DropdownMenuItem>
                            <DropdownMenuItem 
                              onClick={() => {
                                setSelectedPost(post);
                                setDialogType('delete');
                              }}
                              className="text-destructive"
                            >
                              <Trash2 className="mr-2 h-4 w-4" />
                              Remover
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-center text-muted-foreground py-8">Nenhum post encontrado</p>
          )}
        </CardContent>
      </Card>

      {/* Delete Dialog */}
      <Dialog open={dialogType === 'delete'} onOpenChange={() => setDialogType(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Remover Post</DialogTitle>
            <DialogDescription>
              Tem certeza que deseja remover "{selectedPost?.title}"? Esta ação não pode ser desfeita. Todos os comentários também serão removidos.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogType(null)} disabled={isSubmitting}>
              Cancelar
            </Button>
            <Button variant="destructive" onClick={handleDeletePost} disabled={isSubmitting}>
              {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Remover
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Hide Dialog */}
      <Dialog open={dialogType === 'hide'} onOpenChange={() => {
        setDialogType(null);
        setHideReason('');
      }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Ocultar Post</DialogTitle>
            <DialogDescription>
              O post será ocultado e não aparecerá mais no feed.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="hideReason">Motivo *</Label>
              <Textarea
                id="hideReason"
                placeholder="Descreva o motivo para ocultar este post..."
                value={hideReason}
                onChange={(e) => setHideReason(e.target.value)}
                rows={4}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => {
              setDialogType(null);
              setHideReason('');
            }} disabled={isSubmitting}>
              Cancelar
            </Button>
            <Button onClick={handleHidePost} disabled={isSubmitting || !hideReason.trim()}>
              {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Ocultar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Unhide Dialog */}
      <Dialog open={dialogType === 'unhide'} onOpenChange={() => setDialogType(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Publicar Post</DialogTitle>
            <DialogDescription>
              O post será visível para todos os usuários novamente.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogType(null)} disabled={isSubmitting}>
              Cancelar
            </Button>
            <Button onClick={handleUnhidePost} disabled={isSubmitting}>
              {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Publicar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
