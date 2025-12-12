import { Cookie, Settings, BarChart3, Shield, Target, Clock, ToggleRight, ExternalLink } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Link } from 'react-router-dom';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

export default function CookiePolicy() {
  return (
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
          Última atualização: 10 de Dezembro de 2024
        </p>
      </div>

      {/* Introduction */}
      <Card className="mb-8">
        <CardContent className="p-6">
          <p className="text-muted-foreground leading-relaxed">
            Esta Política de Cookies explica o que são cookies, como a Alldev os utiliza, os tipos de 
            cookies que empregamos e como você pode gerenciar suas preferências. Esta política 
            complementa nossa <Link to="/privacy" className="text-primary hover:underline">Política de Privacidade</Link>.
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
          <p>
            Cookies são pequenos arquivos de texto armazenados no seu dispositivo (computador, tablet ou 
            celular) quando você visita um site. Eles são amplamente utilizados para fazer sites funcionarem, 
            melhorar a experiência do usuário e fornecer informações aos proprietários do site.
          </p>
          <p>
            Além de cookies, também utilizamos tecnologias semelhantes como:
          </p>
          <ul className="list-disc pl-5 space-y-1">
            <li><strong className="text-foreground">Local Storage:</strong> armazena dados sem data de expiração no navegador</li>
            <li><strong className="text-foreground">Session Storage:</strong> armazena dados apenas durante a sessão do navegador</li>
            <li><strong className="text-foreground">Pixels de rastreamento:</strong> pequenas imagens que registram interações</li>
          </ul>
        </div>
      </section>

      {/* Why we use cookies */}
      <section className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <Settings className="h-6 w-6 text-primary" />
          <h2 className="text-2xl font-bold">2. Por Que Usamos Cookies?</h2>
        </div>
        <div className="space-y-4 text-muted-foreground pl-9">
          <p>Utilizamos cookies para diversos fins:</p>
          <ul className="space-y-3 list-disc pl-5">
            <li>
              <strong className="text-foreground">Autenticação:</strong> manter você conectado à sua conta enquanto navega
            </li>
            <li>
              <strong className="text-foreground">Preferências:</strong> lembrar suas configurações como tema (claro/escuro), idioma e outras personalizações
            </li>
            <li>
              <strong className="text-foreground">Segurança:</strong> detectar atividades suspeitas e proteger contra fraudes
            </li>
            <li>
              <strong className="text-foreground">Performance:</strong> entender como você usa nossa plataforma para identificar e corrigir problemas
            </li>
            <li>
              <strong className="text-foreground">Análise:</strong> coletar estatísticas agregadas sobre uso do site para melhorar nossos serviços
            </li>
          </ul>
        </div>
      </section>

      {/* Types of cookies */}
      <section className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <BarChart3 className="h-6 w-6 text-primary" />
          <h2 className="text-2xl font-bold">3. Tipos de Cookies que Utilizamos</h2>
        </div>
        
        <div className="space-y-4 pl-9">
          {/* Essential */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Shield className="h-5 w-5 text-success" />
                Cookies Essenciais
                <Badge variant="secondary" className="ml-2">Sempre ativos</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="text-muted-foreground">
              <p className="mb-4">
                Estes cookies são necessários para o funcionamento básico do site. Sem eles, 
                funcionalidades como login e navegação não funcionariam corretamente.
              </p>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Cookie</TableHead>
                    <TableHead>Propósito</TableHead>
                    <TableHead>Duração</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell className="font-mono text-sm">alldev_session</TableCell>
                    <TableCell>Mantém sua sessão de login ativa</TableCell>
                    <TableCell>7 dias</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-mono text-sm">alldev_csrf</TableCell>
                    <TableCell>Proteção contra ataques CSRF</TableCell>
                    <TableCell>Sessão</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-mono text-sm">alldev_auth</TableCell>
                    <TableCell>Token de autenticação JWT</TableCell>
                    <TableCell>30 dias</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-mono text-sm">cookie_consent</TableCell>
                    <TableCell>Armazena suas preferências de cookies</TableCell>
                    <TableCell>1 ano</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          {/* Functional */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <ToggleRight className="h-5 w-5 text-primary" />
                Cookies Funcionais
                <Badge variant="outline" className="ml-2">Opcional</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="text-muted-foreground">
              <p className="mb-4">
                Estes cookies permitem funcionalidades aprimoradas e personalização, como lembrar 
                suas preferências de interface.
              </p>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Cookie</TableHead>
                    <TableHead>Propósito</TableHead>
                    <TableHead>Duração</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell className="font-mono text-sm">theme</TableCell>
                    <TableCell>Sua preferência de tema (claro/escuro)</TableCell>
                    <TableCell>1 ano</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-mono text-sm">sidebar_collapsed</TableCell>
                    <TableCell>Estado da barra lateral</TableCell>
                    <TableCell>1 ano</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-mono text-sm">editor_prefs</TableCell>
                    <TableCell>Preferências do editor de código</TableCell>
                    <TableCell>1 ano</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-mono text-sm">notification_settings</TableCell>
                    <TableCell>Configurações de notificação</TableCell>
                    <TableCell>1 ano</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          {/* Analytics */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <BarChart3 className="h-5 w-5 text-secondary" />
                Cookies de Análise
                <Badge variant="outline" className="ml-2">Opcional</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="text-muted-foreground">
              <p className="mb-4">
                Estes cookies nos ajudam a entender como os visitantes interagem com o site, 
                coletando informações de forma anônima.
              </p>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Cookie</TableHead>
                    <TableHead>Propósito</TableHead>
                    <TableHead>Duração</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell className="font-mono text-sm">_ga</TableCell>
                    <TableCell>Google Analytics - distingue usuários</TableCell>
                    <TableCell>2 anos</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-mono text-sm">_gid</TableCell>
                    <TableCell>Google Analytics - distingue usuários</TableCell>
                    <TableCell>24 horas</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-mono text-sm">_gat</TableCell>
                    <TableCell>Google Analytics - limita taxa de requisições</TableCell>
                    <TableCell>1 minuto</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-mono text-sm">plausible_*</TableCell>
                    <TableCell>Plausible Analytics - análise sem cookies</TableCell>
                    <TableCell>Sessão</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          {/* Marketing */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Target className="h-5 w-5 text-warning" />
                Cookies de Marketing
                <Badge variant="outline" className="ml-2">Opcional</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="text-muted-foreground">
              <p className="mb-4">
                Estes cookies são usados para rastrear visitantes em sites. A intenção é exibir 
                anúncios relevantes e envolventes.
              </p>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Cookie</TableHead>
                    <TableHead>Propósito</TableHead>
                    <TableHead>Duração</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell className="font-mono text-sm">_fbp</TableCell>
                    <TableCell>Facebook Pixel - rastreamento de conversões</TableCell>
                    <TableCell>3 meses</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-mono text-sm">li_sugr</TableCell>
                    <TableCell>LinkedIn Insight Tag</TableCell>
                    <TableCell>3 meses</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
              <p className="text-sm mt-4 text-muted-foreground">
                <strong>Nota:</strong> Atualmente não exibimos anúncios na plataforma. Estes cookies 
                são usados apenas para campanhas externas opcionais.
              </p>
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
          <p>Os cookies podem ser classificados por sua duração:</p>
          <ul className="space-y-2 list-disc pl-5">
            <li>
              <strong className="text-foreground">Cookies de Sessão:</strong> são temporários e expiram quando você fecha o navegador
            </li>
            <li>
              <strong className="text-foreground">Cookies Persistentes:</strong> permanecem no seu dispositivo por um período determinado 
              ou até serem excluídos manualmente
            </li>
          </ul>
        </div>
      </section>

      {/* Managing cookies */}
      <section className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <Settings className="h-6 w-6 text-primary" />
          <h2 className="text-2xl font-bold">5. Como Gerenciar Cookies</h2>
        </div>
        <div className="space-y-4 text-muted-foreground pl-9">
          <p>
            Você pode controlar e gerenciar cookies de várias formas:
          </p>
          
          <div className="space-y-4">
            <Card>
              <CardContent className="p-4">
                <h3 className="font-semibold mb-2">Central de Preferências da Alldev</h3>
                <p className="text-sm">
                  Use nosso painel de preferências de cookies (disponível no rodapé do site) para 
                  ativar ou desativar categorias de cookies não essenciais.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <h3 className="font-semibold mb-2">Configurações do Navegador</h3>
                <p className="text-sm mb-3">
                  A maioria dos navegadores permite bloquear ou excluir cookies. Veja como fazer:
                </p>
                <ul className="space-y-1 text-sm">
                  <li className="flex items-center gap-2">
                    <ExternalLink className="h-3 w-3" />
                    <a href="https://support.google.com/chrome/answer/95647" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Google Chrome</a>
                  </li>
                  <li className="flex items-center gap-2">
                    <ExternalLink className="h-3 w-3" />
                    <a href="https://support.mozilla.org/pt-BR/kb/cookies-informacoes-sites-armazenam-no-computador" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Mozilla Firefox</a>
                  </li>
                  <li className="flex items-center gap-2">
                    <ExternalLink className="h-3 w-3" />
                    <a href="https://support.apple.com/pt-br/guide/safari/sfri11471/mac" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Safari</a>
                  </li>
                  <li className="flex items-center gap-2">
                    <ExternalLink className="h-3 w-3" />
                    <a href="https://support.microsoft.com/pt-br/microsoft-edge/excluir-cookies-no-microsoft-edge-63947406-40ac-c3b8-57b9-2a946a29ae09" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Microsoft Edge</a>
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <h3 className="font-semibold mb-2">Opt-out de Terceiros</h3>
                <p className="text-sm mb-3">
                  Para cookies de terceiros usados em análise e publicidade:
                </p>
                <ul className="space-y-1 text-sm">
                  <li className="flex items-center gap-2">
                    <ExternalLink className="h-3 w-3" />
                    <a href="https://tools.google.com/dlpage/gaoptout" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Google Analytics Opt-out</a>
                  </li>
                  <li className="flex items-center gap-2">
                    <ExternalLink className="h-3 w-3" />
                    <a href="https://www.youronlinechoices.com/" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Your Online Choices (DAA)</a>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>

          <Card className="bg-warning/10 border-warning/20 mt-4">
            <CardContent className="p-4">
              <p className="text-sm">
                <strong className="text-foreground">⚠️ Aviso:</strong> Desativar certos cookies pode afetar a funcionalidade do site. 
                Por exemplo, sem cookies de sessão, você não conseguirá permanecer logado.
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
          <p>
            Podemos atualizar esta Política de Cookies periodicamente para refletir mudanças em nossas 
            práticas ou por outros motivos operacionais, legais ou regulatórios. Recomendamos que você 
            revise esta página regularmente para se manter informado sobre nosso uso de cookies.
          </p>
          <p>
            A data de "última atualização" no topo desta página indica quando a política foi revisada 
            pela última vez.
          </p>
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
              Se você tiver dúvidas sobre nossa Política de Cookies, entre em contato:
            </p>
            <ul className="space-y-2 text-muted-foreground">
              <li><strong className="text-foreground">E-mail:</strong> privacidade@alldev.com.br</li>
              <li><strong className="text-foreground">Página de Contato:</strong> <Link to="/contact" className="text-primary hover:underline">alldev.com.br/contato</Link></li>
            </ul>
          </CardContent>
        </Card>
      </section>

      {/* Related Links */}
      <section className="text-center mt-12">
        <p className="text-muted-foreground mb-4">Documentos relacionados:</p>
        <div className="flex justify-center gap-4 flex-wrap">
          <Link to="/terms" className="text-primary hover:underline">Termos de Uso</Link>
          <span className="text-muted-foreground">•</span>
          <Link to="/privacy" className="text-primary hover:underline">Política de Privacidade</Link>
          <span className="text-muted-foreground">•</span>
          <Link to="/contact" className="text-primary hover:underline">Contato</Link>
        </div>
      </section>
    </div>
  );
}
