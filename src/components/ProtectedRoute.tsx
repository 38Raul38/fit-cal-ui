import { Navigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

/**
 * Компонент для защиты маршрутов, требующих аутентификации
 * Перенаправляет неаутентифицированных пользователей на страницу входа
 */
export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { isAuthenticated, isLoading } = useAuth();

  // Показываем загрузку пока проверяем аутентификацию
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  // Редирект на login если не аутентифицирован
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Отображаем защищенный контент
  return <>{children}</>;
}
