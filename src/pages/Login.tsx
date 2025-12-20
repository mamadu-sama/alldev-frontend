import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Loader2, Mail, Lock, Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { useAuthStore } from "@/stores/authStore";
import { authService, type LoginData } from "@/services/auth.service";

const loginSchema = z.object({
  email: z.string().email("Email inválido"),
  password: z.string().min(6, "Senha deve ter no mínimo 6 caracteres"),
});

type LoginFormData = z.infer<typeof loginSchema>;

export default function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();
  const { login } = useAuthStore();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginData) => {
    setIsLoading(true);

    try {
      const response = await authService.login(data);

      // Store tokens
      const userWithLevel = {
        ...response.user,
        level: response.user.level as
          | "Novato"
          | "Contribuidor"
          | "Expert"
          | "Guru",
      };
      login(userWithLevel, response.accessToken);
      localStorage.setItem("refreshToken", response.refreshToken);

      toast({
        title: "Login realizado com sucesso!",
        description: `Bem-vindo de volta, ${response.user.username}!`,
      });

      navigate("/");
    } catch (error: unknown) {
      const getErrorMessage = (err: unknown): string | undefined => {
        if (!err) return undefined;
        if (err instanceof Error) return err.message;
        if (typeof err === "object" && err !== null && "response" in err) {
          // Narrow to any only locally to access nested response safely
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const anyErr = err as any;
          return anyErr.response?.data?.error?.message;
        }
        return undefined;
      };

      toast({
        title: "Erro ao fazer login",
        description:
          getErrorMessage(error) ||
          "Verifique suas credenciais e tente novamente.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    // Redirecionar para o endpoint OAuth do backend
    const backendUrl = import.meta.env.VITE_API_URL || "http://localhost:5000";
    window.location.href = `${backendUrl}/oauth/google`;
  };

  const handleGitHubLogin = () => {
    const backendUrl = import.meta.env.VITE_API_URL || "http://localhost:5000";
    window.location.href = `${backendUrl}/oauth/github`;
  };

  return (
    <Card className="w-full max-w-md animate-scale-in">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl font-bold text-center">Entrar</CardTitle>
        <CardDescription className="text-center">
          Entre com seu email e senha para acessar sua conta
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit(onSubmit)}>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                id="email"
                type="email"
                placeholder="seu@email.com"
                className="pl-10"
                {...register("email")}
              />
            </div>
            {errors.email && (
              <p className="text-sm text-destructive">{errors.email.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="password">Senha</Label>
              <Link
                to="/forgot-password"
                className="text-sm text-primary hover:underline"
              >
                Esqueceu a senha?
              </Link>
            </div>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                className="pl-10 pr-10"
                {...register("password")}
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4 text-muted-foreground" />
                ) : (
                  <Eye className="h-4 w-4 text-muted-foreground" />
                )}
              </Button>
            </div>
            {errors.password && (
              <p className="text-sm text-destructive">
                {errors.password.message}
              </p>
            )}
          </div>
        </CardContent>
        <CardFooter className="flex flex-col space-y-4">
          <Button
            type="submit"
            variant="gradient"
            className="w-full"
            disabled={isLoading}
          >
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Entrar
          </Button>

          <div className="relative w-full">
            <Separator className="my-4" />
            <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-card px-2 text-xs text-muted-foreground">
              OU
            </span>
          </div>

          <Button
            type="button"
            variant="outline"
            className="w-full"
            onClick={handleGoogleLogin}
            disabled={isLoading}
          >
            <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
              <path
                fill="currentColor"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="currentColor"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="currentColor"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              />
              <path
                fill="currentColor"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              />
            </svg>
            Continuar com Google
          </Button>

          <Button
            type="button"
            variant="outline"
            className="w-full mt-2"
            onClick={handleGitHubLogin}
            disabled={isLoading}
          >
            <svg
              className="mr-2 h-4 w-4"
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <path d="M12 .5C5.73.5.75 5.48.75 11.75c0 4.94 3.19 9.12 7.61 10.59.56.1.76-.24.76-.53 0-.26-.01-.95-.01-1.86-3.09.67-3.74-.75-3.98-1.44-.13-.36-.7-1.44-1.2-1.73-.41-.23-1-.8-.01-.82.93-.02 1.59.86 1.81 1.22 1.06 1.78 2.76 1.27 3.43.97.11-.76.41-1.27.75-1.56-2.77-.31-5.68-1.39-5.68-6.17 0-1.36.49-2.47 1.29-3.34-.13-.32-.56-1.61.12-3.36 0 0 1.04-.33 3.4 1.28a11.76 11.76 0 0 1 3.1-.42c1.05.01 2.11.14 3.1.42 2.36-1.61 3.4-1.28 3.4-1.28.68 1.75.25 3.04.12 3.36.8.87 1.29 1.98 1.29 3.34 0 4.79-2.91 5.85-5.69 6.16.42.36.8 1.08.8 2.18 0 1.58-.01 2.85-.01 3.24 0 .29.2.64.77.53C19.06 20.87 22.25 16.69 22.25 11.75 22.25 5.48 17.27.5 11 .5z" />
            </svg>
            Continuar com GitHub
          </Button>

          <p className="text-sm text-muted-foreground text-center">
            Não tem uma conta?{" "}
            <Link
              to="/register"
              className="text-primary hover:underline font-medium"
            >
              Cadastre-se
            </Link>
          </p>
        </CardFooter>
      </form>
    </Card>
  );
}
