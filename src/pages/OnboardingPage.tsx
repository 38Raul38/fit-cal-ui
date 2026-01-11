import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';

export default function OnboardingPage() {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [progress] = useState(10); // Progress percentage

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

  const handleBack = () => {
    navigate('/dashboard');
  };

  const handleNext = () => {
    // Handle next step
    console.log('Name:', name);
    navigate('/goals');
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
        className="max-w-xl w-full"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Header */}
        <motion.div variants={itemVariants} className="text-center mb-8">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-foreground mb-4">
            What's your name?
          </h1>
          <p className="text-base sm:text-lg text-muted-foreground">
            We're glad you're here.
            <br />
            Let's get to know you a bit.
          </p>
        </motion.div>

        {/* Input Field */}
        <motion.div variants={itemVariants} className="mb-12">
          <Input
            type="text"
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="text-lg py-6 px-4"
          />
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
