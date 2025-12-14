import api from "./api";

export interface FeatureRequest {
  id: string;
  title: string;
  description: string;
  category: string;
  status:
    | "PENDING"
    | "REVIEWING"
    | "PLANNED"
    | "IN_PROGRESS"
    | "COMPLETED"
    | "DECLINED";
  author: {
    id: string;
    username: string;
    avatarUrl: string | null;
  };
  voteCount: number;
  commentCount: number;
  hasVoted?: boolean;
  createdAt: string;
  comments?: FeatureRequestComment[];
}

export interface FeatureRequestComment {
  id: string;
  content: string;
  author: {
    id: string;
    username: string;
    avatarUrl: string | null;
  };
  createdAt: string;
}

export interface CreateFeatureRequestData {
  title: string;
  description: string;
  category: string;
}

export interface FeatureRequestStats {
  total: number;
  inProgress: number;
  completed: number;
  totalVotes: number;
}

export const featureRequestService = {
  async getAll(
    page: number = 1,
    limit: number = 20,
    sortBy: "votes" | "recent" | "comments" = "votes",
    category?: string,
    status?: string
  ): Promise<{ data: FeatureRequest[]; meta: any }> {
    let url = `/feature-requests?page=${page}&limit=${limit}&sortBy=${sortBy}`;
    if (category && category !== "all") url += `&category=${category}`;
    if (status && status !== "all") url += `&status=${status}`;

    const response = await api.get(url);
    return {
      data: response.data.data,
      meta: response.data.meta,
    };
  },

  async getById(id: string): Promise<FeatureRequest> {
    const response = await api.get(`/feature-requests/${id}`);
    return response.data.data;
  },

  async create(data: CreateFeatureRequestData): Promise<FeatureRequest> {
    const response = await api.post("/feature-requests", data);
    return response.data.data;
  },

  async toggleVote(
    id: string
  ): Promise<{ hasVoted: boolean; voteCount: number }> {
    const response = await api.post(`/feature-requests/${id}/vote`);
    return response.data.data;
  },

  async addComment(
    id: string,
    content: string
  ): Promise<FeatureRequestComment> {
    const response = await api.post(`/feature-requests/${id}/comments`, {
      content,
    });
    return response.data.data;
  },

  async updateStatus(id: string, status: string): Promise<FeatureRequest> {
    const response = await api.patch(`/feature-requests/${id}/status`, {
      status,
    });
    return response.data.data;
  },

  async getStats(): Promise<FeatureRequestStats> {
    const response = await api.get("/feature-requests/stats");
    return response.data.data;
  },
};
