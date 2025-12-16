import { useCallback, useRef, useEffect } from "react";
import {
  useNotificationSoundStore,
  NotificationSoundType,
} from "@/stores/notificationSoundStore";
import { soundGenerator } from "@/utils/generateNotificationSound";

export type NotificationType =
  | "COMMENT"
  | "REPLY"
  | "VOTE"
  | "ACCEPTED"
  | "SYSTEM"
  | "MENTION";

interface UseNotificationSoundOptions {
  playOnMount?: boolean;
  autoPlay?: boolean;
}

export function useNotificationSound(
  options: UseNotificationSoundOptions = {}
) {
  const { enabled, volume, useSystemSound, soundType } =
    useNotificationSoundStore();
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const canPlayRef = useRef(true);

  // Initialize audio element for system sounds
  useEffect(() => {
    if (useSystemSound) {
      audioRef.current = new Audio("/sounds/notification.mp3");
      audioRef.current.volume = volume;
    }

    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, [useSystemSound, volume]);

  // Update volume when it changes
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);

  /**
   * Play notification sound based on type
   * Returns a Promise for error handling
   */
  const playSound = useCallback(
    async (type?: NotificationType | NotificationSoundType): Promise<void> => {
      try {
        // Check if sound is enabled
        if (!enabled) {
          return Promise.resolve();
        }

        // Rate limiting - prevent playing too many sounds at once
        if (!canPlayRef.current) {
          return Promise.resolve();
        }

        canPlayRef.current = false;
        setTimeout(() => {
          canPlayRef.current = true;
        }, 500); // Minimum 500ms between sounds

        // Determine which sound to play
        const soundToPlay = type || soundType;

        if (useSystemSound && audioRef.current) {
          // Play audio file
          audioRef.current.currentTime = 0;
          return audioRef.current.play().catch((error) => {
            console.error("Error playing notification sound:", error);
            // Fallback to generated sound
            playGeneratedSound(soundToPlay);
          });
        } else {
          // Play generated sound
          playGeneratedSound(soundToPlay);
          return Promise.resolve();
        }
      } catch (error) {
        console.error("Error in playSound:", error);
        return Promise.reject(error);
      }
    },
    [enabled, volume, useSystemSound, soundType]
  );

  /**
   * Play generated sound based on type
   */
  const playGeneratedSound = useCallback(
    (type: NotificationType | NotificationSoundType) => {
      switch (type) {
        case "COMMENT":
        case "REPLY":
        case "MENTION":
        case "message":
          soundGenerator.playDoubleBeep();
          break;
        case "VOTE":
          soundGenerator.playSimpleBeep(1000, 100);
          break;
        case "ACCEPTED":
        case "success":
          soundGenerator.playSuccess();
          break;
        case "SYSTEM":
        case "warning":
          soundGenerator.playWarning();
          break;
        case "error":
          soundGenerator.playError();
          break;
        default:
          soundGenerator.playSimpleBeep();
      }
    },
    []
  );

  /**
   * Test sound - useful for settings
   */
  const testSound = useCallback(() => {
    const originalEnabled = enabled;

    // Temporarily enable sound for testing
    if (!originalEnabled) {
      useNotificationSoundStore.getState().setEnabled(true);
    }

    playSound("default");

    // Restore original state after a delay
    if (!originalEnabled) {
      setTimeout(() => {
        useNotificationSoundStore.getState().setEnabled(originalEnabled);
      }, 1000);
    }
  }, [enabled, playSound]);

  /**
   * Request permission to play audio (needed for some browsers)
   */
  const requestPermission = useCallback(async () => {
    try {
      if (audioRef.current) {
        // Try to play and immediately pause to request permission
        const playPromise = audioRef.current.play();
        if (playPromise !== undefined) {
          await playPromise;
          audioRef.current.pause();
          audioRef.current.currentTime = 0;
        }
      }
      return true;
    } catch (error) {
      console.warn("Audio permission not granted:", error);
      return false;
    }
  }, []);

  return {
    playSound,
    testSound,
    requestPermission,
    enabled,
    volume,
  };
}
