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
    console.log('🔐 REGISTER: Starting registration request...');
    const response = await authApi.post<AuthResponse>('/api/Auth/register', {
      fullName: data.name,
      email: data.email,
      password: data.password,
      confirmPassword: data.confirmPassword,
    });
    console.log('🔐 REGISTER FULL RESPONSE:', response);
    console.log('🔐 REGISTER RESPONSE DATA:', response.data);
    console.log('🔐 REGISTER TOKENS:', response.data.data);

    const tokens = response.data.data;
    if (tokens?.accessToken && tokens?.refreshToken) {
      console.log('✅ REGISTER: Tokens found, saving...');
      this.saveAuthData(tokens, response.data.user);
      console.log('✅ REGISTER: Saved to localStorage:', {
        authToken: localStorage.getItem('authToken'),
        refreshToken: localStorage.getItem('refreshToken'),
        user: localStorage.getItem('user')
      });
    } else {
      console.error('❌ REGISTER: No tokens in response!', {
        hasData: !!response.data.data,
        hasAccessToken: !!tokens?.accessToken,
        hasRefreshToken: !!tokens?.refreshToken
      });
    }

    return response.data;
  }

  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    console.log('🔐 LOGIN: Starting login request...');
    const response = await authApi.post<AuthResponse>('/api/Auth/login', credentials);
    console.log('🔐 LOGIN FULL RESPONSE:', response);
    console.log('🔐 LOGIN RESPONSE DATA:', response.data);
    console.log('🔐 LOGIN TOKENS:', response.data.data);

    const tokens = response.data.data;
    if (tokens?.accessToken && tokens?.refreshToken) {
      console.log('✅ LOGIN: Tokens found, saving...');
      this.saveAuthData(tokens, response.data.user);
      console.log('✅ LOGIN: Saved to localStorage:', {
        authToken: localStorage.getItem('authToken'),
        refreshToken: localStorage.getItem('refreshToken'),
        user: localStorage.getItem('user')
      });
    } else {
      console.error('❌ LOGIN: No tokens in response!', {
        hasData: !!response.data.data,
        hasAccessToken: !!tokens?.accessToken,
        hasRefreshToken: !!tokens?.refreshToken
      });
    }

    return response.data;
  }

  async loginWithGoogle(credential: string): Promise<AuthResponse> {
    console.log('🔐 GOOGLE LOGIN: Starting Google login request...');
    const response = await authApi.post<AuthResponse>('/api/Auth/google-login', { credential });
    console.log('🔐 GOOGLE LOGIN FULL RESPONSE:', response);
    console.log('🔐 GOOGLE LOGIN RESPONSE DATA:', response.data);

    // Для Google токены приходят напрямую в response.data, а не в response.data.data
    const tokens = {
      accessToken: (response.data as any).accessToken,
      refreshToken: (response.data as any).refreshToken
    };
    
    console.log('🔐 GOOGLE LOGIN TOKENS:', tokens);

    if (tokens?.accessToken && tokens?.refreshToken) {
      console.log('✅ GOOGLE LOGIN: Tokens found, saving...');
      this.saveAuthData(tokens, response.data.user);
      console.log('✅ GOOGLE LOGIN: Saved to localStorage:', {
        authToken: localStorage.getItem('authToken'),
        refreshToken: localStorage.getItem('refreshToken'),
        user: localStorage.getItem('user')
      });
    } else {
      console.error('❌ GOOGLE LOGIN: No tokens in response!', {
        hasAccessToken: !!tokens?.accessToken,
        hasRefreshToken: !!tokens?.refreshToken,
        responseData: response.data
      });
      throw new Error('No tokens received from Google login');
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
      // Сохраняем полный объект пользователя с email и name
      localStorage.setItem('user', JSON.stringify({
        id: newUserId,
        email: user.email || '',
        name: user.name || ''
      }));
      console.log('💾 Saved user from backend:', { id: newUserId, email: user.email, name: user.name });
    } else {
      // Если нет - декодируем JWT и извлекаем userId, email и name
      const decoded = decodeJWT(tokens.accessToken);
      console.log('🔍 Decoded JWT:', decoded);
      
      if (decoded) {
        newUserId =
          decoded['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier'] ||
          decoded.nameid ||
          decoded.sub ||
          decoded.userId ||
          decoded.id;
        
        // Извлекаем email и name из JWT
        const email = 
          decoded['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress'] ||
          decoded.email ||
          '';
        
        const name = 
          decoded['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name'] ||
          decoded.name ||
          decoded.unique_name ||
          '';
        
        if (newUserId) {
          localStorage.setItem('user', JSON.stringify({ 
            id: String(newUserId),
            email: email,
            name: name
          }));
          console.log('💾 Saved user from JWT:', { id: newUserId, email, name });
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

    // НЕ удаляем meals и favorites - они должны синхронизироваться с сервером
    // При следующем входе данные загрузятся с backend
    
    // Удаляем только auth данные
    localStorage.removeItem('authToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
    
    console.log('🗑️ Cleared auth data (meals remain for sync)');
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

  async changePassword(currentPassword: string, newPassword: string, confirmNewPassword: string): Promise<void> {
    const token = this.getToken();
    if (!token) {
      throw new Error('Not authenticated');
    }

    await authApi.post(
      '/api/Account/change-password',
      {
        currentPassword,
        newPassword,
        confirmNewPassword,
      },
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
  }

  async changeEmail(newEmail: string, password: string): Promise<void> {
    const token = this.getToken();
    if (!token) {
      throw new Error('Not authenticated');
    }

    const response = await authApi.post(
      '/api/Account/change-email',
      {
        newEmail,
        password,
      },
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    // Обновляем email в localStorage
    const user = this.getUser();
    if (user) {
      user.email = newEmail;
      localStorage.setItem('user', JSON.stringify(user));
    }
  }
}

export const authService = new AuthService();
