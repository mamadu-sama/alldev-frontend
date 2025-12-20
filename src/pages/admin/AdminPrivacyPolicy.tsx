import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Shield, Loader2, Save } from "lucide-react";
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

export default function AdminPrivacyPolicy() {
  const queryClient = useQueryClient();
  const [formData, setFormData] = useState({
    dataCollectionUserProvided: "",
    dataCollectionAutomatic: "",
    dataCollectionThirdParty: "",
    dataUsageDescription: "",
    dataSharingDescription: "",
    dataSharingImportantNote: "",
    securityMeasures: "",
    securityDisclaimer: "",
    dataRetentionDescription: "",
    lgpdRightsDescription: "",
    lgpdContactInfo: "",
    minorsPolicy: "",
    internationalTransfers: "",
    accountDeletionDescription: "",
    accountDeletionProcess: "",
    dpoName: "",
    dpoEmail: "",
    dpoContactPage: "",
  });

  // Buscar conteúdo atual
  const { data, isLoading } = useQuery({
    queryKey: ["privacyPolicy"],
    queryFn: async () => {
      const response = await api.get("/privacy-policy");
      return response.data.data;
    },
  });

  // Preencher formulário quando dados carregarem
  useEffect(() => {
    if (data) {
      setFormData({
        dataCollectionUserProvided: data.dataCollectionUserProvided || "",
        dataCollectionAutomatic: data.dataCollectionAutomatic || "",
        dataCollectionThirdParty: data.dataCollectionThirdParty || "",
        dataUsageDescription: data.dataUsageDescription || "",
        dataSharingDescription: data.dataSharingDescription || "",
        dataSharingImportantNote: data.dataSharingImportantNote || "",
        securityMeasures: data.securityMeasures || "",
        securityDisclaimer: data.securityDisclaimer || "",
        dataRetentionDescription: data.dataRetentionDescription || "",
        lgpdRightsDescription: data.lgpdRightsDescription || "",
        lgpdContactInfo: data.lgpdContactInfo || "",
        minorsPolicy: data.minorsPolicy || "",
        internationalTransfers: data.internationalTransfers || "",
        accountDeletionDescription: data.accountDeletionDescription || "",
        accountDeletionProcess: data.accountDeletionProcess || "",
        dpoName: data.dpoName || "",
        dpoEmail: data.dpoEmail || "",
        dpoContactPage: data.dpoContactPage || "",
      });
    }
  }, [data]);

  // Mutation para atualizar
  const updateMutation = useMutation({
    mutationFn: async (data: any) => {
      const response = await api.patch("/privacy-policy/admin", data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["privacyPolicy"] });
      toast.success("Política de Privacidade atualizada com sucesso!");
    },
    onError: (error: any) => {
      toast.error(
        error?.response?.data?.error?.message ||
          "Erro ao atualizar Política de Privacidade"
      );
    },
  });

  // Mutation para seed
  const seedMutation = useMutation({
    mutationFn: async () => {
      const response = await api.post("/privacy-policy/admin/seed");
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["privacyPolicy"] });
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
            <Shield className="h-8 w-8" />
            Editar Política de Privacidade
          </h1>
          <p className="text-muted-foreground mt-1">
            Gerencie o conteúdo da Política de Privacidade
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

      {/* Section 1: Dados que Coletamos */}
      <Card>
        <CardHeader>
          <CardTitle>1. Dados que Coletamos</CardTitle>
          <CardDescription>
            Informações sobre os dados coletados dos usuários
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="dataCollectionUserProvided">
              1.1. Dados fornecidos por você
            </Label>
            <Textarea
              id="dataCollectionUserProvided"
              value={formData.dataCollectionUserProvided}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  dataCollectionUserProvided: e.target.value,
                })
              }
              rows={6}
              className="mt-2"
            />
          </div>

          <div>
            <Label htmlFor="dataCollectionAutomatic">
              1.2. Dados coletados automaticamente
            </Label>
            <Textarea
              id="dataCollectionAutomatic"
              value={formData.dataCollectionAutomatic}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  dataCollectionAutomatic: e.target.value,
                })
              }
              rows={6}
              className="mt-2"
            />
          </div>

          <div>
            <Label htmlFor="dataCollectionThirdParty">
              1.3. Dados de terceiros
            </Label>
            <Textarea
              id="dataCollectionThirdParty"
              value={formData.dataCollectionThirdParty}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  dataCollectionThirdParty: e.target.value,
                })
              }
              rows={4}
              className="mt-2"
            />
          </div>
        </CardContent>
      </Card>

      {/* Section 2: Como Usamos Seus Dados */}
      <Card>
        <CardHeader>
          <CardTitle>2. Como Usamos Seus Dados</CardTitle>
        </CardHeader>
        <CardContent>
          <Label htmlFor="dataUsageDescription">Descrição completa</Label>
          <Textarea
            id="dataUsageDescription"
            value={formData.dataUsageDescription}
            onChange={(e) =>
              setFormData({ ...formData, dataUsageDescription: e.target.value })
            }
            rows={10}
            className="mt-2"
          />
        </CardContent>
      </Card>

      {/* Section 3: Compartilhamento de Dados */}
      <Card>
        <CardHeader>
          <CardTitle>3. Compartilhamento de Dados</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="dataSharingDescription">Descrição</Label>
            <Textarea
              id="dataSharingDescription"
              value={formData.dataSharingDescription}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  dataSharingDescription: e.target.value,
                })
              }
              rows={8}
              className="mt-2"
            />
          </div>

          <div>
            <Label htmlFor="dataSharingImportantNote">Nota Importante</Label>
            <Textarea
              id="dataSharingImportantNote"
              value={formData.dataSharingImportantNote}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  dataSharingImportantNote: e.target.value,
                })
              }
              rows={3}
              className="mt-2"
            />
          </div>
        </CardContent>
      </Card>

      {/* Section 4: Segurança dos Dados */}
      <Card>
        <CardHeader>
          <CardTitle>4. Segurança dos Dados</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="securityMeasures">Medidas de Segurança</Label>
            <Textarea
              id="securityMeasures"
              value={formData.securityMeasures}
              onChange={(e) =>
                setFormData({ ...formData, securityMeasures: e.target.value })
              }
              rows={6}
              className="mt-2"
            />
          </div>

          <div>
            <Label htmlFor="securityDisclaimer">Aviso Legal</Label>
            <Textarea
              id="securityDisclaimer"
              value={formData.securityDisclaimer}
              onChange={(e) =>
                setFormData({ ...formData, securityDisclaimer: e.target.value })
              }
              rows={4}
              className="mt-2"
            />
          </div>
        </CardContent>
      </Card>

      {/* Section 5: Retenção de Dados */}
      <Card>
        <CardHeader>
          <CardTitle>5. Retenção de Dados</CardTitle>
        </CardHeader>
        <CardContent>
          <Label htmlFor="dataRetentionDescription">Descrição</Label>
          <Textarea
            id="dataRetentionDescription"
            value={formData.dataRetentionDescription}
            onChange={(e) =>
              setFormData({
                ...formData,
                dataRetentionDescription: e.target.value,
              })
            }
            rows={6}
            className="mt-2"
          />
        </CardContent>
      </Card>

      {/* Section 6: Seus Direitos LGPD */}
      <Card>
        <CardHeader>
          <CardTitle>6. Seus Direitos (LGPD)</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="lgpdRightsDescription">Descrição dos Direitos</Label>
            <Textarea
              id="lgpdRightsDescription"
              value={formData.lgpdRightsDescription}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  lgpdRightsDescription: e.target.value,
                })
              }
              rows={8}
              className="mt-2"
            />
          </div>

          <div>
            <Label htmlFor="lgpdContactInfo">Informações de Contato</Label>
            <Textarea
              id="lgpdContactInfo"
              value={formData.lgpdContactInfo}
              onChange={(e) =>
                setFormData({ ...formData, lgpdContactInfo: e.target.value })
              }
              rows={3}
              className="mt-2"
            />
          </div>
        </CardContent>
      </Card>

      {/* Section 7: Menores de Idade */}
      <Card>
        <CardHeader>
          <CardTitle>7. Menores de Idade</CardTitle>
        </CardHeader>
        <CardContent>
          <Label htmlFor="minorsPolicy">Política</Label>
          <Textarea
            id="minorsPolicy"
            value={formData.minorsPolicy}
            onChange={(e) =>
              setFormData({ ...formData, minorsPolicy: e.target.value })
            }
            rows={4}
            className="mt-2"
          />
        </CardContent>
      </Card>

      {/* Section 8: Transferências Internacionais */}
      <Card>
        <CardHeader>
          <CardTitle>8. Transferências Internacionais</CardTitle>
        </CardHeader>
        <CardContent>
          <Label htmlFor="internationalTransfers">Descrição</Label>
          <Textarea
            id="internationalTransfers"
            value={formData.internationalTransfers}
            onChange={(e) =>
              setFormData({
                ...formData,
                internationalTransfers: e.target.value,
              })
            }
            rows={5}
            className="mt-2"
          />
        </CardContent>
      </Card>

      {/* Section 9: Exclusão de Conta */}
      <Card>
        <CardHeader>
          <CardTitle>9. Exclusão de Conta</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="accountDeletionDescription">Descrição</Label>
            <Textarea
              id="accountDeletionDescription"
              value={formData.accountDeletionDescription}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  accountDeletionDescription: e.target.value,
                })
              }
              rows={3}
              className="mt-2"
            />
          </div>

          <div>
            <Label htmlFor="accountDeletionProcess">Processo</Label>
            <Textarea
              id="accountDeletionProcess"
              value={formData.accountDeletionProcess}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  accountDeletionProcess: e.target.value,
                })
              }
              rows={5}
              className="mt-2"
            />
          </div>
        </CardContent>
      </Card>

      {/* Section 10: Contato e DPO */}
      <Card>
        <CardHeader>
          <CardTitle>10. Contato e Encarregado (DPO)</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="dpoName">Nome do DPO</Label>
            <Input
              id="dpoName"
              value={formData.dpoName}
              onChange={(e) =>
                setFormData({ ...formData, dpoName: e.target.value })
              }
              className="mt-2"
            />
          </div>

          <div>
            <Label htmlFor="dpoEmail">E-mail do DPO</Label>
            <Input
              id="dpoEmail"
              type="email"
              value={formData.dpoEmail}
              onChange={(e) =>
                setFormData({ ...formData, dpoEmail: e.target.value })
              }
              className="mt-2"
            />
          </div>

          <div>
            <Label htmlFor="dpoContactPage">Página de Contato</Label>
            <Input
              id="dpoContactPage"
              value={formData.dpoContactPage}
              onChange={(e) =>
                setFormData({ ...formData, dpoContactPage: e.target.value })
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

