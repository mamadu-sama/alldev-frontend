import {
  Shield,
  Eye,
  Database,
  Lock,
  Share2,
  Globe,
  UserCheck,
  Trash2,
  Baby,
  Mail,
  Loader2,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { useQuery } from "@tanstack/react-query";
import api from "@/services/api";

export default function PrivacyPolicy() {
  // Buscar conteúdo do banco de dados
  const { data, isLoading } = useQuery({
    queryKey: ["privacyPolicy"],
    queryFn: async () => {
      const response = await api.get("/privacy-policy");
      return response.data.data;
    },
    retry: 1,
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  const content = data;

  return (
    <div className="container max-w-4xl py-8 px-4">
      {/* Header */}
      <div className="text-center mb-12">
        <div className="flex justify-center mb-4">
          <div className="p-4 rounded-full bg-primary/10">
            <Shield className="h-12 w-12 text-primary" />
          </div>
        </div>
        <h1 className="text-4xl font-bold mb-4">Política de Privacidade</h1>
        <p className="text-muted-foreground">
          Última atualização:{" "}
          {content?.lastUpdated
            ? new Date(content.lastUpdated).toLocaleDateString("pt-BR", {
                day: "numeric",
                month: "long",
                year: "numeric",
              })
            : "10 de Dezembro de 2024"}
        </p>
        <Badge variant="outline" className="mt-4">
          Conforme LGPD (Lei nº 13.709/2018)
        </Badge>
      </div>

      {/* Introduction */}
      <Card className="mb-8">
        <CardContent className="p-6">
          <p className="text-muted-foreground leading-relaxed">
            A Alldev ("nós", "nosso" ou "Plataforma") valoriza a privacidade de
            seus usuários. Esta Política de Privacidade descreve como coletamos,
            usamos, armazenamos e protegemos suas informações pessoais quando
            você utiliza nossa plataforma de comunidade para desenvolvedores. Ao
            usar nossos serviços, você concorda com as práticas descritas nesta
            política.
          </p>
        </CardContent>
      </Card>

      {/* Section 1 */}
      <section className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <Database className="h-6 w-6 text-primary" />
          <h2 className="text-2xl font-bold">1. Dados que Coletamos</h2>
        </div>
        <div className="space-y-6 pl-9">
          <div>
            <h3 className="font-semibold text-lg mb-2">
              1.1. Dados fornecidos por você
            </h3>
            <p className="text-muted-foreground whitespace-pre-line">
              {content?.dataCollectionUserProvided ||
                "Carregando..."}
            </p>
          </div>

          <div>
            <h3 className="font-semibold text-lg mb-2">
              1.2. Dados coletados automaticamente
            </h3>
            <p className="text-muted-foreground whitespace-pre-line">
              {content?.dataCollectionAutomatic || "Carregando..."}
            </p>
          </div>

          <div>
            <h3 className="font-semibold text-lg mb-2">
              1.3. Dados de terceiros
            </h3>
            <p className="text-muted-foreground whitespace-pre-line">
              {content?.dataCollectionThirdParty || "Carregando..."}
            </p>
          </div>
        </div>
      </section>

      {/* Section 2 */}
      <section className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <Eye className="h-6 w-6 text-primary" />
          <h2 className="text-2xl font-bold">2. Como Usamos Seus Dados</h2>
        </div>
        <div className="space-y-4 text-muted-foreground pl-9">
          <p className="whitespace-pre-line">
            {content?.dataUsageDescription || "Carregando..."}
          </p>
        </div>
      </section>

      {/* Section 3 */}
      <section className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <Share2 className="h-6 w-6 text-primary" />
          <h2 className="text-2xl font-bold">3. Compartilhamento de Dados</h2>
        </div>
        <div className="space-y-4 text-muted-foreground pl-9">
          <p className="whitespace-pre-line">
            {content?.dataSharingDescription || "Carregando..."}
          </p>

          <Card className="bg-muted/50 mt-4">
            <CardContent className="p-4">
              <p className="text-sm">
                <strong className="text-foreground">Importante:</strong>{" "}
                {content?.dataSharingImportantNote ||
                  "Nunca vendemos seus dados pessoais para terceiros."}
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Section 4 */}
      <section className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <Lock className="h-6 w-6 text-primary" />
          <h2 className="text-2xl font-bold">4. Segurança dos Dados</h2>
        </div>
        <div className="space-y-4 text-muted-foreground pl-9">
          <p className="whitespace-pre-line">
            {content?.securityMeasures || "Carregando..."}
          </p>
          <p className="whitespace-pre-line">
            {content?.securityDisclaimer || "Carregando..."}
          </p>
        </div>
      </section>

      {/* Section 5 */}
      <section className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <Globe className="h-6 w-6 text-primary" />
          <h2 className="text-2xl font-bold">5. Retenção de Dados</h2>
        </div>
        <div className="space-y-4 text-muted-foreground pl-9">
          <p className="whitespace-pre-line">
            {content?.dataRetentionDescription || "Carregando..."}
          </p>
        </div>
      </section>

      {/* Section 6 */}
      <section className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <UserCheck className="h-6 w-6 text-primary" />
          <h2 className="text-2xl font-bold">6. Seus Direitos (LGPD)</h2>
        </div>
        <div className="space-y-4 text-muted-foreground pl-9">
          <p className="whitespace-pre-line">
            {content?.lgpdRightsDescription || "Carregando..."}
          </p>
          <p className="mt-4 whitespace-pre-line">
            {content?.lgpdContactInfo || "Carregando..."}
          </p>
        </div>
      </section>

      {/* Section 7 */}
      <section className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <Baby className="h-6 w-6 text-primary" />
          <h2 className="text-2xl font-bold">7. Menores de Idade</h2>
        </div>
        <div className="space-y-4 text-muted-foreground pl-9">
          <p className="whitespace-pre-line">
            {content?.minorsPolicy || "Carregando..."}
          </p>
        </div>
      </section>

      {/* Section 8 */}
      <section className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <Globe className="h-6 w-6 text-primary" />
          <h2 className="text-2xl font-bold">8. Transferências Internacionais</h2>
        </div>
        <div className="space-y-4 text-muted-foreground pl-9">
          <p className="whitespace-pre-line">
            {content?.internationalTransfers || "Carregando..."}
          </p>
        </div>
      </section>

      {/* Section 9 */}
      <section className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <Trash2 className="h-6 w-6 text-primary" />
          <h2 className="text-2xl font-bold">9. Exclusão de Conta</h2>
        </div>
        <div className="space-y-4 text-muted-foreground pl-9">
          <p className="whitespace-pre-line">
            {content?.accountDeletionDescription || "Carregando..."}
          </p>
          <p className="whitespace-pre-line">
            {content?.accountDeletionProcess || "Carregando..."}
          </p>
        </div>
      </section>

      {/* Contact */}
      <section className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <Mail className="h-6 w-6 text-primary" />
          <h2 className="text-2xl font-bold">10. Contato e Encarregado (DPO)</h2>
        </div>
        <Card>
          <CardContent className="p-6">
            <p className="text-muted-foreground mb-4">
              Para questões sobre esta Política de Privacidade ou para exercer
              seus direitos:
            </p>
            <ul className="space-y-2 text-muted-foreground">
              <li>
                <strong className="text-foreground">Encarregado de Dados (DPO):</strong>{" "}
                {content?.dpoName || "João Silva"}
              </li>
              <li>
                <strong className="text-foreground">E-mail:</strong>{" "}
                {content?.dpoEmail || "privacidade@alldev.com.br"}
              </li>
              <li>
                <strong className="text-foreground">Página de Contato:</strong>{" "}
                <Link to="/contact" className="text-primary hover:underline">
                  {content?.dpoContactPage || "alldev.com.br/contato"}
                </Link>
              </li>
            </ul>
            <p className="text-sm text-muted-foreground mt-4">
              Você também pode registrar uma reclamação junto à Autoridade
              Nacional de Proteção de Dados (ANPD).
            </p>
          </CardContent>
        </Card>
      </section>

      {/* Related Links */}
      <section className="text-center mt-12">
        <p className="text-muted-foreground mb-4">Documentos relacionados:</p>
        <div className="flex justify-center gap-4 flex-wrap">
          <Link to="/terms" className="text-primary hover:underline">
            Termos de Uso
          </Link>
          <span className="text-muted-foreground">•</span>
          <Link to="/cookies" className="text-primary hover:underline">
            Política de Cookies
          </Link>
          <span className="text-muted-foreground">•</span>
          <Link to="/contact" className="text-primary hover:underline">
            Contato
          </Link>
        </div>
      </section>
    </div>
  );
}
