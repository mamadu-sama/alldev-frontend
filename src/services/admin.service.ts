import api from "./api";

export interface AdminStats {
  totalUsers: number;
  totalPosts: number;
  totalComments: number;
  totalReports: number;
}

export interface RecentPost {
  id: string;
  title: string;
  author: {
    username: string;
  };
  createdAt: string;
  voteCount: number;
  commentCount: number;
}

export interface RecentUser {
  id: string;
  username: string;
  email: string;
  avatarUrl: string | null;
  createdAt: string;
  reputation: number;
}

export interface AdminUser {
  id: string;
  username: string;
  email: string;
  avatarUrl: string | null;
  reputation: number;
  level: string;
  isActive: boolean;
  roles: string[];
  createdAt: string;
}

export interface AdminPost {
  id: string;
  title: string;
  slug: string;
  isHidden: boolean;
  author: {
    username: string;
  };
  voteCount: number;
  commentCount: number;
  createdAt: string;
}

export interface AdminComment {
  id: string;
  content: string;
  author: {
    username: string;
  };
  post: {
    title: string;
    slug: string;
  };
  voteCount: number;
  createdAt: string;
}

export interface AdminNotificationPayload {
  title: string;
  message: string;
  type: 'info' | 'warning' | 'success' | 'error';
  targetAudience: 'all' | 'admins' | 'moderators' | 'users';
}

export interface AdminNotificationHistory {
  id: string;
  title: string;
  message: string;
  type: string;
  sender: {
    username: string;
  };
  createdAt: string;
  stats: {
    totalSent: number;
    totalRead: number;
  };
}

export const adminService = {
  // Statistics
  async getStatistics(): Promise<AdminStats> {
    const response = await api.get('/admin/statistics');
    return response.data.data;
  },

  async getRecentPosts(): Promise<RecentPost[]> {
    const response = await api.get('/admin/recent-posts');
    return response.data.data;
  },

  async getRecentUsers(): Promise<RecentUser[]> {
    const response = await api.get('/admin/recent-users');
    return response.data.data;
  },

  // User Management
  async getAllUsers(page: number = 1, limit: number = 50): Promise<any> {
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
    const response = await api.get('/admin/tags');
    return response.data.data;
  },

  async createTag(data: { name: string; description: string }): Promise<any> {
    const response = await api.post('/admin/tags', data);
    return response.data.data;
  },

  async updateTag(tagId: string, data: { name: string; description: string }): Promise<any> {
    const response = await api.patch(`/admin/tags/${tagId}`, data);
    return response.data.data;
  },

  async deleteTag(tagId: string): Promise<void> {
    await api.delete(`/admin/tags/${tagId}`);
  },

  // Reports Management
  async getAllReports(page: number = 1, limit: number = 50, status?: string): Promise<any> {
    let url = `/admin/reports?page=${page}&limit=${limit}`;
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
    await api.patch(`/admin/reports/${reportId}`, { status, resolution });
  },

  // Settings Management
  async getSettings(): Promise<any> {
    const response = await api.get('/admin/settings');
    return response.data.data;
  },

  async updateSettings(data: any): Promise<any> {
    const response = await api.patch('/admin/settings', data);
    return response.data.data;
  },

  // Maintenance Mode
  async getMaintenanceMode(): Promise<any> {
    const response = await api.get('/admin/maintenance');
    return response.data.data;
  },

  async updateMaintenanceMode(data: {
    isEnabled: boolean;
    message?: string;
    endTime?: string | null;
  }): Promise<any> {
    const response = await api.post('/admin/maintenance', data);
    return response.data.data;
  },

  // Notifications
  async sendBroadcastNotification(data: AdminNotificationPayload): Promise<{ sent: number }> {
    const response = await api.post('/admin/notifications/broadcast', data);
    return response.data.data;
  },

  async getNotificationHistory(page: number = 1, limit: number = 50): Promise<any> {
    const response = await api.get(`/admin/notifications/history?page=${page}&limit=${limit}`);
    return {
      data: response.data.data,
      meta: response.data.meta,
    };
  },

  // Notification Sounds Management
  async getNotificationSounds(activeOnly: boolean = false): Promise<any> {
    const response = await api.get(`/notification-sounds?activeOnly=${activeOnly}`);
    return response.data;
  },

  async uploadNotificationSound(formData: FormData): Promise<any> {
    const response = await api.post('/admin/notification-sounds', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  async updateNotificationSound(soundId: string, data: any): Promise<any> {
    const response = await api.patch(`/admin/notification-sounds/${soundId}`, data);
    return response.data;
  },

  async deleteNotificationSound(soundId: string): Promise<void> {
    await api.delete(`/admin/notification-sounds/${soundId}`);
  },

  async getSoundStatistics(soundId: string): Promise<any> {
    const response = await api.get(`/admin/notification-sounds/${soundId}/statistics`);
    return response.data;
  },
};
