import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Lightbulb,
  ThumbsUp,
  MessageSquare,
  Clock,
  CheckCircle2,
  Circle,
  Rocket,
  Users,
  Code,
  GitBranch,
  ArrowUp,
  Filter,
  Loader2,
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import {
  featureRequestService,
  FeatureRequest,
} from "@/services/feature-request.service";
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

const FeatureContribution = () => {
  const { user } = useAuthStore();
  const [suggestions, setSuggestions] = useState<FeatureRequest[]>([]);
  const [stats, setStats] = useState({
    total: 0,
    inProgress: 0,
    completed: 0,
    totalVotes: 0,
  });
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [sortBy, setSortBy] = useState<"votes" | "recent" | "comments">(
    "votes"
  );
  const [filterCategory, setFilterCategory] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");

  // Form state
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");

  // Load data
  useEffect(() => {
    loadData();
  }, [sortBy, filterCategory, filterStatus]);

  const loadData = async () => {
    try {
      setLoading(true);
      const [requestsData, statsData] = await Promise.all([
        featureRequestService.getAll(
          1,
          100,
          sortBy,
          filterCategory !== "all" ? filterCategory : undefined,
          filterStatus !== "all" ? filterStatus : undefined
        ),
        featureRequestService.getStats(),
      ]);

      setSuggestions(requestsData.data);
      setStats(statsData);
    } catch (error: any) {
      console.error("Error loading feature requests:", error);
      toast.error(
        error.response?.data?.error?.message || "Erro ao carregar sugestões"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleVote = async (id: string) => {
    if (!user) {
      toast.error("Faça login para votar");
      return;
    }

    try {
      const result = await featureRequestService.toggleVote(id);

      // Update local state
      setSuggestions(
        suggestions.map((s) => {
          if (s.id === id) {
            return {
              ...s,
              voteCount: result.voteCount,
              hasVoted: result.hasVoted,
            };
          }
          return s;
        })
      );

      // Update stats
      setStats((prev) => ({
        ...prev,
        totalVotes: prev.totalVotes + (result.hasVoted ? 1 : -1),
      }));
    } catch (error: any) {
      console.error("Error voting:", error);
      toast.error(error.response?.data?.error?.message || "Erro ao votar");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) {
      toast.error("Faça login para submeter sugestões");
      return;
    }

    if (!title || !description || !category) {
      toast.error("Por favor, preencha todos os campos.");
      return;
    }

    try {
      setSubmitting(true);
      const newRequest = await featureRequestService.create({
        title,
        description,
        category,
      });

      setSuggestions([newRequest, ...suggestions]);
      setTitle("");
      setDescription("");
      setCategory("");
      setStats((prev) => ({
        ...prev,
        total: prev.total + 1,
        totalVotes: prev.totalVotes + 1,
      }));

      toast.success(
        "Sugestão submetida com sucesso! Obrigado pela contribuição."
      );
    } catch (error: any) {
      console.error("Error creating feature request:", error);
      toast.error(
        error.response?.data?.error?.message || "Erro ao submeter sugestão"
      );
    } finally {
      setSubmitting(false);
    }
  };

  const filteredSuggestions = suggestions;

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      {/* Header */}
      <div className="text-center mb-10">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-full mb-4">
          <Lightbulb className="h-8 w-8 text-primary" />
        </div>
        <h1 className="text-4xl font-bold text-foreground mb-4">
          Contribuir com Funcionalidades
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Ajude a moldar o futuro da Alldev! Submeta ideias, vote nas sugestões
          da comunidade e acompanhe o progresso das funcionalidades em
          desenvolvimento.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
        <Card>
          <CardContent className="p-4 text-center">
            <Lightbulb className="h-8 w-8 text-yellow-500 mx-auto mb-2" />
            <p className="text-2xl font-bold">
              {loading ? "..." : stats.total}
            </p>
            <p className="text-sm text-muted-foreground">Sugestões</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <Rocket className="h-8 w-8 text-purple-500 mx-auto mb-2" />
            <p className="text-2xl font-bold">
              {loading ? "..." : stats.inProgress}
            </p>
            <p className="text-sm text-muted-foreground">Em Desenvolvimento</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <CheckCircle2 className="h-8 w-8 text-green-500 mx-auto mb-2" />
            <p className="text-2xl font-bold">
              {loading ? "..." : stats.completed}
            </p>
            <p className="text-sm text-muted-foreground">Concluídas</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <Users className="h-8 w-8 text-blue-500 mx-auto mb-2" />
            <p className="text-2xl font-bold">
              {loading ? "..." : stats.totalVotes}
            </p>
            <p className="text-sm text-muted-foreground">Votos Totais</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="browse" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2 max-w-md mx-auto">
          <TabsTrigger value="browse">Explorar Sugestões</TabsTrigger>
          <TabsTrigger value="submit">Submeter Ideia</TabsTrigger>
        </TabsList>

        <TabsContent value="browse" className="space-y-6">
          {/* Filters */}
          <Card>
            <CardContent className="p-4">
              <div className="flex flex-wrap gap-4 items-center">
                <div className="flex items-center gap-2">
                  <Filter className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-medium">Filtros:</span>
                </div>

                <Select
                  value={filterCategory}
                  onValueChange={setFilterCategory}
                >
                  <SelectTrigger className="w-[160px]">
                    <SelectValue placeholder="Categoria" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todas Categorias</SelectItem>
                    {categories.map((cat) => (
                      <SelectItem key={cat.value} value={cat.value}>
                        {cat.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select value={filterStatus} onValueChange={setFilterStatus}>
                  <SelectTrigger className="w-[160px]">
                    <SelectValue placeholder="Estado" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos Estados</SelectItem>
                    {Object.entries(statusConfig).map(([key, config]) => (
                      <SelectItem key={key} value={key}>
                        {config.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-[160px]">
                    <SelectValue placeholder="Ordenar por" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="votes">Mais Votados</SelectItem>
                    <SelectItem value="recent">Mais Recentes</SelectItem>
                    <SelectItem value="comments">Mais Comentados</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Suggestions List */}
          <div className="space-y-4">
            {loading ? (
              <div className="text-center py-12">
                <Loader2 className="h-12 w-12 animate-spin mx-auto text-muted-foreground mb-4" />
                <p className="text-muted-foreground">Carregando sugestões...</p>
              </div>
            ) : (
              filteredSuggestions.map((suggestion) => {
                const status = statusConfig[suggestion.status];
                const StatusIcon = status.icon;

                return (
                  <Card
                    key={suggestion.id}
                    className="hover:border-primary/50 transition-colors"
                  >
                    <CardContent className="p-6">
                      <div className="flex gap-4">
                        {/* Vote Button */}
                        <div className="flex flex-col items-center gap-1">
                          <Button
                            variant={
                              suggestion.hasVoted ? "default" : "outline"
                            }
                            size="sm"
                            className="h-12 w-12 rounded-full"
                            onClick={() => handleVote(suggestion.id)}
                            disabled={!user}
                            title={!user ? "Faça login para votar" : ""}
                          >
                            <ArrowUp className="h-5 w-5" />
                          </Button>
                          <span className="font-bold text-lg">
                            {suggestion.voteCount}
                          </span>
                          <span className="text-xs text-muted-foreground">
                            votos
                          </span>
                        </div>

                        {/* Content */}
                        <div className="flex-1 min-w-0">
                          <div className="flex flex-wrap items-center gap-2 mb-2">
                            <Badge variant="outline">
                              {categories.find(
                                (c) => c.value === suggestion.category
                              )?.label || suggestion.category}
                            </Badge>
                            <Badge className={status.color}>
                              <StatusIcon className="h-3 w-3 mr-1" />
                              {status.label}
                            </Badge>
                          </div>

                          <h3 className="text-xl font-semibold text-foreground mb-2">
                            {suggestion.title}
                          </h3>

                          <p className="text-muted-foreground mb-4">
                            {suggestion.description}
                          </p>

                          <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                            <div className="flex items-center gap-2">
                              <img
                                src={
                                  suggestion.author.avatarUrl ||
                                  `https://api.dicebear.com/7.x/avataaars/svg?seed=${suggestion.author.username}`
                                }
                                alt={suggestion.author.username}
                                className="h-6 w-6 rounded-full"
                              />
                              <span>{suggestion.author.username}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <MessageSquare className="h-4 w-4" />
                              <span>{suggestion.commentCount} comentários</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Clock className="h-4 w-4" />
                              <span>
                                {formatDistanceToNow(
                                  new Date(suggestion.createdAt),
                                  {
                                    addSuffix: true,
                                    locale: ptBR,
                                  }
                                )}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })
            )}

            {filteredSuggestions.length === 0 && (
              <Card className="p-8 text-center">
                <Lightbulb className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">
                  Nenhuma sugestão encontrada
                </h3>
                <p className="text-muted-foreground">
                  Tente ajustar os filtros ou seja o primeiro a submeter uma
                  ideia!
                </p>
              </Card>
            )}
          </div>
        </TabsContent>

        <TabsContent value="submit">
          <Card className="max-w-2xl mx-auto">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lightbulb className="h-5 w-5 text-primary" />
                Submeter Nova Funcionalidade
              </CardTitle>
              <CardDescription>
                Partilhe a sua ideia para melhorar a Alldev. Seja específico e
                explique como esta funcionalidade beneficiaria a comunidade.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="title">Título da Funcionalidade *</Label>
                  <Input
                    id="title"
                    placeholder="Ex: Sistema de notificações em tempo real"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="bg-background"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="category">Categoria *</Label>
                  <Select value={category} onValueChange={setCategory}>
                    <SelectTrigger className="bg-background">
                      <SelectValue placeholder="Selecione uma categoria" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((cat) => (
                        <SelectItem key={cat.value} value={cat.value}>
                          {cat.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Descrição Detalhada *</Label>
                  <Textarea
                    id="description"
                    placeholder="Descreva a funcionalidade, como funcionaria e porque seria útil para a comunidade..."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    rows={6}
                    className="bg-background resize-none"
                  />
                </div>

                <div className="bg-muted/50 p-4 rounded-lg">
                  <h4 className="font-medium mb-2">
                    Dicas para uma boa sugestão:
                  </h4>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• Seja claro e específico sobre o que pretende</li>
                    <li>
                      • Explique o problema que esta funcionalidade resolve
                    </li>
                    <li>• Descreva como beneficiaria outros utilizadores</li>
                    <li>• Verifique se a ideia já não foi sugerida</li>
                  </ul>
                </div>

                <Button
                  type="submit"
                  className="w-full"
                  disabled={submitting || !user}
                >
                  {submitting ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Submetendo...
                    </>
                  ) : (
                    <>
                      <Lightbulb className="h-4 w-4 mr-2" />
                      {user ? "Submeter Sugestão" : "Faça login para submeter"}
                    </>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* How it works */}
      <Card className="mt-10">
        <CardHeader>
          <CardTitle>Como Funciona o Processo?</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="w-12 h-12 bg-yellow-500/10 rounded-full flex items-center justify-center mx-auto mb-3">
                <Lightbulb className="h-6 w-6 text-yellow-500" />
              </div>
              <h4 className="font-semibold mb-2">1. Submeta</h4>
              <p className="text-sm text-muted-foreground">
                Partilhe a sua ideia com uma descrição clara e detalhada.
              </p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-500/10 rounded-full flex items-center justify-center mx-auto mb-3">
                <ThumbsUp className="h-6 w-6 text-blue-500" />
              </div>
              <h4 className="font-semibold mb-2">2. Vote</h4>
              <p className="text-sm text-muted-foreground">
                A comunidade vota nas sugestões mais relevantes.
              </p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-purple-500/10 rounded-full flex items-center justify-center mx-auto mb-3">
                <Clock className="h-6 w-6 text-purple-500" />
              </div>
              <h4 className="font-semibold mb-2">3. Análise</h4>
              <p className="text-sm text-muted-foreground">
                A equipa analisa viabilidade técnica e prioridade.
              </p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-3">
                <Rocket className="h-6 w-6 text-green-500" />
              </div>
              <h4 className="font-semibold mb-2">4. Implementação</h4>
              <p className="text-sm text-muted-foreground">
                Funcionalidades aprovadas entram no roadmap de desenvolvimento.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default FeatureContribution;
