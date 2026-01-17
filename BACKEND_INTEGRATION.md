# Backend Integration Guide

## 📋 Обзор

Этот проект интегрирован с ASP.NET backend для расчета дневной нормы калорий на основе данных пользователя.

## 🔌 API Endpoints

### 1. Расчет дневных калорий
**POST** `/api/calories/calculate`

#### Request Body:
```json
{
  "activityLevel": "Lightly active",
  "gender": "male",
  "birthDate": "1990-01-15T00:00:00Z",
  "heightCm": 175.5,
  "weightKg": 75.0,
  "goalWeightKg": 70.0
}
```

#### Response:
```json
{
  "dailyCalories": 2400,
  "bmr": 1750,
  "tdee": 2400,
  "recommendedProtein": 150,
  "recommendedCarbs": 240,
  "recommendedFat": 80
}
```

### 2. Сохранение профиля пользователя
**POST** `/api/profile/save`

#### Request Body:
```json
{
  "activityLevel": "Lightly active",
  "gender": "male",
  "birthDate": "1990-01-15T00:00:00Z",
  "heightCm": 175.5,
  "weightKg": 75.0,
  "goalWeightKg": 70.0,
  "dailyCalories": 2400
}
```

## 📊 Типы данных

### OnboardingData
```typescript
interface OnboardingData {
  activityLevel: string;      // "Not very active" | "Lightly active" | "Active" | "Very active"
  gender: string;              // "male" | "female"
  birthDate: string;           // ISO format: "YYYY-MM-DDTHH:mm:ssZ"
  heightCm: number;            // Рост в сантиметрах
  weightKg: number;            // Текущий вес в килограммах
  goalWeightKg: number;        // Целевой вес в килограммах
}
```

### CalorieCalculationResponse
```typescript
interface CalorieCalculationResponse {
  dailyCalories: number;       // Рекомендуемая дневная норма калорий
  bmr?: number;                // Базовый метаболизм (опционально)
  tdee?: number;               // Общий расход энергии (опционально)
  recommendedProtein?: number; // Рекомендуемое количество белков (опционально)
  recommendedCarbs?: number;   // Рекомендуемое количество углеводов (опционально)
  recommendedFat?: number;     // Рекомендуемое количество жиров (опционально)
}
```

## 🔄 Поток данных онбординга

1. **GoalsPage** → Пользователь выбирает цели
2. **ActivityLevelPage** → Сохраняет `activityLevel` в контекст
3. **PersonalInfoPage** → Сохраняет `gender` и `birthDate` в контекст
4. **MeasurementsPage** → Сохраняет `heightCm`, `weightKg`, `goalWeightKg` (с автоконвертацией из футов/фунтов)
5. **ResultsPage** → Отправляет все данные на бэкенд и показывает результат

## ⚙️ Конфигурация

### Environment Variables
Создайте файл `.env` в корне проекта:

```env
VITE_API_URL=https://localhost:7001/api
```

### API Configuration
Файл: `src/lib/api.ts`

```typescript
const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://localhost:7001/api';
```

## 🔐 Аутентификация

API автоматически добавляет JWT токен к каждому запросу:

```typescript
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('authToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
```

## 🚀 Использование

### В компонентах

```typescript
import { useOnboarding } from '@/contexts/OnboardingContext';
import { calorieApi } from '@/lib/api';

function MyComponent() {
  const { updateOnboardingData, getCompleteData } = useOnboarding();
  
  // Обновление данных
  updateOnboardingData({
    activityLevel: 'Lightly active',
    gender: 'male'
  });
  
  // Получение полных данных
  const data = getCompleteData();
  
  // Отправка на бэкенд
  const response = await calorieApi.calculateDailyCalories(data);
}
```

## 📝 Конвертация единиц измерения

Приложение автоматически конвертирует:
- **Футы/дюймы → Сантиметры**: `(feet * 12 + inches) * 2.54`
- **Фунты → Килограммы**: `pounds * 0.453592`

## 🛠️ API Functions

### calorieApi.calculateDailyCalories()
Рассчитывает дневную норму калорий на основе данных пользователя.

```typescript
const response = await calorieApi.calculateDailyCalories({
  activityLevel: "Lightly active",
  gender: "male",
  birthDate: "1990-01-15T00:00:00Z",
  heightCm: 175.5,
  weightKg: 75.0,
  goalWeightKg: 70.0
});
```

### calorieApi.saveUserProfile()
Сохраняет профиль пользователя вместе с рассчитанными калориями.

```typescript
await calorieApi.saveUserProfile({
  ...onboardingData,
  dailyCalories: 2400
});
```

## 🎯 Пример работы

1. Пользователь проходит онбординг
2. На каждом шаге данные сохраняются в `OnboardingContext`
3. На странице `ResultsPage`:
   - Данные извлекаются из контекста
   - Отправляются на `/api/calories/calculate`
   - Получается результат с калориями
   - Профиль сохраняется через `/api/profile/save`
   - Отображается результат пользователю

## 🔍 Обработка ошибок

```typescript
try {
  const response = await calorieApi.calculateDailyCalories(data);
  setCalorieData(response);
} catch (error: any) {
  console.error('Error:', error.message);
  // error.errors содержит детали валидации от бэкенда
}
```

## 📱 Требования к Backend

Backend должен возвращать:
- **Success (200)**: `CalorieCalculationResponse`
- **Error (4xx/5xx)**: 
  ```json
  {
    "message": "Error description",
    "errors": {
      "field": ["error1", "error2"]
    }
  }
  ```

## 🧪 Тестирование

Для тестирования без бэкенда можно временно заменить функции в `calorieApi`:

```typescript
calculateDailyCalories: async (data: OnboardingData) => {
  // Mock data
  return {
    dailyCalories: 2400,
    bmr: 1750,
    tdee: 2400,
    recommendedProtein: 150,
    recommendedCarbs: 240,
    recommendedFat: 80,
  };
},
```
