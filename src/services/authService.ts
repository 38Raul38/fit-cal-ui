import { authApi } from '@/lib/api';
import type { LoginCredentials, RegisterData, User, AuthResponse } from '@/types';

class AuthService {
  async register(data: RegisterData): Promise<AuthResponse> {
    try {
      const response = await authApi.post<AuthResponse>('/api/Auth/register', {
        fullName: data.name,
        email: data.email,
        password: data.password,
        confirmPassword: data.confirmPassword,
      });
      
      if (response.data.token && response.data.refreshToken) {
        this.saveAuthData(response.data);
      }
      
      return response.data;
    } catch (error: any) {
      throw this.handleError(error);
    }
  }

  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    try {
      const response = await authApi.post<AuthResponse>('/api/Auth/login', credentials);
      
      if (response.data.token && response.data.refreshToken) {
        this.saveAuthData(response.data);
      }
      
      return response.data;
    } catch (error: any) {
      throw this.handleError(error);
    }
  }

  async loginWithGoogle(credential: string): Promise<AuthResponse> {
    try {
      const response = await authApi.post<AuthResponse>('/api/Auth/google-login', {
        credential
      });
      
      if (response.data.token && response.data.refreshToken) {
        this.saveAuthData(response.data);
      }
      
      return response.data;
    } catch (error: any) {
      throw this.handleError(error);
    }
  }

  async logout(): Promise<void> {
    const refreshToken = localStorage.getItem('refreshToken') || '';
    const token = localStorage.getItem('authToken') || '';
    
    try {
      if (token && refreshToken) {
        await authApi.post('/api/Auth/logout', 
          { refreshToken },
          {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          }
        );
      }
    } catch (error) {
    } finally {
      this.clearAuthData();
    }
  }

  async getCurrentUser(): Promise<User> {
    try {
      const response = await authApi.get<User>('/api/Auth/me');
      return response.data;
    } catch (error: any) {
      throw this.handleError(error);
    }
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

  private saveAuthData(authData: AuthResponse): void {
    localStorage.setItem('authToken', authData.token);
    
    if (authData.refreshToken) {
      localStorage.setItem('refreshToken', authData.refreshToken);
    }
    
    if (authData.user) {
      localStorage.setItem('user', JSON.stringify(authData.user));
    }
  }

  private clearAuthData(): void {
    const user = this.getUser();
    const userId = user?.id;
    
    localStorage.removeItem('authToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
    
    if (userId) {
      localStorage.removeItem(`fit-tracker-meals-${userId}`);
    }
  }

  async refreshAccessToken(): Promise<string> {
    try {
      const refreshToken = this.getRefreshToken();
      
      if (!refreshToken) {
        throw new Error('No refresh token available');
      }
      
      const response = await authApi.post<{ token: string }>('/api/Auth/refresh', {
        refreshToken
      });
      
      localStorage.setItem('authToken', response.data.token);
      
      return response.data.token;
    } catch (error: any) {
      this.clearAuthData();
      throw this.handleError(error);
    }
  }

  private handleError(error: any): Error {
    if (error.response) {
      let message = '';
      
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
      return new Error('Network error. Please check your connection.');
    } else {
      return new Error(error.message || 'An unexpected error occurred');
    }
  }
}

export const authService = new AuthService();