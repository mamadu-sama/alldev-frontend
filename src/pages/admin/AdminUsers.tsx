import { useState, useEffect } from "react";
import {
  Search,
  MoreHorizontal,
  Ban,
  CheckCircle,
  Trash2,
  Shield,
  Filter,
  Loader2,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { adminService, type AdminUser } from "@/services/admin.service";
import { useToast } from "@/hooks/use-toast";
import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";

export default function AdminUsers() {
  const { toast } = useToast();
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [roleFilter, setRoleFilter] = useState<string>("all");
  const [selectedUser, setSelectedUser] = useState<AdminUser | null>(null);
  const [dialogType, setDialogType] = useState<
    "ban" | "unban" | "delete" | "role" | null
  >(null);
  const [banReason, setBanReason] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      setIsLoading(true);
      const response = await adminService.getAllUsers(1, 100);
      setUsers(response.data);
    } catch (error) {
      toast({
        title: "Erro ao carregar usuários",
        description: "Não foi possível carregar a lista de usuários.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus =
      statusFilter === "all" ||
      (statusFilter === "active" && user.isActive) ||
      (statusFilter === "banned" && !user.isActive);
    const matchesRole =
      roleFilter === "all" ||
      user.roles.some((r) => r.role.toLowerCase() === roleFilter.toLowerCase());
    return matchesSearch && matchesStatus && matchesRole;
  });

  const handleBanUser = async () => {
    if (!selectedUser || !banReason.trim()) {
      toast({
        title: "Motivo obrigatório",
        description: "Por favor, informe o motivo do banimento.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    try {
      await adminService.banUser(selectedUser.id, banReason);
      toast({
        title: "Usuário banido!",
        description: `${selectedUser.username} foi banido com sucesso.`,
      });
      await loadUsers();
      setDialogType(null);
      setSelectedUser(null);
      setBanReason("");
    } catch (error) {
      const errorMessage =
        error instanceof Error && "response" in error
          ? (
              error as {
                response?: { data?: { error?: { message?: string } } };
              }
            ).response?.data?.error?.message
          : "Não foi possível banir o usuário.";
      toast({
        title: "Erro ao banir usuário",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUnbanUser = async () => {
    if (!selectedUser) return;

    setIsSubmitting(true);
    try {
      await adminService.unbanUser(selectedUser.id);
      toast({
        title: "Usuário desbanido!",
        description: `${selectedUser.username} foi desbanido com sucesso.`,
      });
      await loadUsers();
      setDialogType(null);
      setSelectedUser(null);
    } catch (error) {
      const errorMessage =
        error instanceof Error && "response" in error
          ? (
              error as {
                response?: { data?: { error?: { message?: string } } };
              }
            ).response?.data?.error?.message
          : "Não foi possível desbanir o usuário.";
      toast({
        title: "Erro ao desbanir usuário",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteUser = async () => {
    if (!selectedUser) return;

    setIsSubmitting(true);
    try {
      await adminService.deleteUser(selectedUser.id);
      toast({
        title: "Usuário removido!",
        description: `${selectedUser.username} foi removido com sucesso.`,
      });
      await loadUsers();
      setDialogType(null);
      setSelectedUser(null);
    } catch (error) {
      const errorMessage =
        error instanceof Error && "response" in error
          ? (
              error as {
                response?: { data?: { error?: { message?: string } } };
              }
            ).response?.data?.error?.message
          : "Não foi possível remover o usuário.";
      toast({
        title: "Erro ao remover usuário",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChangeRole = async (newRoles: string[]) => {
    if (!selectedUser) return;

    setIsSubmitting(true);
    try {
      await adminService.updateUserRole(selectedUser.id, newRoles);
      toast({
        title: "Role alterada!",
        description: `Role de ${selectedUser.username} foi alterada com sucesso.`,
      });
      await loadUsers();
      setDialogType(null);
      setSelectedUser(null);
    } catch (error) {
      const errorMessage =
        error instanceof Error && "response" in error
          ? (
              error as {
                response?: { data?: { error?: { message?: string } } };
              }
            ).response?.data?.error?.message
          : "Não foi possível alterar a role.";
      toast({
        title: "Erro ao alterar role",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const getUserRoleLabel = (roles: Array<{ role: string }>) => {
    if (roles.some((r) => r.role === "ADMIN")) return "Admin";
    if (roles.some((r) => r.role === "MODERATOR")) return "Moderador";
    return "Usuário";
  };

  const getUserRoleVariant = (
    roles: Array<{ role: string }>
  ): "default" | "success" | "secondary" => {
    if (roles.some((r) => r.role === "ADMIN")) return "default";
    if (roles.some((r) => r.role === "MODERATOR")) return "success";
    return "secondary";
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Usuários</h1>
          <p className="text-muted-foreground">
            Gerencie os usuários da plataforma
          </p>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col gap-4 sm:flex-row">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Buscar por nome ou email..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full sm:w-[150px]">
                <Filter className="mr-2 h-4 w-4" />
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos</SelectItem>
                <SelectItem value="active">Ativos</SelectItem>
                <SelectItem value="banned">Banidos</SelectItem>
              </SelectContent>
            </Select>
            <Select value={roleFilter} onValueChange={setRoleFilter}>
              <SelectTrigger className="w-full sm:w-[150px]">
                <Shield className="mr-2 h-4 w-4" />
                <SelectValue placeholder="Role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas</SelectItem>
                <SelectItem value="admin">Admin</SelectItem>
                <SelectItem value="moderator">Moderador</SelectItem>
                <SelectItem value="user">Usuário</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Users Table */}
      <Card>
        <CardHeader>
          <CardTitle>Lista de Usuários ({filteredUsers.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center items-center h-64">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : filteredUsers.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border text-left">
                    <th className="pb-3 font-medium text-muted-foreground">
                      Usuário
                    </th>
                    <th className="pb-3 font-medium text-muted-foreground">
                      Role
                    </th>
                    <th className="pb-3 font-medium text-muted-foreground">
                      Status
                    </th>
                    <th className="pb-3 font-medium text-muted-foreground">
                      Reputação
                    </th>
                    <th className="pb-3 font-medium text-muted-foreground">
                      Posts
                    </th>
                    <th className="pb-3 font-medium text-muted-foreground">
                      Comentários
                    </th>
                    <th className="pb-3 font-medium text-muted-foreground">
                      Ações
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {filteredUsers.map((user) => (
                    <tr key={user.id} className="group">
                      <td className="py-4">
                        <div className="flex items-center gap-3">
                          <Avatar>
                            <AvatarImage src={user.avatarUrl || undefined} />
                            <AvatarFallback>
                              {user.username.slice(0, 2).toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium text-foreground">
                              {user.username}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              {user.email}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="py-4">
                        <Badge variant={getUserRoleVariant(user.roles)}>
                          {getUserRoleLabel(user.roles)}
                        </Badge>
                      </td>
                      <td className="py-4">
                        <Badge
                          variant={user.isActive ? "success" : "destructive"}
                        >
                          {user.isActive ? "Ativo" : "Banido"}
                        </Badge>
                      </td>
                      <td className="py-4">
                        <span className="font-medium text-primary">
                          {user.reputation}
                        </span>
                      </td>
                      <td className="py-4 text-muted-foreground">
                        {user._count.posts}
                      </td>
                      <td className="py-4 text-muted-foreground">
                        {user._count.comments}
                      </td>
                      <td className="py-4">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem
                              onClick={() => {
                                setSelectedUser(user);
                                setDialogType("role");
                              }}
                            >
                              <Shield className="mr-2 h-4 w-4" />
                              Alterar Role
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              onClick={() => {
                                setSelectedUser(user);
                                setDialogType(user.isActive ? "ban" : "unban");
                              }}
                              className={
                                user.isActive ? "text-warning" : "text-success"
                              }
                            >
                              {user.isActive ? (
                                <>
                                  <Ban className="mr-2 h-4 w-4" />
                                  Banir
                                </>
                              ) : (
                                <>
                                  <CheckCircle className="mr-2 h-4 w-4" />
                                  Desbanir
                                </>
                              )}
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => {
                                setSelectedUser(user);
                                setDialogType("delete");
                              }}
                              className="text-destructive"
                            >
                              <Trash2 className="mr-2 h-4 w-4" />
                              Remover
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-center text-muted-foreground py-8">
              Nenhum usuário encontrado
            </p>
          )}
        </CardContent>
      </Card>

      {/* Ban Dialog */}
      <Dialog
        open={dialogType === "ban"}
        onOpenChange={() => {
          setDialogType(null);
          setBanReason("");
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Banir Usuário</DialogTitle>
            <DialogDescription>
              Tem certeza que deseja banir {selectedUser?.username}? O usuário
              não poderá mais acessar a plataforma.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="banReason">Motivo do banimento *</Label>
              <Textarea
                id="banReason"
                placeholder="Descreva o motivo do banimento..."
                value={banReason}
                onChange={(e) => setBanReason(e.target.value)}
                rows={4}
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setDialogType(null);
                setBanReason("");
              }}
              disabled={isSubmitting}
            >
              Cancelar
            </Button>
            <Button
              variant="destructive"
              onClick={handleBanUser}
              disabled={isSubmitting || !banReason.trim()}
            >
              {isSubmitting && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              Banir
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Unban Dialog */}
      <Dialog
        open={dialogType === "unban"}
        onOpenChange={() => setDialogType(null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Desbanir Usuário</DialogTitle>
            <DialogDescription>
              Tem certeza que deseja desbanir {selectedUser?.username}? O
              usuário poderá acessar a plataforma novamente.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setDialogType(null)}
              disabled={isSubmitting}
            >
              Cancelar
            </Button>
            <Button onClick={handleUnbanUser} disabled={isSubmitting}>
              {isSubmitting && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              Desbanir
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Dialog */}
      <Dialog
        open={dialogType === "delete"}
        onOpenChange={() => setDialogType(null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Remover Usuário</DialogTitle>
            <DialogDescription>
              Tem certeza que deseja remover {selectedUser?.username}? Esta ação
              não pode ser desfeita. Todos os posts e comentários do usuário
              serão removidos.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setDialogType(null)}
              disabled={isSubmitting}
            >
              Cancelar
            </Button>
            <Button
              variant="destructive"
              onClick={handleDeleteUser}
              disabled={isSubmitting}
            >
              {isSubmitting && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              Remover
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Role Dialog */}
      <Dialog
        open={dialogType === "role"}
        onOpenChange={() => setDialogType(null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Alterar Role</DialogTitle>
            <DialogDescription>
              Selecione a nova role para {selectedUser?.username}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <Button
              variant={
                selectedUser?.roles.some((r) => r.role === "ADMIN")
                  ? "default"
                  : "outline"
              }
              onClick={() => handleChangeRole(["ADMIN", "USER"])}
              className="justify-start"
              disabled={isSubmitting}
            >
              <Shield className="mr-2 h-4 w-4" />
              Admin - Acesso total
            </Button>
            <Button
              variant={
                selectedUser?.roles.some((r) => r.role === "MODERATOR")
                  ? "default"
                  : "outline"
              }
              onClick={() => handleChangeRole(["MODERATOR", "USER"])}
              className="justify-start"
              disabled={isSubmitting}
            >
              <Shield className="mr-2 h-4 w-4" />
              Moderador - Moderar conteúdo
            </Button>
            <Button
              variant={
                selectedUser?.roles.some((r) => r.role === "USER") &&
                !selectedUser?.roles.some(
                  (r) => r.role === "ADMIN" || r.role === "MODERATOR"
                )
                  ? "default"
                  : "outline"
              }
              onClick={() => handleChangeRole(["USER"])}
              className="justify-start"
              disabled={isSubmitting}
            >
              <Shield className="mr-2 h-4 w-4" />
              Usuário - Acesso padrão
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
