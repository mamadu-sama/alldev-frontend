import axios from 'axios';
import { useAuthStore } from '@/stores/authStore';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3002/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token to requests
api.interceptors.request.use((config) => {
  const token = useAuthStore.getState().token;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle auth errors and refresh token
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Handle maintenance mode (503)
    if (error.response?.status === 503 && error.response?.data?.error?.code === 'MAINTENANCE_MODE') {
      const { useMaintenanceStore } = await import('@/stores/maintenanceStore');
      const maintenanceData = error.response.data.error;
      
      // Update maintenance store (MaintenanceWrapper will handle the UI)
      useMaintenanceStore.getState().setMaintenance(
        true,
        maintenanceData.message,
        maintenanceData.endTime
      );
      
      // Don't redirect - let MaintenanceWrapper handle it based on user roles
      return Promise.reject(error);
    }

    // If error is 401 and we haven't tried to refresh yet
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = localStorage.getItem('refreshToken');
        
        // Only try to refresh if user was authenticated
        if (refreshToken) {
          const response = await axios.post(
            `${import.meta.env.VITE_API_URL || 'http://localhost:3002/api'}/auth/refresh`,
            { refreshToken }
          );

          if (response.data.success) {
            const { accessToken, refreshToken: newRefreshToken } = response.data.data;
            
            // Update tokens
            useAuthStore.getState().setToken(accessToken);
            localStorage.setItem('refreshToken', newRefreshToken);

            // Retry original request with new token
            originalRequest.headers.Authorization = `Bearer ${accessToken}`;
            return api(originalRequest);
          }
        }
      } catch (refreshError) {
        // Refresh failed - only logout and redirect if user was authenticated
        const wasAuthenticated = useAuthStore.getState().isAuthenticated;
        if (wasAuthenticated) {
          useAuthStore.getState().logout();
          window.location.href = '/login';
        }
      }
    }

    // Don't automatically redirect on 401 - let components handle it
    // This allows unauthenticated users to browse public content

    return Promise.reject(error);
  }
);

export default api;


