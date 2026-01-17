# 🚀 Быстрый старт: Интеграция с ASP.NET Backend

## Что сделано:

✅ **Axios установлен и настроен** ([src/lib/api.ts](src/lib/api.ts))
✅ **AuthService создан** ([src/services/authService.ts](src/services/authService.ts))
✅ **Login/Register формы обновлены** с интеграцией API
✅ **useAuth hook** для управления аутентификацией ([src/hooks/useAuth.ts](src/hooks/useAuth.ts))
✅ **ProtectedRoute компонент** для защиты маршрутов ([src/components/ProtectedRoute.tsx](src/components/ProtectedRoute.tsx))

## 📋 Что нужно сделать на вашей стороне:

### 1. Настройте URL вашего API

Откройте файл `.env` и укажите URL вашего ASP.NET API:

```env
VITE_API_URL=https://localhost:7001/api
```

### 2. Создайте endpoints в ASP.NET

Ваш backend должен иметь следующие endpoints:

#### **POST /api/auth/register**
```json
// Request
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "SecurePass123"
}

// Response
{
  "token": "jwt-token-here",
  "user": {
    "id": "user-id",
    "name": "John Doe",
    "email": "john@example.com"
  }
}
```

#### **POST /api/auth/login**
```json
// Request
{
  "email": "john@example.com",
  "password": "SecurePass123"
}

// Response
{
  "token": "jwt-token-here",
  "user": {
    "id": "user-id",
    "name": "John Doe",
    "email": "john@example.com"
  }
}
```

#### **GET /api/auth/me** (с Bearer токеном)
```json
// Response
{
  "id": "user-id",
  "name": "John Doe",
  "email": "john@example.com"
}
```

### 3. Настройте CORS в ASP.NET

```csharp
// Program.cs
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowReactApp", builder =>
    {
        builder.WithOrigins("http://localhost:5173")
               .AllowAnyMethod()
               .AllowAnyHeader()
               .AllowCredentials();
    });
});

app.UseCors("AllowReactApp");
```

### 4. Пример ASP.NET Controller

Смотрите подробный пример в [API_INTEGRATION.md](API_INTEGRATION.md)

## 🎯 Как использовать в коде:

### В формах (уже готово):
```typescript
import { authService } from '@/services/authService';

// Логин
await authService.login({ email, password });

// Регистрация
await authService.register({ name, email, password });

// Выход
await authService.logout();
```

### Защита маршрутов:
```typescript
import { ProtectedRoute } from '@/components/ProtectedRoute';

<Route path="/dashboard" element={
  <ProtectedRoute>
    <DashboardPage />
  </ProtectedRoute>
} />
```

### Использование хука:
```typescript
import { useAuth } from '@/hooks/useAuth';

const { user, isAuthenticated, logout } = useAuth();
```

## ⚙️ Что работает автоматически:

- 🔑 Токен автоматически добавляется к каждому запросу
- 💾 Токен и пользователь сохраняются в localStorage
- 🔄 При ошибке 401 автоматический редирект на /login
- ❌ Обработка и отображение ошибок в формах

## 🧪 Тестирование:

1. Запустите ваш ASP.NET backend
2. Проверьте что CORS настроен
3. Запустите React app: `npm run dev`
4. Попробуйте зарегистрироваться
5. Попробуйте войти

## 📚 Дополнительная информация:

Подробная документация: [API_INTEGRATION.md](API_INTEGRATION.md)
