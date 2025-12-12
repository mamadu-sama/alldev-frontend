import { useState, useMemo } from 'react';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { 
  Search, 
  HelpCircle, 
  User, 
  Shield, 
  Code, 
  MessageSquare, 
  Award, 
  Settings,
  CreditCard,
  AlertTriangle
} from 'lucide-react';

interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category: string;
}

const faqData: FAQItem[] = [
  // Conta e Perfil
  {
    id: '1',
    category: 'Conta e Perfil',
    question: 'Como crio uma conta na Alldev?',
    answer: 'Para criar uma conta, clique em "Registar" no canto superior direito da página. Preencha o formulário com o seu nome, email e uma palavra-passe segura. Após o registo, receberá um email de confirmação para ativar a sua conta.'
  },
  {
    id: '2',
    category: 'Conta e Perfil',
    question: 'Como posso alterar a minha palavra-passe?',
    answer: 'Aceda às Configurações do seu perfil, selecione "Segurança" e clique em "Alterar Palavra-passe". Será necessário inserir a palavra-passe atual e a nova palavra-passe duas vezes para confirmação.'
  },
  {
    id: '3',
    category: 'Conta e Perfil',
    question: 'Posso alterar o meu nome de utilizador?',
    answer: 'Sim, pode alterar o seu nome de utilizador uma vez a cada 30 dias. Aceda às Configurações do perfil e edite o campo "Nome de Utilizador". Note que o seu URL de perfil também será atualizado.'
  },
  {
    id: '4',
    category: 'Conta e Perfil',
    question: 'Como elimino a minha conta permanentemente?',
    answer: 'Aceda a Configurações > Conta > Eliminar Conta. Esta ação é irreversível e eliminará todos os seus dados, publicações e comentários. O seu conteúdo será anonimizado para manter a integridade das discussões existentes.'
  },
  // Publicações e Conteúdo
  {
    id: '5',
    category: 'Publicações e Conteúdo',
    question: 'Como crio uma nova publicação?',
    answer: 'Clique no botão "Nova Publicação" no menu principal. Escolha um título descritivo, escreva o conteúdo utilizando Markdown para formatação, adicione tags relevantes (1-5 tags) e clique em "Publicar". Utilize a pré-visualização para verificar a formatação antes de publicar.'
  },
  {
    id: '6',
    category: 'Publicações e Conteúdo',
    question: 'Que formatação posso usar nas publicações?',
    answer: 'Suportamos Markdown completo incluindo: cabeçalhos (#, ##, ###), negrito (**texto**), itálico (*texto*), listas, links, imagens, citações (>), e blocos de código com syntax highlighting. Basta especificar a linguagem após os três backticks (```javascript).'
  },
  {
    id: '7',
    category: 'Publicações e Conteúdo',
    question: 'Posso editar ou eliminar as minhas publicações?',
    answer: 'Sim, pode editar as suas publicações a qualquer momento clicando no ícone de edição. Publicações podem ser eliminadas se não tiverem respostas aceites. Edições ficam registadas no histórico para transparência da comunidade.'
  },
  {
    id: '8',
    category: 'Publicações e Conteúdo',
    question: 'Como adiciono código com syntax highlighting?',
    answer: 'Utilize três backticks (```) seguidos do nome da linguagem. Por exemplo: ```python para Python, ```javascript para JavaScript, ```typescript para TypeScript. O código será automaticamente formatado com cores apropriadas.'
  },
  // Comentários e Respostas
  {
    id: '9',
    category: 'Comentários e Respostas',
    question: 'Como marco uma resposta como aceite?',
    answer: 'Apenas o autor da publicação pode aceitar uma resposta. Clique no ícone de verificação (✓) ao lado da resposta que melhor resolve a sua questão. Isto ajuda outros utilizadores a encontrar a solução e recompensa quem respondeu.'
  },
  {
    id: '10',
    category: 'Comentários e Respostas',
    question: 'Posso comentar em qualquer publicação?',
    answer: 'Sim, desde que tenha uma conta ativa. Algumas publicações podem ter comentários bloqueados pelos moderadores se houver violações das regras. Respeite sempre as diretrizes da comunidade nos seus comentários.'
  },
  {
    id: '11',
    category: 'Comentários e Respostas',
    question: 'Como respondo a um comentário específico?',
    answer: 'Clique em "Responder" abaixo do comentário que deseja responder. Pode também mencionar utilizadores usando @username para notificá-los diretamente da sua resposta.'
  },
  // Sistema de Reputação
  {
    id: '12',
    category: 'Reputação e Conquistas',
    question: 'Como funciona o sistema de reputação?',
    answer: 'Ganha reputação através de contribuições positivas: +10 por voto positivo nas suas publicações, +5 por voto positivo nos comentários, +15 por resposta aceite, +2 por cada publicação. Perde reputação com votos negativos (-2 por voto).'
  },
  {
    id: '13',
    category: 'Reputação e Conquistas',
    question: 'Quais são os níveis de utilizador?',
    answer: 'Os níveis são: Novato (0-99 pontos), Contribuidor (100-499 pontos), Expert (500-1999 pontos), Guru (2000+ pontos). Cada nível desbloqueia novas funcionalidades e privilégios na plataforma.'
  },
  {
    id: '14',
    category: 'Reputação e Conquistas',
    question: 'O que são badges e como os obtenho?',
    answer: 'Badges são conquistas que reconhecem diferentes tipos de contribuição: "Primeira Resposta", "Ajudante" (10 respostas aceites), "Especialista" (em determinada tag), "Veterano" (1 ano de membro), entre outros. São exibidos no seu perfil.'
  },
  // Tags e Pesquisa
  {
    id: '15',
    category: 'Tags e Pesquisa',
    question: 'Como uso as tags eficientemente?',
    answer: 'Escolha 1-5 tags relevantes para a sua publicação. Use tags específicas (ex: "react-hooks" em vez de apenas "react") para melhor descoberta. Tags populares ajudam mais utilizadores a encontrar o seu conteúdo.'
  },
  {
    id: '16',
    category: 'Tags e Pesquisa',
    question: 'Posso seguir tags específicas?',
    answer: 'Sim, pode seguir tags para personalizar o seu feed. Clique em "Seguir" na página da tag. As publicações com essas tags aparecerão prioritariamente no seu feed e receberá notificações de novas publicações.'
  },
  {
    id: '17',
    category: 'Tags e Pesquisa',
    question: 'Como funciona a pesquisa avançada?',
    answer: 'Use filtros como: [tag:javascript], [user:username], [is:resolved], [is:unanswered]. Combine múltiplos filtros para resultados precisos. A pesquisa considera título, conteúdo e tags das publicações.'
  },
  // Moderação e Regras
  {
    id: '18',
    category: 'Moderação e Regras',
    question: 'Quais são as regras da comunidade?',
    answer: 'As principais regras incluem: ser respeitoso com todos os membros, não publicar spam ou conteúdo promocional, manter discussões técnicas e relevantes, não plagiar conteúdo, e seguir as leis aplicáveis. Consulte as Diretrizes Completas para mais detalhes.'
  },
  {
    id: '19',
    category: 'Moderação e Regras',
    question: 'Como denuncio conteúdo inapropriado?',
    answer: 'Clique no ícone de três pontos (...) ao lado de qualquer publicação ou comentário e selecione "Denunciar". Escolha o motivo da denúncia e adicione detalhes se necessário. Nossa equipa de moderação analisará em até 24 horas.'
  },
  {
    id: '20',
    category: 'Moderação e Regras',
    question: 'O que acontece se violar as regras?',
    answer: 'Dependendo da gravidade: 1ª violação - aviso, 2ª violação - suspensão temporária (7 dias), 3ª violação - suspensão prolongada (30 dias), violações graves - banimento permanente. Pode recorrer das decisões contactando-nos.'
  },
  // Privacidade e Segurança
  {
    id: '21',
    category: 'Privacidade e Segurança',
    question: 'Como protegem os meus dados?',
    answer: 'Utilizamos encriptação SSL/TLS para todas as comunicações, armazenamos palavras-passe com hash seguro, não partilhamos dados com terceiros sem consentimento, e cumprimos o RGPD. Consulte a nossa Política de Privacidade para detalhes completos.'
  },
  {
    id: '22',
    category: 'Privacidade e Segurança',
    question: 'Posso tornar o meu perfil privado?',
    answer: 'Parcialmente. Pode ocultar email, localização e redes sociais. No entanto, as suas publicações e comentários permanecem públicos para manter a natureza aberta da comunidade. Pode eliminar conteúdo específico se desejar.'
  },
  {
    id: '23',
    category: 'Privacidade e Segurança',
    question: 'Como ativo a autenticação de dois fatores?',
    answer: 'Aceda a Configurações > Segurança > Autenticação de Dois Fatores. Pode escolher entre app autenticadora (recomendado) ou SMS. Guarde os códigos de recuperação num local seguro para acesso de emergência.'
  },
  // Técnico e API
  {
    id: '24',
    category: 'API e Integrações',
    question: 'A Alldev tem uma API pública?',
    answer: 'Sim, oferecemos uma API REST para desenvolvedores. Permite aceder a publicações, utilizadores, tags e pesquisas. Registe-se para obter uma chave API nas Configurações do Desenvolvedor. Rate limit: 100 requests/minuto.'
  },
  {
    id: '25',
    category: 'API e Integrações',
    question: 'Posso incorporar publicações noutros sites?',
    answer: 'Sim, cada publicação tem um botão "Incorporar" que gera um código iframe. O embed inclui o conteúdo formatado, autor e link para a discussão original. Ideal para blogs e documentação.'
  },
  // Suporte
  {
    id: '26',
    category: 'Suporte',
    question: 'Como contacto o suporte?',
    answer: 'Utilize o formulário na página de Contacto, envie email para suporte@alldev.com, ou use o chat ao vivo (disponível em dias úteis das 9h às 18h). Tempo médio de resposta: 24 horas para email, imediato para chat.'
  },
  {
    id: '27',
    category: 'Suporte',
    question: 'Encontrei um bug, como reporto?',
    answer: 'Agradecemos reports de bugs! Use o formulário "Reportar Bug" nas Configurações ou envie detalhes para bugs@alldev.com. Inclua: descrição do problema, passos para reproduzir, browser/dispositivo utilizado, e screenshots se possível.'
  },
  {
    id: '28',
    category: 'Suporte',
    question: 'Como sugiro novas funcionalidades?',
    answer: 'Visite a página "Contribuir com Funcionalidades" onde pode submeter ideias, votar em sugestões existentes e participar em discussões sobre o futuro da plataforma. As sugestões mais votadas são priorizadas no nosso roadmap.'
  },
];

