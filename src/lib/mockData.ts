import type { User, Post, Comment, Tag, Notification } from '@/types';

export const mockUsers: User[] = [
  {
    id: '1',
    username: 'devmaster',
    email: 'devmaster@example.com',
    avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=devmaster',
    bio: 'Full-stack developer apaixonado por React e TypeScript. Contribuidor open source e mentor de desenvolvedores iniciantes.',
    skills: ['React', 'TypeScript', 'Node.js', 'PostgreSQL', 'Docker'],
    socialLinks: {
      github: 'https://github.com/devmaster',
      linkedin: 'https://linkedin.com/in/devmaster',
      twitter: 'https://twitter.com/devmaster',
    },
    reputation: 15420,
    level: 'Guru',
    createdAt: '2023-01-15T10:00:00Z',
  },
  {
    id: '2',
    username: 'codequeen',
    email: 'codequeen@example.com',
    avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=codequeen',
    bio: 'Backend specialist com foco em arquitetura de microsserviços e cloud computing.',
    skills: ['Python', 'Go', 'AWS', 'Kubernetes', 'Redis'],
    socialLinks: {
      github: 'https://github.com/codequeen',
    },
    reputation: 8750,
    level: 'Expert',
    createdAt: '2023-03-20T14:30:00Z',
  },
  {
    id: '3',
    username: 'newdev',
    email: 'newdev@example.com',
    avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=newdev',
    bio: 'Desenvolvedor iniciante aprendendo React e JavaScript.',
    skills: ['JavaScript', 'HTML', 'CSS'],
    reputation: 150,
    level: 'Novato',
    createdAt: '2024-01-10T09:00:00Z',
  },
];

export const mockTags: Tag[] = [
  { id: '1', name: 'React', slug: 'react', description: 'Biblioteca JavaScript para construção de interfaces de usuário', postCount: 1245 },
  { id: '2', name: 'TypeScript', slug: 'typescript', description: 'Superset tipado do JavaScript', postCount: 892 },
  { id: '3', name: 'Node.js', slug: 'nodejs', description: 'Runtime JavaScript no servidor', postCount: 756 },
  { id: '4', name: 'JavaScript', slug: 'javascript', description: 'Linguagem de programação da web', postCount: 2341 },
  { id: '5', name: 'CSS', slug: 'css', description: 'Folhas de estilo em cascata', postCount: 543 },
  { id: '6', name: 'Python', slug: 'python', description: 'Linguagem versátil para web, data science e mais', postCount: 1120 },
  { id: '7', name: 'Docker', slug: 'docker', description: 'Plataforma de containerização', postCount: 432 },
  { id: '8', name: 'PostgreSQL', slug: 'postgresql', description: 'Banco de dados relacional open source', postCount: 321 },
  { id: '9', name: 'Next.js', slug: 'nextjs', description: 'Framework React para produção', postCount: 654 },
  { id: '10', name: 'Tailwind CSS', slug: 'tailwindcss', description: 'Framework CSS utility-first', postCount: 487 },
];

