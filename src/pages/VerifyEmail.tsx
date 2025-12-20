import { useEffect, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { Loader2, CheckCircle, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { authService } from "@/services/auth.service";

export default function VerifyEmail() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState<"loading" | "success" | "error">(
    "loading"
  );
  const [message, setMessage] = useState("");
  const token = searchParams.get("token");

  useEffect(() => {
    const verifyEmail = async () => {
      if (!token) {
        setStatus("error");
        setMessage("Token de verificação inválido ou ausente.");
        return;
      }

      try {
        const response = await authService.verifyEmail(token);

        if (response.success) {
          setStatus("success");
          setMessage(response.data?.message || "Email verificado com sucesso!");

          // Redirect to login after 3 seconds
          setTimeout(() => {
            navigate("/login");
          }, 3000);
        }
      } catch (error: unknown) {
        setStatus("error");
        const defaultMsg = "Erro ao verificar email. O link pode ter expirado.";

        type ErrorWithResponse = {
          response?: {
            data?: {
              error?: {
                message?: string;
              };
            };
          };
        };

        const err = error as ErrorWithResponse;
        setMessage(err.response?.data?.error?.message ?? defaultMsg);
      }
    };

    verifyEmail();
  }, [token, navigate]);

  if (status === "loading") {
    return (
      <Card className="w-full max-w-md animate-scale-in">
        <CardHeader className="space-y-1 text-center">
          <CardTitle className="text-2xl font-bold">
            Verificando email
          </CardTitle>
          <CardDescription>
            Aguarde enquanto verificamos seu email...
          </CardDescription>
        </CardHeader>
        <CardContent className="flex justify-center py-8">
          <Loader2 className="h-12 w-12 animate-spin text-primary" />
        </CardContent>
      </Card>
    );
  }

  if (status === "success") {
    return (
      <Card className="w-full max-w-md animate-scale-in">
        <CardHeader className="space-y-1 text-center">
          <div className="mx-auto w-12 h-12 bg-success/10 rounded-full flex items-center justify-center mb-4">
            <CheckCircle className="h-6 w-6 text-success" />
          </div>
          <CardTitle className="text-2xl font-bold">
            Email verificado!
          </CardTitle>
          <CardDescription>{message}</CardDescription>
        </CardHeader>
        <CardContent className="text-center">
          <p className="text-sm text-muted-foreground">
            Você será redirecionado para a página de login em instantes...
          </p>
        </CardContent>
        <CardFooter>
          <Button variant="gradient" className="w-full" asChild>
            <Link to="/login">Ir para o login</Link>
          </Button>
        </CardFooter>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-md animate-scale-in">
      <CardHeader className="space-y-1 text-center">
        <div className="mx-auto w-12 h-12 bg-destructive/10 rounded-full flex items-center justify-center mb-4">
          <XCircle className="h-6 w-6 text-destructive" />
        </div>
        <CardTitle className="text-2xl font-bold text-destructive">
          Erro na verificação
        </CardTitle>
        <CardDescription>{message}</CardDescription>
      </CardHeader>
      <CardContent className="text-center">
        <p className="text-sm text-muted-foreground mb-4">
          O link de verificação pode ter expirado ou já foi usado.
        </p>
      </CardContent>
      <CardFooter className="flex flex-col gap-2">
        <Button variant="gradient" className="w-full" asChild>
          <Link to="/register">Criar nova conta</Link>
        </Button>
        <Button variant="outline" className="w-full" asChild>
          <Link to="/login">Voltar para o login</Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
