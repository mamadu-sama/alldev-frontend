import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  ArrowLeft,
  ArrowUp,
  MessageSquare,
  Clock,
  Loader2,
  Send,
  CheckCircle2,
  Circle,
  Code,
  GitBranch,
} from "lucide-react";
import { toast } from "sonner";
import { featureRequestService } from "@/services/feature-request.service";
import { FeatureRequest } from "@/types";
import { useAuthStore } from "@/stores/authStore";
import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";

const statusConfig: Record<
  string,
  { label: string; color: string; icon: any }
> = {
  PENDING: {
    label: "Pendente",
    color: "bg-gray-500/10 text-gray-500",
    icon: Circle,
  },
  REVIEWING: {
    label: "Em Análise",
    color: "bg-yellow-500/10 text-yellow-500",
    icon: Clock,
  },
  PLANNED: {
    label: "Planeado",
    color: "bg-blue-500/10 text-blue-500",
    icon: GitBranch,
  },
  IN_PROGRESS: {
    label: "Em Desenvolvimento",
    color: "bg-purple-500/10 text-purple-500",
    icon: Code,
  },
  COMPLETED: {
    label: "Concluído",
    color: "bg-green-500/10 text-green-500",
    icon: CheckCircle2,
  },
  DECLINED: {
    label: "Recusado",
    color: "bg-red-500/10 text-red-500",
    icon: Circle,
  },
};

const categories = [
  { value: "INTERFACE", label: "Interface" },
  { value: "FUNCIONALIDADES", label: "Funcionalidades" },
  { value: "INTEGRACOES", label: "Integrações" },
  { value: "COMUNIDADE", label: "Comunidade" },
  { value: "NOTIFICACOES", label: "Notificações" },
  { value: "MOBILE", label: "Mobile" },
  { value: "GAMIFICACAO", label: "Gamificação" },
  { value: "ACESSIBILIDADE", label: "Acessibilidade" },
  { value: "PERFORMANCE", label: "Performance" },
  { value: "SEGURANCA", label: "Segurança" },
];

const FeatureRequestDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuthStore();

  const [featureRequest, setFeatureRequest] = useState<FeatureRequest | null>(
    null
  );
  const [loading, setLoading] = useState(true);
  const [commenting, setCommenting] = useState(false);
  const [commentContent, setCommentContent] = useState("");

  useEffect(() => {
    if (id) {
      loadFeatureRequest();
    }
  }, [id]);

  const loadFeatureRequest = async () => {
    try {
      setLoading(true);
      const data = await featureRequestService.getById(id!);
      setFeatureRequest(data);
    } catch (error: any) {
      console.error("Error loading feature request:", error);
      toast.error(
        error.response?.data?.error?.message ||
          "Erro ao carregar sugestão de funcionalidade"
      );
      navigate("/feature-contribution");
    } finally {
      setLoading(false);
    }
  };

  const handleVote = async () => {
    if (!user) {
      toast.error("Faça login para votar");
      return;
    }

    if (!featureRequest) return;

    try {
      const result = await featureRequestService.toggleVote(featureRequest.id);

      setFeatureRequest({
        ...featureRequest,
        voteCount: result.voteCount,
        hasVoted: result.hasVoted,
      });
    } catch (error: any) {
      console.error("Error voting:", error);
      toast.error(error.response?.data?.error?.message || "Erro ao votar");
    }
  };

  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) {
      toast.error("Faça login para comentar");
      return;
    }

    if (!commentContent.trim()) {
      toast.error("Por favor, escreva um comentário.");
      return;
    }

    if (commentContent.length < 10) {
      toast.error("O comentário deve ter no mínimo 10 caracteres.");
      return;
    }

    try {
      setCommenting(true);
      const newComment = await featureRequestService.addComment(id!, {
        content: commentContent,
      });

      // Update local state
      setFeatureRequest({
        ...featureRequest!,
        comments: [...(featureRequest!.comments || []), newComment],
        commentCount: (featureRequest!.commentCount || 0) + 1,
      });

      setCommentContent("");
      toast.success("Comentário adicionado com sucesso!");
    } catch (error: any) {
      console.error("Error adding comment:", error);
      toast.error(
        error.response?.data?.error?.message || "Erro ao adicionar comentário"
      );
    } finally {
      setCommenting(false);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="text-center py-12">
          <Loader2 className="h-12 w-12 animate-spin mx-auto text-muted-foreground mb-4" />
          <p className="text-muted-foreground">Carregando...</p>
        </div>
      </div>
    );
  }

  if (!featureRequest) {
    return null;
  }

  const status = statusConfig[featureRequest.status];
  const StatusIcon = status.icon;

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      {/* Back Button */}
      <Button
        variant="ghost"
        onClick={() => navigate("/feature-contribution")}
        className="mb-6"
      >
        <ArrowLeft className="h-4 w-4 mr-2" />
        Voltar para Sugestões
      </Button>

      {/* Main Content */}
      <Card className="mb-6">
        <CardContent className="p-6">
          <div className="flex gap-4">
            {/* Vote Section */}
            <div className="flex flex-col items-center gap-1">
              <Button
                variant={featureRequest.hasVoted ? "default" : "outline"}
                size="sm"
                className="h-14 w-14 rounded-full"
                onClick={handleVote}
                disabled={!user}
                title={!user ? "Faça login para votar" : ""}
              >
                <ArrowUp className="h-6 w-6" />
              </Button>
              <span className="font-bold text-xl">
                {featureRequest.voteCount}
              </span>
              <span className="text-xs text-muted-foreground">votos</span>
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
              <div className="flex flex-wrap items-center gap-2 mb-3">
                <Badge variant="outline">
                  {categories.find((c) => c.value === featureRequest.category)
                    ?.label || featureRequest.category}
                </Badge>
                <Badge className={status.color}>
                  <StatusIcon className="h-3 w-3 mr-1" />
                  {status.label}
                </Badge>
              </div>

              <h1 className="text-3xl font-bold text-foreground mb-4">
                {featureRequest.title}
              </h1>

              <p className="text-muted-foreground mb-6 whitespace-pre-wrap">
                {featureRequest.description}
              </p>

              <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <img
                    src={
                      featureRequest.author.avatarUrl ||
                      `https://api.dicebear.com/7.x/avataaars/svg?seed=${featureRequest.author.username}`
                    }
                    alt={featureRequest.author.username}
                    className="h-6 w-6 rounded-full"
                  />
                  <span>{featureRequest.author.username}</span>
                </div>
                <div className="flex items-center gap-1">
                  <MessageSquare className="h-4 w-4" />
                  <span>{featureRequest.commentCount} comentários</span>
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  <span>
                    {formatDistanceToNow(new Date(featureRequest.createdAt), {
                      addSuffix: true,
                      locale: ptBR,
                    })}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Comments Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5" />
            Comentários ({featureRequest.commentCount || 0})
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Comment Form */}
          {user ? (
            <form onSubmit={handleSubmitComment} className="space-y-3">
              <Textarea
                placeholder="Adicione um comentário construtivo..."
                value={commentContent}
                onChange={(e) => setCommentContent(e.target.value)}
                rows={3}
                className="bg-background resize-none"
              />
              <div className="flex justify-end">
                <Button type="submit" disabled={commenting || !commentContent.trim()}>
                  {commenting ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Enviando...
                    </>
                  ) : (
                    <>
                      <Send className="h-4 w-4 mr-2" />
                      Comentar
                    </>
                  )}
                </Button>
              </div>
            </form>
          ) : (
            <Card className="bg-muted/50 border-dashed">
              <CardContent className="p-4 text-center">
                <p className="text-muted-foreground">
                  Faça login para adicionar um comentário
                </p>
              </CardContent>
            </Card>
          )}

          {/* Comments List */}
          <div className="space-y-4">
            {featureRequest.comments && featureRequest.comments.length > 0 ? (
              featureRequest.comments.map((comment) => (
                <Card key={comment.id}>
                  <CardContent className="p-4">
                    <div className="flex gap-3">
                      <img
                        src={
                          comment.author.avatarUrl ||
                          `https://api.dicebear.com/7.x/avataaars/svg?seed=${comment.author.username}`
                        }
                        alt={comment.author.username}
                        className="h-10 w-10 rounded-full"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="font-semibold">
                            {comment.author.username}
                          </span>
                          <span className="text-xs text-muted-foreground">
                            {formatDistanceToNow(new Date(comment.createdAt), {
                              addSuffix: true,
                              locale: ptBR,
                            })}
                          </span>
                        </div>
                        <p className="text-muted-foreground whitespace-pre-wrap">
                          {comment.content}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <Card className="bg-muted/50 border-dashed">
                <CardContent className="p-8 text-center">
                  <MessageSquare className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
                  <h3 className="text-lg font-semibold mb-2">
                    Nenhum comentário ainda
                  </h3>
                  <p className="text-muted-foreground">
                    Seja o primeiro a comentar esta sugestão!
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default FeatureRequestDetails;

