import { useState } from 'react';
import { 
  Send,
  Users,
  Bell,
  AlertTriangle,
  CheckCircle,
  Info,
  XCircle,
  Search,
  Clock
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAdminNotificationStore } from '@/stores/adminNotificationStore';
import { toast } from 'sonner';
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { useAuthStore } from '@/stores/authStore';

const notificationTypes = [
  { value: 'info', label: 'Informação', icon: Info, color: 'text-blue-500' },
  { value: 'success', label: 'Sucesso', icon: CheckCircle, color: 'text-green-500' },
  { value: 'warning', label: 'Aviso', icon: AlertTriangle, color: 'text-yellow-500' },
  { value: 'error', label: 'Erro/Urgente', icon: XCircle, color: 'text-red-500' },
];

const audienceOptions = [
  { value: 'all', label: 'Todos os usuários' },
  { value: 'admins', label: 'Apenas Admins' },
  { value: 'moderators', label: 'Moderadores' },
  { value: 'users', label: 'Usuários comuns' },
];

export default function AdminNotifications() {
  const { user } = useAuthStore();
  const { sentNotifications, addSentNotification, addUserNotification } = useAdminNotificationStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [formData, setFormData] = useState({
    title: '',
    message: '',
    type: 'info' as 'info' | 'warning' | 'success' | 'error',
    targetAudience: 'all' as 'all' | 'admins' | 'moderators' | 'users',
  });

  const handleSendNotification = () => {
    if (!formData.title.trim() || !formData.message.trim()) {
      toast.error('Preencha todos os campos obrigatórios');
      return;
    }

    // Add to sent notifications history
    addSentNotification({
      title: formData.title,
      message: formData.message,
      type: formData.type,
      targetAudience: formData.targetAudience,
      sentBy: user?.username || 'Admin',
    });

    // Add to user notifications (simulating broadcast)
    addUserNotification({
      type: 'mention',
      message: `${formData.title}: ${formData.message}`,
      read: false,
    });

    toast.success('Notificação enviada com sucesso!');
    setFormData({
      title: '',
      message: '',
      type: 'info',
      targetAudience: 'all',
    });
  };

  const filteredNotifications = sentNotifications.filter(
    (n) =>
      n.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      n.message.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getTypeIcon = (type: string) => {
    const typeConfig = notificationTypes.find((t) => t.value === type);
    if (!typeConfig) return null;
    const Icon = typeConfig.icon;
    return <Icon className={`h-5 w-5 ${typeConfig.color}`} />;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">Notificações</h1>
        <p className="text-muted-foreground">Envie notificações para os usuários da plataforma</p>
      </div>

      <Tabs defaultValue="send" className="space-y-6">
        <TabsList className="bg-muted">
          <TabsTrigger value="send" className="gap-2">
            <Send className="h-4 w-4" />
            Enviar
          </TabsTrigger>
          <TabsTrigger value="history" className="gap-2">
            <Clock className="h-4 w-4" />
            Histórico
          </TabsTrigger>
        </TabsList>

        {/* Send Notification Tab */}
        <TabsContent value="send">
          <div className="grid gap-6 lg:grid-cols-2">
            {/* Form */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bell className="h-5 w-5" />
                  Nova Notificação
                </CardTitle>
                <CardDescription>
                  Crie e envie uma notificação para os usuários
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Título *</Label>
                  <Input
                    id="title"
                    placeholder="Ex: Atualização importante"
                    value={formData.title}
                    onChange={(e) => setFormData((prev) => ({ ...prev, title: e.target.value }))}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="message">Mensagem *</Label>
                  <Textarea
                    id="message"
                    placeholder="Digite a mensagem da notificação..."
                    value={formData.message}
                    onChange={(e) => setFormData((prev) => ({ ...prev, message: e.target.value }))}
                    rows={4}
                  />
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label>Tipo</Label>
                    <Select
                      value={formData.type}
                      onValueChange={(value: any) => setFormData((prev) => ({ ...prev, type: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {notificationTypes.map((type) => (
                          <SelectItem key={type.value} value={type.value}>
                            <div className="flex items-center gap-2">
                              <type.icon className={`h-4 w-4 ${type.color}`} />
                              {type.label}
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Público-alvo</Label>
                    <Select
                      value={formData.targetAudience}
                      onValueChange={(value: any) => setFormData((prev) => ({ ...prev, targetAudience: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {audienceOptions.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <Button onClick={handleSendNotification} className="w-full">
                  <Send className="mr-2 h-4 w-4" />
                  Enviar Notificação
                </Button>
              </CardContent>
            </Card>

            {/* Preview */}
            <Card>
              <CardHeader>
                <CardTitle>Preview</CardTitle>
                <CardDescription>
                  Visualize como a notificação aparecerá para os usuários
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="rounded-lg border border-border bg-card p-4 space-y-3">
                  <div className="flex items-start gap-3">
                    {getTypeIcon(formData.type)}
                    <div className="flex-1">
                      <h4 className="font-medium text-foreground">
                        {formData.title || 'Título da notificação'}
                      </h4>
                      <p className="text-sm text-muted-foreground mt-1">
                        {formData.message || 'Mensagem da notificação aparecerá aqui...'}
                      </p>
                      <div className="flex items-center gap-2 mt-2">
                        <Badge variant="secondary" size="sm">
                          {audienceOptions.find((o) => o.value === formData.targetAudience)?.label}
                        </Badge>
                        <span className="text-xs text-muted-foreground">Agora mesmo</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-4 p-4 rounded-lg bg-muted/50">
                  <h5 className="font-medium text-sm mb-2">Estatísticas estimadas</h5>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-muted-foreground">Destinatários:</span>
                      <span className="ml-2 font-medium">
                        {formData.targetAudience === 'all' ? '~1,842' : 
                         formData.targetAudience === 'admins' ? '~5' :
                         formData.targetAudience === 'moderators' ? '~12' : '~1,825'}
                      </span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Tipo:</span>
                      <span className="ml-2 font-medium">
                        {notificationTypes.find((t) => t.value === formData.type)?.label}
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* History Tab */}
        <TabsContent value="history">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5" />
                  Histórico de Notificações
                </CardTitle>
                <div className="relative w-64">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    placeholder="Buscar..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {filteredNotifications.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <Bell className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>Nenhuma notificação enviada ainda</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredNotifications.map((notification) => (
                    <div
                      key={notification.id}
                      className="rounded-lg border border-border p-4 transition-colors hover:bg-accent/50"
                    >
                      <div className="flex items-start gap-3">
                        {getTypeIcon(notification.type)}
                        <div className="flex-1">
                          <div className="flex items-start justify-between">
                            <h4 className="font-medium text-foreground">{notification.title}</h4>
                            <span className="text-xs text-muted-foreground">
                              {formatDistanceToNow(new Date(notification.sentAt), {
                                addSuffix: true,
                                locale: ptBR,
                              })}
                            </span>
                          </div>
                          <p className="text-sm text-muted-foreground mt-1">{notification.message}</p>
                          <div className="flex items-center gap-2 mt-2">
                            <Badge variant="secondary" size="sm">
                              {audienceOptions.find((o) => o.value === notification.targetAudience)?.label}
                            </Badge>
                            <span className="text-xs text-muted-foreground">
                              Enviado por {notification.sentBy}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
