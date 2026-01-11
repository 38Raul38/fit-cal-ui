import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Label } from '@/components/ui/label';

export default function PersonalInfoPage() {
  const navigate = useNavigate();
  const [gender, setGender] = useState<string>('');
  const [birthdate, setBirthdate] = useState<string>('');
  const [country, setCountry] = useState<string>('');
  const [progress] = useState(50); // Progress percentage

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
    navigate('/activity-level');
  };

  const handleNext = () => {
    console.log('Gender:', gender, 'Birthdate:', birthdate, 'Country:', country);
    navigate('/measurements');
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
        <motion.div variants={itemVariants} className="mb-8">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-foreground mb-4">
            Please select the gender we should use when calculating your calorie needs.
          </h1>
        </motion.div>

        {/* Gender Selection */}
        <motion.div variants={itemVariants} className="mb-8">
          <div className="flex gap-6">
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="radio"
                name="gender"
                value="male"
                checked={gender === 'male'}
                onChange={(e) => setGender(e.target.value)}
                className="w-5 h-5 accent-primary cursor-pointer"
              />
              <span className="text-lg text-foreground">Male</span>
            </label>
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="radio"
                name="gender"
                value="female"
                checked={gender === 'female'}
                onChange={(e) => setGender(e.target.value)}
                className="w-5 h-5 accent-primary cursor-pointer"
              />
              <span className="text-lg text-foreground">Female</span>
            </label>
          </div>
          <a href="#" className="inline-flex items-center gap-2 mt-4 text-primary hover:underline">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
            Which should I choose?
          </a>
        </motion.div>

        {/* Birthdate */}
        <motion.div variants={itemVariants} className="mb-8">
          <Label className="text-lg font-semibold text-foreground mb-3 block">
            When were you born?
          </Label>
          <input
            type="date"
            value={birthdate}
            onChange={(e) => setBirthdate(e.target.value)}
            max={new Date().toISOString().split('T')[0]}
            className="w-full text-lg py-6 px-4 rounded-lg border-2 border-border bg-background text-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
          />
        </motion.div>

        {/* Country */}
        <motion.div variants={itemVariants} className="mb-8">
          <Label className="text-lg font-semibold text-foreground mb-3 block">
            Where do you live?
          </Label>
          <select
            value={country}
            onChange={(e) => setCountry(e.target.value)}
            className="w-full text-lg py-6 px-4 rounded-lg border-2 border-border bg-background text-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
          >
            <option value="">Select country</option>
            <option value="us">United States</option>
            <option value="uk">United Kingdom</option>
            <option value="ca">Canada</option>
            <option value="au">Australia</option>
            <option value="de">Germany</option>
            <option value="fr">France</option>
            <option value="es">Spain</option>
            <option value="it">Italy</option>
            <option value="nl">Netherlands</option>
            <option value="be">Belgium</option>
            <option value="se">Sweden</option>
            <option value="no">Norway</option>
            <option value="dk">Denmark</option>
            <option value="fi">Finland</option>
            <option value="pl">Poland</option>
            <option value="cz">Czech Republic</option>
            <option value="at">Austria</option>
            <option value="ch">Switzerland</option>
            <option value="pt">Portugal</option>
            <option value="gr">Greece</option>
            <option value="jp">Japan</option>
            <option value="kr">South Korea</option>
            <option value="cn">China</option>
            <option value="in">India</option>
            <option value="br">Brazil</option>
            <option value="mx">Mexico</option>
            <option value="ar">Argentina</option>
            <option value="za">South Africa</option>
            <option value="nz">New Zealand</option>
            <option value="sg">Singapore</option>
            <option value="my">Malaysia</option>
            <option value="th">Thailand</option>
            <option value="id">Indonesia</option>
            <option value="ph">Philippines</option>
            <option value="vn">Vietnam</option>
            <option value="tr">Turkey</option>
            <option value="ru">Russia</option>
            <option value="ua">Ukraine</option>
            <option value="eg">Egypt</option>
            <option value="sa">Saudi Arabia</option>
            <option value="ae">United Arab Emirates</option>
            <option value="il">Israel</option>
            <option value="other">Other</option>
          </select>
        </motion.div>

        {/* Info Text */}
        <motion.div variants={itemVariants} className="mb-12">
          <p className="text-center text-sm text-muted-foreground">
            We use this information to accurately calculate your calorie goal.
          </p>
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
            disabled={!gender || !birthdate || !country}
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
