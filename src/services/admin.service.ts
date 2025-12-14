import api from "./api";

export interface AdminStatistics {
  users: {
    total: number;
    active: number;
    recentWeek: number;
  };
  posts: {
    total: number;
    recentWeek: number;
  };
  comments: {
    total: number;
  };
  tags: {
    total: number;
  };
  reports: {
    pending: number;
  };
  views: {
    total: number;
  };
}

export interface RecentPost {
  id: string;
  title: string;
  slug: string;
  createdAt: string;
  author: {
    id: string;
    username: string;
    avatarUrl: string | null;
  };
  _count: {
    comments: number;
  };
}

export interface RecentUser {
  id: string;
  username: string;
  email: string;
  avatarUrl: string | null;
  level: string;
  createdAt: string;
}

export interface AdminUser {
  id: string;
  username: string;
  email: string;
  avatarUrl: string | null;
  bio: string | null;
  reputation: number;
  level: string;
  roles: Array<{ role: string }>;
  isActive: boolean;
  isVerified: boolean;
  createdAt: string;
  _count: {
    posts: number;
    comments: number;
  };
}

export interface PaginatedUsers {
  data: AdminUser[];
  meta: {
    page: number;
    limit: number;
    total: number;
    hasMore: boolean;
  };
}

export const adminService = {
  async getStatistics(): Promise<AdminStatistics> {
    const response = await api.get("/admin/statistics");
    return response.data.data;
  },

  async getRecentPosts(limit: number = 10): Promise<RecentPost[]> {
    const response = await api.get(`/admin/recent-posts?limit=${limit}`);
    return response.data.data;
  },

  async getRecentUsers(limit: number = 10): Promise<RecentUser[]> {
    const response = await api.get(`/admin/recent-users?limit=${limit}`);
    return response.data.data;
  },

  // User Management
  async getAllUsers(page: number = 1, limit: number = 50): Promise<PaginatedUsers> {
    const response = await api.get(`/admin/users?page=${page}&limit=${limit}`);
    return {
      data: response.data.data,
      meta: response.data.meta,
    };
  },

  async updateUserRole(userId: string, roles: string[]): Promise<void> {
    await api.patch(`/admin/users/${userId}/role`, { roles });
  },

  async banUser(userId: string, reason: string, duration?: number): Promise<void> {
    await api.post(`/admin/users/${userId}/ban`, { reason, duration });
  },

  async unbanUser(userId: string): Promise<void> {
    await api.post(`/admin/users/${userId}/unban`);
  },

  async deleteUser(userId: string): Promise<void> {
    await api.delete(`/admin/users/${userId}`);
  },

  // Posts Management
  async getAllPosts(page: number = 1, limit: number = 50): Promise<any> {
    const response = await api.get(`/admin/posts?page=${page}&limit=${limit}`);
    return {
      data: response.data.data,
      meta: response.data.meta,
    };
  },

  async deletePost(postId: string): Promise<void> {
    await api.delete(`/admin/posts/${postId}`);
  },

  async hidePost(postId: string, reason: string): Promise<void> {
    await api.post(`/admin/posts/${postId}/hide`, { reason });
  },

  async unhidePost(postId: string): Promise<void> {
    await api.post(`/admin/posts/${postId}/unhide`);
  },

  // Comments Management
  async getAllComments(page: number = 1, limit: number = 50): Promise<any> {
    const response = await api.get(`/admin/comments?page=${page}&limit=${limit}`);
    return {
      data: response.data.data,
      meta: response.data.meta,
    };
  },

  async deleteComment(commentId: string): Promise<void> {
    await api.delete(`/admin/comments/${commentId}`);
  },

  // Tags Management
  async getAllTags(): Promise<any> {
    const response = await api.get('/tags');
    return response.data.data;
  },

  async createTag(data: { name: string; description: string }): Promise<any> {
    const response = await api.post('/tags', data);
    return response.data.data;
  },

  async updateTag(tagId: string, data: { name: string; description: string }): Promise<any> {
    const response = await api.patch(`/tags/${tagId}`, data);
    return response.data.data;
  },

  async deleteTag(tagId: string): Promise<void> {
    await api.delete(`/tags/${tagId}`);
  },

  // Reports Management
  async getAllReports(page: number = 1, limit: number = 50, status?: string): Promise<any> {
    let url = `/reports?page=${page}&limit=${limit}`;
    if (status && status !== 'all') {
      url += `&status=${status}`;
    }
    const response = await api.get(url);
    return {
      data: response.data.data,
      meta: response.data.meta,
    };
  },

  async updateReportStatus(reportId: string, status: string, resolution?: string): Promise<void> {
    await api.patch(`/reports/${reportId}`, { status, resolution });
  },
};
