import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ChevronUp, ChevronDown, Eye, Pencil, Trash2, ArrowLeft, MessageSquare, Loader2, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { MarkdownContent } from '@/components/common/MarkdownContent';
import { CommentItem } from '@/components/post/CommentItem';
import { useAuthStore } from '@/stores/authStore';
import { useToast } from '@/hooks/use-toast';
import { postService } from '@/services/post.service';
import { commentService } from '@/services/comment.service';
import { voteService } from '@/services/vote.service';
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import type { Post, Comment } from '@/types';

type SortOption = 'votes' | 'recent' | 'oldest';

export default function PostDetails() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuthStore();
  const { toast } = useToast();

  const [post, setPost] = useState<Post | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [postVotes, setPostVotes] = useState(0);
  const [userVote, setUserVote] = useState<'up' | 'down' | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [sortBy, setSortBy] = useState<SortOption>('votes');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  // Load post from API
  useEffect(() => {
    const loadPost = async () => {
      if (!slug) return;

      try {
        setIsLoading(true);
        const fetchedPost = await postService.getPostBySlug(slug);
        setPost(fetchedPost);
        setPostVotes(fetchedPost.votes);
        setUserVote(fetchedPost.userVote);
        
        // Load comments
        if (fetchedPost.id) {
          const commentsResponse = await commentService.getComments(fetchedPost.id);
          setComments(commentsResponse.data);
        }
      } catch (error) {
        toast({
          title: 'Erro ao carregar post',
          description: 'Não foi possível carregar o post. Tente novamente.',
          variant: 'destructive',
        });
      } finally {
        setIsLoading(false);
      }
    };

    loadPost();
  }, [slug, toast]);

  if (isLoading) {
    return (
      <div className="text-center py-12">
        <Loader2 className="h-12 w-12 mx-auto text-primary animate-spin mb-4" />
        <p className="text-muted-foreground">Carregando post...</p>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold mb-4">Post não encontrado</h2>
        <Button onClick={() => navigate('/')}>Voltar para o feed</Button>
      </div>
    );
  }

  const getInitials = (username: string) => username.slice(0, 2).toUpperCase();
  const timeAgo = formatDistanceToNow(new Date(post.createdAt), { addSuffix: true, locale: ptBR });
  const isAuthor = user?.id === post.author.id;
  const hasAcceptedAnswer = comments.some(c => c.isAccepted);

  const handleVote = async (voteType: 'up' | 'down') => {
    if (!isAuthenticated || !post) {
      toast({ title: 'Faça login para votar', variant: 'destructive' });
      return;
    }

    try {
      const response = await voteService.votePost(post.id, voteType);
      setPostVotes(response.votes);
      setUserVote(response.userVote);
    } catch (error) {
      toast({
        title: 'Erro ao votar',
        description: 'Não foi possível registrar o voto. Tente novamente.',
        variant: 'destructive',
      });
    }
  };

  const handleCommentVote = async (commentId: string, voteType: 'up' | 'down') => {
    if (!isAuthenticated) {
      toast({ title: 'Faça login para votar', variant: 'destructive' });
      return;
    }

    try {
      const response = await voteService.voteComment(commentId, voteType);
      
      // Atualizar comentário localmente
      setComments(comments.map(c => {
        if (c.id !== commentId) return c;
        return { ...c, votes: response.votes, userVote: response.userVote };
      }));
    } catch (error) {
      toast({
        title: 'Erro ao votar',
        description: 'Não foi possível registrar o voto. Tente novamente.',
        variant: 'destructive',
      });
    }
  };

  const handleAcceptAnswer = async (commentId: string) => {
    if (!isAuthenticated) {
      toast({ title: 'Faça login para aceitar respostas', variant: 'destructive' });
      return;
    }

    try {
      await commentService.acceptComment(commentId);
      
      // Atualizar comentários localmente
      setComments(comments.map(c => ({
        ...c,
        isAccepted: c.id === commentId,
      })));
      
      // Atualizar post
      if (post) {
        setPost({ ...post, hasAcceptedAnswer: true });
      }
      
      toast({ 
        title: 'Resposta aceita!', 
        description: 'O autor ganhou +25 de reputação e você ganhou +2.' 
      });
    } catch (error) {
      const errorMessage =
        error instanceof Error && 'response' in error
          ? (error as { response?: { data?: { error?: { message?: string } } } }).response?.data?.error?.message
          : 'Não foi possível aceitar a resposta.';
      
      toast({
        title: 'Erro ao aceitar resposta',
        description: errorMessage || 'Não foi possível aceitar a resposta.',
        variant: 'destructive',
      });
    }
  };

  const handleSubmitComment = async () => {
    if (!newComment.trim()) return;
    if (!isAuthenticated || !user || !post) {
      toast({ title: 'Faça login para comentar', variant: 'destructive' });
      return;
    }

    setIsSubmitting(true);

    try {
      const createdComment = await commentService.createComment(post.id, {
        content: newComment,
      });

      // Adicionar comentário à lista
      setComments([...comments, createdComment]);
      setNewComment('');
      
      toast({ title: 'Comentário adicionado!' });
    } catch (error) {
      const errorMessage =
        error instanceof Error && 'response' in error
          ? (error as { response?: { data?: { error?: { message?: string } } } }).response?.data?.error?.message
          : 'Não foi possível adicionar o comentário.';
      
      toast({
        title: 'Erro ao adicionar comentário',
        description: errorMessage || 'Não foi possível adicionar o comentário.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEditPost = () => {
    if (!post) return;
    navigate(`/posts/${post.slug}/edit`);
  };

  const handleDeletePost = () => {
    setIsDeleteDialogOpen(true);
  };

  const confirmDeletePost = async () => {
    if (!post) return;

    setIsDeleting(true);

    try {
      await postService.deletePost(post.id);
      
      toast({ 
        title: 'Post deletado!', 
        description: 'Seu post foi removido com sucesso.' 
      });
      
      navigate('/');
    } catch (error) {
      const errorMessage =
        error instanceof Error && 'response' in error
          ? (error as { response?: { data?: { error?: { message?: string } } } }).response?.data?.error?.message
          : 'Não foi possível deletar o post.';
      
      toast({
        title: 'Erro ao deletar post',
        description: errorMessage || 'Não foi possível deletar o post.',
        variant: 'destructive',
      });
    } finally {
      setIsDeleting(false);
      setIsDeleteDialogOpen(false);
    }
  };

  // Sort comments
  const sortedComments = [...comments].sort((a, b) => {
    // Accepted answer always first
    if (a.isAccepted) return -1;
    if (b.isAccepted) return 1;
    
    switch (sortBy) {
      case 'votes':
        return b.votes - a.votes;
      case 'recent':
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      case 'oldest':
        return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      default:
        return 0;
    }
  });

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Back button */}
      <Button variant="ghost" onClick={() => navigate(-1)} className="gap-2">
        <ArrowLeft className="h-4 w-4" />
        Voltar
      </Button>

      {/* Post header */}
      <div>
        <h1 className="text-3xl font-bold mb-4">{post.title}</h1>
        <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
          <Link to={`/users/${post.author.username}`} className="flex items-center gap-2 hover:text-foreground">
            <Avatar size="sm">
              <AvatarImage src={post.author.avatarUrl} alt={post.author.username} />
              <AvatarFallback>{getInitials(post.author.username)}</AvatarFallback>
            </Avatar>
            <span className="font-medium">{post.author.username}</span>
          </Link>
          <span>Perguntou {timeAgo}</span>
          <div className="flex items-center gap-1">
            <Eye className="h-4 w-4" />
            {post.views.toLocaleString()} visualizações
          </div>
        </div>
      </div>

      {/* Post content */}
      <Card className="p-6">
        <div className="flex gap-6">
          {/* Vote buttons */}
          <div className="flex flex-col items-center gap-2">
            <Button
              variant={userVote === 'up' ? 'voteActive' : 'vote'}
              size="icon"
              onClick={() => handleVote('up')}
              className="rounded-full"
            >
              <ChevronUp className="h-6 w-6" />
            </Button>
            <span className={`text-2xl font-bold ${postVotes > 0 ? 'text-success' : postVotes < 0 ? 'text-destructive' : ''}`}>
              {postVotes}
            </span>
            <Button
              variant={userVote === 'down' ? 'voteActive' : 'vote'}
              size="icon"
              onClick={() => handleVote('down')}
              className="rounded-full"
            >
              <ChevronDown className="h-6 w-6" />
            </Button>
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <div className="markdown-content">
              <MarkdownContent content={post.content} />
            </div>

            {/* Tags */}
            <div className="flex flex-wrap gap-2 mt-6 pt-6 border-t border-border">
              {post.tags.map(tag => (
                <Badge key={tag.id} variant="tag" onClick={() => navigate(`/tags/${tag.slug}`)}>
                  {tag.name}
                </Badge>
              ))}
            </div>

            {/* Author actions */}
            {isAuthor && (
              <div className="flex gap-2 mt-4">
                <Button variant="outline" size="sm" className="gap-2" onClick={handleEditPost}>
                  <Pencil className="h-4 w-4" />
                  Editar
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="gap-2 text-destructive hover:text-destructive"
                  onClick={handleDeletePost}
                >
                  <Trash2 className="h-4 w-4" />
                  Deletar
                </Button>
              </div>
            )}
          </div>
        </div>
      </Card>

      {/* Comments section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold flex items-center gap-2">
            <MessageSquare className="h-5 w-5" />
            {comments.length} {comments.length === 1 ? 'Resposta' : 'Respostas'}
          </h2>
          <Select value={sortBy} onValueChange={(v) => setSortBy(v as SortOption)}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Ordenar por" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="votes">Mais votados</SelectItem>
              <SelectItem value="recent">Mais recentes</SelectItem>
              <SelectItem value="oldest">Mais antigos</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Comment form */}
        {isAuthenticated ? (
          <Card className="p-4">
            <h3 className="font-medium mb-3">Sua Resposta</h3>
            <Textarea
              placeholder="Escreva sua resposta em Markdown..."
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              className="min-h-32 mb-3"
            />
            <div className="flex justify-end">
              <Button 
                variant="gradient" 
                onClick={handleSubmitComment}
                disabled={isSubmitting || !newComment.trim()}
              >
                {isSubmitting ? 'Enviando...' : 'Enviar Resposta'}
              </Button>
            </div>
          </Card>
        ) : (
          <Card className="p-6 text-center">
            <p className="text-muted-foreground mb-4">Faça login para responder esta pergunta</p>
            <Button variant="gradient" asChild>
              <Link to="/login">Entrar</Link>
            </Button>
          </Card>
        )}

        {/* Comments list */}
        <div className="space-y-4">
          {sortedComments.map((comment) => (
            <CommentItem
              key={comment.id}
              comment={comment}
              isPostAuthor={isAuthor}
              isCommentAuthor={user?.id === comment.author.id}
              canAccept={!hasAcceptedAnswer}
              onVote={handleCommentVote}
              onAccept={handleAcceptAnswer}
            />
          ))}
        </div>
      </div>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-destructive" />
              Confirmar Exclusão
            </DialogTitle>
            <DialogDescription>
              Tem certeza que deseja deletar este post? Esta ação não pode ser desfeita.
              Todos os comentários e votos associados também serão removidos.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsDeleteDialogOpen(false)}
              disabled={isDeleting}
            >
              Cancelar
            </Button>
            <Button
              variant="destructive"
              onClick={confirmDeletePost}
              disabled={isDeleting}
            >
              {isDeleting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Deletar Post
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
