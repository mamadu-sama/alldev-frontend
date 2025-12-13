import api from './api';

export const adminService = {
  async getAllUsers(page: number = 1, limit: number = 50) {
    const response = await api.get('/admin/users', {
      params: { page, limit },
    });
    return {
      data: response.data.data,
      meta: response.data.meta,
    };
  },

  async updateUserRole(userId: string, roles: string[]) {
    const response = await api.patch(`/admin/users/${userId}/role`, { roles });
    return response.data.data;
  },

  async banUser(userId: string, reason: string, duration?: number) {
    const response = await api.post(`/admin/users/${userId}/ban`, {
      reason,
      duration,
    });
    return response.data;
  },

  async unbanUser(userId: string) {
    const response = await api.post(`/admin/users/${userId}/unban`);
    return response.data;
  },

  async deleteUser(userId: string) {
    await api.delete(`/admin/users/${userId}`);
  },

  async getMaintenanceMode() {
    const response = await api.get('/admin/maintenance');
    return response.data.data;
  },

  async updateMaintenanceMode(
    isActive: boolean,
    message?: string,
    allowedRoles?: string[]
  ) {
    const response = await api.post('/admin/maintenance', {
      isActive,
      message,
      allowedRoles,
    });
    return response.data.data;
  },

  async getStatistics() {
    const response = await api.get('/admin/statistics');
    return response.data.data;
  },
};


