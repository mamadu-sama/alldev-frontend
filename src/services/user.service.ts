import api from './api';
import { User, Post, PaginatedResponse } from '@/types';

export interface UpdateProfileData {
  username?: string;
  bio?: string;
  skills?: string[];
  socialLinks?: {
    github?: string;
    linkedin?: string;
    twitter?: string;
    website?: string;
  };
}

export const userService = {
  async getProfile(): Promise<User> {
    const response = await api.get('/users/me');
    return response.data.data;
  },

  async updateProfile(data: UpdateProfileData): Promise<User> {
    const response = await api.patch('/users/me', data);
    return response.data.data;
  },

  async uploadAvatar(file: File): Promise<User> {
    const formData = new FormData();
    formData.append('avatar', file);

    const response = await api.post('/users/me/avatar', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data.data;
  },

  async deleteAvatar(): Promise<void> {
    await api.delete('/users/me/avatar');
  },

  async getUserByUsername(username: string): Promise<User> {
    const response = await api.get(`/users/${username}`);
    return response.data.data;
  },

  async getUserPosts(
    username: string,
    page: number = 1,
    limit: number = 20
  ): Promise<PaginatedResponse<Post>> {
    const response = await api.get(`/users/${username}/posts`, {
      params: { page, limit },
    });
    return {
      data: response.data.data,
      meta: response.data.meta,
    };
  },
};


