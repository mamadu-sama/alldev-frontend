import { useEffect, useState } from "react";
import axios from "axios";
import { AlertTriangle, Loader2, Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { useAuthStore } from "@/stores/authStore";
import { userService } from "@/services/user.service";

export function DeleteAccountCard() {
  const { toast } = useToast();
  const { logout, user } = useAuthStore(); // Adicionar user do store
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [codeSent, setCodeSent] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);
  const resendRef = useState<number | null>(null);

  const [formData, setFormData] = useState({
    password: "",
    confirmation: "",
    token: "",
  });

  const [errors, setErrors] = useState({
    password: "",
    confirmation: "",
  });

  // Verificar se é usuário OAuth
  const isOAuthUser = user?.provider && user.provider !== "local";

  const handleDelete = async () => {
    // Reset errors
    setErrors({
      password: "",
      confirmation: "",
    });

    // Validate
    let hasError = false;
    const newErrors = { ...errors };

    // Só validar senha se NÃO for usuário OAuth
    if (!isOAuthUser && !formData.password) {
      newErrors.password = "Senha é obrigatória";
      hasError = true;
    }

    if (formData.confirmation !== "DELETE") {
      newErrors.confirmation = 'Digite "DELETE" para confirmar';
      hasError = true;
    }

    if (hasError) {
      setErrors(newErrors);
      return;
    }

    setIsLoading(true);

    try {
      // Se for OAuth, usar fluxo com código por email
      if (isOAuthUser && !formData.token) {
        await userService.requestAccountDeletion();
        setCodeSent(true);
        setResendCooldown(60);
        toast({
          title: "Código enviado",
          description:
            "Enviamos um código de confirmação para o seu email. Insira-o no campo 'código' e digite DELETE para confirmar.",
        });
        setIsLoading(false);
        return;
      }

      // Montar payload
      const dataToSend = isOAuthUser
        ? { confirmation: formData.confirmation, token: formData.token }
        : { confirmation: formData.confirmation, password: formData.password };

      await userService.deleteAccount(dataToSend);

      toast({
        title: "Conta desativada",
        description: "Sua conta foi desativada com sucesso. Até logo!",
      });

      // Logout e redirecionar após 2 segundos
      setTimeout(() => {
        logout();
        navigate("/");
      }, 2000);
    } catch (error: unknown) {
      let errorMessage = "Erro ao desativar conta. Tente novamente.";

      if (axios.isAxiosError(error)) {
        const data = error.response?.data as
          | { error?: { message?: string } }
          | undefined;
        errorMessage = data?.error?.message || error.message || errorMessage;
      } else if (error instanceof Error) {
        errorMessage = error.message;
      } else if (typeof error === "string") {
        errorMessage = error;
      }

      toast({
        title: "Erro",
        description: errorMessage,
        variant: "destructive",
      });
      setIsLoading(false);
    }
  };

  const canConfirm =
    formData.confirmation === "DELETE" &&
    (isOAuthUser
      ? !codeSent || formData.token.trim().length > 0
      : formData.password.trim().length > 0);

  const resendCode = async () => {
    if (resendCooldown > 0) return;
    try {
      setIsLoading(true);
      await userService.requestAccountDeletion();
      setCodeSent(true);
      setResendCooldown(60);
      toast({
        title: "Código reenviado",
        description: "Verifique seu e-mail.",
      });
    } catch (err) {
      toast({
        title: "Erro",
        description: "Não foi possível reenviar o código.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    let timer: number | undefined;
    if (resendCooldown > 0) {
      timer = window.setInterval(() => {
        setResendCooldown((c) => {
          if (c <= 1) {
            window.clearInterval(timer);
            return 0;
          }
          return c - 1;
        });
      }, 1000) as unknown as number;
    }

    return () => {
      if (timer) window.clearInterval(timer);
    };
  }, [resendCooldown]);

  return (
    <Card className="border-destructive/50">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-destructive">
          <AlertTriangle className="h-5 w-5" />
          Zona Perigosa
        </CardTitle>
        <CardDescription>
          Ações irreversíveis relacionadas à sua conta
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="rounded-lg border border-destructive/20 bg-destructive/5 p-4">
          <h4 className="font-semibold text-destructive mb-2">
            Desativar Conta
          </h4>
          <p className="text-sm text-muted-foreground mb-4">
            Ao desativar sua conta, você não poderá mais acessá-la. Seus dados
            serão preservados, mas você não poderá fazer login até que um
            administrador reative sua conta.
          </p>

          {/* Mostrar aviso se for OAuth */}
          {isOAuthUser && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4">
              <p className="text-sm text-blue-800">
                <strong>Login via {user?.provider}</strong>
                <br />
                Como você faz login via {user?.provider}, não é necessário
                digitar senha para desativar a conta.
              </p>
            </div>
          )}

          <AlertDialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <AlertDialogTrigger asChild>
              <Button variant="destructive" size="sm">
                <Trash2 className="mr-2 h-4 w-4" />
                Desativar Minha Conta
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle className="flex items-center gap-2 text-destructive">
                  <AlertTriangle className="h-5 w-5" />
                  Tem certeza absoluta?
                </AlertDialogTitle>
                <AlertDialogDescription className="text-sm text-muted-foreground">
                  Esta ação desativará sua conta permanentemente. Você não
                  poderá mais fazer login até que um administrador reative sua
                  conta.
                </AlertDialogDescription>
                <div className="space-y-4">
                  <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4">
                    <p className="font-semibold text-destructive mb-2">
                      Consequências:
                    </p>
                    <ul className="list-disc list-inside space-y-1 text-sm">
                      <li>Você será desconectado imediatamente</li>
                      <li>Não poderá fazer login novamente</li>
                      <li>Seus posts e comentários permanecerão visíveis</li>
                      <li>Seus dados serão preservados (soft delete)</li>
                    </ul>
                  </div>

                  <div className="space-y-3 pt-4">
                    {/* Só mostrar campo de senha se NÃO for OAuth */}
                    {!isOAuthUser && (
                      <div className="space-y-2">
                        <Label htmlFor="password">
                          Digite sua senha para confirmar
                        </Label>
                        <Input
                          id="password"
                          type="password"
                          placeholder="Sua senha"
                          value={formData.password}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              password: e.target.value,
                            })
                          }
                          className={errors.password ? "border-red-500" : ""}
                          disabled={isLoading}
                        />
                        {errors.password && (
                          <p className="text-sm text-red-500">
                            {errors.password}
                          </p>
                        )}
                      </div>
                    )}

                    <div className="space-y-2">
                      <Label htmlFor="confirmation">
                        Digite{" "}
                        <span className="font-mono font-bold">DELETE</span> para
                        confirmar
                      </Label>
                      <Input
                        id="confirmation"
                        type="text"
                        placeholder="DELETE"
                        value={formData.confirmation}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            confirmation: e.target.value,
                          })
                        }
                        className={errors.confirmation ? "border-red-500" : ""}
                        disabled={isLoading}
                      />
                      {errors.confirmation && (
                        <p className="text-sm text-red-500">
                          {errors.confirmation}
                        </p>
                      )}
                    </div>

                    {/* Campo de código para usuários OAuth */}
                    {isOAuthUser && (
                      <div className="space-y-2">
                        {codeSent ? (
                          <div className="flex items-start justify-between gap-4">
                            <div>
                              <Label>Enviamos um código para seu email</Label>
                              <p className="text-sm text-muted-foreground">
                                Cole o código abaixo e digite{" "}
                                <span className="font-mono font-bold">
                                  DELETE
                                </span>{" "}
                                para confirmar. Código válido por 1 hora.
                              </p>
                            </div>
                            <div className="text-right">
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={resendCode}
                                disabled={resendCooldown > 0 || isLoading}
                              >
                                {resendCooldown > 0
                                  ? `Reenviar em ${resendCooldown}s`
                                  : "Reenviar código"}
                              </Button>
                            </div>
                          </div>
                        ) : (
                          <p className="text-sm text-muted-foreground">
                            Ao confirmar, enviaremos um código por email para
                            confirmar a exclusão.
                          </p>
                        )}

                        <Input
                          id="token"
                          type="text"
                          placeholder="Código de confirmação"
                          value={formData.token}
                          onChange={(e) =>
                            setFormData({ ...formData, token: e.target.value })
                          }
                          disabled={isLoading}
                        />
                      </div>
                    )}
                  </div>
                </div>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel
                  onClick={() => {
                    setFormData({ password: "", confirmation: "", token: "" });
                    setErrors({ password: "", confirmation: "" });
                  }}
                  disabled={isLoading}
                >
                  Cancelar
                </AlertDialogCancel>
                <AlertDialogAction
                  onClick={(e) => {
                    e.preventDefault();
                    handleDelete();
                  }}
                  disabled={isLoading || !canConfirm}
                  className="bg-destructive hover:bg-destructive/90"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Desativando...
                    </>
                  ) : (
                    <>
                      {isOAuthUser && !codeSent ? (
                        "Enviar Código de Confirmação"
                      ) : (
                        <>
                          <Trash2 className="mr-2 h-4 w-4" />
                          Sim, desativar conta
                        </>
                      )}
                    </>
                  )}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </CardContent>
    </Card>
  );
}
