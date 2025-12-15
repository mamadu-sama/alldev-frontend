import api from './api';
import { Tag } from '@/types';

export interface CreateTagData {
  name: string;
  description?: string;
}

export interface UpdateTagData {
  name?: string;
  description?: string;
}

export const tagService = {
  async getTags(sort?: 'popular' | 'name' | 'new', search?: string): Promise<Tag[]> {
    const params: any = {};
    if (sort) params.sort = sort;
    if (search) params.search = search;

    const response = await api.get('/tags', { params });
    return response.data.data;
  },

  async getTagBySlug(slug: string): Promise<Tag> {
    const response = await api.get(`/tags/${slug}`);
    return response.data.data;
  },

  async getPostsByTag(slug: string, page: number = 1, limit: number = 20): Promise<{
    posts: any[];
    tag: Tag;
    total: number;
    page: number;
    limit: number;
    hasMore: boolean;
  }> {
    const response = await api.get(`/tags/${slug}/posts`, {
      params: { page, limit },
    });
    return {
      posts: response.data.data,
      tag: response.data.meta.tag,
      total: response.data.meta.total,
      page: response.data.meta.page,
      limit: response.data.meta.limit,
      hasMore: response.data.meta.hasMore,
    };
  },

  async createTag(data: CreateTagData): Promise<Tag> {
    const response = await api.post('/tags', data);
    return response.data.data;
  },

  async updateTag(tagId: string, data: UpdateTagData): Promise<Tag> {
    const response = await api.patch(`/tags/${tagId}`, data);
    return response.data.data;
  },

  async deleteTag(tagId: string): Promise<void> {
    await api.delete(`/tags/${tagId}`);
  },
};


