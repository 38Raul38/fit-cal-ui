import { authApi } from '@/lib/api';
import { getUserId, getMealsKey, getFavoritesKey } from '@/lib/utils';
import type { LoginCredentials, RegisterData, User, AuthResponse } from '@/types';

type Tokens = { accessToken: string; refreshToken: string };

// Функция для декодирования JWT и извлечения userId
const decodeJWT = (token: string): any => {
  try {
    const payload = token.split('.')[1];
    const base64 = payload.replace(/-/g, '+').replace(/_/g, '/');
    const json = decodeURIComponent(
      atob(base64)
        .split('')
        .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(json);
  } catch {
    return null;
  }
};

class AuthService {
  async register(data: RegisterData): Promise<AuthResponse> {
    const response = await authApi.post<AuthResponse>('/api/Auth/register', {
      fullName: data.name,
      email: data.email,
      password: data.password,
      confirmPassword: data.confirmPassword,
    });
    console.log('REGISTER RESPONSE', response.data);
    console.log('TOKENS', response.data.data);

    const tokens = response.data.data;
    if (tokens?.accessToken && tokens?.refreshToken) {
      this.saveAuthData(tokens, response.data.user);
      console.log('AFTER SAVE', {
        authToken: localStorage.getItem('authToken'),
        refreshToken: localStorage.getItem('refreshToken'),
        user: localStorage.getItem('user')
      });
    }

    return response.data;
  }

  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    const response = await authApi.post<AuthResponse>('/api/Auth/login', credentials);
    console.log('LOGIN RESPONSE', response.data);
    console.log('TOKENS', response.data.data);

    const tokens = response.data.data;
    if (tokens?.accessToken && tokens?.refreshToken) {
      this.saveAuthData(tokens, response.data.user);
      console.log('AFTER SAVE', {
        authToken: localStorage.getItem('authToken'),
        refreshToken: localStorage.getItem('refreshToken'),
        user: localStorage.getItem('user')
      });
    }

    return response.data;
  }

  async loginWithGoogle(credential: string): Promise<AuthResponse> {
    const response = await authApi.post<AuthResponse>('/api/Auth/google-login', { credential });
    console.log('GOOGLE LOGIN RESPONSE', response.data);
    console.log('TOKENS', response.data.data);

    const tokens = response.data.data;
    if (tokens?.accessToken && tokens?.refreshToken) {
      this.saveAuthData(tokens, response.data.user);
      console.log('AFTER SAVE', {
        authToken: localStorage.getItem('authToken'),
        refreshToken: localStorage.getItem('refreshToken'),
        user: localStorage.getItem('user')
      });
    }

    return response.data;
  }

  async logout(): Promise<void> {
    const refreshToken = localStorage.getItem('refreshToken') || '';
    const token = localStorage.getItem('authToken') || '';

    try {
      if (token && refreshToken) {
        await authApi.post(
          '/api/Auth/logout',
          { refreshToken },
          { headers: { Authorization: `Bearer ${token}` } }
        );
      }
    } finally {
      this.clearAuthData();
      sessionStorage.clear();
      window.history.pushState(null, '', '/login');
      window.location.href = '/login';
    }
  }

  async getCurrentUser(): Promise<User> {
    const response = await authApi.get<User>('/api/Auth/me');
    return response.data;
  }

  isAuthenticated(): boolean {
    return !!localStorage.getItem('authToken');
  }

  getToken(): string | null {
    return localStorage.getItem('authToken');
  }

  getRefreshToken(): string | null {
    return localStorage.getItem('refreshToken');
  }

  getUser(): User | null {
    const userStr = localStorage.getItem('user');
    if (!userStr) return null;
    try {
      return JSON.parse(userStr);
    } catch {
      return null;
    }
  }

  private saveAuthData(tokens: Tokens, user?: User): void {
    console.log('🔐 saveAuthData called with:', { hasUser: !!user, userId: (user as any)?.id });
    
    // Получаем старый userId перед перезаписью
    const oldUserId = getUserId();
    console.log('👤 Old userId:', oldUserId);
    
    localStorage.setItem('authToken', tokens.accessToken);
    localStorage.setItem('refreshToken', tokens.refreshToken);
    
    let newUserId: string | null = null;
    
    // Сначала проверяем, есть ли user от бэкенда
    if (user && (user as any).id) {
      newUserId = String((user as any).id);
      localStorage.setItem('user', JSON.stringify({ id: newUserId }));
      console.log('💾 Saved user from backend:', newUserId);
    } else {
      // Если нет - декодируем JWT и извлекаем userId
      const decoded = decodeJWT(tokens.accessToken);
      console.log('🔍 Decoded JWT:', decoded);
      
      if (decoded) {
        newUserId =
          decoded['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier'] ||
          decoded.nameid ||
          decoded.sub ||
          decoded.userId ||
          decoded.id;
        
        if (newUserId) {
          localStorage.setItem('user', JSON.stringify({ id: String(newUserId) }));
          console.log('💾 Saved userId from JWT:', newUserId);
        } else {
          console.warn('⚠️ Failed to extract userId from JWT');
        }
      }
    }
    
    // Если userId изменился - удаляем данные старого пользователя
    if (oldUserId && newUserId && oldUserId !== newUserId) {
      console.log('🔄 User changed! Cleaning old user data:', oldUserId);
      localStorage.removeItem(`fit-tracker-meals-${oldUserId}`);
      localStorage.removeItem(`fit-tracker-favorites-${oldUserId}`);
    }
  }

  private clearAuthData(): void {
    // ВАЖНО: получаем userId ДО удаления user из localStorage
    const userId = getUserId();
    console.log('🗑️ clearAuthData: userId=', userId);

    // Удаляем персональные ключи ПЕРЕД удалением user
    if (userId) {
      const mealsKey = `fit-tracker-meals-${userId}`;
      const favoritesKey = `fit-tracker-favorites-${userId}`;
      console.log('🗑️ Removing personal keys:', mealsKey, favoritesKey);
      localStorage.removeItem(mealsKey);
      localStorage.removeItem(favoritesKey);
    }

    // Удаляем старые общие fallback ключи
    localStorage.removeItem('fit-tracker-meals');
    localStorage.removeItem('fit-tracker-favorites');

    // Теперь удаляем auth данные
    localStorage.removeItem('authToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
    
    console.log('🗑️ Cleared all user data (meals, favorites)');
  }

  async refreshAccessToken(): Promise<string> {
    const refreshToken = this.getRefreshToken();
    if (!refreshToken) {
      this.clearAuthData();
      throw new Error('No refresh token available');
    }

    const response = await authApi.post<{ data: Tokens; user?: User }>(
      '/api/Auth/refresh',
      { refreshToken }
    );

    const tokens = response.data.data;
    this.saveAuthData(tokens, response.data.user);

    return tokens.accessToken;
  }
}

export const authService = new AuthService();
