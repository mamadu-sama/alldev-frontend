import api from './api';
import { Comment, PaginatedResponse } from '@/types';

export interface CreateCommentData {
  content: string;
  parentId?: string;
}

export interface UpdateCommentData {
  content: string;
}

export const commentService = {
  async getComments(
    postId: string,
    page: number = 1,
    limit: number = 20
  ): Promise<PaginatedResponse<Comment>> {
    const response = await api.get(`/posts/${postId}/comments`, {
      params: { page, limit },
    });
    return {
      data: response.data.data,
      meta: response.data.meta,
    };
  },

  async createComment(postId: string, data: CreateCommentData): Promise<Comment> {
    const response = await api.post(`/posts/${postId}/comments`, data);
    return response.data.data;
  },

  async updateComment(commentId: string, data: UpdateCommentData): Promise<Comment> {
    const response = await api.patch(`/comments/${commentId}`, data);
    return response.data.data;
  },

  async deleteComment(commentId: string): Promise<void> {
    await api.delete(`/comments/${commentId}`);
  },

  async acceptComment(commentId: string): Promise<Comment> {
    const response = await api.post(`/comments/${commentId}/accept`);
    return response.data.data;
  },
};


