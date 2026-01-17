import { useNavigate, useLocation } from 'react-router-dom';
import { Home, BarChart3, Settings, Activity, Flame, UtensilsCrossed } from 'lucide-react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { useState, useEffect } from 'react';
import { getStreakDays } from '@/lib/mealStorage';

export default function DashboardNavbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useTranslation();
  const [streak, setStreak] = useState(0);

  useEffect(() => {
    const currentStreak = getStreakDays();
    setStreak(currentStreak);
  }, [location.pathname]); // Update when navigating

  const isActive = (path: string) => location.pathname === path;

  return (
    <>
      {/* Desktop Top Navbar */}
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className="hidden sm:block fixed top-0 left-0 right-0 z-50 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60"
      >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-14 sm:h-16 items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <motion.div
              whileHover={{ rotate: 360 }}
              transition={{ duration: 0.5 }}
            >
              <Activity className="h-6 w-6 sm:h-8 sm:w-8 text-primary" />
            </motion.div>
            <span className="text-xl sm:text-2xl font-bold">FitCal</span>
          </div>

          {/* Desktop Navigation */}
          <div className="flex items-center gap-1">
            <button
              onClick={() => navigate('/dashboard')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                isActive('/dashboard')
                  ? 'bg-primary/10 text-primary'
                  : 'text-muted-foreground hover:text-foreground hover:bg-muted'
              }`}
            >
              <Home className="h-5 w-5" />
              <span className="font-medium">{t('nav.home')}</span>
            </button>
            <button
              onClick={() => navigate('/daily-meals')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                isActive('/daily-meals')
                  ? 'bg-primary/10 text-primary'
                  : 'text-muted-foreground hover:text-foreground hover:bg-muted'
              }`}
            >
              <UtensilsCrossed className="h-5 w-5" />
              <span className="font-medium">{t('nav.meals')}</span>
            </button>
            <button
              onClick={() => navigate('/analytics')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                isActive('/analytics')
                  ? 'bg-primary/10 text-primary'
                  : 'text-muted-foreground hover:text-foreground hover:bg-muted'
              }`}
            >
              <BarChart3 className="h-5 w-5" />
              <span className="font-medium">{t('nav.analytics')}</span>
            </button>
            <button
              onClick={() => navigate('/settings')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                isActive('/settings')
                  ? 'bg-primary/10 text-primary'
                  : 'text-muted-foreground hover:text-foreground hover:bg-muted'
              }`}
            >
              <Settings className="h-5 w-5" />
              <span className="font-medium">{t('nav.settings')}</span>
            </button>
          </div>

          {/* Streak Counter */}
          <div className="flex items-center gap-2 px-3 py-1.5 bg-orange-500/10 rounded-full">
            <Flame className="h-4 w-4 text-orange-500" />
            <span className="text-sm font-semibold">{streak}</span>
          </div>
        </div>
      </div>
      </motion.nav>

      {/* Mobile Bottom Navigation */}
      <nav className="sm:hidden fixed bottom-0 left-0 right-0 z-50 bg-background border-t border-border pb-safe">
        <div className="flex items-center justify-around px-4 py-3">
          <button
            onClick={() => navigate('/dashboard')}
            className="flex flex-col items-center gap-1 min-w-[60px]"
          >
            <Home
              className={`h-6 w-6 ${
                isActive('/dashboard') ? 'text-foreground' : 'text-muted-foreground'
              }`}
            />
            <span
              className={`text-xs ${
                isActive('/dashboard') ? 'text-foreground font-medium' : 'text-muted-foreground'
              }`}
            >
              {t('nav.home')}
            </span>
          </button>
          <button
            onClick={() => navigate('/daily-meals')}
            className="flex flex-col items-center gap-1 min-w-[60px]"
          >
            <UtensilsCrossed
              className={`h-6 w-6 ${
                isActive('/daily-meals') ? 'text-foreground' : 'text-muted-foreground'
              }`}
            />
            <span
              className={`text-xs ${
                isActive('/daily-meals') ? 'text-foreground font-medium' : 'text-muted-foreground'
              }`}
            >
              {t('nav.meals')}
            </span>
          </button>
          <button
            onClick={() => navigate('/analytics')}
            className="flex flex-col items-center gap-1 min-w-[60px]"
          >
            <BarChart3
              className={`h-6 w-6 ${
                isActive('/analytics') ? 'text-foreground' : 'text-muted-foreground'
              }`}
            />
            <span
              className={`text-xs ${
                isActive('/analytics') ? 'text-foreground font-medium' : 'text-muted-foreground'
              }`}
            >
              {t('nav.analytics')}
            </span>
          </button>
          <button
            onClick={() => navigate('/settings')}
            className="flex flex-col items-center gap-1 min-w-[60px]"
          >
            <Settings
              className={`h-6 w-6 ${
                isActive('/settings') ? 'text-foreground' : 'text-muted-foreground'
              }`}
            />
            <span
              className={`text-xs ${
                isActive('/settings') ? 'text-foreground font-medium' : 'text-muted-foreground'
              }`}
            >
              {t('nav.settings')}
            </span>
          </button>
        </div>
      </nav>
    </>
  );
}
