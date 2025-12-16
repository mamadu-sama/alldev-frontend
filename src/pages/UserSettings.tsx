import { useNavigate } from "react-router-dom";
import { ArrowLeft, User, Bell, Music, ArrowRight, Route } from "lucide-react";
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
import onboardingService from "@/services/onboarding.service";
import { useToast } from "@/hooks/use-toast";

export default function UserSettings() {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuthStore();
  const { toast } = useToast();

  if (!isAuthenticated || !user) {
    navigate("/login");
    return null;
  }

  const handleRestartTour = async () => {
    try {
      await onboardingService.resetOnboarding();
      toast({
        title: "Tour reiniciado!",
        description: "O tour guiado será exibido em alguns instantes.",
      });
      // Recarrega a página para iniciar o tour
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    } catch (error) {
      toast({
        title: "Erro",
        description: "Não foi possível reiniciar o tour. Tente novamente.",
        variant: "destructive",
      });
    }
  };

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

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Route className="h-5 w-5" />
                Tour Guiado
              </CardTitle>
              <CardDescription>
                Reveja o tour de introdução à plataforma
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                Quer conhecer novamente as funcionalidades da plataforma? Clique
                no botão abaixo para reiniciar o tour guiado interativo.
              </p>
              <Button onClick={handleRestartTour} variant="outline">
                <Route className="mr-2 h-4 w-4" />
                Reiniciar Tour Guiado
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Notifications Tab */}
        <TabsContent value="notifications" className="space-y-4 mt-6">
          <NotificationSoundSettings />

          <Card className="bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Music className="h-5 w-5 text-primary" />
                Sons Personalizados por Tipo
              </CardTitle>
              <CardDescription>
                Configure sons diferentes para cada tipo de notificação
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-3">
              <p className="text-sm text-muted-foreground">
                Escolha sons específicos para comentários, respostas, votos e
                mais!
              </p>
              <Button
                onClick={() => navigate("/settings/sounds")}
                className="w-full group"
                variant="gradient"
              >
                <Music className="mr-2 h-4 w-4" />
                Configurar Sons de Notificação
                <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Preferências de Notificação</CardTitle>
              <CardDescription>
                Configure quando você deseja receber notificações
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                As notificações são atualizadas automaticamente a cada 5
                segundos quando você está conectado para fornecer uma
                experiência em tempo real.
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
