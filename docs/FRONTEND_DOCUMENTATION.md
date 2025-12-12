# Alldev - Documentação do Frontend

## Índice

1. [Visão Geral](#visão-geral)
2. [Stack Tecnológica](#stack-tecnológica)
3. [Estrutura do Projeto](#estrutura-do-projeto)
4. [Sistema de Design](#sistema-de-design)
5. [Funcionalidades](#funcionalidades)
6. [Gestão de Estado](#gestão-de-estado)
7. [Rotas da Aplicação](#rotas-da-aplicação)
8. [Componentes Principais](#componentes-principais)
9. [Integração com API](#integração-com-api)
10. [Tipos e Interfaces](#tipos-e-interfaces)

---

## Visão Geral

O **Alldev** é uma plataforma de comunidade para programadores que combina funcionalidades do Stack Overflow e Dev.to. Permite aos utilizadores:

- Publicar questões técnicas e discussões
- Comentar e ajudar outros programadores
- Ganhar reputação através de contribuições
- Descobrir conteúdo através de tags e pesquisa
- Construir perfis profissionais

---

## Stack Tecnológica

| Tecnologia | Versão | Finalidade |
|------------|--------|------------|
| React | 18.3.1 | Biblioteca UI |
| TypeScript | 5.x | Tipagem estática |
| Vite | 5.x | Build tool e dev server |
| React Router | 6.30.1 | Navegação SPA |
| TanStack Query | 5.83.0 | Gestão de estado servidor |
| Zustand | 5.0.9 | Gestão de estado cliente |
| Tailwind CSS | 3.x | Estilos utilitários |
| Shadcn/UI | - | Componentes UI (Radix UI) |
| React Hook Form | 7.61.1 | Gestão de formulários |
| Zod | 3.25.76 | Validação de schemas |
| Axios | 1.13.2 | Cliente HTTP |
| date-fns | 3.6.0 | Manipulação de datas |
| Lucide React | 0.462.0 | Ícones |
| react-markdown | 10.1.0 | Renderização Markdown |
| prism-react-renderer | 2.4.1 | Syntax highlighting |

---

## Estrutura do Projeto

```
src/
├── components/
│   ├── admin/           # Componentes do painel admin
│   │   ├── AdminLayout.tsx
│   │   ├── AdminSidebar.tsx
│   │   └── StatsCard.tsx
│   ├── common/          # Componentes partilhados
│   │   ├── CookieConsentBanner.tsx
│   │   └── MarkdownContent.tsx
│   ├── layout/          # Componentes de layout
│   │   ├── AuthLayout.tsx
│   │   ├── Footer.tsx
│   │   ├── Header.tsx
│   │   ├── MainLayout.tsx
│   │   └── Sidebar.tsx
│   ├── moderator/       # Componentes do painel moderador
│   │   ├── ModeratorLayout.tsx
│   │   └── ModeratorSidebar.tsx
│   ├── post/            # Componentes de posts
│   │   ├── CommentItem.tsx
│   │   └── PostCard.tsx
│   └── ui/              # Componentes UI (Shadcn)
├── hooks/               # Hooks personalizados
│   ├── use-mobile.tsx
│   └── use-toast.ts
├── lib/                 # Utilitários e configurações
│   ├── api.ts           # Cliente Axios configurado
│   ├── mockData.ts      # Dados mock para desenvolvimento
│   └── utils.ts         # Funções utilitárias
├── pages/               # Páginas da aplicação
│   ├── admin/           # Páginas administrativas
│   └── moderator/       # Páginas de moderação
├── stores/              # Stores Zustand
│   ├── adminNotificationStore.ts
│   ├── authStore.ts
│   ├── maintenanceStore.ts
│   └── themeStore.ts
├── types/               # Definições TypeScript
│   └── index.ts
├── App.tsx              # Componente raiz
├── App.css              # Estilos globais
├── index.css            # Variáveis CSS e Tailwind
└── main.tsx             # Entry point
```

---

## Sistema de Design

### Variáveis de Cor (CSS Custom Properties)

O sistema utiliza variáveis HSL para suportar modo claro/escuro:

```css
:root {
  --background: 0 0% 100%;
  --foreground: 222.2 84% 4.9%;
  --primary: 222.2 47.4% 11.2%;
  --secondary: 210 40% 96%;
  --muted: 210 40% 96%;
  --accent: 210 40% 96%;
  --destructive: 0 84.2% 60.2%;
  --border: 214.3 31.8% 91.4%;
  --ring: 222.2 84% 4.9%;
}

.dark {
  --background: 222.2 84% 4.9%;
  --foreground: 210 40% 98%;
  /* ... outras variáveis */
}
```

### Classes Tailwind Semânticas

| Classe | Uso |
|--------|-----|
| `bg-background` | Fundo principal |
| `text-foreground` | Texto principal |
| `bg-primary` | Cor primária |
| `text-primary-foreground` | Texto sobre primário |
| `bg-muted` | Fundos subtis |
| `text-muted-foreground` | Texto secundário |
| `border-border` | Bordas |

### Breakpoints Responsivos

| Breakpoint | Largura Mínima |
|------------|----------------|
| `sm` | 640px |
| `md` | 768px |
| `lg` | 1024px |
| `xl` | 1280px |
| `2xl` | 1536px |

---

## Funcionalidades

### 1. Autenticação

#### Login (`/login`)
- Formulário com email e password
- Validação com Zod
- Redirecionamento após login bem-sucedido
- Link para recuperação de password

#### Registo (`/register`)
- Campos: username, email, password, confirmar password
- Validação de força da password (mín. 8 caracteres, maiúscula, minúscula, número)
- Termos de uso e política de privacidade

#### Recuperar Password (`/forgot-password`)
- Formulário com email
- Envio de link de recuperação
- Feedback visual do estado

#### Redefinir Password (`/reset-password`)
- Token de verificação via URL
- Nova password com confirmação
- Indicador visual de força da password

### 2. Feed de Posts (`/`)

#### Funcionalidades:
- Lista de posts com paginação infinita (20 posts por request)
- Filtros: Recentes, Mais Votados, Sem Resposta
- Ordenação por data ou votos
- Pesquisa debounced (500ms)

#### PostCard - Informação Exibida:
- Título (link para detalhes)
- Excerto do conteúdo
- Autor (avatar, username, nível)
- Tags (clicáveis)
- Estatísticas: votos, comentários, visualizações
- Data relativa ("há 2 horas")
- Badge "✓ Resolvido" se tem resposta aceite

### 3. Detalhes do Post (`/post/:slug`)

#### Conteúdo Principal:
- Título completo
- Conteúdo em Markdown com syntax highlighting
- Tags associadas
- Informação do autor
- Sistema de votação (upvote/downvote)
- Botões de ação (editar, eliminar - se autor)

#### Sistema de Comentários:
- Lista de comentários ordenada
- Respostas aceites no topo (fundo verde)
- Votação em comentários
- Formulário para novo comentário (requer autenticação)
- Botão "Aceitar resposta" (apenas autor do post)

### 4. Criar/Editar Post (`/create-post`, `/edit-post/:id`)

#### Formulário:
- Título (obrigatório, mín. 10 caracteres)
- Conteúdo Markdown (obrigatório, mín. 30 caracteres)
- Seleção de tags (1-5 tags, autocomplete)
- Preview em tempo real do Markdown

### 5. Pesquisa (`/search`)

#### Funcionalidades:
- Input debounced (500ms)
- Sugestões em dropdown durante digitação
- Resultados em tabs: Posts, Utilizadores, Tags
- Highlight de termos encontrados
- Estado vazio com sugestões

### 6. Sistema de Tags

#### Página de Tags (`/tags`)
- Lista de todas as tags
- Pesquisa e ordenação (Mais Usadas, Alfabética)
- Cards com: nome, descrição, contagem de posts

#### Detalhes da Tag (`/tag/:slug`)
- Descrição da tag
- Lista de posts com essa tag
- Estatísticas

### 7. Perfil de Utilizador

#### Visualização (`/user/:username`)
- Avatar e informação básica
- Bio e skills
- Links sociais (GitHub, LinkedIn, Twitter, Portfolio)
- Estatísticas: reputação, nível, posts, comentários
- Lista de posts do utilizador
- Data de registo ("Membro desde...")

#### Edição (`/profile/edit`)
- Upload de foto de perfil com preview
- Edição de username, email, bio
- Gestão de skills (adicionar/remover)
- Links sociais
- Alteração de password (validação da atual)

### 8. Sistema de Reputação

#### Níveis:
| Nível | Requisitos |
|-------|------------|
| Novato | 0-99 pontos |
| Contribuidor | 100-499 pontos |
| Expert | 500-999 pontos |
| Guru | 1000+ pontos |

#### Pontuação:
- Upvote em post: +10 pontos
- Upvote em comentário: +5 pontos
- Resposta aceite: +25 pontos
- Downvote: -2 pontos

### 9. Notificações

#### Tipos:
- `comment`: Novo comentário no seu post
- `reply`: Resposta ao seu comentário
- `vote`: Agregação de votos ("+5 pessoas votaram")
- `accepted`: Resposta aceite
- `mention`: Menção (@username)

#### Interface:
- Ícone de sino no header com badge de contagem
- Dropdown com últimas 5 notificações
- Página completa com filtros
- Marcar como lida/não lida
- Marcar todas como lidas

### 10. Painel de Administração (`/admin/*`)

#### Dashboard (`/admin`)
- Estatísticas gerais (utilizadores, posts, comentários)
- Gráficos de atividade
- Alertas e notificações do sistema

#### Gestão de Utilizadores (`/admin/users`)
- Lista paginada de utilizadores
- Pesquisa e filtros
- Ações: ver perfil, alterar role, banir, eliminar

#### Gestão de Posts (`/admin/posts`)
- Lista de todos os posts
- Filtros por estado, data, autor
- Ações: editar, ocultar, eliminar

#### Gestão de Comentários (`/admin/comments`)
- Lista de comentários
- Filtros e pesquisa
- Ações: editar, ocultar, eliminar

#### Gestão de Tags (`/admin/tags`)
- CRUD completo de tags
- Estatísticas por tag

#### Denúncias (`/admin/reports`)
- Lista de conteúdo denunciado
- Ações: aprovar, rejeitar, banir autor

#### Notificações Admin (`/admin/notifications`)
- Enviar notificações a grupos de utilizadores
- Histórico de notificações enviadas

#### Configurações (`/admin/settings`)
- Modo de manutenção (ativar/desativar)
- Mensagem personalizada de manutenção
- Data estimada de fim

### 11. Painel de Moderação (`/moderator/*`)

#### Permissões do Moderador:
✅ **Pode:**
- Gerir conteúdo denunciado
- Editar/ocultar/bloquear posts
- Gerir comentários
- Enviar avisos a utilizadores
- Ver histórico de ações

❌ **Não pode:**
- Gerir utilizadores
- Alterar roles
- Aceder a configurações do sistema
- Ativar modo de manutenção

#### Páginas:
- Dashboard (`/moderator`)
- Fila de moderação (`/moderator/queue`)
- Posts (`/moderator/posts`)
- Comentários (`/moderator/comments`)
- Denúncias (`/moderator/reports`)
- Histórico (`/moderator/history`)

### 12. Páginas Institucionais

- Termos de Uso (`/terms`)
- Política de Privacidade (`/privacy`)
- Política de Cookies (`/cookies`)
- FAQ (`/faq`)
- Contacto (`/contact`)
- Guia de Contribuição (`/contribution-guide`)
- Contribuição de Funcionalidades (`/feature-contribution`)

### 13. Modo de Manutenção

- Página dedicada (`/maintenance`)
- Exibida para utilizadores não-admin quando ativo
- Mensagem personalizável
- Data estimada de retorno

---

## Gestão de Estado

### Zustand Stores

#### `authStore.ts`
```typescript
interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  login: (user: User, token: string) => void;
  logout: () => void;
  updateUser: (user: Partial<User>) => void;
}
```

#### `themeStore.ts`
```typescript
interface ThemeState {
  theme: 'dark' | 'light';
  toggleTheme: () => void;
  setTheme: (theme: 'dark' | 'light') => void;
}
```

#### `maintenanceStore.ts`
```typescript
interface MaintenanceState {
  isMaintenanceMode: boolean;
  maintenanceMessage: string;
  maintenanceEndTime: string | null;
  setMaintenanceMode: (enabled: boolean) => void;
  setMaintenanceMessage: (message: string) => void;
  setMaintenanceEndTime: (time: string | null) => void;
}
```

#### `adminNotificationStore.ts`
```typescript
interface AdminNotification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'warning' | 'success' | 'error';
  targetAudience: 'all' | 'admins' | 'moderators' | 'users';
  sentAt: string;
  sentBy: string;
}
```

### TanStack Query

Utilizado para:
- Cache de dados do servidor
- Invalidação automática
- Optimistic updates (votação)
- Infinite queries (feed)
- Prefetching

---

## Rotas da Aplicação

### Públicas
| Rota | Componente | Descrição |
|------|------------|-----------|
| `/` | Feed | Página inicial com posts |
| `/login` | Login | Autenticação |
| `/register` | Register | Registo |
| `/forgot-password` | ForgotPassword | Recuperar password |
| `/reset-password` | ResetPassword | Redefinir password |
| `/post/:slug` | PostDetails | Detalhes do post |
| `/search` | Search | Pesquisa |
| `/tags` | Tags | Lista de tags |
| `/tag/:slug` | TagDetails | Posts por tag |
| `/user/:username` | UserProfile | Perfil público |
| `/terms` | TermsOfUse | Termos de uso |
| `/privacy` | PrivacyPolicy | Política privacidade |
| `/cookies` | CookiePolicy | Política cookies |
| `/faq` | FAQ | Perguntas frequentes |
| `/contact` | Contact | Contacto |

### Protegidas (Requerem Autenticação)
| Rota | Componente | Role Mínimo |
|------|------------|-------------|
| `/create-post` | CreatePost | user |
| `/profile/edit` | EditProfile | user |

### Administrativas
| Rota | Componente | Role |
|------|------------|------|
| `/admin` | AdminDashboard | admin |
| `/admin/users` | AdminUsers | admin |
| `/admin/posts` | AdminPosts | admin |
| `/admin/comments` | AdminComments | admin |
| `/admin/tags` | AdminTags | admin |
| `/admin/reports` | AdminReports | admin |
| `/admin/notifications` | AdminNotifications | admin |
| `/admin/settings` | AdminSettings | admin |

### Moderação
| Rota | Componente | Role |
|------|------------|------|
| `/moderator` | ModeratorDashboard | moderator |
| `/moderator/queue` | ModeratorQueue | moderator |
| `/moderator/posts` | ModeratorPosts | moderator |
| `/moderator/comments` | ModeratorComments | moderator |
| `/moderator/reports` | ModeratorReports | moderator |
| `/moderator/history` | ModeratorHistory | moderator |

---

## Componentes Principais

### Layout Components

#### `MainLayout`
- Header com navegação
- Sidebar com tags populares e links rápidos
- Footer
- Área de conteúdo principal

#### `AuthLayout`
- Layout centrado para páginas de autenticação
- Logo e branding
- Formulário centralizado

#### `AdminLayout`
- Sidebar administrativa
- Header com informação do admin
- Área de conteúdo com breadcrumbs

#### `ModeratorLayout`
- Similar ao AdminLayout
- Sidebar com opções de moderação

### UI Components (Shadcn)

Todos os componentes estão em `src/components/ui/`:

- `Button` - Botões com variantes
- `Card` - Contentores de conteúdo
- `Dialog` - Modais
- `Form` - Integração React Hook Form
- `Input` - Campos de texto
- `Select` - Dropdowns
- `Tabs` - Navegação por tabs
- `Toast` - Notificações temporárias
- `Avatar` - Imagens de perfil
- `Badge` - Etiquetas
- `Skeleton` - Loading states
- ... e mais

---

## Integração com API

### Configuração Axios (`src/lib/api.ts`)

```typescript
const api = axios.create({
  baseURL: 'http://localhost:3000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para adicionar token JWT
api.interceptors.request.use((config) => {
  const token = useAuthStore.getState().token;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
```

### Endpoints Esperados

Ver [BACKEND_DOCUMENTATION.md](./BACKEND_DOCUMENTATION.md) para lista completa de endpoints.

---

## Tipos e Interfaces

### User
```typescript
interface User {
  id: string;
  username: string;
  email: string;
  avatarUrl?: string;
  bio?: string;
  skills: string[];
  socialLinks?: {
    github?: string;
    linkedin?: string;
    twitter?: string;
    portfolio?: string;
  };
  reputation: number;
  level: 'Novato' | 'Contribuidor' | 'Expert' | 'Guru';
  createdAt: string;
}
```

### Post
```typescript
interface Post {
  id: string;
  title: string;
  content: string;
  slug: string;
  author: User;
  tags: Tag[];
  votes: number;
  userVote?: 'up' | 'down' | null;
  commentCount: number;
  views: number;
  hasAcceptedAnswer: boolean;
  createdAt: string;
  updatedAt: string;
}
```

### Comment
```typescript
interface Comment {
  id: string;
  content: string;
  postId: string;
  author: User;
  votes: number;
  userVote?: 'up' | 'down' | null;
  isAccepted: boolean;
  createdAt: string;
}
```

### Tag
```typescript
interface Tag {
  id: string;
  name: string;
  slug: string;
  description: string;
  postCount: number;
}
```

### Notification
```typescript
interface Notification {
  id: string;
  type: 'comment' | 'reply' | 'vote' | 'accepted' | 'mention';
  message: string;
  read: boolean;
  relatedPostId?: string;
  relatedPostSlug?: string;
  relatedCommentId?: string;
  createdAt: string;
}
```

### Paginação
```typescript
interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  hasMore: boolean;
}
```

---

## Boas Práticas Implementadas

### Performance
- ✅ Code splitting por rotas
- ✅ Lazy loading de componentes
- ✅ Debounce em pesquisas (500ms)
- ✅ Infinite scroll com virtualização
- ✅ Optimistic updates na votação
- ✅ React.memo em componentes pesados

### Acessibilidade
- ✅ Semântica HTML correta
- ✅ Labels em formulários
- ✅ Contraste de cores adequado
- ✅ Navegação por teclado
- ✅ ARIA labels quando necessário

### Segurança
- ✅ Validação de inputs com Zod
- ✅ Sanitização de Markdown
- ✅ Tokens JWT não expostos
- ✅ Proteção de rotas

### UX
- ✅ Loading states (skeletons, spinners)
- ✅ Error handling com feedback
- ✅ Toast notifications
- ✅ Formulários com validação inline
- ✅ Modo escuro/claro
- ✅ Design responsivo

---

## Próximos Passos

1. Integrar com backend real (substituir mockData)
2. Implementar testes E2E com Playwright
3. Adicionar PWA support
4. Implementar i18n para múltiplos idiomas
5. Adicionar analytics

---

*Documentação gerada para Alldev v1.0*
*Última atualização: Dezembro 2024*
