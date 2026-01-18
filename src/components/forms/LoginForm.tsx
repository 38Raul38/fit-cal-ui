import { useState } from 'react';
import type { FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff } from 'lucide-react';
import { motion } from 'framer-motion';
import { GoogleLogin } from '@react-oauth/google';
import type { CredentialResponse } from '@react-oauth/google';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import type { LoginCredentials } from '@/types';
import { authService } from '@/services/authService';

export default function LoginForm() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState<LoginCredentials>({
    email: '',
    password: '',
  });
  const [errors, setErrors] = useState<Partial<LoginCredentials>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState<string>('');

  const validateForm = (): boolean => {
    const newErrors: Partial<LoginCredentials> = {};

    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsLoading(true);
    setApiError('');
    
    try {
      await authService.login(formData);
      // Успешный вход - перенаправление на dashboard
      navigate('/dashboard');
    } catch (error: any) {
      console.error('Login error:', error);
      setApiError(error.message || 'Failed to login. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (field: keyof LoginCredentials, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const handleGoogleSuccess = async (credentialResponse: CredentialResponse) => {
    if (!credentialResponse.credential) {
      setApiError('Failed to get Google credentials');
      return;
    }

    setIsLoading(true);
    setApiError('');
    
    try {
      await authService.loginWithGoogle(credentialResponse.credential);
      navigate('/dashboard');
    } catch (error: any) {
      console.error('Google login error:', error);
      setApiError(error.message || 'Failed to login with Google. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleError = () => {
    setApiError('Google login failed. Please try again.');
  };

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.4 },
    },
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-6 sm:space-y-8"
    >
      <motion.div variants={itemVariants} className="text-center md:text-left">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground mb-2">Welcome Back</h1>
        <p className="text-muted-foreground text-sm sm:text-base">
          Sign in to your account to continue your fitness journey
        </p>
      </motion.div>

      <motion.form variants={itemVariants} onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
        <div className="space-y-2">
          <label htmlFor="email" className="block text-sm font-medium text-foreground">
            Email Address
          </label>
          <Input
            id="email"
            type="email"
            placeholder="john@example.com"
            value={formData.email}
            onChange={(e) => handleInputChange('email', e.target.value)}
            aria-invalid={!!errors.email}
            disabled={isLoading}
          />
          {errors.email && (
            <motion.p
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-xs sm:text-sm text-destructive mt-1"
            >
              {errors.email}
            </motion.p>
          )}
        </div>

        <div className="space-y-2">
          <label htmlFor="password" className="block text-sm font-medium text-foreground">
            Password
          </label>
          <div className="relative">
            <Input
              id="password"
              type={showPassword ? 'text' : 'password'}
              placeholder="Enter your password"
              value={formData.password}
              onChange={(e) => handleInputChange('password', e.target.value)}
              aria-invalid={!!errors.password}
              disabled={isLoading}
              className="pr-10"
            />
            <motion.button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
              tabIndex={-1}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </motion.button>
          </div>
          {errors.password && (
            <motion.p
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-xs sm:text-sm text-destructive mt-1"
            >
              {errors.password}
            </motion.p>
          )}
        </div>

        {/* API Error Message */}
        {apiError && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-3 rounded-lg bg-destructive/10 border border-destructive/20"
          >
            <p className="text-sm text-destructive">{apiError}</p>
          </motion.div>
        )}

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-0 text-sm">
          <label className="flex items-center space-x-2 cursor-pointer">
            <input
              type="checkbox"
              className="w-4 h-4 rounded border-border text-primary focus:ring-primary"
            />
            <span className="text-muted-foreground text-sm">Remember me</span>
          </label>
          <Link
            to="/forgot-password"
            className="text-primary hover:underline font-medium text-sm"
          >
            Forgot password?
          </Link>
        </div>

        <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
          <Button
            type="submit"
            className="w-full"
            size="lg"
            disabled={isLoading}
          >
            {isLoading ? 'Signing in...' : 'Sign In'}
          </Button>
        </motion.div>
      </motion.form>

      {import.meta.env.VITE_GOOGLE_CLIENT_ID && (
        <>
          <motion.div variants={itemVariants} className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-border"></div>
            </div>
            <div className="relative flex justify-center text-xs">
              <span className="px-4 bg-background text-muted-foreground">Or continue with</span>
            </div>
          </motion.div>

          <motion.div variants={itemVariants} className="flex justify-center">
            <GoogleLogin
              onSuccess={handleGoogleSuccess}
              onError={handleGoogleError}
              theme="outline"
              size="large"
              text="signin_with"
            />
          </motion.div>
        </>
      )}

      <motion.div variants={itemVariants} className="text-center text-sm text-muted-foreground">
        Don't have an account?{' '}
        <Link to="/register" className="text-primary font-medium hover:underline">
          Sign up
        </Link>
      </motion.div>
    </motion.div>
  );
}
