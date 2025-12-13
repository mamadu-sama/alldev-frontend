import api from './api';
import { Post, Tag, User, PaginatedResponse } from '@/types';

export interface SearchResults {
  posts: Post[];
  tags: Tag[];
  users: User[];
  meta: {
    page: number;
    limit: number;
    total: number;
    hasMore: boolean;
  };
}

export interface AutocompleteResult {
  id: string;
  name?: string;
  username?: string;
  slug?: string;
  avatarUrl?: string;
  postCount?: number;
  reputation?: number;
  level?: string;
}

export const searchService = {
  async searchGlobal(
    query: string,
    page: number = 1,
    limit: number = 20
  ): Promise<SearchResults> {
    const response = await api.get('/search', {
      params: { q: query, page, limit },
    });
    return response.data.data;
  },

  async searchPosts(
    query: string,
    page: number = 1,
    limit: number = 20,
    tag?: string
  ): Promise<PaginatedResponse<Post>> {
    const params: any = { q: query, page, limit };
    if (tag) params.tag = tag;

    const response = await api.get('/search/posts', { params });
    return {
      data: response.data.data,
      meta: response.data.meta,
    };
  },

  async autocomplete(
    query: string,
    type: 'tags' | 'users' = 'tags'
  ): Promise<AutocompleteResult[]> {
    const response = await api.get('/search/autocomplete', {
      params: { q: query, type },
    });
    return response.data.data;
  },
};


