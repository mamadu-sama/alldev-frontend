import api from "./api";

export interface CommunityStats {
  totalPosts: number;
  totalUsers: number;
  resolvedPosts: number;
  todayPosts: number;
}

export const statsService = {
  async getCommunityStats(): Promise<CommunityStats> {
    const response = await api.get("/stats/community");
    return response.data.data;
  },
};

