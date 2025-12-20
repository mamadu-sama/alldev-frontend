import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Cookie, Loader2, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import api from "@/services/api";

export default function AdminCookiePolicy() {
  const queryClient = useQueryClient();
  const [formData, setFormData] = useState({
    introduction: "",
    whatAreCookiesDescription: "",
    similarTechnologies: "",
    whyWeUseCookies: "",
    essentialCookiesDescription: "",
    functionalCookiesDescription: "",
    analyticsCookiesDescription: "",
    marketingCookiesDescription: "",
    marketingNote: "",
    cookieDurationDescription: "",
    manageCookiesAlldev: "",
    manageCookiesBrowser: "",
    manageCookiesThirdParty: "",
    manageCookiesWarning: "",
    updatesDescription: "",
    contactEmail: "",
    contactPage: "",
  });

  // Buscar conteúdo atual
  const { data, isLoading } = useQuery({
    queryKey: ["cookiePolicy"],
    queryFn: async () => {
      const response = await api.get("/cookie-policy");
      return response.data.data;
    },
  });

  // Preencher formulário quando dados carregarem
  useEffect(() => {
    if (data) {
      setFormData({
        introduction: data.introduction || "",
        whatAreCookiesDescription: data.whatAreCookiesDescription || "",
        similarTechnologies: data.similarTechnologies || "",
        whyWeUseCookies: data.whyWeUseCookies || "",
        essentialCookiesDescription: data.essentialCookiesDescription || "",
        functionalCookiesDescription: data.functionalCookiesDescription || "",
        analyticsCookiesDescription: data.analyticsCookiesDescription || "",
        marketingCookiesDescription: data.marketingCookiesDescription || "",
        marketingNote: data.marketingNote || "",
        cookieDurationDescription: data.cookieDurationDescription || "",
        manageCookiesAlldev: data.manageCookiesAlldev || "",
        manageCookiesBrowser: data.manageCookiesBrowser || "",
        manageCookiesThirdParty: data.manageCookiesThirdParty || "",
        manageCookiesWarning: data.manageCookiesWarning || "",
        updatesDescription: data.updatesDescription || "",
        contactEmail: data.contactEmail || "",
        contactPage: data.contactPage || "",
      });
    }
  }, [data]);

  // Mutation para atualizar
  const updateMutation = useMutation({
    mutationFn: async (data: any) => {
      const response = await api.patch("/cookie-policy/admin", data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cookiePolicy"] });
      toast.success("Política de Cookies atualizada com sucesso!");
    },
    onError: (error: any) => {
      toast.error(
        error?.response?.data?.error?.message ||
          "Erro ao atualizar Política de Cookies"
      );
    },
  });

  // Mutation para seed
  const seedMutation = useMutation({
    mutationFn: async () => {
      const response = await api.post("/cookie-policy/admin/seed");
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cookiePolicy"] });
      toast.success("Conteúdo padrão criado com sucesso!");
    },
    onError: (error: any) => {
      toast.error(
        error?.response?.data?.error?.message || "Erro ao criar conteúdo padrão"
      );
    },
  });

  const handleSave = () => {
    updateMutation.mutate(formData);
  };

  const handleSeed = () => {
    if (confirm("Isso criará o conteúdo padrão. Continuar?")) {
      seedMutation.mutate();
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Cookie className="h-8 w-8" />
            Editar Política de Cookies
          </h1>
          <p className="text-muted-foreground mt-1">
            Gerencie o conteúdo da Política de Cookies
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            onClick={handleSeed}
            disabled={seedMutation.isPending}
            variant="outline"
          >
            {seedMutation.isPending && (
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            )}
            Criar Padrão
          </Button>
          <Button
            onClick={handleSave}
            disabled={updateMutation.isPending}
            className="gap-2"
          >
            {updateMutation.isPending ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Save className="h-4 w-4" />
            )}
            Salvar Alterações
          </Button>
        </div>
      </div>

      {/* Introduction */}
      <Card>
        <CardHeader>
          <CardTitle>Introdução</CardTitle>
          <CardDescription>
            Texto introdutório da Política de Cookies
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Textarea
            value={formData.introduction}
            onChange={(e) =>
              setFormData({ ...formData, introduction: e.target.value })
            }
            rows={4}
          />
        </CardContent>
      </Card>

      {/* Section 1: O Que São Cookies */}
      <Card>
        <CardHeader>
          <CardTitle>1. O Que São Cookies?</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label>Descrição</Label>
            <Textarea
              value={formData.whatAreCookiesDescription}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  whatAreCookiesDescription: e.target.value,
                })
              }
              rows={4}
              className="mt-2"
            />
          </div>

          <div>
            <Label>Tecnologias Similares</Label>
            <Textarea
              value={formData.similarTechnologies}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  similarTechnologies: e.target.value,
                })
              }
              rows={6}
              className="mt-2"
            />
          </div>
        </CardContent>
      </Card>

      {/* Section 2: Por Que Usamos Cookies */}
      <Card>
        <CardHeader>
          <CardTitle>2. Por Que Usamos Cookies?</CardTitle>
        </CardHeader>
        <CardContent>
          <Textarea
            value={formData.whyWeUseCookies}
            onChange={(e) =>
              setFormData({ ...formData, whyWeUseCookies: e.target.value })
            }
            rows={10}
          />
        </CardContent>
      </Card>

      {/* Section 3: Tipos de Cookies */}
      <Card>
        <CardHeader>
          <CardTitle>3. Tipos de Cookies que Utilizamos</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label>3.1. Cookies Essenciais</Label>
            <Textarea
              value={formData.essentialCookiesDescription}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  essentialCookiesDescription: e.target.value,
                })
              }
              rows={8}
              className="mt-2"
            />
          </div>

          <div>
            <Label>3.2. Cookies Funcionais</Label>
            <Textarea
              value={formData.functionalCookiesDescription}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  functionalCookiesDescription: e.target.value,
                })
              }
              rows={8}
              className="mt-2"
            />
          </div>

          <div>
            <Label>3.3. Cookies Analíticos</Label>
            <Textarea
              value={formData.analyticsCookiesDescription}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  analyticsCookiesDescription: e.target.value,
                })
              }
              rows={10}
              className="mt-2"
            />
          </div>

          <div>
            <Label>3.4. Cookies de Marketing</Label>
            <Textarea
              value={formData.marketingCookiesDescription}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  marketingCookiesDescription: e.target.value,
                })
              }
              rows={4}
              className="mt-2"
            />
          </div>

          <div>
            <Label>Nota sobre Marketing</Label>
            <Textarea
              value={formData.marketingNote}
              onChange={(e) =>
                setFormData({ ...formData, marketingNote: e.target.value })
              }
              rows={3}
              className="mt-2"
            />
          </div>
        </CardContent>
      </Card>

      {/* Section 4: Duração dos Cookies */}
      <Card>
        <CardHeader>
          <CardTitle>4. Duração dos Cookies</CardTitle>
        </CardHeader>
        <CardContent>
          <Textarea
            value={formData.cookieDurationDescription}
            onChange={(e) =>
              setFormData({
                ...formData,
                cookieDurationDescription: e.target.value,
              })
            }
            rows={8}
          />
        </CardContent>
      </Card>

      {/* Section 5: Como Gerenciar Cookies */}
      <Card>
        <CardHeader>
          <CardTitle>5. Como Gerenciar Cookies</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label>5.1. Através da Alldev</Label>
            <Textarea
              value={formData.manageCookiesAlldev}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  manageCookiesAlldev: e.target.value,
                })
              }
              rows={10}
              className="mt-2"
            />
          </div>

          <div>
            <Label>5.2. Configurações do Navegador</Label>
            <Textarea
              value={formData.manageCookiesBrowser}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  manageCookiesBrowser: e.target.value,
                })
              }
              rows={10}
              className="mt-2"
            />
          </div>

          <div>
            <Label>5.3. Cookies de Terceiros</Label>
            <Textarea
              value={formData.manageCookiesThirdParty}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  manageCookiesThirdParty: e.target.value,
                })
              }
              rows={6}
              className="mt-2"
            />
          </div>

          <div>
            <Label>5.4. Aviso Importante</Label>
            <Textarea
              value={formData.manageCookiesWarning}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  manageCookiesWarning: e.target.value,
                })
              }
              rows={8}
              className="mt-2"
            />
          </div>
        </CardContent>
      </Card>

      {/* Section 6: Atualizações */}
      <Card>
        <CardHeader>
          <CardTitle>6. Atualizações desta Política</CardTitle>
        </CardHeader>
        <CardContent>
          <Textarea
            value={formData.updatesDescription}
            onChange={(e) =>
              setFormData({ ...formData, updatesDescription: e.target.value })
            }
            rows={6}
          />
        </CardContent>
      </Card>

      {/* Section 7: Contato */}
      <Card>
        <CardHeader>
          <CardTitle>7. Contato</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="contactEmail">E-mail de Contato</Label>
            <Input
              id="contactEmail"
              type="email"
              value={formData.contactEmail}
              onChange={(e) =>
                setFormData({ ...formData, contactEmail: e.target.value })
              }
              className="mt-2"
            />
          </div>

          <div>
            <Label htmlFor="contactPage">Página de Contato</Label>
            <Input
              id="contactPage"
              value={formData.contactPage}
              onChange={(e) =>
                setFormData({ ...formData, contactPage: e.target.value })
              }
              className="mt-2"
            />
          </div>
        </CardContent>
      </Card>

      {/* Footer Buttons */}
      <div className="flex justify-end gap-2">
        <Button
          onClick={handleSave}
          disabled={updateMutation.isPending}
          size="lg"
          className="gap-2"
        >
          {updateMutation.isPending ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Save className="h-4 w-4" />
          )}
          Salvar Todas as Alterações
        </Button>
      </div>
    </div>
  );
}
