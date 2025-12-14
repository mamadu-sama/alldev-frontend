import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Lightbulb,
  Search,
  Filter,
  ArrowUp,
  MessageSquare,
  Clock,
  Loader2,
  Eye,
  CheckCircle2,
  Circle,
  Code,
  GitBranch,
  XCircle,
} from "lucide-react";
import { toast } from "sonner";
import { featureRequestService } from "@/services/feature-request.service";
import { FeatureRequest } from "@/types";
import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";
import { useNavigate } from "react-router-dom";

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
    icon: XCircle,
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

const AdminFeatures = () => {
  const navigate = useNavigate();
  const [features, setFeatures] = useState<FeatureRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [sortBy, setSortBy] = useState<"votes" | "recent" | "comments">(
    "votes"
  );

  // Dialog states
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [statusDialogOpen, setStatusDialogOpen] = useState(false);
  const [selectedFeature, setSelectedFeature] = useState<FeatureRequest | null>(
    null
  );
  const [newStatus, setNewStatus] = useState("");
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    loadFeatures();
  }, [filterCategory, filterStatus, sortBy]);

  const loadFeatures = async () => {
    try {
      setLoading(true);
      const { data } = await featureRequestService.getAll(
        1,
        100,
        sortBy,
        filterCategory !== "all" ? filterCategory : undefined,
        filterStatus !== "all" ? filterStatus : undefined
      );
      setFeatures(data);
    } catch (error: any) {
      console.error("Error loading features:", error);
      toast.error(
        error.response?.data?.error?.message ||
          "Erro ao carregar sugestões de funcionalidades"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleViewDetails = (feature: FeatureRequest) => {
    setSelectedFeature(feature);
    setViewDialogOpen(true);
  };

  const handleOpenStatusDialog = (feature: FeatureRequest) => {
    setSelectedFeature(feature);
    setNewStatus(feature.status);
    setStatusDialogOpen(true);
  };

  const handleUpdateStatus = async () => {
    if (!selectedFeature || !newStatus) return;

    try {
      setUpdating(true);
      await featureRequestService.updateStatus(selectedFeature.id, newStatus);

      // Update local state
      setFeatures(
        features.map((f) =>
          f.id === selectedFeature.id ? { ...f, status: newStatus as any } : f
        )
      );

      toast.success("Status atualizado com sucesso!");
      setStatusDialogOpen(false);
    } catch (error: any) {
      console.error("Error updating status:", error);
      toast.error(
        error.response?.data?.error?.message || "Erro ao atualizar status"
      );
    } finally {
      setUpdating(false);
    }
  };

  const filteredFeatures = features.filter(
    (feature) =>
      feature.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      feature.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      feature.author.username.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const stats = {
    total: features.length,
    pending: features.filter((f) => f.status === "PENDING").length,
    reviewing: features.filter((f) => f.status === "REVIEWING").length,
    planned: features.filter((f) => f.status === "PLANNED").length,
    inProgress: features.filter((f) => f.status === "IN_PROGRESS").length,
    completed: features.filter((f) => f.status === "COMPLETED").length,
    declined: features.filter((f) => f.status === "DECLINED").length,
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Gestão de Sugestões</h1>
        <p className="text-muted-foreground mt-2">
          Gerencie sugestões de funcionalidades da comunidade
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold">{stats.total}</div>
            <p className="text-xs text-muted-foreground">Total</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-gray-500">
              {stats.pending}
            </div>
            <p className="text-xs text-muted-foreground">Pendentes</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-yellow-500">
              {stats.reviewing}
            </div>
            <p className="text-xs text-muted-foreground">Em Análise</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-blue-500">
              {stats.planned}
            </div>
            <p className="text-xs text-muted-foreground">Planeadas</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-purple-500">
              {stats.inProgress}
            </div>
            <p className="text-xs text-muted-foreground">Em Progresso</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-green-500">
              {stats.completed}
            </div>
            <p className="text-xs text-muted-foreground">Concluídas</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-red-500">
              {stats.declined}
            </div>
            <p className="text-xs text-muted-foreground">Recusadas</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Pesquisar sugestões..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            <Select value={filterCategory} onValueChange={setFilterCategory}>
              <SelectTrigger className="w-full md:w-[180px]">
                <Filter className="h-4 w-4 mr-2" />
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
              <SelectTrigger className="w-full md:w-[180px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos Status</SelectItem>
                {Object.entries(statusConfig).map(([key, config]) => (
                  <SelectItem key={key} value={key}>
                    {config.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-full md:w-[180px]">
                <SelectValue placeholder="Ordenar" />
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

      {/* Table */}
      <Card>
        <CardHeader>
          <CardTitle>Sugestões de Funcionalidades</CardTitle>
          <CardDescription>
            {filteredFeatures.length} de {features.length} sugestões
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-12">
              <Loader2 className="h-8 w-8 animate-spin mx-auto text-muted-foreground mb-2" />
              <p className="text-sm text-muted-foreground">Carregando...</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Título</TableHead>
                    <TableHead>Autor</TableHead>
                    <TableHead>Categoria</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-center">Votos</TableHead>
                    <TableHead className="text-center">Comentários</TableHead>
                    <TableHead>Data</TableHead>
                    <TableHead className="text-right">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredFeatures.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={8} className="text-center py-8">
                        <Lightbulb className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                        <p className="text-muted-foreground">
                          Nenhuma sugestão encontrada
                        </p>
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredFeatures.map((feature) => {
                      const status = statusConfig[feature.status];
                      const StatusIcon = status.icon;

                      return (
                        <TableRow key={feature.id}>
                          <TableCell>
                            <div className="max-w-xs">
                              <p className="font-medium line-clamp-1">
                                {feature.title}
                              </p>
                              <p className="text-sm text-muted-foreground line-clamp-1">
                                {feature.description}
                              </p>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <img
                                src={
                                  feature.author.avatarUrl ||
                                  `https://api.dicebear.com/7.x/avataaars/svg?seed=${feature.author.username}`
                                }
                                alt={feature.author.username}
                                className="h-6 w-6 rounded-full"
                              />
                              <span className="text-sm">
                                {feature.author.username}
                              </span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline">
                              {categories.find(
                                (c) => c.value === feature.category
                              )?.label || feature.category}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <Badge className={status.color}>
                              <StatusIcon className="h-3 w-3 mr-1" />
                              {status.label}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-center">
                            <div className="flex items-center justify-center gap-1">
                              <ArrowUp className="h-3 w-3 text-muted-foreground" />
                              <span className="font-medium">
                                {feature.voteCount}
                              </span>
                            </div>
                          </TableCell>
                          <TableCell className="text-center">
                            <div className="flex items-center justify-center gap-1">
                              <MessageSquare className="h-3 w-3 text-muted-foreground" />
                              <span>{feature.commentCount}</span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <span className="text-sm text-muted-foreground">
                              {formatDistanceToNow(
                                new Date(feature.createdAt),
                                {
                                  addSuffix: true,
                                  locale: ptBR,
                                }
                              )}
                            </span>
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex items-center justify-end gap-2">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleViewDetails(feature)}
                              >
                                <Eye className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleOpenStatusDialog(feature)}
                              >
                                Alterar Status
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      );
                    })
                  )}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* View Details Dialog */}
      <Dialog open={viewDialogOpen} onOpenChange={setViewDialogOpen}>
        <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Detalhes da Sugestão</DialogTitle>
            <DialogDescription>
              Informações completas da sugestão de funcionalidade
            </DialogDescription>
          </DialogHeader>

          {selectedFeature && (
            <div className="space-y-4">
              <div>
                <Label className="text-sm font-medium">Título</Label>
                <p className="text-lg font-semibold mt-1">
                  {selectedFeature.title}
                </p>
              </div>

              <div className="flex gap-4">
                <div>
                  <Label className="text-sm font-medium">Categoria</Label>
                  <Badge variant="outline" className="mt-1">
                    {categories.find((c) => c.value === selectedFeature.category)
                      ?.label || selectedFeature.category}
                  </Badge>
                </div>
                <div>
                  <Label className="text-sm font-medium">Status</Label>
                  <Badge
                    className={`${statusConfig[selectedFeature.status].color} mt-1`}
                  >
                    {statusConfig[selectedFeature.status].label}
                  </Badge>
                </div>
                <div>
                  <Label className="text-sm font-medium">Votos</Label>
                  <p className="text-lg font-bold mt-1">
                    {selectedFeature.voteCount}
                  </p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Comentários</Label>
                  <p className="text-lg font-bold mt-1">
                    {selectedFeature.commentCount}
                  </p>
                </div>
              </div>

              <div>
                <Label className="text-sm font-medium">Descrição</Label>
                <p className="text-muted-foreground mt-1 whitespace-pre-wrap">
                  {selectedFeature.description}
                </p>
              </div>

              <div>
                <Label className="text-sm font-medium">Autor</Label>
                <div className="flex items-center gap-2 mt-1">
                  <img
                    src={
                      selectedFeature.author.avatarUrl ||
                      `https://api.dicebear.com/7.x/avataaars/svg?seed=${selectedFeature.author.username}`
                    }
                    alt={selectedFeature.author.username}
                    className="h-8 w-8 rounded-full"
                  />
                  <span>{selectedFeature.author.username}</span>
                </div>
              </div>

              <div>
                <Label className="text-sm font-medium">Data de Criação</Label>
                <p className="text-muted-foreground mt-1">
                  {formatDistanceToNow(new Date(selectedFeature.createdAt), {
                    addSuffix: true,
                    locale: ptBR,
                  })}
                </p>
              </div>

              <div className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={() => navigate(`/feature-requests/${selectedFeature.id}`)}
                  className="flex-1"
                >
                  Ver Página Completa
                </Button>
                <Button
                  onClick={() => {
                    setViewDialogOpen(false);
                    handleOpenStatusDialog(selectedFeature);
                  }}
                  className="flex-1"
                >
                  Alterar Status
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Update Status Dialog */}
      <Dialog open={statusDialogOpen} onOpenChange={setStatusDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Alterar Status</DialogTitle>
            <DialogDescription>
              Atualize o status da sugestão de funcionalidade
            </DialogDescription>
          </DialogHeader>

          {selectedFeature && (
            <div className="space-y-4">
              <div>
                <Label className="text-sm font-medium">Sugestão</Label>
                <p className="text-sm text-muted-foreground mt-1">
                  {selectedFeature.title}
                </p>
              </div>

              <div>
                <Label htmlFor="status">Novo Status</Label>
                <Select value={newStatus} onValueChange={setNewStatus}>
                  <SelectTrigger id="status" className="mt-1">
                    <SelectValue placeholder="Selecione um status" />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(statusConfig).map(([key, config]) => {
                      const Icon = config.icon;
                      return (
                        <SelectItem key={key} value={key}>
                          <div className="flex items-center gap-2">
                            <Icon className="h-4 w-4" />
                            {config.label}
                          </div>
                        </SelectItem>
                      );
                    })}
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setStatusDialogOpen(false)}
              disabled={updating}
            >
              Cancelar
            </Button>
            <Button onClick={handleUpdateStatus} disabled={updating}>
              {updating ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Atualizando...
                </>
              ) : (
                "Atualizar Status"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminFeatures;

