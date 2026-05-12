import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import Button from '../components/ui/Button';

export default function NotFoundPage() {
  return (
    <div className="min-h-screen bg-gradient-radial flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center space-y-6"
      >
        <motion.div
          animate={{ y: [0, -10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="text-8xl"
        >
          🌌
        </motion.div>

        <h1 className="text-5xl font-bold font-[Orbitron] text-text-primary">404</h1>
        <p className="text-text-secondary text-lg">
          This arena doesn't exist... yet.
        </p>

        <Link to="/">
          <Button variant="primary" size="lg">
            Return to Dashboard
          </Button>
        </Link>
      </motion.div>
    </div>
  );
}
