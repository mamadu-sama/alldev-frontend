import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Lightbulb, 
  ThumbsUp, 
  MessageSquare, 
  Clock, 
  CheckCircle2, 
  Circle,
  Rocket,
  Users,
  Code,
  GitBranch,
  ArrowUp,
  Filter
} from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { toast } from 'sonner';

interface FeatureSuggestion {
  id: string;
  title: string;
  description: string;
  author: string;
  authorAvatar: string;
  votes: number;
  comments: number;
  status: 'pending' | 'reviewing' | 'planned' | 'in-progress' | 'completed' | 'declined';
  category: string;
  createdAt: string;
  hasVoted: boolean;
}

const mockSuggestions: FeatureSuggestion[] = [
  {
    id: '1',
    title: 'Modo escuro automático baseado no sistema',
    description: 'Implementar deteção automática do tema do sistema operativo e alternar entre modo claro/escuro automaticamente.',
    author: 'Maria Santos',
    authorAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=maria',
    votes: 342,
    comments: 28,
    status: 'in-progress',
    category: 'Interface',
    createdAt: '2024-01-10',
    hasVoted: false,
  },
  {
    id: '2',
    title: 'Integração com GitHub para importar repositórios',
    description: 'Permitir que utilizadores conectem a conta GitHub e importem informações dos seus repositórios para o perfil Alldev.',
    author: 'João Pedro',
    authorAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=joao',
    votes: 289,
    comments: 45,
    status: 'planned',
    category: 'Integrações',
    createdAt: '2024-01-08',
    hasVoted: true,
  },
  {
    id: '3',
    title: 'Sistema de mentoria entre membros',
    description: 'Criar um sistema onde membros experientes possam oferecer mentoria a iniciantes, com agendamento de sessões e tracking de progresso.',
    author: 'Ana Costa',
    authorAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=ana',
    votes: 256,
    comments: 67,
    status: 'reviewing',
    category: 'Comunidade',
    createdAt: '2024-01-05',
    hasVoted: false,
  },
  {
    id: '4',
    title: 'Notificações por email personalizáveis',
    description: 'Permitir que utilizadores escolham quais tipos de notificações recebem por email e com que frequência.',
    author: 'Carlos Mendes',
    authorAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=carlos',
    votes: 198,
    comments: 12,
    status: 'completed',
    category: 'Notificações',
    createdAt: '2023-12-20',
    hasVoted: true,
  },
  {
    id: '5',
    title: 'Editor de código colaborativo em tempo real',
    description: 'Adicionar funcionalidade de edição colaborativa de código em tempo real nas publicações, similar ao CodePen.',
    author: 'Rita Ferreira',
    authorAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=rita',
    votes: 445,
    comments: 89,
    status: 'pending',
    category: 'Funcionalidades',
    createdAt: '2024-01-12',
    hasVoted: false,
  },
  {
    id: '6',
    title: 'App móvel nativa',
    description: 'Desenvolver aplicações nativas para iOS e Android com todas as funcionalidades da versão web.',
    author: 'Pedro Oliveira',
    authorAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=pedro',
    votes: 567,
    comments: 123,
    status: 'planned',
    category: 'Mobile',
    createdAt: '2023-11-15',
    hasVoted: true,
  },
  {
    id: '7',
    title: 'Sistema de desafios de programação',
    description: 'Criar desafios semanais de programação com rankings, badges e prémios para os melhores classificados.',
    author: 'Sofia Lima',
    authorAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=sofia',
    votes: 312,
    comments: 56,
    status: 'reviewing',
    category: 'Gamificação',
    createdAt: '2024-01-02',
    hasVoted: false,
  },
];

const statusConfig = {
  'pending': { label: 'Pendente', color: 'bg-gray-500/10 text-gray-500', icon: Circle },
  'reviewing': { label: 'Em Análise', color: 'bg-yellow-500/10 text-yellow-500', icon: Clock },
  'planned': { label: 'Planeado', color: 'bg-blue-500/10 text-blue-500', icon: GitBranch },
  'in-progress': { label: 'Em Desenvolvimento', color: 'bg-purple-500/10 text-purple-500', icon: Code },
  'completed': { label: 'Concluído', color: 'bg-green-500/10 text-green-500', icon: CheckCircle2 },
  'declined': { label: 'Recusado', color: 'bg-red-500/10 text-red-500', icon: Circle },
};

const categories = [
  'Interface',
  'Funcionalidades',
  'Integrações',
  'Comunidade',
  'Notificações',
  'Mobile',
  'Gamificação',
  'Acessibilidade',
  'Performance',
  'Segurança',
];

