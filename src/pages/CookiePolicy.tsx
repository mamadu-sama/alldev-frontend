import { useQuery } from "@tanstack/react-query";
import { Seo } from "@/components/common/Seo";
import {
  Cookie,
  Settings,
  BarChart3,
  Shield,
  Clock,
  Loader2,
  ExternalLink,
  Target,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import api from "@/services/api";

export default function CookiePolicy() {
  const { data, isLoading } = useQuery({
    queryKey: ["cookiePolicy"],
    queryFn: async () => {
      const response = await api.get("/cookie-policy");
      return response.data.data; // Expecting { data: { ...fields } }
    },
    retry: 1,
    staleTime: 1000 * 60 * 10, // 10 minutes
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  const content = data;

  // If no content is found (and not loading), show a message instead of static fallback
  if (!content) {
    return (
      <div className="container max-w-4xl py-12 px-4 text-center">
        <div className="flex justify-center mb-6">
          <div className="p-4 rounded-full bg-muted">
            <Cookie className="h-12 w-12 text-muted-foreground" />
          </div>
        </div>
        <h2 className="text-2xl font-bold mb-2">Política de Cookies não disponível</h2>
        <p className="text-muted-foreground mb-6">
          O conteúdo desta política ainda não foi configurado pelos administradores.
        </p>
        <Link to="/" className="text-primary hover:underline">
          Voltar para a página inicial
        </Link>
      </div>
    );
  }

  return (
    <>
      <Seo
        title="Política de Cookies"
        description="Saiba como a Alldev utiliza cookies para melhorar sua experiência na plataforma."
      />
      <div className="container max-w-4xl py-8 px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex justify-center mb-4">
            <div className="p-4 rounded-full bg-primary/10">
              <Cookie className="h-12 w-12 text-primary" />
            </div>
          </div>
          <h1 className="text-4xl font-bold mb-4">Política de Cookies</h1>
          <p className="text-muted-foreground">
            Última atualização:{" "}
            {content.lastUpdated ? new Date(content.lastUpdated).toLocaleDateString("pt-BR", {
              day: "numeric",
              month: "long",
              year: "numeric",
            }) : "Data não disponível"}
          </p>
        </div>

        {/* Introduction */}
        <Card className="mb-8">
          <CardContent className="p-6">
            <p className="text-muted-foreground leading-relaxed whitespace-pre-line">
              {content.introduction}
            </p>
          </CardContent>
        </Card>

        {/* What are cookies */}
        <section className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <Cookie className="h-6 w-6 text-primary" />
            <h2 className="text-2xl font-bold">1. O Que São Cookies?</h2>
          </div>
          <div className="space-y-4 text-muted-foreground pl-9">
            <p className="whitespace-pre-line">
              {content.whatAreCookiesDescription}
            </p>
            <p className="whitespace-pre-line">{content.similarTechnologies}</p>
          </div>
        </section>

        {/* Why we use cookies */}
        <section className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <Settings className="h-6 w-6 text-primary" />
            <h2 className="text-2xl font-bold">2. Por Que Usamos Cookies?</h2>
          </div>
          <div className="space-y-4 text-muted-foreground pl-9">
            <p className="whitespace-pre-line">{content.whyWeUseCookies}</p>
          </div>
        </section>

        {/* Types of cookies */}
        <section className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <BarChart3 className="h-6 w-6 text-primary" />
            <h2 className="text-2xl font-bold">
              3. Tipos de Cookies que Utilizamos
            </h2>
          </div>

          <div className="space-y-4 pl-9">
            {/* Essential */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Shield className="h-5 w-5 text-success" />
                  Cookies Essenciais
                  <Badge variant="secondary" className="ml-2">
                    Sempre ativos
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="text-muted-foreground">
                <p className="whitespace-pre-line">
                  {content.essentialCookiesDescription}
                </p>
              </CardContent>
            </Card>

            {/* Functional */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Settings className="h-5 w-5 text-primary" />
                  Cookies Funcionais
                  <Badge variant="outline" className="ml-2">
                    Opcional
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="text-muted-foreground">
                <p className="whitespace-pre-line">
                  {content.functionalCookiesDescription}
                </p>
              </CardContent>
            </Card>

            {/* Analytics */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <BarChart3 className="h-5 w-5 text-secondary" />
                  Cookies de Análise
                  <Badge variant="outline" className="ml-2">
                    Opcional
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="text-muted-foreground">
                <p className="whitespace-pre-line">
                  {content.analyticsCookiesDescription}
                </p>
              </CardContent>
            </Card>

            {/* Marketing */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Target className="h-5 w-5 text-warning" />
                  Cookies de Marketing
                  <Badge variant="outline" className="ml-2">
                    Opcional
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="text-muted-foreground">
                <p className="whitespace-pre-line">
                  {content.marketingCookiesDescription}
                </p>
                {content.marketingNote && (
                  <p className="text-sm mt-4 whitespace-pre-line">
                    <strong>Nota:</strong> {content.marketingNote}
                  </p>
                )}
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Cookie duration */}
        <section className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <Clock className="h-6 w-6 text-primary" />
            <h2 className="text-2xl font-bold">4. Duração dos Cookies</h2>
          </div>
          <div className="space-y-4 text-muted-foreground pl-9">
            <p className="whitespace-pre-line">
              {content.cookieDurationDescription}
            </p>
          </div>
        </section>

        {/* Managing cookies */}
        <section className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <Settings className="h-6 w-6 text-primary" />
            <h2 className="text-2xl font-bold">5. Como Gerenciar Cookies</h2>
          </div>
          <div className="space-y-4 text-muted-foreground pl-9">
            <div className="space-y-4">
              <Card>
                <CardContent className="p-4">
                  <h3 className="font-semibold mb-2">
                    Central de Preferências da Alldev
                  </h3>
                  <p className="text-sm whitespace-pre-line">
                    {content.manageCookiesAlldev}
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <h3 className="font-semibold mb-2">
                    Configurações do Navegador
                  </h3>
                  <p className="text-sm whitespace-pre-line">
                    {content.manageCookiesBrowser}
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <h3 className="font-semibold mb-2">
                    Bloqueio de Cookies de Terceiros
                  </h3>
                  <p className="text-sm whitespace-pre-line">
                    {content.manageCookiesThirdParty}
                  </p>
                </CardContent>
              </Card>
            </div>

            <Card className="bg-warning/10 border-warning/20 mt-4">
              <CardContent className="p-4">
                <p className="text-sm whitespace-pre-line">
                  {content.manageCookiesWarning}
                </p>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Updates */}
        <section className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <Clock className="h-6 w-6 text-primary" />
            <h2 className="text-2xl font-bold">6. Atualizações desta Política</h2>
          </div>
          <div className="space-y-4 text-muted-foreground pl-9">
            <p className="whitespace-pre-line">{content.updatesDescription}</p>
          </div>
        </section>

        {/* Contact */}
        <section className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <Settings className="h-6 w-6 text-primary" />
            <h2 className="text-2xl font-bold">7. Contato</h2>
          </div>
          <Card>
            <CardContent className="p-6">
              <p className="text-muted-foreground mb-4">
                Se você tiver dúvidas sobre nossa Política de Cookies, entre em
                contato:
              </p>
              <ul className="space-y-2 text-muted-foreground">
                <li>
                  <strong className="text-foreground">E-mail:</strong>{" "}
                  {content.contactEmail}
                </li>
                <li>
                  <strong className="text-foreground">Página de Contato:</strong>{" "}
                  <Link to="/contact" className="text-primary hover:underline">
                    {content.contactPage}
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
            <Link to="/terms" className="text-primary hover:underline">
              Termos de Uso
            </Link>
            <span className="text-muted-foreground">•</span>
            <Link to="/privacy" className="text-primary hover:underline">
              Política de Privacidade
            </Link>
            <span className="text-muted-foreground">•</span>
            <Link to="/contact" className="text-primary hover:underline">
              Contato
            </Link>
          </div>
        </section>
      </div>
    </>
  );
}
