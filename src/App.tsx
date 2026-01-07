import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import MainLayout from '@/layouts/MainLayout';
import AuthLayout from '@/layouts/AuthLayout';
import HeroPage from '@/pages/HeroPage';
import LoginPage from '@/pages/LoginPage';
import RegisterPage from '@/pages/RegisterPage';

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
            <MainLayout>
              <div className="container mx-auto px-4 py-20 text-center">
                <h1 className="text-4xl font-bold mb-4">Dashboard</h1>
                <p className="text-muted-foreground">Welcome to your fitness dashboard!</p>
              </div>
            </MainLayout>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
