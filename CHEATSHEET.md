# ⚡ Шпаргалка по интеграции с ASP.NET

## 🎯 Быстрый старт (3 шага)

### 1️⃣ Настройте .env
```bash
VITE_API_URL=https://localhost:7001/api
```

### 2️⃣ Создайте endpoints в ASP.NET
- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/auth/me`
- `POST /api/auth/logout`

### 3️⃣ Настройте CORS
```csharp
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowReactApp", builder =>
        builder.WithOrigins("http://localhost:5173")
               .AllowAnyMethod()
               .AllowAnyHeader()
               .AllowCredentials());
});
app.UseCors("AllowReactApp");
```

## 📦 Что уже готово

✅ Axios настроен
✅ AuthService создан
✅ Login/Register формы работают
✅ Токены сохраняются автоматически
✅ Ошибки обрабатываются
✅ ProtectedRoute компонент готов

## 💻 Использование в коде

### Login (уже работает)
```typescript
await authService.login({ email, password });
```

### Register (уже работает)
```typescript
await authService.register({ name, email, password });
```

### Проверка аутентификации
```typescript
const { user, isAuthenticated } = useAuth();
```

### Защита маршрутов
```typescript
<Route path="/dashboard" element={
  <ProtectedRoute>
    <DashboardPage />
  </ProtectedRoute>
} />
```

## 🔍 Отладка

### В браузере
1. Откройте DevTools → Network
2. Посмотрите запросы к API
3. Проверьте Headers (Authorization: Bearer ...)

### В консоли
```javascript
// Проверить токен
localStorage.getItem('authToken')

// Проверить пользователя
localStorage.getItem('user')

// Очистить данные
localStorage.clear()
```

## 📄 Формат ответов ASP.NET

### Success (Login/Register)
```json
{
  "token": "eyJhbGc...",
  "user": {
    "id": "123",
    "name": "John",
    "email": "john@example.com"
  }
}
```

### Error
```json
{
  "message": "Invalid credentials",
  "errors": {
    "email": ["Email is invalid"]
  }
}
```

## 🚨 Частые проблемы

**CORS ошибка?**
→ Проверьте CORS настройки в ASP.NET

**401 ошибка?**
→ Проверьте правильность email/password

**Network error?**
→ Проверьте что backend запущен и доступен

**Token не сохраняется?**
→ Проверьте что backend возвращает `token` в ответе

## 📚 Документация

- [QUICKSTART_RU.md](QUICKSTART_RU.md) - Быстрый старт на русском
- [API_INTEGRATION.md](API_INTEGRATION.md) - Полная документация
- [src/examples/](src/examples/) - Примеры кода

## 🔗 Полезные ссылки

- **API config**: `src/lib/api.ts`
- **Auth service**: `src/services/authService.ts`
- **useAuth hook**: `src/hooks/useAuth.ts`
- **Login form**: `src/components/forms/LoginForm.tsx`
- **Register form**: `src/components/forms/SignupForm.tsx`
- **Protected routes**: `src/components/ProtectedRoute.tsx`
