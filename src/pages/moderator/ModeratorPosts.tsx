import { useState } from 'react';
import { 
  Search, 
  Eye,
  Edit,
  EyeOff,
  Lock,
  Unlock,
  Filter,
  ExternalLink
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
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
import { toast } from 'sonner';
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Link } from 'react-router-dom';
import { mockPosts } from '@/lib/mockData';

interface ModeratedPost {
  id: string;
  title: string;
  content: string;
  author: {
    username: string;
    avatarUrl?: string;
  };
  reports: number;
  status: 'visible' | 'hidden' | 'locked';
  createdAt: string;
}

const moderatedPosts: ModeratedPost[] = mockPosts.slice(0, 5).map((post, index) => ({
  id: post.id,
  title: post.title,
  content: post.content.slice(0, 200),
  author: post.author,
  reports: [3, 1, 5, 0, 2][index],
  status: index === 2 ? 'hidden' : index === 4 ? 'locked' : 'visible',
  createdAt: post.createdAt,
}));

export default function ModeratorPosts() {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedPost, setSelectedPost] = useState<ModeratedPost | null>(null);
  const [editContent, setEditContent] = useState('');
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  const filteredPosts = moderatedPosts.filter((post) => {
    const matchesSearch = post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.author.username.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || post.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleToggleVisibility = (post: ModeratedPost) => {
    const newStatus = post.status === 'hidden' ? 'visível' : 'oculto';
    toast.success(`Post marcado como ${newStatus}`);
  };

  const handleToggleLock = (post: ModeratedPost) => {
    const action = post.status === 'locked' ? 'desbloqueado' : 'bloqueado';
    toast.success(`Post ${action} para novos comentários`);
  };

  const handleEditPost = () => {
    toast.success('Post editado com sucesso');
    setIsEditDialogOpen(false);
    setSelectedPost(null);
    setEditContent('');
  };

  const openEditDialog = (post: ModeratedPost) => {
    setSelectedPost(post);
    setEditContent(post.content);
    setIsEditDialogOpen(true);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">Posts Reportados</h1>
        <p className="text-muted-foreground">Gerencie posts que foram denunciados pela comunidade</p>
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
                <SelectItem value="visible">Visíveis</SelectItem>
                <SelectItem value="hidden">Ocultos</SelectItem>
                <SelectItem value="locked">Bloqueados</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Posts List */}
      <Card>
        <CardHeader>
          <CardTitle>Posts ({filteredPosts.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredPosts.map((post) => (
              <div 
                key={post.id} 
                className="rounded-lg border border-border p-4 transition-colors hover:bg-accent/30"
              >
                <div className="flex items-start gap-4">
                  <Avatar>
                    <AvatarImage src={post.author.avatarUrl} />
                    <AvatarFallback>{post.author.username.slice(0, 2).toUpperCase()}</AvatarFallback>
                  </Avatar>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <Badge 
                        variant={
                          post.status === 'visible' ? 'success' : 
                          post.status === 'hidden' ? 'destructive' : 'warning'
                        } 
                        size="sm"
                      >
                        {post.status === 'visible' ? 'Visível' : 
                         post.status === 'hidden' ? 'Oculto' : 'Bloqueado'}
                      </Badge>
                      {post.reports > 0 && (
                        <Badge variant="destructive" size="sm">
                          {post.reports} denúncias
                        </Badge>
                      )}
                    </div>
                    
                    <h4 className="mt-2 font-medium text-foreground">{post.title}</h4>
                    <p className="mt-1 text-sm text-muted-foreground line-clamp-2">{post.content}...</p>
                    
                    <div className="mt-2 flex items-center gap-4 text-sm text-muted-foreground">
                      <span>@{post.author.username}</span>
                      <span>
                        {formatDistanceToNow(new Date(post.createdAt), { addSuffix: true, locale: ptBR })}
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex flex-col gap-2">
                    <Button size="sm" variant="outline" asChild>
                      <Link to={`/posts/${post.id}`} target="_blank">
                        <ExternalLink className="mr-1 h-4 w-4" />
                        Ver
                      </Link>
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => openEditDialog(post)}>
                      <Edit className="mr-1 h-4 w-4" />
                      Editar
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline" 
                      onClick={() => handleToggleVisibility(post)}
                    >
                      {post.status === 'hidden' ? (
                        <><Eye className="mr-1 h-4 w-4" /> Mostrar</>
                      ) : (
                        <><EyeOff className="mr-1 h-4 w-4" /> Ocultar</>
                      )}
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline" 
                      onClick={() => handleToggleLock(post)}
                    >
                      {post.status === 'locked' ? (
                        <><Unlock className="mr-1 h-4 w-4" /> Desbloquear</>
                      ) : (
                        <><Lock className="mr-1 h-4 w-4" /> Bloquear</>
                      )}
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Editar Post</DialogTitle>
            <DialogDescription>
              Edite o conteúdo do post para remover conteúdo inapropriado ou corrigir formatação.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            {selectedPost && (
              <div className="text-sm text-muted-foreground">
                <strong>Título:</strong> {selectedPost.title}
              </div>
            )}
            <Textarea
              value={editContent}
              onChange={(e) => setEditContent(e.target.value)}
              rows={10}
              placeholder="Conteúdo do post..."
            />
            <p className="text-sm text-muted-foreground">
              Nota: Edições são registradas no histórico de moderação.
            </p>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>Cancelar</Button>
            <Button onClick={handleEditPost}>Salvar Alterações</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