const categories = [
  { name: 'Conta e Perfil', icon: User, color: 'bg-blue-500/10 text-blue-500' },
  { name: 'Publicações e Conteúdo', icon: Code, color: 'bg-green-500/10 text-green-500' },
  { name: 'Comentários e Respostas', icon: MessageSquare, color: 'bg-purple-500/10 text-purple-500' },
  { name: 'Reputação e Conquistas', icon: Award, color: 'bg-yellow-500/10 text-yellow-500' },
  { name: 'Tags e Pesquisa', icon: Search, color: 'bg-cyan-500/10 text-cyan-500' },
  { name: 'Moderação e Regras', icon: Shield, color: 'bg-red-500/10 text-red-500' },
  { name: 'Privacidade e Segurança', icon: AlertTriangle, color: 'bg-orange-500/10 text-orange-500' },
  { name: 'API e Integrações', icon: Settings, color: 'bg-indigo-500/10 text-indigo-500' },
  { name: 'Suporte', icon: HelpCircle, color: 'bg-pink-500/10 text-pink-500' },
];

const FAQ = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const filteredFAQs = useMemo(() => {
    return faqData.filter((item) => {
      const matchesSearch =
        searchQuery === '' ||
        item.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.answer.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesCategory =
        selectedCategory === null || item.category === selectedCategory;

      return matchesSearch && matchesCategory;
    });
  }, [searchQuery, selectedCategory]);

  const groupedFAQs = useMemo(() => {
    const groups: Record<string, FAQItem[]> = {};
    filteredFAQs.forEach((item) => {
      if (!groups[item.category]) {
        groups[item.category] = [];
      }
      groups[item.category].push(item);
    });
    return groups;
  }, [filteredFAQs]);

  const getCategoryInfo = (categoryName: string) => {
    return categories.find((c) => c.name === categoryName) || categories[0];
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-full mb-4">
            <HelpCircle className="h-8 w-8 text-primary" />
          </div>
          <h1 className="text-4xl font-bold text-foreground mb-4">
            Perguntas Frequentes
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Encontre respostas para as dúvidas mais comuns sobre a Alldev. 
            Não encontrou o que procura? Contacte-nos!
          </p>
        </div>

        {/* Search */}
        <div className="relative mb-8">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <Input
            placeholder="Pesquisar nas perguntas frequentes..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-12 py-6 text-lg bg-card"
          />
        </div>

        {/* Categories */}
        <div className="flex flex-wrap gap-2 mb-8">
          <Badge
            variant={selectedCategory === null ? 'default' : 'outline'}
            className="cursor-pointer px-4 py-2"
            onClick={() => setSelectedCategory(null)}
          >
            Todas ({faqData.length})
          </Badge>
          {categories.map((category) => {
            const count = faqData.filter((f) => f.category === category.name).length;
            const Icon = category.icon;
            return (
              <Badge
                key={category.name}
                variant={selectedCategory === category.name ? 'default' : 'outline'}
                className="cursor-pointer px-4 py-2"
                onClick={() => setSelectedCategory(category.name)}
              >
                <Icon className="h-3 w-3 mr-1" />
                {category.name} ({count})
              </Badge>
            );
          })}
        </div>

        {/* Results count */}
        {searchQuery && (
          <p className="text-muted-foreground mb-4">
            {filteredFAQs.length} resultado{filteredFAQs.length !== 1 ? 's' : ''} encontrado{filteredFAQs.length !== 1 ? 's' : ''}
          </p>
        )}

        {/* FAQ Items grouped by category */}
        {Object.keys(groupedFAQs).length === 0 ? (
          <Card className="p-8 text-center">
            <Search className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Nenhum resultado encontrado</h3>
            <p className="text-muted-foreground">
              Tente ajustar a sua pesquisa ou selecionar outra categoria.
            </p>
          </Card>
        ) : (
          <div className="space-y-8">
            {Object.entries(groupedFAQs).map(([category, items]) => {
              const categoryInfo = getCategoryInfo(category);
              const Icon = categoryInfo.icon;

              return (
                <Card key={category}>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-3">
                      <div className={`p-2 rounded-lg ${categoryInfo.color}`}>
                        <Icon className="h-5 w-5" />
                      </div>
                      {category}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Accordion type="single" collapsible className="w-full">
                      {items.map((item) => (
                        <AccordionItem key={item.id} value={item.id}>
                          <AccordionTrigger className="text-left hover:no-underline">
                            <span className="font-medium">{item.question}</span>
                          </AccordionTrigger>
                          <AccordionContent className="text-muted-foreground leading-relaxed">
                            {item.answer}
                          </AccordionContent>
                        </AccordionItem>
                      ))}
                    </Accordion>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}

        {/* Contact CTA */}
        <Card className="mt-10 bg-primary/5 border-primary/20">
          <CardContent className="p-8 text-center">
            <h3 className="text-xl font-semibold mb-2">
              Não encontrou a resposta que procurava?
            </h3>
            <p className="text-muted-foreground mb-4">
              A nossa equipa de suporte está pronta para ajudar.
            </p>
            <a href="/contact">
              <Badge variant="default" className="cursor-pointer px-6 py-2 text-base">
                Contactar Suporte
              </Badge>
            </a>
          </CardContent>
        </Card>
      </div>
  );
};

export default FAQ;
