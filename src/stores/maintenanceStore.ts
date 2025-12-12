import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface MaintenanceState {
  isMaintenanceMode: boolean;
  maintenanceMessage: string;
  estimatedEndTime: string | null;
  toggleMaintenanceMode: () => void;
  setMaintenanceMessage: (message: string) => void;
  setEstimatedEndTime: (time: string | null) => void;
}

export const useMaintenanceStore = create<MaintenanceState>()(
  persist(
    (set) => ({
      isMaintenanceMode: false,
      maintenanceMessage: 'Estamos realizando manutenção no sistema. Voltaremos em breve!',
      estimatedEndTime: null,
      toggleMaintenanceMode: () => set((state) => ({ isMaintenanceMode: !state.isMaintenanceMode })),
      setMaintenanceMessage: (message) => set({ maintenanceMessage: message }),
      setEstimatedEndTime: (time) => set({ estimatedEndTime: time }),
    }),
    {
      name: 'maintenance-storage',
    }
  )
);
