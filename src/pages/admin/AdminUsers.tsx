import { useState } from 'react';
import { 
  Search, 
  MoreHorizontal, 
  Ban, 
  CheckCircle, 
  Trash2, 
  Edit,
  Mail,
  Shield,
  Filter
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { mockUsers } from '@/lib/mockData';
import { toast } from 'sonner';

interface UserWithStatus {
  id: string;
  username: string;
  email: string;
  avatarUrl?: string;
  level: string;
  reputation: number;
  status: 'active' | 'banned' | 'pending';
  role: 'user' | 'moderator' | 'admin';
  postsCount: number;
  commentsCount: number;
  createdAt: string;
}

const usersWithStatus: UserWithStatus[] = mockUsers.map((user, index) => ({
  ...user,
  status: index === 2 ? 'banned' : index === 4 ? 'pending' : 'active',
  role: index === 0 ? 'admin' : index === 1 ? 'moderator' : 'user',
  postsCount: Math.floor(Math.random() * 50),
  commentsCount: Math.floor(Math.random() * 200),
}));

export default function AdminUsers() {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [roleFilter, setRoleFilter] = useState<string>('all');
  const [selectedUser, setSelectedUser] = useState<UserWithStatus | null>(null);
  const [dialogType, setDialogType] = useState<'ban' | 'delete' | 'role' | null>(null);

  const filteredUsers = usersWithStatus.filter((user) => {
    const matchesSearch = user.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || user.status === statusFilter;
    const matchesRole = roleFilter === 'all' || user.role === roleFilter;
    return matchesSearch && matchesStatus && matchesRole;
  });

  const handleBanUser = () => {
    toast.success(`Usuário ${selectedUser?.username} foi ${selectedUser?.status === 'banned' ? 'desbanido' : 'banido'}`);
    setDialogType(null);
    setSelectedUser(null);
  };

  const handleDeleteUser = () => {
    toast.success(`Usuário ${selectedUser?.username} foi removido`);
    setDialogType(null);
    setSelectedUser(null);
  };

  const handleChangeRole = (newRole: string) => {
    toast.success(`Role de ${selectedUser?.username} alterada para ${newRole}`);
    setDialogType(null);
    setSelectedUser(null);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Usuários</h1>
          <p className="text-muted-foreground">Gerencie os usuários da plataforma</p>
        </div>
        <Button>
          <Mail className="mr-2 h-4 w-4" />
          Convidar Usuário
        </Button>
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
                <SelectItem value="pending">Pendentes</SelectItem>
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
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border text-left">
                  <th className="pb-3 font-medium text-muted-foreground">Usuário</th>
                  <th className="pb-3 font-medium text-muted-foreground">Role</th>
                  <th className="pb-3 font-medium text-muted-foreground">Status</th>
                  <th className="pb-3 font-medium text-muted-foreground">Reputação</th>
                  <th className="pb-3 font-medium text-muted-foreground">Posts</th>
                  <th className="pb-3 font-medium text-muted-foreground">Comentários</th>
                  <th className="pb-3 font-medium text-muted-foreground">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filteredUsers.map((user) => (
                  <tr key={user.id} className="group">
                    <td className="py-4">
                      <div className="flex items-center gap-3">
                        <Avatar>
                          <AvatarImage src={user.avatarUrl} />
                          <AvatarFallback>{user.username.slice(0, 2).toUpperCase()}</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium text-foreground">{user.username}</p>
                          <p className="text-sm text-muted-foreground">{user.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-4">
                      <Badge variant={
                        user.role === 'admin' ? 'default' : 
                        user.role === 'moderator' ? 'success' : 'secondary'
                      }>
                        {user.role === 'admin' ? 'Admin' : 
                         user.role === 'moderator' ? 'Moderador' : 'Usuário'}
                      </Badge>
                    </td>
                    <td className="py-4">
                      <Badge variant={
                        user.status === 'active' ? 'success' : 
                        user.status === 'banned' ? 'destructive' : 'warning'
                      }>
                        {user.status === 'active' ? 'Ativo' : 
                         user.status === 'banned' ? 'Banido' : 'Pendente'}
                      </Badge>
                    </td>
                    <td className="py-4">
                      <span className="font-medium text-primary">{user.reputation}</span>
                    </td>
                    <td className="py-4 text-muted-foreground">{user.postsCount}</td>
                    <td className="py-4 text-muted-foreground">{user.commentsCount}</td>
                    <td className="py-4">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>
                            <Edit className="mr-2 h-4 w-4" />
                            Editar
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => {
                            setSelectedUser(user);
                            setDialogType('role');
                          }}>
                            <Shield className="mr-2 h-4 w-4" />
                            Alterar Role
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem 
                            onClick={() => {
                              setSelectedUser(user);
                              setDialogType('ban');
                            }}
                            className={user.status === 'banned' ? 'text-success' : 'text-warning'}
                          >
                            {user.status === 'banned' ? (
                              <>
                                <CheckCircle className="mr-2 h-4 w-4" />
                                Desbanir
                              </>
                            ) : (
                              <>
                                <Ban className="mr-2 h-4 w-4" />
                                Banir
                              </>
                            )}
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            onClick={() => {
                              setSelectedUser(user);
                              setDialogType('delete');
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
        </CardContent>
      </Card>

      {/* Ban Dialog */}
      <Dialog open={dialogType === 'ban'} onOpenChange={() => setDialogType(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {selectedUser?.status === 'banned' ? 'Desbanir' : 'Banir'} Usuário
            </DialogTitle>
            <DialogDescription>
              {selectedUser?.status === 'banned' 
                ? `Tem certeza que deseja desbanir ${selectedUser?.username}? O usuário poderá acessar a plataforma novamente.`
                : `Tem certeza que deseja banir ${selectedUser?.username}? O usuário não poderá mais acessar a plataforma.`
              }
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogType(null)}>Cancelar</Button>
            <Button 
              variant={selectedUser?.status === 'banned' ? 'default' : 'destructive'}
              onClick={handleBanUser}
            >
              {selectedUser?.status === 'banned' ? 'Desbanir' : 'Banir'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Dialog */}
      <Dialog open={dialogType === 'delete'} onOpenChange={() => setDialogType(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Remover Usuário</DialogTitle>
            <DialogDescription>
              Tem certeza que deseja remover {selectedUser?.username}? Esta ação não pode ser desfeita.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogType(null)}>Cancelar</Button>
            <Button variant="destructive" onClick={handleDeleteUser}>Remover</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Role Dialog */}
      <Dialog open={dialogType === 'role'} onOpenChange={() => setDialogType(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Alterar Role</DialogTitle>
            <DialogDescription>
              Selecione a nova role para {selectedUser?.username}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <Button 
              variant={selectedUser?.role === 'admin' ? 'default' : 'outline'}
              onClick={() => handleChangeRole('admin')}
              className="justify-start"
            >
              <Shield className="mr-2 h-4 w-4" />
              Admin - Acesso total
            </Button>
            <Button 
              variant={selectedUser?.role === 'moderator' ? 'default' : 'outline'}
              onClick={() => handleChangeRole('moderator')}
              className="justify-start"
            >
              <Shield className="mr-2 h-4 w-4" />
              Moderador - Moderar conteúdo
            </Button>
            <Button 
              variant={selectedUser?.role === 'user' ? 'default' : 'outline'}
              onClick={() => handleChangeRole('user')}
              className="justify-start"
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
