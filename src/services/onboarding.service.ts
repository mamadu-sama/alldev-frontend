import api from "./api";

export interface OnboardingStatus {
  hasCompletedOnboarding: boolean;
  onboardingCompletedAt: string | null;
}

export interface OnboardingStats {
  total: number;
  completed: number;
  pending: number;
  completionRate: string;
}

/**
 * OnboardingService
 * Serviço para gerenciar o onboarding dos usuários
 */
class OnboardingService {
  /**
   * Verifica se o usuário completou o onboarding
   */
  async getOnboardingStatus(): Promise<OnboardingStatus> {
    const response = await api.get("/onboarding/status");
    return response.data.data;
  }

  /**
   * Marca o onboarding como completo
   */
  async completeOnboarding(): Promise<void> {
    await api.post("/onboarding/complete");
  }

  /**
   * Pula o onboarding
   */
  async skipOnboarding(): Promise<void> {
    await api.post("/onboarding/skip");
  }

  /**
   * Reseta o onboarding (para ver novamente)
   */
  async resetOnboarding(): Promise<void> {
    await api.post("/onboarding/reset");
  }

  /**
   * Obtém estatísticas de onboarding (admin)
   */
  async getOnboardingStats(): Promise<OnboardingStats> {
    const response = await api.get("/onboarding/stats");
    return response.data.data;
  }
}

export default new OnboardingService();
