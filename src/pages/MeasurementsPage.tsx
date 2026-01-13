import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Label } from '@/components/ui/label';

export default function MeasurementsPage() {
  const navigate = useNavigate();
  const [heightUnit, setHeightUnit] = useState<'ft' | 'cm'>('ft');
  const [weightUnit, setWeightUnit] = useState<'lb' | 'kg'>('lb');
  const [heightFeet, setHeightFeet] = useState<string>('');
  const [heightInches, setHeightInches] = useState<string>('');
  const [heightCm, setHeightCm] = useState<string>('');
  const [currentWeight, setCurrentWeight] = useState<string>('');
  const [goalWeight, setGoalWeight] = useState<string>('');
  const [progress] = useState(60); // Progress percentage
  const [heightError, setHeightError] = useState<boolean>(false);
  const [weightError, setWeightError] = useState<string>('');
  const [selectedGoals, setSelectedGoals] = useState<string[]>([]);

  useEffect(() => {
    const goals = localStorage.getItem('selectedGoals');
    if (goals) {
      setSelectedGoals(JSON.parse(goals));
    }
  }, []);

  const validateGoalWeight = (currentW: string, goalW: string) => {
    const current = parseFloat(currentW);
    const goal = parseFloat(goalW);
    
    if (!currentW || !goalW || isNaN(current) || isNaN(goal)) {
      setWeightError('');
      return;
    }

    if (selectedGoals.includes('Lose weight') && goal >= current) {
      setWeightError('Based on your other responses, experts recommend a goal of 2 kg or less.');
    } else if (selectedGoals.includes('Gain weight') && goal <= current) {
      setWeightError('Your goal weight should be higher than your current weight.');
    } else {
      setWeightError('');
    }
  };

  const handleCurrentWeightChange = (value: string) => {
    setCurrentWeight(value);
    if (selectedGoals.includes('Maintain weight')) {
      setGoalWeight(value);
    }
    validateGoalWeight(value, goalWeight);
  };

  const handleGoalWeightChange = (value: string) => {
    setGoalWeight(value);
    validateGoalWeight(currentWeight, value);
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
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

  const handleBack = () => {
    navigate('/personal-info');
  };

  const handleNext = () => {
    console.log('Measurements:', { heightUnit, weightUnit, heightFeet, heightInches, heightCm, currentWeight, goalWeight });
    navigate('/results');
  };

  const isValid = () => {
    if (heightUnit === 'ft') {
      return heightFeet && currentWeight && goalWeight;
    } else {
      return heightCm && currentWeight && goalWeight;
    }
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
        {/* Height Section */}
        <motion.div variants={itemVariants} className="mb-8">
          <Label className="text-2xl font-bold text-foreground mb-4 block">
            What's your height?
          </Label>
          
          {heightUnit === 'ft' ? (
            <div className="flex gap-4 mb-3">
              <div className="flex-1">
                <Input
                  type="number"
                  placeholder="Height (feet)"
                  value={heightFeet}
                  onChange={(e) => {
                    setHeightFeet(e.target.value);
                    const feet = parseFloat(e.target.value) || 0;
                    const inches = parseFloat(heightInches) || 0;
                    const totalInches = feet * 12 + inches;
                    setHeightError(e.target.value !== '' && totalInches < 26);
                  }}
                  className="text-lg py-6 px-4"
                  min="0"
                  max="8"
                />
                <span className="text-sm text-muted-foreground ml-2">ft.</span>
              </div>
              <div className="flex-1">
                <Input
                  type="number"
                  placeholder="Height (inches)"
                  value={heightInches}
                  onChange={(e) => {
                    setHeightInches(e.target.value);
                    const feet = parseFloat(heightFeet) || 0;
                    const inches = parseFloat(e.target.value) || 0;
                    const totalInches = feet * 12 + inches;
                    setHeightError((heightFeet !== '' || e.target.value !== '') && totalInches < 26);
                  }}
                  className="text-lg py-6 px-4"
                  min="0"
                  max="11"
                />
                <span className="text-sm text-muted-foreground ml-2">in.</span>
              </div>
            </div>
          ) : (
            <div className="mb-3">
              <Input
                type="number"
                placeholder="Height (cm)"
                value={heightCm}
                onChange={(e) => {
                  setHeightCm(e.target.value);
                  setHeightError(e.target.value !== '' && parseFloat(e.target.value) < 66);
                }}
                className="text-lg py-6 px-4"
                min="66"
                max="300"
              />
              <span className="text-sm text-muted-foreground ml-2">cm</span>
            </div>
          )}
          
          {heightError && (
            <p className="text-sm text-destructive mb-2">
              {heightUnit === 'ft' 
                ? 'Height must be at least 2 feet 2 inches.'
                : 'Height must be at least 66 centimeters.'}
            </p>
          )}
          
          <button
            onClick={() => setHeightUnit(heightUnit === 'ft' ? 'cm' : 'ft')}
            className="text-primary hover:underline text-sm"
          >
            Switch to {heightUnit === 'ft' ? 'centimeters' : 'feet/inches'}
          </button>
        </motion.div>

        {/* Current Weight Section */}
        <motion.div variants={itemVariants} className="mb-8">
          <Label className="text-2xl font-bold text-foreground mb-4 block">
            How much do you weigh?
          </Label>
          <p className="text-sm text-muted-foreground mb-3">
            You can enter an approximate value. You can update the value later.
          </p>
          <div className="mb-3">
            <Input
              type="number"
              placeholder={`Current weight (${weightUnit})`}
              value={currentWeight}
              onChange={(e) => handleCurrentWeightChange(e.target.value)}
              className="text-lg py-6 px-4"
              min="0"
              step="0.1"
            />
            <span className="text-sm text-muted-foreground ml-2">{weightUnit}.</span>
          </div>
          <button
            onClick={() => setWeightUnit(weightUnit === 'lb' ? 'kg' : 'lb')}
            className="text-primary hover:underline text-sm"
          >
            Switch to {weightUnit === 'lb' ? 'kilograms' : 'pounds'}
          </button>
        </motion.div>

        {/* Goal Weight Section */}
        <motion.div variants={itemVariants} className="mb-12">
          <Label className="text-2xl font-bold text-foreground mb-4 block">
            What is your goal weight?
          </Label>
          <p className="text-sm text-muted-foreground mb-3">
            Don't worry. This won't affect your daily calorie goal, and you can always change this data later.
          </p>
          <div className="mb-3">
            <Input
              type="number"
              placeholder={`Goal weight (${weightUnit})`}
              value={goalWeight}
              onChange={(e) => handleGoalWeightChange(e.target.value)}
              className="text-lg py-6 px-4"
              min="0"
              step="0.1"
            />
            <span className="text-sm text-muted-foreground ml-2">{weightUnit}.</span>
          </div>
          {weightError && (
            <p className="text-sm text-destructive">{weightError}</p>
          )}
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
            disabled={!isValid()}
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
