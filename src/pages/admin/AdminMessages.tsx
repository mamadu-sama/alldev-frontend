import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
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
import {
  Mail,
  Search,
  Filter,
  Eye,
  Trash2,
  Send,
  Loader2,
  CheckCircle,
  Clock,
  AlertCircle,
  Archive,
} from "lucide-react";
import { toast } from "sonner";
import { contactAdminService, ContactMessage } from "@/services/contact-admin.service";
import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";

const statusConfig: Record<
  string,
  { label: string; color: string; icon: any }
> = {
  PENDING: {
    label: "Pendente",
    color: "bg-yellow-500/10 text-yellow-500",
    icon: Clock,
  },
  READ: {
    label: "Lida",
    color: "bg-blue-500/10 text-blue-500",
    icon: Eye,
  },
  REPLIED: {
    label: "Respondida",
    color: "bg-green-500/10 text-green-500",
    icon: CheckCircle,
  },
  ARCHIVED: {
    label: "Arquivada",
    color: "bg-gray-500/10 text-gray-500",
    icon: Archive,
  },
};

const reasonLabels: Record<string, string> = {
  general: "Geral",
  bug: "Bug/Erro",
  suggestion: "Sugestão",
  security: "Segurança",
  partnership: "Parceria",
  press: "Imprensa",
};

