import { useNavigate } from "react-router-dom";
import { ArrowLeft, User, Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { NotificationSoundSettings } from "@/components/settings/NotificationSoundSettings";
import { useAuthStore } from "@/stores/authStore";

export default function UserSettings() {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuthStore();

  if (!isAuthenticated || !user) {
    navigate("/login");
    return null;
  }

  return (
    <div className="container max-w-5xl py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Configurações</h1>
          <p className="text-muted-foreground">
            Gerencie suas preferências e configurações
          </p>
        </div>
        <Button variant="outline" onClick={() => navigate(-1)}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Voltar
        </Button>
      </div>

      {/* Settings Tabs */}
      <Tabs defaultValue="notifications" className="w-full">
        <TabsList className="grid w-full max-w-md grid-cols-2">
          <TabsTrigger value="profile" className="flex items-center gap-2">
            <User className="h-4 w-4" />
            Perfil
          </TabsTrigger>
          <TabsTrigger
            value="notifications"
            className="flex items-center gap-2"
          >
            <Bell className="h-4 w-4" />
            Notificações
          </TabsTrigger>
        </TabsList>

        {/* Profile Tab */}
        <TabsContent value="profile" className="space-y-4 mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Informações do Perfil</CardTitle>
              <CardDescription>
                Configure suas informações pessoais
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col items-center gap-4">
                <p className="text-sm text-muted-foreground">
                  Para editar seu perfil completo, visite a{" "}
                  <Button
                    variant="link"
                    className="p-0 h-auto font-medium"
                    onClick={() => navigate("/profile/edit")}
                  >
                    página de edição de perfil
                  </Button>
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Notifications Tab */}
        <TabsContent value="notifications" className="space-y-4 mt-6">
          <NotificationSoundSettings />

          <Card>
            <CardHeader>
              <CardTitle>Preferências de Notificação</CardTitle>
              <CardDescription>
                Configure quando você deseja receber notificações
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                As notificações são atualizadas automaticamente a cada 30
                segundos quando você está conectado.
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
