import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type NotificationSoundType = 'default' | 'success' | 'warning' | 'error' | 'message';

interface NotificationSoundState {
  enabled: boolean;
  volume: number;
  useSystemSound: boolean; // Use audio files vs generated sounds
  soundType: NotificationSoundType;
  
  // Actions
  toggleSound: () => void;
  setEnabled: (enabled: boolean) => void;
  setVolume: (volume: number) => void;
  setUseSystemSound: (useSystemSound: boolean) => void;
  setSoundType: (soundType: NotificationSoundType) => void;
}

export const useNotificationSoundStore = create<NotificationSoundState>()(
  persist(
    (set) => ({
      enabled: true,
      volume: 0.5,
      useSystemSound: false, // Default to generated sounds
      soundType: 'default',
      
      toggleSound: () => set((state) => ({ enabled: !state.enabled })),
      setEnabled: (enabled) => set({ enabled }),
      setVolume: (volume) => set({ volume: Math.max(0, Math.min(1, volume)) }),
      setUseSystemSound: (useSystemSound) => set({ useSystemSound }),
      setSoundType: (soundType) => set({ soundType }),
    }),
    {
      name: 'notification-sound-settings',
    }
  )
);

