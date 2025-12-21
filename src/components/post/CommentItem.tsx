import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ChevronUp, ChevronDown, Check, Pencil, Trash2, Flag, MessageSquare, ThumbsUp, ThumbsDown, ChevronRight } from 'lucide-react';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { MarkdownContent } from '@/components/common/MarkdownContent';
import type { Comment } from '@/types';
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { cn } from '@/lib/utils';

interface CommentItemProps {
  comment: Comment;
  isPostAuthor?: boolean;
  currentUserId?: string;
  canAccept?: boolean;
  isAuthenticated?: boolean;
  depth?: number;
  onVote?: (commentId: string, voteType: 'up' | 'down') => void;
  onAccept?: (commentId: string) => void;
  onEdit?: (commentId: string) => void;
  onDelete?: (commentId: string) => void;
  onReport?: (commentId: string) => void;
  onReply?: (commentId: string, authorUsername: string) => void;
}

export function CommentItem({
  comment,
  isPostAuthor,
  currentUserId,
  canAccept,
  isAuthenticated,
  depth = 0,
  onVote,
  onAccept,
  onEdit,
  onDelete,
  onReport,
  onReply,
}: CommentItemProps) {
  const [showReplies, setShowReplies] = useState(true);

  const getInitials = (username: string) => {
    return username.slice(0, 2).toUpperCase();
  };

  const isCommentAuthor = currentUserId === comment.author.id;

  const timeAgo = formatDistanceToNow(new Date(comment.createdAt), {
    addSuffix: true,
    locale: ptBR,
  });

  const maxDepth = 3; // Maximum nesting level
  const showReplyButton = depth < maxDepth && isAuthenticated && !isCommentAuthor;

  return (
    <div
      className={cn(
        'relative animate-fade-in group',
        comment.isAccepted && 'accepted-answer border-success/50',
        depth > 0 ? 'ml-6 mt-4 pl-6' : 'rounded-xl border border-border p-5'
      )}
    >
      {/* Thread line for replies */}
      {depth > 0 && (
        <div className="absolute left-0 top-0 bottom-0 w-[2px] bg-border group-hover:bg-primary/50 transition-colors" />
      )}

      <div className="flex gap-4">
        {/* Author Avatar */}
        <div className="shrink-0">
          <Link to={`/users/${comment.author.username}`} className="block hover:opacity-80 transition-opacity">
            <Avatar size="default">
              <AvatarImage src={comment.author.avatarUrl} alt={comment.author.username} />
              <AvatarFallback className="bg-primary/10 text-primary font-bold">
                {getInitials(comment.author.username)}
              </AvatarFallback>
            </Avatar>
          </Link>
        </div>

        {/* Content Area */}
        <div className="flex-1 min-w-0">
          {/* Accepted badge */}
          {comment.isAccepted && (
            <div className="flex items-center gap-2 mb-2">
              <Badge variant="success" className="flex items-center gap-1 h-5 text-[10px] uppercase tracking-wider font-bold">
                <Check className="h-3 w-3" />
                Resposta Aceita
              </Badge>
            </div>
          )}

          {/* Author info & Time */}
          <div className="flex items-center justify-between mb-1">
            <div className="flex items-center gap-2 flex-wrap">
              <Link to={`/users/${comment.author.username}`} className="font-bold text-foreground hover:text-primary transition-colors">
                @{comment.author.username}
              </Link>
              <Badge variant="outline" className="text-[10px] px-1.5 py-0 border-primary/20 bg-primary/5 text-primary">
                Lvl {comment.author.level}
              </Badge>
              <span className="text-[11px] text-muted-foreground font-medium">
                {comment.author.reputation.toLocaleString()} rep
              </span>
              <span className="text-muted-foreground/50">•</span>
              <span className="text-xs text-muted-foreground">{timeAgo}</span>
            </div>

            {/* Top Right Actions (Accept/Edit/Delete/Report) */}
            <div className="flex items-center gap-1">
              {isPostAuthor && canAccept && !comment.isAccepted && (
                <Button
                  variant="success"
                  size="sm"
                  onClick={() => onAccept?.(comment.id)}
                  className="h-7 px-2 text-xs gap-1"
                >
                  <Check className="h-3 w-3" />
                  Aceitar
                </Button>
              )}
              {isCommentAuthor && (
                <div className="flex items-center">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-muted-foreground hover:text-foreground"
                    onClick={() => onEdit?.(comment.id)}
                    title="Editar"
                  >
                    <Pencil className="h-3.5 w-3.5" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-muted-foreground hover:text-destructive"
                    onClick={() => onDelete?.(comment.id)}
                    title="Excluir"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                </div>
              )}
              {!isCommentAuthor && onReport && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-muted-foreground hover:text-foreground"
                  onClick={() => onReport?.(comment.id)}
                  title="Denunciar"
                >
                  <Flag className="h-3.5 w-3.5" />
                </Button>
              )}
            </div>
          </div>

          {/* Comment content */}
          <div className="markdown-content">
            <MarkdownContent content={comment.content} />
          </div>

          {/* Comment actions */}
          <div className="flex items-center gap-1 mt-2">
            {/* Votes */}
            <div className="flex items-center bg-muted/30 rounded-full border border-border/50 p-0.5 mr-2">
              <Button
                variant="ghost"
                size="iconSm"
                onClick={() => onVote?.(comment.id, 'up')}
                className={cn(
                  "rounded-full h-8 w-8 transition-all",
                  comment.userVote === 'up' ? "text-primary bg-primary/10" : "text-muted-foreground hover:text-primary"
                )}
                title="Gostei"
              >
                <ThumbsUp className={cn("h-4 w-4", comment.userVote === 'up' && "fill-current")} />
              </Button>

              <span className={cn(
                "px-1 min-w-[1.5rem] text-center text-xs font-bold",
                comment.votes > 0 ? "text-success" : comment.votes < 0 ? "text-destructive" : "text-muted-foreground"
              )}>
                {comment.votes}
              </span>

              <Button
                variant="ghost"
                size="iconSm"
                onClick={() => onVote?.(comment.id, 'down')}
                className={cn(
                  "rounded-full h-8 w-8 transition-all",
                  comment.userVote === 'down' ? "text-destructive bg-destructive/10" : "text-muted-foreground hover:text-destructive"
                )}
                title="Não gostei"
              >
                <ThumbsDown className={cn("h-4 w-4", comment.userVote === 'down' && "fill-current")} />
              </Button>
            </div>

            {/* Responder */}
            {showReplyButton && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onReply?.(comment.id, comment.author.username)}
                className="h-8 rounded-full text-xs font-semibold text-muted-foreground hover:text-primary hover:bg-primary/5 gap-1.5"
              >
                <MessageSquare className="h-3.5 w-3.5" />
                Responder
              </Button>
            )}
          </div>

          {/* Toggle replies button */}
          {comment.replies && comment.replies.length > 0 && (
            <div className="mt-3">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowReplies(!showReplies)}
                className="text-primary hover:text-primary hover:bg-primary/10 gap-2 px-2 -ml-2"
              >
                <div className={cn("transition-transform duration-200", showReplies && "rotate-90")}>
                  <ChevronRight className="h-4 w-4" />
                </div>
                <span className="font-semibold text-sm">
                  {showReplies ? 'Ocultar' : `Ver ${comment.replies.length} ${comment.replies.length === 1 ? 'resposta' : 'respostas'}`}
                </span>
              </Button>
            </div>
          )}

          {/* Nested replies */}
          {showReplies && comment.replies && comment.replies.length > 0 && (
            <div className="mt-2 space-y-4">
              {comment.replies.map((reply) => (
                <CommentItem
                  key={reply.id}
                  comment={reply}
                  isPostAuthor={isPostAuthor}
                  currentUserId={currentUserId}
                  canAccept={false}
                  isAuthenticated={isAuthenticated}
                  depth={depth + 1}
                  onVote={onVote}
                  onEdit={onEdit}
                  onDelete={onDelete}
                  onReport={onReport}
                  onReply={onReply}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
