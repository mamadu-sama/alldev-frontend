import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Notification } from '@/types';

interface AdminNotification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'warning' | 'success' | 'error';
  targetAudience: 'all' | 'admins' | 'moderators' | 'users';
  sentAt: string;
  sentBy: string;
  readBy: string[];
}

interface AdminNotificationState {
  sentNotifications: AdminNotification[];
  userNotifications: Notification[];
  addSentNotification: (notification: Omit<AdminNotification, 'id' | 'sentAt' | 'readBy'>) => void;
  addUserNotification: (notification: Omit<Notification, 'id' | 'createdAt'>) => void;
  markAsRead: (notificationId: string) => void;
  markAllAsRead: () => void;
  clearUserNotifications: () => void;
}

export const useAdminNotificationStore = create<AdminNotificationState>()(
  persist(
    (set) => ({
      sentNotifications: [],
      userNotifications: [],
      addSentNotification: (notification) =>
        set((state) => ({
          sentNotifications: [
            {
              ...notification,
              id: `admin-notif-${Date.now()}`,
              sentAt: new Date().toISOString(),
              readBy: [],
            },
            ...state.sentNotifications,
          ],
        })),
      addUserNotification: (notification) =>
        set((state) => ({
          userNotifications: [
            {
              ...notification,
              id: `user-notif-${Date.now()}`,
              createdAt: new Date().toISOString(),
            },
            ...state.userNotifications,
          ],
        })),
      markAsRead: (notificationId) =>
        set((state) => ({
          userNotifications: state.userNotifications.map((n) =>
            n.id === notificationId ? { ...n, read: true } : n
          ),
        })),
      markAllAsRead: () =>
        set((state) => ({
          userNotifications: state.userNotifications.map((n) => ({ ...n, read: true })),
        })),
      clearUserNotifications: () => set({ userNotifications: [] }),
    }),
    {
      name: 'admin-notifications-storage',
    }
  )
);
