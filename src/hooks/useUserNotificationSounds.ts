import { useQuery } from "@tanstack/react-query";
import { useCallback, useRef } from "react";
import { notificationSoundService } from "@/services/notification-sound.service";
import { useNotificationSoundStore } from "@/stores/notificationSoundStore";
import { useAuthStore } from "@/stores/authStore";

export type NotificationType =
  | "COMMENT"
  | "REPLY"
  | "VOTE"
  | "ACCEPTED"
  | "SYSTEM"
  | "MENTION";

/**
 * Hook to play notification sounds based on user preferences from database
 * This integrates with the backend to use configured sounds from S3
 */
export function useUserNotificationSounds() {
  const { isAuthenticated } = useAuthStore();
  const { enabled, volume } = useNotificationSoundStore();
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const canPlayRef = useRef(true);

  // Fetch all available sounds
  const { data: sounds } = useQuery({
    queryKey: ["notification-sounds"],
    queryFn: () => notificationSoundService.getAllSounds(true),
    enabled: isAuthenticated,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  // Fetch user preferences
  const { data: preferences } = useQuery({
    queryKey: ["user-sound-preferences"],
    queryFn: () => notificationSoundService.getUserPreferences(),
    enabled: isAuthenticated,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  /**
   * Get the sound URL for a specific notification type
   */
  const getSoundForType = useCallback(
    (type: NotificationType): string | null => {
      if (!preferences || !sounds) return null;

      // Find user preference for this type
      const pref = preferences.find((p) => p.notificationType === type);

      // Check if sound is disabled for this type
      if (pref && !pref.enabled) {
        return null;
      }

      // If user has a specific sound configured
      if (pref?.soundId && pref.sound) {
        return pref.sound.fileUrl;
      }

      // Fallback to default sound
      const defaultSound = sounds.find((s) => s.isDefault && s.isActive);
      return defaultSound?.fileUrl || null;
    },
    [preferences, sounds]
  );

  /**
   * Play notification sound for a specific type
   */
  const playNotificationSound = useCallback(
    async (type: NotificationType): Promise<void> => {
      try {
        // Check if sound is globally enabled
        if (!enabled) {
          console.log("🔇 Sons desativados globalmente");
          return Promise.resolve();
        }

        // Rate limiting - prevent playing too many sounds at once
        if (!canPlayRef.current) {
          console.log("⏱️ Rate limit - aguardando...");
          return Promise.resolve();
        }

        // Get sound URL for this notification type
        const soundUrl = getSoundForType(type);

        if (!soundUrl) {
          console.log(`🔇 Sem som configurado para tipo: ${type}`);
          return Promise.resolve();
        }

        console.log(`🔊 Tocando som para ${type}: ${soundUrl}`);

        // Rate limiting
        canPlayRef.current = false;
        setTimeout(() => {
          canPlayRef.current = true;
        }, 500); // Minimum 500ms between sounds

        // Stop any currently playing sound
        if (audioRef.current) {
          audioRef.current.pause();
          audioRef.current = null;
        }

        // Create new audio element
        const audio = new Audio(soundUrl);
        audio.volume = volume;
        audioRef.current = audio;

        // Error handling
        audio.onerror = (error) => {
          console.error("❌ Erro ao carregar som:", error);
          audioRef.current = null;
        };

        // Cleanup on end
        audio.onended = () => {
          audioRef.current = null;
        };

        // Play the sound
        await audio.play();
        console.log("✅ Som reproduzido com sucesso");

        return Promise.resolve();
      } catch (error) {
        console.error("❌ Erro ao reproduzir som:", error);
        audioRef.current = null;
        return Promise.reject(error);
      }
    },
    [enabled, volume, getSoundForType]
  );

  return {
    playNotificationSound,
    sounds,
    preferences,
    enabled,
    volume,
  };
}
