import axios from 'axios';
import type { OnboardingData, CalorieCalculationResponse, UserProfile } from '@/types';

// Настройка базовых URL для ваших ASP.NET backend проектов
const AUTH_API_URL = import.meta.env.VITE_AUTH_API_URL || 'http://localhost:5161';
const FITCAL_API_URL = import.meta.env.VITE_FITCAL_API_URL || 'http://localhost:5210';

// Auth API instance (для регистрации и логина)
export const authApi = axios.create({
  baseURL: AUTH_API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

// FitCal API instance (для калорий и других функций)
export const api = axios.create({
  baseURL: FITCAL_API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

// Общая функция очистки auth данных
const clearAuth = () => {
  console.log('🧹 clearAuth called', new Error().stack);
  localStorage.removeItem('authToken');
  localStorage.removeItem('refreshToken');
  localStorage.removeItem('user');
};

// Проверка, является ли endpoint аутентификационным
const isAuthEndpoint = (url?: string) =>
  !!url && (url.includes('/api/Auth/login') || url.includes('/api/Auth/register') || url.includes('/api/Auth/refresh'));

// Interceptor для добавления токена к Auth запросам
authApi.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor для обработки ответов Auth API
authApi.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;
    const url = error.config?.url;

    if (status === 401 && !isAuthEndpoint(url)) {
      console.log('Auth API: 401 detected, clearing auth data');
      clearAuth();
      window.location.href = '/login';
    }

    return Promise.reject(error);
  }
);

// Interceptor для добавления токена к FitCal запросам
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor для обработки ответов FitCal API
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;
    if (status === 401) {
      console.log('FitCal API: 401 detected, clearing auth data');
      clearAuth();
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// API функции для расчета калорий
export const calorieApi = {
  calculateDailyCalories: async (data: OnboardingData): Promise<CalorieCalculationResponse> => {
    try {
      const response = await api.post<CalorieCalculationResponse>('/api/CalorieCalculator/calculate', data);
      return response.data;
    } catch (error: any) {
      console.error('Error calculating calories:', error);
      throw {
        message: error.response?.data?.message || 'Failed to calculate calories',
        errors: error.response?.data?.errors,
      };
    }
  },
  
  saveUserProfile: async (data: OnboardingData & { dailyCalories: number }): Promise<void> => {
    try {
      await api.post('/api/profile/save', data);
    } catch (error: any) {
      console.error('Error saving profile:', error);
      throw {
        message: error.response?.data?.message || 'Failed to save profile',
        errors: error.response?.data?.errors,
      };
    }
  },
};

// API функции для профиля пользователя
export const profileApi = {
  getProfile: async (): Promise<UserProfile | null> => {
    try {
      console.log('🔍 Fetching profile from API...');
      const response = await api.get<UserProfile>('/api/Profile');
      console.log('✅ Profile loaded from API:', response.data);
      return response.data;
    } catch (error: any) {
      if (error.response?.status === 404) {
        console.log('⚠️ Profile not found (404), user needs to complete onboarding');
        return null;
      }
      console.error('❌ Error fetching profile:', error.response?.data || error.message);
      throw {
        message: error.response?.data?.message || 'Failed to fetch profile',
        errors: error.response?.data?.errors,
      };
    }
  },

  saveProfile: async (data: Partial<UserProfile>): Promise<void> => {
    try {
      console.log('💾 Saving profile to API:', data);
      await api.post('/api/Profile/save', data);
      console.log('✅ Profile saved successfully');
    } catch (error: any) {
      console.error('❌ Error saving profile:', error.response?.data || error.message);
      throw {
        message: error.response?.data?.message || 'Failed to save profile',
        errors: error.response?.data?.errors,
      };
    }
  },
};

export default api;
