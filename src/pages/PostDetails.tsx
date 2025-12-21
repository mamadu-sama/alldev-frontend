import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ChevronUp, ChevronDown, Eye, Pencil, Trash2, ArrowLeft, MessageSquare, Loader2, AlertTriangle, Flag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card } from '@/components/ui/card';
import { MarkdownEditor } from '@/components/common/MarkdownEditor';
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
import { ReportDialog } from '@/components/report/ReportDialog';
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
  const [isReportDialogOpen, setIsReportDialogOpen] = useState(false);
  const [reportTarget, setReportTarget] = useState<{ type: 'post' | 'comment'; id: string; title?: string; preview?: string } | null>(null);
  const [replyingTo, setReplyingTo] = useState<{ id: string; username: string } | null>(null);
  const [replyContent, setReplyContent] = useState('');

  // Comment edit/delete states
  const [commentToDeleteId, setCommentToDeleteId] = useState<string | null>(null);
  const [isCommentDeleteDialogOpen, setIsCommentDeleteDialogOpen] = useState(false);
  const [isCommentDeleting, setIsCommentDeleting] = useState(false);
  const [editingComment, setEditingComment] = useState<Comment | null>(null);
  const [isEditCommentDialogOpen, setIsEditCommentDialogOpen] = useState(false);
  const [editCommentContent, setEditCommentContent] = useState('');
  const [isEditingComment, setIsEditingComment] = useState(false);

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

      // Atualizar comentário localmente de forma recursiva (Timeline)
      const updateVoteRecursively = (commentList: Comment[]): Comment[] => {
        return commentList.map(c => {
          if (c.id === commentId) {
            return { ...c, votes: response.votes, userVote: response.userVote };
          }
          if (c.replies && c.replies.length > 0) {
            return { ...c, replies: updateVoteRecursively(c.replies) };
          }
          return c;
        });
      };

      setComments(prevComments => updateVoteRecursively(prevComments));
    } catch (error) {
      toast({
        title: 'Erro ao votar',
        description: 'Não foi possível registrar o voto. Tente novamente.',
        variant: 'destructive',
      });
    }
  };

  const handleReportComment = (commentId: string) => {
    const comment = comments.find(c => c.id === commentId);
    if (!comment) return;

    setReportTarget({
      type: 'comment',
      id: commentId,
      preview: comment.content.substring(0, 100),
    });
    setIsReportDialogOpen(true);
  };

  const handleReportPost = () => {
    if (!post) return;

    setReportTarget({
      type: 'post',
      id: post.id,
      title: post.title,
    });
    setIsReportDialogOpen(true);
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
      const commentWithReplies = { ...createdComment, replies: [] };
      setComments(prev => [commentWithReplies, ...prev]);
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

  const handleReplyToComment = (commentId: string, authorUsername: string) => {
    setReplyingTo({ id: commentId, username: authorUsername });
    setReplyContent(`@${authorUsername} `);
  };

  const handleSubmitReply = async () => {
    if (!replyContent.trim() || !replyingTo) return;
    if (!isAuthenticated || !user || !post) {
      toast({ title: 'Faça login para responder', variant: 'destructive' });
      return;
    }

    setIsSubmitting(true);

    try {
      const createdReply = await commentService.createComment(post.id, {
        content: replyContent,
        parentId: replyingTo.id,
      });

      // Tentar atualizar localmente primeiro para performance e feedback visual instantâneo
      const updateRepliesLocally = (commentList: Comment[]): Comment[] => {
        return commentList.map(c => {
          // Se for o comentário ao qual estamos respondendo
          if (c.id === replyingTo.id) {
            return {
              ...c,
              replies: [...(c.replies || []), createdReply]
            };
          }
          // Caso contrário, procurar nas respostas deste comentário (recursivo)
          if (c.replies && c.replies.length > 0) {
            return {
              ...c,
              replies: updateRepliesLocally(c.replies)
            };
          }
          return c;
        });
      };

      setComments(prevComments => updateRepliesLocally(prevComments));

      setReplyContent('');
      setReplyingTo(null);

      toast({ title: 'Resposta adicionada!' });
    } catch (error) {
      const errorMessage =
        error instanceof Error && 'response' in error
          ? (error as { response?: { data?: { error?: { message?: string } } } }).response?.data?.error?.message
          : 'Não foi possível adicionar a resposta.';

      toast({
        title: 'Erro ao adicionar resposta',
        description: errorMessage || 'Não foi possível adicionar a resposta.',
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

  const handleDeleteComment = (commentId: string) => {
    setCommentToDeleteId(commentId);
    setIsCommentDeleteDialogOpen(true);
  };

  const confirmDeleteComment = async () => {
    if (!commentToDeleteId) return;

    setIsCommentDeleting(true);

    try {
      await commentService.deleteComment(commentToDeleteId);

      // Remover comentário localmente (incluindo respostas)
      const removeCommentFromList = (commentList: Comment[]): Comment[] => {
        return commentList
          .filter(c => c.id !== commentToDeleteId)
          .map(c => ({
            ...c,
            replies: c.replies ? removeCommentFromList(c.replies) : []
          }));
      };

      setComments(removeCommentFromList(comments));

      toast({
        title: 'Comentário removido!',
        description: 'O comentário foi removido com sucesso.'
      });
    } catch (error) {
      toast({
        title: 'Erro ao remover comentário',
        description: 'Não foi possível remover o comentário. Tente novamente.',
        variant: 'destructive',
      });
    } finally {
      setIsCommentDeleting(false);
      setIsCommentDeleteDialogOpen(false);
      setCommentToDeleteId(null);
    }
  };

  const handleEditComment = (commentId: string) => {
    // Encontrar o comentário (pode estar aninhado)
    const findComment = (commentList: Comment[]): Comment | undefined => {
      for (const c of commentList) {
        if (c.id === commentId) return c;
        if (c.replies) {
          const found = findComment(c.replies);
          if (found) return found;
        }
      }
      return undefined;
    };

    const comment = findComment(comments);
    if (!comment) return;

    setEditingComment(comment);
    setEditCommentContent(comment.content);
    setIsEditCommentDialogOpen(true);
  };

  const confirmEditComment = async () => {
    if (!editingComment || !editCommentContent.trim()) return;

    setIsEditingComment(true);

    try {
      const updatedComment = await commentService.updateComment(editingComment.id, {
        content: editCommentContent,
      });

      // Atualizar comentário localmente
      const updateCommentInList = (commentList: Comment[]): Comment[] => {
        return commentList.map(c => {
          if (c.id === editingComment.id) {
            return { ...c, content: updatedComment.content, updatedAt: updatedComment.updatedAt };
          }
          if (c.replies) {
            return { ...c, replies: updateCommentInList(c.replies) };
          }
          return c;
        });
      };

      setComments(updateCommentInList(comments));

      toast({
        title: 'Comentário atualizado!',
        description: 'Suas alterações foram salvas.'
      });
      setIsEditCommentDialogOpen(false);
    } catch (error) {
      toast({
        title: 'Erro ao atualizar comentário',
        description: 'Não foi possível salvar as alterações. Tente novamente.',
        variant: 'destructive',
      });
    } finally {
      setIsEditingComment(false);
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

            {/* Actions */}
            <div className="flex gap-2 mt-4 flex-wrap">
              {isAuthor && (
                <>
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
                </>
              )}
              {!isAuthor && isAuthenticated && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="gap-2"
                  onClick={handleReportPost}
                >
                  <Flag className="h-4 w-4" />
                  Denunciar
                </Button>
              )}
            </div>
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

        {/* Reply form (when replying to a comment) */}
        {replyingTo && isAuthenticated && (
          <Card className="p-4 border-primary/50">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-medium">Respondendo a @{replyingTo.username}</h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setReplyingTo(null);
                  setReplyContent('');
                }}
              >
                Cancelar
              </Button>
            </div>
            <MarkdownEditor
              value={replyContent}
              onChange={setReplyContent}
              placeholder="Escreva sua resposta em Markdown..."
              minHeight="min-h-32"
            />
            <div className="flex justify-end mt-3">
              <Button
                variant="gradient"
                onClick={handleSubmitReply}
                disabled={isSubmitting || !replyContent.trim()}
              >
                {isSubmitting ? 'Enviando...' : 'Enviar Resposta'}
              </Button>
            </div>
          </Card>
        )}

        {/* Comment form */}
        {!replyingTo && isAuthenticated ? (
          <Card className="p-4">
            <h3 className="font-medium mb-3">Sua Resposta</h3>
            <MarkdownEditor
              value={newComment}
              onChange={setNewComment}
              placeholder="Escreva sua resposta em Markdown..."
              minHeight="min-h-32"
            />
            <div className="flex justify-end mt-3">
              <Button
                variant="gradient"
                onClick={handleSubmitComment}
                disabled={isSubmitting || !newComment.trim()}
              >
                {isSubmitting ? 'Enviando...' : 'Enviar Resposta'}
              </Button>
            </div>
          </Card>
        ) : !isAuthenticated ? (
          <Card className="p-6 text-center">
            <p className="text-muted-foreground mb-4">Faça login para responder esta pergunta</p>
            <Button variant="gradient" asChild>
              <Link to="/login">Entrar</Link>
            </Button>
          </Card>
        ) : null}

        {/* Comments list */}
        <div className="space-y-4">
          {sortedComments.map((comment) => (
            <CommentItem
              key={comment.id}
              comment={comment}
              isPostAuthor={isAuthor}
              currentUserId={user?.id}
              canAccept={!hasAcceptedAnswer}
              isAuthenticated={isAuthenticated}
              depth={0}
              onVote={handleCommentVote}
              onAccept={handleAcceptAnswer}
              onEdit={handleEditComment}
              onDelete={handleDeleteComment}
              onReport={isAuthenticated && user?.id !== comment.author.id ? handleReportComment : undefined}
              onReply={handleReplyToComment}
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

      {/* Comment Delete Confirmation Dialog */}
      <Dialog open={isCommentDeleteDialogOpen} onOpenChange={setIsCommentDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-destructive" />
              Confirmar Exclusão
            </DialogTitle>
            <DialogDescription>
              Tem certeza que deseja remover este comentário? Esta ação não pode ser desfeita.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsCommentDeleteDialogOpen(false)}
              disabled={isCommentDeleting}
            >
              Cancelar
            </Button>
            <Button
              variant="destructive"
              onClick={confirmDeleteComment}
              disabled={isCommentDeleting}
            >
              {isCommentDeleting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Remover Comentário
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Comment Dialog */}
      <Dialog open={isEditCommentDialogOpen} onOpenChange={setIsEditCommentDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Editar Comentário</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <MarkdownEditor
              value={editCommentContent}
              onChange={setEditCommentContent}
              placeholder="Edite seu comentário..."
              minHeight="min-h-32"
            />
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsEditCommentDialogOpen(false)}
              disabled={isEditingComment}
            >
              Cancelar
            </Button>
            <Button
              variant="gradient"
              onClick={confirmEditComment}
              disabled={isEditingComment || !editCommentContent.trim()}
            >
              {isEditingComment && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Salvar Alterações
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Report Dialog */}
      {reportTarget && (
        <ReportDialog
          isOpen={isReportDialogOpen}
          onClose={() => {
            setIsReportDialogOpen(false);
            setReportTarget(null);
          }}
          contentType={reportTarget.type}
          contentId={reportTarget.id}
          contentTitle={reportTarget.title}
          contentPreview={reportTarget.preview}
        />
      )}
    </div>
  );
}
