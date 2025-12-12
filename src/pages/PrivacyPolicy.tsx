import { Shield, Eye, Database, Lock, Share2, Globe, UserCheck, Trash2, Baby, Mail } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Link } from 'react-router-dom';
import { Badge } from '@/components/ui/badge';

export default function PrivacyPolicy() {
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
          Última atualização: 10 de Dezembro de 2024
        </p>
        <Badge variant="outline" className="mt-4">
          Conforme LGPD (Lei nº 13.709/2018)
        </Badge>
      </div>

      {/* Introduction */}
      <Card className="mb-8">
        <CardContent className="p-6">
          <p className="text-muted-foreground leading-relaxed">
            A Alldev ("nós", "nosso" ou "Plataforma") valoriza a privacidade de seus usuários. 
            Esta Política de Privacidade descreve como coletamos, usamos, armazenamos e protegemos 
            suas informações pessoais quando você utiliza nossa plataforma de comunidade para desenvolvedores. 
            Ao usar nossos serviços, você concorda com as práticas descritas nesta política.
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
            <h3 className="font-semibold text-lg mb-2">1.1. Dados fornecidos por você</h3>
            <ul className="space-y-2 text-muted-foreground list-disc pl-5">
              <li><strong className="text-foreground">Dados de cadastro:</strong> nome, nome de usuário, endereço de e-mail, senha (criptografada)</li>
              <li><strong className="text-foreground">Dados de perfil:</strong> foto de perfil, biografia, localização, site pessoal, links de redes sociais (GitHub, LinkedIn, Twitter)</li>
              <li><strong className="text-foreground">Dados profissionais:</strong> habilidades técnicas, experiência, empresa atual</li>
              <li><strong className="text-foreground">Conteúdo:</strong> perguntas, respostas, comentários, código-fonte e outros materiais publicados</li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-lg mb-2">1.2. Dados coletados automaticamente</h3>
            <ul className="space-y-2 text-muted-foreground list-disc pl-5">
              <li><strong className="text-foreground">Dados de uso:</strong> páginas visitadas, funcionalidades utilizadas, tempo de permanência, interações (votos, comentários)</li>
              <li><strong className="text-foreground">Dados técnicos:</strong> endereço IP, tipo e versão do navegador, sistema operacional, tipo de dispositivo</li>
              <li><strong className="text-foreground">Dados de cookies:</strong> identificadores únicos, preferências de sessão (veja nossa <Link to="/cookies" className="text-primary hover:underline">Política de Cookies</Link>)</li>
              <li><strong className="text-foreground">Dados de logs:</strong> registros de acesso, erros, atividades de segurança</li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-lg mb-2">1.3. Dados de terceiros</h3>
            <ul className="space-y-2 text-muted-foreground list-disc pl-5">
              <li><strong className="text-foreground">Login social:</strong> se você optar por autenticar via GitHub, Google ou LinkedIn, recebemos seu nome, e-mail e foto de perfil dessas plataformas</li>
              <li><strong className="text-foreground">Integrações:</strong> dados de repositórios públicos do GitHub quando vinculados ao perfil</li>
            </ul>
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
          <p>Utilizamos seus dados pessoais para as seguintes finalidades:</p>
          
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <Badge variant="secondary" className="mt-0.5">Essencial</Badge>
              <div>
                <p><strong className="text-foreground">Fornecer nossos serviços:</strong> criar e gerenciar sua conta, permitir publicação de conteúdo, processar interações</p>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <Badge variant="secondary" className="mt-0.5">Essencial</Badge>
              <div>
                <p><strong className="text-foreground">Comunicação:</strong> enviar notificações sobre atividades (respostas, votos, menções), atualizações de serviço e alertas de segurança</p>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <Badge variant="secondary" className="mt-0.5">Legítimo</Badge>
              <div>
                <p><strong className="text-foreground">Personalização:</strong> recomendar conteúdo relevante, adaptar a experiência com base em suas preferências e interesses</p>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <Badge variant="secondary" className="mt-0.5">Legítimo</Badge>
              <div>
                <p><strong className="text-foreground">Análise e melhorias:</strong> entender como a plataforma é utilizada, identificar problemas, desenvolver novos recursos</p>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <Badge variant="secondary" className="mt-0.5">Essencial</Badge>
              <div>
                <p><strong className="text-foreground">Segurança:</strong> detectar fraudes, spam e abusos; proteger a comunidade; cumprir obrigações legais</p>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <Badge variant="outline" className="mt-0.5">Consentimento</Badge>
              <div>
                <p><strong className="text-foreground">Marketing:</strong> enviar newsletters e comunicações promocionais (apenas com seu consentimento explícito)</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Section 3 */}
      <section className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <Share2 className="h-6 w-6 text-primary" />
          <h2 className="text-2xl font-bold">3. Compartilhamento de Dados</h2>
        </div>
        <div className="space-y-4 text-muted-foreground pl-9">
          <p>Podemos compartilhar seus dados nas seguintes circunstâncias:</p>
          
          <ul className="space-y-3 list-disc pl-5">
            <li>
              <strong className="text-foreground">Conteúdo público:</strong> perguntas, respostas, comentários e informações de perfil são visíveis publicamente. 
              Seu nome de usuário e avatar aparecem junto ao conteúdo que você publica.
            </li>
            <li>
              <strong className="text-foreground">Prestadores de serviços:</strong> compartilhamos dados com empresas que nos ajudam a operar a plataforma 
              (hospedagem, análise, e-mail), sob contratos de confidencialidade.
            </li>
            <li>
              <strong className="text-foreground">Requisitos legais:</strong> podemos divulgar dados quando exigido por lei, ordem judicial ou para 
              proteger direitos, propriedade ou segurança da Alldev e seus usuários.
            </li>
            <li>
              <strong className="text-foreground">Transações corporativas:</strong> em caso de fusão, aquisição ou venda de ativos, seus dados podem 
              ser transferidos como parte da transação, com aviso prévio.
            </li>
          </ul>

          <Card className="bg-muted/50 mt-4">
            <CardContent className="p-4">
              <p className="text-sm">
                <strong className="text-foreground">Importante:</strong> Nunca vendemos seus dados pessoais para terceiros. 
                Não compartilhamos seu e-mail ou informações privadas com anunciantes.
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
          <p>Implementamos medidas técnicas e organizacionais para proteger seus dados:</p>
          
          <ul className="space-y-2 list-disc pl-5">
            <li><strong className="text-foreground">Criptografia:</strong> todas as comunicações são protegidas por HTTPS/TLS. Senhas são armazenadas com hash bcrypt</li>
            <li><strong className="text-foreground">Controle de acesso:</strong> acesso a dados restrito a funcionários autorizados sob princípio do menor privilégio</li>
            <li><strong className="text-foreground">Monitoramento:</strong> sistemas de detecção de intrusão e logs de auditoria</li>
            <li><strong className="text-foreground">Backups:</strong> backups criptografados regulares com recuperação de desastres</li>
            <li><strong className="text-foreground">Avaliações:</strong> testes de segurança periódicos e atualizações de vulnerabilidades</li>
          </ul>

          <p>
            Apesar de nossos esforços, nenhum sistema é 100% seguro. Caso ocorra uma violação de dados 
            que afete suas informações, notificaremos você e as autoridades competentes conforme exigido pela LGPD.
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
          <p>Mantemos seus dados pelo tempo necessário para as finalidades descritas:</p>
          
          <ul className="space-y-2 list-disc pl-5">
            <li><strong className="text-foreground">Conta ativa:</strong> dados mantidos enquanto sua conta estiver ativa</li>
            <li><strong className="text-foreground">Após exclusão da conta:</strong> dados de identificação removidos em até 30 dias; conteúdo público pode ser anonimizado e mantido</li>
            <li><strong className="text-foreground">Logs de segurança:</strong> mantidos por até 12 meses para investigação de incidentes</li>
            <li><strong className="text-foreground">Obrigações legais:</strong> alguns dados podem ser retidos por períodos mais longos quando exigido por lei</li>
          </ul>
        </div>
      </section>

      {/* Section 6 */}
      <section className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <UserCheck className="h-6 w-6 text-primary" />
          <h2 className="text-2xl font-bold">6. Seus Direitos (LGPD)</h2>
        </div>
        <div className="space-y-4 text-muted-foreground pl-9">
          <p>De acordo com a Lei Geral de Proteção de Dados (LGPD), você tem os seguintes direitos:</p>
          
          <div className="grid gap-3 md:grid-cols-2">
            <Card>
              <CardContent className="p-4">
                <h4 className="font-semibold mb-1">Confirmação e Acesso</h4>
                <p className="text-sm">Confirmar se tratamos seus dados e acessar uma cópia</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4">
                <h4 className="font-semibold mb-1">Correção</h4>
                <p className="text-sm">Corrigir dados incompletos, inexatos ou desatualizados</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4">
                <h4 className="font-semibold mb-1">Anonimização/Bloqueio</h4>
                <p className="text-sm">Anonimizar, bloquear ou eliminar dados desnecessários</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4">
                <h4 className="font-semibold mb-1">Portabilidade</h4>
                <p className="text-sm">Receber seus dados em formato estruturado</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4">
                <h4 className="font-semibold mb-1">Eliminação</h4>
                <p className="text-sm">Solicitar exclusão de dados tratados com consentimento</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4">
                <h4 className="font-semibold mb-1">Revogação</h4>
                <p className="text-sm">Revogar consentimento a qualquer momento</p>
              </CardContent>
            </Card>
          </div>

          <p className="mt-4">
            Para exercer seus direitos, acesse as configurações de privacidade em seu perfil ou 
            entre em contato conosco pelo e-mail <strong className="text-foreground">privacidade@alldev.com.br</strong>. 
            Responderemos em até 15 dias úteis.
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
          <p>
            A Alldev não é destinada a menores de 16 anos. Não coletamos intencionalmente dados 
            de crianças. Se você é pai/mãe ou responsável e acredita que seu filho forneceu dados 
            para nós, entre em contato para que possamos tomar as medidas apropriadas.
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
          <p>
            Nossos servidores estão localizados no Brasil e nos Estados Unidos. Se você está 
            acessando de outro país, seus dados podem ser transferidos internacionalmente. 
            Garantimos que tais transferências cumpram as exigências da LGPD através de 
            cláusulas contratuais padrão e outras salvaguardas apropriadas.
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
          <p>
            Você pode solicitar a exclusão da sua conta a qualquer momento nas configurações do perfil. 
            Ao excluir sua conta:
          </p>
          <ul className="space-y-2 list-disc pl-5">
            <li>Seus dados de perfil serão removidos permanentemente</li>
            <li>Seu conteúdo público (perguntas, respostas) será anonimizado, não excluído, para preservar a integridade das discussões</li>
            <li>Seus votos e interações serão mantidos de forma anônima</li>
            <li>E-mails transacionais cessarão imediatamente</li>
          </ul>
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
              Para questões sobre esta Política de Privacidade ou para exercer seus direitos:
            </p>
            <ul className="space-y-2 text-muted-foreground">
              <li><strong className="text-foreground">Encarregado de Dados (DPO):</strong> João Silva</li>
              <li><strong className="text-foreground">E-mail:</strong> privacidade@alldev.com.br</li>
              <li><strong className="text-foreground">Página de Contato:</strong> <Link to="/contact" className="text-primary hover:underline">alldev.com.br/contato</Link></li>
            </ul>
            <p className="text-sm text-muted-foreground mt-4">
              Você também pode registrar uma reclamação junto à Autoridade Nacional de Proteção de Dados (ANPD).
            </p>
          </CardContent>
        </Card>
      </section>

      {/* Related Links */}
      <section className="text-center mt-12">
        <p className="text-muted-foreground mb-4">Documentos relacionados:</p>
        <div className="flex justify-center gap-4 flex-wrap">
          <Link to="/terms" className="text-primary hover:underline">Termos de Uso</Link>
          <span className="text-muted-foreground">•</span>
          <Link to="/cookies" className="text-primary hover:underline">Política de Cookies</Link>
          <span className="text-muted-foreground">•</span>
          <Link to="/contact" className="text-primary hover:underline">Contato</Link>
        </div>
      </section>
    </div>
  );
}
