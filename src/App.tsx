import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
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

function App() {
  return (
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
          element={
            <DashboardLayout>
              <OnboardingPage />
            </DashboardLayout>
          }
        />

        {/* Goals */}
        <Route
          path="/goals"
          element={
            <DashboardLayout>
              <GoalsPage />
            </DashboardLayout>
          }
        />

        {/* Activity Level */}
        <Route
          path="/activity-level"
          element={
            <DashboardLayout>
              <ActivityLevelPage />
            </DashboardLayout>
          }
        />

        {/* Personal Info */}
        <Route
          path="/personal-info"
          element={
            <DashboardLayout>
              <PersonalInfoPage />
            </DashboardLayout>
          }
        />

        {/* Measurements */}
        <Route
          path="/measurements"
          element={
            <DashboardLayout>
              <MeasurementsPage />
            </DashboardLayout>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;