export const mockPosts: Post[] = [
  {
    id: '1',
    title: 'Como otimizar performance em aplicações React com useMemo e useCallback?',
    content: `# Otimização de Performance em React

Estou trabalhando em uma aplicação React grande e notei alguns problemas de performance. Quero entender melhor quando usar \`useMemo\` e \`useCallback\`.

## Meu cenário atual

Tenho um componente que renderiza uma lista grande de itens:

\`\`\`tsx
function ItemList({ items, onSelect }) {
  return (
    <ul>
      {items.map(item => (
        <ListItem 
          key={item.id} 
          item={item} 
          onSelect={() => onSelect(item.id)} 
        />
      ))}
    </ul>
  );
}
\`\`\`

## Minhas dúvidas

1. Devo usar \`useCallback\` para a função \`onSelect\`?
2. Quando o \`useMemo\` realmente faz diferença?
3. Existe algum overhead em usar esses hooks excessivamente?

Agradeço qualquer ajuda!`,
    slug: 'como-otimizar-performance-react-usememo-usecallback',
    author: mockUsers[2],
    tags: [mockTags[0], mockTags[1], mockTags[3]],
    votes: 42,
    userVote: null,
    commentCount: 8,
    views: 1250,
    hasAcceptedAnswer: true,
    createdAt: '2024-01-15T14:30:00Z',
    updatedAt: '2024-01-15T14:30:00Z',
  },
  {
    id: '2',
    title: 'Arquitetura de microsserviços: quando vale a pena?',
    content: `# Microsserviços vs Monolito

Estou planejando um novo projeto e estou na dúvida entre começar com microsserviços ou um monolito.

## Contexto do projeto

- Equipe de 5 desenvolvedores
- Expectativa de 10k usuários no primeiro ano
- Funcionalidades: autenticação, pagamentos, notificações, relatórios

## Minhas considerações

**Prós microsserviços:**
- Escalabilidade independente
- Deploy isolado
- Tecnologias diferentes por serviço

**Contras:**
- Complexidade operacional
- Latência de rede
- Consistência eventual

O que vocês recomendam para esse cenário?`,
    slug: 'arquitetura-microsservicos-quando-vale-pena',
    author: mockUsers[1],
    tags: [mockTags[2], mockTags[6], mockTags[7]],
    votes: 89,
    userVote: 'up',
    commentCount: 23,
    views: 3420,
    hasAcceptedAnswer: false,
    createdAt: '2024-01-14T09:15:00Z',
    updatedAt: '2024-01-14T09:15:00Z',
  },
  {
    id: '3',
    title: 'TypeScript: como tipar corretamente um HOC (Higher-Order Component)?',
    content: `# Tipagem de HOC em TypeScript

Estou tentando criar um HOC em TypeScript mas estou tendo dificuldades com a tipagem.

## Código atual

\`\`\`tsx
function withAuth<P extends object>(
  WrappedComponent: React.ComponentType<P>
) {
  return function WithAuthComponent(props: P) {
    const { isAuthenticated } = useAuth();
    
    if (!isAuthenticated) {
      return <Navigate to="/login" />;
    }
    
    return <WrappedComponent {...props} />;
  };
}
\`\`\`

## Problema

O TypeScript reclama que as props não estão sendo passadas corretamente. Como posso resolver isso?`,
    slug: 'typescript-tipar-hoc-higher-order-component',
    author: mockUsers[0],
    tags: [mockTags[1], mockTags[0]],
    votes: 156,
    userVote: null,
    commentCount: 12,
    views: 5670,
    hasAcceptedAnswer: true,
    createdAt: '2024-01-13T16:45:00Z',
    updatedAt: '2024-01-13T18:20:00Z',
  },
  {
    id: '4',
    title: 'Docker Compose para ambiente de desenvolvimento local',
    content: `# Setup Docker Compose

Quero compartilhar meu setup de Docker Compose para desenvolvimento local com PostgreSQL, Redis e a aplicação Node.js.

\`\`\`yaml
version: '3.8'
services:
  app:
    build: .
    ports:
      - "3000:3000"
    volumes:
      - .:/app
      - /app/node_modules
    environment:
      - DATABASE_URL=postgresql://user:pass@db:5432/mydb
      - REDIS_URL=redis://cache:6379
    depends_on:
      - db
      - cache

  db:
    image: postgres:15
    environment:
      POSTGRES_USER: user
      POSTGRES_PASSWORD: pass
      POSTGRES_DB: mydb
    volumes:
      - pgdata:/var/lib/postgresql/data

  cache:
    image: redis:7-alpine

volumes:
  pgdata:
\`\`\`

Alguém tem sugestões de melhorias?`,
    slug: 'docker-compose-ambiente-desenvolvimento-local',
    author: mockUsers[1],
    tags: [mockTags[6], mockTags[7], mockTags[2]],
    votes: 67,
    userVote: 'up',
    commentCount: 5,
    views: 2100,
    hasAcceptedAnswer: false,
    createdAt: '2024-01-12T11:00:00Z',
    updatedAt: '2024-01-12T11:00:00Z',
  },
  {
    id: '5',
    title: 'Tailwind CSS: organizando classes utilitárias em projetos grandes',
    content: `# Organização do Tailwind em projetos grandes

Meu projeto está crescendo e as classes do Tailwind estão ficando enormes. Como vocês organizam?

## Exemplo do problema

\`\`\`jsx
<button className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2">
  Click me
</button>
\`\`\`

## Possíveis soluções que pensei

1. Usar \`@apply\` em CSS
2. Extrair para componentes
3. Usar clsx/cn para organizar
4. CVA (Class Variance Authority)

Qual abordagem vocês preferem?`,
    slug: 'tailwind-css-organizando-classes-projetos-grandes',
    author: mockUsers[2],
    tags: [mockTags[9], mockTags[4], mockTags[0]],
    votes: 34,
    userVote: null,
    commentCount: 15,
    views: 890,
    hasAcceptedAnswer: true,
    createdAt: '2024-01-11T08:30:00Z',
    updatedAt: '2024-01-11T08:30:00Z',
  },
];

