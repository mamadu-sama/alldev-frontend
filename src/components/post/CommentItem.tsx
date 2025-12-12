import { Link } from 'react-router-dom';
import { ChevronUp, ChevronDown, Check, Pencil, Trash2 } from 'lucide-react';
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
  isCommentAuthor?: boolean;
  canAccept?: boolean;
  onVote?: (commentId: string, voteType: 'up' | 'down') => void;
  onAccept?: (commentId: string) => void;
  onEdit?: (commentId: string) => void;
  onDelete?: (commentId: string) => void;
}

export function CommentItem({
  comment,
  isPostAuthor,
  isCommentAuthor,
  canAccept,
  onVote,
  onAccept,
  onEdit,
  onDelete,
}: CommentItemProps) {
  const getInitials = (username: string) => {
    return username.slice(0, 2).toUpperCase();
  };

  const timeAgo = formatDistanceToNow(new Date(comment.createdAt), {
    addSuffix: true,
    locale: ptBR,
  });

  return (
    <div
      className={cn(
        'rounded-xl border border-border p-5 animate-fade-in',
        comment.isAccepted && 'accepted-answer border-success/50'
      )}
    >
      <div className="flex gap-4">
        {/* Vote buttons */}
        <div className="flex flex-col items-center gap-1">
          <Button
            variant={comment.userVote === 'up' ? 'voteActive' : 'vote'}
            size="iconSm"
            onClick={() => onVote?.(comment.id, 'up')}
            className="rounded-full"
          >
            <ChevronUp className="h-5 w-5" />
          </Button>
          <span className={`font-bold text-lg ${comment.votes > 0 ? 'text-success' : comment.votes < 0 ? 'text-destructive' : 'text-muted-foreground'}`}>
            {comment.votes}
          </span>
          <Button
            variant={comment.userVote === 'down' ? 'voteActive' : 'vote'}
            size="iconSm"
            onClick={() => onVote?.(comment.id, 'down')}
            className="rounded-full"
          >
            <ChevronDown className="h-5 w-5" />
          </Button>
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          {/* Accepted badge */}
          {comment.isAccepted && (
            <div className="flex items-center gap-2 mb-3">
              <Badge variant="success" className="flex items-center gap-1">
                <Check className="h-3 w-3" />
                Resposta Aceita
              </Badge>
            </div>
          )}

          {/* Author info */}
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Link to={`/users/${comment.author.username}`} className="flex items-center gap-2 hover:opacity-80">
                <Avatar size="sm">
                  <AvatarImage src={comment.author.avatarUrl} alt={comment.author.username} />
                  <AvatarFallback>{getInitials(comment.author.username)}</AvatarFallback>
                </Avatar>
                <span className="font-medium text-foreground hover:text-primary transition-colors">
                  {comment.author.username}
                </span>
              </Link>
              <Badge variant="level" className="text-[10px] px-1.5 py-0">
                {comment.author.level}
              </Badge>
              <span className="text-xs text-muted-foreground">
                {comment.author.reputation.toLocaleString()} rep
              </span>
              <span className="text-xs text-muted-foreground">•</span>
              <span className="text-xs text-muted-foreground">{timeAgo}</span>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2">
              {isPostAuthor && canAccept && !comment.isAccepted && (
                <Button
                  variant="success"
                  size="sm"
                  onClick={() => onAccept?.(comment.id)}
                  className="gap-1"
                >
                  <Check className="h-4 w-4" />
                  Aceitar
                </Button>
              )}
              {isCommentAuthor && (
                <>
                  <Button
                    variant="ghost"
                    size="iconSm"
                    onClick={() => onEdit?.(comment.id)}
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="iconSm"
                    onClick={() => onDelete?.(comment.id)}
                    className="text-destructive hover:text-destructive"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </>
              )}
            </div>
          </div>

          {/* Comment content */}
          <div className="markdown-content">
            <MarkdownContent content={comment.content} />
          </div>
        </div>
      </div>
    </div>
  );
}
