/**
 * ПРИМЕРЫ ИСПОЛЬЗОВАНИЯ AUTH SERVICE
 * 
 * Этот файл содержит примеры использования authService в различных сценариях
 */

import { authService } from '@/services/authService';
import { useAuth } from '@/hooks/useAuth';

// ====================================
// ПРИМЕР 1: Использование в компоненте
// ====================================

function ExampleLoginComponent() {
  const handleLogin = async () => {
    try {
      const response = await authService.login({
        email: 'user@example.com',
        password: 'password123'
      });
      
      console.log('Login successful:', response.user);
      // Токен автоматически сохранен в localStorage
      // Можно перенаправить пользователя
      // navigate('/dashboard');
      
    } catch (error: any) {
      console.error('Login failed:', error.message);
      // Отобразить ошибку пользователю
    }
  };

  return <button onClick={handleLogin}>Login</button>;
}

// ====================================
// ПРИМЕР 2: Использование в компоненте регистрации
// ====================================

function ExampleRegisterComponent() {
  const handleRegister = async () => {
    try {
      const response = await authService.register({
        name: 'John Doe',
        email: 'john@example.com',
        password: 'SecurePass123'
      });
      
      console.log('Registration successful:', response.user);
      // navigate('/onboarding');
      
    } catch (error: any) {
      console.error('Registration failed:', error.message);
      // error.errors может содержать валидацию с сервера
      if (error.errors) {
        console.log('Validation errors:', error.errors);
      }
    }
  };

  return <button onClick={handleRegister}>Register</button>;
}

// ====================================
// ПРИМЕР 3: Использование хука useAuth
// ====================================

function ExampleProfileComponent() {
  const { user, isAuthenticated, isLoading, logout } = useAuth();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!isAuthenticated) {
    return <div>Please login</div>;
  }

  return (
    <div>
      <h1>Welcome, {user?.name}!</h1>
      <p>Email: {user?.email}</p>
      <button onClick={logout}>Logout</button>
    </div>
  );
}

// ====================================
// ПРИМЕР 4: Проверка аутентификации
// ====================================

function ExampleAuthCheck() {
  const checkAuth = () => {
    const isAuth = authService.isAuthenticated();
    const token = authService.getToken();
    const user = authService.getUser();

    console.log('Is authenticated:', isAuth);
    console.log('Token:', token);
    console.log('User:', user);
  };

  return <button onClick={checkAuth}>Check Auth Status</button>;
}

// ====================================
// ПРИМЕР 5: Выход из системы
// ====================================

function ExampleLogoutComponent() {
  const handleLogout = async () => {
    try {
      await authService.logout();
      console.log('Logged out successfully');
      // Данные автоматически очищены из localStorage
      // navigate('/login');
      
    } catch (error) {
      console.error('Logout error:', error);
      // Даже при ошибке данные будут очищены
    }
  };

  return <button onClick={handleLogout}>Logout</button>;
}

// ====================================
// ПРИМЕР 6: Получение текущего пользователя
// ====================================

function ExampleGetCurrentUser() {
  const fetchUser = async () => {
    try {
      const user = await authService.getCurrentUser();
      console.log('Current user:', user);
      
    } catch (error: any) {
      console.error('Failed to fetch user:', error.message);
      // Если токен истек, пользователь будет перенаправлен на /login
    }
  };

  return <button onClick={fetchUser}>Fetch Current User</button>;
}

// ====================================
// ПРИМЕР 7: Использование с React Query (опционально)
// ====================================

/*
import { useQuery, useMutation } from '@tanstack/react-query';

function ExampleWithReactQuery() {
  // Запрос текущего пользователя
  const { data: user, isLoading } = useQuery({
    queryKey: ['currentUser'],
    queryFn: () => authService.getCurrentUser(),
    enabled: authService.isAuthenticated(), // Выполнять только если аутентифицирован
  });

  // Мутация для входа
  const loginMutation = useMutation({
    mutationFn: (credentials: { email: string; password: string }) =>
      authService.login(credentials),
    onSuccess: (data) => {
      console.log('Login successful:', data);
      // queryClient.invalidateQueries(['currentUser']);
    },
    onError: (error: any) => {
      console.error('Login failed:', error.message);
    },
  });

  const handleLogin = () => {
    loginMutation.mutate({
      email: 'user@example.com',
      password: 'password123'
    });
  };

  return (
    <div>
      {isLoading && <div>Loading...</div>}
      {user && <div>Welcome, {user.name}!</div>}
      <button onClick={handleLogin} disabled={loginMutation.isPending}>
        {loginMutation.isPending ? 'Logging in...' : 'Login'}
      </button>
    </div>
  );
}
*/

// ====================================
// ПРИМЕР 8: Обработка ошибок
// ====================================

function ExampleErrorHandling() {
  const handleLoginWithErrorHandling = async () => {
    try {
      await authService.login({
        email: 'wrong@example.com',
        password: 'wrongpassword'
      });
      
    } catch (error: any) {
      // error.status содержит HTTP статус код
      // error.message содержит сообщение об ошибке
      // error.errors может содержать детали валидации
      
      if (error.status === 401) {
        console.error('Invalid credentials');
      } else if (error.status === 400) {
        console.error('Bad request:', error.errors);
      } else if (error.message.includes('Network')) {
        console.error('Network error - check connection');
      } else {
        console.error('Unknown error:', error.message);
      }
    }
  };

  return <button onClick={handleLoginWithErrorHandling}>Login with Error Handling</button>;
}

export {
  ExampleLoginComponent,
  ExampleRegisterComponent,
  ExampleProfileComponent,
  ExampleAuthCheck,
  ExampleLogoutComponent,
  ExampleGetCurrentUser,
  ExampleErrorHandling,
};
