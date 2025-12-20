import { useState, useEffect, useCallback } from "react";
import {
  Save,
  Globe,
  Bell,
  Shield,
  Palette,
  Database,
  Wrench,
  AlertTriangle,
  Loader2,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { adminService } from "@/services/admin.service";
import { useToast } from "@/hooks/use-toast";
import { useMaintenanceStore } from "@/stores/maintenanceStore";

type Maintenance = {
  isEnabled: boolean;
  message: string | null;
  endTime: string | null;
};

type Settings = {
  siteName?: string;
  siteUrl?: string;
  siteDescription?: string;
  contactEmail?: string;
  maxTagsPerPost?: number;
  minReputationToPost?: number;
  minReputationToComment?: number;
  enableRegistration?: boolean;
  requireEmailVerification?: boolean;
  moderationMode?: "none" | "post" | "pre";
  enableNotifications?: boolean;
  enableEmailNotifications?: boolean;
  primaryColor?: string;
  darkModeDefault?: boolean;
  [key: string]: unknown;
};

export default function AdminSettings() {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [settings, setSettings] = useState<Settings>({});
  const [maintenance, setMaintenance] = useState<Maintenance>({
    isEnabled: false,
    message: null,
    endTime: null,
  });
  const { setMaintenance: setGlobalMaintenance } = useMaintenanceStore();

  const loadData = useCallback(async () => {
    try {
      setIsLoading(true);
      const [settingsData, maintenanceData] = await Promise.all([
        adminService.getSettings(),
        adminService.getMaintenanceMode(),
      ]);
      setSettings(settingsData);
      setMaintenance(maintenanceData);
      // Atualizar o store global de manutenção
      setGlobalMaintenance(
        maintenanceData.isEnabled,
        maintenanceData.message,
        maintenanceData.endTime
      );
    } catch (error) {
      toast({
        title: "Erro ao carregar configurações",
        description: "Não foi possível carregar as configurações.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }, [toast, setGlobalMaintenance]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await adminService.updateSettings(settings);
      toast({
        title: "Configurações salvas!",
        description: "As configurações foram atualizadas com sucesso.",
      });
    } catch (error) {
      const errorMessage =
        error instanceof Error && "response" in error
          ? (
              error as {
                response?: { data?: { error?: { message?: string } } };
              }
            ).response?.data?.error?.message
          : "Não foi possível salvar as configurações.";
      toast({
        title: "Erro ao salvar",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleToggleMaintenance = async () => {
    try {
      const newStatus = !maintenance.isEnabled;
      // If enabling maintenance and existing endTime is in the past, clear it
      const endTimeToSend = newStatus
        ? maintenance.endTime && new Date(maintenance.endTime) > new Date()
          ? maintenance.endTime
          : null
        : maintenance.endTime;

      const updatedMaintenance = {
        isEnabled: newStatus,
        message: maintenance.message,
        endTime: endTimeToSend,
      };

      await adminService.updateMaintenanceMode(updatedMaintenance);
      setMaintenance((prev: Maintenance) => ({
        ...prev,
        isEnabled: newStatus,
        endTime: endTimeToSend,
      }));

      // Atualizar o store global
      setGlobalMaintenance(newStatus, maintenance.message, endTimeToSend);

      toast({
        title: newStatus
          ? "Modo de manutenção ativado!"
          : "Modo de manutenção desativado!",
        description: newStatus
          ? "Os usuários agora verão a página de manutenção."
          : "Os usuários podem acessar o sistema normalmente.",
      });
    } catch (error) {
      toast({
        title: "Erro",
        description: "Não foi possível alterar o modo de manutenção.",
        variant: "destructive",
      });
    }
  };

  const handleSaveMaintenance = async () => {
    try {
      // If enabling and endTime is in the past, clear it before sending
      const payload = {
        isEnabled: maintenance.isEnabled,
        message: maintenance.message,
        endTime:
          maintenance.isEnabled &&
          maintenance.endTime &&
          new Date(maintenance.endTime) <= new Date()
            ? null
            : maintenance.endTime,
      };

      await adminService.updateMaintenanceMode(payload);

      // Atualizar o store global
      setGlobalMaintenance(payload.isEnabled, payload.message, payload.endTime);

      toast({
        title: "Configurações salvas!",
        description: "As configurações de manutenção foram atualizadas.",
      });

      // Recarregar dados para garantir sincronização
      await loadData();
    } catch (error) {
      toast({
        title: "Erro",
        description: "Não foi possível salvar as configurações de manutenção.",
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Configurações</h1>
          <p className="text-muted-foreground">
            Gerencie as configurações da plataforma
          </p>
        </div>
        <Button onClick={handleSave} disabled={isSaving}>
          {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {!isSaving && <Save className="mr-2 h-4 w-4" />}
          Salvar Alterações
        </Button>
      </div>

      {/* Maintenance Mode Alert */}
      {maintenance.isEnabled && (
        <div className="rounded-lg border border-warning bg-warning/10 p-4 flex items-center gap-3">
          <AlertTriangle className="h-5 w-5 text-warning" />
          <div className="flex-1">
            <p className="font-medium text-warning">Modo de Manutenção Ativo</p>
            <p className="text-sm text-muted-foreground">
              Os usuários estão vendo a página de manutenção. Apenas admins
              podem acessar o sistema.
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
                      value={settings.siteName || ""}
                      onChange={(e) =>
                        setSettings((prev: Settings) => ({
                          ...prev,
                          siteName: e.target.value,
                        }))
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="siteUrl">URL do Site</Label>
                    <Input
                      id="siteUrl"
                      value={settings.siteUrl || ""}
                      onChange={(e) =>
                        setSettings((prev: Settings) => ({
                          ...prev,
                          siteUrl: e.target.value,
                        }))
                      }
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="siteDescription">Descrição</Label>
                  <Textarea
                    id="siteDescription"
                    value={settings.siteDescription || ""}
                    onChange={(e) =>
                      setSettings((prev: Settings) => ({
                        ...prev,
                        siteDescription: e.target.value,
                      }))
                    }
                    rows={3}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="contactEmail">Email de Contato</Label>
                  <Input
                    id="contactEmail"
                    type="email"
                    value={settings.contactEmail || ""}
                    onChange={(e) =>
                      setSettings((prev: Settings) => ({
                        ...prev,
                        contactEmail: e.target.value,
                      }))
                    }
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
                      value={settings.maxTagsPerPost || 5}
                      onChange={(e) =>
                        setSettings((prev: Settings) => ({
                          ...prev,
                          maxTagsPerPost: parseInt(e.target.value),
                        }))
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="minRepPost">Rep. Mínima para Postar</Label>
                    <Input
                      id="minRepPost"
                      type="number"
                      value={settings.minReputationToPost || 0}
                      onChange={(e) =>
                        setSettings((prev: Settings) => ({
                          ...prev,
                          minReputationToPost: parseInt(e.target.value),
                        }))
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="minRepComment">
                      Rep. Mínima para Comentar
                    </Label>
                    <Input
                      id="minRepComment"
                      type="number"
                      value={settings.minReputationToComment || 0}
                      onChange={(e) =>
                        setSettings((prev: Settings) => ({
                          ...prev,
                          minReputationToComment: parseInt(e.target.value),
                        }))
                      }
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
                {maintenance.isEnabled && (
                  <Badge variant="warning" className="ml-2">
                    Ativo
                  </Badge>
                )}
              </CardTitle>
              <CardDescription>
                Ative o modo de manutenção para bloquear o acesso dos usuários
                temporariamente
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
                  checked={maintenance.isEnabled || false}
                  onCheckedChange={handleToggleMaintenance}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="maintenanceMessage">
                  Mensagem de Manutenção
                </Label>
                <Textarea
                  id="maintenanceMessage"
                  value={maintenance.message || ""}
                  onChange={(e) =>
                    setMaintenance((prev: Maintenance) => ({
                      ...prev,
                      message: e.target.value,
                    }))
                  }
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
                  value={
                    maintenance.endTime
                      ? new Date(maintenance.endTime).toISOString().slice(0, 16)
                      : ""
                  }
                  onChange={(e) =>
                    setMaintenance((prev: Maintenance) => ({
                      ...prev,
                      endTime: e.target.value
                        ? new Date(e.target.value).toISOString()
                        : null,
                    }))
                  }
                />
                <p className="text-sm text-muted-foreground">
                  Informe quando a manutenção deve terminar (opcional)
                </p>
              </div>

              <Button onClick={handleSaveMaintenance} className="w-full">
                <Save className="mr-2 h-4 w-4" />
                Salvar Configurações de Manutenção
              </Button>

              <div className="rounded-lg border border-border p-4 bg-muted/50">
                <h4 className="font-medium mb-2">
                  Preview da Página de Manutenção
                </h4>
                <div className="rounded-lg border border-border bg-background p-4 text-center">
                  <Wrench className="h-8 w-8 mx-auto text-primary mb-2" />
                  <p className="font-medium">Em Manutenção</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    {maintenance.message ||
                      "Estamos em manutenção. Voltaremos em breve!"}
                  </p>
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
                  checked={settings.enableRegistration ?? true}
                  onCheckedChange={(checked) =>
                    setSettings((prev: Settings) => ({
                      ...prev,
                      enableRegistration: checked,
                    }))
                  }
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
                  checked={settings.requireEmailVerification ?? true}
                  onCheckedChange={(checked) =>
                    setSettings((prev: Settings) => ({
                      ...prev,
                      requireEmailVerification: checked,
                    }))
                  }
                />
              </div>
              <div className="space-y-2">
                <Label>Modo de Moderação</Label>
                <Select
                  value={settings.moderationMode || "post"}
                  onValueChange={(value) =>
                    setSettings((prev: Settings) => ({
                      ...prev,
                      moderationMode: value as Settings["moderationMode"],
                    }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">Sem moderação prévia</SelectItem>
                    <SelectItem value="post">
                      Moderar após publicação
                    </SelectItem>
                    <SelectItem value="pre">
                      Aprovar antes de publicar
                    </SelectItem>
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
                  checked={settings.enableNotifications ?? true}
                  onCheckedChange={(checked) =>
                    setSettings((prev: Settings) => ({
                      ...prev,
                      enableNotifications: checked,
                    }))
                  }
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
                  checked={settings.enableEmailNotifications ?? true}
                  onCheckedChange={(checked) =>
                    setSettings((prev: Settings) => ({
                      ...prev,
                      enableEmailNotifications: checked,
                    }))
                  }
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
                    value={settings.primaryColor || "#3b82f6"}
                    onChange={(e) =>
                      setSettings((prev: Settings) => ({
                        ...prev,
                        primaryColor: e.target.value,
                      }))
                    }
                    className="w-16 h-10 p-1"
                  />
                  <Input
                    value={settings.primaryColor || "#3b82f6"}
                    onChange={(e) =>
                      setSettings((prev: Settings) => ({
                        ...prev,
                        primaryColor: e.target.value,
                      }))
                    }
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
                  checked={settings.darkModeDefault ?? true}
                  onCheckedChange={(checked) =>
                    setSettings((prev: Settings) => ({
                      ...prev,
                      darkModeDefault: checked,
                    }))
                  }
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
