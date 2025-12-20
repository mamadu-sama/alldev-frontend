import api from "./api";
import { User, Post, PaginatedResponse } from "@/types";

export interface UpdateProfileData {
  username?: string;
  bio?: string;
  skills?: string[];
  socialLinks?: {
    github?: string;
    linkedin?: string;
    twitter?: string;
    portfolio?: string;
  };
}

export const userService = {
  async getProfile(): Promise<User> {
    const response = await api.get("/users/me");
    return response.data.data;
  },

  async updateProfile(data: UpdateProfileData): Promise<User> {
    const response = await api.patch("/users/me", data);
    return response.data.data;
  },

  async uploadAvatar(file: File): Promise<User> {
    const formData = new FormData();
    formData.append("avatar", file);

    const response = await api.post("/users/me/avatar", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data.data;
  },

  async deleteAvatar(): Promise<void> {
    await api.delete("/users/me/avatar");
  },

  async uploadCoverImage(file: File): Promise<{ coverImageUrl: string }> {
    const formData = new FormData();
    formData.append("cover", file);

    const response = await api.post("/users/me/cover", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data.data;
  },

  async deleteCoverImage(): Promise<void> {
    await api.delete("/users/me/cover");
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
      total: response.data.meta.total,
      page: response.data.meta.page,
      limit: response.data.meta.limit,
      hasMore: response.data.meta.hasMore,
    };
  },

  /**
   * Alterar senha do usuário
   */
  async changePassword(data: {
    currentPassword: string;
    newPassword: string;
    confirmPassword: string;
  }): Promise<{ message: string }> {
    const response = await api.post("/users/me/change-password", data);
    return response.data.data;
  },

  /**
   * Deletar conta (soft delete)
   */
  async deleteAccount(data: {
    password?: string;
    token?: string;
    confirmation: string;
  }): Promise<{ message: string }> {
    const response = await api.delete("/users/me", { data });
    return response.data.data;
  },
  async requestAccountDeletion(): Promise<{ message: string }> {
    const response = await api.post("/users/me/request-deletion");
    return response.data.data;
  },
};
