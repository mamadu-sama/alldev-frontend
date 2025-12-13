import api from './api';

export interface CreateReportData {
  reason: 'SPAM' | 'INAPPROPRIATE' | 'OFFENSIVE' | 'MISINFORMATION' | 'OTHER';
  description: string;
  postId?: string;
  commentId?: string;
}

export const reportService = {
  async createReport(data: CreateReportData) {
    const response = await api.post('/reports', data);
    return response.data.data;
  },

  async getReports(page: number = 1, limit: number = 20, status?: string) {
    const params: any = { page, limit };
    if (status) params.status = status;

    const response = await api.get('/reports', { params });
    return {
      data: response.data.data,
      meta: response.data.meta,
    };
  },

  async updateReportStatus(reportId: string, status: string, resolution?: string) {
    const response = await api.patch(`/reports/${reportId}`, {
      status,
      resolution,
    });
    return response.data.data;
  },
};


