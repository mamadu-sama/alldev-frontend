# Alldev - Documentação do Frontend

## 📋 Índice

1. [Visão Geral do Projeto](#visão-geral-do-projeto)
2. [Stack Tecnológica](#stack-tecnológica)
3. [Estrutura do Projeto](#estrutura-do-projeto)
4. [Funcionalidades](#funcionalidades)
5. [Gestão de Estado](#gestão-de-estado)
6. [Rotas](#rotas)
7. [SEO & Analytics](#seo--analytics)
8. [Deployment](#deployment)
9. [Desenvolvimento](#desenvolvimento)
10. [Contacto](#contacto)

---

## 🎯 Visão Geral do Projeto

**Alldev** é uma plataforma moderna de comunidade para programadores que combina as melhores funcionalidades do Stack Overflow e Dev.to. Construída com React, TypeScript , proporciona uma experiência fluida para programadores partilharem conhecimento, fazerem perguntas e construírem a sua rede profissional.

### Funcionalidades Principais

- ✅ **Sistema de Q&A** - Publicar perguntas, fornecer respostas e aceitar soluções
- ✅ **Sistema de Reputação** - Ganhar pontos através de contribuições
- ✅ **Descoberta por Tags** - Organizar e encontrar conteúdo por tecnologias
- ✅ **Perfis de Utilizador** - Construir o seu portfólio de programador
- ✅ **Autenticação OAuth** - Login com Google e GitHub
- ✅ **Painéis Admin & Moderador** - Sistema completo de gestão de conteúdo
- ✅ **Modo Escuro/Claro** - Interface totalmente tematizada
- ✅ **SEO Otimizado** - Meta tags dinâmicas e sitemap
- ✅ **Notificações em Tempo Real** - Mantenha-se atualizado sobre atividades
- ✅ **Suporte Markdown** - Formatação rica com syntax highlighting

---

## 🛠 Stack Tecnológica

### Core

| Tecnologia       | Versão | Finalidade              |
| ---------------- | ------ | ----------------------- |
| **React**        | 18.3.1 | Biblioteca UI           |
| **TypeScript**   | 5.8.3  | Tipagem Estática        |
| **Vite**         | 7.2.7  | Build Tool & Dev Server |
| **React Router** | 6.30.1 | Navegação Client-side   |

### Gestão de Estado

| Biblioteca         | Versão | Caso de Uso                     |
| ------------------ | ------ | ------------------------------- |
| **TanStack Query** | 5.83.0 | Estado do Servidor & Caching    |
| **Zustand**        | 5.0.9  | Estado do Cliente (Auth, Theme) |

### UI & Estilos

| Biblioteca       | Versão       | Finalidade                           |
| ---------------- | ------------ | ------------------------------------ |
| **Tailwind CSS** | 3.4.17       | CSS Utilitário                       |
| **Shadcn/UI**    | Mais Recente | Biblioteca de Componentes (Radix UI) |
| **Lucide React** | 0.462.0      | Biblioteca de Ícones                 |
| **next-themes**  | 0.3.0        | Suporte Modo Escuro                  |

### Formulários & Validação

| Biblioteca              | Versão  | Finalidade            |
| ----------------------- | ------- | --------------------- |
| **React Hook Form**     | 7.61.1  | Gestão de Formulários |
| **Zod**                 | 3.25.76 | Validação de Schemas  |
| **@hookform/resolvers** | 3.10.0  | Integração Zod        |

### Conteúdo & Formatação

| Biblioteca               | Versão | Finalidade            |
| ------------------------ | ------ | --------------------- |
| **react-markdown**       | 10.1.0 | Renderização Markdown |
| **prism-react-renderer** | 2.4.1  | Syntax Highlighting   |
| **date-fns**             | 3.6.0  | Formatação de Datas   |

### SEO & Analytics

| Biblioteca             | Versão | Finalidade                |
| ---------------------- | ------ | ------------------------- |
| **react-helmet-async** | 2.0.5  | Meta Tags Dinâmicas       |
| **Google Analytics**   | -      | Analytics de Utilizadores |

### HTTP & API

| Biblioteca | Versão | Finalidade   |
| ---------- | ------ | ------------ |
| **Axios**  | 1.13.2 | Cliente HTTP |

---

## 📁 Estrutura do Projeto

```
alldev-frontend/
├── public/
│   ├── favicon.ico
│   ├── og-image.png
│   ├── sitemap.xml          # Sitemap SEO
│   └── sounds/              # Sons de notificação
├── src/
│   ├── components/
│   │   ├── admin/           # Componentes do painel admin
│   │   ├── auth/            # Componentes de autenticação
│   │   ├── common/          # Componentes partilhados
│   │   │   ├── Seo.tsx      # Componente SEO dinâmico
│   │   │   └── CookieConsentBanner.tsx
│   │   ├── layout/          # Componentes de layout
│   │   │   ├── Header.tsx
│   │   │   ├── Footer.tsx
│   │   │   ├── Sidebar.tsx
│   │   │   └── MainLayout.tsx
│   │   ├── moderator/       # Componentes do painel moderador
│   │   ├── post/            # Componentes relacionados com posts
│   │   │   ├── PostCard.tsx
│   │   │   └── CommentItem.tsx
│   │   └── ui/              # Componentes Shadcn UI
│   ├── hooks/               # Hooks React personalizados
│   ├── lib/                 # Utilitários
│   │   ├── api.ts           # Configuração Axios
│   │   └── utils.ts         # Funções auxiliares
│   ├── pages/               # Componentes de páginas
│   │   ├── admin/           # Páginas admin
│   │   ├── moderator/       # Páginas moderador
│   │   ├── Feed.tsx         # Página inicial
│   │   ├── Login.tsx
│   │   ├── Register.tsx
│   │   ├── PostDetails.tsx
│   │   ├── UserProfile.tsx
│   │   ├── CookiePolicy.tsx
│   │   ├── PrivacyPolicy.tsx
│   │   └── TermsOfUse.tsx
│   ├── services/            # Camada de serviços API
│   │   ├── auth.service.ts
│   │   ├── post.service.ts
│   │   ├── user.service.ts
│   │   └── tag.service.ts
│   ├── stores/              # Stores Zustand
│   │   ├── authStore.ts
│   │   ├── themeStore.ts
│   │   └── maintenanceStore.ts
│   ├── types/               # Definições TypeScript
│   │   └── index.ts
│   ├── App.tsx              # Componente raiz
│   ├── main.tsx             # Ponto de entrada
│   └── index.css            # Estilos globais
├── index.html               # Template HTML (com meta tags SEO)
├── vercel.json              # Configuração Vercel (proxy API)
├── package.json
├── tsconfig.json
├── tailwind.config.js
├── vite.config.ts
└── README.md
```

---

## ✨ Funcionalidades

### 1. Autenticação & Autorização

- **Autenticação Email/Password**
- **Integração OAuth** (Google, GitHub)
- **Recuperação de Password** com verificação por email
- **Rotas Protegidas** baseadas em roles de utilizador
- **Gestão de Tokens JWT**

### 2. Gestão de Conteúdo

- **Criar/Editar Posts** com editor Markdown
- **Sistema de Comentários** com respostas aninhadas
- **Sistema de Votação** (upvote/downvote)
- **Aceitar Respostas** (marcar solução)
- **Sistema de Tags** para organização de conteúdo

### 3. Experiência do Utilizador

- **Design Responsivo** (mobile-first)
- **Modo Escuro/Claro** com deteção de preferência do sistema
- **Notificações em Tempo Real**
- **Scroll Infinito** com paginação
- **Pesquisa & Filtros**
- **Estados de Carregamento** (skeletons, spinners)

### 4. Painel Admin

- **Dashboard** com estatísticas
- **Gestão de Utilizadores** (roles, banimentos)
- **Moderação de Conteúdo** (posts, comentários)
- **Gestão de Tags**
- **Configurações do Sistema** (modo manutenção)
- **Gestão de Política de Cookies**

### 5. SEO & Analytics

- **Meta Tags Dinâmicas** (por página)
- **Suporte Open Graph**
- **Twitter Cards**
- **Geração de Sitemap.xml**
- **Integração Google Search Console**
- **Rastreamento Google Analytics**
- **Dados Estruturados** (JSON-LD)

---

## 🔄 Gestão de Estado

### Stores Zustand

#### `authStore.ts`

Gere o estado de autenticação do utilizador, tokens JWT e dados do perfil.

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

Gere as preferências de modo escuro/claro com persistência em localStorage.

```typescript
interface ThemeState {
  theme: "dark" | "light";
  toggleTheme: () => void;
  setTheme: (theme: "dark" | "light") => void;
}
```

#### `maintenanceStore.ts`

Controla a exibição do modo de manutenção para utilizadores não-admin.

### TanStack Query

Utilizado para:

- **Caching de Estado do Servidor**
- **Refetching Automático**
- **Atualizações Otimistas** (votação)
- **Queries Infinitas** (paginação do feed)
- **Invalidação de Queries**

---

## 🚏 Rotas

### Rotas Públicas

| Caminho           | Componente    | Descrição                |
| ----------------- | ------------- | ------------------------ |
| `/`               | Feed          | Página inicial com posts |
| `/login`          | Login         | Autenticação             |
| `/register`       | Register      | Registo de utilizador    |
| `/post/:slug`     | PostDetails   | Detalhes do post         |
| `/user/:username` | UserProfile   | Perfil de utilizador     |
| `/tags`           | Tags          | Diretório de tags        |
| `/search`         | Search        | Página de pesquisa       |
| `/privacy`        | PrivacyPolicy | Política de privacidade  |
| `/terms`          | TermsOfUse    | Termos de utilização     |
| `/cookies`        | CookiePolicy  | Política de cookies      |

### Rotas Protegidas (Autenticadas)

| Caminho           | Componente  | Role Necessário    |
| ----------------- | ----------- | ------------------ |
| `/posts/new`      | CreatePost  | Utilizador         |
| `/posts/:id/edit` | EditPost    | Utilizador (autor) |
| `/profile/edit`   | EditProfile | Utilizador         |

### Rotas Admin

| Caminho                | Componente        | Role Necessário |
| ---------------------- | ----------------- | --------------- |
| `/admin`               | AdminDashboard    | Admin           |
| `/admin/users`         | AdminUsers        | Admin           |
| `/admin/posts`         | AdminPosts        | Admin           |
| `/admin/tags`          | AdminTags         | Admin           |
| `/admin/settings`      | AdminSettings     | Admin           |
| `/admin/cookie-policy` | AdminCookiePolicy | Admin/Moderador |

### Rotas Moderador

| Caminho              | Componente         | Role Necessário |
| -------------------- | ------------------ | --------------- |
| `/moderator`         | ModeratorDashboard | Moderador       |
| `/moderator/posts`   | ModeratorPosts     | Moderador       |
| `/moderator/reports` | ModeratorReports   | Moderador       |

---

## 🔍 SEO & Analytics

### Meta Tags Dinâmicas

Utilizando `react-helmet-async`, cada página tem meta tags únicas:

```tsx
<Seo
  title="Feed da Comunidade"
  description="Descubra discussões e ajude outros programadores"
/>
```

### Google Search Console

- **Meta Tag de Verificação** adicionada ao `index.html`
- **Sitemap** submetido em `https://alldev.pt/sitemap.xml`
- **Inspeção de URL** disponível para debugging

### Google Analytics

- **Rastreamento Configurado**: Sim
- **Eventos Rastreados**: Visualizações de página, interações do utilizador
- **Dashboard em Tempo Real**: Disponível no Google Analytics

### Dados Estruturados

Schema JSON-LD para:

- **WebSite** (ação de pesquisa)
- **Organization** (informação de contacto)

---

## 🚀 Deployment

### Plataforma: Vercel

**URL em Produção**: [https://alldev.pt](https://alldev.pt)

### Configuração (`vercel.json`)

```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "framework": "vite",
  "rewrites": [
    {
      "source": "/api/:path*",
      "destination": "https://api.alldev.pt/api/:path*"
    },
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}
```

### Proxy de API

Todos os pedidos `/api/*` são redirecionados para o backend VPS em `api.alldev.pt`.

### Variáveis de Ambiente (Vercel)

Configuradas no painel da Vercel:

- `VITE_API_URL` - URL da API do backend

### Processo de Deployment

1. **Push para GitHub** (branch main)
2. **Auto-Deploy da Vercel** (acionado por webhook)
3. **Build** (build de produção Vite)
4. **Deploy** (distribuição CDN)
5. **Purge de Cache** (automático)

---

## 💻 Desenvolvimento

### Pré-requisitos

- Node.js 20+
- npm ou yarn

### Instalação

```bash
# Clonar repositório
git clone https://github.com/yourusername/alldev-community-hub.git
cd alldev-community-hub/alldev-frontend

# Instalar dependências
npm install

# Iniciar servidor de desenvolvimento
npm run dev
```

### Scripts Disponíveis

```bash
npm run dev          # Iniciar servidor dev (http://localhost:5173)
npm run build        # Build de produção
npm run build:dev    # Build de desenvolvimento
npm run preview      # Pré-visualizar build de produção
npm run lint         # Executar ESLint
```

### Variáveis de Ambiente

Criar `.env.local`:

```env
VITE_API_URL=http://localhost:3001/api
```

---

## 📞 Contacto

### Responsável pelo Projeto

**Mamadu Sama**  
📧 Email: [geral@alldev.pt](mailto:geral@alldev.pt)  
🌐 Website: [https://alldev.pt](https://alldev.pt)
💼 LinkedIn: [linkedin.com/in/mamadusama](https://linkedin.com/in/mamadusama)  
🐙 GitHub: [@mamadu-sama](https://github.com/mamadu-sama)

### Suporte

Para reportar bugs e solicitar funcionalidades, por favor abra uma issue no GitHub ou contacte via email.

---

---

**Última Atualização**: Dezembro 2025  
**Versão**: 1.0.0  
**Estado**: Produção
