import api from './api';
import { Post, PaginatedResponse, PostFilter } from '@/types';

export interface CreatePostData {
  title: string;
  content: string;
  tagIds: string[];
}

export interface UpdatePostData {
  title?: string;
  content?: string;
  tagIds?: string[];
}

export const postService = {
  async getPosts(
    page: number = 1,
    limit: number = 20,
    filter?: PostFilter,
    tag?: string
  ): Promise<PaginatedResponse<Post>> {
    const params: any = { page, limit };
    if (filter) params.filter = filter;
    if (tag) params.tag = tag;

    const response = await api.get('/posts', { params });
    return {
      data: response.data.data,
      meta: response.data.meta,
    };
  },

  async getPostBySlug(slug: string): Promise<Post> {
    const response = await api.get(`/posts/${slug}`);
    return response.data.data;
  },

  async createPost(data: CreatePostData): Promise<Post> {
    const response = await api.post('/posts', data);
    return response.data.data;
  },

  async updatePost(postId: string, data: UpdatePostData): Promise<Post> {
    const response = await api.patch(`/posts/${postId}`, data);
    return response.data.data;
  },

  async deletePost(postId: string): Promise<void> {
    await api.delete(`/posts/${postId}`);
  },
};



