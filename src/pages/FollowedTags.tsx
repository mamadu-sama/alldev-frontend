import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import {
  Hash,
  Loader2,
  Bell,
  BellOff,
  TrendingUp,
  Calendar,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { tagService } from "@/services/tag.service";
import { toast } from "sonner";
import { useState } from "react";

export default function FollowedTags() {
  const queryClient = useQueryClient();
  const [updatingNotification, setUpdatingNotification] = useState<
    string | null
  >(null);

  // Fetch followed tags
  const { data: followedTags, isLoading } = useQuery({
    queryKey: ["followedTags"],
    queryFn: () => tagService.getFollowedTags(),
  });

  // Unfollow mutation
  const unfollowMutation = useMutation({
    mutationFn: (tagId: string) => tagService.unfollowTag(tagId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["followedTags"] });
      toast.success("Deixou de seguir a tag");
    },
    onError: (error: any) => {
      toast.error(
        error?.response?.data?.error?.message || "Erro ao deixar de seguir tag"
      );
    },
  });

  // Update notification preference mutation
  const updateNotificationMutation = useMutation({
    mutationFn: ({
      tagId,
      notifyOnNewPost,
    }: {
      tagId: string;
      notifyOnNewPost: boolean;
    }) => tagService.updateNotificationPreference(tagId, notifyOnNewPost),
    onMutate: async ({ tagId }) => {
      setUpdatingNotification(tagId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["followedTags"] });
      toast.success("Preferências atualizadas");
    },
    onError: (error: any) => {
      toast.error(
        error?.response?.data?.error?.message ||
          "Erro ao atualizar preferências"
      );
    },
    onSettled: () => {
      setUpdatingNotification(null);
    },
  });

  const handleUnfollow = (tagId: string) => {
    unfollowMutation.mutate(tagId);
  };

  const handleToggleNotifications = (tagId: string, currentValue: boolean) => {
    updateNotificationMutation.mutate({
      tagId,
      notifyOnNewPost: !currentValue,
    });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold mb-2">Minhas Tags Seguidas</h1>
        <p className="text-muted-foreground">
          Gerencie as tags que você segue e personalize suas notificações
        </p>
      </div>

      {/* Info Card */}
      <Card className="border-primary/20 bg-primary/5">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5" />
            Como funciona?
          </CardTitle>
          <CardDescription>
            Posts das tags que você segue aparecem prioritariamente no seu feed
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-2 text-sm text-muted-foreground">
          <div className="flex items-start gap-2">
            <TrendingUp className="h-4 w-4 mt-0.5 flex-shrink-0 text-primary" />
            <span>
              <strong>70% do seu feed</strong> vem de tags seguidas, garantindo
              conteúdo relevante
            </span>
          </div>
          <div className="flex items-start gap-2">
            <Bell className="h-4 w-4 mt-0.5 flex-shrink-0 text-primary" />
            <span>
              Receba <strong>notificações em tempo real</strong> quando novos
              posts são publicados
            </span>
          </div>
          <div className="flex items-start gap-2">
            <Hash className="h-4 w-4 mt-0.5 flex-shrink-0 text-primary" />
            <span>
              Explore novas tags em{" "}
              <Link
                to="/tags"
                className="text-primary hover:underline font-medium"
              >
                Ver todas as tags
              </Link>
            </span>
          </div>
        </CardContent>
      </Card>

      {/* Followed Tags */}
      {!followedTags || followedTags.length === 0 ? (
        <Card>
          <CardContent className="py-12">
            <div className="text-center space-y-4">
              <div className="mx-auto w-12 h-12 bg-muted rounded-full flex items-center justify-center">
                <Hash className="h-6 w-6 text-muted-foreground" />
              </div>
              <div>
                <h3 className="font-semibold mb-2">
                  Ainda não está seguindo nenhuma tag
                </h3>
                <p className="text-muted-foreground text-sm mb-4">
                  Comece a seguir tags para personalizar seu feed e receber
                  notificações
                </p>
                <Button asChild>
                  <Link to="/tags">Explorar Tags</Link>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {followedTags.map((tag) => (
            <Card key={tag.id} className="relative">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <Link
                    to={`/tags/${tag.slug}`}
                    className="flex-1 hover:opacity-80 transition-opacity"
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                        <Hash className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <CardTitle className="text-lg">{tag.name}</CardTitle>
                        <Badge variant="outline" className="text-xs mt-1">
                          {tag.postCount.toLocaleString()} posts
                        </Badge>
                      </div>
                    </div>
                  </Link>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleUnfollow(tag.id)}
                    disabled={unfollowMutation.isPending}
                    className="h-8 w-8 p-0 hover:bg-destructive/10 hover:text-destructive"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
                {tag.description && (
                  <CardDescription className="line-clamp-2">
                    {tag.description}
                  </CardDescription>
                )}
              </CardHeader>
              <CardContent className="pt-3 border-t">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Calendar className="h-3.5 w-3.5" />
                    <span>
                      Seguindo desde{" "}
                      {new Date(tag.followedAt).toLocaleDateString("pt-BR", {
                        day: "numeric",
                        month: "short",
                      })}
                    </span>
                  </div>
                </div>
                <div className="flex items-center justify-between mt-3 pt-3 border-t">
                  <Label
                    htmlFor={`notify-${tag.id}`}
                    className="text-sm cursor-pointer flex items-center gap-2"
                  >
                    {tag.notifyOnNewPost ? (
                      <Bell className="h-4 w-4 text-primary" />
                    ) : (
                      <BellOff className="h-4 w-4 text-muted-foreground" />
                    )}
                    Notificações
                  </Label>
                  <Switch
                    id={`notify-${tag.id}`}
                    checked={tag.notifyOnNewPost}
                    onCheckedChange={() =>
                      handleToggleNotifications(tag.id, tag.notifyOnNewPost)
                    }
                    disabled={updatingNotification === tag.id}
                  />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* CTA to explore more tags */}
      {followedTags && followedTags.length > 0 && (
        <Card className="border-dashed">
          <CardContent className="py-8">
            <div className="text-center space-y-2">
              <Hash className="h-8 w-8 mx-auto text-muted-foreground" />
              <h3 className="font-semibold">Descubra mais tags</h3>
              <p className="text-sm text-muted-foreground">
                Explore outras tags para expandir seus interesses
              </p>
              <Button variant="outline" asChild className="mt-2">
                <Link to="/tags">Ver Todas as Tags</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
