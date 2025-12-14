import api from './api';

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  reason: string;
  subject: string;
  message: string;
  ip?: string;
  status: 'PENDING' | 'READ' | 'REPLIED' | 'ARCHIVED';
  createdAt: string;
  updatedAt: string;
}

export interface ContactStats {
  total: number;
  pending: number;
  read: number;
  replied: number;
}

export const contactAdminService = {
  async getAll(
    page: number = 1,
    limit: number = 20,
    status?: string,
    reason?: string,
    search?: string
  ): Promise<{ data: ContactMessage[]; meta: any }> {
    const params: any = { page, limit };
    if (status && status !== 'all') params.status = status;
    if (reason && reason !== 'all') params.reason = reason;
    if (search) params.search = search;

    const response = await api.get('/admin/contact-messages', { params });
    return response.data;
  },

  async getById(id: string): Promise<ContactMessage> {
    const response = await api.get(`/admin/contact-messages/${id}`);
    return response.data.data;
  },

  async updateStatus(id: string, status: string): Promise<ContactMessage> {
    const response = await api.patch(`/admin/contact-messages/${id}/status`, {
      status,
    });
    return response.data.data;
  },

  async sendReply(id: string, replyMessage: string): Promise<void> {
    await api.post(`/admin/contact-messages/${id}/reply`, { replyMessage });
  },

  async deleteMessage(id: string): Promise<void> {
    await api.delete(`/admin/contact-messages/${id}`);
  },

  async getStats(): Promise<ContactStats> {
    const response = await api.get('/admin/contact-messages/stats');
    return response.data.data;
  },
};

