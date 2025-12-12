import { FileText, Scale, AlertCircle, Shield, UserCheck, Ban, RefreshCw, Mail } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Link } from 'react-router-dom';

export default function TermsOfUse() {
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
          Última atualização: 10 de Dezembro de 2024
        </p>
      </div>

      {/* Introduction */}
      <Card className="mb-8">
        <CardContent className="p-6">
          <p className="text-muted-foreground leading-relaxed">
            Bem-vindo à Alldev! Estes Termos de Uso ("Termos") regem o acesso e uso da plataforma Alldev 
            ("Plataforma", "Serviço", "nós" ou "nosso"), uma comunidade online para desenvolvedores de software. 
            Ao acessar ou utilizar nossa Plataforma, você ("Usuário", "você") concorda em estar vinculado a estes Termos. 
            Se você não concordar com algum aspecto destes Termos, não utilize nossos serviços.
          </p>
        </CardContent>
      </Card>

      {/* Section 1 */}
      <section className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <Scale className="h-6 w-6 text-primary" />
          <h2 className="text-2xl font-bold">1. Aceitação dos Termos</h2>
        </div>
        <div className="space-y-4 text-muted-foreground pl-9">
          <p>
            1.1. Ao criar uma conta ou utilizar a Plataforma, você declara ter pelo menos 16 anos de idade 
            e capacidade legal para aceitar estes Termos.
          </p>
          <p>
            1.2. Se você estiver utilizando a Plataforma em nome de uma organização, você declara ter 
            autoridade para vincular essa organização a estes Termos.
          </p>
          <p>
            1.3. Reservamo-nos o direito de modificar estes Termos a qualquer momento. Notificaremos sobre 
            alterações significativas por e-mail ou através de aviso na Plataforma. O uso continuado após 
            tais modificações constitui aceitação dos novos Termos.
          </p>
        </div>
      </section>

      {/* Section 2 */}
      <section className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <UserCheck className="h-6 w-6 text-primary" />
          <h2 className="text-2xl font-bold">2. Cadastro e Conta</h2>
        </div>
        <div className="space-y-4 text-muted-foreground pl-9">
          <p>
            2.1. Para utilizar determinadas funcionalidades da Plataforma, você deve criar uma conta 
            fornecendo informações precisas e completas.
          </p>
          <p>
            2.2. Você é responsável por manter a confidencialidade de suas credenciais de acesso e por 
            todas as atividades realizadas em sua conta.
          </p>
          <p>
            2.3. Você concorda em notificar imediatamente a Alldev sobre qualquer uso não autorizado de 
            sua conta ou qualquer outra violação de segurança.
          </p>
          <p>
            2.4. Cada pessoa pode manter apenas uma conta ativa. Contas duplicadas podem ser encerradas 
            sem aviso prévio.
          </p>
          <p>
            2.5. A Alldev reserva-se o direito de recusar o registro ou cancelar contas a seu critério, 
            especialmente em casos de violação destes Termos.
          </p>
        </div>
      </section>

      {/* Section 3 */}
      <section className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <FileText className="h-6 w-6 text-primary" />
          <h2 className="text-2xl font-bold">3. Conteúdo do Usuário</h2>
        </div>
        <div className="space-y-4 text-muted-foreground pl-9">
          <p>
            3.1. <strong className="text-foreground">Licença de Conteúdo:</strong> Ao publicar conteúdo na Plataforma (perguntas, respostas, 
            comentários, código, etc.), você concede à Alldev uma licença mundial, não exclusiva, 
            isenta de royalties, sublicenciável e transferível para usar, reproduzir, modificar, 
            adaptar, publicar, traduzir e distribuir tal conteúdo.
          </p>
          <p>
            3.2. <strong className="text-foreground">Creative Commons:</strong> Todo o conteúdo textual contribuído pelos usuários é licenciado 
            sob Creative Commons Attribution-ShareAlike 4.0 International (CC BY-SA 4.0), permitindo 
            que outros compartilhem e adaptem o trabalho, desde que atribuam crédito adequado.
          </p>
          <p>
            3.3. <strong className="text-foreground">Código-fonte:</strong> Trechos de código compartilhados na Plataforma são disponibilizados 
            sob licença MIT, salvo indicação contrária do autor.
          </p>
          <p>
            3.4. Você declara e garante que possui todos os direitos necessários sobre o conteúdo que 
            publica e que tal conteúdo não viola direitos de terceiros.
          </p>
          <p>
            3.5. A Alldev não se responsabiliza pelo conteúdo publicado pelos usuários, mas reserva-se 
            o direito de remover qualquer conteúdo que viole estes Termos.
          </p>
        </div>
      </section>

      {/* Section 4 */}
      <section className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <Ban className="h-6 w-6 text-destructive" />
          <h2 className="text-2xl font-bold">4. Conduta Proibida</h2>
        </div>
        <div className="space-y-4 text-muted-foreground pl-9">
          <p>Ao utilizar a Plataforma, você concorda em NÃO:</p>
          <ul className="space-y-2 list-disc pl-5">
            <li>Publicar conteúdo ilegal, difamatório, obsceno, ameaçador, discriminatório ou que viole direitos de terceiros</li>
            <li>Fazer spam, autopromoção excessiva ou publicidade não autorizada</li>
            <li>Tentar acessar contas de outros usuários ou sistemas não autorizados</li>
            <li>Interferir no funcionamento da Plataforma ou sobrecarregar nossos servidores</li>
            <li>Coletar informações de outros usuários sem consentimento</li>
            <li>Usar bots, scrapers ou outros meios automatizados sem autorização</li>
            <li>Evadir suspensões ou banimentos criando novas contas</li>
            <li>Manipular o sistema de reputação através de votos falsos ou contas múltiplas</li>
            <li>Publicar malware, vírus ou código malicioso</li>
            <li>Assediar, intimidar ou perseguir outros usuários</li>
          </ul>
        </div>
      </section>

      {/* Section 5 */}
      <section className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <Shield className="h-6 w-6 text-primary" />
          <h2 className="text-2xl font-bold">5. Moderação e Penalidades</h2>
        </div>
        <div className="space-y-4 text-muted-foreground pl-9">
          <p>
            5.1. A Alldev emprega moderadores para manter a qualidade e segurança da comunidade. 
            Moderadores podem editar, ocultar ou remover conteúdo que viole estes Termos.
          </p>
          <p>
            5.2. Penalidades por violações podem incluir:
          </p>
          <ul className="space-y-2 list-disc pl-5">
            <li><strong className="text-foreground">Aviso:</strong> Notificação sobre comportamento inadequado</li>
            <li><strong className="text-foreground">Suspensão temporária:</strong> Bloqueio de acesso por período determinado (1 dia a 30 dias)</li>
            <li><strong className="text-foreground">Suspensão permanente:</strong> Banimento definitivo da Plataforma</li>
            <li><strong className="text-foreground">Remoção de conteúdo:</strong> Exclusão de posts, comentários ou perfil</li>
            <li><strong className="text-foreground">Redução de reputação:</strong> Perda de pontos de reputação</li>
          </ul>
          <p>
            5.3. Decisões de moderação podem ser contestadas através do sistema de apelação. 
            Recursos devem ser apresentados em até 7 dias após a penalidade.
          </p>
        </div>
      </section>

      {/* Section 6 */}
      <section className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <AlertCircle className="h-6 w-6 text-warning" />
          <h2 className="text-2xl font-bold">6. Isenção de Garantias</h2>
        </div>
        <div className="space-y-4 text-muted-foreground pl-9">
          <p>
            6.1. A Plataforma é fornecida "como está" e "conforme disponível", sem garantias de 
            qualquer tipo, expressas ou implícitas.
          </p>
          <p>
            6.2. Não garantimos que a Plataforma será ininterrupta, segura, livre de erros ou 
            que atenderá a suas expectativas específicas.
          </p>
          <p>
            6.3. O conteúdo publicado por usuários representa apenas as opiniões de seus autores. 
            A Alldev não endossa nem se responsabiliza por tais opiniões.
          </p>
          <p>
            6.4. Código-fonte e soluções técnicas compartilhados na Plataforma são fornecidos 
            para fins educacionais. Use-os por sua conta e risco.
          </p>
        </div>
      </section>

      {/* Section 7 */}
      <section className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <Scale className="h-6 w-6 text-primary" />
          <h2 className="text-2xl font-bold">7. Limitação de Responsabilidade</h2>
        </div>
        <div className="space-y-4 text-muted-foreground pl-9">
          <p>
            7.1. Na extensão máxima permitida pela lei aplicável, a Alldev não será responsável 
            por quaisquer danos indiretos, incidentais, especiais, consequenciais ou punitivos 
            decorrentes do uso ou incapacidade de uso da Plataforma.
          </p>
          <p>
            7.2. Nossa responsabilidade total por quaisquer reclamações relacionadas a estes 
            Termos não excederá o valor pago por você à Alldev nos últimos 12 meses, se aplicável.
          </p>
        </div>
      </section>

      {/* Section 8 */}
      <section className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <RefreshCw className="h-6 w-6 text-primary" />
          <h2 className="text-2xl font-bold">8. Alterações e Encerramento</h2>
        </div>
        <div className="space-y-4 text-muted-foreground pl-9">
          <p>
            8.1. Podemos modificar, suspender ou descontinuar qualquer aspecto da Plataforma a 
            qualquer momento, com ou sem aviso prévio.
          </p>
          <p>
            8.2. Você pode encerrar sua conta a qualquer momento através das configurações de perfil. 
            Ao encerrar, seu conteúdo permanecerá na Plataforma sob as licenças concedidas.
          </p>
          <p>
            8.3. Reservamo-nos o direito de encerrar ou suspender sua conta por violação destes 
            Termos ou por qualquer motivo razoável.
          </p>
        </div>
      </section>

      {/* Section 9 */}
      <section className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <Scale className="h-6 w-6 text-primary" />
          <h2 className="text-2xl font-bold">9. Disposições Gerais</h2>
        </div>
        <div className="space-y-4 text-muted-foreground pl-9">
          <p>
            9.1. <strong className="text-foreground">Lei Aplicável:</strong> Estes Termos são regidos pelas leis da República Federativa 
            do Brasil, independentemente de conflitos de disposições legais.
          </p>
          <p>
            9.2. <strong className="text-foreground">Foro:</strong> Fica eleito o foro da Comarca de São Paulo/SP para dirimir quaisquer 
            controvérsias decorrentes destes Termos.
          </p>
          <p>
            9.3. <strong className="text-foreground">Integralidade:</strong> Estes Termos, junto com nossa Política de Privacidade e Política 
            de Cookies, constituem o acordo integral entre você e a Alldev.
          </p>
          <p>
            9.4. <strong className="text-foreground">Autonomia das Cláusulas:</strong> Se qualquer disposição destes Termos for considerada 
            inválida, as demais disposições permanecerão em pleno vigor.
          </p>
        </div>
      </section>

      {/* Contact */}
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
              <li><strong className="text-foreground">E-mail:</strong> legal@alldev.com.br</li>
              <li><strong className="text-foreground">Página de Contato:</strong> <Link to="/contact" className="text-primary hover:underline">alldev.com.br/contato</Link></li>
            </ul>
          </CardContent>
        </Card>
      </section>

      {/* Related Links */}
      <section className="text-center mt-12">
        <p className="text-muted-foreground mb-4">Documentos relacionados:</p>
        <div className="flex justify-center gap-4 flex-wrap">
          <Link to="/privacy" className="text-primary hover:underline">Política de Privacidade</Link>
          <span className="text-muted-foreground">•</span>
          <Link to="/cookies" className="text-primary hover:underline">Política de Cookies</Link>
          <span className="text-muted-foreground">•</span>
          <Link to="/contribution-guide" className="text-primary hover:underline">Guia de Contribuição</Link>
        </div>
      </section>
    </div>
  );
}
