# Google OAuth Setup Guide

## 📋 Обзор
Google OAuth интегрирован в приложение для упрощения входа и регистрации пользователей.

## 🔧 Настройка Google Cloud Console

### 1. Создание проекта
1. Перейдите в [Google Cloud Console](https://console.cloud.google.com/)
2. Создайте новый проект или выберите существующий
3. Включите **Google+ API** для вашего проекта

### 2. Настройка OAuth Consent Screen
1. Перейдите в **APIs & Services** → **OAuth consent screen**
2. Выберите **External** (для тестирования) или **Internal** (для организации)
3. Заполните обязательные поля:
   - App name: `FitTracker`
   - User support email: ваш email
   - Developer contact information: ваш email
4. Добавьте тестовых пользователей (если используете External в режиме тестирования)
5. Сохраните изменения

### 3. Создание OAuth Client ID
1. Перейдите в **APIs & Services** → **Credentials**
2. Нажмите **Create Credentials** → **OAuth Client ID**
3. Выберите тип приложения: **Web application**
4. Настройте параметры:
   - **Name**: `FitTracker Web Client`
   - **Authorized JavaScript origins**:
     - `http://localhost:5173` (для разработки)
     - `http://localhost:5174` (если используете другой порт)
     - Добавьте продакшн URL когда будет готов
   - **Authorized redirect URIs** (не обязательно для Google One Tap):
     - `http://localhost:5173`
5. Нажмите **Create**
6. Скопируйте **Client ID** (формат: `xxx.apps.googleusercontent.com`)

### 4. Конфигурация приложения
1. Откройте файл `.env` в корне проекта
2. Замените `YOUR_GOOGLE_CLIENT_ID_HERE` на ваш Client ID:
   ```env
   VITE_GOOGLE_CLIENT_ID=ваш-client-id.apps.googleusercontent.com
   ```
3. Сохраните файл

## 🚀 Использование

### Для пользователей
После настройки Google Client ID пользователи могут:
1. Войти через Google на странице Login
2. Зарегистрироваться через Google на странице Register
3. Автоматически создается аккаунт при первом входе через Google

### Техническая реализация

#### Backend Requirements
Backend должен иметь endpoint для обработки Google credential:

```csharp
// POST /api/Auth/google-login
public class GoogleLoginRequest 
{
    public string Credential { get; set; }  // JWT token от Google
}

public class AuthResponse 
{
    public string Token { get; set; }       // Ваш JWT token
    public User User { get; set; }          // Данные пользователя
}
```

Backend должен:
1. Принять Google credential (JWT token)
2. Валидировать токен с помощью Google API
3. Извлечь данные пользователя (email, name, picture)
4. Создать или найти пользователя в БД
5. Вернуть собственный JWT token

#### Frontend Implementation
- **Provider**: `GoogleOAuthProvider` обернут вокруг всего приложения в `main.tsx`
- **Components**: 
  - `LoginForm.tsx` - кнопка "Sign in with Google"
  - `SignupForm.tsx` - кнопка "Sign up with Google"
- **Service**: `authService.loginWithGoogle(credential)` отправляет токен на backend

## 🔒 Безопасность

### Best Practices
1. ✅ **Никогда не коммитьте Client ID** в публичные репозитории (используйте `.env`)
2. ✅ **Валидируйте токен на backend** - не доверяйте frontend
3. ✅ **Используйте HTTPS** в продакшне
4. ✅ **Ограничьте authorized origins** только к вашим доменам
5. ✅ **Регулярно обновляйте** зависимости `@react-oauth/google`

### Что проверять на backend
```csharp
// Пример валидации Google token (C#)
var validPayload = await GoogleJsonWebSignature.ValidateAsync(credential);
var email = validPayload.Email;
var name = validPayload.Name;
var pictureUrl = validPayload.Picture;
```

## 🧪 Тестирование

### Локальная разработка
1. Убедитесь, что в `.env` указан правильный Client ID
2. Запустите dev сервер: `npm run dev`
3. Откройте `http://localhost:5173/login` или `/register`
4. Нажмите на кнопку Google Sign In
5. Выберите Google аккаунт
6. Проверьте, что происходит перенаправление на `/dashboard` или `/onboarding`

### Возможные проблемы

#### "Invalid Origin" ошибка
- Проверьте, что текущий URL добавлен в **Authorized JavaScript origins**
- URL должен совпадать точно (включая порт)

#### "Client ID not found"
- Убедитесь, что `.env` файл загружен
- Проверьте, что используете `VITE_` префикс
- Перезапустите dev сервер после изменения `.env`

#### Backend возвращает ошибку
- Проверьте network tab в DevTools
- Убедитесь, что backend endpoint `/api/Auth/google-login` существует
- Проверьте формат запроса и ответа

## 📦 Зависимости

```json
{
  "@react-oauth/google": "^0.12.1"
}
```

Установка:
```bash
npm install @react-oauth/google@latest
```

## 📚 Дополнительные ресурсы

- [Google Identity Documentation](https://developers.google.com/identity/gsi/web)
- [@react-oauth/google NPM](https://www.npmjs.com/package/@react-oauth/google)
- [Google Cloud Console](https://console.cloud.google.com/)

## 🔄 Workflow

```
User clicks "Sign in with Google"
         ↓
Google OAuth popup appears
         ↓
User selects account
         ↓
Google returns credential (JWT)
         ↓
Frontend sends credential to backend
         ↓
Backend validates with Google API
         ↓
Backend creates/finds user
         ↓
Backend returns own JWT token
         ↓
Frontend saves token & redirects
```

## ✅ Checklist

- [ ] Создан проект в Google Cloud Console
- [ ] Настроен OAuth Consent Screen
- [ ] Создан OAuth Client ID
- [ ] Добавлен `http://localhost:5173` в Authorized JavaScript origins
- [ ] Client ID добавлен в `.env` файл
- [ ] Backend endpoint `/api/Auth/google-login` готов
- [ ] Протестирован вход через Google
- [ ] Протестирована регистрация через Google
