import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/Button';

export default function GoalsPage() {
  const navigate = useNavigate();
  const [selectedWeightGoal, setSelectedWeightGoal] = useState<string>('');
  const [selectedOtherGoals, setSelectedOtherGoals] = useState<string[]>([]);
  const [progress] = useState(20); // Progress percentage

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: 'easeOut',
      },
    },
  };

  const goals = [
    'Lose weight',
    'Maintain weight',
    'Gain weight',
    'Gain muscle',
    'Change my diet',
    'Manage stress',
    'Increase steps',
  ];

  const weightGoals = ['Lose weight', 'Maintain weight', 'Gain weight'];
  const otherGoals = ['Gain muscle', 'Change my diet', 'Manage stress', 'Increase steps'];

  const handleWeightGoalSelect = (goal: string) => {
    setSelectedWeightGoal(goal);
  };

  const handleOtherGoalToggle = (goal: string) => {
    setSelectedOtherGoals((prev) => {
      if (prev.includes(goal)) {
        return prev.filter((g) => g !== goal);
      } else if (prev.length < 2) {
        // Max 2 other goals (total 3 with weight goal)
        return [...prev, goal];
      }
      return prev;
    });
  };

  const handleBack = () => {
    navigate('/onboarding');
  };

  const handleNext = () => {
    const allSelectedGoals = [selectedWeightGoal, ...selectedOtherGoals];
    console.log('Selected goals:', allSelectedGoals);
    localStorage.setItem('selectedGoals', JSON.stringify(allSelectedGoals));
    navigate('/activity-level');
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-gradient-to-br from-background via-background to-muted/30">
      {/* Progress Bar */}
      <div className="fixed top-0 left-0 right-0 h-2 bg-muted z-50">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          className="h-full bg-primary"
        />
      </div>

      <motion.div
        className="max-w-2xl w-full"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Header */}
        <motion.div variants={itemVariants} className="text-center mb-8">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-foreground mb-4">
            Thanks! Let's move on to your goals.
          </h1>
          <p className="text-base sm:text-lg text-muted-foreground">
            Choose up to 3 goals that are important to you, including one weight goal.
          </p>
        </motion.div>

        {/* Goals Grid */}
        <motion.div
          variants={containerVariants}
          className="grid gap-4 mb-12"
        >
          {/* Weight Goals (Required - Radio Selection) */}
          {weightGoals.map((goal) => (
            <motion.div
              key={goal}
              variants={itemVariants}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <button
                onClick={() => handleWeightGoalSelect(goal)}
                className={`w-full py-4 px-6 rounded-lg border-2 text-lg font-medium transition-all duration-200 ${
                  selectedWeightGoal === goal
                    ? 'border-primary bg-primary/10 text-foreground'
                    : 'border-border bg-background text-foreground hover:border-primary/50'
                }`}
              >
                {goal}
              </button>
            </motion.div>
          ))}

          {/* Other Goals (Optional - Checkbox Selection) */}
          {otherGoals.map((goal) => (
            <motion.div
              key={goal}
              variants={itemVariants}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <button
                onClick={() => handleOtherGoalToggle(goal)}
                className={`w-full py-4 px-6 rounded-lg border-2 text-lg font-medium transition-all duration-200 ${
                  selectedOtherGoals.includes(goal)
                    ? 'border-primary bg-primary/10 text-foreground'
                    : 'border-border bg-background text-foreground hover:border-primary/50'
                }`}
              >
                {goal}
              </button>
            </motion.div>
          ))}
        </motion.div>

        {/* Buttons */}
        <motion.div
          variants={itemVariants}
          className="flex flex-col sm:flex-row gap-4 justify-center"
        >
          <Button
            variant="outline"
            size="lg"
            onClick={handleBack}
            className="w-full sm:w-auto px-12 py-6 text-lg font-semibold"
          >
            BACK
          </Button>
          <Button
            size="lg"
            onClick={handleNext}
            disabled={!selectedWeightGoal}
            className="w-full sm:w-auto px-12 py-6 text-lg font-semibold"
          >
            NEXT
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
