import { Link, useNavigate } from 'react-router-dom';
import { Activity } from 'lucide-react';
import { motion } from 'framer-motion';
import { Button } from './ui/Button';

export default function Navbar() {
  const navigate = useNavigate();
  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className="fixed top-0 left-0 right-0 z-50 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60"
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-14 sm:h-16 items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <motion.div
              whileHover={{ rotate: 360 }}
              transition={{ duration: 0.5 }}
            >
              <Activity className="h-6 w-6 sm:h-7 sm:w-7 text-primary" />
            </motion.div>
            <span className="text-base sm:text-lg font-bold text-foreground">FitTracker</span>
          </Link>

          {/* Auth Buttons */}
          <div className="flex items-center space-x-3">
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => navigate('/login')}
              >
                Login
              </Button>
            </motion.div>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button 
                size="sm"
                onClick={() => navigate('/register')}
              >
                Get Started
              </Button>
            </motion.div>
          </div>
        </div>
      </div>
    </motion.nav>
  );
}
