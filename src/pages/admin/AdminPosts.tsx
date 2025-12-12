import { useState } from 'react';
import { 
  Search, 
  MoreHorizontal, 
  Eye, 
  Trash2, 
  Edit,
  Pin,
  Flag,
  Filter,
  Star,
  MessageSquare
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
import { mockPosts } from '@/lib/mockData';
import { toast } from 'sonner';
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Link } from 'react-router-dom';

interface PostWithStatus {
  id: string;
  title: string;
  author: {
    username: string;
    avatarUrl?: string;
  };
  votes: number;
  commentCount: number;
  views: number;
  hasAcceptedAnswer: boolean;
  isPinned: boolean;
  isFeatured: boolean;
  status: 'published' | 'hidden' | 'flagged';
  createdAt: string;
  tags: { name: string }[];
}

const postsWithStatus: PostWithStatus[] = mockPosts.map((post, index) => ({
  ...post,
  isPinned: index === 0,
  isFeatured: index === 1,
  status: index === 3 ? 'flagged' : index === 4 ? 'hidden' : 'published',
}));

export default function AdminPosts() {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedPost, setSelectedPost] = useState<PostWithStatus | null>(null);
  const [dialogType, setDialogType] = useState<'delete' | 'hide' | null>(null);

  const filteredPosts = postsWithStatus.filter((post) => {
    const matchesSearch = post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.author.username.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || post.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleDeletePost = () => {
    toast.success(`Post "${selectedPost?.title}" foi removido`);
    setDialogType(null);
    setSelectedPost(null);
  };

  const handleHidePost = () => {
    toast.success(`Post "${selectedPost?.title}" foi ${selectedPost?.status === 'hidden' ? 'publicado' : 'ocultado'}`);
    setDialogType(null);
    setSelectedPost(null);
  };

  const handlePinPost = (post: PostWithStatus) => {
    toast.success(`Post "${post.title}" foi ${post.isPinned ? 'desafixado' : 'fixado'}`);
  };

  const handleFeaturePost = (post: PostWithStatus) => {
    toast.success(`Post "${post.title}" foi ${post.isFeatured ? 'removido dos destaques' : 'destacado'}`);
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
                <SelectItem value="flagged">Denunciados</SelectItem>
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
                          <AvatarImage src={post.author.avatarUrl} />
                          <AvatarFallback>{post.author.username.slice(0, 2).toUpperCase()}</AvatarFallback>
                        </Avatar>
                        <div className="min-w-0">
                          <div className="flex items-center gap-2">
                            <Link 
                              to={`/posts/${post.id}`}
                              className="font-medium text-foreground hover:text-primary truncate block"
                            >
                              {post.title}
                            </Link>
                            {post.isPinned && <Pin className="h-3 w-3 text-primary flex-shrink-0" />}
                            {post.isFeatured && <Star className="h-3 w-3 text-warning flex-shrink-0" />}
                          </div>
                          <p className="text-sm text-muted-foreground">
                            por {post.author.username}
                          </p>
                          <div className="flex gap-1 mt-1">
                            {post.tags.slice(0, 3).map((tag) => (
                              <Badge key={tag.name} variant="tag" size="sm">
                                {tag.name}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="py-4">
                      <div className="flex flex-col gap-1">
                        <Badge variant={
                          post.status === 'published' ? 'success' : 
                          post.status === 'hidden' ? 'secondary' : 'destructive'
                        }>
                          {post.status === 'published' ? 'Publicado' : 
                           post.status === 'hidden' ? 'Oculto' : 'Denunciado'}
                        </Badge>
                        {post.hasAcceptedAnswer && (
                          <Badge variant="success" size="sm">✓ Resolvido</Badge>
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
                            <Link to={`/posts/${post.id}`}>
                              <Eye className="mr-2 h-4 w-4" />
                              Visualizar
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Edit className="mr-2 h-4 w-4" />
                            Editar
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem onClick={() => handlePinPost(post)}>
                            <Pin className="mr-2 h-4 w-4" />
                            {post.isPinned ? 'Desafixar' : 'Fixar no topo'}
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleFeaturePost(post)}>
                            <Star className="mr-2 h-4 w-4" />
                            {post.isFeatured ? 'Remover destaque' : 'Destacar'}
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem 
                            onClick={() => {
                              setSelectedPost(post);
                              setDialogType('hide');
                            }}
                          >
                            <Flag className="mr-2 h-4 w-4" />
                            {post.status === 'hidden' ? 'Publicar' : 'Ocultar'}
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
        </CardContent>
      </Card>

      {/* Delete Dialog */}
      <Dialog open={dialogType === 'delete'} onOpenChange={() => setDialogType(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Remover Post</DialogTitle>
            <DialogDescription>
              Tem certeza que deseja remover "{selectedPost?.title}"? Esta ação não pode ser desfeita.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogType(null)}>Cancelar</Button>
            <Button variant="destructive" onClick={handleDeletePost}>Remover</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Hide Dialog */}
      <Dialog open={dialogType === 'hide'} onOpenChange={() => setDialogType(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {selectedPost?.status === 'hidden' ? 'Publicar' : 'Ocultar'} Post
            </DialogTitle>
            <DialogDescription>
              {selectedPost?.status === 'hidden'
                ? 'O post será visível para todos os usuários novamente.'
                : 'O post será ocultado e não aparecerá mais no feed.'
              }
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogType(null)}>Cancelar</Button>
            <Button onClick={handleHidePost}>
              {selectedPost?.status === 'hidden' ? 'Publicar' : 'Ocultar'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
