import api from './api';

export type QueryParams = Record<string, string | number | undefined>;

export interface PaginationMeta {
  total: number;
  perPage: number;
  currentPage: number;
  lastPage: number;
}

/**
 * Generic paginated response wrapper.
 */
export interface PaginatedResponse<T> {
  data: T[];
  meta: PaginationMeta;
}

/**
 * History response including additional stats.
 */
export interface HistoryResponse<T = Record<string, unknown>> {
  data: T[];
  meta: PaginationMeta;
  stats: Record<string, unknown>;
}

export interface ModeratorStats {
  pendingReports: number;
  urgentReports: number;
  resolvedToday: number;
  resolvedPercentageChange: number;
  hiddenPostsThisWeek: number;
  warningsThisMonth: number;
  reportsThisWeek: number;
}

export interface QueueStats {
  urgent: number;
  high: number;
  medium: number;
  low: number;
  total: number;
}

export interface QueueItem {
  id: string;
  type: 'POST' | 'COMMENT';
  content: string;
  title?: string;
  slug?: string;
  author: {
    id: string;
    username: string;
    avatarUrl?: string;
    reputation: number;
  };
  reports: number;
  reason: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  createdAt: string;
  reportedAt: string;
  firstReportId: string;
}

export interface RecentQueueItem {
  id: string;
  type: string;
  title: string;
  author: {
    username: string;
    avatarUrl?: string;
  };
  reports: number;
  createdAt: string;
}

export interface TakeActionData {
  targetId: string;
  targetType: 'POST' | 'COMMENT';
  actionType: string;
  reason?: string;
  notes?: string;
}

export const moderatorService = {
  async getDashboardStats(): Promise<ModeratorStats> {
    const response = await api.get('/moderator/dashboard/stats');
    return response.data.data;
  },

  async getQueueStats(): Promise<QueueStats> {
    const response = await api.get('/moderator/queue/stats');
    return response.data.data;
  },

  async getQueue(
    page: number = 1,
    limit: number = 20,
    priority?: string,
    type?: string
  ): Promise<{ data: QueueItem[]; meta: PaginationMeta }> {
    const params: QueryParams = { page, limit };
    if (priority && priority !== 'all') params.priority = priority;
    if (type && type !== 'all') params.type = type;

    const response = await api.get('/moderator/queue', { params });
    return response.data;
  },

  async getRecentQueueItems(limit: number = 5): Promise<RecentQueueItem[]> {
    const response = await api.get('/moderator/queue/recent', {
      params: { limit },
    });
    return response.data.data;
  },

  async takeAction(actionData: TakeActionData): Promise<void> {
    await api.post('/moderator/actions', actionData);
  },

  async getReportedPosts(
    page: number = 1,
    limit: number = 20,
    search?: string,
    status?: string
  ): Promise<PaginatedResponse<Record<string, unknown>>> {
    const params: QueryParams = { page, limit };
    if (search) params.search = search;
    if (status && status !== 'all') params.status = status;

    const response = await api.get('/moderator/posts/reported', { params });
    return response.data;
  },

  async getReportedComments(
    page: number = 1,
    limit: number = 20,
    search?: string,
    status?: string
  ): Promise<PaginatedResponse<Record<string, unknown>>> {
    const params: QueryParams = { page, limit };
    if (search) params.search = search;
    if (status && status !== 'all') params.status = status;

    const response = await api.get('/moderator/comments/reported', { params });
    return response.data;
  },

  async getReports(
    page: number = 1,
    limit: number = 20,
    search?: string,
    status?: string,
    type?: string
  ): Promise<PaginatedResponse<Record<string, unknown>>> {
    const params: QueryParams = { page, limit };
    if (search) params.search = search;
    if (status && status !== 'all') params.status = status;
    if (type && type !== 'all') params.type = type;

    const response = await api.get('/moderator/reports', { params });
    return response.data;
  },

  async resolveReport(
    reportId: string,
    action: 'resolve' | 'dismiss' | 'escalate',
    notes?: string
  ): Promise<void> {
    await api.post(`/moderator/reports/${reportId}/resolve`, { action, notes });
  },

  async getHistory(
    page: number = 1,
    limit: number = 20,
    search?: string,
    actionType?: string
  ): Promise<HistoryResponse> {
    const params: QueryParams = { page, limit };
    if (search) params.search = search;
    if (actionType && actionType !== 'all') params.actionType = actionType;

    const response = await api.get('/moderator/history', { params });
    return response.data;
  },
};

