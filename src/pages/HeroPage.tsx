import { Link, useNavigate } from 'react-router-dom';
import { Activity, TrendingUp, Zap, Target, BarChart, Users } from 'lucide-react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/Button';
import { Card, CardContent } from '@/components/ui/Card';

export default function HeroPage() {
  const navigate = useNavigate();
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

  const cardVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: (index: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        delay: index * 0.1,
        ease: 'easeOut',
      },
    }),
  };

  const features = [
    {
      icon: Activity,
      title: 'Workout Tracking',
      description: 'Log and track your workouts with ease. Monitor progress, set goals, and stay motivated.',
    },
    {
      icon: Target,
      title: 'Nutrition Tracking',
      description: 'Track your meals, calories, and macros. Get AI-powered suggestions for better nutrition.',
    },
    {
      icon: TrendingUp,
      title: 'Progress Analytics',
      description: 'Visualize your progress with detailed charts and insights. See how far you\'ve come.',
    },
    {
      icon: Zap,
      title: 'AI Recommendations',
      description: 'Get personalized workout and nutrition recommendations based on your goals and data.',
    },
    {
      icon: BarChart,
      title: 'Detailed Reports',
      description: 'Generate comprehensive reports to understand your fitness patterns and improvements.',
    },
    {
      icon: Users,
      title: 'Community Support',
      description: 'Join a community of fitness enthusiasts. Share achievements and stay motivated together.',
    },
  ];

  return (
    <>
      {/* Hero Section */}
      <section className="relative py-12 sm:py-16 md:py-24 lg:py-32 overflow-hidden">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="max-w-4xl mx-auto text-center"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <motion.div
              variants={itemVariants}
              className="inline-flex items-center px-3 sm:px-4 py-1.5 sm:py-2 rounded-full bg-secondary text-secondary-foreground mb-6 sm:mb-8"
            >
              <Zap className="h-3 w-3 sm:h-4 sm:w-4 mr-2" />
              <span className="text-xs sm:text-sm font-medium">AI-Powered Fitness Tracking</span>
            </motion.div>
            
            <motion.h1
              variants={itemVariants}
              className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-foreground mb-4 sm:mb-6"
            >
              Transform Your
              <span className="block text-primary mt-1 sm:mt-2">Fitness Journey</span>
            </motion.h1>
            
            <motion.p
              variants={itemVariants}
              className="text-base sm:text-lg md:text-xl lg:text-2xl text-muted-foreground mb-8 sm:mb-10 lg:mb-12 max-w-2xl mx-auto px-4"
            >
              Track workouts, monitor nutrition, and achieve your goals with intelligent insights and personalized recommendations.
            </motion.p>
            
            <motion.div
              variants={itemVariants}
              className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center mb-8 sm:mb-10 lg:mb-12 px-4"
            >
              <Button 
                size="lg" 
                className="w-full sm:w-auto"
                onClick={() => navigate('/register')}
              >
                Get Started Free
              </Button>
              <Button 
                size="lg" 
                variant="outline" 
                className="w-full sm:w-auto"
                onClick={() => navigate('/welcome')}
              >
                Learn More
              </Button>
            </motion.div>
            
            <motion.p variants={itemVariants} className="text-xs sm:text-sm text-muted-foreground px-4">
              No credit card required • Free forever • Cancel anytime
            </motion.p>
          </motion.div>
        </div>
        
        {/* Decorative Elements */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, ease: 'easeOut' }}
          className="absolute top-10 sm:top-20 left-5 sm:left-10 w-48 h-48 sm:w-72 sm:h-72 bg-primary/10 rounded-full blur-3xl"
        />
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 0.3, ease: 'easeOut' }}
          className="absolute bottom-10 sm:bottom-20 right-5 sm:right-10 w-64 h-64 sm:w-96 sm:h-96 bg-primary/10 rounded-full blur-3xl"
        />
      </section>

      {/* Features Section */}
      <section className="py-12 sm:py-16 lg:py-20 bg-muted/50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-10 sm:mb-12 lg:mb-16"
          >
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground mb-3 sm:mb-4 px-4">
              Everything You Need to Succeed
            </h2>
            <p className="text-sm sm:text-base lg:text-lg text-muted-foreground max-w-2xl mx-auto px-4">
              Comprehensive tools and features designed to help you reach your fitness goals faster.
            </p>
          </motion.div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                custom={index}
                variants={cardVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.2 }}
                whileHover={{ y: -8, transition: { duration: 0.3 } }}
              >
                <Card className="hover:shadow-lg transition-shadow h-full">
                  <CardContent className="pt-5 sm:pt-6 p-4 sm:p-6">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-3 sm:mb-4">
                      <feature.icon className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
                    </div>
                    <h3 className="text-lg sm:text-xl font-semibold mb-2">{feature.title}</h3>
                    <p className="text-sm sm:text-base text-muted-foreground">
                      {feature.description}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 sm:py-16 lg:py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 sm:gap-6 lg:gap-8 text-center">
            {[
              { value: '50K+', label: 'Active Users' },
              { value: '2M+', label: 'Workouts Tracked' },
              { value: '98%', label: 'Satisfaction Rate' },
            ].map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.5 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true, amount: 0.5 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="p-4"
              >
                <div className="text-4xl sm:text-5xl font-bold text-primary mb-2">{stat.value}</div>
                <div className="text-base sm:text-lg text-muted-foreground">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12 sm:py-16 lg:py-20 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-4 sm:mb-6">
              Ready to Start Your Journey?
            </h2>
            <p className="text-base sm:text-lg md:text-xl opacity-90 mb-6 sm:mb-8 max-w-2xl mx-auto">
              Join thousands of users who have transformed their lives with FitTracker.
            </p>
            <div className="flex justify-center">
              <Link to="/register" className="w-full sm:w-auto max-w-xs sm:max-w-none">
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button size="lg" variant="secondary" className="w-full sm:w-auto">
                    Get Started Today
                  </Button>
                </motion.div>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </>
  );
}
