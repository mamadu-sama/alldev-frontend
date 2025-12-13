import api from './api';

export const moderationService = {
  async hidePost(postId: string, reason: string) {
    const response = await api.post(`/moderator/posts/${postId}/hide`, { reason });
    return response.data;
  },

  async unhidePost(postId: string) {
    const response = await api.post(`/moderator/posts/${postId}/unhide`);
    return response.data;
  },

  async lockPost(postId: string, reason: string) {
    const response = await api.post(`/moderator/posts/${postId}/lock`, { reason });
    return response.data;
  },

  async unlockPost(postId: string) {
    const response = await api.post(`/moderator/posts/${postId}/unlock`);
    return response.data;
  },

  async hideComment(commentId: string, reason: string) {
    const response = await api.post(`/moderator/comments/${commentId}/hide`, { reason });
    return response.data;
  },

  async unhideComment(commentId: string) {
    const response = await api.post(`/moderator/comments/${commentId}/unhide`);
    return response.data;
  },

  async getModerationActions(page: number = 1, limit: number = 50) {
    const response = await api.get('/moderator/actions', {
      params: { page, limit },
    });
    return {
      data: response.data.data,
      meta: response.data.meta,
    };
  },
};


