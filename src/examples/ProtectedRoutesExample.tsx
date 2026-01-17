/**
 * ПРИМЕР ИСПОЛЬЗОВАНИЯ PROTECTED ROUTES
 * 
 * Этот файл показывает как использовать ProtectedRoute для защиты маршрутов
 * Раскомментируйте код в App.tsx когда backend будет готов
 */

import { ProtectedRoute } from '@/components/ProtectedRoute';
import DashboardLayout from '@/layouts/DashboardLayout';
import DashboardPage from '@/pages/DashboardPage';

// Пример использования в Routes:

/*
<Route
  path="/dashboard"
  element={
    <ProtectedRoute>
      <DashboardLayout>
        <DashboardPage />
      </DashboardLayout>
    </ProtectedRoute>
  }
/>

<Route
  path="/daily-meals"
  element={
    <ProtectedRoute>
      <DashboardLayout>
        <DailyMealsPage />
      </DashboardLayout>
    </ProtectedRoute>
  }
/>

<Route
  path="/analytics"
  element={
    <ProtectedRoute>
      <DashboardLayout>
        <AnalyticsPage />
      </DashboardLayout>
    </ProtectedRoute>
  }
/>

<Route
  path="/settings"
  element={
    <ProtectedRoute>
      <DashboardLayout>
        <SettingsPage />
      </DashboardLayout>
    </ProtectedRoute>
  }
/>
*/

// Альтернативный вариант - обернуть весь DashboardLayout:

/*
<Route
  path="/dashboard/*"
  element={
    <ProtectedRoute>
      <DashboardLayout>
        <Routes>
          <Route index element={<DashboardPage />} />
          <Route path="meals" element={<DailyMealsPage />} />
          <Route path="analytics" element={<AnalyticsPage />} />
          <Route path="settings" element={<SettingsPage />} />
        </Routes>
      </DashboardLayout>
    </ProtectedRoute>
  }
/>
*/

export {};
