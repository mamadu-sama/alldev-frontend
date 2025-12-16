import api from "./api";

export interface NotificationSound {
  id: string;
  name: string;
  description?: string;
  fileName: string;
  fileUrl: string;
  fileSize: number;
  duration?: number;
  isActive: boolean;
  isDefault: boolean;
  uploadedBy: {
    id: string;
    username: string;
    avatarUrl?: string;
  };
  createdAt: string;
  _count?: {
    userPreferences: number;
  };
}

export interface UserSoundPreference {
  id: string;
  userId: string;
  notificationType: string;
  soundId: string | null;
  enabled: boolean;
  sound?: NotificationSound | null;
  createdAt: string;
  updatedAt: string;
}

export const notificationSoundService = {
  /**
   * Get all available notification sounds
   */
  async getAllSounds(activeOnly: boolean = true): Promise<NotificationSound[]> {
    const response = await api.get(
      `/notification-sounds?activeOnly=${activeOnly}`
    );
    return response.data.data;
  },

  /**
   * Get a specific sound by ID
   */
  async getSoundById(soundId: string): Promise<NotificationSound> {
    const response = await api.get(`/notification-sounds/${soundId}`);
    return response.data.data;
  },

  /**
   * Get user's sound preferences
   */
  async getUserPreferences(): Promise<UserSoundPreference[]> {
    const response = await api.get("/users/me/notification-sound-preferences");
    return response.data.data;
  },

  /**
   * Set user preference for a specific notification type
   */
  async setUserPreference(
    notificationType: string,
    soundId: string | null,
    enabled: boolean = true
  ): Promise<UserSoundPreference> {
    const response = await api.put(
      `/users/me/notification-sound-preferences/${notificationType}`,
      {
        soundId,
        enabled,
      }
    );
    return response.data.data;
  },

  /**
   * Batch update user preferences
   */
  async batchUpdatePreferences(
    preferences: Array<{
      notificationType: string;
      soundId: string | null;
      enabled: boolean;
    }>
  ): Promise<UserSoundPreference[]> {
    const response = await api.post(
      "/users/me/notification-sound-preferences/batch",
      {
        preferences,
      }
    );
    return response.data.data;
  },

  /**
   * Reset user preferences to defaults
   */
  async resetPreferences(): Promise<void> {
    await api.delete("/users/me/notification-sound-preferences");
  },

  /**
   * Play a sound (helper method)
   */
  async playSound(soundUrl: string): Promise<void> {
    return new Promise((resolve, reject) => {
      const audio = new Audio(soundUrl);

      audio.onerror = (error) => {
        console.error("Error playing sound:", error);
        reject(new Error("Failed to play sound"));
      };

      audio.onended = () => {
        resolve();
      };

      audio.play().catch(reject);
    });
  },
};