export const mockComments: Record<string, Comment[]> = {
  '1': [
    {
      id: 'c1',
      content: `Ótima pergunta! Vou compartilhar minha experiência:

## Quando usar useCallback

Use \`useCallback\` quando você passa uma função como prop para componentes filhos que usam \`React.memo\`:

\`\`\`tsx
const handleSelect = useCallback((id: string) => {
  onSelect(id);
}, [onSelect]);
\`\`\`

## Quando usar useMemo

Use \`useMemo\` para cálculos pesados ou para manter referência estável de objetos/arrays:

\`\`\`tsx
const sortedItems = useMemo(() => {
  return [...items].sort((a, b) => a.name.localeCompare(b.name));
}, [items]);
\`\`\`

## Sobre o overhead

Sim, existe um overhead mínimo. A regra geral é: **não otimize prematuramente**. Use o React DevTools Profiler para identificar onde realmente há problemas.`,
      postId: '1',
      author: mockUsers[0],
      votes: 28,
      userVote: 'up',
      isAccepted: true,
      createdAt: '2024-01-15T15:00:00Z',
    },
    {
      id: 'c2',
      content: `Complementando a resposta do @devmaster:

Uma dica importante é usar o \`React.memo\` nos componentes filhos para que o \`useCallback\` realmente faça diferença:

\`\`\`tsx
const ListItem = React.memo(({ item, onSelect }) => {
  return (
    <li onClick={() => onSelect(item.id)}>
      {item.name}
    </li>
  );
});
\`\`\`

Sem o \`memo\`, o componente vai re-renderizar de qualquer forma.`,
      postId: '1',
      author: mockUsers[1],
      votes: 15,
      userVote: null,
      isAccepted: false,
      createdAt: '2024-01-15T15:30:00Z',
    },
  ],
  '3': [
    {
      id: 'c3',
      content: `A solução é usar \`Omit\` para remover as props que o HOC injeta:

\`\`\`tsx
function withAuth<P extends object>(
  WrappedComponent: React.ComponentType<P>
) {
  return function WithAuthComponent(props: Omit<P, 'user'>) {
    const { isAuthenticated, user } = useAuth();
    
    if (!isAuthenticated) {
      return <Navigate to="/login" />;
    }
    
    return <WrappedComponent {...(props as P)} user={user} />;
  };
}
\`\`\`

Assim você mantém a tipagem correta!`,
      postId: '3',
      author: mockUsers[1],
      votes: 42,
      userVote: 'up',
      isAccepted: true,
      createdAt: '2024-01-13T17:00:00Z',
    },
  ],
};

export const mockNotifications: Notification[] = [
  {
    id: 'n1',
    type: 'comment',
    message: '@devmaster comentou no seu post "Como otimizar performance em React..."',
    read: false,
    relatedPostId: '1',
    relatedPostSlug: 'como-otimizar-performance-react-usememo-usecallback',
    createdAt: '2024-01-15T15:00:00Z',
  },
  {
    id: 'n2',
    type: 'accepted',
    message: 'Sua resposta foi aceita em "TypeScript: como tipar corretamente..."',
    read: false,
    relatedPostId: '3',
    relatedPostSlug: 'typescript-tipar-hoc-higher-order-component',
    createdAt: '2024-01-13T18:20:00Z',
  },
  {
    id: 'n3',
    type: 'vote',
    message: '+15 pessoas votaram no seu post "Arquitetura de microsserviços..."',
    read: true,
    relatedPostId: '2',
    relatedPostSlug: 'arquitetura-microsservicos-quando-vale-pena',
    createdAt: '2024-01-14T12:00:00Z',
  },
  {
    id: 'n4',
    type: 'mention',
    message: '@codequeen mencionou você em um comentário',
    read: true,
    relatedPostId: '1',
    relatedPostSlug: 'como-otimizar-performance-react-usememo-usecallback',
    createdAt: '2024-01-15T15:30:00Z',
  },
];

// Simulated current user (for demo)
export const currentUser = mockUsers[2];
