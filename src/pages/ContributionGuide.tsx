import { Book, CheckCircle, Code, Heart, MessageSquare, Star, ThumbsUp, Users, AlertTriangle, Lightbulb } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export default function ContributionGuide() {
  return (
    <div className="container max-w-4xl py-8 px-4">
      {/* Header */}
      <div className="text-center mb-12">
        <div className="flex justify-center mb-4">
          <div className="p-4 rounded-full bg-primary/10">
            <Book className="h-12 w-12 text-primary" />
          </div>
        </div>
        <h1 className="text-4xl font-bold mb-4">Guia de Contribuição</h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Aprenda como fazer parte da comunidade Alldev e contribuir de forma efetiva para o crescimento de todos.
        </p>
        <p className="text-sm text-muted-foreground mt-4">
          Última atualização: 10 de Dezembro de 2024
        </p>
      </div>

      {/* Welcome Section */}
      <section className="mb-10">
        <Card className="bg-gradient-to-r from-primary/5 to-secondary/5 border-primary/20">
          <CardContent className="p-6">
            <div className="flex items-start gap-4">
              <Heart className="h-8 w-8 text-primary flex-shrink-0 mt-1" />
              <div>
                <h2 className="text-2xl font-semibold mb-2">Bem-vindo à Alldev!</h2>
                <p className="text-muted-foreground">
                  A Alldev é uma comunidade colaborativa de desenvolvedores brasileiros. Aqui, todos podem aprender, 
                  ensinar e crescer juntos. Seja você um iniciante dando os primeiros passos ou um veterano com 
                  anos de experiência, sua contribuição é valiosa e bem-vinda.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* How to Contribute */}
      <section className="mb-10">
        <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
          <Users className="h-6 w-6 text-primary" />
          Como Contribuir
        </h2>
        
        <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <MessageSquare className="h-5 w-5 text-primary" />
                Faça Perguntas
              </CardTitle>
            </CardHeader>
            <CardContent className="text-muted-foreground">
              <ul className="space-y-2">
                <li>• Pesquise antes para evitar duplicatas</li>
                <li>• Seja específico e claro no título</li>
                <li>• Inclua código relevante e mensagens de erro</li>
                <li>• Mencione tecnologias e versões utilizadas</li>
                <li>• Use as tags apropriadas</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <CheckCircle className="h-5 w-5 text-success" />
                Responda Perguntas
              </CardTitle>
            </CardHeader>
            <CardContent className="text-muted-foreground">
              <ul className="space-y-2">
                <li>• Leia a pergunta com atenção antes de responder</li>
                <li>• Forneça explicações claras e didáticas</li>
                <li>• Inclua exemplos de código quando possível</li>
                <li>• Cite fontes e documentações oficiais</li>
                <li>• Seja paciente com iniciantes</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <ThumbsUp className="h-5 w-5 text-primary" />
                Vote no Conteúdo
              </CardTitle>
            </CardHeader>
            <CardContent className="text-muted-foreground">
              <ul className="space-y-2">
                <li>• Upvote perguntas bem formuladas</li>
                <li>• Upvote respostas úteis e corretas</li>
                <li>• Downvote conteúdo incorreto ou spam</li>
                <li>• Seu voto ajuda a destacar conteúdo de qualidade</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Code className="h-5 w-5 text-secondary" />
                Compartilhe Conhecimento
              </CardTitle>
            </CardHeader>
            <CardContent className="text-muted-foreground">
              <ul className="space-y-2">
                <li>• Escreva tutoriais e artigos técnicos</li>
                <li>• Compartilhe dicas e boas práticas</li>
                <li>• Documente soluções para problemas comuns</li>
                <li>• Contribua com projetos open source</li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Writing Quality Posts */}
      <section className="mb-10">
        <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
          <Lightbulb className="h-6 w-6 text-warning" />
          Escrevendo Posts de Qualidade
        </h2>
        
        <Card>
          <CardContent className="p-6 space-y-6">
            <div>
              <h3 className="font-semibold text-lg mb-3">Título</h3>
              <p className="text-muted-foreground mb-2">
                O título é a primeira impressão da sua pergunta. Ele deve ser claro, específico e resumir o problema.
              </p>
              <div className="bg-muted/50 p-4 rounded-lg space-y-2">
                <p className="text-destructive flex items-center gap-2">
                  <span className="font-mono">✗</span> "Ajuda com React"
                </p>
                <p className="text-success flex items-center gap-2">
                  <span className="font-mono">✓</span> "Como resolver erro 'Cannot read property map of undefined' no React ao carregar dados da API?"
                </p>
              </div>
            </div>

            <div>
              <h3 className="font-semibold text-lg mb-3">Corpo do Post</h3>
              <ul className="space-y-2 text-muted-foreground">
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 text-success mt-1 flex-shrink-0" />
                  <span><strong>Contexto:</strong> Explique o que você está tentando fazer</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 text-success mt-1 flex-shrink-0" />
                  <span><strong>Problema:</strong> Descreva exatamente o que está acontecendo</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 text-success mt-1 flex-shrink-0" />
                  <span><strong>Código:</strong> Inclua código relevante formatado corretamente</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 text-success mt-1 flex-shrink-0" />
                  <span><strong>Tentativas:</strong> Mencione o que você já tentou</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 text-success mt-1 flex-shrink-0" />
                  <span><strong>Ambiente:</strong> Versões, sistema operacional, etc.</span>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold text-lg mb-3">Formatação com Markdown</h3>
              <p className="text-muted-foreground mb-3">
                Use Markdown para formatar seu conteúdo e torná-lo mais legível:
              </p>
              <div className="bg-muted/50 p-4 rounded-lg font-mono text-sm space-y-1">
                <p># Título</p>
                <p>## Subtítulo</p>
                <p>**negrito** e *itálico*</p>
                <p>`código inline`</p>
                <p>```javascript</p>
                <p>// bloco de código</p>
                <p>```</p>
                <p>- lista</p>
                <p>[link](url)</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Reputation System */}
      <section className="mb-10">
        <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
          <Star className="h-6 w-6 text-warning" />
          Sistema de Reputação
        </h2>
        
        <Card>
          <CardContent className="p-6">
            <p className="text-muted-foreground mb-6">
              A reputação reflete sua contribuição para a comunidade. Quanto mais você ajuda, mais reputação ganha.
            </p>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                <span>Sua pergunta recebe upvote</span>
                <Badge variant="secondary" className="bg-success/10 text-success">+5 pontos</Badge>
              </div>
              <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                <span>Sua resposta recebe upvote</span>
                <Badge variant="secondary" className="bg-success/10 text-success">+10 pontos</Badge>
              </div>
              <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                <span>Sua resposta é aceita como solução</span>
                <Badge variant="secondary" className="bg-success/10 text-success">+25 pontos</Badge>
              </div>
              <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                <span>Você aceita uma resposta</span>
                <Badge variant="secondary" className="bg-success/10 text-success">+2 pontos</Badge>
              </div>
              <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                <span>Seu post/resposta recebe downvote</span>
                <Badge variant="secondary" className="bg-destructive/10 text-destructive">-2 pontos</Badge>
              </div>
            </div>

            <div className="mt-6">
              <h3 className="font-semibold mb-3">Níveis de Reputação</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <div className="text-center p-3 bg-muted/50 rounded-lg">
                  <Badge className="bg-muted text-muted-foreground mb-2">Novato</Badge>
                  <p className="text-sm text-muted-foreground">0 - 99</p>
                </div>
                <div className="text-center p-3 bg-muted/50 rounded-lg">
                  <Badge className="bg-primary/20 text-primary mb-2">Contribuidor</Badge>
                  <p className="text-sm text-muted-foreground">100 - 499</p>
                </div>
                <div className="text-center p-3 bg-muted/50 rounded-lg">
                  <Badge className="bg-secondary/20 text-secondary mb-2">Expert</Badge>
                  <p className="text-sm text-muted-foreground">500 - 1999</p>
                </div>
                <div className="text-center p-3 bg-muted/50 rounded-lg">
                  <Badge className="bg-warning/20 text-warning mb-2">Guru</Badge>
                  <p className="text-sm text-muted-foreground">2000+</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Community Guidelines */}
      <section className="mb-10">
        <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
          <AlertTriangle className="h-6 w-6 text-warning" />
          Diretrizes da Comunidade
        </h2>
        
        <Card>
          <CardContent className="p-6 space-y-4">
            <div className="flex items-start gap-3">
              <CheckCircle className="h-5 w-5 text-success mt-0.5" />
              <div>
                <h3 className="font-semibold">Seja Respeitoso</h3>
                <p className="text-muted-foreground">Trate todos com respeito, independente do nível de experiência.</p>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <CheckCircle className="h-5 w-5 text-success mt-0.5" />
              <div>
                <h3 className="font-semibold">Seja Construtivo</h3>
                <p className="text-muted-foreground">Críticas devem ser construtivas e focadas em melhorar o conteúdo.</p>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <CheckCircle className="h-5 w-5 text-success mt-0.5" />
              <div>
                <h3 className="font-semibold">Mantenha o Foco</h3>
                <p className="text-muted-foreground">Discussões devem ser relacionadas a desenvolvimento de software.</p>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <CheckCircle className="h-5 w-5 text-success mt-0.5" />
              <div>
                <h3 className="font-semibold">Evite Spam</h3>
                <p className="text-muted-foreground">Não faça autopromoção excessiva ou posts irrelevantes.</p>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <CheckCircle className="h-5 w-5 text-success mt-0.5" />
              <div>
                <h3 className="font-semibold">Cite Fontes</h3>
                <p className="text-muted-foreground">Sempre dê crédito quando usar código ou ideias de terceiros.</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* CTA */}
      <section className="text-center">
        <Card className="bg-gradient-to-r from-primary/10 to-secondary/10 border-primary/20">
          <CardContent className="p-8">
            <h2 className="text-2xl font-bold mb-4">Pronto para Começar?</h2>
            <p className="text-muted-foreground mb-6">
              Agora que você conhece as diretrizes, junte-se à nossa comunidade e comece a contribuir!
            </p>
            <div className="flex justify-center gap-4 flex-wrap">
              <Badge className="text-base py-2 px-4">+15.000 desenvolvedores</Badge>
              <Badge variant="outline" className="text-base py-2 px-4">+50.000 perguntas respondidas</Badge>
            </div>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
