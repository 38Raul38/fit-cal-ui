import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { OnboardingProvider } from '@/contexts/OnboardingContext';
import MainLayout from '@/layouts/MainLayout';
import AuthLayout from '@/layouts/AuthLayout';
import DashboardLayout from '@/layouts/DashboardLayout';
import HeroPage from '@/pages/HeroPage';
import WelcomePage from '@/pages/WelcomePage';
import LoginPage from '@/pages/LoginPage';
import RegisterPage from '@/pages/RegisterPage';
import DashboardPage from '@/pages/DashboardPage';
import OnboardingPage from '@/pages/OnboardingPage';
import GoalsPage from '@/pages/GoalsPage';
import ActivityLevelPage from '@/pages/ActivityLevelPage';
import PersonalInfoPage from '@/pages/PersonalInfoPage';
import MeasurementsPage from '@/pages/MeasurementsPage';
import ResultsPage from '@/pages/ResultsPage';
import DailyMealsPage from '@/pages/DailyMealsPage';
import AnalyticsPage from '@/pages/AnalyticsPage';
import SettingsPage from '@/pages/SettingsPage';

function App() {
  return (
    <OnboardingProvider>
      <Router>
        <Routes>
        {/* Main Layout Routes */}
        <Route
          path="/"
          element={
            <MainLayout>
              <HeroPage />
            </MainLayout>
          }
        />

        {/* Welcome Page */}
        <Route
          path="/welcome"
          element={
            <MainLayout>
              <WelcomePage />
            </MainLayout>
          }
        />

        {/* Auth Layout Routes */}
        <Route
          path="/login"
          element={
            <AuthLayout>
              <LoginPage />
            </AuthLayout>
          }
        />
        <Route
          path="/register"
          element={
            <AuthLayout>
              <RegisterPage />
            </AuthLayout>
          }
        />

        {/* Placeholder for Dashboard */}
        <Route
          path="/dashboard"
          element={
            <DashboardLayout>
              <DashboardPage />
            </DashboardLayout>
          }
        />

        {/* Onboarding */}
        <Route
          path="/onboarding"
          element={<OnboardingPage />}
        />

        {/* Goals */}
        <Route
          path="/goals"
          element={<GoalsPage />}
        />

        {/* Activity Level */}
        <Route
          path="/activity-level"
          element={<ActivityLevelPage />}
        />

        {/* Personal Info */}
        <Route
          path="/personal-info"
          element={<PersonalInfoPage />}
        />

        {/* Measurements */}
        <Route
          path="/measurements"
          element={<MeasurementsPage />}
        />

        {/* Results */}
        <Route
          path="/results"
          element={<ResultsPage />}
        />

        {/* Daily Meals */}
        <Route
          path="/daily-meals"
          element={
            <DashboardLayout>
              <DailyMealsPage />
            </DashboardLayout>
          }
        />

        {/* Analytics */}
        <Route
          path="/analytics"
          element={
            <DashboardLayout>
              <AnalyticsPage />
            </DashboardLayout>
          }
        />

        {/* Settings */}
        <Route
          path="/settings"
          element={
            <DashboardLayout>
              <SettingsPage />
            </DashboardLayout>
          }
        />
      </Routes>
    </Router>
    </OnboardingProvider>
  );
}

export default App;