import { useState } from "react";
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
  const { logout } = useAuthStore();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const [formData, setFormData] = useState({
    password: "",
    confirmation: "",
  });

  const [errors, setErrors] = useState({
    password: "",
    confirmation: "",
  });

  const handleDelete = async () => {
    // Reset errors
    setErrors({
      password: "",
      confirmation: "",
    });

    // Validate
    let hasError = false;
    const newErrors = { ...errors };

    if (!formData.password) {
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
      await userService.deleteAccount(formData);

      toast({
        title: "Conta desativada",
        description: "Sua conta foi desativada com sucesso. Até logo!",
      });

      // Logout e redirecionar após 2 segundos
      setTimeout(() => {
        logout();
        navigate("/");
      }, 2000);
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.error?.message ||
        "Erro ao desativar conta. Tente novamente.";

      toast({
        title: "Erro",
        description: errorMessage,
        variant: "destructive",
      });
      setIsLoading(false);
    }
  };

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
                <AlertDialogDescription className="space-y-4">
                  <p>
                    Esta ação desativará sua conta permanentemente. Você não
                    poderá mais fazer login até que um administrador reative sua
                    conta.
                  </p>

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
                          setFormData({ ...formData, password: e.target.value })
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
                  </div>
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel
                  onClick={() => {
                    setFormData({ password: "", confirmation: "" });
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
                  disabled={isLoading}
                  className="bg-destructive hover:bg-destructive/90"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Desativando...
                    </>
                  ) : (
                    <>
                      <Trash2 className="mr-2 h-4 w-4" />
                      Sim, desativar conta
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
