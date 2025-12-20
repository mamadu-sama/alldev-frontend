import { useQuery } from "@tanstack/react-query";
import {
  FileText,
  Scale,
  AlertCircle,
  Shield,
  UserCheck,
  Ban,
  RefreshCw,
  Mail,
  Loader2,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "react-router-dom";
import api from "@/services/api";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

// Função auxiliar para renderizar texto com quebras de linha
function renderContent(text: string) {
  return text.split("\n").map((line, i) => {
    // Se a linha começa com •, é um item de lista
    if (line.trim().startsWith("•")) {
      return (
        <li key={i} className="ml-4">
          {line.trim().substring(1).trim()}
        </li>
      );
    }
    // Se tem conteúdo, renderiza parágrafo
    if (line.trim()) {
      return (
        <p key={i} className="whitespace-pre-wrap">
          {line}
        </p>
      );
    }
    return null;
  });
}

export default function TermsOfUse() {
  // Buscar dados reais da API
  const { data, isLoading, error } = useQuery({
    queryKey: ["termsOfUse", "public"],
    queryFn: async () => {
      const response = await api.get("/terms-of-use");
      return response.data.data;
    },
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="container max-w-4xl py-8 px-4">
        <div className="text-center">
          <AlertCircle className="h-12 w-12 text-destructive mx-auto mb-4" />
          <h1 className="text-2xl font-bold mb-2">
            Erro ao carregar Termos de Uso
          </h1>
          <p className="text-muted-foreground">
            Não foi possível carregar o conteúdo. Por favor, tente novamente
            mais tarde.
          </p>
        </div>
      </div>
    );
  }

  const lastUpdated = data.lastUpdated
    ? format(new Date(data.lastUpdated), "dd 'de' MMMM 'de' yyyy", {
        locale: ptBR,
      })
    : "Data não disponível";

  return (
    <div className="container max-w-4xl py-8 px-4">
      {/* Header */}
      <div className="text-center mb-12">
        <div className="flex justify-center mb-4">
          <div className="p-4 rounded-full bg-primary/10">
            <FileText className="h-12 w-12 text-primary" />
          </div>
        </div>
        <h1 className="text-4xl font-bold mb-4">Termos de Uso</h1>
        <p className="text-muted-foreground">
          Última atualização: {lastUpdated}
        </p>
      </div>

      {/* Introduction */}
      <Card className="mb-8">
        <CardContent className="p-6">
          <div className="text-muted-foreground leading-relaxed space-y-4">
            {renderContent(data.introduction)}
          </div>
        </CardContent>
      </Card>

      {/* Section 1: Aceitação dos Termos */}
      <section className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <Scale className="h-6 w-6 text-primary" />
          <h2 className="text-2xl font-bold">1. Aceitação dos Termos</h2>
        </div>
        <div className="space-y-4 text-muted-foreground pl-9">
          {renderContent(data.acceptanceSection)}
        </div>
      </section>

      {/* Section 2: Cadastro e Conta */}
      <section className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <UserCheck className="h-6 w-6 text-primary" />
          <h2 className="text-2xl font-bold">2. Cadastro e Conta</h2>
        </div>
        <div className="space-y-4 text-muted-foreground pl-9">
          {renderContent(data.accountSection)}
        </div>
      </section>

      {/* Section 3: Conteúdo do Usuário */}
      <section className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <FileText className="h-6 w-6 text-primary" />
          <h2 className="text-2xl font-bold">3. Conteúdo do Usuário</h2>
        </div>
        <div className="space-y-4 text-muted-foreground pl-9">
          <div>
            <p className="mb-2">
              <strong className="text-foreground">
                3.1. Licença de Conteúdo:
              </strong>
            </p>
            <div className="pl-4">{renderContent(data.userContentLicense)}</div>
          </div>

          <div>
            <p className="mb-2">
              <strong className="text-foreground">
                3.2. Creative Commons:
              </strong>
            </p>
            <div className="pl-4">
              {renderContent(data.userContentCreativeCommons)}
            </div>
          </div>

          <div>
            <p className="mb-2">
              <strong className="text-foreground">3.3. Código-fonte:</strong>
            </p>
            <div className="pl-4">
              {renderContent(data.userContentCodeLicense)}
            </div>
          </div>

          <div>
            <p className="mb-2">
              <strong className="text-foreground">
                3.4-3.5. Responsabilidade:
              </strong>
            </p>
            <div className="pl-4">
              {renderContent(data.userContentResponsibility)}
            </div>
          </div>
        </div>
      </section>

      {/* Section 4: Conduta Proibida */}
      <section className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <Ban className="h-6 w-6 text-destructive" />
          <h2 className="text-2xl font-bold">4. Conduta Proibida</h2>
        </div>
        <div className="text-muted-foreground pl-9">
          <div className="space-y-2">
            {data.prohibitedConduct
              .split("\n")
              .map((line: string, i: number) => {
                if (line.trim().startsWith("•")) {
                  return (
                    <li key={i} className="ml-4 list-disc">
                      {line.trim().substring(1).trim()}
                    </li>
                  );
                }
                if (line.trim()) {
                  return (
                    <p key={i} className="mb-2">
                      {line}
                    </p>
                  );
                }
                return null;
              })}
          </div>
        </div>
      </section>

      {/* Section 5: Moderação e Penalidades */}
      <section className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <Shield className="h-6 w-6 text-primary" />
          <h2 className="text-2xl font-bold">5. Moderação e Penalidades</h2>
        </div>
        <div className="space-y-4 text-muted-foreground pl-9">
          <div>
            <p className="mb-2">
              <strong className="text-foreground">5.1. Moderação:</strong>
            </p>
            <div className="pl-4">
              {renderContent(data.moderationDescription)}
            </div>
          </div>

          <div>
            <p className="mb-2">
              <strong className="text-foreground">5.2. Penalidades:</strong>
            </p>
            <div className="pl-4 space-y-2">
              {data.penaltiesDescription
                .split("\n")
                .map((line: string, i: number) => {
                  if (line.trim().startsWith("•")) {
                    return (
                      <li key={i} className="ml-4 list-disc">
                        {line.trim().substring(1).trim()}
                      </li>
                    );
                  }
                  if (line.trim()) {
                    return <p key={i}>{line}</p>;
                  }
                  return null;
                })}
            </div>
          </div>

          <div>
            <p className="mb-2">
              <strong className="text-foreground">5.3. Apelação:</strong>
            </p>
            <div className="pl-4">{renderContent(data.appealProcess)}</div>
          </div>
        </div>
      </section>

      {/* Section 6: Isenção de Garantias */}
      <section className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <AlertCircle className="h-6 w-6 text-warning" />
          <h2 className="text-2xl font-bold">6. Isenção de Garantias</h2>
        </div>
        <div className="space-y-4 text-muted-foreground pl-9">
          {renderContent(data.disclaimerSection)}
        </div>
      </section>

      {/* Section 7: Limitação de Responsabilidade */}
      <section className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <Scale className="h-6 w-6 text-primary" />
          <h2 className="text-2xl font-bold">
            7. Limitação de Responsabilidade
          </h2>
        </div>
        <div className="space-y-4 text-muted-foreground pl-9">
          {renderContent(data.liabilityLimit)}
        </div>
      </section>

      {/* Section 8: Alterações e Encerramento */}
      <section className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <RefreshCw className="h-6 w-6 text-primary" />
          <h2 className="text-2xl font-bold">8. Alterações e Encerramento</h2>
        </div>
        <div className="space-y-4 text-muted-foreground pl-9">
          {renderContent(data.changesAndTermination)}
        </div>
      </section>

      {/* Section 9: Disposições Gerais */}
      <section className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <Scale className="h-6 w-6 text-primary" />
          <h2 className="text-2xl font-bold">9. Disposições Gerais</h2>
        </div>
        <div className="space-y-4 text-muted-foreground pl-9">
          <div>
            <p className="mb-2">
              <strong className="text-foreground">9.1. Lei Aplicável:</strong>
            </p>
            <div className="pl-4">{renderContent(data.governingLaw)}</div>
          </div>

          <div>
            <p className="mb-2">
              <strong className="text-foreground">9.2. Foro:</strong>
            </p>
            <div className="pl-4">{renderContent(data.jurisdiction)}</div>
          </div>

          <div>
            <p className="mb-2">
              <strong className="text-foreground">9.3. Integralidade:</strong>
            </p>
            <div className="pl-4">{renderContent(data.entireAgreement)}</div>
          </div>

          <div>
            <p className="mb-2">
              <strong className="text-foreground">
                9.4. Autonomia das Cláusulas:
              </strong>
            </p>
            <div className="pl-4">{renderContent(data.severability)}</div>
          </div>
        </div>
      </section>

      {/* Section 10: Contato */}
      <section className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <Mail className="h-6 w-6 text-primary" />
          <h2 className="text-2xl font-bold">10. Contato</h2>
        </div>
        <Card>
          <CardContent className="p-6">
            <p className="text-muted-foreground mb-4">
              Para dúvidas sobre estes Termos de Uso, entre em contato conosco:
            </p>
            <ul className="space-y-2 text-muted-foreground">
              <li>
                <strong className="text-foreground">E-mail:</strong>{" "}
                <a
                  href={`mailto:${data.contactEmail}`}
                  className="text-primary hover:underline"
                >
                  {data.contactEmail}
                </a>
              </li>
              <li>
                <strong className="text-foreground">Página de Contato:</strong>{" "}
                <Link to="/contact" className="text-primary hover:underline">
                  {data.contactPage}
                </Link>
              </li>
            </ul>
          </CardContent>
        </Card>
      </section>

      {/* Related Links */}
      <section className="text-center mt-12">
        <p className="text-muted-foreground mb-4">Documentos relacionados:</p>
        <div className="flex justify-center gap-4 flex-wrap">
          <Link to="/privacy" className="text-primary hover:underline">
            Política de Privacidade
          </Link>
          <span className="text-muted-foreground">•</span>
          <Link to="/cookies" className="text-primary hover:underline">
            Política de Cookies
          </Link>
          <span className="text-muted-foreground">•</span>
          <Link
            to="/contribution-guide"
            className="text-primary hover:underline"
          >
            Guia de Contribuição
          </Link>
        </div>
      </section>
    </div>
  );
}
