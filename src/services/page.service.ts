import api from "./api";

export interface StaticPage {
  id: string;
  slug: string;
  title: string;
  content: string;
  metaDescription?: string;
  isPublished: boolean;
  version: number;
  updatedBy?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreatePageData {
  slug: string;
  title: string;
  content: string;
  metaDescription?: string;
  isPublished?: boolean;
}

export interface UpdatePageData {
  slug?: string;
  title?: string;
  content?: string;
  metaDescription?: string;
  isPublished?: boolean;
}

export const pageService = {
  // ============================================
  // PUBLIC ENDPOINTS
  // ============================================

  /**
   * Get all published pages (for footer/navigation)
   */
  async getPublishedPages() {
    const response = await api.get("/pages/published");
    return response.data;
  },

  /**
   * Get single page by slug (public)
   */
  async getPageBySlug(slug: string) {
    const response = await api.get(`/pages/${slug}`);
    return response.data;
  },

  // ============================================
  // ADMIN ENDPOINTS
  // ============================================

  /**
   * Get all pages (admin - includes unpublished)
   */
  async getAllPages() {
    const response = await api.get("/pages/admin/all");
    return response.data;
  },

  /**
   * Get single page by ID (admin - for editing)
   */
  async getPageById(id: string) {
    const response = await api.get(`/pages/admin/${id}`);
    return response.data;
  },

  /**
   * Create new page (admin)
   */
  async createPage(data: CreatePageData) {
    const response = await api.post("/pages/admin", data);
    return response.data;
  },

  /**
   * Update page (admin)
   */
  async updatePage(id: string, data: UpdatePageData) {
    const response = await api.patch(`/pages/admin/${id}`, data);
    return response.data;
  },

  /**
   * Delete page (admin)
   */
  async deletePage(id: string) {
    await api.delete(`/pages/admin/${id}`);
  },

  /**
   * Toggle publish status (admin)
   */
  async togglePublishStatus(id: string) {
    const response = await api.patch(`/pages/admin/${id}/toggle-publish`);
    return response.data;
  },

  /**
   * Seed default pages (admin)
   */
  async seedDefaultPages() {
    const response = await api.post("/pages/admin/seed-default");
    return response.data;
  },
};