const FeatureContribution = () => {
  const [suggestions, setSuggestions] = useState(mockSuggestions);
  const [sortBy, setSortBy] = useState('votes');
  const [filterCategory, setFilterCategory] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');

  // Form state
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');

  const handleVote = (id: string) => {
    setSuggestions(suggestions.map(s => {
      if (s.id === id) {
        return {
          ...s,
          votes: s.hasVoted ? s.votes - 1 : s.votes + 1,
          hasVoted: !s.hasVoted,
        };
      }
      return s;
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !description || !category) {
      toast.error('Por favor, preencha todos os campos.');
      return;
    }

    const newSuggestion: FeatureSuggestion = {
      id: Date.now().toString(),
      title,
      description,
      author: 'Você',
      authorAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=you',
      votes: 1,
      comments: 0,
      status: 'pending',
      category,
      createdAt: new Date().toISOString().split('T')[0],
      hasVoted: true,
    };

    setSuggestions([newSuggestion, ...suggestions]);
    setTitle('');
    setDescription('');
    setCategory('');
    toast.success('Sugestão submetida com sucesso! Obrigado pela contribuição.');
  };

  const filteredSuggestions = suggestions
    .filter(s => filterCategory === 'all' || s.category === filterCategory)
    .filter(s => filterStatus === 'all' || s.status === filterStatus)
    .sort((a, b) => {
      if (sortBy === 'votes') return b.votes - a.votes;
      if (sortBy === 'recent') return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      if (sortBy === 'comments') return b.comments - a.comments;
      return 0;
    });

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-full mb-4">
            <Lightbulb className="h-8 w-8 text-primary" />
          </div>
          <h1 className="text-4xl font-bold text-foreground mb-4">
            Contribuir com Funcionalidades
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Ajude a moldar o futuro da Alldev! Submeta ideias, vote nas sugestões da comunidade 
            e acompanhe o progresso das funcionalidades em desenvolvimento.
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
          <Card>
            <CardContent className="p-4 text-center">
              <Lightbulb className="h-8 w-8 text-yellow-500 mx-auto mb-2" />
              <p className="text-2xl font-bold">{suggestions.length}</p>
              <p className="text-sm text-muted-foreground">Sugestões</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <Rocket className="h-8 w-8 text-purple-500 mx-auto mb-2" />
              <p className="text-2xl font-bold">
                {suggestions.filter(s => s.status === 'in-progress').length}
              </p>
              <p className="text-sm text-muted-foreground">Em Desenvolvimento</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <CheckCircle2 className="h-8 w-8 text-green-500 mx-auto mb-2" />
              <p className="text-2xl font-bold">
                {suggestions.filter(s => s.status === 'completed').length}
              </p>
              <p className="text-sm text-muted-foreground">Concluídas</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <Users className="h-8 w-8 text-blue-500 mx-auto mb-2" />
              <p className="text-2xl font-bold">
                {suggestions.reduce((acc, s) => acc + s.votes, 0)}
              </p>
              <p className="text-sm text-muted-foreground">Votos Totais</p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="browse" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 max-w-md mx-auto">
            <TabsTrigger value="browse">Explorar Sugestões</TabsTrigger>
            <TabsTrigger value="submit">Submeter Ideia</TabsTrigger>
          </TabsList>

          <TabsContent value="browse" className="space-y-6">
            {/* Filters */}
            <Card>
              <CardContent className="p-4">
                <div className="flex flex-wrap gap-4 items-center">
                  <div className="flex items-center gap-2">
                    <Filter className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm font-medium">Filtros:</span>
                  </div>

                  <Select value={filterCategory} onValueChange={setFilterCategory}>
                    <SelectTrigger className="w-[160px]">
                      <SelectValue placeholder="Categoria" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todas Categorias</SelectItem>
                      {categories.map((cat) => (
                        <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <Select value={filterStatus} onValueChange={setFilterStatus}>
                    <SelectTrigger className="w-[160px]">
                      <SelectValue placeholder="Estado" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todos Estados</SelectItem>
                      {Object.entries(statusConfig).map(([key, config]) => (
                        <SelectItem key={key} value={key}>{config.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <Select value={sortBy} onValueChange={setSortBy}>
                    <SelectTrigger className="w-[160px]">
                      <SelectValue placeholder="Ordenar por" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="votes">Mais Votados</SelectItem>
                      <SelectItem value="recent">Mais Recentes</SelectItem>
                      <SelectItem value="comments">Mais Comentados</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            {/* Suggestions List */}
            <div className="space-y-4">
              {filteredSuggestions.map((suggestion) => {
                const status = statusConfig[suggestion.status];
                const StatusIcon = status.icon;

                return (
                  <Card key={suggestion.id} className="hover:border-primary/50 transition-colors">
                    <CardContent className="p-6">
                      <div className="flex gap-4">
                        {/* Vote Button */}
                        <div className="flex flex-col items-center gap-1">
                          <Button
                            variant={suggestion.hasVoted ? 'default' : 'outline'}
                            size="sm"
                            className="h-12 w-12 rounded-full"
                            onClick={() => handleVote(suggestion.id)}
                          >
                            <ArrowUp className="h-5 w-5" />
                          </Button>
                          <span className="font-bold text-lg">{suggestion.votes}</span>
                          <span className="text-xs text-muted-foreground">votos</span>
                        </div>

                        {/* Content */}
                        <div className="flex-1 min-w-0">
                          <div className="flex flex-wrap items-center gap-2 mb-2">
                            <Badge variant="outline">{suggestion.category}</Badge>
                            <Badge className={status.color}>
                              <StatusIcon className="h-3 w-3 mr-1" />
                              {status.label}
                            </Badge>
                          </div>

                          <h3 className="text-xl font-semibold text-foreground mb-2">
                            {suggestion.title}
                          </h3>

                          <p className="text-muted-foreground mb-4">
                            {suggestion.description}
                          </p>

                          <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                            <div className="flex items-center gap-2">
                              <img
                                src={suggestion.authorAvatar}
                                alt={suggestion.author}
                                className="h-6 w-6 rounded-full"
                              />
                              <span>{suggestion.author}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <MessageSquare className="h-4 w-4" />
                              <span>{suggestion.comments} comentários</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Clock className="h-4 w-4" />
                              <span>{suggestion.createdAt}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}

              {filteredSuggestions.length === 0 && (
                <Card className="p-8 text-center">
                  <Lightbulb className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">Nenhuma sugestão encontrada</h3>
                  <p className="text-muted-foreground">
                    Tente ajustar os filtros ou seja o primeiro a submeter uma ideia!
                  </p>
                </Card>
              )}
            </div>
          </TabsContent>

          <TabsContent value="submit">
            <Card className="max-w-2xl mx-auto">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Lightbulb className="h-5 w-5 text-primary" />
                  Submeter Nova Funcionalidade
                </CardTitle>
                <CardDescription>
                  Partilhe a sua ideia para melhorar a Alldev. Seja específico e explique 
                  como esta funcionalidade beneficiaria a comunidade.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="title">Título da Funcionalidade *</Label>
                    <Input
                      id="title"
                      placeholder="Ex: Sistema de notificações em tempo real"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      className="bg-background"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="category">Categoria *</Label>
                    <Select value={category} onValueChange={setCategory}>
                      <SelectTrigger className="bg-background">
                        <SelectValue placeholder="Selecione uma categoria" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map((cat) => (
                          <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="description">Descrição Detalhada *</Label>
                    <Textarea
                      id="description"
                      placeholder="Descreva a funcionalidade, como funcionaria e porque seria útil para a comunidade..."
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      rows={6}
                      className="bg-background resize-none"
                    />
                  </div>

                  <div className="bg-muted/50 p-4 rounded-lg">
                    <h4 className="font-medium mb-2">Dicas para uma boa sugestão:</h4>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      <li>• Seja claro e específico sobre o que pretende</li>
                      <li>• Explique o problema que esta funcionalidade resolve</li>
                      <li>• Descreva como beneficiaria outros utilizadores</li>
                      <li>• Verifique se a ideia já não foi sugerida</li>
                    </ul>
                  </div>

                  <Button type="submit" className="w-full">
                    <Lightbulb className="h-4 w-4 mr-2" />
                    Submeter Sugestão
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* How it works */}
        <Card className="mt-10">
          <CardHeader>
            <CardTitle>Como Funciona o Processo?</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="w-12 h-12 bg-yellow-500/10 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Lightbulb className="h-6 w-6 text-yellow-500" />
                </div>
                <h4 className="font-semibold mb-2">1. Submeta</h4>
                <p className="text-sm text-muted-foreground">
                  Partilhe a sua ideia com uma descrição clara e detalhada.
                </p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-blue-500/10 rounded-full flex items-center justify-center mx-auto mb-3">
                  <ThumbsUp className="h-6 w-6 text-blue-500" />
                </div>
                <h4 className="font-semibold mb-2">2. Vote</h4>
                <p className="text-sm text-muted-foreground">
                  A comunidade vota nas sugestões mais relevantes.
                </p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-purple-500/10 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Clock className="h-6 w-6 text-purple-500" />
                </div>
                <h4 className="font-semibold mb-2">3. Análise</h4>
                <p className="text-sm text-muted-foreground">
                  A equipa analisa viabilidade técnica e prioridade.
                </p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Rocket className="h-6 w-6 text-green-500" />
                </div>
                <h4 className="font-semibold mb-2">4. Implementação</h4>
                <p className="text-sm text-muted-foreground">
                  Funcionalidades aprovadas entram no roadmap de desenvolvimento.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
  );
};

export default FeatureContribution;
