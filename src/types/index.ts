export interface User {
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

export interface Post {
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

export interface Comment {
  id: string;
  content: string;
  postId: string;
  author: User;
  votes: number;
  userVote?: 'up' | 'down' | null;
  isAccepted: boolean;
  createdAt: string;
}

export interface Notification {
  id: string;
  type: 'comment' | 'reply' | 'vote' | 'accepted' | 'mention';
  message: string;
  read: boolean;
  relatedPostId?: string;
  relatedPostSlug?: string;
  relatedCommentId?: string;
  createdAt: string;
}

export interface Tag {
  id: string;
  name: string;
  slug: string;
  description: string;
  postCount: number;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  login: (user: User, token: string) => void;
  logout: () => void;
  updateUser: (user: Partial<User>) => void;
}

export interface ThemeState {
  theme: 'dark' | 'light';
  toggleTheme: () => void;
  setTheme: (theme: 'dark' | 'light') => void;
}

export type VoteType = 'up' | 'down';
export type VotableType = 'post' | 'comment';

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  hasMore: boolean;
}

export type PostFilter = 'recent' | 'votes' | 'unanswered' | 'following';
export type VoteTimeFilter = 'today' | 'week' | 'month' | 'all';
