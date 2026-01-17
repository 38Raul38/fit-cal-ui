# 🚀 Google OAuth - Быстрый Старт

## ✅ Что уже сделано

### Frontend
- ✅ Установлен пакет `@react-oauth/google`
- ✅ GoogleOAuthProvider настроен в `main.tsx`
- ✅ Кнопка "Sign in with Google" добавлена на страницу Login
- ✅ Кнопка "Sign up with Google" добавлена на страницу Register
- ✅ Метод `authService.loginWithGoogle(credential)` готов

### Файлы
- `.env` - добавлена переменная `VITE_GOOGLE_CLIENT_ID`
- `src/main.tsx` - GoogleOAuthProvider
- `src/services/authService.ts` - метод `loginWithGoogle()`
- `src/components/forms/LoginForm.tsx` - кнопка Google Sign In
- `src/components/forms/SignupForm.tsx` - кнопка Google Sign Up

## 📝 Что нужно сделать

### 1. Настроить Google Cloud Console (5-10 минут)
1. Откройте [Google Cloud Console](https://console.cloud.google.com/)
2. Создайте новый проект или выберите существующий
3. **APIs & Services** → **OAuth consent screen**:
   - Тип: External
   - App name: FitTracker
   - Ваш email в обоих полях
4. **APIs & Services** → **Credentials** → **Create Credentials** → **OAuth Client ID**:
   - Тип: Web application
   - Name: FitTracker Web
   - Authorized JavaScript origins:
     - `http://localhost:5173`
   - Authorized redirect URIs: оставьте пустым
5. Скопируйте Client ID (формат: `xxx.apps.googleusercontent.com`)

### 2. Добавить Client ID в проект
Откройте `.env` и замените:
```env
VITE_GOOGLE_CLIENT_ID=ваш-client-id.apps.googleusercontent.com
```

### 3. Настроить Backend (C#)
Установите NuGet пакет:
```bash
dotnet add package Google.Apis.Auth
```

Добавьте endpoint (см. `BACKEND_GOOGLE_AUTH_EXAMPLE.cs`):
```csharp
[HttpPost("google-login")]
public async Task<IActionResult> GoogleLogin([FromBody] GoogleLoginRequest request)
{
    var validPayload = await GoogleJsonWebSignature.ValidateAsync(request.Credential);
    var email = validPayload.Email;
    var name = validPayload.Name;
    
    // Найти или создать пользователя
    var user = await FindOrCreateUserAsync(email, name);
    var token = GenerateJwtToken(user);
    
    return Ok(new AuthResponse { Token = token, User = user });
}
```

### 4. Перезапустить приложение
```bash
npm run dev
```

## 🧪 Тестирование

1. Откройте `http://localhost:5173/login`
2. Нажмите на кнопку Google Sign In
3. Выберите Google аккаунт
4. Должен произойти вход и переход на `/dashboard`

## 🐛 Проблемы?

### "Invalid Origin"
- Добавьте `http://localhost:5173` в **Authorized JavaScript origins**
- Порт должен совпадать точно

### "Client ID not found"
- Проверьте `.env` файл
- Перезапустите `npm run dev` после изменения `.env`

### Backend ошибка 404
- Убедитесь, что endpoint `/api/Auth/google-login` существует
- Проверьте CORS настройки

### Backend ошибка 400/500
- Проверьте валидацию Google token на backend
- Посмотрите логи backend'а

## 📚 Документация

- Полная инструкция: `GOOGLE_AUTH_SETUP.md`
- Backend пример: `BACKEND_GOOGLE_AUTH_EXAMPLE.cs`
- Google Docs: https://developers.google.com/identity/gsi/web

## 🎯 Workflow

```
User → Нажимает Google Sign In
  ↓
Google → Показывает popup с выбором аккаунта
  ↓
Google → Возвращает credential (JWT)
  ↓
Frontend → Отправляет credential на backend
  ↓
Backend → Валидирует с Google API
  ↓
Backend → Создает/находит пользователя
  ↓
Backend → Возвращает свой JWT token
  ↓
Frontend → Сохраняет token и перенаправляет
```

## ✨ Готово!
После настройки Google Client ID и backend endpoint'а, авторизация через Google будет работать!
