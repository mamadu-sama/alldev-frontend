import { useParams, Link } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { ArrowLeft, Hash, Loader2, Bell, BellOff, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { PostCard } from "@/components/post/PostCard";
import { tagService } from "@/services/tag.service";
import { toast } from "sonner";
import { useAuthStore } from "@/stores/authStore";
import { useState } from "react";

export default function TagDetails() {
  const { slug } = useParams<{ slug: string }>();
  const { isAuthenticated } = useAuthStore();
  const queryClient = useQueryClient();
  const [isFollowing, setIsFollowing] = useState<boolean | null>(null);

  // Fetch tag and posts
  const { data, isLoading, error } = useQuery({
    queryKey: ["tag", slug, "posts"],
    queryFn: () => tagService.getPostsByTag(slug!, 1, 50),
    enabled: !!slug,
    retry: 1,
  });

  // Check if user is following this tag
  const { data: followedTags } = useQuery({
    queryKey: ["followedTags"],
    queryFn: () => tagService.getFollowedTags(),
    enabled: isAuthenticated,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  // Check if tag is followed
  const tagIsFollowed =
    followedTags?.some((t) => t.id === data?.tag?.id) || false;

  // Follow mutation
  const followMutation = useMutation({
    mutationFn: (tagId: string) => tagService.followTag(tagId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["followedTags"] });
      setIsFollowing(true);
      toast.success("Tag seguida com sucesso! 🎉");
    },
    onError: (error: any) => {
      toast.error(
        error?.response?.data?.error?.message || "Erro ao seguir tag"
      );
    },
  });

  // Unfollow mutation
  const unfollowMutation = useMutation({
    mutationFn: (tagId: string) => tagService.unfollowTag(tagId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["followedTags"] });
      setIsFollowing(false);
      toast.success("Deixou de seguir a tag");
    },
    onError: (error: any) => {
      toast.error(
        error?.response?.data?.error?.message || "Erro ao deixar de seguir tag"
      );
    },
  });

  const handleToggleFollow = () => {
    if (!data?.tag?.id) return;

    if (tagIsFollowed) {
      unfollowMutation.mutate(data.tag.id);
    } else {
      followMutation.mutate(data.tag.id);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold mb-4">Tag não encontrada</h2>
        <p className="text-muted-foreground mb-6">
          A tag que você procura não existe ou foi removida.
        </p>
        <Button asChild>
          <Link to="/tags">Ver todas as tags</Link>
        </Button>
      </div>
    );
  }

  const { tag, posts } = data;

  return (
    <div className="space-y-6">
      {/* Back button */}
      <Button variant="ghost" asChild className="gap-2">
        <Link to="/tags">
          <ArrowLeft className="h-4 w-4" />
          Voltar para Tags
        </Link>
      </Button>

      {/* Tag header */}
      <div className="flex items-start gap-4 p-6 rounded-xl bg-card border border-border">
        <div className="flex h-16 w-16 items-center justify-center rounded-xl bg-primary/10">
          <Hash className="h-8 w-8 text-primary" />
        </div>
        <div className="flex-1">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold">{tag.name}</h1>
              <Badge variant="outline">
                {tag.postCount.toLocaleString()} posts
              </Badge>
              {tagIsFollowed && (
                <Badge variant="secondary" className="gap-1">
                  <Check className="h-3 w-3" />
                  Seguindo
                </Badge>
              )}
            </div>
            {isAuthenticated && (
              <Button
                onClick={handleToggleFollow}
                disabled={
                  followMutation.isPending || unfollowMutation.isPending
                }
                variant={tagIsFollowed ? "outline" : "default"}
                className="gap-2"
              >
                {followMutation.isPending || unfollowMutation.isPending ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : tagIsFollowed ? (
                  <>
                    <BellOff className="h-4 w-4" />
                    Deixar de Seguir
                  </>
                ) : (
                  <>
                    <Bell className="h-4 w-4" />
                    Seguir Tag
                  </>
                )}
              </Button>
            )}
          </div>
          <p className="text-muted-foreground">{tag.description}</p>
          {isAuthenticated && tagIsFollowed && (
            <p className="text-sm text-muted-foreground mt-2">
              <Bell className="h-3 w-3 inline mr-1" />
              Você receberá notificações de novos posts nesta tag
            </p>
          )}
        </div>
      </div>

      {/* Posts */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Posts com #{tag.name}</h2>
        {posts.length > 0 ? (
          <div className="space-y-4">
            {posts.map((post) => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12 text-muted-foreground">
            Nenhum post com esta tag ainda.
          </div>
        )}
      </div>
    </div>
  );
}
