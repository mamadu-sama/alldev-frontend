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
};
