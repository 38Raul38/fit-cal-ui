import { authApi } from '@/lib/api';
import type { LoginCredentials, RegisterData, User, AuthResponse } from '@/types';

class AuthService {
  /**
   * Регистрация нового пользователя
   */
  async register(data: RegisterData): Promise<AuthResponse> {
    try {
      const response = await authApi.post<AuthResponse>('/api/Auth/register', {
        fullName: data.name,  // name -> FullName
        email: data.email,
        password: data.password,
        confirmPassword: data.confirmPassword, // Используем confirmPassword из формы
      });
      
      // Сохранение токена и данных пользователя
      if (response.data.token) {
        this.saveAuthData(response.data);
      }
      
      return response.data;
    } catch (error: any) {
      throw this.handleError(error);
    }
  }

  /**
   * Вход пользователя
   */
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    try {
      const response = await authApi.post<AuthResponse>('/api/Auth/login', credentials);
      
      // Сохранение токена и данных пользователя
      if (response.data.token) {
        this.saveAuthData(response.data);
      }
      
      return response.data;
    } catch (error: any) {
      throw this.handleError(error);
    }
  }

  /**
   * Вход через Google
   */
  async loginWithGoogle(credential: string): Promise<AuthResponse> {
    try {
      const response = await authApi.post<AuthResponse>('/api/Auth/google-login', {
        credential
      });
      
      // Сохранение токена и данных пользователя
      if (response.data.token) {
        this.saveAuthData(response.data);
      }
      
      return response.data;
    } catch (error: any) {
      throw this.handleError(error);
    }
  }

  /**
   * Выход пользователя
   */
  async logout(): Promise<void> {
    try {
      await authApi.post('/api/Auth/logout');
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      this.clearAuthData();
    }
  }

  /**
   * Получение текущего пользователя
   */
  async getCurrentUser(): Promise<User> {
    try {
      const response = await authApi.get<User>('/api/Auth/me');
      return response.data;
    } catch (error: any) {
      throw this.handleError(error);
    }
  }

  /**
   * Проверка аутентификации
   */
  isAuthenticated(): boolean {
    return !!localStorage.getItem('authToken');
  }

  /**
   * Получение сохраненного токена
   */
  getToken(): string | null {
    return localStorage.getItem('authToken');
  }

  /**
   * Получение сохраненных данных пользователя
   */
  getUser(): User | null {
    const userStr = localStorage.getItem('user');
    if (!userStr) return null;
    try {
      return JSON.parse(userStr);
    } catch {
      return null;
    }
  }

  /**
   * Сохранение данных аутентификации
   */
  private saveAuthData(authData: AuthResponse): void {
    localStorage.setItem('authToken', authData.token);
    localStorage.setItem('user', JSON.stringify(authData.user));
  }

  /**
   * Очистка данных аутентификации
   */
  private clearAuthData(): void {
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
  }

  /**
   * Обработка ошибок API
   */
  private handleError(error: any): Error {
    if (error.response) {
      // Сервер вернул ошибку
      console.log('API Error Response:', error.response.data);
      
      // Извлекаем сообщение из разных возможных форматов
      let message = '';
      
      // Попытка извлечь из ValidationException
      if (typeof error.response.data === 'string') {
        const match = error.response.data.match(/ValidationException: (.+?)(\r\n|\\r\\n)/);
        if (match) {
          message = match[1];
        } else {
          message = error.response.data.split('\r\n')[0] || error.response.data;
        }
      } else {
        message = error.response.data?.message || 
                 error.response.data?.title ||
                 'An error occurred during authentication';
      }
      
      const apiError: any = new Error(message);
      apiError.status = error.response.status;
      apiError.errors = error.response.data?.errors;
      apiError.details = error.response.data;
      
      return apiError;
    } else if (error.request) {
      // Запрос был отправлен, но ответа не получено
      return new Error('Network error. Please check your connection.');
    } else {
      // Ошибка при настройке запроса
      return new Error(error.message || 'An unexpected error occurred');
    }
  }
}

export const authService = new AuthService();
