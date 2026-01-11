import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Activity, Apple, TrendingUp } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card, CardContent } from '@/components/ui/Card';

export default function WelcomePage() {
  const navigate = useNavigate();
  const [currentStep] = useState(0);

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
        ease: 'easeOut',
      },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: (index: number) => ({
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.5,
        delay: index * 0.15,
        ease: 'easeOut',
      },
    }),
  };

  const welcomeCards = [
    {
      icon: Activity,
      title: 'Готовы к победам?',
      description: 'Начните отслеживать питание. Это так просто!',
      gradient: 'from-blue-500/20 to-cyan-500/20',
    },
    {
      icon: Apple,
      title: 'Вы узнаете, как еда и фитнес влияют на здоровье',
      description: 'Отслеживайте калории, макронутриенты и достигайте целей',
      gradient: 'from-green-500/20 to-emerald-500/20',
    },
    {
      icon: TrendingUp,
      title: 'И сформируете привычку питаться осознанно',
      description: 'Получайте персонализированные рекомендации и советы',
      gradient: 'from-purple-500/20 to-pink-500/20',
    },
  ];

  const handleNext = () => {
    navigate('/register');
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-background via-background to-muted/30">
      <motion.div
        className="max-w-5xl w-full"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Header */}
        <motion.div variants={itemVariants} className="text-center mb-12">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-foreground mb-3">
            Welcome to{' '}
            <span className="text-primary">FitTracker</span>
          </h1>
        </motion.div>

        {/* Cards Grid */}
        <motion.div
          variants={containerVariants}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12"
        >
          {welcomeCards.map((card, index) => (
            <motion.div
              key={index}
              custom={index}
              variants={cardVariants}
              whileHover={{ y: -8, transition: { duration: 0.3 } }}
            >
              <Card className={`h-full border-2 hover:border-primary/50 transition-all duration-300 bg-gradient-to-br ${card.gradient}`}>
                <CardContent className="p-6 flex flex-col items-center text-center h-full">
                  <motion.div
                    className="mb-6 p-4 rounded-full bg-background/80 backdrop-blur-sm"
                    whileHover={{ rotate: 360 }}
                    transition={{ duration: 0.6 }}
                  >
                    <card.icon className="h-12 w-12 text-primary" />
                  </motion.div>
                  
                  <h3 className="text-lg font-semibold text-foreground mb-3 min-h-[3.5rem] flex items-center">
                    {card.title}
                  </h3>
                  
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {card.description}
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        {/* Progress Dots */}
        <motion.div
          variants={itemVariants}
          className="flex justify-center gap-2 mb-8"
        >
          {[0, 1, 2].map((index) => (
            <div
              key={index}
              className={`h-2 w-2 rounded-full transition-all duration-300 ${
                index === currentStep ? 'bg-primary w-8' : 'bg-muted-foreground/30'
              }`}
            />
          ))}
        </motion.div>

        {/* Get Started Button */}
        <motion.div
          variants={itemVariants}
          className="flex justify-center"
        >
          <Button
            size="lg"
            onClick={handleNext}
            className="w-full sm:w-auto px-12 py-6 text-lg font-semibold"
          >
            Get Started
          </Button>
        </motion.div>
      </motion.div>

      {/* Decorative Background Elements */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1.2, ease: 'easeOut' }}
        className="fixed top-20 left-10 w-72 h-72 bg-primary/10 rounded-full blur-3xl -z-10"
      />
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1.2, delay: 0.3, ease: 'easeOut' }}
        className="fixed bottom-20 right-10 w-96 h-96 bg-primary/10 rounded-full blur-3xl -z-10"
      />
    </div>
  );
}
