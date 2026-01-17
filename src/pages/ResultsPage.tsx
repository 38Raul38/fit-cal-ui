import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Target, CheckCircle2, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card, CardContent } from '@/components/ui/Card';
import { useOnboarding } from '@/contexts/OnboardingContext';
import { calorieApi } from '@/lib/api';
import type { CalorieCalculationResponse } from '@/types';

export default function ResultsPage() {
  const navigate = useNavigate();
  const { getCompleteData, clearOnboardingData } = useOnboarding();
  const [calorieData, setCalorieData] = useState<CalorieCalculationResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    const fetchCalorieData = async () => {
      const completeData = getCompleteData();
      
      if (!completeData) {
        setError('Missing onboarding data. Please complete all steps.');
        setIsLoading(false);
        return;
      }

      try {
        const response = await calorieApi.calculateDailyCalories(completeData);
        setCalorieData(response);
        
        // Сохраняем данные пользователя в localStorage
        const userProfile = {
          weightKg: completeData.weightKg,
          heightCm: completeData.heightCm,
          birthDate: completeData.birthDate,
          gender: completeData.gender === 0 ? 'male' : 'female',
          activityLevel: completeData.activityLevel,
          goalWeightKg: completeData.goalWeightKg,
          dailyCalories: response.dailyCalories,
        };
        localStorage.setItem('userProfile', JSON.stringify(userProfile));
        
        // TODO: Сохранение профиля, когда endpoint будет готов
        // await calorieApi.saveUserProfile({
        //   ...completeData,
        //   dailyCalories: response.dailyCalories,
        // });
      } catch (err: any) {
        console.error('Error fetching calorie data:', err);
        setError(err.message || 'Failed to calculate calories. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchCalorieData();
  }, [getCompleteData]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
      },
    },
  };

  const handleContinue = () => {
    clearOnboardingData(); // Очищаем данные онбординга после завершения
    navigate('/dashboard');
  };

  const handleRetry = () => {
    navigate('/goals');
  };

  // Показываем загрузку
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4 bg-gradient-to-br from-background via-background to-muted/30">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <Loader2 className="w-16 h-16 text-primary animate-spin mx-auto mb-4" />
          <p className="text-xl text-muted-foreground">Calculating your daily calories...</p>
        </motion.div>
      </div>
    );
  }

  // Показываем ошибку
  if (error || !calorieData) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4 bg-gradient-to-br from-background via-background to-muted/30">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-md w-full text-center"
        >
          <div className="bg-destructive/10 border-2 border-destructive/50 rounded-lg p-6 mb-6">
            <p className="text-lg text-destructive font-medium mb-2">Error</p>
            <p className="text-muted-foreground">{error}</p>
          </div>
          <div className="flex gap-4 justify-center">
            <Button variant="outline" onClick={handleRetry}>
              Start Over
            </Button>
            <Button onClick={() => navigate('/dashboard')}>
              Go to Dashboard
            </Button>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-gradient-to-br from-background via-background to-muted/30">
      {/* Progress Bar - Full */}
      <div className="fixed top-0 left-0 right-0 h-2 bg-muted z-50">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: '100%' }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className="h-full bg-primary"
        />
      </div>

      <motion.div
        className="max-w-2xl w-full"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Success Icon */}
        <motion.div
          variants={itemVariants}
          className="flex justify-center mb-6"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ 
              delay: 0.3,
              type: 'spring',
              stiffness: 200,
              damping: 15
            }}
          >
            <CheckCircle2 className="w-20 h-20 text-primary" strokeWidth={1.5} />
          </motion.div>
        </motion.div>

        {/* Title */}
        <motion.div variants={itemVariants} className="text-center mb-12">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-foreground mb-3">
            Congratulations!
          </h1>
          <p className="text-lg text-muted-foreground">
            Your personalized plan is ready
          </p>
        </motion.div>

        {/* Calorie Goal Card */}
        <motion.div variants={itemVariants} className="mb-8">
          <Card className="border-2 border-primary/20 bg-gradient-to-br from-primary/5 to-transparent">
            <CardContent className="p-8 text-center">
              <div className="flex justify-center mb-4">
                <Target className="w-12 h-12 text-primary" strokeWidth={1.5} />
              </div>
              <p className="text-sm sm:text-base text-muted-foreground mb-2">
                {calorieData.planText}
              </p>
              <div className="flex items-baseline justify-center gap-2 mb-2">
                <span className="text-6xl sm:text-7xl font-bold text-foreground">
                  {Math.round(calorieData.dailyCalories).toLocaleString()}
                </span>
                <span className="text-2xl text-muted-foreground font-medium">
                  {calorieData.unitLabel}
                </span>
              </div>
              <p className="text-sm text-muted-foreground mt-2">
                Цель: {calorieData.goal}
              </p>
            </CardContent>
          </Card>
        </motion.div>

        {/* Continue Button */}
        <motion.div
          variants={itemVariants}
          className="flex justify-center"
        >
          <Button
            size="lg"
            onClick={handleContinue}
            className="w-full sm:w-auto px-16 py-7 text-lg font-semibold"
          >
            Start Your Journey
          </Button>
        </motion.div>
      </motion.div>

      {/* Decorative Background Elements */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1.5, ease: 'easeOut' }}
        className="fixed top-20 left-10 w-72 h-72 bg-primary/10 rounded-full blur-3xl -z-10"
      />
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1.5, delay: 0.3, ease: 'easeOut' }}
        className="fixed bottom-20 right-10 w-96 h-96 bg-primary/10 rounded-full blur-3xl -z-10"
      />
    </div>
  );
}
