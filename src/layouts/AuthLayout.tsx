import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { Activity } from 'lucide-react';
import { motion } from 'framer-motion';

interface AuthLayoutProps {
  children: ReactNode;
}

export default function AuthLayout({ children }: AuthLayoutProps) {
  const leftVariants = {
    hidden: { opacity: 0, x: -50 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.6,
        ease: 'easeOut',
      },
    },
  };

  const rightVariants = {
    hidden: { opacity: 0, x: 50 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.6,
        ease: 'easeOut',
      },
    },
  };

  const featureVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: (index: number) => ({
      opacity: 1,
      x: 0,
      transition: {
        delay: 0.8 + index * 0.1,
        duration: 0.4,
      },
    }),
  };

  const features = [
    'Smart workout tracking and analysis',
    'AI-powered nutrition guidance',
    'Personalized fitness recommendations',
  ];

  return (
    <div className="min-h-screen flex flex-col lg:flex-row">
      {/* Left Side - Brand & Info */}
      <motion.div
        variants={leftVariants}
        initial="hidden"
        animate="visible"
        className="flex-1 bg-primary text-primary-foreground p-6 sm:p-8 lg:p-12 flex flex-col justify-between lg:min-h-screen"
      >
        <div>
          <Link to="/" className="flex items-center space-x-2 mb-6 sm:mb-8 lg:mb-12">
            <motion.div
              whileHover={{ rotate: 360 }}
              transition={{ duration: 0.5 }}
            >
              <Activity className="h-7 w-7 sm:h-8 sm:w-8 lg:h-10 lg:w-10" />
            </motion.div>
            <span className="text-xl sm:text-2xl font-bold">FitTracker</span>
          </Link>
          
          <div className="max-w-md">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.5 }}
              className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold mb-3 sm:mb-4 lg:mb-6"
            >
              Your Fitness Journey Starts Here
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.5 }}
              className="text-sm sm:text-base lg:text-lg opacity-90 mb-4 sm:mb-6 lg:mb-8"
            >
              Track workouts, monitor nutrition, and achieve your goals with AI-powered insights and personalized recommendations.
            </motion.p>
            
            <div className="space-y-2 sm:space-y-3 lg:space-y-4">
              {features.map((feature, index) => (
                <motion.div
                  key={index}
                  custom={index}
                  variants={featureVariants}
                  initial="hidden"
                  animate="visible"
                  className="flex items-start space-x-2 sm:space-x-3"
                >
                  <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-primary-foreground mt-1.5 sm:mt-2 flex-shrink-0"></div>
                  <p className="text-xs sm:text-sm lg:text-base opacity-90">
                    {feature}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
        
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.75 }}
          transition={{ delay: 1.2, duration: 0.5 }}
          className="text-xs sm:text-sm opacity-75 mt-6 sm:mt-8 lg:mt-0"
        >
          © {new Date().getFullYear()} FitTracker. All rights reserved.
        </motion.div>
      </motion.div>

      {/* Right Side - Auth Form */}
      <motion.div
        variants={rightVariants}
        initial="hidden"
        animate="visible"
        className="flex-1 bg-background flex items-center justify-center p-6 sm:p-8 lg:p-12 lg:min-h-screen"
      >
        <div className="w-full max-w-md">
          {children}
        </div>
      </motion.div>
    </div>
  );
}
