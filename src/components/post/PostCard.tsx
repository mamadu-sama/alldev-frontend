import { Link, useNavigate } from "react-router-dom";
import {
  ChevronUp,
  ChevronDown,
  MessageSquare,
  Eye,
  Check,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { Post } from "@/types";
import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";

interface PostCardProps {
  post: Post;
  onVote?: (postId: string, voteType: "up" | "down") => void;
}

export function PostCard({ post, onVote }: PostCardProps) {
  const navigate = useNavigate();

  const getInitials = (username: string) => {
    return username.slice(0, 2).toUpperCase();
  };

  const getPreviewContent = (content: string) => {
    // Strip markdown and get first 150 chars
    const stripped = content
      .replace(/```[\s\S]*?```/g, "[código]")
      .replace(/`[^`]+`/g, "[código]")
      .replace(/#{1,6}\s/g, "")
      .replace(/\*\*([^*]+)\*\*/g, "$1")
      .replace(/\*([^*]+)\*/g, "$1")
      .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
      .replace(/\n/g, " ")
      .trim();

    return stripped.length > 150 ? stripped.slice(0, 150) + "..." : stripped;
  };

  const timeAgo = formatDistanceToNow(new Date(post.createdAt), {
    addSuffix: true,
    locale: ptBR,
  });

  return (
    <Card variant="hover" className="animate-fade-in">
      <CardContent className="p-5">
        <div className="flex gap-4">
          {/* Vote buttons */}
          <div
            className="flex flex-col items-center gap-1"
            data-tour="post-actions"
          >
            <Button
              variant={post.userVote === "up" ? "voteActive" : "vote"}
              size="iconSm"
              onClick={() => onVote?.(post.id, "up")}
              className="rounded-full"
            >
              <ChevronUp className="h-5 w-5" />
            </Button>
            <span
              className={`font-bold text-lg ${
                post.votes > 0
                  ? "text-success"
                  : post.votes < 0
                  ? "text-destructive"
                  : "text-muted-foreground"
              }`}
            >
              {post.votes}
            </span>
            <Button
              variant={post.userVote === "down" ? "voteActive" : "vote"}
              size="iconSm"
              onClick={() => onVote?.(post.id, "down")}
              className="rounded-full"
            >
              <ChevronDown className="h-5 w-5" />
            </Button>
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            {/* Author info */}
            <div className="flex items-center gap-2 mb-2">
              <Link
                to={`/users/${post.author.username}`}
                className="flex items-center gap-2 hover:opacity-80"
              >
                <Avatar size="xs">
                  <AvatarImage
                    src={post.author.avatarUrl}
                    alt={post.author.username}
                  />
                  <AvatarFallback>
                    {getInitials(post.author.username)}
                  </AvatarFallback>
                </Avatar>
                <span className="text-sm font-medium text-foreground hover:text-primary transition-colors">
                  {post.author.username}
                </span>
              </Link>
              <Badge variant="level" className="text-[10px] px-1.5 py-0">
                {post.author.level}
              </Badge>
              <span className="text-xs text-muted-foreground">
                {post.author.reputation.toLocaleString()} rep
              </span>
            </div>

            {/* Title */}
            <Link to={`/posts/${post.slug}`}>
              <h3 className="text-lg font-semibold text-foreground hover:text-primary transition-colors mb-2 line-clamp-2">
                {post.title}
              </h3>
            </Link>

            {/* Preview */}
            <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
              {getPreviewContent(post.content)}
            </p>

            {/* Tags */}
            <div className="flex flex-wrap gap-2 mb-3">
              {post.tags.slice(0, 5).map((tag) => (
                <Badge
                  key={tag.id}
                  variant="tag"
                  onClick={() => navigate(`/tags/${tag.slug}`)}
                >
                  {tag.name}
                </Badge>
              ))}
            </div>

            {/* Footer stats */}
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <MessageSquare className="h-4 w-4" />
                <span>{post.commentCount}</span>
              </div>
              <div className="flex items-center gap-1">
                <Eye className="h-4 w-4" />
                <span>{post.views.toLocaleString()}</span>
              </div>
              <span>{timeAgo}</span>
              {post.hasAcceptedAnswer && (
                <Badge variant="success" className="flex items-center gap-1">
                  <Check className="h-3 w-3" />
                  Resolvido
                </Badge>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
