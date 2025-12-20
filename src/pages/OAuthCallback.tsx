import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { useAuthStore } from "@/stores/authStore";
import { useToast } from "@/hooks/use-toast";

export default function OAuthCallback() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { login } = useAuthStore();
  const { toast } = useToast();

  useEffect(() => {
    const processOAuthCallback = async () => {
      try {
        // Extrair parâmetros da URL
        const token = searchParams.get("token");
        const refreshToken = searchParams.get("refreshToken");
        const userId = searchParams.get("userId");
        const username = searchParams.get("username");
        const email = searchParams.get("email");
        const rolesParam = searchParams.get("roles");
        const hasCompletedOnboarding =
          searchParams.get("hasCompletedOnboarding") === "true";
        const error = searchParams.get("error");

        // Verificar se há erro
        if (error) {
          let errorMessage = "Erro ao autenticar com Google";

          if (error === "authentication_failed") {
            errorMessage = "Falha na autenticação. Tente novamente.";
          } else if (error === "server_error") {
            errorMessage = "Erro no servidor. Tente novamente mais tarde.";
          }

          toast({
            title: "Erro na autenticação",
            description: errorMessage,
            variant: "destructive",
          });

          navigate("/login");
          return;
        }

        // Verificar se todos os parâmetros necessários estão presentes
        if (!token || !refreshToken || !userId || !username || !email) {
          toast({
            title: "Erro na autenticação",
            description: "Dados de autenticação incompletos",
            variant: "destructive",
          });

          navigate("/login");
          return;
        }

        // Processar roles
        const roles: string[] = rolesParam ? rolesParam.split(",") : ["USER"];

        // Extrair provider, se foi enviado pelo backend
        const provider = searchParams.get("provider") || null;

        // Criar objeto de usuário
        const user = {
          id: userId,
          username,
          email,
          roles,
          hasCompletedOnboarding,
          provider,
        };

        // Salvar tokens
        login(user, token);
        localStorage.setItem("refreshToken", refreshToken);

        toast({
          title: "Login realizado com sucesso!",
          description: `Bem-vindo, ${username}!`,
        });

        // Redirecionar para a raiz — o `OnboardingTour` no `MainLayout` irá
        // verificar o status do onboarding e exibir o tour como overlay sobre
        // o feed quando apropriado.
        navigate("/");
      } catch (error) {
        console.error("Erro ao processar callback OAuth:", error);

        toast({
          title: "Erro na autenticação",
          description: "Ocorreu um erro inesperado. Tente novamente.",
          variant: "destructive",
        });

        navigate("/login");
      }
    };

    processOAuthCallback();
  }, [searchParams, navigate, login, toast]);

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="text-center">
        <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto mb-4" />
        <h2 className="text-xl font-semibold mb-2">Autenticando...</h2>
        <p className="text-muted-foreground">
          Aguarde enquanto processamos seu login
        </p>
      </div>
    </div>
  );
}
