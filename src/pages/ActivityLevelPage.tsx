import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/Button';

export default function ActivityLevelPage() {
  const navigate = useNavigate();
  const [selectedLevel, setSelectedLevel] = useState<string>('');
  const [progress] = useState(40); // Progress percentage

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

  const activityLevels = [
    {
      title: 'Not very active',
      description: 'Spend most of the day sitting (office worker, bank employee, etc.)',
    },
    {
      title: 'Lightly active',
      description: 'Spend most of the day on your feet (teacher, salesperson, etc.)',
    },
    {
      title: 'Active',
      description: 'Physical activity most of the day (waiter, courier, etc.)',
    },
    {
      title: 'Very active',
      description: 'Heavy physical activity most of the day (bike courier, carpenter, etc.)',
    },
  ];

  const handleLevelSelect = (level: string) => {
    setSelectedLevel(level);
  };

  const handleBack = () => {
    navigate('/goals');
  };

  const handleNext = () => {
    console.log('Selected activity level:', selectedLevel);
    navigate('/personal-info');
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
            What's your lifestyle like?
          </h1>
          <p className="text-base sm:text-lg text-muted-foreground">
            Not counting workouts—we'll track those separately
          </p>
        </motion.div>

        {/* Activity Levels Grid */}
        <motion.div
          variants={containerVariants}
          className="grid gap-4 mb-12"
        >
          {activityLevels.map((level) => (
            <motion.div
              key={level.title}
              variants={itemVariants}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <button
                onClick={() => handleLevelSelect(level.title)}
                className={`w-full py-6 px-6 rounded-lg border-2 text-left transition-all duration-200 ${
                  selectedLevel === level.title
                    ? 'border-primary bg-primary/10'
                    : 'border-border bg-background hover:border-primary/50'
                }`}
              >
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  {level.title}
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {level.description}
                </p>
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
            disabled={!selectedLevel}
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
