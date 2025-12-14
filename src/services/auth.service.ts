import api from './api';

export interface RegisterData {
  username: string;
  email: string;
  password: string;
}

export interface LoginData {
  email: string;
  password: string;
}

export interface LoginResponse {
  user: {
    id: string;
    username: string;
    email: string;
    avatarUrl?: string;
    bio?: string;
    skills: string[];
    reputation: number;
    level: string;
    roles?: string[]; // Roles: USER, MODERATOR, ADMIN
    isVerified: boolean;
    createdAt: string;
  };
  accessToken: string;
  refreshToken: string;
}

export const authService = {
  async register(data: RegisterData) {
    const response = await api.post('/auth/register', data);
    return response.data;
  },

  async login(data: LoginData): Promise<LoginResponse> {
    const response = await api.post('/auth/login', data);
    if (response.data.success) {
      return response.data.data;
    }
    throw new Error(response.data.error?.message || 'Login failed');
  },

  async logout(refreshToken: string) {
    try {
      await api.post('/auth/logout', { refreshToken });
    } catch (error) {
      console.error('Logout error:', error);
    }
  },

  async forgotPassword(email: string) {
    const response = await api.post('/auth/forgot-password', { email });
    return response.data;
  },

  async resetPassword(token: string, password: string) {
    const response = await api.post('/auth/reset-password', { token, password });
    return response.data;
  },

  async verifyEmail(token: string) {
    const response = await api.post('/auth/verify-email', { token });
    return response.data;
  },

  async changePassword(currentPassword: string, newPassword: string) {
    const response = await api.post('/auth/change-password', {
      currentPassword,
      newPassword,
    });
    return response.data;
  },

  async refreshToken(refreshToken: string) {
    const response = await api.post('/auth/refresh', { refreshToken });
    return response.data;
  },
};

