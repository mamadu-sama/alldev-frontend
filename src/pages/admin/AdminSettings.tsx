import { useState } from 'react';
import { 
  Save,
  Globe,
  Bell,
  Shield,
  Palette,
  Database,
  Wrench,
  AlertTriangle
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
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
import { toast } from 'sonner';
import { useMaintenanceStore } from '@/stores/maintenanceStore';

export default function AdminSettings() {
  const { 
    isMaintenanceMode, 
    maintenanceMessage, 
    estimatedEndTime,
    toggleMaintenanceMode,
    setMaintenanceMessage,
    setEstimatedEndTime
  } = useMaintenanceStore();

  const [settings, setSettings] = useState({
    siteName: 'Alldev',
    siteDescription: 'Comunidade de desenvolvedores',
    siteUrl: 'https://alldev.com',
    contactEmail: 'contato@alldev.com',
    enableRegistration: true,
    requireEmailVerification: true,
    enableNotifications: true,
    enableEmailNotifications: true,
    moderationMode: 'post',
    minReputationToComment: 0,
    minReputationToPost: 0,
    maxTagsPerPost: 5,
    primaryColor: '#3b82f6',
    darkModeDefault: true,
  });

  const handleSave = () => {
    toast.success('Configurações salvas com sucesso');
  };

  const handleToggleMaintenance = () => {
    toggleMaintenanceMode();
    toast.success(isMaintenanceMode ? 'Modo de manutenção desativado' : 'Modo de manutenção ativado');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Configurações</h1>
          <p className="text-muted-foreground">Gerencie as configurações da plataforma</p>
        </div>
        <Button onClick={handleSave}>
          <Save className="mr-2 h-4 w-4" />
          Salvar Alterações
        </Button>
      </div>

      {/* Maintenance Mode Alert */}
      {isMaintenanceMode && (
        <div className="rounded-lg border border-warning bg-warning/10 p-4 flex items-center gap-3">
          <AlertTriangle className="h-5 w-5 text-warning" />
          <div className="flex-1">
            <p className="font-medium text-warning">Modo de Manutenção Ativo</p>
            <p className="text-sm text-muted-foreground">
              Os usuários estão vendo a página de manutenção. Apenas admins podem acessar o sistema.
            </p>
          </div>
          <Button variant="outline" size="sm" onClick={handleToggleMaintenance}>
            Desativar
          </Button>
        </div>
      )}

      <Tabs defaultValue="general" className="space-y-6">
        <TabsList className="bg-muted">
          <TabsTrigger value="general" className="gap-2">
            <Globe className="h-4 w-4" />
            Geral
          </TabsTrigger>
          <TabsTrigger value="maintenance" className="gap-2">
            <Wrench className="h-4 w-4" />
            Manutenção
          </TabsTrigger>
          <TabsTrigger value="moderation" className="gap-2">
            <Shield className="h-4 w-4" />
            Moderação
          </TabsTrigger>
          <TabsTrigger value="notifications" className="gap-2">
            <Bell className="h-4 w-4" />
            Notificações
          </TabsTrigger>
          <TabsTrigger value="appearance" className="gap-2">
            <Palette className="h-4 w-4" />
            Aparência
          </TabsTrigger>
        </TabsList>

        {/* General Settings */}
        <TabsContent value="general">
          <div className="grid gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Globe className="h-5 w-5" />
                  Informações do Site
                </CardTitle>
                <CardDescription>
                  Configurações básicas da plataforma
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="siteName">Nome do Site</Label>
                    <Input
                      id="siteName"
                      value={settings.siteName}
                      onChange={(e) => setSettings(prev => ({ ...prev, siteName: e.target.value }))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="siteUrl">URL do Site</Label>
                    <Input
                      id="siteUrl"
                      value={settings.siteUrl}
                      onChange={(e) => setSettings(prev => ({ ...prev, siteUrl: e.target.value }))}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="siteDescription">Descrição</Label>
                  <Textarea
                    id="siteDescription"
                    value={settings.siteDescription}
                    onChange={(e) => setSettings(prev => ({ ...prev, siteDescription: e.target.value }))}
                    rows={3}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="contactEmail">Email de Contato</Label>
                  <Input
                    id="contactEmail"
                    type="email"
                    value={settings.contactEmail}
                    onChange={(e) => setSettings(prev => ({ ...prev, contactEmail: e.target.value }))}
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Database className="h-5 w-5" />
                  Limites e Restrições
                </CardTitle>
                <CardDescription>
                  Configure limites para posts e interações
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 sm:grid-cols-3">
                  <div className="space-y-2">
                    <Label htmlFor="maxTags">Máximo de Tags por Post</Label>
                    <Input
                      id="maxTags"
                      type="number"
                      value={settings.maxTagsPerPost}
                      onChange={(e) => setSettings(prev => ({ ...prev, maxTagsPerPost: parseInt(e.target.value) }))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="minRepPost">Rep. Mínima para Postar</Label>
                    <Input
                      id="minRepPost"
                      type="number"
                      value={settings.minReputationToPost}
                      onChange={(e) => setSettings(prev => ({ ...prev, minReputationToPost: parseInt(e.target.value) }))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="minRepComment">Rep. Mínima para Comentar</Label>
                    <Input
                      id="minRepComment"
                      type="number"
                      value={settings.minReputationToComment}
                      onChange={(e) => setSettings(prev => ({ ...prev, minReputationToComment: parseInt(e.target.value) }))}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Maintenance Settings */}
        <TabsContent value="maintenance">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Wrench className="h-5 w-5" />
                Modo de Manutenção
                {isMaintenanceMode && (
                  <Badge variant="warning" className="ml-2">Ativo</Badge>
                )}
              </CardTitle>
              <CardDescription>
                Ative o modo de manutenção para bloquear o acesso dos usuários temporariamente
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between p-4 rounded-lg border border-border bg-card">
                <div className="space-y-0.5">
                  <Label className="text-base">Ativar Modo de Manutenção</Label>
                  <p className="text-sm text-muted-foreground">
                    Quando ativo, apenas administradores podem acessar o sistema
                  </p>
                </div>
                <Switch
                  checked={isMaintenanceMode}
                  onCheckedChange={handleToggleMaintenance}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="maintenanceMessage">Mensagem de Manutenção</Label>
                <Textarea
                  id="maintenanceMessage"
                  value={maintenanceMessage}
                  onChange={(e) => setMaintenanceMessage(e.target.value)}
                  rows={3}
                  placeholder="Mensagem que será exibida aos usuários..."
                />
                <p className="text-sm text-muted-foreground">
                  Esta mensagem será exibida na página de manutenção
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="estimatedEndTime">Previsão de Retorno</Label>
                <Input
                  id="estimatedEndTime"
                  type="datetime-local"
                  value={estimatedEndTime || ''}
                  onChange={(e) => setEstimatedEndTime(e.target.value || null)}
                />
                <p className="text-sm text-muted-foreground">
                  Informe quando a manutenção deve terminar (opcional)
                </p>
              </div>

              <div className="rounded-lg border border-border p-4 bg-muted/50">
                <h4 className="font-medium mb-2">Preview da Página de Manutenção</h4>
                <div className="rounded-lg border border-border bg-background p-4 text-center">
                  <Wrench className="h-8 w-8 mx-auto text-primary mb-2" />
                  <p className="font-medium">Em Manutenção</p>
                  <p className="text-sm text-muted-foreground mt-1">{maintenanceMessage}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Moderation Settings */}
        <TabsContent value="moderation">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Configurações de Moderação
              </CardTitle>
              <CardDescription>
                Controle como o conteúdo é moderado
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Habilitar Registro</Label>
                  <p className="text-sm text-muted-foreground">
                    Permitir que novos usuários se registrem
                  </p>
                </div>
                <Switch
                  checked={settings.enableRegistration}
                  onCheckedChange={(checked) => setSettings(prev => ({ ...prev, enableRegistration: checked }))}
                />
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Verificação de Email</Label>
                  <p className="text-sm text-muted-foreground">
                    Exigir verificação de email para novos usuários
                  </p>
                </div>
                <Switch
                  checked={settings.requireEmailVerification}
                  onCheckedChange={(checked) => setSettings(prev => ({ ...prev, requireEmailVerification: checked }))}
                />
              </div>
              <div className="space-y-2">
                <Label>Modo de Moderação</Label>
                <Select 
                  value={settings.moderationMode} 
                  onValueChange={(value) => setSettings(prev => ({ ...prev, moderationMode: value }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">Sem moderação prévia</SelectItem>
                    <SelectItem value="post">Moderar após publicação</SelectItem>
                    <SelectItem value="pre">Aprovar antes de publicar</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-sm text-muted-foreground">
                  Define quando o conteúdo é revisado pelos moderadores
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Notification Settings */}
        <TabsContent value="notifications">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="h-5 w-5" />
                Configurações de Notificações
              </CardTitle>
              <CardDescription>
                Gerencie como as notificações são enviadas
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Notificações no App</Label>
                  <p className="text-sm text-muted-foreground">
                    Habilitar notificações dentro da plataforma
                  </p>
                </div>
                <Switch
                  checked={settings.enableNotifications}
                  onCheckedChange={(checked) => setSettings(prev => ({ ...prev, enableNotifications: checked }))}
                />
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Notificações por Email</Label>
                  <p className="text-sm text-muted-foreground">
                    Enviar notificações por email
                  </p>
                </div>
                <Switch
                  checked={settings.enableEmailNotifications}
                  onCheckedChange={(checked) => setSettings(prev => ({ ...prev, enableEmailNotifications: checked }))}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Appearance Settings */}
        <TabsContent value="appearance">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Palette className="h-5 w-5" />
                Aparência
              </CardTitle>
              <CardDescription>
                Personalize a aparência da plataforma
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="primaryColor">Cor Primária</Label>
                <div className="flex gap-2">
                  <Input
                    id="primaryColor"
                    type="color"
                    value={settings.primaryColor}
                    onChange={(e) => setSettings(prev => ({ ...prev, primaryColor: e.target.value }))}
                    className="w-16 h-10 p-1"
                  />
                  <Input
                    value={settings.primaryColor}
                    onChange={(e) => setSettings(prev => ({ ...prev, primaryColor: e.target.value }))}
                    className="flex-1"
                  />
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Modo Escuro por Padrão</Label>
                  <p className="text-sm text-muted-foreground">
                    Usar tema escuro como padrão para novos usuários
                  </p>
                </div>
                <Switch
                  checked={settings.darkModeDefault}
                  onCheckedChange={(checked) => setSettings(prev => ({ ...prev, darkModeDefault: checked }))}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
