# Интеграция React Frontend с ASP.NET Backend

## Структура API интеграции

### 📁 Созданные файлы:

1. **`src/lib/api.ts`** - Axios конфигурация с interceptors
2. **`src/services/authService.ts`** - Сервис для работы с аутентификацией
3. **`src/hooks/useAuth.ts`** - React hook для управления состоянием аутентификации
4. **`.env`** - Переменные окружения для API URL

### 🔧 Конфигурация

#### 1. Настройте URL вашего ASP.NET API

Откройте `.env` файл и укажите URL вашего backend:

```env
VITE_API_URL=https://localhost:7001/api
```

> **Примечание**: Замените `https://localhost:7001/api` на актуальный URL вашего ASP.NET API

#### 2. Структура API endpoints (ASP.NET Backend)

Ваш ASP.NET backend должен иметь следующие endpoints:

##### **POST /api/auth/register**
Регистрация нового пользователя

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "SecurePassword123"
}
```

**Response (200 OK):**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "user-id-123",
    "name": "John Doe",
    "email": "john@example.com"
  },
  "expiresIn": 3600
}
```

##### **POST /api/auth/login**
Вход пользователя

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "SecurePassword123"
}
```

**Response (200 OK):**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "user-id-123",
    "name": "John Doe",
    "email": "john@example.com"
  },
  "expiresIn": 3600
}
```

##### **POST /api/auth/logout**
Выход пользователя (опционально)

**Headers:**
```
Authorization: Bearer {token}
```

##### **GET /api/auth/me**
Получение данных текущего пользователя

**Headers:**
```
Authorization: Bearer {token}
```

**Response (200 OK):**
```json
{
  "id": "user-id-123",
  "name": "John Doe",
  "email": "john@example.com"
}
```

### 🛠️ Пример ASP.NET Controller

```csharp
[ApiController]
[Route("api/[controller]")]
public class AuthController : ControllerBase
{
    [HttpPost("register")]
    public async Task<IActionResult> Register([FromBody] RegisterRequest request)
    {
        // Ваша логика регистрации
        var user = await _userService.RegisterAsync(request);
        var token = _tokenService.GenerateToken(user);
        
        return Ok(new AuthResponse
        {
            Token = token,
            User = new UserDto
            {
                Id = user.Id,
                Name = user.Name,
                Email = user.Email
            },
            ExpiresIn = 3600
        });
    }

    [HttpPost("login")]
    public async Task<IActionResult> Login([FromBody] LoginRequest request)
    {
        // Ваша логика входа
        var user = await _userService.AuthenticateAsync(request.Email, request.Password);
        if (user == null)
            return Unauthorized(new { message = "Invalid credentials" });
            
        var token = _tokenService.GenerateToken(user);
        
        return Ok(new AuthResponse
        {
            Token = token,
            User = new UserDto
            {
                Id = user.Id,
                Name = user.Name,
                Email = user.Email
            },
            ExpiresIn = 3600
        });
    }

    [Authorize]
    [HttpGet("me")]
    public async Task<IActionResult> GetCurrentUser()
    {
        var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        var user = await _userService.GetByIdAsync(userId);
        
        return Ok(new UserDto
        {
            Id = user.Id,
            Name = user.Name,
            Email = user.Email
        });
    }

    [Authorize]
    [HttpPost("logout")]
    public IActionResult Logout()
    {
        // Опциональная логика выхода (например, blacklist токена)
        return Ok(new { message = "Logged out successfully" });
    }
}
```

### 🔐 CORS Configuration (ASP.NET)

Не забудьте настроить CORS в вашем ASP.NET приложении:

```csharp
// Program.cs или Startup.cs
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowReactApp",
        builder =>
        {
            builder.WithOrigins("http://localhost:5173") // Vite dev server
                   .AllowAnyMethod()
                   .AllowAnyHeader()
                   .AllowCredentials();
        });
});

// ...

app.UseCors("AllowReactApp");
```

### 📝 Использование в компонентах React

Формы уже обновлены и используют `authService`:

```typescript
import { authService } from '@/services/authService';

// В компоненте Login
const handleSubmit = async (e: FormEvent) => {
  e.preventDefault();
  try {
    await authService.login(formData);
    navigate('/dashboard');
  } catch (error: any) {
    setApiError(error.message);
  }
};

// В компоненте Register
const handleSubmit = async (e: FormEvent) => {
  e.preventDefault();
  try {
    await authService.register({
      name: formData.name,
      email: formData.email,
      password: formData.password,
    });
    navigate('/onboarding');
  } catch (error: any) {
    setApiError(error.message);
  }
};
```

### 🎯 Использование хука useAuth

```typescript
import { useAuth } from '@/hooks/useAuth';

function SomeComponent() {
  const { user, isAuthenticated, isLoading, logout } = useAuth();

  if (isLoading) return <div>Loading...</div>;

  return (
    <div>
      {isAuthenticated ? (
        <>
          <p>Welcome, {user?.name}!</p>
          <button onClick={logout}>Logout</button>
        </>
      ) : (
        <p>Please login</p>
      )}
    </div>
  );
}
```

### 🔒 Protected Routes (рекомендуется)

Создайте компонент для защиты маршрутов:

```typescript
// src/components/ProtectedRoute.tsx
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}
```

### ✅ Что уже готово:

- ✅ Axios настроен и готов к использованию
- ✅ AuthService для работы с Login/Register
- ✅ Interceptors для автоматического добавления токенов
- ✅ Обработка ошибок и отображение в формах
- ✅ LocalStorage для сохранения токена и пользователя
- ✅ Автоматический редирект на /login при 401 ошибке

### 🚀 Следующие шаги:

1. Настройте `.env` файл с URL вашего API
2. Создайте соответствующие endpoints в ASP.NET
3. Настройте CORS в ASP.NET
4. Протестируйте регистрацию и вход
5. Добавьте Protected Routes для защищенных страниц

### 🐛 Отладка

Проверьте консоль браузера для логов запросов:
- Успешные запросы логируются
- Ошибки отображаются в UI и консоли

Проверьте Network tab в DevTools для просмотра HTTP запросов.
