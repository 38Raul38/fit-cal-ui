import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Target, TrendingUp, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card, CardContent } from '@/components/ui/Card';

export default function ResultsPage() {
  const navigate = useNavigate();
  
  // In a real app, this would be calculated based on user inputs
  const dailyCalories = 2400;
  const goal = 'Maintain your current weight';

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

  const handleContinue = () => {
    navigate('/dashboard');
  };

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
                Your daily calorie goal
              </p>
              <div className="flex items-baseline justify-center gap-2 mb-2">
                <span className="text-6xl sm:text-7xl font-bold text-foreground">
                  {dailyCalories.toLocaleString()}
                </span>
                <span className="text-2xl text-muted-foreground font-medium">
                  calories
                </span>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Goal Info Card */}
        <motion.div variants={itemVariants} className="mb-12">
          <Card className="border-2 border-border/50">
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <TrendingUp className="w-8 h-8 text-primary flex-shrink-0 mt-1" strokeWidth={1.5} />
                <div>
                  <p className="text-sm text-muted-foreground mb-1">
                    Based on your goals, you should:
                  </p>
                  <p className="text-xl sm:text-2xl font-semibold text-foreground">
                    {goal}
                  </p>
                </div>
              </div>
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
