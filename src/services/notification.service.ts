import api from './api';
import { Notification, PaginatedResponse } from '@/types';

export const notificationService = {
  async getNotifications(
    page: number = 1,
    limit: number = 20,
    unreadOnly: boolean = false
  ): Promise<PaginatedResponse<Notification> & { meta: { unreadCount: number } }> {
    const response = await api.get('/notifications', {
      params: { page, limit, unreadOnly },
    });
    return {
      data: response.data.data,
      meta: response.data.meta,
    };
  },

  async markAsRead(notificationId: string): Promise<Notification> {
    const response = await api.patch(`/notifications/${notificationId}/read`);
    return response.data.data;
  },

  async markAllAsRead(): Promise<void> {
    await api.post('/notifications/read-all');
  },
};


