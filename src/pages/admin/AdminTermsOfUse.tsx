import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { FileText, Loader2, Save } from "lucide-react";
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

export default function AdminTermsOfUse() {
  const queryClient = useQueryClient();
  const [formData, setFormData] = useState({
    introduction: "",
    acceptanceSection: "",
    accountSection: "",
    userContentLicense: "",
    userContentCreativeCommons: "",
    userContentCodeLicense: "",
    userContentResponsibility: "",
    prohibitedConduct: "",
    moderationDescription: "",
    penaltiesDescription: "",
    appealProcess: "",
    disclaimerSection: "",
    liabilityLimit: "",
    changesAndTermination: "",
    governingLaw: "",
    jurisdiction: "",
    entireAgreement: "",
    severability: "",
    contactEmail: "",
    contactPage: "",
  });

  // Buscar conteúdo atual
  const { data, isLoading } = useQuery({
    queryKey: ["termsOfUse"],
    queryFn: async () => {
      const response = await api.get("/terms-of-use");
      return response.data.data;
    },
  });

  // Preencher formulário quando dados carregarem
  useEffect(() => {
    if (data) {
      setFormData({
        introduction: data.introduction || "",
        acceptanceSection: data.acceptanceSection || "",
        accountSection: data.accountSection || "",
        userContentLicense: data.userContentLicense || "",
        userContentCreativeCommons: data.userContentCreativeCommons || "",
        userContentCodeLicense: data.userContentCodeLicense || "",
        userContentResponsibility: data.userContentResponsibility || "",
        prohibitedConduct: data.prohibitedConduct || "",
        moderationDescription: data.moderationDescription || "",
        penaltiesDescription: data.penaltiesDescription || "",
        appealProcess: data.appealProcess || "",
        disclaimerSection: data.disclaimerSection || "",
        liabilityLimit: data.liabilityLimit || "",
        changesAndTermination: data.changesAndTermination || "",
        governingLaw: data.governingLaw || "",
        jurisdiction: data.jurisdiction || "",
        entireAgreement: data.entireAgreement || "",
        severability: data.severability || "",
        contactEmail: data.contactEmail || "",
        contactPage: data.contactPage || "",
      });
    }
  }, [data]);

  // Mutation para atualizar
  const updateMutation = useMutation({
    mutationFn: async (data: any) => {
      const response = await api.patch("/terms-of-use/admin", data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["termsOfUse"] });
      toast.success("Termos de Uso atualizados com sucesso!");
    },
    onError: (error: any) => {
      toast.error(
        error?.response?.data?.error?.message ||
          "Erro ao atualizar Termos de Uso"
      );
    },
  });

  // Mutation para seed
  const seedMutation = useMutation({
    mutationFn: async () => {
      const response = await api.post("/terms-of-use/admin/seed");
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["termsOfUse"] });
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
            <FileText className="h-8 w-8" />
            Editar Termos de Uso
          </h1>
          <p className="text-muted-foreground mt-1">
            Gerencie o conteúdo dos Termos de Uso
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
            Texto introdutório dos Termos de Uso
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Textarea
            value={formData.introduction}
            onChange={(e) =>
              setFormData({ ...formData, introduction: e.target.value })
            }
            rows={6}
          />
        </CardContent>
      </Card>

      {/* Section 1: Aceitação */}
      <Card>
        <CardHeader>
          <CardTitle>1. Aceitação dos Termos</CardTitle>
        </CardHeader>
        <CardContent>
          <Textarea
            value={formData.acceptanceSection}
            onChange={(e) =>
              setFormData({ ...formData, acceptanceSection: e.target.value })
            }
            rows={8}
          />
        </CardContent>
      </Card>

      {/* Section 2: Cadastro e Conta */}
      <Card>
        <CardHeader>
          <CardTitle>2. Cadastro e Conta</CardTitle>
        </CardHeader>
        <CardContent>
          <Textarea
            value={formData.accountSection}
            onChange={(e) =>
              setFormData({ ...formData, accountSection: e.target.value })
            }
            rows={8}
          />
        </CardContent>
      </Card>

      {/* Section 3: Conteúdo do Usuário */}
      <Card>
        <CardHeader>
          <CardTitle>3. Conteúdo do Usuário</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label>3.1. Licença de Conteúdo</Label>
            <Textarea
              value={formData.userContentLicense}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  userContentLicense: e.target.value,
                })
              }
              rows={4}
              className="mt-2"
            />
          </div>

          <div>
            <Label>3.2. Creative Commons</Label>
            <Textarea
              value={formData.userContentCreativeCommons}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  userContentCreativeCommons: e.target.value,
                })
              }
              rows={4}
              className="mt-2"
            />
          </div>

          <div>
            <Label>3.3. Código-fonte</Label>
            <Textarea
              value={formData.userContentCodeLicense}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  userContentCodeLicense: e.target.value,
                })
              }
              rows={3}
              className="mt-2"
            />
          </div>

          <div>
            <Label>3.4-3.5. Responsabilidade</Label>
            <Textarea
              value={formData.userContentResponsibility}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  userContentResponsibility: e.target.value,
                })
              }
              rows={4}
              className="mt-2"
            />
          </div>
        </CardContent>
      </Card>

      {/* Section 4: Conduta Proibida */}
      <Card>
        <CardHeader>
          <CardTitle>4. Conduta Proibida</CardTitle>
        </CardHeader>
        <CardContent>
          <Textarea
            value={formData.prohibitedConduct}
            onChange={(e) =>
              setFormData({ ...formData, prohibitedConduct: e.target.value })
            }
            rows={12}
          />
        </CardContent>
      </Card>

      {/* Section 5: Moderação e Penalidades */}
      <Card>
        <CardHeader>
          <CardTitle>5. Moderação e Penalidades</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label>5.1. Moderação</Label>
            <Textarea
              value={formData.moderationDescription}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  moderationDescription: e.target.value,
                })
              }
              rows={3}
              className="mt-2"
            />
          </div>

          <div>
            <Label>5.2. Penalidades</Label>
            <Textarea
              value={formData.penaltiesDescription}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  penaltiesDescription: e.target.value,
                })
              }
              rows={8}
              className="mt-2"
            />
          </div>

          <div>
            <Label>5.3. Processo de Apelação</Label>
            <Textarea
              value={formData.appealProcess}
              onChange={(e) =>
                setFormData({ ...formData, appealProcess: e.target.value })
              }
              rows={3}
              className="mt-2"
            />
          </div>
        </CardContent>
      </Card>

      {/* Section 6: Isenção de Garantias */}
      <Card>
        <CardHeader>
          <CardTitle>6. Isenção de Garantias</CardTitle>
        </CardHeader>
        <CardContent>
          <Textarea
            value={formData.disclaimerSection}
            onChange={(e) =>
              setFormData({ ...formData, disclaimerSection: e.target.value })
            }
            rows={6}
          />
        </CardContent>
      </Card>

      {/* Section 7: Limitação de Responsabilidade */}
      <Card>
        <CardHeader>
          <CardTitle>7. Limitação de Responsabilidade</CardTitle>
        </CardHeader>
        <CardContent>
          <Textarea
            value={formData.liabilityLimit}
            onChange={(e) =>
              setFormData({ ...formData, liabilityLimit: e.target.value })
            }
            rows={5}
          />
        </CardContent>
      </Card>

      {/* Section 8: Alterações e Encerramento */}
      <Card>
        <CardHeader>
          <CardTitle>8. Alterações e Encerramento</CardTitle>
        </CardHeader>
        <CardContent>
          <Textarea
            value={formData.changesAndTermination}
            onChange={(e) =>
              setFormData({
                ...formData,
                changesAndTermination: e.target.value,
              })
            }
            rows={5}
          />
        </CardContent>
      </Card>

      {/* Section 9: Disposições Gerais */}
      <Card>
        <CardHeader>
          <CardTitle>9. Disposições Gerais</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label>9.1. Lei Aplicável</Label>
            <Textarea
              value={formData.governingLaw}
              onChange={(e) =>
                setFormData({ ...formData, governingLaw: e.target.value })
              }
              rows={3}
              className="mt-2"
            />
          </div>

          <div>
            <Label>9.2. Foro</Label>
            <Textarea
              value={formData.jurisdiction}
              onChange={(e) =>
                setFormData({ ...formData, jurisdiction: e.target.value })
              }
              rows={2}
              className="mt-2"
            />
          </div>

          <div>
            <Label>9.3. Integralidade</Label>
            <Textarea
              value={formData.entireAgreement}
              onChange={(e) =>
                setFormData({ ...formData, entireAgreement: e.target.value })
              }
              rows={2}
              className="mt-2"
            />
          </div>

          <div>
            <Label>9.4. Autonomia das Cláusulas</Label>
            <Textarea
              value={formData.severability}
              onChange={(e) =>
                setFormData({ ...formData, severability: e.target.value })
              }
              rows={2}
              className="mt-2"
            />
          </div>
        </CardContent>
      </Card>

      {/* Section 10: Contato */}
      <Card>
        <CardHeader>
          <CardTitle>10. Contato</CardTitle>
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