const AdminMessages = () => {
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    read: 0,
    replied: 0,
  });
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterReason, setFilterReason] = useState("all");

  // Dialog states
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [replyDialogOpen, setReplyDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedMessage, setSelectedMessage] = useState<ContactMessage | null>(
    null
  );
  const [replyText, setReplyText] = useState("");
  const [sending, setSending] = useState(false);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    loadMessages();
    loadStats();
  }, [filterStatus, filterReason]);

  const loadMessages = async () => {
    try {
      setLoading(true);
      const { data } = await contactAdminService.getAll(
        1,
        100,
        filterStatus,
        filterReason,
        searchTerm
      );
      setMessages(data);
    } catch (error: any) {
      console.error("Error loading messages:", error);
      toast.error(
        error.response?.data?.error?.message ||
          "Erro ao carregar mensagens de contato"
      );
    } finally {
      setLoading(false);
    }
  };

  const loadStats = async () => {
    try {
      const data = await contactAdminService.getStats();
      setStats(data);
    } catch (error: any) {
      console.error("Error loading stats:", error);
    }
  };

  const handleViewMessage = async (message: ContactMessage) => {
    setSelectedMessage(message);
    setViewDialogOpen(true);

    // Mark as read if pending
    if (message.status === "PENDING") {
      try {
        await contactAdminService.updateStatus(message.id, "READ");
        setMessages(
          messages.map((m) =>
            m.id === message.id ? { ...m, status: "READ" } : m
          )
        );
        loadStats();
      } catch (error: any) {
        console.error("Error updating status:", error);
      }
    }
  };

  const handleOpenReplyDialog = (message: ContactMessage) => {
    setSelectedMessage(message);
    setReplyText("");
    setReplyDialogOpen(true);
  };

  const handleSendReply = async () => {
    if (!selectedMessage || !replyText.trim()) {
      toast.error("Por favor, escreva uma resposta.");
      return;
    }

    if (replyText.length < 10) {
      toast.error("A resposta deve ter no mínimo 10 caracteres.");
      return;
    }

    try {
      setSending(true);
      await contactAdminService.sendReply(selectedMessage.id, replyText);

      // Update local state
      setMessages(
        messages.map((m) =>
          m.id === selectedMessage.id ? { ...m, status: "REPLIED" } : m
        )
      );

      toast.success("Resposta enviada com sucesso!");
      setReplyDialogOpen(false);
      setReplyText("");
      loadStats();
    } catch (error: any) {
      console.error("Error sending reply:", error);
      toast.error(
        error.response?.data?.error?.message || "Erro ao enviar resposta"
      );
    } finally {
      setSending(false);
    }
  };

  const handleUpdateStatus = async (id: string, status: string) => {
    try {
      await contactAdminService.updateStatus(id, status);
      setMessages(messages.map((m) => (m.id === id ? { ...m, status: status as any } : m)));
      toast.success("Status atualizado com sucesso!");
      loadStats();
    } catch (error: any) {
      console.error("Error updating status:", error);
      toast.error(
        error.response?.data?.error?.message || "Erro ao atualizar status"
      );
    }
  };

  const handleOpenDeleteDialog = (message: ContactMessage) => {
    setSelectedMessage(message);
    setDeleteDialogOpen(true);
  };

  const handleDeleteMessage = async () => {
    if (!selectedMessage) return;

    try {
      setDeleting(true);
      await contactAdminService.deleteMessage(selectedMessage.id);
      setMessages(messages.filter((m) => m.id !== selectedMessage.id));
      toast.success("Mensagem excluída com sucesso!");
      setDeleteDialogOpen(false);
      loadStats();
    } catch (error: any) {
      console.error("Error deleting message:", error);
      toast.error(
        error.response?.data?.error?.message || "Erro ao excluir mensagem"
      );
    } finally {
      setDeleting(false);
    }
  };

  const filteredMessages = messages.filter(
    (message) =>
      message.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      message.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      message.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
      message.message.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Mensagens de Contato</h1>
        <p className="text-muted-foreground mt-2">
          Gerencie mensagens recebidas através do formulário de contato
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <Mail className="h-4 w-4 text-muted-foreground" />
              <p className="text-xs text-muted-foreground">Total</p>
            </div>
            <div className="text-2xl font-bold">{stats.total}</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <Clock className="h-4 w-4 text-yellow-500" />
              <p className="text-xs text-muted-foreground">Pendentes</p>
            </div>
            <div className="text-2xl font-bold text-yellow-500">
              {stats.pending}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <Eye className="h-4 w-4 text-blue-500" />
              <p className="text-xs text-muted-foreground">Lidas</p>
            </div>
            <div className="text-2xl font-bold text-blue-500">{stats.read}</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <CheckCircle className="h-4 w-4 text-green-500" />
              <p className="text-xs text-muted-foreground">Respondidas</p>
            </div>
            <div className="text-2xl font-bold text-green-500">
              {stats.replied}
            </div>
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
                  placeholder="Pesquisar mensagens..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-full md:w-[180px]">
                <Filter className="h-4 w-4 mr-2" />
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

            <Select value={filterReason} onValueChange={setFilterReason}>
              <SelectTrigger className="w-full md:w-[180px]">
                <SelectValue placeholder="Motivo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos Motivos</SelectItem>
                {Object.entries(reasonLabels).map(([key, label]) => (
                  <SelectItem key={key} value={key}>
                    {label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Button variant="outline" onClick={loadMessages}>
              <Search className="h-4 w-4 mr-2" />
              Pesquisar
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Table */}
      <Card>
        <CardHeader>
          <CardTitle>Mensagens Recebidas</CardTitle>
          <CardDescription>
            {filteredMessages.length} de {messages.length} mensagens
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
                    <TableHead>Remetente</TableHead>
                    <TableHead>Motivo</TableHead>
                    <TableHead>Assunto</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Data</TableHead>
                    <TableHead className="text-right">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredMessages.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-8">
                        <Mail className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                        <p className="text-muted-foreground">
                          Nenhuma mensagem encontrada
                        </p>
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredMessages.map((message) => {
                      const status = statusConfig[message.status];
                      const StatusIcon = status.icon;

                      return (
                        <TableRow key={message.id}>
                          <TableCell>
                            <div>
                              <p className="font-medium">{message.name}</p>
                              <p className="text-sm text-muted-foreground">
                                {message.email}
                              </p>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline">
                              {reasonLabels[message.reason] || message.reason}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <p className="max-w-xs line-clamp-1">
                              {message.subject}
                            </p>
                          </TableCell>
                          <TableCell>
                            <Badge className={status.color}>
                              <StatusIcon className="h-3 w-3 mr-1" />
                              {status.label}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <span className="text-sm text-muted-foreground">
                              {formatDistanceToNow(new Date(message.createdAt), {
                                addSuffix: true,
                                locale: ptBR,
                              })}
                            </span>
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex items-center justify-end gap-2">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleViewMessage(message)}
                              >
                                <Eye className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleOpenReplyDialog(message)}
                              >
                                <Send className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleOpenDeleteDialog(message)}
                              >
                                <Trash2 className="h-4 w-4" />
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

      {/* View Message Dialog */}
      <Dialog open={viewDialogOpen} onOpenChange={setViewDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Detalhes da Mensagem</DialogTitle>
            <DialogDescription>
              Informações completas da mensagem de contato
            </DialogDescription>
          </DialogHeader>

          {selectedMessage && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium">Nome</Label>
                  <p className="mt-1">{selectedMessage.name}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Email</Label>
                  <p className="mt-1">{selectedMessage.email}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium">Motivo</Label>
                  <Badge variant="outline" className="mt-1">
                    {reasonLabels[selectedMessage.reason] ||
                      selectedMessage.reason}
                  </Badge>
                </div>
                <div>
                  <Label className="text-sm font-medium">Status</Label>
                  <Badge
                    className={`${statusConfig[selectedMessage.status].color} mt-1`}
                  >
                    {statusConfig[selectedMessage.status].label}
                  </Badge>
                </div>
              </div>

              <div>
                <Label className="text-sm font-medium">Assunto</Label>
                <p className="mt-1 font-semibold">{selectedMessage.subject}</p>
              </div>

              <div>
                <Label className="text-sm font-medium">Mensagem</Label>
                <p className="mt-1 text-muted-foreground whitespace-pre-wrap">
                  {selectedMessage.message}
                </p>
              </div>

              <div>
                <Label className="text-sm font-medium">Data de Envio</Label>
                <p className="mt-1 text-sm text-muted-foreground">
                  {formatDistanceToNow(new Date(selectedMessage.createdAt), {
                    addSuffix: true,
                    locale: ptBR,
                  })}
                </p>
              </div>

              <div className="flex gap-2 pt-4">
                <Select
                  value={selectedMessage.status}
                  onValueChange={(value) =>
                    handleUpdateStatus(selectedMessage.id, value)
                  }
                >
                  <SelectTrigger className="flex-1">
                    <SelectValue placeholder="Alterar Status" />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(statusConfig).map(([key, config]) => (
                      <SelectItem key={key} value={key}>
                        {config.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Button
                  onClick={() => {
                    setViewDialogOpen(false);
                    handleOpenReplyDialog(selectedMessage);
                  }}
                  className="flex-1"
                >
                  <Send className="h-4 w-4 mr-2" />
                  Responder
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Reply Dialog */}
      <Dialog open={replyDialogOpen} onOpenChange={setReplyDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Responder Mensagem</DialogTitle>
            <DialogDescription>
              Envie uma resposta por email para{" "}
              {selectedMessage?.email}
            </DialogDescription>
          </DialogHeader>

          {selectedMessage && (
            <div className="space-y-4">
              <div className="bg-muted/50 p-3 rounded-lg">
                <p className="text-sm font-medium mb-1">Mensagem Original:</p>
                <p className="text-sm text-muted-foreground line-clamp-3">
                  {selectedMessage.message}
                </p>
              </div>

              <div>
                <Label htmlFor="reply">Sua Resposta *</Label>
                <Textarea
                  id="reply"
                  placeholder="Digite sua resposta aqui..."
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  rows={8}
                  className="mt-1 resize-none"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Mínimo 10 caracteres
                </p>
              </div>
            </div>
          )}

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setReplyDialogOpen(false)}
              disabled={sending}
            >
              Cancelar
            </Button>
            <Button onClick={handleSendReply} disabled={sending}>
              {sending ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Enviando...
                </>
              ) : (
                <>
                  <Send className="h-4 w-4 mr-2" />
                  Enviar Resposta
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Excluir Mensagem</DialogTitle>
            <DialogDescription>
              Tem certeza que deseja excluir esta mensagem? Esta ação não pode
              ser desfeita.
            </DialogDescription>
          </DialogHeader>

          {selectedMessage && (
            <div className="bg-muted/50 p-3 rounded-lg">
              <p className="text-sm font-medium">De: {selectedMessage.name}</p>
              <p className="text-sm text-muted-foreground">
                {selectedMessage.email}
              </p>
              <p className="text-sm mt-2">
                <strong>Assunto:</strong> {selectedMessage.subject}
              </p>
            </div>
          )}

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setDeleteDialogOpen(false)}
              disabled={deleting}
            >
              Cancelar
            </Button>
            <Button
              variant="destructive"
              onClick={handleDeleteMessage}
              disabled={deleting}
            >
              {deleting ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Excluindo...
                </>
              ) : (
                <>
                  <Trash2 className="h-4 w-4 mr-2" />
                  Excluir
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminMessages;

